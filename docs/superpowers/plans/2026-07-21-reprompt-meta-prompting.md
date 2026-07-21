# reprompt 메타프롬프팅 스킬 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 대화 맥락을 DNA 기준으로 맞춤 프롬프트로 깎아 `.reprompt/` 폴더에 파일로 산출하고, 그 프롬프트로 작업을 실행·점검하는 `reprompt` 스킬을 만든다.

**Architecture:** 인라인 단계형 Claude Code 스킬(`.claude/skills/reprompt/SKILL.md`)이 메인 에이전트를 6단계(덤핑→질문→깎기+환경변환→게이트→실행→점검)로 안내한다. 결정적 폴더/메타 조작은 스킬 폴더에 번들된 테스트 완비 helper(`scripts/reprompt-init.mjs`)가 담당하고, 품질 기준은 번들 DNA 사본(`dna/prompt-principles.md`)이 담당해 다른 레포에서도 이식 동작한다.

**Tech Stack:** Node.js 22 (ESM `.mjs`), `node:test` + `node:assert/strict`, Claude Code 스킬(Markdown + frontmatter).

## Global Constraints

- 산출 폴더 경로: `.reprompt/<YYYY-MM-DD>-<작업-slug>/` (현재 작업 디렉토리 기준, vault 경로 비의존).
- 산출 파일 6종 정확히: `BRIEF.md` / `PROMPT.md` / `RATIONALE.md` / `OUTPUT.md` / `INSPECTION.md` / `meta.json`.
- 실행환경 변환 타깃 4종: `general` | `coding` | `image` | `research`.
- 프롬프트 뼈대는 DNA 4요소: 역할 / 맥락 / 요구사항 / 출력 형식.
- anti-slop: 형용사만 있는 요구("멋지게", "개쩌는 X") 금지 — 검증 가능한 요구사항으로.
- raw에 없는 실데이터 창작 금지 — 없으면 `[확인 필요]`로 남긴다.
- 코딩 스타일: 입력 불변(새 객체 생성), 시스템 경계 입력 검증(throw), 파일당 단일 책임.
- 스크립트·테스트·DNA는 모두 스킬 폴더(`.claude/skills/reprompt/`) 안에 둔다 — 플러그인 이식성.
- 날짜/시간은 절대 암산 금지 — `date` 명령 결과를 스킬이 helper에 주입.

---

## File Structure

- `.claude/skills/reprompt/SKILL.md` — 스킬 지시문(6단계 흐름·질문·게이트·판정). Task 2.
- `.claude/skills/reprompt/scripts/reprompt-init.mjs` — `slugify`, `initRun` 결정적 helper. Task 1.
- `.claude/skills/reprompt/scripts/reprompt-init.test.mjs` — helper 테스트. Task 1.
- `.claude/skills/reprompt/dna/prompt-principles.md` — vault DNA 번들 사본(이식성). Task 2.

---

## Task 1: reprompt-init 결정적 helper (slugify + initRun)

**Files:**
- Create: `.claude/skills/reprompt/scripts/reprompt-init.mjs`
- Test: `.claude/skills/reprompt/scripts/reprompt-init.test.mjs`

