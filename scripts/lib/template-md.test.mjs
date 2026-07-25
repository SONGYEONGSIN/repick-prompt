import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTemplateMd,
  serializeTemplateMd,
  parseCategoriesMd,
  serializeCategoriesMd,
} from './template-md.mjs';

const SAMPLE = {
  template: {
    slug: 'demo',
    categoryId: 'writing',
    title: '데모 템플릿',
    description: '설명: 콜론과 "따옴표"가 들어간 문장.',
    fields: [
      { key: 'topic', label: '주제', type: 'text', help: '한 줄로', placeholder: '예시' },
      { key: 'tone', label: '톤', type: 'select', options: ['정중하게', '간결하게'] },
      { key: 'extra', label: '부가', type: 'textarea', optional: true, placeholder: '여러\n줄' },
    ],
    template: '당신은 편집자입니다.\n\n- 주제: {{topic}}\n- 톤: {{tone}}\n- 부가: {{extra}}',
    anatomy: [
      { part: '역할', quote: '당신은 편집자입니다', why: '역할이 관점을 고정한다.' },
      { part: '맥락', quote: '주제: {{topic}}', why: '주제를 먼저 못박는다.' },
    ],
    tips: ['팁 하나 — 대시가 들어간다.', '팁 둘: 콜론도 들어간다.'],
  },
  order: 7,
  promoted: '2026-07-24-demo',
  tags: ['template', 'writing'],
};

test('직렬화한 뒤 파싱하면 원본과 같다', () => {
  const md = serializeTemplateMd(SAMPLE);
  assert.deepStrictEqual(parseTemplateMd(md, 'demo.md'), SAMPLE);
});

test('개행이 든 placeholder가 왕복에서 보존된다', () => {
  const md = serializeTemplateMd(SAMPLE);
  const back = parseTemplateMd(md, 'demo.md');
  assert.equal(back.template.fields[2].placeholder, '여러\n줄');
});

test('promoted 없는 씨앗도 왕복한다', () => {
  const seed = { ...SAMPLE, promoted: null, tags: ['template', 'seed'] };
  const md = serializeTemplateMd(seed);
  assert.deepStrictEqual(parseTemplateMd(md, 'seed.md'), seed);
});

test('optional 키가 없는 필드는 없는 채로 유지된다', () => {
  const md = serializeTemplateMd(SAMPLE);
  const back = parseTemplateMd(md, 'demo.md');
  assert.ok(!('optional' in back.template.fields[0]));
  assert.equal(back.template.fields[2].optional, true);
});

test('해부 항목이 5개여도 파싱된다', () => {
  const five = structuredClone(SAMPLE);
  five.template.anatomy = ['역할', '맥락', '요구사항', '출력 형식', '네거티브 조건'].map((part) => ({
    part,
    quote: `${part} 인용`,
    why: `${part} 설명.`,
  }));
  const back = parseTemplateMd(serializeTemplateMd(five), 'five.md');
  assert.deepStrictEqual(back.template.anatomy, five.template.anatomy);
});

test('프런트매터가 없으면 던진다', () => {
  assert.throws(() => parseTemplateMd('# 제목만 있다', 'bad.md'), /프런트매터가 없다/);
});

test('프런트매터 값이 인용 안 된 맨문자열이면 던진다', () => {
  const md = serializeTemplateMd(SAMPLE).replace('title: "데모 템플릿"', 'title: 데모 템플릿');
  assert.throws(() => parseTemplateMd(md, 'bad.md'), /JSON 문자열/);
});

test('필드 type이 허용 목록 밖이면 던진다', () => {
  const md = serializeTemplateMd(SAMPLE).replace('"type": "text"', '"type": "number"');
  assert.throws(() => parseTemplateMd(md, 'bad.md'), /text\|textarea\|select/);
});

test('필드에 모르는 키가 있으면 던진다', () => {
  const md = serializeTemplateMd(SAMPLE).replace('"key": "topic"', '"key": "topic",\n    "bogus": 1');
  assert.throws(() => parseTemplateMd(md, 'bad.md'), /모르는 키/);
});

test('해부 항목에 인용 줄이 없으면 던진다', () => {
  const md = serializeTemplateMd(SAMPLE).replace('> 당신은 편집자입니다\n\n', '');
  assert.throws(() => parseTemplateMd(md, 'bad.md'), /인용/);
});

test('필수 섹션이 빠지면 던진다', () => {
  const md = serializeTemplateMd(SAMPLE).replace('## 팁', '## 잡담');
  assert.throws(() => parseTemplateMd(md, 'bad.md'), /'## 팁' 섹션이 없다/);
});

test('카테고리 파일이 왕복한다', () => {
  const cats = [
    { id: 'writing', name: '글쓰기' },
    { id: 'email', name: '이메일' },
  ];
  assert.deepStrictEqual(parseCategoriesMd(serializeCategoriesMd(cats), '_categories.md'), cats);
});
