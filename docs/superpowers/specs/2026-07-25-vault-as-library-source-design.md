# S1 — 볼트가 라이브러리의 원본이 된다 (설계)

> 2026-07-25 · 스코프 S1 (전체 3단계 중 1단계)

## 배경 — 한 레포에 갈라진 두 갈래

`repick-prompt`는 서로 연결되지 않은 두 갈래를 갖고 있다.

**A. 자율 진화 루프** — `.claude/skills/prompt-evolve/SKILL.md`(5단계), `vault/`(DNA v1.17 + 20라운드 + ledger + backlog 대기열), 매일 03:00 KST 클라우드 루틴이 `--auto`로 1라운드를 돌려 `evolve/*` PR을 낸다. 산출물은 `{{빈칸}}` 재사용 템플릿이고, 승격 대상은 `app/src/data/templates.ts`(3,294줄, 28종)다.

**B. reprompt 플러그인** — `plugin/skills/reprompt/SKILL.md`(6단계), 대화 맥락을 일회용 맞춤 프롬프트로 깎아 `.reprompt/<날짜>-<slug>/`에 6파일로 낸다. v1.0.0으로 자체 마켓플레이스에 배포돼 있다.

둘 사이에 네 개의 이음매가 벌어져 있다.

1. DNA가 두 벌 — `vault/00-principles/prompt-principles.md`(원본)와 `plugin/skills/reprompt/dna/prompt-principles.md`(폴백 사본, 수동 `cp`). 76d49a5에서 한 번 어긋났고 드리프트 가드가 사후에 붙었다.
2. 둘 다 "4요소 조립 → 실행 → 점검"인데 구현이 따로다.
3. 승격 템플릿 28종이 `templates.ts`에만 있어 앱 밖에서는 못 쓴다. reprompt는 "구조 참고만" 한다.
4. reprompt가 만든 실사용 증거가 `backlog.md`로 돌아가지 않는다 — 루프가 열려 있다.

## 통합 목표와 분해

브레인스토밍에서 정해진 통합 방향은 셋이다: **폐루프 연결**, **진입점 단일화**, **배포 단위 통합**. 순수 내부 리팩토링은 독립 과제로 세우지 않고 위 셋의 부산물로 처리한다.

확정된 제약:

- **스탠드얼론 정책** — 플러그인은 DNA와 승격 라이브러리를 데이터로 실어 나른다. 진화 라운드(`--evolve`)는 볼트가 있는 레포에서만 활성한다. 공장은 집에 두고 제품만 배포한다.
- **라우팅** — 사람이 부르면 자동 3층(라이브러리 → 깎기 → 진화 제안), `--evolve`는 명시 강제 진입. 후자가 클라우드 루틴이 쓰는 경로다.
- **라이브러리 원본** — 볼트 마크다운. 이 레포는 이미 LLM wiki 방식이다(DNA·DECISION·ledger·backlog가 전부 위키링크된 마크다운이고 `wiki-lint`가 위생을 강제한다). 템플릿만 TS 배열에 따로 살 이유가 없다.
- **사용 기록** — `~/.reprompt/usage.jsonl`(머신 전역). 다른 레포에서 깎은 것까지 집계돼야 "무엇을 반복하는가"가 보인다. 로그는 볼트 밖(지식이 아니라 원료), 볼트에는 집계된 제안만 올라간다.

전체를 한 스펙에 담을 수 없어 셋으로 나눈다.

| | 서브프로젝트 | 내용 |
|---|---|---|
| **S1** | 볼트가 원본이 된다 | 본 문서 |
| S2 | 진입점 병합 + 배포 | 단일 `/reprompt`, 플러그인에 DNA+라이브러리 동봉, DNA 사본 해소, 클라우드 루틴 호출형 갱신 |
| S3 | 상향 다리 | `~/.reprompt/usage.jsonl` 적재·집계, N회 반복 감지 → `backlog.md` 제안 카드 |

순차 3 PR로 진행한다. 매일 도는 자율 루틴이 있는 레포에서는 중간 상태가 항상 하룻밤 무인으로 실행되므로, 한 방에 바꾸면 되돌리기가 어렵다.

## S1이 푸는 문제

라이브러리가 TS 배열 안에 있는 한 플러그인에 실을 수 없다. 그래서 S1은 S2·S3의 전제다.

