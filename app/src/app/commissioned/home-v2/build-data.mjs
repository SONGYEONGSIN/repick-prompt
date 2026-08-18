// 볼트(vault/)에서 홈 v2 프로토타입이 쓰는 데이터를 뽑아 data.ts 를 만든다.
// 카드에 붙는 "나오는 것"과 "실제 결과"는 지어낸 값이 아니라 전부 볼트 실물에서 온다.
// 실행: node app/src/app/commissioned/home-v2/build-data.mjs
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..", "..", ".."); // app/src/app/commissioned/home-v2 → repo root
const LIB = join(ROOT, "vault", "50-library");
const GEN = join(ROOT, "vault", "20-generations");
const LEDGER = join(ROOT, "vault", "30-ledger", "prompt-ledger.jsonl");
const MEMORY = join(ROOT, "vault", "00-principles", "MEMORY.md");

// 기존 11 카테고리를 "산출물 종류" 단일 축 7개로 묶는다.
// 현재 분포는 축이 섞여 있고(글쓰기=행위, 이메일=형식, 커리어=주제) 4개는 2종 이하다.
const GROUP_OF = {
  report: "doc", summary: "doc",
  analysis: "audit",
  email: "message",
  writing: "content",
  planning: "plan", research: "plan",
  build: "make", coding: "make", image: "make",
  career: "career",
};
const GROUP_NAMES = [
  ["doc", "문서·보고"],
  ["audit", "분석·검증"],
  ["message", "메시지"],
  ["content", "글·콘텐츠"],
  ["plan", "기획·리서치"],
  ["make", "만들기"],
  ["career", "커리어"],
];

function frontmatter(src, key) {
  const m = src.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, "m"));
  return m ? m[1].trim() : "";
}

function bodyBlock(src) {
  const m = src.match(/## (?:본문|template)\s*\n+```\n?([\s\S]*?)```/);
  return m ? m[1] : "";
}

/** 본문 "출력 형식:" 절의 항목들 — 카드가 약속하는 "나오는 것" */
function outputLines(body) {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => /^\s*출력\s*형식/.test(l));
  if (start < 0) return [];
  const out = [];
  for (const line of lines.slice(start + 1)) {
    const m = line.match(/^\s*-\s+(.*\S)\s*$/);
    if (!m) {
      if (out.length) break;
      continue;
    }
    // 괄호 안 부연은 카드에서 덜어낸다 — 한 줄에 들어가야 하기 때문
    out.push(m[1].replace(/\s*[(（][^)）]*[)）]\s*$/, "").trim());
    if (out.length === 4) break;
  }
  return out;
}

function fieldCount(src) {
  const m = src.match(/## 필드\s*\n+```json\n([\s\S]*?)```/);
  if (!m) return 0;
  try {
    return JSON.parse(m[1]).length;
  } catch {
    return 0;
  }
}

/** run 슬러그 → 라운드 번호 (vault/00-principles/MEMORY.md 가 정본) */
function roundMap() {
  const map = new Map();
  if (!existsSync(MEMORY)) return map;
  for (const line of readFileSync(MEMORY, "utf8").split("\n")) {
    const m = line.match(/^-\s*R(\d+)\s+(\d{4}-\d{2}-\d{2})\s+([\w-]+)/);
    if (m) map.set(`${m[2]}-${m[3]}`, Number(m[1]));
  }
  return map;
}

/** run 슬러그 → { winner, score } (ledger 가 정본) */
function ledgerMap() {
  const map = new Map();
  if (!existsSync(LEDGER)) return map;
  for (const line of readFileSync(LEDGER, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const e = JSON.parse(line);
      if (e.run && e.candidate) {
        map.set(e.run, { winner: e.candidate, score: e.metrics?.judge_score ?? null });
      }
    } catch {
      /* 깨진 줄은 건너뛴다 — ledger 는 append-only 라 마지막 줄이 잘릴 수 있다 */
    }
  }
  return map;
}

/** 승자 후보의 실제 산출물 발췌 — 예상이 아니라 실측 결과물 */
function sampleOf(run, winner) {
  const path = join(GEN, run, "outputs", `${winner}.md`);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8")
    .replace(/^---[\s\S]*?---\n/, "")
    .split("\n")
    .filter((l) => !/^\s*$/.test(l))
    .slice(0, 14)
    .join("\n");
  return raw.length > 900 ? `${raw.slice(0, 900)}…` : raw;
}

const rounds = roundMap();
const ledger = ledgerMap();

const items = [];
for (const file of readdirSync(LIB).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort()) {
  const src = readFileSync(join(LIB, file), "utf8");
  const categoryId = frontmatter(src, "categoryId");
  const group = GROUP_OF[categoryId];
  if (!group) throw new Error(`${file} — 새 카테고리 ${categoryId} 는 그룹 매핑에 없다`);
  const run = frontmatter(src, "promoted");
  const led = run ? ledger.get(run) : null;
  items.push({
    slug: basename(file, ".md"),
    title: frontmatter(src, "title"),
    desc: frontmatter(src, "description"),
    group,
    outputs: outputLines(bodyBlock(src)),
    fields: fieldCount(src),
    round: run && rounds.has(run) ? rounds.get(run) : null,
    score: led?.score ?? null,
    sample: run && led ? sampleOf(run, led.winner) : null,
  });
}

// 정렬 기준이 되는 순서는 빌드 시점에 고정한다 — 런타임에 Date 를 쓰지 않기 위해서다.
items.sort((a, b) => (b.round ?? -1) - (a.round ?? -1) || a.title.localeCompare(b.title, "ko"));

const groups = GROUP_NAMES.map(([id, name]) => ({
  id,
  name,
  count: items.filter((i) => i.group === id).length,
}));

const ts = [
  "// AUTO-GENERATED — vault/ 에서 생성됨. 직접 수정하지 마세요.",
  "// 재생성: node app/src/app/commissioned/home-v2/build-data.mjs",
  "",
  "export interface Group {",
  "  id: string;",
  "  name: string;",
  "  count: number;",
  "}",
  "",
  "export interface Item {",
  "  slug: string;",
  "  title: string;",
  "  desc: string;",
  "  group: string;",
  "  outputs: string[];",
  "  fields: number;",
  "  round: number | null;",
  "  score: number | null;",
  "  sample: string | null;",
  "}",
  "",
  `export const GROUPS: Group[] = ${JSON.stringify(groups, null, 2)};`,
  "",
  `export const ITEMS: Item[] = ${JSON.stringify(items, null, 2)};`,
  "",
  `export const ROUND_TOTAL = ${Math.max(...items.map((i) => i.round ?? 0))};`,
  `export const WITH_SAMPLE = ${items.filter((i) => i.sample).length};`,
  "",
].join("\n");

writeFileSync(join(HERE, "data.ts"), ts);
console.log(
  `✓ data.ts — 템플릿 ${items.length}종 / 그룹 ${groups.length}개 / 실제 산출물 ${items.filter((i) => i.sample).length}종`
);
