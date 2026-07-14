---
name: prompt-evolve
description: 프롬프트 진화 루프 1회 실행 — 볼트 지식으로 타깃 작업의 프롬프트 템플릿 후보 N개 생성 → 동일 테스트 입력으로 실제 결과물 생성 → 블라인드 심사 + DNA 준수 채점 → 승자를 라이브러리에 승격하고 원칙을 학습. "템플릿 만들어줘", "프롬프트 생성", "템플릿 진화", "/prompt-evolve" 시 사용. 인자: 타깃 작업(필수, 예 "콜드 아웃리치 이메일"), N(기본 3), --auto(사람 게이트 생략).
---

# Prompt Evolve — 5단계 루프

인자: `$TARGET`(타깃 작업, slug화하여 run 이름에 사용), `$N`(기본 3), `--auto`(자동 선택 모드).
볼트 루트 `vault/`, 라이브러리 `app/src/data/templates.ts`, 유틸 `scripts/prompt-loop.mjs`.

## 1. RETRIEVE

- `vault/00-principles/prompt-principles.md` 전문을 읽는다 (현재 프롬프트 DNA).
- `vault/10-references/`에서 `$TARGET`과 가까운 참조 2~4개를 읽는다 (같은 카테고리 우선, 없으면 구조가 유사한 것).
- 최근 학습 반영:
  `node -e "import('./scripts/prompt-loop.mjs').then(m=>console.log(JSON.stringify(m.recentDecisions(5,'vault/30-ledger/prompt-ledger.jsonl'))))"`
- run 디렉토리 생성: `newRun(<target-slug>, "vault/20-generations", <오늘 YYYY-MM-DD>)`.

## 2. GENERATE

- 에이전트를 $N회 **병렬** 호출 (`general-purpose` 또는 `developer`). 각 호출에 RETRIEVE 컨텍스트(DNA 전문 + 참조 + 최근 결정)를 전달하고 **서로 다른 설계 방향**을 지시. 예:
  - a = 최소 빈칸 (필수 3~4개, 즉시 사용 최우선)
  - b = 가이드 최대화 (help/placeholder 풍부, 초보자 이탈 방지 최우선)
  - c = 프레임워크 내장 (해당 도메인의 검증된 방법론을 요구사항에 구조화)
- 각 후보는 다음 형식의 마크다운으로 `vault/20-generations/<run>/candidates/<variant>.md`에 저장:
  - 한 줄 컨셉 + fields 표 (key/label/type/optional/help/placeholder/options)
  - `{{key}}` 토큰을 쓴 template 본문 (4요소 구조 준수)
  - anatomy 4항목 + tips 2개 (라이브러리 승격 시 그대로 사용)

## 3. AUTO-SCORE (자동 1차 필터)

- **동일 테스트 시나리오** 1개를 정한다 (현실적인 초보자 입력값 세트). run 폴더 `SCENARIO.md`에 기록.
- 각 후보에 대해:
  - `assembleForTest(본문, 시나리오값)`으로 실행용 프롬프트를 조립.
  - 에이전트에게 조립된 프롬프트를 **그대로 실행**시켜 실제 결과물을 `vault/20-generations/<run>/outputs/<variant>.md`에 저장. (결과물이 곧 증거)
- **블라인드 심사**: `comparator` 에이전트에 결과물들을 익명(A/B/C)으로 전달, 기준 = 지시 이행도 / 바로 사용 가능성 / 구체성 / 환각·과장 억제. 랭킹 + 한 줄 비평.
- **DNA 준수 점검** (기계적): 4요소 구조 유무, 빈칸 수 6±3, 전 필드 placeholder 유무, anti-slop 위반 수.
- 결과를 표로 `vault/20-generations/<run>/SCORES.md`에 기록.

## 4. HUMAN GATE (`--auto`면 자동 선택)