그런데 더 급한 이유가 따로 있다. **지금 LEARN은 후보 마크다운을 읽어 손으로 TS 객체로 번역해 3,294줄 배열에 꽂는다.** 매일 새벽 무인 에이전트가 하는 일이고, 따옴표 이스케이프·쉼표·타입·삽입 위치가 전부 실수 표면이다.

이 위험은 이미 현실이다. **56개 후보 중 3개의 `fields` 표가 깨져 있다** — 헤더 7열, 구분선 8열. GFM에서 열 수가 안 맞는 표는 표로 렌더되지 않는다.

- `vault/20-generations/2026-07-23-newsletter/candidates/a.md`
- `vault/20-generations/2026-07-24-business-proposal/candidates/a.md`
- `vault/20-generations/2026-07-24-business-proposal/candidates/c.md`

첫 번째는 **R18 우승자이며 라이브러리에 승격된 템플릿**이다(ledger `2026-07-23-newsletter | winner: a`). 문제가 안 된 이유는 아무도 저 표를 파싱하지 않기 때문이다. LLM이 텍스트로 다시 읽어 옮겨 적으니 깨진 표도 통과한다. 마크다운이 원본이 되는 순간 이 침묵은 곧 장애가 된다.

## 파일 포맷

`vault/50-library/<slug>.md` 한 파일 = 템플릿 하나. 번호는 기존 `10-references`와 충돌하지 않게 50번대를 쓴다(00 원칙 → 10 씨앗 → 20 라운드 → 30 ledger → 40 질의 → 50 승격 라이브러리, 루프의 출력이므로 뒤에 온다).

````markdown
---
tags: [template, report]
slug: business-proposal
categoryId: report
title: 사업 제안서 작성
description: 대안 비교표와 근거 계산으로 결재용 제안서를 작성합니다.
promoted: 2026-07-24-business-proposal
fields:
  - key: audience
    label: 결재 대상
    type: text
    help: 누가 이 제안을 검토·결재하나요?
    placeholder: 본부장 김OO (재무팀 사전검토 포함)
  - key: constraint
    label: 예산·기한 제약
    type: text
    optional: true
    help: 승인 예산 상한이나 결정 기한이 있으면
    placeholder: 예산 상한 1,000만원, 8/15 전 결재
---

# 사업 제안서 작성

승격 [[2026-07-24-business-proposal/DECISION|R19]] · DNA [[prompt-principles|v1.17]]

## 본문

```
당신은 ... {{audience}} ... {{constraint}} ...
```

## 해부

### 역할
> 당신의 최우선 임무는 설득이 아니라 정직한 비교입니다

도메인의 본질 리스크(근거 없는 수치 창작)를 역할 정의에서 차단해 이후 요구사항이 이 제약을 상속하게 만든다.

### 맥락
> ...

## 팁

- alternatives_raw에 현상유지를 포함시키지 않으면 비교표가 성립하지 않는다 …
````

### 구조화 데이터는 frontmatter, 지식은 본문

`fields`는 7속성 레코드 리스트이고 앱 폼이 그대로 먹는 기계 입력이다. 마크다운 표는 `|`·줄바꿈·열 수에 취약해 **이미 3건이 깨졌다**. YAML은 인용·개행·특수문자를 파서가 처리한다.

`해부`·`팁`은 사람이 읽는 지식이라 본문에 남아야 옵시디언에서 값을 한다. 헤딩(`###`)과 인용(`>`)은 내용에 무엇이 들어와도 경계가 안 깨진다. 현재 후보 형식인 `- 역할: "인용" — 설명`은 설명 안에 `—`가 들어 있어 파싱이 불가능하다.

### 파싱 계약

| 대상 | 규칙 |
|---|---|
| `slug` `categoryId` `title` `description` `fields` | frontmatter (필수) |
| `promoted` | frontmatter (선택 — 씨앗은 없음) |
| `template` | `## 본문` 직후 첫 코드펜스의 내용 |
| `anatomy[]` | `## 해부` 아래 각 `### <part>` — 첫 `>` 줄이 `quote`, 이후 문단이 `why` |
| `tips[]` | `## 팁` 아래 최상위 불릿 |

`vault/50-library/_categories.md`는 frontmatter에 `categories: [{id, name}]`를 담는다. `CATEGORIES` 11종이 지금 TS 리터럴인데 LEARN이 "필요 시 새 카테고리 추가"를 하므로 자율 루프가 건드리는 대상이고, 원본만 TS에 남으면 반쪽이 된다.

### wiki-lint 신규 검사

