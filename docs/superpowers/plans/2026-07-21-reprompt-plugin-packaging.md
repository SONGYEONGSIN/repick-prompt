# reprompt 플러그인 패키징 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** repick-prompt 레포를 `reprompt` 스킬을 배포하는 Claude Code 플러그인으로 패키징한다 — 스킬을 `skills/`로 옮기고, 매니페스트·마켓플레이스를 추가하고, 설치 후에도 동작하도록 경로를 이식성 있게 고친다.

**Architecture:** 레포 루트를 플러그인 루트로 사용. `reprompt`를 `.claude/skills/reprompt/` → `skills/reprompt/`로 `git mv`(이력 보존). `.claude-plugin/plugin.json`(매니페스트) + `.claude-plugin/marketplace.json`(자체 마켓플레이스) 추가. SKILL.md의 스킬-폴더 경로를 `$CLAUDE_SKILL_DIR`(설치 시) 또는 주입된 Base directory(폴백)로 해석하도록 수정. `prompt-evolve`는 레포 내부용이라 미포함.

**Tech Stack:** Claude Code plugin (`.claude-plugin/*.json`), `claude` CLI v2.1.216 (`plugin validate`/`marketplace`/`install`), Node.js 22 skill helper.

## Global Constraints

- 플러그인은 `reprompt` 스킬만 배포. `prompt-evolve`는 `.claude/skills/prompt-evolve/`에 그대로(미포함).
- 스킬 위치: 플러그인 루트의 `skills/reprompt/` (폴더명=스킬명).
- `.claude-plugin/plugin.json` 필수 필드 `name`; **스키마 외 추가 필드 금지**.
- `.claude-plugin/marketplace.json` 필수: `name`(kebab), `owner.name`, `plugins:[{name, source}]`; `source: "./"`.
- 번들 스크립트/DNA는 `$CLAUDE_SKILL_DIR`로 참조(없으면 주입된 "Base directory for this skill" 폴백). `../` 외부 참조 금지.
- Windows `import()` file:// URL 변환(`pathToFileURL`, 스코프 A) 유지.
- `claude plugin validate .` 통과가 배포 게이트.
- 산출물 경로 `.reprompt/`는 이미 gitignore됨(스코프 A). 헬퍼 인터페이스(`initRun`/`slugify`/`FILE_NAMES`/`TARGETS`)는 스코프 A에서 확정 — 변경 금지.
- git tag/CHANGELOG/릴리즈는 스코프 D(이 계획 제외).

---

## File Structure

- `skills/reprompt/` — `.claude/skills/reprompt/`에서 이동(SKILL.md + scripts/ + dna/). Task 1.
- `skills/reprompt/SKILL.md` — 경로 이식성 수정. Task 1.
- `.claude-plugin/plugin.json` — 플러그인 매니페스트. Task 2.
- `.claude-plugin/marketplace.json` — 자체 마켓플레이스. Task 2.

---

## Task 1: reprompt를 skills/로 이동 + 경로 이식성 수정

**Files:**
- Move: `.claude/skills/reprompt/` → `skills/reprompt/` (git mv, 하위 전체)
- Modify: `skills/reprompt/SKILL.md`

**Interfaces:**
- Consumes: 스코프 A의 `reprompt` 스킬(SKILL.md 6단계, helper `reprompt-init.mjs`).
- Produces: `skills/reprompt/` 위치의 스킬. SKILL.md가 스킬-폴더 경로를 `$CLAUDE_SKILL_DIR`(폴백: 주입 Base directory)로 해석.

- [ ] **Step 1: 스킬 폴더를 이력 보존하며 이동**

Run:
```bash
mkdir -p skills
git mv .claude/skills/reprompt skills/reprompt
```

- [ ] **Step 2: 이동·이력 확인**

Run:
```bash
test -f skills/reprompt/SKILL.md && test -f skills/reprompt/scripts/reprompt-init.mjs && test -f skills/reprompt/dna/prompt-principles.md && echo "MOVED OK"
git log --follow --oneline -- skills/reprompt/scripts/reprompt-init.mjs | head -3
test ! -d .claude/skills/reprompt && echo "OLD PATH GONE"
```
Expected: `MOVED OK`; `--follow` 로그에 스코프 A 커밋들(5e0bbd8/bb51e55 등) 표시; `OLD PATH GONE`.

- [ ] **Step 3: 새 위치에서 유닛 테스트 통과 확인**

