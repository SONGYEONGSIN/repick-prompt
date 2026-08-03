import { readFileSync, writeFileSync } from 'node:fs';

const SEMVER = /^\d+\.\d+\.\d+$/;

/** plugin.json의 version 문자열을 읽는다. */
export function readVersion(pluginJsonPath) {
  return JSON.parse(readFileSync(pluginJsonPath, 'utf8')).version;
}

/** version만 교체한 새 객체를 반환한다(입력 불변). semver/객체 검증. */
export function bumpVersion(pluginObj, newVersion) {
  if (typeof pluginObj !== 'object' || pluginObj === null) {
    throw new Error('bumpVersion: plugin 객체가 필요합니다');
  }
  if (!SEMVER.test(newVersion ?? '')) {
    throw new Error(`bumpVersion: semver(MAJOR.MINOR.PATCH) 형식이어야 합니다 (받음: ${newVersion})`);
  }
  return { ...pluginObj, version: newVersion };
}

/** plugin.json을 읽어 version을 갱신해 다시 쓴다(2-space + 끝 개행). */
export function writeVersion(pluginJsonPath, newVersion) {
  const obj = JSON.parse(readFileSync(pluginJsonPath, 'utf8'));
  const bumped = bumpVersion(obj, newVersion);
  writeFileSync(pluginJsonPath, JSON.stringify(bumped, null, 2) + '\n');
}

/**
 * 패치 자리만 1 올린 semver 문자열을 반환한다.
 * 진화 라운드 승격은 데이터 변경이라 patch다 (RELEASING.md 버전 정책).
 */
export function nextPatch(version) {
  if (!SEMVER.test(version ?? '')) {
    throw new Error(`nextPatch: semver(MAJOR.MINOR.PATCH) 형식이어야 합니다 (받음: ${version})`);
  }
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

/**
 * plugin.json의 패치를 올려 파일에 쓰고 새 버전을 반환한다.
 * 무인 라운드가 매일 실행하므로 한 줄로 부를 수 있어야 한다 —
 * 취약한 인라인 표현식을 SKILL에 적어두면 그게 실패 표면이 된다.
 */
export function bumpPatch(pluginJsonPath) {
  const next = nextPatch(readVersion(pluginJsonPath));
  writeVersion(pluginJsonPath, next);
  return next;
}
