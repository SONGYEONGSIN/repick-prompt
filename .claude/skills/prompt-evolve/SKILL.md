---
name: prompt-evolve
description: 프롬프트 진화 루프 1회 실행 — 볼트 지식으로 타깃 작업의 프롬프트 템플릿 후보 N개 생성 → 동일 테스트 입력으로 실제 결과물 생성 → 블라인드 심사 + DNA 준수 채점 → 승자를 라이브러리에 승격하고 원칙을 학습. "템플릿 만들어줘", "프롬프트 생성", "템플릿 진화", "/prompt-evolve" 시 사용. 인자: 타깃 작업(필수, 예 "콜드 아웃리치 이메일"), N(기본 3), --auto(사람 게이트 생략).
---

# Prompt Evolve — 5단계 루프

인자: `$TARGET`(타깃 작업, slug화하여 run 이름에 사용), `$N`(기본 3), `--auto`(자동 선택 모드).
볼트 루트 `vault/`, 라이브러리 `vault/50-library/`, 유틸 `scripts/prompt-loop.mjs`.

## 1. RETRIEVE

- `vault/00-principles/prompt-principles.md` 전문을 읽는다 (현재 프롬프트 DNA).
- `vault/10-references/`에서 `$TARGET`과 가까운 참조 2~4개를 읽는다 (같은 카테고리 우선, 없으면 구조가 유사한 것).
- 최근 학습 반영:
  `node -e "import('./scripts/prompt-loop.mjs').then(m=>console.log(JSON.stringify(m.recentDecisions(5,'vault/30-ledger/prompt-ledger.jsonl'))))"`
- run 디렉토리 생성: `newRun(<target-slug>, "vault/20-generations", <오늘 YYYY-MM-DD>)`.

## 2. GENERATE

- **도메인 본질 질의 (named query)**: 방향 풀 설계 전에 `vault/40-queries/domain-fit.md`의 질의를 수행하고 답변을 run 폴더 `DOMAIN.md`로 저장한다 — 방향 풀은 도메인의 본질 리스크·본질 루프에서 도출한다 (R12: 측정 본질 도메인에서 결합형 연승 종료). 라운드 종료 시 예측-실제 대조 1줄을 DECISION.md에 남긴다.
- 에이전트를 $N회 **병렬** 호출 (`general-purpose` 또는 `developer`). 각 호출에 RETRIEVE 컨텍스트(DNA 전문 + 참조 + 최근 결정)를 전달하고 **서로 다른 설계 방향**을 지시. 예:
  - a = 최소 빈칸 (필수 3~4개, 즉시 사용 최우선)
  - b = 가이드 최대화 (help/placeholder 풍부, 초보자 이탈 방지 최우선)
  - c = 프레임워크 내장 (해당 도메인의 검증된 방법론을 요구사항에 구조화)
- **방향 가설 소비**: `vault/backlog.md`의 `## 방향 가설` 섹션에 미검증(`- [ ]`) 가설이 있으면 그중 첫 번째를 후보 1개의 설계 방향으로 배정한다 (라운드당 1개). 라운드 완료 시 해당 가설을 `- [x]`로 바꾸고 ` → <run-slug> (R<n>, 순위/채택 여부)`를 덧붙인다 — 채택이면 LEARN 게이트로, 탈락이면 기록만 남긴다.
- 각 후보는 **라이브러리와 동일한 포맷**으로 `vault/20-generations/<run>/candidates/<variant>.md`에 저장한다 (승격이 번역이 아니라 파일 이동이 되도록):
  - `# 후보 <variant> — 한 줄 컨셉`
  - `## 필드` — ```json 코드펜스에 `[{key,label,type,help?,placeholder?,options?,optional?}]` 배열. **마크다운 표를 쓰지 않는다** (표는 열 수가 어긋나도 조용히 통과해 R18 승격본이 깨진 채 지나갔다)
  - `## 본문` — 언어 없는 코드펜스에 `{{key}}` 토큰을 쓴 template 본문 (4요소 구조 준수)
  - `## 해부` — `### <part>` 마다 `> 인용` 한 줄 + 설명 문단. **4항목 이상**
  - `## 팁` — `- ` 불릿 **2개 이상**
  - frontmatter는 후보 단계에선 쓰지 않는다 (slug/categoryId/title/description/order는 승격 때 정해진다)
  - **파서가 엄격하다**: `## 필드`/`## 본문` 코드펜스 뒤에 산문이 남으면 실패, `## 해부`는 첫 `### ` 앞에 내용(빈 줄 제외)이 있으면 실패, `## 팁`은 중첩 불릿이나 `*` 불릿을 쓰면 실패한다.

## 3. AUTO-SCORE (자동 1차 필터)

