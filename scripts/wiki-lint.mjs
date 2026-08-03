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

// 5a. 플러그인 번들 드리프트 (vault 원본 ↔ plugin 번들본) — FAIL
//     번들은 생성물이다. 손으로 고치지 말고 재생성한다.
//     WARN이던 시절엔 아무것도 막지 못했다 — DNA를 어긋내도, 라이브러리를 통째로 지워도 exit 0이었다.
const REGEN = 'node scripts/build-plugin-bundle.mjs 를 실행하라';
const pluginDnaPath = 'plugin/skills/reprompt/dna/prompt-principles.md';
const pluginLibDir = 'plugin/skills/reprompt/library';
const vaultLibDir = join(VAULT, '50-library');

if (existsSync(pluginDnaPath)) {
  const pluginDna = readFileSync(pluginDnaPath, 'utf8');
  if (pluginDna !== dna) {
    const vaultVer = dna.match(/DNA \((v[\d.]+)\)/)?.[1] ?? '?';
    const pluginVer = pluginDna.match(/DNA \((v[\d.]+)\)/)?.[1] ?? '?';
    // 버전이 같은데 바이트가 다른 경우가 있다 (같은 버전 안에서 본문만 수정) — 그때 "v1.18 ≠ v1.18"은 읽는 사람을 혼란시킨다
    const detail =
      vaultVer === pluginVer
        ? `버전은 ${vaultVer}로 같으나 내용이 다름`
        : `vault ${vaultVer} ≠ plugin ${pluginVer}`;
    fails.push(`플러그인 번들 DNA 드리프트: ${detail} — ${REGEN}`);
  }
} else {
  fails.push(`플러그인 번들 DNA 없음: ${pluginDnaPath} — ${REGEN}`);
}

if (existsSync(pluginLibDir)) {
  const vaultLibFiles = readdirSync(vaultLibDir).filter((f) => f.endsWith('.md')).sort();
  const bundleFiles = readdirSync(pluginLibDir).sort();

  // 볼트에 없는 파일이 번들에 잔존 (삭제 미전파)
  const stale = bundleFiles.filter((f) => !vaultLibFiles.includes(f));
  if (stale.length) fails.push(`플러그인 번들 잔존 파일: ${stale.join(', ')} — ${REGEN}`);

  // 번들에 빠진 파일
  const missing = vaultLibFiles.filter((f) => !bundleFiles.includes(f));
  if (missing.length) fails.push(`플러그인 번들 누락: ${missing.join(', ')} — ${REGEN}`);

  // 양쪽에 있는 파일의 바이트 일치
  const differing = vaultLibFiles
    .filter((f) => bundleFiles.includes(f))
    .filter((f) => readFileSync(join(vaultLibDir, f), 'utf8') !== readFileSync(join(pluginLibDir, f), 'utf8'));
  if (differing.length) fails.push(`플러그인 번들 내용 불일치: ${differing.join(', ')} — ${REGEN}`);
} else {
  fails.push(`플러그인 번들 라이브러리 없음: ${pluginLibDir} — ${REGEN}`);
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

// 9. SCENARIO 사실 누락 (새 라운드만 — 8과 같은 이유로 소급하지 않는다)
//    values.json 에만 있고 SCENARIO.md 에 없는 사실은, 심사자가 결과물의 정당한 문구를
//    창작·환각으로 오판하게 만든다. R1 재검·R11·R21 로 **세 번 재발**했고 SKILL.md 의
//    산문 경고로는 세 번 다 막지 못했다 — 그래서 기계 검사로 올린다.
//
//    한계(의도적): 수치와 축자 인용만 본다. R21 의 '극단적 얼리어답터', R23 의 성분 논란
//    배경 같은 **순수 산문**은 못 잡는다(4회 재발 중 2회가 이 부류). 필드 단위 n-gram
//    커버리지를 16개 라운드 전수로 실측해봤으나 오탐이 압도적이었다 — values 에는 사실이
//    아닌 지시(예: tone "담백하고 솔직하게")도 들어 있어 "모든 필드가 SCENARIO 에 있어야
//    한다"는 전제 자체가 틀렸다. 잡히는 것만 확실히 잡는다.
//
//    **조용한 건너뛰기 금지**: 초판은 `values.json` 하나만 찾고 없으면 continue 했다.
//    R22·R23 이 `values-a.json` 식으로 쪼개 쓰자 그대로 무검사 통과했고, 하필 그 라운드에서
//    4번째 재발이 났다. 검사가 "안 도는 것"과 "통과하는 것"은 구분돼야 한다.
const SCEN_FACTS_FROM = '2026-07-26';
const noComma = (s) => s.replaceAll(',', '');
/** 중첩 구조와 무관하게 모든 문자열 잎을 모은다 — values.json(후보별 키) / values-a.json(평면) 양쪽 대응. */
const stringLeaves = (x, out = []) => {
  if (typeof x === 'string') out.push(x);
  else if (x && typeof x === 'object') for (const v of Object.values(x)) stringLeaves(v, out);
  return out;
};
for (const d of runDirs.filter((d) => d >= SCEN_FACTS_FROM)) {
  const runDir = join(VAULT, '20-generations', d);
  const sp = join(runDir, 'SCENARIO.md');
  if (!existsSync(sp)) continue; // 아직 SCENARIO 를 안 쓴 진행 중 라운드 — 미완결 경고가 따로 있다

  const valueFiles = readdirSync(runDir).filter((f) => /^values.*\.json$/.test(f));
  if (!valueFiles.length) {
    fails.push(`SCENARIO 사실 대조 불가: ${d} — SCENARIO.md 는 있는데 values*.json 이 없다. 검사가 조용히 건너뛰지 않도록 실패로 알린다`);
    continue;
  }

  const scen = readFileSync(sp, 'utf8');
  const scenNoComma = noComma(scen);
  const missing = new Set();

  for (const f of valueFiles) {
    for (const v of stringLeaves(JSON.parse(readFileSync(join(runDir, f), 'utf8')))) {
      for (const m of v.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
        const n = noComma(m[0]);
        if (/^(19|20)\d{2}$/.test(n)) continue; // 연도는 SCENARIO 가 관례적으로 생략한다
        if (!scenNoComma.includes(n)) missing.add(`수치 ${m[0]}`);
      }
      for (const m of v.matchAll(/"([^"]{6,})"/g)) {
        const q = m[1].trim();
        if (!scen.includes(q)) missing.add(`인용 "${q.slice(0, 24)}…"`);
      }
    }
  }

  if (missing.size) {
    fails.push(
      `SCENARIO 사실 누락: ${d} — ${[...missing].join(', ')} 가 ${valueFiles.join('·')} 에만 있다. ` +
        `심사자는 SCENARIO 만 보고 대조하므로 정당한 문구를 창작으로 오판한다 — SCENARIO.md 에 명기하라`
    );
  }
}

