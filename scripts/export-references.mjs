// 라이브러리(templates.ts)의 씨앗 프롬프트를 vault/10-references/ 참조 파일로 내보낸다.
// 단일 소스는 templates.ts — 이 스크립트는 언제든 재생성 가능하다.
// 실행: node --experimental-strip-types scripts/export-references.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { TEMPLATES, categoryName } = await import(
  join(root, 'app/src/data/templates.ts')
);

const outDir = join(root, 'vault/10-references');
mkdirSync(outDir, { recursive: true });

// 10-references는 씨앗 전용 — 루프 생성물(cold-email 등)은 내보내지 않는다 (prompt-evolve SKILL 금지 조항)
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

const seeds = TEMPLATES.filter((t) => SEED_SLUGS.has(t.slug));
for (const t of seeds) {
  const body = [
    '---',
    `tags: [reference, seed, ${t.categoryId}]`,
    '---',
    '',
    `# ${t.title} — 씨앗 프롬프트`,
    '',
    `- 카테고리: ${categoryName(t.categoryId)}`,
    `- 출처: 사용자 제공 검증 프롬프트 (라이브러리 slug: \`${t.slug}\`)`,
    `- 요약: ${t.description}`,
    '',
    '## 구조 강점',
    ...t.anatomy.map((a) => `- **${a.part}** — ${a.why}`),
    '',
    '## 본문',
    '',
    '```',
    t.template,
    '```',
    '',
  ].join('\n');
  writeFileSync(join(outDir, `${t.slug}.prompt.md`), body);
  console.log(`✓ ${t.slug}.prompt.md`);
}
console.log(`\n${seeds.length}개 씨앗 참조 내보내기 완료 → vault/10-references/`);
