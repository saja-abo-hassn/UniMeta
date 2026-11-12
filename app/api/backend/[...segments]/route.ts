import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "unimeta_session";
async function proxy(request: NextRequest, context: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await context.params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: "API URL is not configured.", errors: null }, { status: 503 });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== request.nextUrl.origin) {
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
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: "no-store",
    });
    const type = upstream.headers.get("content-type") || "application/json";
    let payload: unknown;
    if (type.includes("application/json")) {
      payload = await upstream.json();
    } else {
      payload = { message: "Unexpected API response type.", errors: null };
    }

    const authPath = segments.join("/");
    const setsSession = ["login", "register", "verify-email"].includes(authPath);
    let tokenToSet: string | null = null;
    if (upstream.ok && setsSession && payload && typeof payload === "object") {
      const envelope = payload as { data?: Record<string, unknown> };
      const token = envelope.data?.token ?? envelope.data?.access_token;
      if (typeof token === "string" && token) {
        tokenToSet = token;
        envelope.data = { ...envelope.data, token: "http-only-cookie" };
      }
    }
    const response = NextResponse.json(payload, { status: upstream.status });
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
    if (segments.join("/") === "logout" || upstream.status === 401) {
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