// 11. plugin.json ↔ CHANGELOG 버전 일치
//     배포물이 바뀌면 버전을 올려야 전달된다 — `claude plugin update`가 버전을 비교하기 때문이다.
//     2026-08-04 실측: main 33종/DNA v1.22, 설치 캐시 32종/v1.21, plugin.json 미범프
//     → "already at the latest version (1.2.0)". 새 템플릿이 영영 전달되지 않았다.
//     버전만 올리고 CHANGELOG를 빠뜨리거나 그 반대인 경우를 여기서 잡는다.
{
  const pj = 'plugin/.claude-plugin/plugin.json';
  const cl = 'CHANGELOG.md';
  if (existsSync(pj) && existsSync(cl)) {
    const pv = JSON.parse(readFileSync(pj, 'utf8')).version;
    const cv = readFileSync(cl, 'utf8').match(/^## \[([\d.]+)\]/m)?.[1];
    if (pv !== cv) {
      fails.push(
        `버전 불일치: ${pj} = ${pv} ≠ CHANGELOG 최상단 = ${cv ?? '없음'}. 승격은 배포물 변경이므로 patch를 올리고 CHANGELOG에 같은 버전 섹션을 연다 (RELEASING.md 버전 정책)`
      );
    }
  }
}

// 10. 런 폴더 레이아웃 고정 (오늘 이후 라운드만)
//     SKILL 이 candidates/·outputs/ 만 못박고 values·assembled 를 열어둬서 라운드마다 갈라졌다:
//     R20·R21 은 values.json + assembled/, R22·R23 은 values-a.json + assembled-a.txt.
//     그 드리프트가 검사 9 를 조용히 무력화했다(경로가 안 맞아 무검사 통과, 4번째 재발 허용).
//     표준은 단일 파일(SCENARIO/SCORES/DECISION)과 디렉토리(candidates/outputs)의 기존 대비에 맞춘다.
const LAYOUT_FROM = '2026-08-02';
for (const d of runDirs.filter((d) => d >= LAYOUT_FROM)) {
  const runDir = join(VAULT, '20-generations', d);
  const names = readdirSync(runDir);
  if (!names.includes('SCENARIO.md')) continue; // 진행 중 라운드

  const stray = names.filter((f) => /^values-.+\.json$/.test(f) || /^assembled-.+\.txt$/.test(f));
  if (stray.length) {
    fails.push(
      `런 폴더 레이아웃 위반: ${d} — ${stray.join(', ')}. 표준은 values.json(후보별 키를 가진 단일 파일)과 assembled/<variant>.txt 다`
    );
  }
  if (!names.includes('values.json')) fails.push(`런 폴더 레이아웃 위반: ${d} — values.json 이 없다`);
  if (!names.includes('assembled')) fails.push(`런 폴더 레이아웃 위반: ${d} — assembled/ 디렉토리가 없다`);
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
