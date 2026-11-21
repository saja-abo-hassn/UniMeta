import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadService(filename, apiClient) {
  const exports = {};
  const source = fs.readFileSync(`src/services/${filename}.ts`, "utf8");
  const options = { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } };
  const dependencies = {
    "./api-client": { apiClient, API_CONFIG: { maxUploadMb: 20 } },
    "./api-result": {
      requireData(response) {
        if (response.errors || response.data == null) throw new Error(response.message);
        return response.data;
      },
    },
  };
  vm.runInNewContext(ts.transpileModule(source, options).outputText, {
    FormData, exports, require: (name) => dependencies[name],
  });
  return exports;
}

test("library writes send the real subject ID and file, and keep moderation separate from visibility", async () => {
  const calls = [];
  const { libraryService } = loadService("library-service", {
    async upload(path, form) {
      calls.push([path, Object.fromEntries(form)]);
      return { data: { id: 12 } };
    },
    async patch(path, body) {
      calls.push([path, body]);
      return { data: { id: 12 } };
    },
    async delete(path) {
      calls.push([path]);
      return { status: 204 };
    },
  });
  const file = new File(["test"], "notes.pdf", { type: "application/pdf" });
  const fields = { subject_id: 15, title: "Notes", resource_type: "SUMMARY" };
  await libraryService.contribute(fields, file);
  await libraryService.review("12", "APPROVED", "Reviewed");
  await libraryService.createResource({ ...fields, visibility_status: "HIDDEN" }, file);
  await libraryService.updateResource("12", { visibility_status: "VISIBLE" });
  await libraryService.deleteResource("12");

  assert.equal(calls[0][0], "/library/contributions");
  assert.equal(calls[0][1].subject_id, "15");
  assert.equal(calls[0][1].file, file);
  assert.ok(!("visibility_status" in calls[0][1]));
  assert.equal(calls[1][0], "/admin/library/contributions/12/review");
  assert.equal(calls[1][1].reason, "Reviewed");
  assert.equal(calls[2][1].visibility_status, "HIDDEN");
  assert.equal(calls[3][0], "/admin/library/resources/12");
  assert.equal(calls[3][1].visibility_status, "VISIBLE");
  assert.equal(calls[4][0], "/admin/library/resources/12");
});

test("marketplace uses offer IDs for new requests and request IDs for owner actions", async () => {
  const calls = [];
  const { marketplaceService } = loadService("marketplace-service", {
    async post(path, body) {
      calls.push([path, body]);
      return { data: { id: 44 } };
    },
  });
  await marketplaceService.request("17", "Is it available?");
  await marketplaceService.respond("44", "accept", { return_due_date: "2027-01-10" });
  await marketplaceService.respond("55", "withdraw");
  assert.deepEqual(calls.map(([path]) => path), [
    "/marketplace/offers/17/requests",
    "/marketplace-requests/44/accept",
    "/marketplace-requests/55/withdraw",
  ]);
  assert.equal(calls[0][1].message, "Is it available?");
  assert.equal(calls[1][1].return_due_date, "2027-01-10");
});
