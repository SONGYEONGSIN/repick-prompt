// vault/50-library/ 를 읽어 앱이 쓰는 파생 TS를 만든다.
// 원본은 볼트 마크다운이고 이 산출물은 커밋되지만 손으로 고치지 않는다.
// 사용: node scripts/build-library.mjs [libDir] [outFile]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parseTemplateMd, parseCategoriesMd } from './lib/template-md.mjs';

export function buildLibrary(libDir) {
  const catPath = join(libDir, '_categories.md');
  let categories;
  try {
    categories = parseCategoriesMd(readFileSync(catPath, 'utf8'), catPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(`${catPath} — 파일을 찾을 수 없다 (볼트 디렉토리인지 확인하세요)`);
    }
    throw e;
  }
  const catIds = new Set(categories.map((c) => c.id));

  const files = readdirSync(libDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort(); // Ensures deterministic error attribution when multiple files are invalid

  // Pass 1: Read all files, parse, and check for global duplicates
  const entries = [];
  const seenSlug = new Map();
  const seenOrder = new Map();
  for (const f of files) {
    const path = join(libDir, f);
    let src;
    try {
      src = readFileSync(path, 'utf8');
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error(`${path} — 파일을 찾을 수 없다 (볼트 디렉토리인지 확인하세요)`);
      }
      throw e;
    }
    const entry = parseTemplateMd(src, path);
    const t = entry.template;
    if (seenSlug.has(t.slug)) {
      throw new Error(`${path} — slug 중복: ${t.slug} (${seenSlug.get(t.slug)}에도 있다)`);
    }
    seenSlug.set(t.slug, path);
    if (seenOrder.has(entry.order)) {
      throw new Error(`${path} — order 중복: ${entry.order} (${seenOrder.get(entry.order)}에도 있다)`);
    }
    seenOrder.set(entry.order, path);
    entries.push({ path, entry });
  }

  // Pass 2: Check individual file constraints
  for (const { path, entry: e } of entries) {
    const f = basename(path);
    const t = e.template;
    if (basename(f, '.md') !== t.slug) {
      throw new Error(`${path} — 파일명과 slug가 다르다 (slug: ${t.slug})`);
    }
    if (!catIds.has(t.categoryId)) {
      throw new Error(`${path} — 모르는 categoryId: ${t.categoryId}`);
    }
    checkTokens(t, path);
  }

  entries.sort((a, b) => a.entry.order - b.entry.order);
  return { categories, templates: entries.map((e) => e.entry.template) };
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
