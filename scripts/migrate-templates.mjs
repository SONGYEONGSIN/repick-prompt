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