**Interfaces:**
- Produces:
  - `slugify(text: string): string` — 파일시스템 안전 slug(한글 유지, ≤60자). 빈 문자열이면 throw.
  - `initRun(opts): { runDir: string, slug: string, files: string[], metaPath: string }`
    - `opts = { task: string, target: 'general'|'coding'|'image'|'research', dnaVersion?: string, createdAt?: string, dateStr: string, outBase?: string }`
    - 폴더 생성 + `meta.json` 기록. 콘텐츠 파일은 스킬이 채운다.
  - `export const FILE_NAMES: string[]` — `['BRIEF.md','PROMPT.md','RATIONALE.md','OUTPUT.md','INSPECTION.md']`
  - `export const TARGETS: string[]` — `['general','coding','image','research']`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `.claude/skills/reprompt/scripts/reprompt-init.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { slugify, initRun, FILE_NAMES, TARGETS } from './reprompt-init.mjs';

test('slugify는 공백을 하이픈으로 바꾸고 한글을 유지한다', () => {
  assert.equal(slugify('콜드 아웃리치 이메일'), '콜드-아웃리치-이메일');
});

test('slugify는 파일시스템 금지 문자를 제거하고 연속 하이픈을 축약한다', () => {
  assert.equal(slugify('a/b:  c?*d'), 'a-b-c-d');
});

test('slugify는 양끝 하이픈을 제거하고 소문자화한다', () => {
  assert.equal(slugify('  Hello World  '), 'hello-world');
});

test('slugify는 60자로 자른다', () => {
  assert.ok(slugify('가'.repeat(100)).length <= 60);
});

test('slugify는 빈 문자열이면 throw한다', () => {
  assert.throws(() => slugify('   '), /비어 있지 않은/);
});

test('initRun은 폴더와 meta.json을 만들고 경로를 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const r = initRun({
    task: '콜드 아웃리치 이메일',
    target: 'general',
    dnaVersion: 'v1.14',
    createdAt: '2026-07-21T09:00:00Z',
    dateStr: '2026-07-21',
    outBase: dir,
  });
  assert.ok(r.runDir.endsWith('2026-07-21-콜드-아웃리치-이메일'));
  assert.ok(existsSync(r.metaPath));
  const meta = JSON.parse(readFileSync(r.metaPath, 'utf8'));
  assert.equal(meta.task, '콜드 아웃리치 이메일');
  assert.equal(meta.target, 'general');
  assert.equal(meta.dna_version, 'v1.14');
  assert.deepEqual(meta.files, [...FILE_NAMES, 'meta.json']);
  rmSync(dir, { recursive: true, force: true });
});

test('initRun은 잘못된 target이면 throw한다', () => {
  assert.throws(
    () => initRun({ task: 'x', target: 'nope', dateStr: '2026-07-21' }),
    /target/,
  );
});

test('initRun은 잘못된 dateStr이면 throw한다', () => {
  assert.throws(
    () => initRun({ task: 'x', target: 'general', dateStr: '2026/07/21' }),
    /YYYY-MM-DD/,
  );
});

test('initRun은 입력 객체를 변형하지 않는다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reprompt-'));
  const opts = { task: 'x', target: 'general', dateStr: '2026-07-21', outBase: dir };
  const snapshot = JSON.stringify(opts);
  initRun(opts);
  assert.equal(JSON.stringify(opts), snapshot);
  rmSync(dir, { recursive: true, force: true });
});

test('TARGETS는 4종 타깃을 담는다', () => {
  assert.deepEqual(TARGETS, ['general', 'coding', 'image', 'research']);
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `node --test .claude/skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: FAIL — `Cannot find module '.../reprompt-init.mjs'`

- [ ] **Step 3: 최소 구현 작성**

Create `.claude/skills/reprompt/scripts/reprompt-init.mjs`:

```js
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
  return base.replaceAll(/^-+|-+$/g, '');
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
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test .claude/skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: PASS — 10 tests pass, 0 fail

- [ ] **Step 5: 커밋**

```bash
git add .claude/skills/reprompt/scripts/reprompt-init.mjs .claude/skills/reprompt/scripts/reprompt-init.test.mjs
git commit -m "feat: reprompt-init helper (slugify + initRun) with tests"
```

---

## Task 2: SKILL.md + 번들 DNA

**Files:**
- Create: `.claude/skills/reprompt/dna/prompt-principles.md` (vault에서 복사)
- Create: `.claude/skills/reprompt/SKILL.md`

**Interfaces:**
- Consumes: Task 1의 `slugify`, `initRun`, `FILE_NAMES`, `TARGETS` (스킬이 `node -e`로 호출).
- Produces: `/reprompt` 스킬 — 사용자가 호출 시 6단계 실행 후 `.reprompt/<날짜>-<slug>/`에 6개 파일 생성.

- [ ] **Step 1: vault DNA를 스킬 번들로 복사**

Run:
```bash
mkdir -p .claude/skills/reprompt/dna
cp vault/00-principles/prompt-principles.md .claude/skills/reprompt/dna/prompt-principles.md
```

- [ ] **Step 2: 복사 확인 (버전 라인 일치)**

Run: `head -1 .claude/skills/reprompt/dna/prompt-principles.md`
Expected: `# Prompt Principles — RE:PROMPT 템플릿 DNA (v1.14)`

- [ ] **Step 3: SKILL.md 작성**

Create `.claude/skills/reprompt/SKILL.md` with this exact content:

````markdown
---
name: reprompt
description: 대화 맥락을 DNA 기준으로 맞춤 프롬프트로 깎아 파일로 산출하고 실행·점검하는 메타프롬프팅 루프. "이 대화로 프롬프트 만들어줘", "메타프롬프팅", "맞춤 프롬프트 깎아줘", "/reprompt" 시 사용. 인자: 작업(생략 시 대화에서 추론), --target general|coding|image|research, --auto(게이트 생략), --out <dir>.
---

