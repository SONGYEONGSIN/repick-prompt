# reprompt 릴리즈 + 플러그인 루트 좁히기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `reprompt` 플러그인의 배포 단위를 `plugin/` 서브트리로 좁혀 캐시 bloat를 없애고, 반복 가능한 릴리즈 워크플로우(CHANGELOG + RELEASING 런북 + 버전 헬퍼)를 세우고, v1.0.0을 로컬에서 릴리즈 준비(dry-run)한다. 실제 push·공개는 하지 않는다.

**Architecture:** Narrow-2 — 마켓플레이스 파일은 레포 루트 `.claude-plugin/marketplace.json`에 유지하고 `source`만 `./plugin`으로, 플러그인 본체(plugin.json + skills/reprompt/)만 `plugin/`으로 `git mv`. 설치 시 마켓플레이스 루트=레포 루트지만 복사 단위=플러그인 source(`./plugin`)이라 캐시엔 `plugin/`만 담긴다(프로토타입 실측). 릴리즈는 문서 런북 + 순수·테스트된 버전 헬퍼.

**Tech Stack:** Claude Code plugin, `claude` CLI v2.1.216 (`plugin validate`/`marketplace`/`install`/`tag`), Node.js 22 (ESM, node:test).

## Global Constraints

- **Narrow-2 레이아웃**: `.claude-plugin/marketplace.json`은 레포 루트 유지(`plugins[0].source: "./plugin"`); `plugin.json`은 `plugin/.claude-plugin/plugin.json`; 스킬은 `plugin/skills/reprompt/`.
- 설치·검증 명령 불변: `claude plugin marketplace add ./`(또는 GitHub URL), `claude plugin validate .`.
- 설치 캐시에는 `plugin/` 서브트리만(vault/app/docs 제외) — 도그푸드로 실증.
- 첫 릴리즈 version `1.0.0`; **실제 태그 생성·push 금지**(dry-run까지만).
- `release-version` 헬퍼: 순수·불변·semver 경계검증, ESM + node:test (기존 `reprompt-init.mjs` 패턴).
- `reprompt` 스킬 내용/`$CLAUDE_SKILL_DIR` 설계/헬퍼 인터페이스는 스코프 A·C에서 확정 — 변경 금지(위치만 이동).
- 스코프 A·C 히스토리 문서는 재작성하지 않는다. 설치/릴리즈 절차의 권위 출처는 새 `RELEASING.md`.

---

## File Structure

- `plugin/.claude-plugin/plugin.json` — `.claude-plugin/plugin.json`에서 이동. Task 1.
- `plugin/skills/reprompt/` — `skills/reprompt/`에서 git mv. Task 1.
- `.claude-plugin/marketplace.json` — 레포 루트 유지, `source` 수정. Task 1.
- `scripts/release-version.mjs` (+ `.test.mjs`) — 버전 헬퍼. Task 2.
- `CHANGELOG.md`, `RELEASING.md` — 릴리즈 이력·런북. Task 3.

---

## Task 1: 플러그인 루트 좁히기 (Narrow-2)

**Files:**
- Move: `.claude-plugin/plugin.json` → `plugin/.claude-plugin/plugin.json`
- Move: `skills/reprompt/` → `plugin/skills/reprompt/` (git mv)
- Modify: `.claude-plugin/marketplace.json` (source)

**Interfaces:**
- Consumes: 스코프 C의 플러그인(루트 매니페스트 + `skills/reprompt/`).
- Produces: `plugin/`이 배포 단위. `claude plugin validate .` 통과, 설치 캐시에 `plugin/`만.

- [ ] **Step 1: plugin/ 구조로 이동**

Run:
```bash
mkdir -p plugin/.claude-plugin
git mv .claude-plugin/plugin.json plugin/.claude-plugin/plugin.json
git mv skills plugin/skills
```

- [ ] **Step 2: 마켓플레이스 source 수정**