Run: `node --test skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: 12 tests, 12 pass, 0 fail (경로 무관 — 테스트는 상대 import).

- [ ] **Step 4: SKILL.md 헤더 줄(helper/DNA 참조)을 `$CLAUDE_SKILL_DIR`로 수정**

`skills/reprompt/SKILL.md`에서 이 줄:
```
helper: 이 스킬 폴더의 `scripts/reprompt-init.mjs`. DNA: 이 폴더의 `dna/prompt-principles.md`(번들). **단 현재 레포에 `vault/00-principles/prompt-principles.md`가 있으면 그쪽(최신)을 우선 읽는다.**
```
을 다음으로 교체:
```
helper: 스킬 폴더(`$CLAUDE_SKILL_DIR`, 없으면 스킬 로드 시 주입된 "Base directory for this skill" 절대경로)의 `scripts/reprompt-init.mjs`. DNA: 같은 폴더의 `dna/prompt-principles.md`(번들). **단 현재 레포에 `vault/00-principles/prompt-principles.md`가 있으면 그쪽(최신)을 우선 읽는다.**
```

- [ ] **Step 5: Phase 0의 DNA 읽기 줄 수정**

이 줄:
```
- DNA를 읽는다: `vault/00-principles/prompt-principles.md`가 있으면 그것을, 없으면 번들 `dna/prompt-principles.md`를. 읽은 DNA 버전(제목의 vX.Y)을 기억한다.
```
을 다음으로 교체:
```
- DNA를 읽는다: `vault/00-principles/prompt-principles.md`가 있으면 그것을, 없으면 번들 `$CLAUDE_SKILL_DIR/dna/prompt-principles.md`(env 없으면 주입된 Base directory의 `dna/prompt-principles.md`)를. 읽은 DNA 버전(제목의 vX.Y)을 기억한다.
```

- [ ] **Step 6: Phase 3의 helper 호출을 `SKILL_DIR` 변수로 수정**

이 줄:
```
- helper로 폴더와 meta.json을 만든다(경로는 이 스킬 폴더 기준으로 해석):
```
을 다음으로 교체:
```
- helper로 폴더와 meta.json을 만든다. 스킬 폴더 경로는 `$CLAUDE_SKILL_DIR`(설치된 플러그인) 또는 스킬 로드 시 주입된 "Base directory for this skill"(project skill)에서 얻는다:
```
그리고 아래 ```bash 블록의 명령을 다음으로 교체(기존 `"<이 스킬 폴더>/scripts/reprompt-init.mjs"` 대신 `$SKILL_DIR` 사용):
```bash
# SKILL_DIR: 플러그인 설치 시 $CLAUDE_SKILL_DIR, 없으면 이 SKILL.md의 Base directory 절대경로로 치환
SKILL_DIR="${CLAUDE_SKILL_DIR:-<이 SKILL.md의 Base directory 절대경로>}"
node -e "import(require('url').pathToFileURL(process.argv[1]).href).then(m=>{const r=m.initRun({task:process.argv[2],target:process.argv[3],dnaVersion:process.argv[4],createdAt:process.argv[5],dateStr:process.argv[6],outBase:process.argv[7]});console.log(JSON.stringify(r));})" "$SKILL_DIR/scripts/reprompt-init.mjs" "<task>" "<target>" "<vX.Y>" "<isoTime>" "<YYYY-MM-DD>" "<outBase 또는 .reprompt>"
```

- [ ] **Step 7: 수정된 호출이 실제로 동작하는지 확인 (SKILL_DIR 명시)**

Run (스킬을 흉내내어 SKILL_DIR을 실제 경로로 두고 helper 실행 → 임시 outBase, 이후 삭제):
```bash
SKILL_DIR="$PWD/skills/reprompt"
node -e "import(require('url').pathToFileURL(process.argv[1]).href).then(m=>{const r=m.initRun({task:process.argv[2],target:process.argv[3],dnaVersion:process.argv[4],createdAt:process.argv[5],dateStr:process.argv[6],outBase:process.argv[7]});console.log(JSON.stringify(r));})" "$SKILL_DIR/scripts/reprompt-init.mjs" "패키징 검증" "general" "v1.14" "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$(date '+%Y-%m-%d')" "$TEMP/rp-pkgcheck"
ls "$TEMP/rp-pkgcheck"/*/ | head; rm -rf "$TEMP/rp-pkgcheck"
```
Expected: 6개 파일(BRIEF/PROMPT/RATIONALE/OUTPUT/INSPECTION.md + meta.json) 담은 JSON 출력. 레포에 `.reprompt/` 생성 안 됨.

- [ ] **Step 8: SKILL.md 구조 온전성 확인**

