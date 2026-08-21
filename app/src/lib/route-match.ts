import type { Item } from "@/data/landing.generated";

/**
 * 스킬 0단계의 "라이브러리 히트 판정"을 로컬에서 결정론적으로 흉내낸 것.
 * 진짜 스킬은 의미로 판단하지만(LLM), 여기서는 제목·설명·출력형식의 어절 겹침으로 점수를 낸다.
 * 히트하면 1층(검증된 뼈대), 아니면 2층(DNA 4요소로 새로 깎기) — 스킬의 라우팅과 같은 갈래다.
 */
export interface Routed {
  layer: 1 | 2;
  hit: Item | null;
  score: number;
}

const STOP = new Set([
  "만들어줘", "써줘", "해줘", "하고", "싶어", "좀", "저는", "제가", "우리", "그리고",
  "위한", "관련", "대한", "있는", "하는", "것", "수", "때", "좀더", "please",
]);

/** 한국어는 조사가 붙어 정확 일치가 취약하다 — 2글자 이상 어간만 남겨 부분 포함으로 본다 */
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOP.has(w));
}

/** 조사·어미 길이를 모르므로 뒤에서 한 글자씩 깎은 후보를 모두 만들어 하나라도 걸리면 히트로 본다.
 *  ("요건을" → 요건을 / 요건, "대조하고" → 대조하고 / 대조하 / 대조) */
function stems(word: string): string[] {
  const out = [word];
  if (word.length >= 3) out.push(word.slice(0, -1));
  if (word.length >= 4) out.push(word.slice(0, -2));
  return out;
}

function overlap(query: string[], target: string): number {
  const hay = target.toLowerCase();
  let n = 0;
  for (const q of query) {
    if (stems(q).some((s) => s.length >= 2 && hay.includes(s))) n += 1;
  }
  return n;
}

export function routeTask(task: string, items: Item[]): Routed {
  const q = tokens(task);
  if (q.length === 0) return { layer: 2, hit: null, score: 0 };

  let best: Item | null = null;
  let bestScore = 0;

  for (const it of items) {
    // 제목 일치를 가장 무겁게 — 사용자는 보통 산출물 이름으로 말한다
    const s =
      overlap(q, it.title) * 3 +
      overlap(q, it.desc) * 1 +
      overlap(q, it.outputs.join(" ")) * 1;
    if (s > bestScore) {
      bestScore = s;
      best = it;
    }
  }

  // 어절 2개 이상이 걸려야 1층으로 본다 — 한 단어 우연 일치로 뼈대를 잘못 고르지 않게
  return bestScore >= 3 && best
    ? { layer: 1, hit: best, score: bestScore }
    : { layer: 2, hit: null, score: bestScore };
}

/** 4요소 칸에 무엇이 들어갈지 — 1층이면 그 템플릿에서, 2층이면 DNA 기본 골격에서 */
export function slotsFor(task: string, routed: Routed): { name: string; text: string; need: boolean }[] {
  const subject = task.trim() || "[확인 필요] 무엇을 만들지";

  if (routed.layer === 1 && routed.hit) {
    const it = routed.hit;
    return [
      { name: "역할", text: `${it.title}를 작성하는 실무자`, need: false },
      { name: "맥락", text: `${it.fields}개 빈칸을 채워 넣습니다`, need: true },
      { name: "요구사항", text: `R${it.round ?? "—"} 승격본의 검증된 요구사항을 그대로 사용`, need: false },
      { name: "출력 형식", text: it.outputs.slice(0, 3).join(" · ") || it.desc, need: false },
    ];
  }

  return [
    { name: "역할", text: `${subject}를 맡은 담당자`, need: false },
    { name: "맥락", text: "[확인 필요] 대상 · 목적 · 분량", need: true },
    { name: "요구사항", text: "검증 가능한 기준으로 변환 — 형용사만 쓰지 않습니다", need: false },
    { name: "출력 형식", text: "[확인 필요] 받아서 바로 쓸 모양", need: true },
  ];
}
