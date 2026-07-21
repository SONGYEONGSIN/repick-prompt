import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readVersion, bumpVersion, writeVersion } from './release-version.mjs';

function tmpPlugin(obj) {
  const dir = mkdtempSync(join(tmpdir(), 'relver-'));
  const p = join(dir, 'plugin.json');
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  return { dir, p };
}

test('readVersion은 plugin.json의 version을 읽는다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0' });
  assert.equal(readVersion(p), '1.0.0');
  rmSync(dir, { recursive: true, force: true });
});

test('bumpVersion은 version만 바꾼 새 객체를 반환하고 입력을 변형하지 않는다', () => {
  const orig = { name: 'reprompt', version: '1.0.0', keywords: ['x'] };
  const snap = JSON.stringify(orig);
  const next = bumpVersion(orig, '1.1.0');
  assert.equal(next.version, '1.1.0');
  assert.equal(next.name, 'reprompt');
  assert.deepEqual(next.keywords, ['x']);
  assert.equal(JSON.stringify(orig), snap);
});

test('bumpVersion은 잘못된 semver면 throw한다', () => {
  assert.throws(() => bumpVersion({ version: '1.0.0' }, 'v1.2'), /semver/);
  assert.throws(() => bumpVersion({ version: '1.0.0' }, '1.2'), /semver/);
});

test('bumpVersion은 객체가 아니면 throw한다', () => {
  assert.throws(() => bumpVersion(null, '1.0.0'), /객체/);
});

test('writeVersion은 version을 갱신하고 다른 필드를 보존한다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0', description: 'd' });
  writeVersion(p, '2.0.0');
  const back = JSON.parse(readFileSync(p, 'utf8'));
  assert.equal(back.version, '2.0.0');
  assert.equal(back.name, 'reprompt');
  assert.equal(back.description, 'd');
  rmSync(dir, { recursive: true, force: true });
});

test('writeVersion은 끝에 개행을 남긴다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0' });
  writeVersion(p, '1.0.1');
  assert.ok(readFileSync(p, 'utf8').endsWith('}\n'));
  rmSync(dir, { recursive: true, force: true });
});