# reprompt — 메타프롬프팅 6단계 루프

인자: `$TASK`(생략 시 대화에서 추론), `--target`(general|coding|image|research, 생략 시 자동 감지), `--auto`(HUMAN GATE 생략), `--out <dir>`(기본 `.reprompt/`).
helper: 이 스킬 폴더의 `scripts/reprompt-init.mjs`. DNA: 이 폴더의 `dna/prompt-principles.md`(번들). **단 현재 레포에 `vault/00-principles/prompt-principles.md`가 있으면 그쪽(최신)을 우선 읽는다.**

## 0. 컨텍스트 덤핑

- 현재 대화 + `$TASK` + (레포 내면) 관련 파일에서 다음을 뽑아 **의도 브리프**로 정리한다: 목표 / 대상 / 제약 / 보유 실데이터·자료.
- DNA를 읽는다: `vault/00-principles/prompt-principles.md`가 있으면 그것을, 없으면 번들 `dna/prompt-principles.md`를. 읽은 DNA 버전(제목의 vX.Y)을 기억한다.
- 참조 앵커: 레포에 `app/src/data/templates.ts` 또는 `vault/10-references/`가 있으면 `$TASK`와 가장 가까운 것 1~3개를 참조로 훑는다(복제 아님, 구조 참고만).

## 1. 질문 유도

- 의도 브리프 ↔ DNA 필수 항목을 대조해 **비어 있는 것만** 한 번에 질문한다(최대 4개, 과잉 심문 금지). 후보 질문:
  타겟 사용자 / 핵심 목표·기능 / 톤·디자인 레퍼런스 / 완성도 수준 / (도메인이 요구하면) 결과물에 실릴 실데이터.
- `--auto`면 질문하지 않고 최선 추정으로 진행하되, 세운 **가정을 BRIEF.md에 명시**한다.
- 답변/가정을 의도 브리프에 반영한다.

## 2. 프롬프트 깎기 + 실행환경 변환

DNA 4요소 뼈대로 조립한다. PROMPT.md는 아래 4개 섹션을 반드시 포함한다:

```
## 역할
## 맥락
## 요구사항
## 출력 형식
```

- **요구사항**은 검증 가능한 문장으로만 쓴다. 형용사만("멋지게", "개쩌는")은 금지 — "첫 15초에 훅"처럼 확인 가능한 기준으로 변환한다. 각 요구사항에 "왜"를 한 절로 병기하면 일반화가 좋아진다(DNA).
- 보유하지 않은 실데이터는 창작하지 말고 `[확인 필요]`로 남긴다(DNA raw 창작 금지).
- 도메인에 맞는 DNA 장치를 배치한다: 프레임워크 내장 / 근거 요구 / 네거티브 조건 / 발산→수렴 / 행동 착지.

**실행환경 변환 오버레이** — `--target`(없으면 $TASK에서 자동 감지)에 따라 요구사항/출력 형식에 다음을 덧붙인다:

| target | 추가 오버레이 |
|---|---|
| `general` | 없음(4요소 그대로). 글쓰기·기획·문서 |
| `coding` | **중지 요건(Goal)**: 무엇이 충족되면 멈추는가(완료/DoD). **제약 조건(Ultracode)**: 건드릴 파일 범위·범위 확장 금지·통과해야 할 테스트/빌드 게이트 |
| `image` | 구도 / 피사체 / 스타일 / 조명 / 카메라 방향 + 네거티브(피할 요소) |
| `research` | 출처 기준(어떤 소스 신뢰) / 조사 범위(포함·제외) / 검증 방식 + 불확실은 "추정" 표시 |

자동 감지 힌트: 코드·구현·리팩터·버그 → coding / 이미지·썸네일·일러스트·사진 → image / 조사·리서치·비교·출처 → research / 그 외 → general.

## 3. 폴더 생성 + 산출 파일 기록

- 오늘 날짜와 ISO 타임스탬프를 얻는다: `date '+%Y-%m-%d'`, `date -u '+%Y-%m-%dT%H:%M:%SZ'`.
- helper로 폴더와 meta.json을 만든다(경로는 이 스킬 폴더 기준으로 해석):

- Windows에서 `import()`는 절대경로 대신 `file://` URL을 요구하므로 스킬 폴더 경로를 `pathToFileURL`로 변환해 넘긴다.