1. frontmatter 필수 키 존재
2. **본문 `{{token}}` ↔ `fields[].key` 양방향 일치** — 토큰만 있고 필드가 없거나(빈칸이 영영 안 채워짐), 필드만 있고 토큰이 없는(입력받고 버림) 고전 버그. 지금 아무도 검사하지 않는다
3. `categoryId`가 `_categories.md`에 존재
4. 해부 4항목, 팁 2개 이상 — `prompt-evolve` SKILL의 `anatomy 4항목 + tips 2개` 계약과 같은 기준
5. **파생 파일 바이트 일치** — 재생성 결과가 커밋된 것과 같은가

5번은 DNA 가드(버전 문자열 비교)보다 강하다. LEARN 5단계가 이미 `wiki-lint`를 부르고 있어 강제 지점이 공짜로 생긴다.

## 데이터 흐름

```
vault/50-library/*.md              ← 원본 (사람·LLM·옵시디언)
        │  node scripts/build-library.mjs
        ▼
app/src/data/templates.generated.ts   ← 파생, 커밋됨 (손으로 편집 금지)
        │
        ▼
app/src/data/templates.ts          ← 타입·헬퍼·re-export
```

**파생물을 JSON이 아니라 TS로 뽑는다.** JSON을 import하면 `type: string`으로 넓어져 `as PromptTemplate[]` 캐스팅이 필요해지고, 컴파일러 보호를 끄는 자리가 생긴다. TS 리터럴로 생성하면 `tsc`와 `eslint`가 파싱 결과를 한 번 더 검증한다 — 마크다운 형식이 깨지면 앱 빌드가 깨져서 알려준다.

파일 3분할 (순환 import 회피):

| 파일 | 내용 | 손댐 |
|---|---|---|
| `app/src/data/templates.types.ts` | `FieldType` `TemplateField` `AnatomyItem` `Category` `PromptTemplate` | 사람 |
| `app/src/data/templates.generated.ts` | `CATEGORIES` + `TEMPLATES` 리터럴 | 생성 |
| `app/src/data/templates.ts` | 위 둘 re-export + `categoryName` · `templateBySlug` | 사람 |

소비처 6곳(`app/src/app/page.tsx`, `explorer.tsx`, `builder.tsx`, `builder-shell.tsx`, `lib/prompt.ts`, `app/p/[slug]/page.tsx`)은 전부 `@/data/templates`에서 가져오므로 **한 줄도 바뀌지 않는다.**

파생물을 커밋하는 이유: Vercel 프로젝트 루트가 `app/`일 가능성이 높아 빌드 시점에 `vault/`를 읽는 설계는 배포 설정에 의존하게 된다. 커밋된 파생물 + 바이트 일치 lint가 그 의존을 없앤다.

### export-references.mjs

`templates.ts`에서 `TEMPLATES`를 import하고 있어 배열이 파생 파일로 옮겨가면 깨진다. 소스를 볼트 마크다운으로 바꾸되 **산출물은 바이트 동일**하게 유지해 `10-references/` 위키링크를 건드리지 않는다.

씨앗 10종이 `50-library`에도 존재하게 되어 `10-references`가 순수 파생이 되는 문제가 남지만, 이는 S1 범위 밖이다. `10-references`는 `prompt-evolve` RETRIEVE의 입력이므로 살아 있어야 하고, 통폐합은 별도 판단이 필요하다.

## 마이그레이션

28종을 손으로 옮기지 않는다. 일회용 스크립트(`scripts/migrate-templates.mjs`)로 `TEMPLATES` 배열을 마크다운 28개로 직렬화하고, 변환이 끝나면 스크립트를 삭제한다. 사람이 28개를 옮겨 적으면 오타·누락이 필연이고, 그것이 이 작업이 없애려는 바로 그 위험이다.

`promoted:` 링크는 ledger의 run 이름에서 유도한다(`2026-07-24-business-proposal` → `business-proposal`). `export-references.mjs`의 `SEED_SLUGS` 10종(`youtube-script` `linkedin-post` `blog-draft` `thumbnail-image` `service-idea` `marketing-experiment` `meeting-summary` `interview-insights` `competitor-research` `code-review`)은 라운드가 없으므로 `tags: [template, seed]`로 표시하고 `promoted`를 비운다.

## 검증

S1의 실질 리스크는 하나다 — 28종 × (fields · template · anatomy · tips)가 변환을 왕복하며 한 글자라도 변하는 것.

