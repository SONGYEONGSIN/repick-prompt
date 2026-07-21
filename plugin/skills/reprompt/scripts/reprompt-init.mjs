import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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
  const { task, target, dnaVersion, createdAt, dateStr, outBase = '.reprompt' } = opts;
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
  return { runDir, slug, files, metaPath };
}
