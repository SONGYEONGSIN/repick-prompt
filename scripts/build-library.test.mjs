import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildLibrary, renderGeneratedTs } from './build-library.mjs';
import { serializeTemplateMd, serializeCategoriesMd } from './lib/template-md.mjs';

function makeTemplate(slug, categoryId, order) {
  return {
    template: {
      slug,
      categoryId,
      title: `${slug} 제목`,
      description: `${slug} 설명`,
      fields: [{ key: 'a', label: 'A', type: 'text' }],
      template: `본문 {{a}} — ${slug}`,
      anatomy: [{ part: '역할', quote: '인용', why: '이유.' }],
      tips: ['팁.'],
    },
    order,
    promoted: null,
    tags: ['template'],
  };
}

function fixture(entries, cats = [{ id: 'writing', name: '글쓰기' }]) {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, '_categories.md'), serializeCategoriesMd(cats));
  for (const e of entries) {
    writeFileSync(join(dir, `${e.template.slug}.md`), serializeTemplateMd(e));
  }
  return dir;
}

test('order 오름차순으로 정렬한다 (파일명 순서와 무관)', () => {
  const dir = fixture([
    makeTemplate('zeta', 'writing', 1),
    makeTemplate('alpha', 'writing', 2),
  ]);
  const { templates } = buildLibrary(dir);
  assert.deepStrictEqual(
    templates.map((t) => t.slug),
    ['zeta', 'alpha']
  );
});

test('_ 로 시작하는 파일은 템플릿으로 읽지 않는다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1)]);
  const { templates } = buildLibrary(dir);
  assert.equal(templates.length, 1);
});

test('카테고리를 파일 순서 그대로 돌려준다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1)], [
    { id: 'writing', name: '글쓰기' },
    { id: 'email', name: '이메일' },
  ]);
  const { categories } = buildLibrary(dir);
  assert.deepStrictEqual(categories, [
    { id: 'writing', name: '글쓰기' },
    { id: 'email', name: '이메일' },
  ]);
});

test('slug가 중복되면 던진다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, '_categories.md'), serializeCategoriesMd([{ id: 'writing', name: '글쓰기' }]));
  writeFileSync(join(dir, 'a.md'), serializeTemplateMd(makeTemplate('dup', 'writing', 1)));
  writeFileSync(join(dir, 'b.md'), serializeTemplateMd(makeTemplate('dup', 'writing', 2)));
  assert.throws(() => buildLibrary(dir), /slug 중복/);
});

test('order가 중복되면 던진다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1), makeTemplate('two', 'writing', 1)]);
  assert.throws(() => buildLibrary(dir), /order 중복/);
});

test('파일명이 slug와 다르면 던진다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, '_categories.md'), serializeCategoriesMd([{ id: 'writing', name: '글쓰기' }]));
  writeFileSync(join(dir, 'wrong-name.md'), serializeTemplateMd(makeTemplate('right', 'writing', 1)));
  assert.throws(() => buildLibrary(dir), /파일명과 slug가 다르다/);
});

test('categoryId가 카테고리 목록에 없으면 던진다', () => {
  const dir = fixture([makeTemplate('one', 'nope', 1)]);
  assert.throws(() => buildLibrary(dir), /모르는 categoryId/);
});

test('본문 토큰과 필드 key가 어긋나면 던진다', () => {
  const e = makeTemplate('one', 'writing', 1);
  e.template.template = '본문 {{missing}}';
  const dir = fixture([e]);
  assert.throws(() => buildLibrary(dir), /필드에 없는 토큰/);
});

test('쓰이지 않는 필드가 있으면 던진다', () => {
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'unused', label: 'U', type: 'text' });
  const dir = fixture([e]);
  assert.throws(() => buildLibrary(dir), /본문에서 안 쓰이는 필드/);
});

test('생성된 TS에 경고 주석과 두 export가 들어간다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1)]);
  const ts = renderGeneratedTs(buildLibrary(dir));
  assert.match(ts, /AUTO-GENERATED/);
  assert.match(ts, /export const CATEGORIES: Category\[\]/);
  assert.match(ts, /export const TEMPLATES: PromptTemplate\[\]/);
  assert.match(ts, /from "\.\/templates\.types"/);
});

test('파일 쓰기 순서 무관 결정론적 직렬화 (정렬 확인)', () => {
  // Create files in reverse alphabetical order to verify .sort() is applied
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, '_categories.md'), serializeCategoriesMd([{ id: 'writing', name: '글쓰기' }]));
  writeFileSync(join(dir, 'zebra.md'), serializeTemplateMd(makeTemplate('zebra', 'writing', 1)));
  writeFileSync(join(dir, 'mike.md'), serializeTemplateMd(makeTemplate('mike', 'writing', 2)));
  writeFileSync(join(dir, 'alpha.md'), serializeTemplateMd(makeTemplate('alpha', 'writing', 3)));

  const ts = renderGeneratedTs(buildLibrary(dir));

  // Extract slugs in order they appear in generated TS
  const slugMatches = [...ts.matchAll(/"slug":\s*"([^"]+)"/g)];
  const slugOrder = slugMatches.map(m => m[1]);

  // Files are sorted alphabetically before reading (alpha, mike, zebra)
  // Templates are sorted by order field (1, 2, 3)
  // Result: zebra (order 1), mike (order 2), alpha (order 3)
  assert.deepStrictEqual(slugOrder, ['zebra', 'mike', 'alpha']);
});

test('_categories.md가 없으면 명확한 에러를 던진다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, 'one.md'), serializeTemplateMd(makeTemplate('one', 'writing', 1)));
  assert.throws(
    () => buildLibrary(dir),
    /파일을 찾을 수 없다.*볼트 디렉토리/
  );
});