- 기본: 상위 2개를 사용자에게 제시 — 결과물 미리보기 + 점수 요약 + 심사 한 줄. 사용자의 승자 선택 + 한 줄 이유를 받는다 (응답 없이 진행 금지).
- `--auto`: 종합 1위를 자동 선택하고 ledger에 `"auto":true`로 기록. 완료 보고에서 사용자가 뒤집을 수 있음을 명시.
- `vault/20-generations/<run>/DECISION.md`에 승자/이유/탈락 사유 기록.

## 5. LEARN

- 승자의 "이유"에서 재사용 가능한 규칙 1개를 추출한다.
- **지식 정제 게이트**: 추출한 규칙을 기존 DNA 전체와 대조해 넷 중 하나로 판정하고, 판정과 근거 1줄을 DECISION.md에 기록한다. 가치 기준 = ① 재사용 범위(여러 카테고리 적용 여부) ② 실측 근거(심사 점수·산출물로 반증 가능했나) ③ 기존 원칙과의 중복도.
  - **신규** — 기존 원칙이 없는 축 → `prompt-principles.md`에 추가 (surgical, 무관 부분 불변)
  - **강화** — 같은 축·같은 방향 → 기존 원칙에 근거 라운드만 덧붙임. 새 항목 추가 금지 (유사 지식 중복 누적 방지)
  - **충돌** — 같은 축·반대 방향 → 임의로 덮어쓰지 않고 정제 질문 생성
  - **애매** — 판정이 서지 않음 → 정제 질문 생성
- **근거 인용 형식**: `prompt-principles.md`에 라운드 근거를 쓸 때는 플레인 텍스트 `(R9: …)`가 아니라 `([[<라운드 폴더명>/DECISION|R<N>]]: 근거 한 줄)` 위키링크로 쓴다 — 홈 노트와 동일 형식, 옵시디언 그래프/백링크에 원칙→라운드 연결이 보이게.
- **정제 질문** (충돌/애매 시 필수): "기존 원칙 X ↔ 새 규칙 Y — 어느 쪽이 더 일반적으로 유효한가? 판단 기준은?" 형식. 대화 모드면 사용자에게 즉시 묻고 답을 반영한다. `--auto` 모드면 DNA를 건드리지 않고 질문을 DECISION.md와 PR 본문 `## 지식 정제 질문` 섹션에 남긴다. 사람이 답하면 **그 답의 판단 기준 자체를** 다음 원칙으로 축적한다 (정제 기준의 학습).
- ledger append:
  `node -e "import('./scripts/prompt-loop.mjs').then(m=>m.appendLedger({run:'<run>',candidate:'<variant>',won:true,reason:'<한 줄>',metrics:{judge_rank:1,dna_violations:0,fields:0},principle_delta:'<규칙>'},'vault/30-ledger/prompt-ledger.jsonl'))"`
- `vault/00-principles/MEMORY.md`에 한 줄 추가 (200줄 cap).
- **승자를 라이브러리에 승격**: `app/src/data/templates.ts`의 `TEMPLATES`에 추가 (candidates/<variant>.md의 fields/template/anatomy/tips 그대로). 필요 시 `CATEGORIES`에 새 카테고리 추가.
- `node --experimental-strip-types scripts/export-references.mjs`… 는 실행하지 않는다 — 10-references는 외부 씨앗 전용, 생성물은 20-generations와 라이브러리에 남는다.
- 검증: `cd app && npm run lint && npm run build` 통과 확인.
- 완료 요약 보고: 무엇이 이겼는지, 결과물이 어땠는지, 원칙이 어떻게 바뀌었는지, 라이브러리 몇 종이 되었는지.

## 금지

- 결과물 없이 후보를 심사하지 않는다 (템플릿 겉모습이 아니라 **산출물**로 평가).
- 과거 ledger entry 수정 금지 (append-only).
- 한 라운드에 타깃 1개만 (다중 타깃은 라운드를 나눈다).
- 씨앗 참조(10-references)를 생성물로 덮어쓰지 않는다.
