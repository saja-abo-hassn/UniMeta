import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadRoute(upstreamResponse, token = null) {
  const exports = {};
  const cookieWrites = [];
  class NextResponse extends Response {
    cookies = { set: (...args) => cookieWrites.push(args) };
    static json(body, init) {
      const headers = new Headers(init?.headers);
      headers.set("content-type", "application/json");
      return new NextResponse(JSON.stringify(body), { ...init, headers });
    }
  }
  const source = fs.readFileSync("app/api/backend/[...segments]/route.ts", "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Headers,
    Response,
    URL,
    process: { env: { NEXT_PUBLIC_API_URL: "https://api.example.test/api/v1", NODE_ENV: "production" } },
    require(name) {
      if (name === "node:net") return { isIP: (value) => ["127.0.0.1", "::1"].includes(value) ? 4 : 0 };
      if (name === "next/headers") return { cookies: async () => ({ get: () => token ? { value: token } : undefined }) };
      if (name === "next/server") return { NextResponse };
      throw new Error(`Unexpected import ${name}`);
    },
    fetch: async () => upstreamResponse,
  });
  return { handlers: exports, cookieWrites };
}

function request(method = "GET") {
  return {
    method,
    nextUrl: new URL("https://frontend.example.test/api/backend/ai/assistant"),
    headers: new Headers({
      origin: "https://frontend.example.test",
      host: "frontend.example.test",
      "x-forwarded-proto": "https",
      "content-type": "application/json",
    }),
    signal: new AbortController().signal,
    arrayBuffer: async () => new TextEncoder().encode("{}").buffer,
  };
}

const context = (...segments) => ({ params: Promise.resolve({ segments }) });

test("BFF passes an empty 200 JSON response through for the AI service to reject", async () => {
  const { handlers } = loadRoute(new Response(null, { status: 200, headers: { "content-type": "application/json" } }));
  const response = await handlers.POST(request("POST"), context("ai", "assistant"));

  assert.equal(response.status, 200);
  assert.equal(await response.json(), null);
});

test("BFF supports empty 204 responses without trying to serialize a body", async () => {
  const { handlers } = loadRoute(new Response(null, { status: 204 }));
  const response = await handlers.POST(request("POST"), context("auth", "logout"));

  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

test("BFF stores a login token in an HttpOnly cookie and returns only a sentinel", async () => {
  const { handlers, cookieWrites } = loadRoute(Response.json({ data: { token: "backend-secret", user: { id: 2 } } }));
  const response = await handlers.POST(request("POST"), context("auth", "login"));
  const payload = await response.json();

  assert.equal(payload.data.token, "http-only-cookie");
  assert.equal(cookieWrites[0][1], "backend-secret");
  assert.equal(cookieWrites[0][2].httpOnly, true);
});
