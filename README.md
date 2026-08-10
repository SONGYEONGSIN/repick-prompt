# RE:PROMPT — 프롬프트를 생성하고, 검증하고, 학습하는 루프

repick-design(디자인 자기개선 루프)과 동일 컨셉의 프롬프트 버전.
**본체는 진화 루프**입니다 — 지식(vault)으로 프롬프트 템플릿 후보를 생성하고, 실제 결과물로 검증하고, 학습을 원칙에 되돌려 템플릿 라이브러리를 불려갑니다.

공장은 하나(`vault` + 진화 루프)이고, 그 지식이 나가는 출구가 둘입니다:

| 출구 | 무엇 | 어디 |
|---|---|---|
| **`/reprompt` 플러그인** | 대화 맥락을 그 자리에서 맞춤 프롬프트로 깎는 메타프롬프팅 스킬. **DNA와 승격 라이브러리를 번들로 동봉**해 다른 레포에서도 같은 기준으로 동작 | `plugin/` |
| **웹앱 뷰어** | 승격 템플릿을 빈칸 채우기로 쓰는 초보자용 뷰어 | `app/` |

## 메타프롬프팅 실행 — `/reprompt` (v1.1.0)

대화 맥락을 그 자리에서 프롬프트로 깎습니다. **진입점은 하나**이고, 무엇을 할지는 스킬이 판정합니다.

```bash
claude plugin marketplace add https://github.com/SONGYEONGSIN/repick-prompt
claude plugin install reprompt@repick-prompt
```

```
/reprompt "<작업>"                    # 생략 시 대화 맥락에서 추론
/reprompt "<작업>" --target coding    # general | coding | image | research
/reprompt "<작업>" --auto             # HUMAN GATE 생략
/reprompt "<작업>" --evolve           # 진화 라운드 1회 (볼트 레포 전용)
```

### 자동 3층 라우팅

| 층 | 조건 | 무엇을 하나 |
|---|---|---|
| **1층** | 라이브러리에 맞는 템플릿이 있다 | 블라인드 심사를 통과해 승격된 **검증된 뼈대**에 대화 맥락을 채운다. 뼈대 본문은 즉석에서 고치지 않는다 — 그 검증이 무효화된다 |
| **2층** | 맞는 것이 없다 | 뼈대 없이 DNA 4요소로 새로 깎는다 |
| **3층** | 같은 성격의 작업이 반복됐다 | 진화 백로그 타깃으로 올릴지 제안한다 (훅만 — 판정 임계는 미정) |

1층과 2층의 차이는 **뼈대의 출처**뿐이고 나머지(질문 유도 → 파일 산출 → HUMAN GATE → 실행·점검)는 같습니다. 히트 판정은 문자열 매칭이 아니라 의미로 하며, 애매하면 임의로 정하지 않고 사용자에게 묻습니다.

`--evolve`는 볼트가 있는 레포에서만 동작합니다 — `prompt-evolve` 5단계로 위임하고, 볼트가 없으면 거부합니다. **공장은 원본 레포에 두고 제품만 배포**하므로 진화 루프 자체는 플러그인에 실리지 않습니다.

산출물은 `.reprompt/<날짜>-<slug>/`에 6파일 — `BRIEF` / `PROMPT` / `RATIONALE` / `OUTPUT` / `INSPECTION` + `meta.json`. **점검 없이 완료를 주장하지 않습니다.**

### 플러그인은 지식을 실어 나릅니다

| 자산 | 레포 안 (최신) | 스탠드얼론 |
|---|---|---|
| 프롬프트 DNA (v1.19) | `vault/00-principles/prompt-principles.md` | `$CLAUDE_SKILL_DIR/dna/prompt-principles.md` |
| 승격 라이브러리 30종 | `vault/50-library/*.md` | `$CLAUDE_SKILL_DIR/library/*.md` |

둘 다 같은 마크다운 포맷이라 읽는 방식이 같습니다. 실행 기록은 `~/.reprompt/usage.jsonl`에 한 줄씩 append되고(머신 전역, append-only, 쓰기 실패가 실행을 막지 않음) 3층이 이걸 읽습니다.

릴리즈 절차는 `RELEASING.md`, 마켓플레이스 정의는 `.claude-plugin/marketplace.json`, 변경 이력은 `CHANGELOG.md`.

## 진화 루프 실행 (본체)

```
/prompt-evolve "<타깃 작업>"          # 예: /prompt-evolve "인스타 릴스 대본"
/prompt-evolve "<타깃 작업>" --auto   # 사람 게이트 없이 자동 선택
```

5단계 (`.claude/skills/prompt-evolve/SKILL.md`):

1. **RETRIEVE** — 프롬프트 DNA(`vault/00-principles`) + 씨앗(`10-references`) + 최근 결정(ledger)
2. **GENERATE** — 후보 템플릿 N개 병렬 생성 (방향 분산: 최소 빈칸 / 가이드 최대화 / 프레임워크 내장 …)
3. **AUTO-SCORE** — **동일 시나리오로 실제 결과물 생성** → 블라인드 심사(comparator, 순서 편향 통제) + DNA 준수 점검
4. **HUMAN GATE** — 승자 선택 (`--auto`면 자동, ledger에 기록)
5. **LEARN** — 원칙 surgical 갱신 + ledger append + **승자를 라이브러리에 승격** + 번들 재생성

