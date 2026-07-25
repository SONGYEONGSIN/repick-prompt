# S1 — 볼트가 라이브러리의 원본이 된다 (구현 계획)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승격 템플릿 28종의 원본을 `app/src/data/templates.ts` 배열에서 `vault/50-library/*.md`로 옮기고, 앱은 커밋된 파생 TS를 읽게 한다.

**Architecture:** 볼트 마크다운이 단일 원본이다. `scripts/lib/template-md.mjs`가 그 포맷의 유일한 파싱/직렬화 계약이고, `scripts/build-library.mjs`가 볼트를 읽어 `app/src/data/templates.generated.ts`를 만든다. 앱 소비처 6곳은 `@/data/templates`에서 계속 가져오므로 한 줄도 바뀌지 않는다. `wiki-lint`가 포맷 검사와 재생성 바이트 일치를 강제한다.

**Tech Stack:** Node 22.14 (의존성 0 — 루트에 `package.json` 없음, 모든 스크립트는 맨 `node`), `node --test`, `node --experimental-strip-types`(TS 읽기), Next.js 16 + React 19(앱).

## Global Constraints

- **루트 npm 의존성을 추가하지 않는다.** 매일 밤 새 클라우드 샌드박스에서 도는 무인 루틴의 실패 지점을 늘리지 않기 위해서다. 파싱은 `JSON.parse` + 좁은 수제 리더로 해결한다.
- **애매하면 던진다.** 파서는 모르는 문법을 만나면 `path — 사유` 형식으로 throw한다. 조용한 오파싱은 금지 — 이 작업의 존재 이유가 "깨진 표 3건이 아무 소리 없이 통과한 것"이다.
- **왕복 동등성이 유일한 성공 기준이다.** 28종 × (fields · template · anatomy · tips)가 한 글자도 변하면 안 된다.
- **파생 파일을 손으로 고치지 않는다.** `app/src/data/templates.generated.ts` 상단에 그 경고를 박는다.
- 커밋 메시지는 conventional + 한국어 (`rules/git.md`).
- 브랜치는 `feat/vault-as-library-source` (이미 체크아웃돼 있고 스펙 커밋 98f2eaa가 올라가 있다). 스펙은 `git worktree` 격리를 권했지만 **worktree를 파지 않는다** — 격리의 목적이 "밤새 루틴이 main을 움직이는 것"이었고 그 루틴은 정지시켰다. 루틴을 다시 켠 채로 작업하게 되면 그때 worktree로 옮긴다.
- 클라우드 루틴 `trig_01C7e66nxxHq8ELBMj5syCty`는 **정지 상태**다. 이 계획 안에서 다시 켜지 않는다 — 재개는 S1 머지 + R20 수동 검증 후.

## File Structure

| 파일 | 책임 | 태스크 |
|---|---|---|
| `scripts/lib/template-md.mjs` | 템플릿 마크다운 ↔ 객체. 포맷의 유일한 계약 | 1 |
| `scripts/lib/template-md.test.mjs` | 위 모듈 단위 테스트 + 왕복 | 1 |
| `scripts/build-library.mjs` | `vault/50-library/` → `templates.generated.ts` | 2 |
| `scripts/build-library.test.mjs` | 픽스처 디렉토리로 생성기 검증 | 2 |
| `scripts/migrate-templates.mjs` | **일회용**. `templates.ts` → 마크다운 29개 (태스크 6에서 삭제) | 3 |
| `scripts/__snapshots__/library-before.json` | 마이그레이션 전 28종 동결 핀 | 3 |
| `scripts/library-snapshot.test.mjs` | 생성 결과가 동결 핀을 포함하는지 (부분집합) | 3 |
| `vault/50-library/_categories.md` | 카테고리 11종 + 표시 순서 | 3 |
| `vault/50-library/<slug>.md` × 28 | 템플릿 원본 | 3 |
| `app/src/data/templates.types.ts` | 타입 5종 (사람이 관리) | 4 |
| `app/src/data/templates.generated.ts` | `CATEGORIES` + `TEMPLATES` (생성) | 4 |
| `app/src/data/templates.ts` | re-export + `categoryName` · `templateBySlug` | 4 |
| `scripts/wiki-lint.mjs` | 검사 5종 추가 | 5 |
| `scripts/export-references.mjs` | 소스를 볼트로 전환 (산출물 동일) | 5 |
| `.claude/skills/prompt-evolve/SKILL.md` | LEARN 승격 경로 + GENERATE 후보 포맷 | 6 |

## 파일 포맷 (계약)

````markdown
---
tags: ["template", "report"]
slug: "business-proposal"
categoryId: "report"
title: "사업 제안서 작성"
description: "대안 비교표와 근거 계산으로 결재용 제안서를 작성합니다."
promoted: "2026-07-24-business-proposal"
order: 20
---

# 사업 제안서 작성

승격 [[2026-07-24-business-proposal/DECISION|라운드]]

## 필드

```json
[
  {
    "key": "audience",
    "label": "결재 대상",
    "type": "text",
    "help": "누가 이 제안을 검토·결재하나요?",
    "placeholder": "본부장 김OO"
  }
]
```

## 본문

```
당신은 ... {{audience}} ...
```

## 해부

### 역할

> 당신의 최우선 임무는 설득이 아니라 정직한 비교입니다

도메인의 본질 리스크를 역할 정의에서 차단해 이후 요구사항이 이 제약을 상속하게 만든다.

## 팁

- alternatives_raw에 현상유지를 포함시키지 않으면 비교표가 성립하지 않는다.
````

**frontmatter는 평면 스칼라만** — 값은 JSON 인용 문자열(`"..."`), JSON 배열(`[...]`), 또는 정수. 중첩 없음. `promoted`는 선택(씨앗은 없음).

