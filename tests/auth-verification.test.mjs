import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const user = { id: 7, full_name: 'New Student', email: 'student@example.test', role: 'STUDENT' };

function service(responses) {
  const calls = [];
  const exports = {};
  const apiClient = {
    isUsingMock: () => false,
    post: async (path, body) => { calls.push({ path, body }); return responses.shift(); },
    get: async path => { calls.push({ path }); return responses.shift(); },
  };
  const code = ts.transpileModule(fs.readFileSync('src/services/auth-service.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => {
    if (name === './api-client') return { apiClient };
    if (name === './user-adapter') return { toUser: u => ({ id: String(u.id), email: u.email, name: u.full_name, role: 'student' }) };
    return {};
  } });
  return { auth: exports.authService, calls };
}

test('live registration requires activation and never automatically calls login', async () => {
  const h = service([{ status: 201, data: user, errors: null }]);
  const result = await h.auth.register({ fullName: user.full_name, email: user.email, password: 'correct-horse' });
  assert.equal(result.data.requiresVerification, true);
  assert.equal(result.data.token, '');
  assert.equal(result.data.user.email, user.email);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].path, '/auth/register');
});

test('pending login returns the account email without loading a protected profile', async () => {
  const h = service([{ status: 403, code: 'EMAIL_VERIFICATION_REQUIRED', data: { user }, errors: { requiresVerification: ['Verify'] } }]);
  const result = await h.auth.login({ identifier: '20260007', password: 'correct-horse' });
  assert.equal(result.data.requiresVerification, true);
  assert.equal(result.data.user.email, user.email);
  assert.equal(result.data.token, '');
  assert.equal(h.calls.length, 1);
});

test('verification succeeds without creating a session and failed registration stays failed', async () => {
  const h = service([{ status: 200, data: { verified: true }, errors: null }]);
  const result = await h.auth.verifyEmailAndLogin(user.email, '123456');
  assert.equal(result.data, null);
  assert.equal(h.calls[0].path, '/auth/verify-email');
  const failed = service([{ status: 503, data: null, errors: { http: ['503'] } }]);
  const response = await failed.auth.register({ fullName: user.full_name, email: user.email, password: 'correct-horse' });
  assert.equal(response.status, 503);
  assert.equal(response.data, null);
  assert.equal(failed.calls.length, 1);
});
