import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function service() {
  const exports = {};
  const calls = [];
  const responses = {
    '/library/subjects': [
      { id: 1, subject_name: 'رياضيات', subject_code: 'MATH100', major: { id: 2, name: 'هندسة' }, description: null, file_count: 0 },
      { id: 2, subject_name: 'برمجة', subject_code: 'CS100', major: { id: 3, name: 'حوسبة' }, description: null, file_count: 1 },
    ],
    '/library/subjects/1/resources': [],
    '/library/subjects/2/resources': [
      { id: 9, subject_id: 2, title: 'مقدمة البرمجة', description: null, resource_type: 'SUMMARY', file_size: 1024, mime_type: 'application/pdf', created_at: '2026-01-01' },
    ],
  };
  const apiClient = {
    isUsingMock: () => false,
    all: async (path) => { calls.push(path); return { data: responses[path] ?? [], errors: null }; },
    createSuccessResponse: (data) => ({ data, errors: null }),
    createErrorResponse: (message, errors) => ({ data: null, message, errors }),
  };
  const code = ts.transpileModule(fs.readFileSync('src/services/materials-service.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => name === './api-client' ? { apiClient } : { requireData: (response) => {
      if (response.errors || response.data === null) throw new Error(response.message);
      return response.data;
    } },
  });
  return { api: exports.materialsService, calls };
}

test('student library catalog includes all subjects, including subjects with no visible resources', async () => {
  const h = service();
  const response = await h.api.getLibraryCatalog();
  assert.equal(response.data.subjects.length, 2);
  assert.equal(response.data.subjects[0].file_count, 0);
  assert.equal(response.data.materials.length, 1);
  assert.equal(response.data.materials[0].courseCode, 'CS100');
  assert.deepEqual(h.calls, ['/library/subjects', '/library/subjects/1/resources', '/library/subjects/2/resources']);
});
