import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "unimeta_mock_session";

function checkOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ message: "Origin check failed.", errors: null }, { status: 403 });
  }
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  if (typeof body?.token !== "string" || !body.token) {
    return NextResponse.json({ message: "Invalid mock session.", errors: null }, { status: 422 });
  }
  const response = NextResponse.json({ data: { authenticated: true }, message: "Session saved." });
  response.cookies.set(COOKIE_NAME, body.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ message: "Origin check failed.", errors: null }, { status: 403 });
  }
  const response = NextResponse.json({ data: null, message: "Session cleared." });
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
