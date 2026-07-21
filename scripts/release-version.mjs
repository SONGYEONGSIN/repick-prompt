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
