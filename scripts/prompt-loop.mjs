import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function appendLedger(entry, ledgerPath) {
  appendFileSync(ledgerPath, JSON.stringify(entry) + '\n');
}

export function recentDecisions(n, ledgerPath) {
  if (!existsSync(ledgerPath)) return [];
  const lines = readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean);
  return lines.slice(-n).map((l) => JSON.parse(l));
}

export function newRun(target, baseDir, dateStr) {
  const runPath = join(baseDir, `${dateStr}-${target}`);
  mkdirSync(join(runPath, 'candidates'), { recursive: true });
  mkdirSync(join(runPath, 'outputs'), { recursive: true });
  return runPath;
}

/** 후보 템플릿의 {{key}} 토큰을 테스트 시나리오 값으로 치환해 실행용 프롬프트를 만든다 */
export function assembleForTest(templateBody, values) {
  return templateBody
    .split('\n')
    .filter((line) => {
      const keys = [...line.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
      if (keys.length === 0) return true;
      return keys.some((k) => (values[k] ?? '').trim().length > 0);
    })
    .map((line) => line.replaceAll(/\{\{(\w+)\}\}/g, (_, k) => (values[k] ?? '').trim()))
    .join('\n');
}
