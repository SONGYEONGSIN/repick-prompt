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