Run:
```bash
grep -c '^## ' skills/reprompt/SKILL.md
grep -E '^\| `(general|coding|image|research)`' skills/reprompt/SKILL.md | wc -l
head -3 skills/reprompt/SKILL.md | grep -q 'name: reprompt' && echo "frontmatter OK"
grep -c '이 스킬 폴더' skills/reprompt/SKILL.md
```
Expected: `## ` 헤더 ≥7; 타깃 행 4; `frontmatter OK`; `이 스킬 폴더` 잔존 0 (모두 `$CLAUDE_SKILL_DIR`/`SKILL_DIR`로 치환됨).

- [ ] **Step 9: 커밋**

```bash
git add -A skills/reprompt .claude/skills
git commit -m "refactor: reprompt 스킬을 skills/로 이동 + \$CLAUDE_SKILL_DIR 경로 이식성"
```

---

## Task 2: plugin.json + marketplace.json + validate

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`

**Interfaces:**
- Consumes: Task 1의 `skills/reprompt/`.
- Produces: `claude plugin validate .` 통과하는 배포 가능한 플러그인 + 자체 마켓플레이스.

- [ ] **Step 1: plugin.json 작성**

Create `.claude-plugin/plugin.json`:
```json
{
  "name": "reprompt",
  "version": "1.0.0",
  "description": "메타프롬프팅 스킬 — 대화 맥락을 프롬프트 DNA로 맞춤 프롬프트로 깎아 파일로 산출·실행·점검",
  "author": { "name": "SONGYEONGSIN", "url": "https://github.com/SONGYEONGSIN" },
  "repository": "https://github.com/SONGYEONGSIN/repick-prompt",
  "keywords": ["prompt", "meta-prompting", "prompt-engineering"]
}
```

- [ ] **Step 2: marketplace.json 작성**

Create `.claude-plugin/marketplace.json`:
```json
{
  "name": "repick-prompt",
  "owner": { "name": "SONGYEONGSIN" },
  "plugins": [
    {
      "name": "reprompt",
      "source": "./",
      "category": "productivity",
      "description": "메타프롬프팅 6단계 루프"
    }
  ]
}
```

- [ ] **Step 3: JSON 문법 확인**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('JSON OK')"
```
Expected: `JSON OK`.

- [ ] **Step 4: `claude plugin validate`로 검증**

Run:
```bash
claude plugin validate . 2>&1 | tee /tmp/rp-validate.txt
```
Expected: 검증 통과(에러 0). `reprompt` 스킬이 `skills/reprompt/`에서 인식되는지 출력 확인.

- [ ] **Step 5: validate가 스킬 미발견/필드 누락을 지적하면 최소 보정**

만약 Step 4가 스킬 자동 발견 실패나 필수 필드 누락을 보고하면:
- 스킬 미발견 → validate 메시지가 요구하는 형식으로 `plugin.json`에 `"skills"` declaration을 추가한다(예: 스키마가 경로 배열을 요구하면 `"skills": ["./skills/reprompt"]`, 이름 배열이면 `["reprompt"]` — **validate 출력이 지시하는 형식만** 사용, 임의 추가 금지).
- 다시 `claude plugin validate .` 실행해 통과 확인.
스킬이 이미 자동 발견되면 이 스텝은 변경 없이 통과로 기록.

- [ ] **Step 6: 커밋**

```bash
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "feat: reprompt 플러그인 매니페스트 + 자체 마켓플레이스"
```

---

## Task 3: 도그푸드 설치 + E2E 스모크 + 정리

**Files:** 없음(검증 전용). 설치는 사용자 전역 config를 변경하므로 **반드시 정리(uninstall/remove)**로 원복한다.

**Interfaces:**
- Consumes: Task 1·2 전체.

- [ ] **Step 1: 유닛 테스트 회귀 확인**

Run: `node --test skills/reprompt/scripts/reprompt-init.test.mjs`
Expected: 12/12 pass.

- [ ] **Step 2: 마켓플레이스 등록 + 설치 (best-effort, 비대화형)**

Run (비대화형 플래그가 있으면 사용; 프롬프트로 막히면 중단하고 Step 4 폴백으로):
```bash
claude plugin marketplace add . 2>&1 | tail -5
claude plugin install reprompt 2>&1 | tail -5
claude plugin list 2>&1 | grep -i reprompt && echo "INSTALLED"
```
Expected: `INSTALLED` (reprompt가 목록에 표시). 대화형 프롬프트로 헤드리스 진행이 막히면 실패로 기록하고 Step 4로.

