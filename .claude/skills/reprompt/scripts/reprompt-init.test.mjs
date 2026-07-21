import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { slugify, initRun, FILE_NAMES, TARGETS } from './reprompt-init.mjs';

test('slugify는 공백을 하이픈으로 바꾸고 한글을 유지한다', () => {
  assert.equal(slugify('콜드 아웃리치 이메일'), '콜드-아웃리치-이메일');
});

test('slugify는 파일시스템 금지 문자를 제거하고 연속 하이픈을 축약한다', () => {
  assert.equal(slugify('a/b:  c?*d'), 'a-b-c-d');
});

test('slugify는 양끝 하이픈을 제거하고 소문자화한다', () => {
  assert.equal(slugify('  Hello World  '), 'hello-world');
});

test('slugify는 60자로 자른다', () => {
  assert.ok(slugify('가'.repeat(100)).length <= 60);
});

test('slugify는 빈 문자열이면 throw한다', () => {
  assert.throws(() => slugify('   '), /비어 있지 않은/);
});

test('initRun은 폴더와 meta.json을 만들고 경로를 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const r = initRun({
    task: '콜드 아웃리치 이메일',
    target: 'general',
    dnaVersion: 'v1.14',
    createdAt: '2026-07-21T09:00:00Z',
    dateStr: '2026-07-21',
    outBase: dir,
  });
  assert.ok(r.runDir.endsWith('2026-07-21-콜드-아웃리치-이메일'));
  assert.ok(existsSync(r.metaPath));
  const meta = JSON.parse(readFileSync(r.metaPath, 'utf8'));
  assert.equal(meta.task, '콜드 아웃리치 이메일');
  assert.equal(meta.target, 'general');
  assert.equal(meta.dna_version, 'v1.14');
  assert.deepEqual(meta.files, [...FILE_NAMES, 'meta.json']);
  rmSync(dir, { recursive: true, force: true });
});

test('initRun은 잘못된 target이면 throw한다', () => {
  assert.throws(
    () => initRun({ task: 'x', target: 'nope', dateStr: '2026-07-21' }),
    /target/,
  );
});

test('initRun은 잘못된 dateStr이면 throw한다', () => {
  assert.throws(
    () => initRun({ task: 'x', target: 'general', dateStr: '2026/07/21' }),
    /YYYY-MM-DD/,
  );
});

test('initRun은 입력 객체를 변형하지 않는다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const opts = { task: 'x', target: 'general', dateStr: '2026-07-21', outBase: dir };
  const snapshot = JSON.stringify(opts);
  initRun(opts);
  assert.equal(JSON.stringify(opts), snapshot);
  rmSync(dir, { recursive: true, force: true });
});

test('TARGETS는 4종 타깃을 담는다', () => {
  assert.deepEqual(TARGETS, ['general', 'coding', 'image', 'research']);
});
