// wiki-lint — 볼트 지식 위생 검사 (Karpathy LLM wiki 패턴의 lint 작업 채택)
// 검사: 깨진 위키링크 / 홈 체인 누락 라운드 / ledger↔DECISION 정합 /
//       MEMORY 200줄 cap / DNA 플레인 인용 잔존 / 미완결 라운드(경고)
// 사용: node scripts/wiki-lint.mjs  (실패 시 exit 1)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { buildLibrary, renderGeneratedTs } from './build-library.mjs';
import { section, fenced } from './lib/template-md.mjs';

const VAULT = 'vault';
const fails = [];
const warns = [];

function mdFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...mdFiles(p));
    else if (e.endsWith('.md')) out.push(p);
  }
  return out;
}
const files = mdFiles(VAULT);
const byBase = new Map();
for (const f of files) {
  const b = basename(f, '.md');
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(f);
}

// 1. 깨진 위키링크
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = m[1].trim();
    const candidates = target.includes('/')
      ? [join(VAULT, target + '.md'), join(VAULT, '20-generations', target + '.md')]
      : [join(VAULT, target + '.md')];
    const resolved =
      candidates.some(existsSync) || (!target.includes('/') && byBase.has(target));
    if (!resolved) fails.push(`깨진 링크 [[${target}]] in ${f}`);
  }
}

// 2. 홈 체인: 모든 라운드 폴더가 결정 체인에 존재
const home = readFileSync(join(VAULT, '🏠 Prompt Evolution.md'), 'utf8');
const runDirs = readdirSync(join(VAULT, '20-generations')).filter((d) =>
  statSync(join(VAULT, '20-generations', d)).isDirectory()
);
for (const d of runDirs) {
  if (!home.includes(`[[${d}/DECISION`)) fails.push(`홈 결정 체인 누락: ${d}`);
}

// 3. ledger ↔ DECISION 정합
const ledger = readFileSync(join(VAULT, '30-ledger/prompt-ledger.jsonl'), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l));
for (const e of ledger) {
  if (!existsSync(join(VAULT, '20-generations', e.run, 'DECISION.md')))
    fails.push(`ledger run에 DECISION 없음: ${e.run}`);
}

// 4. MEMORY 200줄 cap
const memLines = readFileSync(join(VAULT, '00-principles/MEMORY.md'), 'utf8').split('\n').length;
if (memLines > 200) fails.push(`MEMORY.md ${memLines}줄 — 200줄 cap 초과`);

// 5. DNA 플레인 인용 잔존 (위키링크 규칙 위반)
const dna = readFileSync(join(VAULT, '00-principles/prompt-principles.md'), 'utf8');

// 5a. 플러그인 폴백 DNA 드리프트 (vault DNA ↔ plugin 번들본) — WARN
const pluginDnaPath = 'plugin/skills/reprompt/dna/prompt-principles.md';
if (existsSync(pluginDnaPath)) {
  const pluginDna = readFileSync(pluginDnaPath, 'utf8');
  if (pluginDna !== dna) {
    const vaultVer = dna.match(/DNA \((v[\d.]+)\)/)?.[1] ?? '?';
    const pluginVer = pluginDna.match(/DNA \((v[\d.]+)\)/)?.[1] ?? '?';
    warns.push(
      `플러그인 폴백 DNA 드리프트: vault ${vaultVer} ≠ plugin ${pluginVer} — cp vault/00-principles/prompt-principles.md ${pluginDnaPath}`
    );
  }
}

// 5b. DNA 비대 임계 — 200줄 근접 시 two-tier(요약 DNA + 원칙별 entity 페이지) 전환 검토
const dnaLines = dna.split('\n').length;
if (dnaLines >= 200)
  fails.push(`DNA ${dnaLines}줄 — 200줄 도달: two-tier 전환 실행 (요약 DNA 유지 + 원칙별 상세 페이지 분리)`);
else if (dnaLines >= 170)
  warns.push(`DNA ${dnaLines}줄 — 200줄 임계 근접 (170+): two-tier 전환 준비 검토`);
for (const [i, line] of dna.split('\n').entries()) {
  if (/^##? /.test(line) || line.startsWith('- v1')) continue; // 개정 이력 제외
  if (/[(（/ ]R\d+(-[a-z])?[:~ )]/.test(line) && !/\[\[[^\]]*\|R\d+/.test(line))
    warns.push(`DNA 플레인 인용 의심 (line ${i + 1}): ${line.slice(0, 40)}…`);
}

// 6. 미완결 라운드 (경고): SCORES 또는 DECISION 없는 run 폴더
for (const d of runDirs) {
  for (const need of ['SCORES.md', 'DECISION.md']) {
    if (!existsSync(join(VAULT, '20-generations', d, need)))
      warns.push(`미완결 라운드: ${d} — ${need} 없음`);
  }
}

// 7. 라이브러리 포맷 + 파생물 일치
const LIB = join(VAULT, '50-library');
if (!existsSync(LIB)) {
  fails.push(`라이브러리 디렉토리 없음: ${LIB}`);
} else {
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
    const lines = readFileSync(p, 'utf8').split('\n');
    for (const heading of ['필드', '본문', '해부', '팁']) {
      const sec = section(lines, heading);
      if (sec === null) {
        fails.push(`후보 형식 위반: ${p} — '## ${heading}' 섹션이 없다`);
        continue;
      }
      if (heading === '필드') {
        try {
          JSON.parse(fenced(sec, p, '필드', 'json'));
        } catch (e) {
          fails.push(`후보 형식 위반: ${p} — 필드 json 파싱 실패 (${e.message})`);
        }
      }
    }
  }
}

for (const w of warns) console.log('WARN', w);
for (const f of fails) console.log('FAIL', f);
console.log(
  `\nwiki-lint: ${files.length} files, ${runDirs.length} runs — ${fails.length} fail, ${warns.length} warn`
);
process.exit(fails.length ? 1 : 0);
