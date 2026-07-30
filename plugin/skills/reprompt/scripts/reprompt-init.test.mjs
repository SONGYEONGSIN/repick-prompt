import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { slugify, initRun, appendUsage, FILE_NAMES, TARGETS } from './reprompt-init.mjs';

/**
 * initRun의 usage 로그 기본값은 ~/.reprompt/usage.jsonl (머신 전역)이다.
 * 테스트가 그걸 그대로 쓰면 사용자의 실제 기록을 쓰레기로 오염시키고,
 * 나중에 그 로그를 집계하는 기능이 가짜 데이터를 학습한다.
 * usage를 검사하지 않는 테스트는 반드시 이 헬퍼로 호출한다 — 잊어도 밀폐된다.
 */
const initRunT = (opts) => initRun({ usageLog: false, ...opts });

/** 임시 루트 + 그 안의 usage 로그 경로. */
function usageFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  return { dir, logPath: join(dir, 'home', '.reprompt', 'usage.jsonl') };
}

const readLines = (p) => readFileSync(p, 'utf8').trim().split('\n');

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

test('slugify는 금지문자만 있으면 throw한다', () => {
  assert.throws(() => slugify('///'), /비었/);
});

test('initRun은 폴더와 meta.json을 만들고 경로를 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const r = initRunT({
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
  initRunT(opts);
  assert.equal(JSON.stringify(opts), snapshot);
  rmSync(dir, { recursive: true, force: true });
});

test('appendUsage는 JSONL 한 줄을 붙이고 없는 디렉토리를 만든다', () => {
  const { dir, logPath } = usageFixture();
  appendUsage({ task: '콜드 이메일', target: 'general' }, logPath);
  assert.deepStrictEqual(JSON.parse(readLines(logPath)[0]), {
    task: '콜드 이메일',
    target: 'general',
  });
  rmSync(dir, { recursive: true, force: true });
});

test('appendUsage는 기존 기록을 덮어쓰지 않는다 (append-only)', () => {
  const { dir, logPath } = usageFixture();
  appendUsage({ task: '첫째' }, logPath);
  appendUsage({ task: '둘째' }, logPath);
  const lines = readLines(logPath);
  assert.equal(lines.length, 2);
  assert.deepStrictEqual(lines.map((l) => JSON.parse(l).task), ['첫째', '둘째']);
  rmSync(dir, { recursive: true, force: true });
});

test('appendUsage는 쓰기 실패해도 throw하지 않고 false를 반환한다', () => {
  // 파일을 디렉토리로 만들어 쓰기를 실패시킨다
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const logPath = join(dir, 'blocked');
  mkdirSync(logPath, { recursive: true });
  assert.equal(appendUsage({ task: 'x' }, logPath), false);
  rmSync(dir, { recursive: true, force: true });
});

test('initRun은 usage 로그에 1건 기록한다', () => {
  const { dir, logPath } = usageFixture();
  initRun({
    task: '유저 페르소나 정의',
    target: 'research',
    dnaVersion: 'v1.18',
    createdAt: '2026-07-31T02:00:00Z',
    dateStr: '2026-07-31',
    outBase: dir,
    usageLog: logPath,
  });
  const lines = readLines(logPath);
  assert.equal(lines.length, 1);
  assert.deepStrictEqual(JSON.parse(lines[0]), {
    task: '유저 페르소나 정의',
    target: 'research',
    dna_version: 'v1.18',
    created_at: '2026-07-31T02:00:00Z',
    slug: '유저-페르소나-정의',
  });
  rmSync(dir, { recursive: true, force: true });
});

test('initRun은 usageLog가 false면 기록하지 않는다', () => {
  const { dir, logPath } = usageFixture();
  initRun({
    task: '기록 안 함',
    target: 'general',
    dateStr: '2026-07-31',
    outBase: dir,
    usageLog: false,
  });
  assert.equal(existsSync(logPath), false);
  rmSync(dir, { recursive: true, force: true });
});

test('initRun을 두 번 호출하면 usage 로그가 2줄이 된다', () => {
  const { dir, logPath } = usageFixture();
  const base = { target: 'general', dateStr: '2026-07-31', outBase: dir, usageLog: logPath };
  initRun({ ...base, task: '첫 작업' });
  initRun({ ...base, task: '둘째 작업' });
  assert.equal(readLines(logPath).length, 2);
  rmSync(dir, { recursive: true, force: true });
});

test('initRun은 usage 기록 여부를 반환값에 표시한다', () => {
  const { dir, logPath } = usageFixture();
  const r = initRun({
    task: '표시 확인',
    target: 'general',
    dateStr: '2026-07-31',
    outBase: dir,
    usageLog: logPath,
  });
  assert.equal(r.usageLogged, true);
  rmSync(dir, { recursive: true, force: true });
});

test('TARGETS는 4종 타깃을 담는다', () => {
  assert.deepEqual(TARGETS, ['general', 'coding', 'image', 'research']);
});

test('FILE_NAMES는 산출 파일 5종을 정확한 순서로 담는다', () => {
  assert.deepEqual(FILE_NAMES, ['BRIEF.md', 'PROMPT.md', 'RATIONALE.md', 'OUTPUT.md', 'INSPECTION.md']);
});