**파싱 계약**

| 대상 | 규칙 |
|---|---|
| `slug` `categoryId` `title` `description` `order` | frontmatter 필수 |
| `tags` `promoted` | frontmatter 선택 |
| `fields[]` | `## 필드` 안 첫 ` ```json ` 펜스를 `JSON.parse` |
| `template` | `## 본문` 안 첫 펜스(언어 없음)의 내용 |
| `anatomy[]` | `## 해부` 아래 각 `### <part>` — 첫 `> ` 줄이 `quote`, 나머지가 `why` |
| `tips[]` | `## 팁` 아래 `- ` 불릿 |

`# 제목`과 승격 링크 줄은 `## ` 섹션 밖이라 파서가 무시한다 — 사람이 읽는 장식이다.

---

### Task 1: 템플릿 마크다운 파서/직렬화기

**Files:**
- Create: `scripts/lib/template-md.mjs`
- Test: `scripts/lib/template-md.test.mjs`

**Interfaces:**
- Consumes: 없음 (순수 함수, fs 접근 없음)
- Produces:
  - `parseTemplateMd(src: string, path?: string) => { template, order: number, promoted: string|null, tags: string[] }`
    — `template`은 앱의 `PromptTemplate` 형태 `{slug, categoryId, title, description, fields, template, anatomy, tips}`
  - `serializeTemplateMd({ template, order, promoted, tags }) => string`
  - `parseCategoriesMd(src: string, path?: string) => Array<{id: string, name: string}>`
  - `serializeCategoriesMd(categories) => string`
  - 파싱 실패 시 `Error`를 던진다 (메시지 = `` `${path} — ${사유}` ``)

- [ ] **Step 1: 실패하는 테스트 작성**

Create `scripts/lib/template-md.test.mjs`:

```js
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
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `node --test scripts/lib/template-md.test.mjs`
Expected: FAIL — `Cannot find module .../scripts/lib/template-md.mjs`

- [ ] **Step 3: 최소 구현 작성**

Create `scripts/lib/template-md.mjs`:

```js
// 템플릿 마크다운 ↔ 객체 변환. vault/50-library/ 가 라이브러리의 단일 원본이므로
// 이 모듈이 그 포맷의 유일한 계약이다. 모르는 문법을 만나면 던진다 — 조용한 오파싱 금지.

const FIELD_KEYS = new Set(['key', 'label', 'type', 'help', 'placeholder', 'options', 'optional']);
const FIELD_TYPES = new Set(['text', 'textarea', 'select']);
const SECTIONS = ['필드', '본문', '해부', '팁'];

function fail(path, msg) {
  throw new Error(`${path} — ${msg}`);
}

/** `---` 프런트매터를 평면 스칼라로만 읽는다. 중첩 없음. */
function parseFrontmatter(src, path) {
  const lines = src.split('\n');
  if (lines[0] !== '---') fail(path, '프런트매터가 없다 (첫 줄이 ---가 아님)');
  const end = lines.indexOf('---', 1);
  if (end === -1) fail(path, '프런트매터가 닫히지 않았다');
  const data = {};
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const c = line.indexOf(':');
    if (c === -1) fail(path, `프런트매터 ${i + 1}행: 'key: value' 형식이 아니다 — ${line}`);
    const key = line.slice(0, c).trim();
    const raw = line.slice(c + 1).trim();
    if (key === '') fail(path, `프런트매터 ${i + 1}행: 키가 비었다`);
    if (/^\d+$/.test(raw)) {
      data[key] = Number(raw);
    } else if (raw.startsWith('"') || raw.startsWith('[')) {
      try {
        data[key] = JSON.parse(raw);
      } catch (e) {
        fail(path, `프런트매터 ${i + 1}행: JSON 값으로 해석 불가 (${e.message}) — ${raw}`);
      }
    } else {
      fail(path, `프런트매터 ${i + 1}행: 값은 JSON 문자열("..")·배열([..])·정수만 허용 — ${raw}`);
    }
  }
  return { data, body: lines.slice(end + 1) };
}