`.claude-plugin/marketplace.json`에서:
```
      "source": "./",
```
을 다음으로 교체:
```
      "source": "./plugin",
```

- [ ] **Step 3: 이동·구조 확인**

Run:
```bash
test -f plugin/.claude-plugin/plugin.json && test -f plugin/skills/reprompt/SKILL.md && test -f .claude-plugin/marketplace.json && echo "LAYOUT OK"
test ! -e .claude-plugin/plugin.json && test ! -d skills && echo "OLD PATHS GONE"
git log --follow --oneline -- plugin/skills/reprompt/scripts/reprompt-init.mjs | head -3
grep '"source"' .claude-plugin/marketplace.json
```
Expected: `LAYOUT OK`; `OLD PATHS GONE`; `--follow`에 스코프 A/C 커밋 표시; source가 `"./plugin"`.

- [ ] **Step 4: 이동 후 유닛 테스트 통과**

Run: `node --test plugin/skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: 12 tests, 12 pass, 0 fail.

- [ ] **Step 5: `claude plugin validate .` 통과**

Run: `claude plugin validate . 2>&1 | tail -5`
Expected: `✔ Validation passed` (0 errors; 경고 0 목표).

- [ ] **Step 6: 도그푸드 — 설치 캐시에 bloat 없음 실증 + 정리**

Run (전역 상태를 건드리므로 반드시 정리):
```bash
claude plugin marketplace add ./ </dev/null 2>&1 | tail -2
claude plugin install reprompt@repick-prompt </dev/null 2>&1 | tail -2
C=$(find "$HOME/.claude/plugins/cache/repick-prompt" -type d -name reprompt 2>/dev/null | head -1)
echo "cache: $C"
echo "--- vault/app/docs present in cache? (기대: 없음) ---"
(find "$C" \( -name '*.tsx' -o -path '*vault*' -o -path '*/app/*' \) 2>/dev/null | head -1 | grep -q . && echo "BLOAT PRESENT (FAIL)" || echo "NO BLOAT (plugin subtree only)")
echo "--- skill files present? ---"
test -f "$C"/*/skills/reprompt/SKILL.md && echo "SKILL PRESENT"
# 정리
claude plugin uninstall reprompt@repick-prompt </dev/null 2>&1 | tail -1
claude plugin marketplace remove repick-prompt </dev/null 2>&1 | tail -1
(claude plugin list </dev/null 2>&1 | grep -iq reprompt && echo "STILL PRESENT") || echo "CLEANED"
```
Expected: `NO BLOAT (plugin subtree only)`, `SKILL PRESENT`, `CLEANED`. 만약 `BLOAT PRESENT`면 STOP하고 보고(Narrow-2 가정 위반 — 재설계 필요).

- [ ] **Step 7: 커밋**

```bash
git add -A .claude-plugin plugin skills
git commit -m "refactor: 플러그인 루트를 plugin/으로 좁힘(Narrow-2) — 설치 bloat 제거"
```

---

## Task 2: release-version 버전 헬퍼 (TDD)

**Files:**
- Create: `scripts/release-version.mjs`
- Test: `scripts/release-version.test.mjs`

**Interfaces:**
- Produces:
  - `readVersion(pluginJsonPath: string): string`
  - `bumpVersion(pluginObj: object, newVersion: string): object` — 새 객체(불변). 잘못된 semver/비객체면 throw.
  - `writeVersion(pluginJsonPath: string, newVersion: string): void` — 2-space + 끝 개행.

- [ ] **Step 1: 실패하는 테스트 작성**

Create `scripts/release-version.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readVersion, bumpVersion, writeVersion } from './release-version.mjs';

function tmpPlugin(obj) {
  const dir = mkdtempSync(join(tmpdir(), 'relver-'));
  const p = join(dir, 'plugin.json');
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  return { dir, p };
}

test('readVersion은 plugin.json의 version을 읽는다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0' });
  assert.equal(readVersion(p), '1.0.0');
  rmSync(dir, { recursive: true, force: true });
});

test('bumpVersion은 version만 바꾼 새 객체를 반환하고 입력을 변형하지 않는다', () => {
  const orig = { name: 'reprompt', version: '1.0.0', keywords: ['x'] };
  const snap = JSON.stringify(orig);
  const next = bumpVersion(orig, '1.1.0');
  assert.equal(next.version, '1.1.0');
  assert.equal(next.name, 'reprompt');
  assert.deepEqual(next.keywords, ['x']);
  assert.equal(JSON.stringify(orig), snap);
});

test('bumpVersion은 잘못된 semver면 throw한다', () => {
  assert.throws(() => bumpVersion({ version: '1.0.0' }, 'v1.2'), /semver/);
  assert.throws(() => bumpVersion({ version: '1.0.0' }, '1.2'), /semver/);
});

test('bumpVersion은 객체가 아니면 throw한다', () => {
  assert.throws(() => bumpVersion(null, '1.0.0'), /객체/);
});

test('writeVersion은 version을 갱신하고 다른 필드를 보존한다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0', description: 'd' });
  writeVersion(p, '2.0.0');
  const back = JSON.parse(readFileSync(p, 'utf8'));
  assert.equal(back.version, '2.0.0');
  assert.equal(back.name, 'reprompt');
  assert.equal(back.description, 'd');
  rmSync(dir, { recursive: true, force: true });
});

test('writeVersion은 끝에 개행을 남긴다', () => {
  const { dir, p } = tmpPlugin({ name: 'reprompt', version: '1.0.0' });
  writeVersion(p, '1.0.1');
  assert.ok(readFileSync(p, 'utf8').endsWith('}\n'));
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/release-version.test.mjs`
Expected: FAIL — `Cannot find module '.../release-version.mjs'`.

- [ ] **Step 3: 최소 구현 작성**

Create `scripts/release-version.mjs`:
```js
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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/release-version.test.mjs`
Expected: 6 tests, 6 pass, 0 fail.

- [ ] **Step 5: 커밋**

```bash
git add scripts/release-version.mjs scripts/release-version.test.mjs
git commit -m "feat: release-version 헬퍼(readVersion/bumpVersion/writeVersion) + 테스트"
```

---

## Task 3: CHANGELOG + RELEASING + v1.0.0 dry-run 준비

**Files:**
- Create: `CHANGELOG.md`
- Create: `RELEASING.md`

**Interfaces:**
- Consumes: Task 1(plugin/ 레이아웃), Task 2(release-version 헬퍼).

- [ ] **Step 1: CHANGELOG.md 작성**

Create `CHANGELOG.md`:
```markdown
# Changelog

이 프로젝트의 주요 변경을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/), 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.0.0] - 2026-07-21

### Added
- `reprompt` 메타프롬프팅 스킬 — 대화 맥락을 프롬프트 DNA(v1.14)로 맞춤 프롬프트로 깎아 `.reprompt/<날짜>-<slug>/`에 6파일(BRIEF/PROMPT/RATIONALE/OUTPUT/INSPECTION.md + meta.json)로 산출·실행·점검하는 6단계 루프.
- 실행환경 변환 4타깃: general / coding(Goal 중지요건 + Ultracode 제약) / image(구도·피사체·스타일·조명·카메라) / research(출처·범위·검증).
- Claude Code 플러그인 패키징: `plugin/` 배포 단위 + 자체 마켓플레이스(`repick-prompt`), `${CLAUDE_SKILL_DIR}` 기반 이식성, 번들 DNA.
```

- [ ] **Step 2: RELEASING.md 작성**

Create `RELEASING.md`:
```markdown
# 릴리즈 절차

`reprompt` 플러그인의 배포 단위는 `plugin/`, 마켓플레이스는 레포 루트 `.claude-plugin/marketplace.json`(`source: "./plugin"`). 설치 시 캐시에는 `plugin/`만 복사된다.

## 새 버전 릴리즈

1. 버전 범프 — `plugin/.claude-plugin/plugin.json`의 `version`:
   ```bash
   node -e "import('./scripts/release-version.mjs').then(m=>m.writeVersion('plugin/.claude-plugin/plugin.json', process.argv[1]))" 1.1.0
   ```
2. `CHANGELOG.md` 최상단에 새 버전 섹션(`## [1.1.0] - YYYY-MM-DD`) 추가.
3. 커밋: `git commit -am "chore(release): v1.1.0"`.
4. 검증: `claude plugin validate .` (0 errors).
5. 태그 + push: `claude plugin tag ./plugin --push -m "reprompt %s"` (→ `reprompt--v1.1.0` 생성·origin push) + `git push origin main`.
6. 설치자 갱신: `claude plugin marketplace update` + `claude plugin update reprompt`.

## 사용자 설치

```bash
claude plugin marketplace add https://github.com/SONGYEONGSIN/repick-prompt
claude plugin install reprompt@repick-prompt
```
다음 세션부터 `/reprompt` 활성화. (로컬 개발: `claude plugin marketplace add ./`)

## dry-run 검증

실제 태그 없이: `claude plugin tag ./plugin --dry-run`
```

- [ ] **Step 3: v1.0.0 릴리즈 준비 검증 (dry-run, push 없음)**

Run:
```bash
node -e "import('./scripts/release-version.mjs').then(m=>console.log('version:', m.readVersion('plugin/.claude-plugin/plugin.json')))"
claude plugin validate . 2>&1 | tail -3
claude plugin tag ./plugin --dry-run 2>&1 | tail -8
```
Expected: `version: 1.0.0`; validate 통과; dry-run이 `reprompt--v1.0.0`(또는 `reprompt--v1.0.0` 형태 태그)을 만들 것이라 보고, **실제 태그·push 없음**. 만약 `./plugin` 경로 인자로 enclosing 마켓플레이스를 못 찾으면 `claude plugin tag . --dry-run`(레포 루트)로 재시도하고 결과를 기록.

- [ ] **Step 4: 태그 미생성 확인 (push/tag 금지 준수)**

Run: `git tag -l 'reprompt--*'`
Expected: 빈 출력(dry-run이라 실제 태그 없음). 태그가 생성됐다면 `git tag -d`로 제거.

- [ ] **Step 5: 커밋**

```bash
git add CHANGELOG.md RELEASING.md
git commit -m "docs: CHANGELOG(v1.0.0) + RELEASING 런북"
```

---

## Self-Review

**Spec coverage:**
- Narrow-2 좁히기(plugin/로 이동, source→./plugin, 캐시 실증) → Task 1. ✅
- release-version 헬퍼(순수·불변·semver, 테스트) → Task 2. ✅
- CHANGELOG + RELEASING 런북 → Task 3 Step 1-2. ✅
- v1.0.0 dry-run 준비(태그·push 없음) → Task 3 Step 3-4. ✅
- 설치 명령 불변(add ./ / GitHub URL) → RELEASING.md + Task 1 도그푸드. ✅
- git mv 이력 보존 → Task 1 Step 3. ✅
- 히스토리 문서 미재작성 → RELEASING.md가 권위, 스코프 A/C 문서 불변. ✅

**Placeholder scan:** 모든 스텝에 실제 명령/코드/JSON. Task 3 Step 3의 `./plugin`↔`.` 폴백은 CLI 실측 대응이지 미완 플레이스홀더 아님. ✅

**Type consistency:** `readVersion/bumpVersion/writeVersion` 시그니처가 Task 2 정의 ↔ Task 3 호출(`writeVersion`, `readVersion`)에서 일치. `reprompt-init` 인터페이스 불변. ✅

## 후속

- 실제 GitHub push·공개(사용자), CI 자동화, 웹앱 UI, DNA 역류 학습.
