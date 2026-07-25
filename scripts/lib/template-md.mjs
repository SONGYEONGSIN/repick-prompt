// 템플릿 마크다운 ↔ 객체 변환. vault/50-library/ 가 라이브러리의 단일 원본이므로
// 이 모듈이 그 포맷의 유일한 계약이다. 모르는 문법을 만나면 던진다 — 조용한 오파싱 금지.

import assert from 'node:assert/strict';

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

/** 섹션 안 첫 코드펜스의 내용. lang이 다르면 던진다. 코드펜스 후 내용이 있으면 던진다. */
function fenced(lines, path, what, lang) {
  const open = lines.findIndex((l) => l.startsWith('```'));
  if (open === -1) fail(path, `'## ${what}' 섹션에 코드펜스가 없다`);
  const got = lines[open].slice(3).trim();
  if (got !== lang) fail(path, `'## ${what}' 코드펜스 언어가 '${lang}'이 아니다 — '${got}'`);
  const close = lines.indexOf('```', open + 1);
  if (close === -1) fail(path, `'## ${what}' 코드펜스가 닫히지 않았다`);
  // 코드펜스 후 비어있지 않은 내용이 있으면 던진다 (파싱 불가능)
  for (let i = close + 1; i < lines.length; i++) {
    if (lines[i].trim() !== '') {
      fail(path, `'## ${what}' 코드펜스 후 내용이 있다 (파싱 불가능)`);
    }
  }
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
  // 콘텐츠가 이 포맷으로 표현 가능한지 검증 — 조용한 손실 방지
  const slug = t.slug;

  // Direct guards for fields emitted raw or in multiple places (Fix Round 3)
  // order is emitted raw in frontmatter as `order: ${order}` — must be safe
  if (!Number.isInteger(order) || order < 0) {
    fail(slug, `order는 음이 아닌 정수여야 한다 (파싱 불가능)`);
  }

  // title is emitted raw in heading as `# ${t.title}` — must be single line
  if (t.title.includes('\n')) {
    fail(slug, `title에 개행이 있다 (파싱 불가능)`);
  }

  // promoted is emitted raw in body line `승격 [[${promoted}/...]]` — must be single line
  if (promoted && promoted.includes('\n')) {
    fail(slug, `promoted에 개행이 있다 (파싱 불가능)`);
  }

  // template 본문: 정확히 ``` 줄이 있으면 파싱 불가능
  for (const line of t.template.split('\n')) {
    if (line === '```') {
      fail(slug, 'template 본문에 코드펜스 줄이 있다 (파싱 불가능)');
    }
  }

  // 해부 항목 검증
  for (const a of t.anatomy) {
    // part는 단일 줄로만 작성됨 (### ${a.part}) — 개행 불가
    if (a.part.includes('\n')) {
      fail(slug, `해부 항목의 part에 개행이 있다 (파싱 불가능)`);
    }
    // quote는 단일 줄로만 작성됨 (> ${a.quote}) — 개행 불가
    if (a.quote.includes('\n')) {
      fail(slug, `해부 '${a.part}' 인용에 개행이 있다 (파싱 불가능)`);
    }
    // why 텍스트: ###, ##, > 로 시작하는 줄이 있으면 파싱 불가능
    for (const line of a.why.split('\n')) {
      if (line.startsWith('### ')) {
        fail(slug, `해부 '${a.part}' 설명에 '### ' 줄이 있다 (파싱 불가능)`);
      }
      if (line.startsWith('## ')) {
        fail(slug, `해부 '${a.part}' 설명에 '## ' 줄이 있다 (파싱 불가능)`);
      }
      if (line.startsWith('> ')) {
        fail(slug, `해부 '${a.part}' 설명에 '> ' 줄이 있다 (파싱 불가능)`);
      }
    }
  }

  // 팁: 단일 줄로만 작성됨 — 개행 불가
  for (const tip of t.tips) {
    if (tip.includes('\n')) {
      fail(slug, `팁에 개행이 있다 (파싱 불가능)`);
    }
  }

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
  const md = out.join('\n');

  // Round-trip self-check: serialize → parse → compare (Fix Round 3)
  // 이 검증이 열거식 검증이 놓친 미래의 콜리전을 모두 잡는 보호막이다
  try {
    const parsed = parseTemplateMd(md, slug);
    // 왕복 후 동일한지 검증 (promoted의 null 정규화 포함)
    assert.deepStrictEqual(parsed, { template: t, order, promoted: promoted ?? null, tags });
  } catch (e) {
    // 이미 경로 에러면 재던짐
    if (e.message.includes(' — ')) throw e;
    // 어서션 에러 → 왕복 실패
    if (e instanceof assert.AssertionError) {
      fail(slug, `왕복 검증 실패 (콘텐츠가 손상됨)`);
    }
    // 파싱 에러
    fail(slug, `왕복 파싱 실패 — ${e.message}`);
  }

  return md;
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
