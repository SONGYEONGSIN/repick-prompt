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

// === 비표현 콘텐츠 검증 (Fix Round 1) ===

test('Finding 1: template 본문에 정확히 ``` 줄이 있으면 직렬화 실패', () => {
  const corrupting = structuredClone(SAMPLE);
  corrupting.template.template = '예시 출력:\n```\nconsole.log(1)\n```\n\n위처럼 코드를 감싸서 출력하세요.';
  assert.throws(() => serializeTemplateMd(corrupting), /파싱 불가능/);
});

test('Finding 2: 해부 설명에 ### 줄이 있으면 직렬화 실패', () => {
  const corrupting = structuredClone(SAMPLE);
  corrupting.template.anatomy[0].why = '이 부분이 진짜 설명이다.\n### 가짜 소제목\n어떤 설명\n> 가짜인용';
  assert.throws(() => serializeTemplateMd(corrupting), /파싱 불가능/);
});

test('해부 인용에 개행이 있으면 직렬화 실패', () => {
  const bad = structuredClone(SAMPLE);
  bad.template.anatomy[0].quote = '첫 줄\n둘째 줄';
  assert.throws(() => serializeTemplateMd(bad), /개행/);
});

test('해부 설명에 ## 줄이 있으면 직렬화 실패', () => {
  const bad = structuredClone(SAMPLE);
  bad.template.anatomy[0].why = '설명\n## 가짜\n텍스트';
  assert.throws(() => serializeTemplateMd(bad), /파싱 불가능/);
});

test('해부 설명에 > 줄이 있으면 직렬화 실패', () => {
  const bad = structuredClone(SAMPLE);
  bad.template.anatomy[0].why = '설명\n> 가짜인용\n텍스트';
  assert.throws(() => serializeTemplateMd(bad), /파싱 불가능/);
});

test('팁에 개행이 있으면 직렬화 실패', () => {
  const bad = structuredClone(SAMPLE);
  bad.template.tips[0] = '팁 하나\n팁 계속';
  assert.throws(() => serializeTemplateMd(bad), /개행/);
});

test('코드펜스 후 내용이 있으면 파싱 실패', () => {
  const md = serializeTemplateMd(SAMPLE);
  // 필드 섹션의 닫는 펜스 뒤에 내용 삽입
  const corrupted = md.replace(
    '```\n\n## 본문',
    '```\n\n버그: 이 텍스트는 파싱되지 않아야 한다\n## 본문'
  );
  assert.throws(() => parseTemplateMd(corrupted, 'bad.md'), /파싱 불가능/);
});

test('해부 part에 개행이 있으면 직렬화 실패 (Fix Round 2)', () => {
  const corrupting = structuredClone(SAMPLE);
  corrupting.template.anatomy[0].part = '역할\n가짜줄';
  assert.throws(() => serializeTemplateMd(corrupting), /파싱 불가능/);
});

// === Fix Round 3: 다중 방출 필드 + 왕복 검증 ===

test('order가 음수면 직렬화 실패 (Fix Round 3)', () => {
  const bad = structuredClone(SAMPLE);
  bad.order = -1;
  assert.throws(() => serializeTemplateMd(bad), /음이 아닌 정수/);
});

test('order가 정수가 아니면 직렬화 실패 (Fix Round 3)', () => {
  const bad = structuredClone(SAMPLE);
  bad.order = 3.5;
  assert.throws(() => serializeTemplateMd(bad), /음이 아닌 정수/);
});

test('promoted에 개행이 있으면 직렬화 실패 (Fix Round 3)', () => {
  const corrupting = structuredClone(SAMPLE);
  corrupting.promoted = '2026-07-24-demo\n## 팁\n\n- 가짜팁';
  assert.throws(() => serializeTemplateMd(corrupting), /파싱 불가능/);
});

test('title에 개행이 있으면 직렬화 실패 (Fix Round 3)', () => {
  const corrupting = structuredClone(SAMPLE);
  corrupting.template.title = '데모\n## 팁\n\n- 가짜팁';
  assert.throws(() => serializeTemplateMd(corrupting), /파싱 불가능/);
});

// === 에러 타입 오탐지 회귀 (Open Finding) ===

test('왕복 검증 실패 메시지에 " — "가 우연히 있어도 raw AssertionError가 아니라 ${slug} — ${사유}로 던진다', () => {
  // 팁 파싱은 '- ' 뒤를 trim()하지만, 직렬화 쪽 가드는 개행(\n)만 검거하고 앞뒤 공백은 보지 않는다.
  // 그래서 앞뒤 공백만 있는 팁은 어떤 직접 가드도 통과해 왕복 자기 검증까지 도달하고,
  // 거기서 assert.deepStrictEqual이 실패한다. 이 팁 값 자체가 프로젝트 흔한 표현인 ' — '를
  // 포함하므로, 실패 진단용 diff 메시지에도 ' — '가 그대로 등장해 예전 구현의
  // e.message.includes(' — ') 휴리스틱을 오탐지시켰다 (raw AssertionError가 그대로 새어나감).
  const corrupting = structuredClone(SAMPLE);
  corrupting.template.tips[0] = '  팁 하나 — 대시가 들어간다.  ';
  assert.throws(
    () => serializeTemplateMd(corrupting),
    (err) => {
      assert.ok(!(err instanceof assert.AssertionError), `raw AssertionError가 새어나갔다: ${err.message}`);
      assert.match(err.message, /^demo — 왕복 검증 실패/);
      return true;
    }
  );
});

