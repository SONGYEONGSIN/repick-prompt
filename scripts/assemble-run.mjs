// 라운드의 후보 템플릿들을 values.json의 시나리오 값으로 조립해 실행용 프롬프트를 만든다.
// 실행: node scripts/assemble-run.mjs vault/20-generations/<run>
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { assembleForTest } from './prompt-loop.mjs';

const runDir = process.argv[2];
if (!runDir) {
  console.error('사용법: node scripts/assemble-run.mjs vault/20-generations/<run>');
  process.exit(1);
}

const values = JSON.parse(readFileSync(join(runDir, 'values.json'), 'utf8'));
const outDir = join(runDir, 'assembled');
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(join(runDir, 'candidates')).filter((f) => f.endsWith('.md'))) {
  const variant = basename(file, '.md');
  const md = readFileSync(join(runDir, 'candidates', file), 'utf8');
  const match = md.match(/## (?:본문|template)\s*\n+```\n?([\s\S]*?)```/);
  if (!match) {
    console.error(`✗ ${file}: "## template" 코드블록을 찾지 못함`);
    process.exit(1);
  }
  if (!values[variant]) {
    console.error(`✗ ${file}: values.json에 "${variant}" 값 세트 없음`);
    process.exit(1);
  }
  const assembled = assembleForTest(match[1].trimEnd(), values[variant]);
  const leftover = [...assembled.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  if (leftover.length > 0) {
    console.error(`✗ ${variant}: 치환되지 않은 토큰 — ${leftover.join(', ')}`);
    process.exit(1);
  }
  writeFileSync(join(outDir, `${variant}.txt`), assembled);
  console.log(`✓ assembled/${variant}.txt (${assembled.length}자)`);
}
