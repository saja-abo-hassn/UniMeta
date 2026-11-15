import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "unimeta_session";
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
  const upstreamUrl = `${apiUrl.replace(/\/$/, "")}/${path}${request.nextUrl.search}`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAME)?.value;
  const headers = new Headers({ Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      signal: request.signal,
      cache: "no-store",
    });
    const type = upstream.headers.get("content-type") || "application/json";
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

    const authPath = segments.join("/");
    const setsSession = authPath === "auth/login";
    let tokenToSet: string | null = null;
    if (upstream.ok && setsSession && payload && typeof payload === "object") {
      const envelope = payload as { data?: Record<string, unknown> };
      const token = envelope.data?.token ?? envelope.data?.access_token;
      if (typeof token === "string" && token) {
        tokenToSet = token;
        envelope.data = { ...envelope.data, token: "http-only-cookie" };
      }
    }
    const response = upstream.status === 204
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(payload, { status: upstream.status });
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
    if (segments.join("/") === "auth/logout" || upstream.status === 401) {
      response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
    }
    return response;
  } catch {
    return NextResponse.json(
      { message: "تعذر الاتصال بخادم الـ API.", errors: { network: ["تعذر الاتصال بالخادم"] } },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
