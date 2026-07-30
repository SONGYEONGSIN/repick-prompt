# S2 — 진입점 병합 + 배포 (구현 계획)

> 설계: [[2026-07-31-reprompt-entrypoint-merge-design]] · 선행 S1 완료(PR #8·#9)

## Global Constraints

- **TDD**: 각 태스크는 RED(실패하는 테스트) → GREEN(최소 구현) → 커밋. RED를 건너뛴 테스트는 무의미하다
- **검사는 차단해야 한다**: 새로 넣는 가드는 전부 **실제로 드리프트를 만들어 FAIL을 확인**한다. 현행 DNA 가드가 WARN이라 아무것도 못 막은 것이 이 스코프의 출발점이다
- **번들은 생성물이다**: `plugin/skills/reprompt/dna/`·`library/`를 **손으로 고치지 않는다**. 고칠 일이 생기면 볼트를 고치고 재생성한다
- **공장은 집에 둔다**: 진화 절차(`prompt-evolve`)를 플러그인에 복사하지 않는다. 플러그인은 라우터 + 데이터만
- 검증 순서 고정: `build-plugin-bundle` → `build-library` → `wiki-lint` → `node --test` → `app lint/build`

## File Structure

```
scripts/
  build-plugin-bundle.mjs        신규 — 볼트 → 플러그인 번들 생성
  build-plugin-bundle.test.mjs   신규
  wiki-lint.mjs                  수정 — 5a WARN→FAIL, 라이브러리 번들 검사 추가
plugin/skills/reprompt/
  SKILL.md                       수정 — 라우팅 재작성 (1·2층 + --evolve 위임 + 3층 훅)
  dna/prompt-principles.md       생성물 (기존 파일이 생성물로 강등)
  library/*.md                   생성물 신규 (29 + _categories)
  scripts/reprompt-init.mjs      수정 — usage 로깅 추가
  scripts/reprompt-init.test.mjs 수정
plugin/.claude-plugin/plugin.json  수정 — 1.0.0 → 1.1.0
.claude/skills/prompt-evolve/SKILL.md  수정 — 수동 cp 지시 → 생성 스크립트
RELEASING.md                     수정 — 런북에 번들 생성 단계
```

클라우드 루틴 프롬프트(`trig_01C7e66nxxHq8ELBMj5syCty`)는 파일이 아니라 `RemoteTrigger update`로 갱신한다.

## 범위 조정 1건 — S3의 "적재"를 S2로 당긴다

S1 문서는 `usage.jsonl` **적재·집계**를 모두 S3에 배정했다. 그중 **적재(로깅)만** S2로 옮긴다. 집계·제안 카드는 S3에 그대로 둔다.

근거 둘:

1. **지금 설계대로면 S2의 3층 훅은 입력이 없는 껍데기라 검증 자체가 불가능하다.** 로깅이 있어야 훅이 로그를 읽는지 테스트할 수 있다
2. **데이터는 시간이 지나야 쌓인다.** 로깅은 실행마다 JSONL 한 줄이라 비용이 거의 없는 반면, S3 이후로 미루면 S3가 나온 시점부터 다시 몇 주를 기다려야 한다. 시계를 일찍 돌릴수록 가치가 복리로 커진다

---

### Task 1: 번들 생성 스크립트

`scripts/build-plugin-bundle.mjs` — 볼트 원본을 플러그인 번들로 바이트 복사한다.

- [ ] **Step 1: 실패하는 테스트 작성** (`scripts/build-plugin-bundle.test.mjs`)
  - `buildBundle({ vaultDir, pluginDir })` 형태로 경로를 주입받게 설계한다 (임시 디렉토리로 테스트하기 위해)
  - 케이스:
    1. DNA 1개 + 라이브러리 md N개가 대상에 **바이트 일치**로 생성된다
    2. **삭제 전파** — 볼트에서 사라진 파일이 번들에도 없어야 한다. 대상에 미리 `stale.md`를 두고 실행 후 사라지는지 확인. *복사만 하면 통과하지 못하는 케이스이므로 반드시 포함한다*
    3. **멱등성** — 두 번 실행해도 결과가 같다
    4. `_categories.md`도 복사된다
    5. 볼트 원본이 변경되지 않는다 (읽기 전용)
  - 반환값으로 `{ dnaVersion, templateCount }`를 검증한다
- [ ] **Step 2: 테스트가 실패하는지 확인** — `node --test scripts/build-plugin-bundle.test.mjs` 가 모듈 없음으로 실패
- [ ] **Step 3: 최소 구현** — 대상 디렉토리를 비우고(`rm -rf` 아닌 파일 단위 삭제) 복사. CLI 진입점은 기본 경로로 `buildBundle` 호출 후 요약 1줄 출력
- [ ] **Step 4: 테스트 통과 확인**
- [ ] **Step 5: 실제 실행** — `node scripts/build-plugin-bundle.mjs` → `plugin/skills/reprompt/library/` 29+1 파일 생성 확인, `du -sh plugin/`으로 크기 기록(설계가 예측한 ~380K와 대조)
- [ ] **Step 6: 커밋**

### Task 2: 가드 — wiki-lint FAIL 승격 + 라이브러리 번들 검사

- [ ] **Step 1: 현행 가드가 못 막는 것을 먼저 실증** — DNA 번들을 일부러 어긋나게 만들고 `node scripts/wiki-lint.mjs; echo $?` 가 **0**을 내는 것을 확인해 기록에 남긴다. 이것이 이 태스크의 RED다
- [ ] **Step 2: 검사 3종 구현**
  - DNA 번들 바이트 불일치 → FAIL
  - 라이브러리 번들 파일 집합/바이트 불일치 → FAIL
  - 볼트에 없는 파일이 번들에 잔존 → FAIL
  - 메시지는 원인이 아니라 **행동**을 지시한다: `node scripts/build-plugin-bundle.mjs 를 실행하라`
- [ ] **Step 3: 세 검사를 각각 실제로 실패시켜 확인** — 드리프트를 만들고 exit≠0, 재생성 후 exit=0. 한 검사씩 개별 확인한다(한 번에 셋을 깨면 어느 검사가 잡았는지 모른다)
- [ ] **Step 4: 커밋**

### Task 3: 수동 cp 제거

- [ ] **Step 1**: `.claude/skills/prompt-evolve/SKILL.md` LEARN의 마지막 항목(`cp vault/... plugin/...`)을 `node scripts/build-plugin-bundle.mjs`로 교체. 검증 순서에도 번들 생성을 첫 단계로 편입
- [ ] **Step 2**: `RELEASING.md` 런북에 번들 생성 단계 추가
- [ ] **Step 3: 절차를 문자 그대로 따라가 검증** — SKILL의 LEARN 단계를 처음부터 실행해 번들이 갱신되고 wiki-lint가 통과하는지 확인
- [ ] **Step 4: 커밋**

### Task 4: usage 로깅 (S3에서 당겨온 부분)

- [ ] **Step 1: 실패하는 테스트 작성** (`reprompt-init.test.mjs`에 추가)
  - `appendUsage(entry, logPath)` — JSONL 한 줄 append, 디렉토리 없으면 생성
  - `initRun`이 `usageLog` 옵션 경로에 1건 기록한다
  - `usageLog: false`면 기록하지 않는다
  - 기존 엔트리를 **덮어쓰지 않는다**(append-only) — 2회 호출 후 2줄
  - 기록 필드: `{ task, target, dna_version, created_at, slug }`
  - 로그 쓰기 실패가 `initRun` 전체를 죽이지 않는다 (홈 디렉토리 쓰기 불가 환경) — 조용히 건너뛰고 반환값에 표시
- [ ] **Step 2: RED 확인**
- [ ] **Step 3: 구현** — 기본 경로 `join(homedir(), '.reprompt', 'usage.jsonl')`. **볼트 밖이다** — 로그는 지식이 아니라 원료
- [ ] **Step 4: 통과 확인 + 커밋**

### Task 5: reprompt SKILL 라우팅 재작성

가장 큰 변경이고 코드가 아니라 **지시문**이라 테스트가 아닌 시나리오 실행으로 검증한다.

- [ ] **Step 1**: `--evolve` 분기 서술 — 볼트 감지(`vault/00-principles/prompt-principles.md` + `vault/backlog.md` 존재)→ 있으면 `prompt-evolve` 스킬로 위임, 없으면 거부 + 이유 안내
- [ ] **Step 2**: 1층(라이브러리 히트) 서술 — 번들/볼트 라이브러리의 `title`·`description`을 훑어 `$TASK`와 맞는 것이 있으면 그 템플릿을 뼈대로 삼고 빈칸을 대화 맥락에서 충전. **애매하면 임의 결정하지 말고 HUMAN GATE에서 묻는다**
- [ ] **Step 3**: 2층은 현행 6단계 유지 — 뼈대 없이 DNA 4요소로 조립
- [ ] **Step 4**: 3층 훅 — `~/.reprompt/usage.jsonl`을 읽어 같은 성격의 작업이 반복됐는지 본다. **S2에서는 자리만** 만들고 판정 임계·제안 카드 형식은 S3가 채운다는 것을 SKILL에 명시
- [ ] **Step 5**: 라이브러리 읽기 경로 — 레포 안이면 `vault/50-library/`, 아니면 번들 `$CLAUDE_SKILL_DIR/library/`. DNA와 같은 우선순위 규칙
- [ ] **Step 6: 시나리오 검증** — 3층 각각 + `--evolve` 거부를 실제로 실행해 본다
- [ ] **Step 7: 커밋**

### Task 6: 스탠드얼론 실증 + 배포

**이 스코프의 존재 이유다. 통과 없이 완료 선언하지 않는다.**

- [ ] **Step 1**: 레포 **밖** 임시 디렉토리에 `plugin/`만 복사해 볼트가 없는 환경을 만든다
- [ ] **Step 2**: 그 환경에서 확인
  - DNA를 번들에서 읽는가 (볼트가 없으므로 폴백만 존재)
  - 라이브러리 29종을 읽어 **1층 히트가 실제로 나는가**
  - `--evolve`가 거부되는가
- [ ] **Step 3**: `plugin.json` 1.0.0 → 1.1.0
- [ ] **Step 4**: 루틴 프롬프트를 호출형으로 갱신 — 절차 복제를 걷어내고 `/reprompt --evolve --auto` 호출로. 루틴만 아는 것(선행 가드·타깃 선정·브랜치/PR 규칙)만 남긴다
- [ ] **Step 5: 전체 회귀** — 검증 순서 5단계 전부 + 워치독 수동 실행
- [ ] **Step 6: 커밋 + PR**

## 미해결로 남기는 것

- **1층 히트 판정의 정확도** — 모델 판단이라 정량 기준이 없다. 오탐(엉뚱한 템플릿을 뼈대로 씀)이 관찰되면 별도 라운드에서 판정 규칙을 손본다
- **번들 크기** — 설계에서 md 전체 복사를 택했으므로 이번엔 다루지 않는다
- **S3** — 집계·제안 카드. 적재만 이번에 당겨온다