- **동일 테스트 시나리오** 1개를 정한다 (현실적인 초보자 입력값 세트). run 폴더 `SCENARIO.md`에 기록.
  - **SCENARIO에는 values.json에 채울 모든 사실(수치·기한·부가 정보 포함)을 빠짐없이 명기한다** — 심사자는 SCENARIO만 보고 대조하므로, values에만 있는 사실은 결과물의 정당한 문구를 창작·환각으로 오판하게 만든다 (R1 재검 "4.2만 팔로워"·R11 "2주 시한" 2회 실측 재발).
  - **심사 배치는 순서 편향 통제 필수** — 2자 비교는 순서 교차 2회, 3자 비교는 라틴 방진 3회(각 후보가 각 위치에 1회씩). 단일 심사는 두 번째 제시물 편향으로 오판한다 (H1 4/4 실측).
- 각 후보에 대해:
  - 시나리오 값은 **`vault/20-generations/<run>/values.json` 하나에** 후보별 키(`{"a":{…},"b":{…},"c":{…}}`)로 저장한다. `values-a.json`처럼 쪼개지 않는다 — R22·R23이 쪼개 쓰는 바람에 `wiki-lint`의 SCENARIO 사실 대조가 경로 불일치로 **무검사 통과**했고 4번째 오판 사고가 났다.
  - `assembleForTest(본문, 시나리오값)`으로 실행용 프롬프트를 조립해 **`vault/20-generations/<run>/assembled/<variant>.txt`**에 저장한다(`assembled-a.txt` 아님).
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
- **플러그인 번들 재생성**: `node scripts/build-plugin-bundle.mjs` — 볼트 DNA와 승격 라이브러리를 플러그인 번들(`plugin/skills/reprompt/dna/`·`library/`)로 복사한다. 플러그인은 레포 안에선 vault를 우선 읽지만 스탠드얼론 설치 시엔 이 번들이 유일한 원본이므로, 방치하면 낡은 원칙과 빠진 템플릿이 배포된다 (R17에서 v1.15 갱신 시 미동기화로 v1.14 잔존). **번들 파일을 손으로 고치지 않는다** — 볼트를 고치고 재생성한다. 잊어도 아래 검증의 `wiki-lint`가 FAIL로 잡는다.
- **승자를 라이브러리에 승격** (번역이 아니라 이동):
  1. `cp vault/20-generations/<run>/candidates/<승자>.md vault/50-library/<slug>.md`
  2. 그 파일 맨 위에 frontmatter를 붙인다 — `tags: ["template", "<categoryId>"]` / `slug` / `categoryId` / `title` / `description` / `promoted: "<run>"` / `order: <기존 최대 order + 1>`(최대값 확인: `grep -h '^order:' vault/50-library/*.md | sort -t' ' -k2 -n | tail -1`). 값은 전부 JSON 인용 문자열, `order`만 정수.
  3. `# 후보 <variant> — …` 제목 줄을 `# <title>` 로 바꾸고 그 아래에 `승격 [[<run>/DECISION|라운드]]` 한 줄을 남긴다.
  4. 새 카테고리가 필요하면 `vault/50-library/_categories.md`의 json 배열에 `{id, name}`을 추가한다.
  5. `node scripts/build-library.mjs` — `app/src/data/templates.generated.ts`가 갱신된다. **이 파일을 손으로 고치지 않는다.**
  6. `README.md`의 '현재 라이브러리' 줄(종수·카테고리 수)을 방금 실행한 `build-library.mjs` 출력으로 최신화한다.
- `node --experimental-strip-types scripts/export-references.mjs`… 는 실행하지 않는다 — 10-references는 외부 씨앗 전용, 생성물은 20-generations와 라이브러리에 남는다.
- 검증 (순서 고정): `node scripts/build-plugin-bundle.mjs` → `node scripts/build-library.mjs` → `node scripts/wiki-lint.mjs` → `node --test scripts/lib/template-md.test.mjs scripts/build-library.test.mjs scripts/library-snapshot.test.mjs` → `cd app && npm run lint && npm run build`. wiki-lint는 깨진 위키링크·홈 체인 누락·ledger↔DECISION 정합·MEMORY 200줄 cap을 보고, 라이브러리 포맷(해부 4항목 이상·팁 2개 이상·토큰↔필드 양방향 일치·categoryId 유효)과 파생물 바이트 일치도 검사한다. 단 콘텐츠 손상은 wiki-lint로 못 잡으므로 node --test로 동결 스냅샷을 대조한다 — 셋 중 하나라도 건너뛰면 드리프트나 손상이 조용히 통과한다.
- 완료 요약 보고: 무엇이 이겼는지, 결과물이 어땠는지, 원칙이 어떻게 바뀌었는지, 라이브러리 몇 종이 되었는지.

## 금지

- 결과물 없이 후보를 심사하지 않는다 (템플릿 겉모습이 아니라 **산출물**로 평가).
- 과거 ledger entry 수정 금지 (append-only).
- 한 라운드에 타깃 1개만 (다중 타깃은 라운드를 나눈다).
- 씨앗 참조(10-references)를 생성물로 덮어쓰지 않는다.