```
1. 현재 TEMPLATES·CATEGORIES를 스냅샷으로 동결   →  library-before.json
2. 마이그레이션 실행                              →  마크다운 28개
3. build-library.mjs 실행                        →  templates.generated.ts
4. 생성된 TEMPLATES ≟ 스냅샷   deep-equal        →  한 글자라도 다르면 실패
```

### TDD 순서 (전부 RED 먼저)

| # | 테스트 | RED 근거 |
|---|---|---|
| 1 | 샘플 마크다운 1개 → 기대 객체 (파서 단위) | `build-library.mjs`가 없음 |
| 2 | 28종 왕복 deep-equal | 마크다운이 없음 |
| 3 | wiki-lint 신규 검사 5종 — 각각 깨진 픽스처로 | 검사가 없음 |

### 앱 회귀

deep-equal이 통과하면 앱이 받는 객체가 이전과 동일하므로 렌더 결과는 정의상 같다. 추가로 `cd app && npm run lint && npm run build` 통과와 홈·빌더 페이지 육안 확인이면 충분하고, E2E까지 끌고 갈 이유가 없다.

## prompt-evolve SKILL 변경

LEARN의 승격이 번역에서 이동으로 바뀐다.

```diff
- 승자를 app/src/data/templates.ts의 TEMPLATES 배열에 TS 객체로 추가
+ 승자 후보 md를 vault/50-library/<slug>.md로 이동 + frontmatter 4줄 추가
+ 새 카테고리는 _categories.md에
+ node scripts/build-library.mjs 실행 → templates.generated.ts 갱신분 커밋
+ node scripts/wiki-lint.mjs (재생성 일치·토큰↔필드 검사 포함)
```

**GENERATE가 만드는 후보 형식도 같이 바꾼다.** 후보를 템플릿 포맷(frontmatter `fields:` + `### 역할` 헤딩)으로 쓰면:

- 승격이 파일 이동 + 4줄 추가가 되어 손 번역이 실제로 사라진다
- 후보 단계에서 이미 wiki-lint가 형식을 검사한다 — 깨진 표 3건이 AUTO-SCORE까지 조용히 흘러간 경로가 막힌다

후보에는 `slug` `categoryId` `title` `description`이 없다(승격 시 결정). 따라서 wiki-lint는 `50-library/`에 전체 검사를, `20-generations/*/candidates/`에는 `fields` 형식만 검사한다. 과거 라운드 후보는 소급하지 않는다 — `20-generations`는 이력이고, 후보 검사는 새로 생기는 라운드에만 적용한다.

## 자율 루틴 안전

S1에서 가장 위험한 자리다. 매일 03:00 KST에 무인 루틴이 `/prompt-evolve --auto`를 돌린다(루틴 id `trig_01C7e66nxxHq8ELBMj5syCty`, 착수 시 실제 상태 확인 필요). worktree에서 작업하는 동안 밤이 지나면 루틴은 **구 SKILL.md로 구 경로에 승격**해 `templates.ts` 배열을 고치는 PR을 낸다. S1 머지 때 정확히 그 파일에서 충돌한다.

기존 선행 가드(`gh pr list --state open --head 'evolve/'`)는 S1 브랜치가 `evolve/*`가 아니라 걸리지 않는다.

1. S1 착수 시 클라우드 루틴을 **일시 정지**
2. S1 머지 후 **R20 한 라운드를 사람이 지켜보며 수동 실행** — 새 승격 경로가 실제로 도는지 확인
3. 확인되면 루틴 재개

하루치 라운드를 잃지만 backlog 대기열은 그대로 남는다. 무인 파이프라인을 바꾼 뒤 첫 실행을 지켜보지 않는 것은, 이 레포가 매일 밤 스스로 커밋한다는 점에서 감당할 수 없는 위험이다.

## 작업 격리와 롤백

신규 29(템플릿 28 + `_categories.md`) + 스크립트 3 + 수정 5로 파일 30개를 넘는다. HARD-GATE 전체 설계 등급이고, 루틴이 `main`을 건드리므로 `git worktree`에서 작업한다.

롤백은 S1 커밋 revert로 끝난다 — 파생물이 커밋돼 있어 앱은 즉시 이전 상태로 돌아간다. 볼트 마크다운은 남아도 무해하다.

## 범위 밖

- DNA 폴백 `cp` 단계 — S2에서 플러그인 재패키징과 같이 해소
- `10-references` ↔ `50-library` 씨앗 중복 통폐합
- 깨진 후보 표 3건의 소급 수정 (`20-generations`는 이력)
- 스킬 병합, 플러그인 패키징, 사용 로그 — S2·S3
