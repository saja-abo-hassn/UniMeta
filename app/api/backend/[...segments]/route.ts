import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";

const COOKIE_NAME = "unimeta_session";
const DEFAULT_UPSTREAM_TIMEOUT_MS = 12_000;
const AI_UPSTREAM_TIMEOUT_MS = 65_000;

function errorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  const cause = error.cause;
  if (!cause || typeof cause !== "object" || !("code" in cause)) return undefined;
  return typeof cause.code === "string" ? cause.code : undefined;
}

function makeUpstreamSignal(request: NextRequest, timeoutMs: number): AbortSignal {
  if (typeof AbortSignal === "undefined" || typeof AbortSignal.timeout !== "function") return request.signal;
  const timeout = AbortSignal.timeout(timeoutMs);
  return typeof AbortSignal.any === "function"
    ? AbortSignal.any([request.signal, timeout])
    : timeout;
}

async function proxy(request: NextRequest, context: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await context.params;
  const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: "API URL is not configured.", errors: null }, { status: 503 });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    const requestHost = request.headers.get("host")?.toLowerCase();
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
    const requestProtocol = forwardedProtocol
      ? `${forwardedProtocol}:`
      : request.nextUrl.protocol;
    let isSameOrigin = false;
    try {
      const originUrl = new URL(origin || "");
      isSameOrigin = Boolean(
        requestHost &&
        originUrl.host.toLowerCase() === requestHost &&
        originUrl.protocol === requestProtocol
      );
    } catch {
      isSameOrigin = false;
    }
    if (!isSameOrigin) {
      return NextResponse.json({ message: "Origin check failed.", errors: null }, { status: 403 });
    }
  }

  const path = segments.map((segment) => encodeURIComponent(segment)).join("/");
  const timeoutMs = path.startsWith("ai/") ? AI_UPSTREAM_TIMEOUT_MS : DEFAULT_UPSTREAM_TIMEOUT_MS;
  const upstreamUrl = `${apiUrl.replace(/\/$/, "")}/${path}${request.nextUrl.search}`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  const headers = new Headers({ Accept: "application/json" });
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage);
  const bffSecret = process.env.BFF_SHARED_SECRET;
  if (bffSecret && bffSecret.length >= 32) {
    headers.set("X-BFF-Secret", bffSecret);
    // Vercel overwrites this header at its edge. Do not trust it on arbitrary hosts.
    const clientIp = process.env.VERCEL === "1" ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() : undefined;
    if (clientIp && isIP(clientIp)) headers.set("X-BFF-Client-IP", clientIp);
  }
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
    let upstream: Response | undefined;
    let lastNetworkError: unknown;
    const attempts = request.method === "GET" ? 2 : 1;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        upstream = await fetch(upstreamUrl, {
          method: request.method,
          headers,
          body,
          signal: makeUpstreamSignal(request, timeoutMs),
          cache: "no-store",
        });
        if (request.method === "GET" && attempt === 0 && [502, 503, 504].includes(upstream.status)) {
          console.warn("[backend-proxy] retrying transient upstream status", { method: request.method, path, status: upstream.status });
          await upstream.body?.cancel();
          upstream = undefined;
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        break;
      } catch (error) {
        lastNetworkError = error;
        const timedOut = error instanceof Error && error.name === "TimeoutError";
        console.error("[backend-proxy] upstream fetch failed", {
          method: request.method,
          path,
          attempt: attempt + 1,
          timedOut,
          errorName: error instanceof Error ? error.name : "UnknownError",
          causeCode: errorCode(error),
        });
        if (attempt + 1 >= attempts || request.signal.aborted) throw error;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    if (!upstream) throw lastNetworkError ?? new Error("Upstream request did not produce a response.");
    const type = upstream.headers.get("content-type") || "application/json";
    const authPath = segments.join("/");
    if (upstream.status === 204) {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set("Cache-Control", "no-store");
      if (authPath === "auth/logout") response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
      return response;
    }
    if (upstream.ok && !type.includes("application/json")) {
      const response = new NextResponse(upstream.body, { status: upstream.status });
      for (const name of ["content-type", "content-disposition", "content-length", "x-content-type-options", "content-security-policy"]) {
        const value = upstream.headers.get(name);
        if (value) response.headers.set(name, value);
      }
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
    let payload: unknown;
    if (type.includes("application/json")) {
      const rawPayload = await upstream.text();
      if (rawPayload.trim()) {
        try {
          payload = JSON.parse(rawPayload);
        } catch {
          return NextResponse.json(
            { message: "أعاد الخادم استجابة غير صالحة.", errors: { response: ["Invalid JSON"] } },
            { status: 502 }
          );
        }
      } else {
        payload = null;
      }
    } else {
      if (upstream.ok && upstream.headers.get("content-disposition")) {
        const download = new NextResponse(upstream.body, { status: upstream.status });
        download.headers.set("Content-Type", type);
        download.headers.set("Content-Disposition", upstream.headers.get("content-disposition")!);
        download.headers.set("Cache-Control", "private, no-store");
        return download;
      }
      payload = { message: "أعاد الخادم نوع استجابة غير متوقع.", errors: null };
    }

    const setsSession = ["auth/login", "auth/verify-email"].includes(authPath);
    let tokenToSet: string | null = null;
    if (upstream.ok && setsSession && payload && typeof payload === "object") {
      const envelope = payload as { data?: Record<string, unknown> };
      const token = envelope.data?.token ?? envelope.data?.access_token;
      if (typeof token === "string" && token) {
        tokenToSet = token;
        envelope.data = { ...envelope.data, token: "http-only-cookie", access_token: undefined };
      }
    }
    const response = upstream.status === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(payload, { status: upstream.status });
    for (const name of ["retry-after", "x-ratelimit-limit", "x-ratelimit-remaining", "x-ratelimit-reset"]) {
      const value = upstream.headers.get(name);
      if (value) response.headers.set(name, value);
    }
    response.headers.set("Cache-Control", "no-store");
    if (tokenToSet) {
      response.cookies.set(COOKIE_NAME, tokenToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    if (authPath === "auth/logout" || (upstream.status === 401 && !setsSession)) {
      response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
    }
    return response;
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    const response = NextResponse.json(
      {
        message: timedOut ? "تأخر رد الخادم. حاول مجدداً بعد قليل." : "تعذر الوصول إلى خادم الـ API حالياً.",
        errors: { network: [timedOut ? "انتهت مهلة الاتصال بخادم الـ API" : "تعذر الاتصال بالخادم"] },
        code: timedOut ? "UPSTREAM_TIMEOUT" : "UPSTREAM_UNREACHABLE",
      },
      { status: timedOut ? 504 : 502 }
    );
    if (segments.join("/") === "auth/logout") {
      response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
