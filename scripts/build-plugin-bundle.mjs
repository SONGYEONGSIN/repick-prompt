// 볼트 원본 → 플러그인 번들 생성. 변환 없는 바이트 복사다.
//
// 왜 사본이 존재하나: 플러그인은 볼트가 없는 레포에서도 동작해야 하므로 DNA와 승격 라이브러리를
// 데이터로 실어 나른다("공장은 집에 두고 제품만 배포한다"). 사본은 없앨 수 없고, 대신
// 수동 cp 가 아니라 이 스크립트의 산출물로 둔다 — 드리프트는 wiki-lint 가 바이트 비교로 차단한다.
//
// 번들 포맷이 볼트와 동일하기 때문에 reprompt 의 레포-내 경로와 스탠드얼론 경로가 같은 코드가 된다.

import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

export const DNA_SRC = '00-principles/prompt-principles.md';
export const LIBRARY_SRC = '50-library';
export const DNA_DEST = 'dna/prompt-principles.md';
export const LIBRARY_DEST = 'library';

/**
 * 볼트의 DNA와 라이브러리를 플러그인 번들로 복사한다.
 * 대상 라이브러리 디렉토리는 먼저 비운다 — 복사만 하면 볼트에서 삭제된 파일이 번들에 잔존한다.
 * @returns {{dnaVersion: string|null, templateCount: number}}
 */
export function buildBundle({ vaultDir, pluginDir }) {
  const dna = readFileSync(join(vaultDir, DNA_SRC), 'utf8');
  const dnaDest = join(pluginDir, DNA_DEST);
  mkdirSync(join(dnaDest, '..'), { recursive: true });
  writeFileSync(dnaDest, dna);

  const srcLib = join(vaultDir, LIBRARY_SRC);
  const destLib = join(pluginDir, LIBRARY_DEST);

  // 잔존물 제거 후 재생성 — 삭제 전파
  rmSync(destLib, { recursive: true, force: true });
  mkdirSync(destLib, { recursive: true });

  const names = readdirSync(srcLib).filter((f) => statSync(join(srcLib, f)).isFile());
  for (const name of names) {
    writeFileSync(join(destLib, name), readFileSync(join(srcLib, name)));
  }

  return {
    dnaVersion: dna.match(/DNA \((v[\d.]+)\)/)?.[1] ?? null,
    templateCount: names.filter((f) => f.endsWith('.md') && f !== '_categories.md').length,
  };
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const vaultDir = process.argv[2] ?? 'vault';
  const pluginDir = process.argv[3] ?? 'plugin/skills/reprompt';
  const { dnaVersion, templateCount } = buildBundle({ vaultDir, pluginDir });
  console.log(`✓ ${pluginDir} — DNA ${dnaVersion} + 라이브러리 ${templateCount}종 번들`);
}
