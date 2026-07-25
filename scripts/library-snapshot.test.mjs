// 동결 핀 — 마이그레이션 전 28종이 볼트 왕복 후에도 한 글자도 안 변했는지 본다.
// 새 템플릿이 늘어도 깨지지 않도록 부분집합으로 검사한다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildLibrary } from './build-library.mjs';

const before = JSON.parse(readFileSync('scripts/__snapshots__/library-before.json', 'utf8'));
const after = buildLibrary('vault/50-library');

test('동결된 28종이 볼트에서 동일하게 복원된다', () => {
  const bySlug = new Map(after.templates.map((t) => [t.slug, t]));
  for (const expected of before.templates) {
    const actual = bySlug.get(expected.slug);
    assert.ok(actual, `${expected.slug}가 볼트에 없다`);
    assert.deepStrictEqual(actual, expected, `${expected.slug}가 왕복에서 변했다`);
  }
});

test('동결된 28종의 상대 순서가 유지된다', () => {
  const frozen = new Set(before.templates.map((t) => t.slug));
  assert.deepStrictEqual(
    after.templates.filter((t) => frozen.has(t.slug)).map((t) => t.slug),
    before.templates.map((t) => t.slug)
  );
});

test('카테고리가 동일하다', () => {
  assert.deepStrictEqual(after.categories, before.categories);
});
