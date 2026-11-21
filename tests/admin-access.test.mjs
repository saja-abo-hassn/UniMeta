import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadAccess() {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('src/lib/admin-access.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}

test('only the profile discriminator grants admin permissions', () => {
  const { canAccessAdmin } = loadAccess();
  assert.equal(canAccessAdmin('super_admin', null, 'manage_content'), true);
  assert.equal(canAccessAdmin('moderator', { manage_content: true }, 'manage_content'), true);
  assert.equal(canAccessAdmin('moderator', { manage_content: false }, 'manage_content'), false);
  assert.equal(canAccessAdmin(null, { manage_content: true }, 'manage_content'), false);
});

test('permissions normalize to all five contract keys and default missing keys to false', () => {
  const { normalizePermissions } = loadAccess();
  assert.deepEqual({ ...normalizePermissions({ manage_content: true }) }, {
    manage_content: true,
    manage_agreements: false,
    manage_reports: false,
    manage_members: false,
    view_sensitive: false,
  });
});