```bash
node -e "import(require('url').pathToFileURL(process.argv[1]).href).then(m=>{const r=m.initRun({task:process.argv[2],target:process.argv[3],dnaVersion:process.argv[4],createdAt:process.argv[5],dateStr:process.argv[6],outBase:process.argv[7]});console.log(JSON.stringify(r));})" "<이 스킬 폴더>/scripts/reprompt-init.mjs" "<task>" "<target>" "<vX.Y>" "<isoTime>" "<YYYY-MM-DD>" "<outBase 또는 .reprompt>"
```

- 반환된 `runDir`에 다음을 쓴다:
  - `BRIEF.md` — 의도 브리프(덤핑 + 질문 답변 + 가정)
  - `PROMPT.md` — 깎은 프롬프트(4요소 + 오버레이)
  - `RATIONALE.md` — 어떤 DNA 장치를 왜 썼는지 3~6줄(쓰면서 배우기)
  - (OUTPUT.md, INSPECTION.md는 다음 단계에서 채운다)

## 4. HUMAN GATE

- `--auto`가 아니면: PROMPT.md 요약 + "왜 이렇게 깎았나"(RATIONALE 요약) + 세운 가정을 사용자에게 제시하고 **승인/수정/거부**를 받는다(응답 없이 진행 금지). 수정 요청이면 2단계로 돌아가 반영하고, 3단계로 다시 내려와 BRIEF/PROMPT/RATIONALE 파일을 갱신한다(디스크에 이전 버전이 남지 않게).
- `--auto`면: 자동 승인하고, 완료 보고에서 사용자가 뒤집을 수 있음을 명시.

## 5. 실행 + 점검

- 승인된 PROMPT.md를 그대로 실행해 실제 결과물을 `OUTPUT.md`에 쓴다.
- **점검**: OUTPUT을 PROMPT.md가 선언한 요구사항 + DNA anti-slop(형용사만 / 환각·과장 / 미충전 실데이터)으로 대조해 `INSPECTION.md`에 체크리스트(항목: 통과/격차)로 쓴다.
- 격차가 있으면 1회 정제를 제안한다. **점검 없이 완료·성공을 주장하지 않는다.**

## 완료 보고

- 무엇을 만들었는지(runDir 경로), PROMPT.md 핵심, 실행 결과 요약, 점검 통과/격차, target, DNA 버전.

## 금지

- 대화·작업이 모두 비면 추측하지 말고 작업을 되묻는다.
- 보유하지 않은 실데이터를 지어내지 않는다(`[확인 필요]`).
- 쓰기 불가 디렉토리면 스크래치로 폴백하고 실제 경로를 보고한다.
- 실행 실패 시 부분 저장 + INSPECTION에 실패를 명시(성공 주장 금지).
````

- [ ] **Step 4: 스킬 구조 검증 (프론트매터 + 6단계 + 4타깃)**

Run:
```bash
grep -c '^## ' .claude/skills/reprompt/SKILL.md
grep -E '^\| `(general|coding|image|research)`' .claude/skills/reprompt/SKILL.md | wc -l
head -3 .claude/skills/reprompt/SKILL.md | grep -q 'name: reprompt' && echo "frontmatter OK"
```
Expected: `## ` 헤더 7개 이상(0·1·2·3·4·5 + 완료 보고/금지), 타깃 행 4개, `frontmatter OK`.

- [ ] **Step 5: 커밋**

```bash
git add .claude/skills/reprompt/SKILL.md .claude/skills/reprompt/dna/prompt-principles.md
git commit -m "feat: reprompt 메타프롬프팅 스킬 + 번들 DNA"
```

---

## Task 3: 엔드투엔드 검증 (스모크 + 레드 + 타깃)

**Files:**
- Modify: 검증 중 발견된 결함에 한해 `.claude/skills/reprompt/SKILL.md` 또는 `scripts/reprompt-init.mjs`

**Interfaces:**
- Consumes: Task 1·2 전체.

- [ ] **Step 1: helper 단위 테스트 재실행 (회귀 확인)**

