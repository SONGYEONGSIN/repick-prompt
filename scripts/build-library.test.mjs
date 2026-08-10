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

test('optional 토큰만 있는 줄이 요구사항 줄이면 던진다', () => {
  // 조립기는 "슬롯이 전부 optional이고 전부 미입력"인 줄을 통째로 지운다
  // (app/src/lib/prompt.ts shouldDropLine, scripts/prompt-loop.mjs assembleForTest).
  // 요구사항 문장이 그렇게 사라지면 안전망 지시가 소리 없이 없어진다.
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'note', label: '비고', type: 'text', optional: true });
  e.template.template = '본문 {{a}}\n3. {{note}}가 있으면 그 지점을 반드시 짚어주세요.';
  const dir = fixture([e]);
  assert.throws(() => buildLibrary(dir), /optional 토큰만 있는 줄/);
});

test('optional 토큰이 입력 목록 불릿이면 허용한다', () => {
  // "- 비고: " 같은 반쪽 줄이 사라지는 건 의도된 동작이다.
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'note', label: '비고', type: 'text', optional: true });
  e.template.template = '본문 {{a}}\n- 비고: {{note}}';
  const dir = fixture([e]);
  assert.doesNotThrow(() => buildLibrary(dir));
});

test('불릿 값 줄은 뒤에 조건 설명이 붙어도 허용한다', () => {
  // press-release 계열: "- 추가 배경 자료: {{extra_context}} (비어 있으면 이 줄을 무시하고…)".
  // 설명 자체가 값이 있을 때만 유효하므로 줄째 사라지는 게 맞다.
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'note', label: '비고', type: 'text', optional: true });
  e.template.template = '본문 {{a}}\n- 비고: {{note}} (비어 있으면 이 줄을 무시하세요)';
  const dir = fixture([e]);
  assert.doesNotThrow(() => buildLibrary(dir));
});

test('불릿 기호 없는 "라벨: 토큰" 값 줄도 허용한다', () => {
  // thumbnail-image 계열은 불릿 없이 "배경 요소: {{background}}" 형태로 값을 나열한다 —
  // 기호 유무가 아니라 "산문이 붙지 않은 값 줄인가"가 판단 기준이다.
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'note', label: '비고', type: 'text', optional: true });
  e.template.template = '본문 {{a}}\n비고: {{note}}';
  const dir = fixture([e]);
  assert.doesNotThrow(() => buildLibrary(dir));
});

test('optional 토큰이 필수 토큰과 같은 줄이면 허용한다', () => {
  // 필수 토큰이 값을 채우므로 줄 삭제 조건에 걸리지 않는다.
  const e = makeTemplate('one', 'writing', 1);
  e.template.fields.push({ key: 'note', label: '비고', type: 'text', optional: true });
  e.template.template = '3. {{a}}를 정리하되 {{note}}가 있으면 함께 짚어주세요.';
  const dir = fixture([e]);
  assert.doesNotThrow(() => buildLibrary(dir));
});

test('생성된 TS에 경고 주석과 두 export가 들어간다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1)]);
  const ts = renderGeneratedTs(buildLibrary(dir));
  assert.match(ts, /AUTO-GENERATED/);
  assert.match(ts, /export const CATEGORIES: Category\[\]/);
  assert.match(ts, /export const TEMPLATES: PromptTemplate\[\]/);
  assert.match(ts, /from "\.\/templates\.types"/);
});

test('출력 순서는 파일명 아닌 order 필드를 따른다', () => {
  // Invariant: emitted order follows order field, not alphabetical filenames
  // Create: alpha (order 3), mike (order 1), zebra (order 2)
  // Expect output: mike, zebra, alpha — NOT alphabetical
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, '_categories.md'), serializeCategoriesMd([{ id: 'writing', name: '글쓰기' }]));
  writeFileSync(join(dir, 'alpha.md'), serializeTemplateMd(makeTemplate('alpha', 'writing', 3)));
  writeFileSync(join(dir, 'mike.md'), serializeTemplateMd(makeTemplate('mike', 'writing', 1)));
  writeFileSync(join(dir, 'zebra.md'), serializeTemplateMd(makeTemplate('zebra', 'writing', 2)));

  const lib = buildLibrary(dir);
  const slugOrder = lib.templates.map((t) => t.slug);

  // Must be in order field order (1, 2, 3): mike, zebra, alpha
  // NOT in alphabetical order (alpha, mike, zebra)
  assert.deepStrictEqual(slugOrder, ['mike', 'zebra', 'alpha']);
});

test('_categories.md가 없으면 명확한 에러를 던진다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  writeFileSync(join(dir, 'one.md'), serializeTemplateMd(makeTemplate('one', 'writing', 1)));
  assert.throws(
    () => buildLibrary(dir),
    /파일을 찾을 수 없다.*볼트 디렉토리/
  );
});
