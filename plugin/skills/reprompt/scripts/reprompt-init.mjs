import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';

/**
 * 사용 기록 기본 경로 — 머신 전역이다. 다른 레포에서 깎은 것까지 집계돼야
 * "무엇을 반복하는가"가 보인다. 볼트 밖인 이유는 로그가 지식이 아니라 원료이기 때문이다.
 */
export const DEFAULT_USAGE_LOG = join(homedir(), '.reprompt', 'usage.jsonl');

/**
 * 사용 기록 1건을 JSONL로 append한다. append-only — 과거 기록을 덮어쓰지 않는다.
 * 로그는 부가 기능이므로 쓰기에 실패해도 호출자를 죽이지 않는다 (읽기 전용 홈, 권한 없음 등).
 * @returns {boolean} 기록 성공 여부
 */
export function appendUsage(entry, logPath = DEFAULT_USAGE_LOG) {
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    appendFileSync(logPath, JSON.stringify(entry) + '\n');
    return true;
  } catch {
    return false;
  }
}

export const FILE_NAMES = ['BRIEF.md', 'PROMPT.md', 'RATIONALE.md', 'OUTPUT.md', 'INSPECTION.md'];
export const TARGETS = ['general', 'coding', 'image', 'research'];

/** 작업 문자열을 파일시스템 안전 slug으로 변환한다 (한글 유지, ≤60자). */
export function slugify(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('slugify: 비어 있지 않은 문자열이 필요합니다');
  }
  const base = text
    .trim()
    .toLowerCase()
    .replaceAll(/[<>:"/\\|?*\s]/g, '-') // 파일시스템 금지문자·공백 → 하이픈
    .replaceAll(/-+/g, '-')
    .slice(0, 60);
  const slug = base.replaceAll(/^-+|-+$/g, '');
  if (!slug) {
    throw new Error('slugify: slug이 비었습니다 (모두 금지문자)');
  }
  return slug;
}

/**
 * 세션 폴더를 만들고 meta.json을 기록한다. 콘텐츠 파일(BRIEF 등)은 스킬이 채운다.
 * 입력 opts를 변형하지 않고 새 meta 객체를 만든다.
 */
export function initRun(opts) {
  const {
    task,
    target,
    dnaVersion,
    createdAt,
    dateStr,
    outBase = '.reprompt',
    usageLog = DEFAULT_USAGE_LOG,
  } = opts;
  if (!task || !String(task).trim()) throw new Error('initRun: task가 필요합니다');
  if (!TARGETS.includes(target)) {
    throw new Error(`initRun: target은 ${TARGETS.join('|')} 중 하나여야 합니다 (받음: ${target})`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr ?? '')) {
    throw new Error('initRun: dateStr은 YYYY-MM-DD 형식이어야 합니다');
  }
  const slug = slugify(task);
  const runDir = join(outBase, `${dateStr}-${slug}`);
  mkdirSync(runDir, { recursive: true });
  const files = [...FILE_NAMES, 'meta.json'];
  const meta = {
    task,
    target,
    dna_version: dnaVersion ?? null,
    created_at: createdAt ?? null,
    files,
  };
  const metaPath = join(runDir, 'meta.json');
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');

  // 사용 기록 — 반복되는 작업을 감지해 진화 백로그 타깃을 제안하는 원료가 된다.
  // 집계·제안은 아직 없다(S3). 지금은 시계를 돌려두는 것이 목적이다.
  const usageLogged =
    usageLog === false
      ? false
      : appendUsage(
          {
            task,
            target,
            dna_version: dnaVersion ?? null,
            created_at: createdAt ?? null,
            slug,
          },
          usageLog
        );

  return { runDir, slug, files, metaPath, usageLogged };
}