타깃은 `vault/backlog.md` 대기열에서 위에서부터 꺼내 씁니다. 자동 라운드는 GitHub Actions 워치독(`.github/workflows/evolve-watchdog.yml`)이 지켜봅니다.

### 진화 이력

라운드별 타깃·승자·학습 전체 기록은 `vault/🏠 Prompt Evolution.md`에, append-only 결정 원장은 `vault/30-ledger/prompt-ledger.jsonl`에 있습니다. 지금까지 R1~R21 라운드가 돌며 지금의 라이브러리를 만들었습니다.

## 구조

```
repick-prompt/
├── .claude/skills/prompt-evolve/   # ★ 진화 루프 스킬 (공장 — 배포하지 않는다)
├── plugin/                         # ★ 배포 단위 — reprompt 플러그인
│   └── skills/reprompt/
│       ├── SKILL.md                #   3층 라우터 + 메타프롬프팅 6단계 루프
│       ├── dna/                    #   ⚙ 번들 DNA (생성물)
│       ├── library/                #   ⚙ 번들 라이브러리 30종 (생성물)
│       └── scripts/                #   run 폴더·meta.json·usage 로깅
├── vault/                          # 지식 허브 (Obsidian) — 단일 원본
│   ├── 00-principles/              # 프롬프트 DNA + 학습 인덱스 (LEARN이 갱신)
│   ├── 10-references/              # 씨앗 10개 (export-references.mjs로 재생성)
│   ├── 20-generations/             # 라운드별 후보·조립·결과물·점수·결정
│   ├── 30-ledger/                  # prompt-ledger.jsonl (append-only)
│   ├── 40-queries/                 # 도메인 본질 질의 (GENERATE가 소비)
│   ├── 50-library/                 # ★ 승격 템플릿 = 라이브러리 원본
│   └── backlog.md                  # 타깃 대기열 + 방향 가설
├── scripts/
│   ├── build-library.mjs           # 50-library → app/src/data/templates.generated.ts
│   ├── build-plugin-bundle.mjs     # 볼트 → 플러그인 번들 (바이트 복사 + 삭제 전파)
│   ├── wiki-lint.mjs               # 위키링크·라이브러리 포맷·번들 드리프트 가드
│   ├── prompt-loop.mjs             # ledger/run/조립 유틸
│   ├── assemble-run.mjs            # 후보 × 시나리오 값 → 실행용 프롬프트
│   └── export-references.mjs       # 50-library → 10-references
├── app/                            # 라이브러리 뷰어 (Next.js 16, 빌더 UI)
├── docs/                           # DESIGN.md + superpowers/{specs,plans}
└── RELEASING.md                    # 플러그인 릴리즈 런북
```

## 원본과 생성물

**볼트가 단일 원본이고 나머지는 전부 생성물입니다. 생성물을 손으로 고치지 않습니다** — 볼트를 고치고 재생성합니다.

| 생성물 | 원본 | 생성 명령 |
|---|---|---|
| `app/src/data/templates.generated.ts` | `vault/50-library/*.md` | `node scripts/build-library.mjs` |
| `plugin/skills/reprompt/dna/`·`library/` | `vault/00-principles/` + `vault/50-library/` | `node scripts/build-plugin-bundle.mjs` |

`node scripts/wiki-lint.mjs`가 바이트 불일치를 **FAIL로 막습니다.** 어긋난 채 배포하면 설치자에게 낡은 원칙과 빠진 템플릿이 갑니다 (R17에서 실제로 v1.14가 배포본에 잔존했던 사고).

## 라이브러리 뷰어 실행

```bash
cd app && npm install && npm run dev   # http://localhost:3200
```

빈칸 채우기 → 실시간 조립 미리보기 → 복사. 템플릿마다 "프롬프트 해부"(왜 작동하는가) 학습 패널 포함.

> ⚠️ 셸에 `NODE_ENV=development`가 전역 설정된 환경이라 build/start 스크립트에 `NODE_ENV=production`을 박아 두었습니다.

## 현재 라이브러리 (40종 / 11카테고리)

글쓰기 / 이메일 / 이미지 생성 / 기획 / 요약·정리 / 분석 / 리서치 / 코딩 / 제작 / 보고·문서 / 커리어 — 11개 카테고리에 템플릿 40종. 전체 목록과 미리보기는 앱 뷰어 또는 `vault/50-library/`에서 확인하세요.

## 수동으로 템플릿 추가

`vault/50-library/<slug>.md`를 추가하고 `node scripts/build-library.mjs && node scripts/build-plugin-bundle.mjs` 실행 — `{{key}}` 토큰 ↔ `fields[].key` 매핑, `optional` 필드는 비우면 줄 제거. 단, 새 템플릿은 `vault/00-principles/prompt-principles.md`의 DNA를 따를 것 (루프로 만들면 자동 준수).