- [ ] **Step 3: 설치본 컴포넌트 확인**

Run:
```bash
claude plugin details reprompt 2>&1 | head -20
```
Expected: `reprompt` 스킬이 컴포넌트로 표시(스킬 발견 확인).

- [ ] **Step 4: `$CLAUDE_SKILL_DIR` 해석 실측 (env 있음/없음 양쪽)**

설치된 플러그인 캐시 경로가 있으면 그걸 `SKILL_DIR`로, 없으면 `skills/reprompt`로 두고, **env 폴백 경로도** 확인:
```bash
# (가) env 없음 폴백: SKILL_DIR을 명시 경로로 → 동작해야 함 (Task1 Step7과 동형)
SKILL_DIR="$PWD/skills/reprompt"
node -e "import(require('url').pathToFileURL(process.argv[1]).href).then(m=>{const r=m.initRun({task:process.argv[2],target:process.argv[3],dnaVersion:process.argv[4],createdAt:process.argv[5],dateStr:process.argv[6],outBase:process.argv[7]});console.log('files:',r.files.length);})" "$SKILL_DIR/scripts/reprompt-init.mjs" "설치 스모크" "general" "v1.14" "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$(date '+%Y-%m-%d')" "$TEMP/rp-install-smoke"
rm -rf "$TEMP/rp-install-smoke"
# (나) env 있음: CLAUDE_SKILL_DIR 설정 시 SKILL_DIR이 그 값을 받는지 셸 확인
CLAUDE_SKILL_DIR="$PWD/skills/reprompt"; SKILL_DIR="${CLAUDE_SKILL_DIR:-fallback}"; test "$SKILL_DIR" = "$PWD/skills/reprompt" && echo "ENV PATH OK"
```
Expected: `files: 6`; `ENV PATH OK`. (설치가 됐다면 실제 캐시경로의 `dna/`·`scripts/`가 존재하는지도 확인해 기록.)

- [ ] **Step 5: 전역 상태 원복 (정리)**

Run (설치/등록이 됐다면 반드시 실행):
```bash
claude plugin uninstall reprompt 2>&1 | tail -3 || true
claude plugin marketplace remove repick-prompt 2>&1 | tail -3 || true
claude plugin list 2>&1 | grep -i reprompt && echo "STILL PRESENT (조사 필요)" || echo "CLEANED"
```
Expected: `CLEANED` (reprompt 미표시). 제거 명령명이 다르면 `claude plugin marketplace --help`로 정확한 하위명령 확인 후 원복.

- [ ] **Step 6: 결과 기록 (커밋 불필요, 변경 없으면)**

설치가 헤드리스로 됐는지, `$CLAUDE_SKILL_DIR` 폴백/실경로가 동작했는지, 전역 상태가 원복됐는지를 보고에 증거로 남긴다. 헤드리스 설치가 불가했다면 사용자용 수동 설치 명령을 보고에 명시:
```
claude plugin marketplace add https://github.com/SONGYEONGSIN/repick-prompt
claude plugin install reprompt
```
working tree에 커밋할 변경이 없으면 커밋하지 않는다(`git status`로 확인).

---

## Self-Review

**Spec coverage:**
- reprompt만 배포, skills/로 이동 → Task 1. ✅
- plugin.json + marketplace.json → Task 2. ✅
- `${CLAUDE_SKILL_DIR}` 이식성 수정 + 폴백 → Task 1 Step 4-7 + Task 3 Step 4. ✅
- `claude plugin validate` 게이트 → Task 2 Step 4-5. ✅
- 자동발견 vs 명시 declaration 확정 → Task 2 Step 5. ✅
- 개발 중 dev 사용(설치) → Task 3. ✅
- prompt-evolve 미포함 → Global Constraints + Task 1은 reprompt만 이동. ✅
- git mv 이력 보존 → Task 1 Step 2. ✅

**Placeholder scan:** 모든 스텝에 실제 명령/JSON 포함. Task 2 Step 5·Task 3 Step 2의 "조건 분기"는 validate/CLI 실측 결과에 대한 명시적 대응이지 미완 플레이스홀더가 아님. ✅

**Type consistency:** helper 인터페이스(`initRun`/`FILE_NAMES`) 변경 없음 — Task 1 Step 7·Task 3 Step 4가 스코프 A와 동일 시그니처로 호출. plugin.json/marketplace.json 필드는 스펙과 일치. ✅

## 후속 (스코프 D)

- `claude plugin tag`로 `reprompt--v1.0.0` 태그 발행 + CHANGELOG + 버전 범프 워크플로우.