// === 손으로 쓴 마크다운 리터럴 (생성이 아니라 실 운영 입력 형태) ===
// 위의 모든 테스트는 serialize → parse로 왕복한다 — 즉 파서가 "자기 자신의 직렬화기가 만든
// 출력"만 읽을 수 있어도 전부 통과한다. 그러나 vault/50-library/*.md의 실제 입력은 사람이
// 손으로 쓰거나(README "수동으로 템플릿 추가") LEARN이 후보 파일을 그대로 이동시킨 것이라,
// 직렬화기가 절대 만들지 않는 형태(재정렬된 frontmatter 키, 압축 JSON, 콤마 뒤 공백)를 띤다.
// serializeTemplateMd와 parseTemplateMd가 서로만 아는 가정을 공유하는 대칭 버그는 이 리터럴이
// 아니면 전체 스위트를 통과한 채 숨는다.
test('손으로 쓴 리터럴 마크다운이 기대한 객체로 정확히 파싱된다 (serializer 미경유)', () => {
  const literalMd = [
    '---',
    'slug: "study-plan"',
    'title: "스터디 플랜 짜기"',
    'categoryId: "productivity"',
    'description: "학습 목표와 기간을 넣으면 주차별 스터디 플랜을 만듭니다."',
    'tags: ["template", "productivity"]',
    'order: 3',
    '---',
    '',
    '# 스터디 플랜 짜기',
    '',
    '씨앗 — 사용자 제공 검증 프롬프트',
    '',
    '## 필드',
    '',
    '```json',
    '[{"key":"goal","label":"학습 목표","type":"text","placeholder":"예: 정보처리기사 필기 합격"},{"key":"weeks","label":"기간(주)","type":"text","help":"숫자만 입력"},{"key":"level","label":"난이도","type":"select","options":["입문","중급","고급"]},{"key":"notes","label":"참고사항","type":"textarea","optional":true}]',
    '```',
    '',
    '## 본문',
    '',
    '```',
    '당신은 학습 코치입니다.',
    '',
    '- 목표: {{goal}}',
    '- 기간: {{weeks}}주',
    '- 난이도: {{level}}',
    '- 참고사항: {{notes}}',
    '',
    '위 정보를 바탕으로 주차별 학습 계획을 표로 작성하세요.',
    '```',
    '',
    '## 해부',
    '',
    '### 역할',
    '',
    '> 당신은 학습 코치입니다',
    '',
    '역할을 먼저 못박으면 이후 문장이 전부 그 관점에서 해석된다.',
    '',
    '### 목표 고정',
    '',
    '> 목표: {{goal}}',
    '',
    '목표를 요구사항보다 앞에 두어 이후 모든 계획이 목표에 종속되게 만든다.',
    '',
    '## 팁',
    '',
    '- 목표는 측정 가능한 문장으로 적을수록 결과가 좋다.',
    '- 기간이 짧을수록 우선순위 압축을 요구하는 문장을 추가하면 좋다.',
  ].join('\n');

  assert.deepStrictEqual(parseTemplateMd(literalMd, 'study-plan.md'), {
    template: {
      slug: 'study-plan',
      categoryId: 'productivity',
      title: '스터디 플랜 짜기',
      description: '학습 목표와 기간을 넣으면 주차별 스터디 플랜을 만듭니다.',
      fields: [
        { key: 'goal', label: '학습 목표', type: 'text', placeholder: '예: 정보처리기사 필기 합격' },
        { key: 'weeks', label: '기간(주)', type: 'text', help: '숫자만 입력' },
        { key: 'level', label: '난이도', type: 'select', options: ['입문', '중급', '고급'] },
        { key: 'notes', label: '참고사항', type: 'textarea', optional: true },
      ],
      template:
        '당신은 학습 코치입니다.\n\n- 목표: {{goal}}\n- 기간: {{weeks}}주\n- 난이도: {{level}}\n- 참고사항: {{notes}}\n\n위 정보를 바탕으로 주차별 학습 계획을 표로 작성하세요.',
      anatomy: [
        {
          part: '역할',
          quote: '당신은 학습 코치입니다',
          why: '역할을 먼저 못박으면 이후 문장이 전부 그 관점에서 해석된다.',
        },
        {
          part: '목표 고정',
          quote: '목표: {{goal}}',
          why: '목표를 요구사항보다 앞에 두어 이후 모든 계획이 목표에 종속되게 만든다.',
        },
      ],
      tips: [
        '목표는 측정 가능한 문장으로 적을수록 결과가 좋다.',
        '기간이 짧을수록 우선순위 압축을 요구하는 문장을 추가하면 좋다.',
      ],
    },
    order: 3,
    promoted: null,
    tags: ['template', 'productivity'],
  });
});
