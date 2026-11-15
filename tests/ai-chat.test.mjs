import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadService(apiClient) {
  const exports = {};
  const source = fs.readFileSync("src/services/ai-chat-service.ts", "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => name === "./api-client" ? { apiClient } : {},
    Date,
  });
  return exports.aiChatService;
}

test("AI chat sends bounded bilingual history to the live assistant and returns its answer", async () => {
  const calls = [];
  const chat = loadService({
    isUsingMock: () => false,
    post: async (path, body) => {
      calls.push({ path, body });
      return {
        status: 200,
        data: { answer: "إجابة من الخادم", sources: [{ id: "S1", title: "Guide", url: "/guide" }] },
        errors: null,
      };
    },
  });
  const history = [
    { sender: "system", text: "private system prompt" },
    ...Array.from({ length: 10 }, (_, i) => ({ sender: i % 2 ? "assistant" : "user", text: "x".repeat(2100) })),
  ];

  const result = await chat.sendMessage("كيف أبدأ؟", history);

  assert.equal(calls[0].path, "/ai/assistant");
  assert.equal(calls[0].body.message, "كيف أبدأ؟");
  assert.equal(calls[0].body.history.length, 8);
  assert.ok(calls[0].body.history.every((item) => item.content.length === 2000));
  assert.equal(result.text, "إجابة من الخادم");
  assert.equal(result.sources[0].id, "S1");
});

test("AI chat rejects empty replies and never fabricates an answer", async () => {
  const chat = loadService({
    isUsingMock: () => false,
    post: async () => ({ status: 200, data: null, errors: null }),
  });

  await assert.rejects(chat.sendMessage("Hello"), /رد فارغ/);
});

test("AI chat reports provider errors and does not call the backend in mock mode", async () => {
  const failed = loadService({
    isUsingMock: () => false,
    post: async () => ({ status: 503, data: null, errors: { provider: ["Unavailable"] }, message: "Provider unavailable" }),
  });
  await assert.rejects(failed.sendMessage("Hello"), /Provider unavailable/);

  let called = false;
  const mock = loadService({
    isUsingMock: () => true,
    post: async () => { called = true; return {}; },
  });
  await assert.rejects(mock.sendMessage("Hello"), /وضع العرض التجريبي/);
  assert.equal(called, false);
});