/** `## <제목>` 섹션의 본문 줄. 없으면 null. */
function section(lines, heading) {
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (l2IsHeading(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end);
}

function l2IsHeading(line) {
  return /^## /.test(line);
}

/** 섹션 안 첫 코드펜스의 내용. lang이 다르면 던진다. */
function fenced(lines, path, what, lang) {
  const open = lines.findIndex((l) => l.startsWith('```'));
  if (open === -1) fail(path, `'## ${what}' 섹션에 코드펜스가 없다`);
  const got = lines[open].slice(3).trim();
  if (got !== lang) fail(path, `'## ${what}' 코드펜스 언어가 '${lang}'이 아니다 — '${got}'`);
  const close = lines.indexOf('```', open + 1);
  if (close === -1) fail(path, `'## ${what}' 코드펜스가 닫히지 않았다`);
  return lines.slice(open + 1, close).join('\n');
}

function parseAnatomy(lines, path) {
  const raw = [];
  let cur = null;
  for (const line of lines) {
    const h = /^### (.+)$/.exec(line);
    if (h) {
      cur = { part: h[1].trim(), quote: null, why: [] };
      raw.push(cur);
      continue;
    }
    if (!cur) {
      if (line.trim() !== '') fail(path, `해부 섹션에 '### 항목' 밖 내용이 있다 — ${line}`);
      continue;
    }
    if (line.startsWith('> ')) {
      if (cur.quote !== null) fail(path, `해부 '${cur.part}': 인용(>)이 두 번 나왔다`);
      cur.quote = line.slice(2).trim();
      continue;
    }
    cur.why.push(line);
  }
  if (raw.length === 0) fail(path, '해부 항목이 하나도 없다');
  return raw.map((a) => {
    if (a.quote === null) fail(path, `해부 '${a.part}': 인용('> ') 줄이 없다`);
    const why = a.why.join('\n').trim();
    if (why === '') fail(path, `해부 '${a.part}': 설명이 비었다`);
    return { part: a.part, quote: a.quote, why };
  });
}

function parseTips(lines, path) {
  const tips = [];
  for (const line of lines) {
    if (line.trim() === '') continue;
    if (!line.startsWith('- ')) fail(path, `팁 섹션은 '- ' 불릿만 허용 — ${line}`);
    tips.push(line.slice(2).trim());
  }
  if (tips.length === 0) fail(path, '팁이 하나도 없다');
  return tips;
}

function checkFields(fields, path) {
  if (!Array.isArray(fields) || fields.length === 0) fail(path, '필드는 비지 않은 배열이어야 한다');
  for (const f of fields) {
    if (typeof f !== 'object' || f === null) fail(path, '필드 항목이 객체가 아니다');
    for (const k of Object.keys(f)) {
      if (!FIELD_KEYS.has(k)) fail(path, `필드 '${f.key}': 모르는 키 '${k}'`);
    }
    if (typeof f.key !== 'string' || f.key === '') fail(path, '필드에 key가 없다');
    if (typeof f.label !== 'string' || f.label === '') fail(path, `필드 '${f.key}': label이 없다`);
    if (!FIELD_TYPES.has(f.type)) {
      fail(path, `필드 '${f.key}': type이 text|textarea|select가 아니다 — ${f.type}`);
    }
    if ('optional' in f && typeof f.optional !== 'boolean') {
      fail(path, `필드 '${f.key}': optional은 boolean이어야 한다`);
    }
    if ('help' in f && typeof f.help !== 'string') fail(path, `필드 '${f.key}': help는 문자열`);
    if ('placeholder' in f && typeof f.placeholder !== 'string') {
      fail(path, `필드 '${f.key}': placeholder는 문자열`);
    }
    if ('options' in f) {
      if (!Array.isArray(f.options) || f.options.some((o) => typeof o !== 'string')) {
        fail(path, `필드 '${f.key}': options는 문자열 배열`);
      }
    }
  }
}

export function parseTemplateMd(src, path = '<memory>') {
  const { data, body } = parseFrontmatter(src, path);
  for (const k of ['slug', 'categoryId', 'title', 'description', 'order']) {
    if (data[k] === undefined) fail(path, `프런트매터에 ${k}가 없다`);
  }
  if (!Number.isInteger(data.order)) fail(path, `order는 정수여야 한다 — ${data.order}`);

  const secs = {};
  for (const name of SECTIONS) {
    const s = section(body, name);
    if (s === null) fail(path, `'## ${name}' 섹션이 없다`);
    secs[name] = s;
  }

  let fields;
  try {
    fields = JSON.parse(fenced(secs['필드'], path, '필드', 'json'));
  } catch (e) {
    if (e.message.startsWith(path)) throw e;
    fail(path, `필드 JSON 파싱 실패 — ${e.message}`);
  }
  checkFields(fields, path);

  return {
    template: {
      slug: data.slug,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      fields,
      template: fenced(secs['본문'], path, '본문', ''),
      anatomy: parseAnatomy(secs['해부'], path),
      tips: parseTips(secs['팁'], path),
    },
    order: data.order,
    promoted: data.promoted ?? null,
    tags: data.tags ?? [],
  };
}

export function serializeTemplateMd({ template: t, order, promoted, tags }) {
  const out = ['---', `tags: ${JSON.stringify(tags)}`];
  for (const k of ['slug', 'categoryId', 'title', 'description']) {
    out.push(`${k}: ${JSON.stringify(t[k])}`);
  }
  if (promoted) out.push(`promoted: ${JSON.stringify(promoted)}`);
  out.push(`order: ${order}`, '---', '', `# ${t.title}`, '');
  out.push(promoted ? `승격 [[${promoted}/DECISION|라운드]]` : '씨앗 — 사용자 제공 검증 프롬프트', '');
  out.push('## 필드', '', '```json', JSON.stringify(t.fields, null, 2), '```', '');
  out.push('## 본문', '', '```', t.template, '```', '');
  out.push('## 해부', '');
  for (const a of t.anatomy) out.push(`### ${a.part}`, '', `> ${a.quote}`, '', a.why, '');
  out.push('## 팁', '');
  for (const tip of t.tips) out.push(`- ${tip}`);
  out.push('');
  return out.join('\n');
}

export function parseCategoriesMd(src, path = '<memory>') {
  const { body } = parseFrontmatter(src, path);
  const sec = section(body, '카테고리');
  if (sec === null) fail(path, `'## 카테고리' 섹션이 없다`);
  let cats;
  try {
    cats = JSON.parse(fenced(sec, path, '카테고리', 'json'));
  } catch (e) {
    if (e.message.startsWith(path)) throw e;
    fail(path, `카테고리 JSON 파싱 실패 — ${e.message}`);
  }
  if (!Array.isArray(cats) || cats.length === 0) fail(path, '카테고리는 비지 않은 배열이어야 한다');
  for (const c of cats) {
    if (typeof c?.id !== 'string' || typeof c?.name !== 'string') {
      fail(path, `카테고리 항목은 {id, name} 문자열 쌍이어야 한다 — ${JSON.stringify(c)}`);
    }
    if (Object.keys(c).length !== 2) fail(path, `카테고리 '${c.id}': id·name 외 키 금지`);
  }
  return cats;
}

export function serializeCategoriesMd(categories) {
  return [
    '---',
    'tags: ["template", "index"]',
    '---',
    '',
    '# 카테고리',
    '',
    '라이브러리 카테고리 정의. 배열 순서가 앱의 표시 순서다.',
    '',
    '## 카테고리',
    '',
    '```json',
    JSON.stringify(categories, null, 2),
    '```',
    '',
  ].join('\n');
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/lib/template-md.test.mjs`
Expected: PASS — 12 tests

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/template-md.mjs scripts/lib/template-md.test.mjs
git commit -m "feat: 템플릿 마크다운 파서/직렬화기 + 왕복 테스트"
```

---

### Task 2: 라이브러리 생성기

**Files:**
- Create: `scripts/build-library.mjs`
- Test: `scripts/build-library.test.mjs`

**Interfaces:**
- Consumes: `parseTemplateMd`, `parseCategoriesMd` (Task 1)
- Produces:
  - `buildLibrary(libDir: string) => { categories, templates }` — `templates`는 `order` 오름차순 정렬된 `PromptTemplate[]`
  - `renderGeneratedTs({ categories, templates }) => string`
  - CLI: `node scripts/build-library.mjs [libDir] [outFile]` — 기본 `vault/50-library` → `app/src/data/templates.generated.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `scripts/build-library.test.mjs`:

```js
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

test('같은 입력이면 항상 같은 바이트를 낸다', () => {
  const dir = fixture([makeTemplate('one', 'writing', 1), makeTemplate('two', 'writing', 2)]);
  assert.equal(renderGeneratedTs(buildLibrary(dir)), renderGeneratedTs(buildLibrary(dir)));
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `node --test scripts/build-library.test.mjs`
Expected: FAIL — `Cannot find module .../scripts/build-library.mjs`

- [ ] **Step 3: 최소 구현 작성**

Create `scripts/build-library.mjs`:

```js
// vault/50-library/ 를 읽어 앱이 쓰는 파생 TS를 만든다.
// 원본은 볼트 마크다운이고 이 산출물은 커밋되지만 손으로 고치지 않는다.
// 사용: node scripts/build-library.mjs [libDir] [outFile]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parseTemplateMd, parseCategoriesMd } from './lib/template-md.mjs';

export function buildLibrary(libDir) {
  const catPath = join(libDir, '_categories.md');
  const categories = parseCategoriesMd(readFileSync(catPath, 'utf8'), catPath);
  const catIds = new Set(categories.map((c) => c.id));

  const files = readdirSync(libDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort();

  const entries = [];
  const seenSlug = new Map();
  const seenOrder = new Map();
  for (const f of files) {
    const path = join(libDir, f);
    const e = parseTemplateMd(readFileSync(path, 'utf8'), path);
    const t = e.template;
    if (basename(f, '.md') !== t.slug) {
      throw new Error(`${path} — 파일명과 slug가 다르다 (slug: ${t.slug})`);
    }
    if (seenSlug.has(t.slug)) {
      throw new Error(`${path} — slug 중복: ${t.slug} (${seenSlug.get(t.slug)}에도 있다)`);
    }
    seenSlug.set(t.slug, path);
    if (seenOrder.has(e.order)) {
      throw new Error(`${path} — order 중복: ${e.order} (${seenOrder.get(e.order)}에도 있다)`);
    }
    seenOrder.set(e.order, path);
    if (!catIds.has(t.categoryId)) {
      throw new Error(`${path} — 모르는 categoryId: ${t.categoryId}`);
    }
    checkTokens(t, path);
    entries.push(e);
  }

  entries.sort((a, b) => a.order - b.order);
  return { categories, templates: entries.map((e) => e.template) };
}

/** 본문 {{token}} ↔ fields[].key 양방향 일치 */
function checkTokens(t, path) {
  const tokens = new Set([...t.template.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]));
  const keys = new Set(t.fields.map((f) => f.key));
  for (const tok of tokens) {
    if (!keys.has(tok)) throw new Error(`${path} — 필드에 없는 토큰: {{${tok}}}`);
  }
  for (const k of keys) {
    if (!tokens.has(k)) throw new Error(`${path} — 본문에서 안 쓰이는 필드: ${k}`);
  }
}

export function renderGeneratedTs({ categories, templates }) {
  return [
    '// AUTO-GENERATED — vault/50-library/ 에서 생성됨. 직접 수정하지 마세요.',
    '// 재생성: node scripts/build-library.mjs',
    'import type { Category, PromptTemplate } from "./templates.types";',
    '',
    `export const CATEGORIES: Category[] = ${JSON.stringify(categories, null, 2)};`,
    '',
    `export const TEMPLATES: PromptTemplate[] = ${JSON.stringify(templates, null, 2)};`,
    '',
  ].join('\n');
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const libDir = process.argv[2] ?? 'vault/50-library';
  const outFile = process.argv[3] ?? 'app/src/data/templates.generated.ts';
  const lib = buildLibrary(libDir);
  writeFileSync(outFile, renderGeneratedTs(lib));
  console.log(`✓ ${outFile} — 템플릿 ${lib.templates.length}종 / 카테고리 ${lib.categories.length}종`);
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/build-library.test.mjs`
Expected: PASS — 11 tests

- [ ] **Step 5: 커밋**

```bash
git add scripts/build-library.mjs scripts/build-library.test.mjs
git commit -m "feat: 볼트 라이브러리 생성기 + 토큰·중복 검증"
```

---

### Task 3: 마이그레이션과 왕복 검증 (앱은 아직 안 건드림)

**Files:**
- Create: `scripts/migrate-templates.mjs` (일회용 — Task 6에서 삭제)
- Create: `scripts/__snapshots__/library-before.json`
- Create: `vault/50-library/_categories.md` + `vault/50-library/<slug>.md` × 28
- Test: `scripts/library-snapshot.test.mjs`

**Interfaces:**
- Consumes: `serializeTemplateMd`, `serializeCategoriesMd` (Task 1), `buildLibrary` (Task 2)
- Produces: `vault/50-library/` 29개 파일 — Task 4·5·6이 이걸 읽는다

- [ ] **Step 1: 마이그레이션 전 상태를 동결**

`scripts/__snapshots__/` 디렉토리를 만들고 현재 데이터를 뜬다:

```bash
mkdir -p scripts/__snapshots__
node --experimental-strip-types -e "
import('./app/src/data/templates.ts').then(m => {
  const fs = require('node:fs');
  fs.writeFileSync(
    'scripts/__snapshots__/library-before.json',
    JSON.stringify({ categories: m.CATEGORIES, templates: m.TEMPLATES }, null, 2) + '\n'
  );
  console.log('동결:', m.TEMPLATES.length, '종 /', m.CATEGORIES.length, '카테고리');
});
"
```

Expected: `동결: 28 종 / 11 카테고리`

- [ ] **Step 2: 실패하는 왕복 테스트 작성**

Create `scripts/library-snapshot.test.mjs`:

```js
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
```

- [ ] **Step 3: 테스트가 실패하는지 확인**

Run: `node --test scripts/library-snapshot.test.mjs`
Expected: FAIL — `ENOENT: no such file or directory, open 'vault/50-library/_categories.md'`

- [ ] **Step 4: 마이그레이션 스크립트 작성**

Create `scripts/migrate-templates.mjs`:

```js
// 일회용 — app/src/data/templates.ts 의 TEMPLATES 를 vault/50-library/ 마크다운으로 옮긴다.
// 옮기고 나면 이 스크립트는 삭제한다 (원본이 볼트로 넘어간 뒤에는 역방향이 존재하지 않는다).
// 사용: node --experimental-strip-types scripts/migrate-templates.mjs
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { serializeTemplateMd, serializeCategoriesMd } from './lib/template-md.mjs';

const OUT = 'vault/50-library';
const SEED_SLUGS = new Set([
  'youtube-script',
  'linkedin-post',
  'blog-draft',
  'thumbnail-image',
  'service-idea',
  'marketing-experiment',
  'meeting-summary',
  'interview-insights',
  'competitor-research',
  'code-review',
]);

const { TEMPLATES, CATEGORIES } = await import('../app/src/data/templates.ts');

// ledger 의 run 이름에서 slug 를 유도해 승격 라운드를 붙인다 (2026-07-24-business-proposal → business-proposal)
const runBySlug = new Map();
for (const line of readFileSync('vault/30-ledger/prompt-ledger.jsonl', 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const { run } = JSON.parse(line);
  const slug = run.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  runBySlug.set(slug, run);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, '_categories.md'), serializeCategoriesMd(CATEGORIES));

let promotedCount = 0;
for (const [i, t] of TEMPLATES.entries()) {
  const seed = SEED_SLUGS.has(t.slug);
  const promoted = seed ? null : (runBySlug.get(t.slug) ?? null);
  if (promoted) promotedCount++;
  const tags = ['template', seed ? 'seed' : t.categoryId];
  writeFileSync(
    join(OUT, `${t.slug}.md`),
    serializeTemplateMd({ template: t, order: i + 1, promoted, tags })
  );
}

const unresolved = TEMPLATES.filter(
  (t) => !SEED_SLUGS.has(t.slug) && !runBySlug.has(t.slug)
).map((t) => t.slug);
console.log(`✓ ${TEMPLATES.length}종 → ${OUT} (승격 링크 ${promotedCount}건, 씨앗 ${SEED_SLUGS.size}건)`);
if (unresolved.length) console.log(`⚠ 라운드 미유도: ${unresolved.join(', ')} — 손으로 promoted 를 채울 것`);
```

- [ ] **Step 5: 마이그레이션 실행**

Run: `node --experimental-strip-types scripts/migrate-templates.mjs`
Expected: `✓ 28종 → vault/50-library (승격 링크 N건, 씨앗 10건)`

`⚠ 라운드 미유도`가 나오면 해당 slug의 `.md`를 열어 `promoted:`를 손으로 채운다 — `vault/30-ledger/prompt-ledger.jsonl`에서 그 템플릿을 만든 run 폴더명을 찾아 넣는다. 대응하는 라운드가 실제로 없으면(수동 추가 템플릿) `promoted:` 줄을 지우고 `tags`에 `"seed"`를 넣는다.

- [ ] **Step 6: 왕복 테스트 통과 확인**

Run: `node --test scripts/library-snapshot.test.mjs`
Expected: PASS — 3 tests

실패하면 어떤 slug의 어떤 필드가 변했는지 assert 메시지에 나온다. 파서/직렬화기를 고치고(Task 1 테스트도 같이 늘린다) 마이그레이션을 다시 돌린다 — **마크다운을 손으로 고쳐서 맞추지 않는다.** 손으로 맞추면 다음 라운드에 같은 버그가 재발한다.

- [ ] **Step 7: 커밋**

```bash
git add scripts/migrate-templates.mjs scripts/library-snapshot.test.mjs scripts/__snapshots__ vault/50-library
git commit -m "feat: 템플릿 28종을 vault/50-library 마크다운으로 이관 + 왕복 동결 핀"
```

---

### Task 4: 앱 데이터 계층 전환

**Files:**
- Create: `app/src/data/templates.types.ts`
- Create: `app/src/data/templates.generated.ts` (생성)
- Modify: `app/src/data/templates.ts` (3,294줄 → 약 20줄)

**Interfaces:**
- Consumes: `buildLibrary`·`renderGeneratedTs` (Task 2), `vault/50-library/` (Task 3)
- Produces: `@/data/templates`가 기존과 동일한 `CATEGORIES` `TEMPLATES` `categoryName` `templateBySlug` + 타입 5종을 계속 내보낸다. 소비처 6곳은 무변경

- [ ] **Step 1: 타입 파일 분리**

Create `app/src/data/templates.types.ts` — 현재 `templates.ts`의 1~41행(타입 5종)을 **그대로** 옮긴다:

```ts
export type FieldType = "text" | "textarea" | "select";

export interface TemplateField {
  /** template 본문의 {{key}} 토큰과 매핑 */
  key: string;
  label: string;
  type: FieldType;
  /** 초보자용 입력 가이드 한 줄 */
  help?: string;
  placeholder?: string;
  /** select 타입의 제안 칩 — 칩을 눌러도 되고 직접 입력해도 된다 */
  options?: string[];
  /** true면 비워도 된다 — 비우면 해당 줄이 결과에서 제거된다 */
  optional?: boolean;
}

export interface AnatomyItem {
  /** 역할 / 맥락 / 요구사항 / 출력 형식 등 구조 요소 이름 */
  part: string;
  /** 템플릿에서 해당하는 부분 인용 */
  quote: string;
  /** 왜 이 요소가 결과 품질을 올리는가 */
  why: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PromptTemplate {
  slug: string;
  categoryId: string;
  title: string;
  description: string;
  fields: TemplateField[];
  /** {{key}} 토큰을 포함한 프롬프트 본문 */
  template: string;
  anatomy: AnatomyItem[];
  tips: string[];
}
```

- [ ] **Step 2: 파생 파일 생성**

Run: `node scripts/build-library.mjs`
Expected: `✓ app/src/data/templates.generated.ts — 템플릿 28종 / 카테고리 11종`

- [ ] **Step 3: 배럴 파일로 교체**

Replace the entire contents of `app/src/data/templates.ts` with:

```ts
// 라이브러리의 원본은 vault/50-library/*.md 다.
// CATEGORIES·TEMPLATES 는 templates.generated.ts (생성물) 에서 온다 — 그 파일을 손으로 고치지 마세요.
import type { PromptTemplate } from "./templates.types";
import { CATEGORIES, TEMPLATES } from "./templates.generated";

export type {
  FieldType,
  TemplateField,
  AnatomyItem,
  Category,
  PromptTemplate,
} from "./templates.types";
export { CATEGORIES, TEMPLATES };

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function templateBySlug(slug: string): PromptTemplate | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
```

- [ ] **Step 4: 타입·린트·빌드 통과 확인**

```bash
cd app && npm run lint && npm run build
```

Expected: 린트 경고 0, 빌드 성공, `/p/<slug>` 28개 라우트가 정적 생성됨.

린트가 `templates.generated.ts`의 인용된 프로퍼티명을 문제 삼으면 `app/eslint.config.mjs`의 `ignores`에 `"src/data/templates.generated.ts"`를 추가한다 — 생성물은 사람이 스타일을 맞출 대상이 아니다.

- [ ] **Step 5: 화면 확인**

```bash
cd app && npm run dev
```

`http://localhost:3200`에서 홈의 템플릿 28종이 **이전과 같은 순서로** 보이는지, 카테고리 필터가 11종 다 도는지, `/p/business-proposal`과 `/p/newsletter`에서 빈칸 폼·조립 미리보기·프롬프트 해부 패널이 정상인지 본다. `newsletter`는 개행이 든 placeholder를 가진 유일한 템플릿이라 반드시 포함한다.

확인 후 dev 서버를 끈다.

- [ ] **Step 6: 커밋**

```bash
git add app/src/data/templates.types.ts app/src/data/templates.generated.ts app/src/data/templates.ts app/eslint.config.mjs
git commit -m "refactor: 앱 라이브러리를 볼트 파생 생성물로 전환"
```

---

### Task 5: wiki-lint 검사와 참조 내보내기 소스 전환

**Files:**
- Modify: `scripts/wiki-lint.mjs`
- Modify: `scripts/export-references.mjs`

**Interfaces:**
- Consumes: `buildLibrary`·`renderGeneratedTs` (Task 2), `vault/50-library/` (Task 3), `templates.generated.ts` (Task 4)
- Produces: `node scripts/wiki-lint.mjs`가 라이브러리 포맷 위반과 파생물 드리프트에서 exit 1

- [ ] **Step 1: 드리프트를 실제로 만들어 실패를 확인**

```bash
printf '\n// 손으로 넣은 줄\n' >> app/src/data/templates.generated.ts
node scripts/wiki-lint.mjs; echo "exit=$?"
```

Expected: `exit=0` — 지금은 파생물 드리프트를 아무도 안 본다. 이게 RED다.

```bash
git checkout app/src/data/templates.generated.ts
```

- [ ] **Step 2: 검사 5종 추가**

Add to `scripts/wiki-lint.mjs`, 기존 검사들 뒤(요약 출력 직전)에:

```js
// 7. 라이브러리 포맷 + 파생물 일치
const LIB = join(VAULT, '50-library');
if (existsSync(LIB)) {
  let lib = null;
  try {
    lib = buildLibrary(LIB);
  } catch (e) {
    fails.push(`라이브러리 파싱 실패: ${e.message}`);
  }
  if (lib) {
    const catIds = new Set(lib.categories.map((c) => c.id));
    for (const t of lib.templates) {
      if (!catIds.has(t.categoryId)) fails.push(`${t.slug}: 모르는 categoryId ${t.categoryId}`);
      if (t.anatomy.length < 4) fails.push(`${t.slug}: 해부가 ${t.anatomy.length}항목 (4 이상이어야 함)`);
      if (t.tips.length < 2) fails.push(`${t.slug}: 팁이 ${t.tips.length}개 (2 이상이어야 함)`);
      if (t.template.includes('```')) fails.push(`${t.slug}: 본문에 코드펜스(\`\`\`)가 있어 파일 구조를 깬다`);
    }
    const GEN = 'app/src/data/templates.generated.ts';
    if (!existsSync(GEN)) {
      fails.push(`파생물 없음: ${GEN} — node scripts/build-library.mjs 실행 필요`);
    } else if (readFileSync(GEN, 'utf8') !== renderGeneratedTs(lib)) {
      fails.push(`파생물 드리프트: ${GEN} ≠ 볼트 재생성 결과 — node scripts/build-library.mjs 실행 필요`);
    }
  }
}

// 8. 후보 마크다운 형식 (새 라운드만 — 과거 라운드는 이력이라 소급하지 않는다)
const CAND_FROM = '2026-07-26';
for (const d of runDirs.filter((d) => d >= CAND_FROM)) {
  const candDir = join(VAULT, '20-generations', d, 'candidates');
  if (!existsSync(candDir)) continue;
  for (const f of readdirSync(candDir).filter((f) => f.endsWith('.md'))) {
    const p = join(candDir, f);
    const src = readFileSync(p, 'utf8');
    if (!/^## 필드$/m.test(src) || !/^```json$/m.test(src)) {
      fails.push(`후보 형식 위반: ${p} — '## 필드' 의 json 코드펜스가 없다`);
    }
  }
}
```

파일 상단 import에 추가:

```js
import { buildLibrary, renderGeneratedTs } from './build-library.mjs';
```

- [ ] **Step 3: 드리프트가 잡히는지 확인**

```bash
node scripts/wiki-lint.mjs; echo "exit=$?"
printf '\n// 손으로 넣은 줄\n' >> app/src/data/templates.generated.ts
node scripts/wiki-lint.mjs; echo "exit=$?"
git checkout app/src/data/templates.generated.ts
```

Expected: 첫 번째 `exit=0`, 두 번째는 `파생물 드리프트` 메시지와 함께 `exit=1`.

- [ ] **Step 4: 해부 4항목 미만도 잡히는지 확인**

마지막 해부 항목을 통째로 지워 4항목 미만을 만든다 (part 이름은 템플릿마다 다르므로 이름으로 찾지 않는다):

```bash
node -e "
const fs=require('node:fs');
const p='vault/50-library/cold-email.md';
const src=fs.readFileSync(p,'utf8');
const last=src.lastIndexOf('### ');
const tips=src.indexOf('## 팁');
fs.writeFileSync(p, src.slice(0,last) + src.slice(tips));
"
node scripts/wiki-lint.mjs; echo "exit=$?"
git checkout vault/50-library/cold-email.md
```

Expected: `cold-email: 해부가 3항목 (4 이상이어야 함)` 메시지와 `exit=1`.

- [ ] **Step 5: export-references 소스 전환**

`scripts/export-references.mjs`에서 TS import를 볼트 읽기로 바꾼다. 상단 두 줄을

```js
const { TEMPLATES, categoryName } = await import(
  join(root, 'app/src/data/templates.ts')
);
```

에서 다음으로 교체한다:

```js
import { buildLibrary } from './build-library.mjs';

const { templates: TEMPLATES, categories } = buildLibrary(join(root, 'vault/50-library'));
const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? id;
```

주석 2행의 "단일 소스는 templates.ts"도 "단일 소스는 vault/50-library"로 고친다.

- [ ] **Step 6: 산출물이 바이트 동일한지 확인**

```bash
cp -r vault/10-references /tmp/refs-before
node scripts/export-references.mjs
diff -r /tmp/refs-before vault/10-references && echo "IDENTICAL"
rm -rf /tmp/refs-before
```

Expected: `IDENTICAL` — `10-references/`의 위키링크가 하나도 안 깨진다.

`--experimental-strip-types` 없이 도는지도 확인한다(더 이상 TS를 읽지 않으므로 플래그가 필요 없다).

- [ ] **Step 7: 전체 lint 통과 + 커밋**

```bash
node --test scripts/lib/template-md.test.mjs scripts/build-library.test.mjs scripts/library-snapshot.test.mjs scripts/prompt-loop.test.mjs scripts/release-version.test.mjs
node scripts/wiki-lint.mjs
git add scripts/wiki-lint.mjs scripts/export-references.mjs
git commit -m "feat: wiki-lint에 라이브러리 포맷·파생물 드리프트 검사 추가"
```

---

### Task 6: prompt-evolve SKILL 갱신과 정리

**Files:**
- Modify: `.claude/skills/prompt-evolve/SKILL.md`
- Delete: `scripts/migrate-templates.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: 앞의 모든 태스크
- Produces: 다음 라운드(R20)가 새 승격 경로로 도는 스킬 문서

- [ ] **Step 1: GENERATE 후보 형식 교체**

`.claude/skills/prompt-evolve/SKILL.md`의 GENERATE 절에서 후보 저장 형식을 규정한 세 줄

```
- 각 후보는 다음 형식의 마크다운으로 `vault/20-generations/<run>/candidates/<variant>.md`에 저장:
  - 한 줄 컨셉 + fields 표 (key/label/type/optional/help/placeholder/options)
  - `{{key}}` 토큰을 쓴 template 본문 (4요소 구조 준수)
  - anatomy 4항목 + tips 2개 (라이브러리 승격 시 그대로 사용)
```

을 다음으로 바꾼다:

```
- 각 후보는 **라이브러리와 동일한 포맷**으로 `vault/20-generations/<run>/candidates/<variant>.md`에 저장한다 (승격이 번역이 아니라 파일 이동이 되도록):
  - `# 후보 <variant> — 한 줄 컨셉`
  - `## 필드` — ```json 코드펜스에 `[{key,label,type,help?,placeholder?,options?,optional?}]` 배열. **마크다운 표를 쓰지 않는다** (표는 열 수가 어긋나도 조용히 통과해 R18 승격본이 깨진 채 지나갔다)
  - `## 본문` — 언어 없는 코드펜스에 `{{key}}` 토큰을 쓴 template 본문 (4요소 구조 준수)
  - `## 해부` — `### <part>` 마다 `> 인용` 한 줄 + 설명 문단. **4항목 이상**
  - `## 팁` — `- ` 불릿 **2개 이상**
  - frontmatter는 후보 단계에선 쓰지 않는다 (slug/categoryId/title/description/order는 승격 때 정해진다)
```

- [ ] **Step 2: LEARN 승격 단계 교체**

같은 파일 LEARN 절의

```
- **승자를 라이브러리에 승격**: `app/src/data/templates.ts`의 `TEMPLATES`에 추가 (candidates/<variant>.md의 fields/template/anatomy/tips 그대로). 필요 시 `CATEGORIES`에 새 카테고리 추가.
```

을 다음으로 바꾼다:

```
- **승자를 라이브러리에 승격** (번역이 아니라 이동):
  1. `cp vault/20-generations/<run>/candidates/<승자>.md vault/50-library/<slug>.md`
  2. 그 파일 맨 위에 frontmatter를 붙인다 — `tags: ["template", "<categoryId>"]` / `slug` / `categoryId` / `title` / `description` / `promoted: "<run>"` / `order: <기존 최대 order + 1>`. 값은 전부 JSON 인용 문자열, `order`만 정수.
  3. `# 후보 <variant> — …` 제목 줄을 `# <title>` 로 바꾸고 그 아래에 `승격 [[<run>/DECISION|라운드]]` 한 줄을 남긴다.
  4. 새 카테고리가 필요하면 `vault/50-library/_categories.md`의 json 배열에 `{id, name}`을 추가한다.
  5. `node scripts/build-library.mjs` — `app/src/data/templates.generated.ts`가 갱신된다. **이 파일을 손으로 고치지 않는다.**
```

- [ ] **Step 3: 검증 단계에 순서 명시**

같은 파일 LEARN 절의 검증 줄

```
- 검증: `cd app && npm run lint && npm run build` 통과 확인 + **`node scripts/wiki-lint.mjs` 통과 확인**
```

을 다음으로 바꾼다 (생성이 lint보다 먼저 와야 드리프트 검사가 의미를 갖는다):

```
- 검증 (순서 고정): `node scripts/build-library.mjs` → `node scripts/wiki-lint.mjs` → `cd app && npm run lint && npm run build`. wiki-lint가 라이브러리 포맷(해부 4항목 이상·팁 2개 이상·토큰↔필드 양방향 일치·categoryId 유효)과 파생물 바이트 일치를 검사하므로, 생성을 건너뛰면 드리프트로 실패한다.
```

- [ ] **Step 4: 스킬 문서가 실제 경로와 맞는지 확인**

```bash
grep -n "templates.ts\|50-library\|build-library" .claude/skills/prompt-evolve/SKILL.md
```

Expected: `app/src/data/templates.ts` 언급이 남아 있지 않고(2행 헤더의 "라이브러리 `app/src/data/templates.ts`"도 `vault/50-library/`로 고친다), `50-library`와 `build-library`가 나온다.

- [ ] **Step 5: 일회용 스크립트 삭제와 README 갱신**

```bash
git rm scripts/migrate-templates.mjs
```

`README.md`의 구조 도식에서 `app/src/data/templates.ts # ★ 템플릿 라이브러리 = 데이터 (승격 대상)` 줄을 지우고, `vault/` 항목 아래에 `50-library/ # ★ 승격 템플릿 = 라이브러리 원본 (LEARN이 여기로 이동)`을 넣는다. "수동으로 템플릿 추가" 절의 `app/src/data/templates.ts의 TEMPLATES 배열에 객체 추가`를 `vault/50-library/<slug>.md 를 추가하고 node scripts/build-library.mjs 실행`으로 고친다.

- [ ] **Step 6: 전체 검증**

```bash
node --test scripts/lib/template-md.test.mjs scripts/build-library.test.mjs scripts/library-snapshot.test.mjs scripts/prompt-loop.test.mjs scripts/release-version.test.mjs
node scripts/wiki-lint.mjs
cd app && npm run lint && npm run build
```

Expected: 테스트 전부 PASS, wiki-lint exit 0, 린트 경고 0, 빌드 성공.

- [ ] **Step 7: 커밋**

```bash
git add .claude/skills/prompt-evolve/SKILL.md README.md
git commit -m "docs: prompt-evolve 승격 경로를 볼트 라이브러리로 교체 + 마이그레이션 스크립트 제거"
```

---

## 완료 후 (이 계획 밖)

S1은 여기서 끝난다. 다음 순서는 **사람이 판단해서** 진행한다:

1. PR 생성 → 리뷰 → 머지
2. **R20을 지켜보며 수동 1회 실행** — `/prompt-evolve "SNS 광고 카피 작성"`. 새 승격 경로가 실제로 도는지, `vault/50-library/`에 파일이 생기고 파생물이 갱신되는지 확인
3. 확인되면 클라우드 루틴 재개 — `RemoteTrigger update trig_01C7e66nxxHq8ELBMj5syCty {"enabled": true}`

**2번을 건너뛰고 3번을 하지 않는다.** 무인 파이프라인을 바꾼 뒤 첫 실행을 지켜보지 않으면, 실패해도 알림이 없다.