Run: `node --test .claude/skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: PASS — 10 tests, 0 fail

- [ ] **Step 2: 스모크 — 일반 타깃 E2E**

`/reprompt "콜드 아웃리치 이메일" --auto` 를 실행(스킬을 실제로 구동).
그다음 검증:
```bash
D=$(ls -d .reprompt/*-콜드-아웃리치-이메일 | head -1)
for f in BRIEF.md PROMPT.md RATIONALE.md OUTPUT.md INSPECTION.md meta.json; do
  test -f "$D/$f" && echo "OK $f" || echo "MISSING $f"
done
grep -c '^## 역할\|^## 맥락\|^## 요구사항\|^## 출력 형식' "$D/PROMPT.md"
```
Expected: 6개 파일 모두 `OK`, PROMPT.md의 4요소 섹션 카운트 = 4.

- [ ] **Step 3: 레드 체크 — 형용사 차단**

`/reprompt "개쩌는 랜딩페이지 만들어줘" --auto` 실행 후:
```bash
D=$(ls -d .reprompt/*랜딩* | head -1)
# 요구사항 섹션이 형용사만이 아니라 검증가능 항목(불릿 3개+)을 담아야 한다
awk '/^## 요구사항/{f=1;next} /^## /{f=0} f&&/^- /{c++} END{print "요구사항 불릿:", c}' "$D/PROMPT.md"
# BRIEF에 가정 또는 질문 기록이 있어야 한다(모호 입력 처리 증거)
grep -qi '가정\|타겟\|완성도\|모바일\|CTA' "$D/BRIEF.md" && echo "BRIEF 보강 OK"
```
Expected: 요구사항 불릿 ≥ 3, `BRIEF 보강 OK`.

- [ ] **Step 4: 타깃 변환 체크 — coding**

`/reprompt "장바구니 합계 계산 버그 고치기" --target coding --auto` 실행 후:
```bash
D=$(ls -d .reprompt/*장바구니* | head -1)
grep -qi '중지\|완료\|DoD\|멈' "$D/PROMPT.md" && echo "Goal 중지요건 OK"
grep -qi '제약\|범위\|테스트\|게이트\|건드' "$D/PROMPT.md" && echo "Ultracode 제약 OK"
```
Expected: `Goal 중지요건 OK`, `Ultracode 제약 OK`.

- [ ] **Step 5: 격차 발견 시 수정**

Step 2~4에서 MISSING/카운트 미달/OK 누락이 있으면 SKILL.md(또는 helper)를 고치고 해당 스텝을 재실행한다. 세 스모크 결과물은 검증용이므로 커밋에서 제외한다(아래 `.gitignore`).

- [ ] **Step 6: `.reprompt/`를 gitignore에 추가**

`.gitignore`에 다음 줄을 추가(산출물은 사용자 작업물, 레포에 커밋하지 않음):
```
.reprompt/
```

- [ ] **Step 7: 검증 결과 기록 + 커밋**

`.reprompt/` 검증 폴더를 정리하고 커밋:
```bash
rm -rf .reprompt
git add .gitignore
git commit -m "chore: .reprompt 산출물 gitignore + E2E 검증 통과"
```
검증 결과(스모크/레드/타깃 각 통과 여부)를 완료 보고에 증거로 남긴다.

---

## Self-Review

**Spec coverage:**
- 6단계 파이프라인(덤핑·질문·깎기·변환·게이트·실행·점검) → Task 2 SKILL.md 0~5단계. ✅
- 산출 파일 6종 → Task 1 `FILE_NAMES`+meta, Task 2 기록, Task 3 검증. ✅
- 실행환경 변환 4타깃 → Task 2 오버레이 표 + Task 3 Step 4 coding 검증. ✅
- 성공조건 명시/anti-slop → Task 2 요구사항 규칙 + Task 3 Step 3 레드 체크. ✅
- 질문 유도 → Task 2 1단계 + Task 3 Step 3 BRIEF 보강 확인. ✅
- 플러그인 이식성(번들 DNA/스크립트) → Task 1·2 스킬 폴더 배치, SKILL의 vault 우선 로직. ✅
- 에러 처리(빈 입력/실데이터/쓰기불가/실행실패) → Task 2 금지 섹션. ✅
- 산출 위치 `.reprompt/` → Task 1 `outBase` 기본값 + Task 3 gitignore. ✅

**Placeholder scan:** 모든 코드 스텝에 실제 코드 포함, TBD/TODO 없음. ✅

**Type consistency:** `slugify`/`initRun`/`FILE_NAMES`/`TARGETS` 시그니처가 Task 1 정의 ↔ Task 2 호출 ↔ Task 3 검증에서 일치. `meta.json` 필드(task/target/dna_version/created_at/files) 일관. ✅

## 후속 (별도 spec)

- 스코프 C: 플러그인 패키징(`.claude-plugin/plugin.json`·marketplace).
- 스코프 D: 릴리즈 워크플로우(semver·CHANGELOG·git tag).
