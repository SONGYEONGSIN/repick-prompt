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

// 카테고리도 템플릿과 같은 원칙(부분집합 검사) — LEARN이 새 카테고리를 추가하는 정상 동작이
// 동결 스냅샷과의 exact-equality로 깨지면 안 된다. 단, 동결된 카테고리 자체가 사라지거나
// 이름이 바뀌는 건 진짜 회귀이므로 여전히 잡아야 한다.
function assertCategoriesSubset(actualCategories, frozenCategories) {
  const byId = new Map(actualCategories.map((c) => [c.id, c]));
  for (const expected of frozenCategories) {
    const actual = byId.get(expected.id);
    assert.ok(actual, `카테고리 '${expected.id}'가 사라졌다`);
    assert.equal(actual.name, expected.name, `카테고리 '${expected.id}'의 name이 바뀌었다`);
  }
}

test('동결된 카테고리가 이름까지 동일하게 유지된다 (새 카테고리 추가는 허용)', () => {
  assertCategoriesSubset(after.categories, before.categories);
});

test('동결된 카테고리가 사라지거나 이름이 바뀌면 실패한다', () => {
  const frozen = [
    { id: 'writing', name: '글쓰기' },
    { id: 'email', name: '이메일' },
  ];
  assert.throws(
    () => assertCategoriesSubset([{ id: 'email', name: '이메일' }], frozen),
    /사라졌다/
  );
  assert.throws(
    () =>
      assertCategoriesSubset(
        [
          { id: 'writing', name: '작문' },
          { id: 'email', name: '이메일' },
        ],
        frozen
      ),
    /name이 바뀌었다/
  );
  // 새 카테고리 추가는 실패하지 않아야 한다
  assert.doesNotThrow(() =>
    assertCategoriesSubset(
      [
        { id: 'writing', name: '글쓰기' },
        { id: 'email', name: '이메일' },
        { id: 'career', name: '커리어' },
      ],
      frozen
    )
  );
});
