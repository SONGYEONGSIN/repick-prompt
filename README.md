# RE:PROMPT — 프롬프트를 생성하고, 검증하고, 학습하는 루프

repick-design(디자인 자기개선 루프)과 동일 컨셉의 프롬프트 버전.
**본체는 진화 루프**입니다 — 지식(vault)으로 프롬프트 템플릿 후보를 생성하고, 실제 결과물로 검증하고, 학습을 원칙에 되돌려 템플릿 라이브러리를 불려갑니다. 웹앱은 그 라이브러리를 초보자가 쓰는 뷰어입니다.

## 진화 루프 실행 (핵심)

```
/prompt-evolve "<타깃 작업>"          # 예: /prompt-evolve "인스타 릴스 대본"
/prompt-evolve "<타깃 작업>" --auto   # 사람 게이트 없이 자동 선택
```

5단계 (`.claude/skills/prompt-evolve/SKILL.md`):

1. **RETRIEVE** — 프롬프트 DNA(`vault/00-principles`) + 씨앗(`10-references`) + 최근 결정(ledger)
2. **GENERATE** — 후보 템플릿 N개 병렬 생성 (방향 분산: 최소 빈칸 / 가이드 최대화 / 프레임워크 내장 …)
3. **AUTO-SCORE** — **동일 시나리오로 실제 결과물 생성** → 블라인드 심사(comparator) + DNA 준수 점검
4. **HUMAN GATE** — 승자 선택 (`--auto`면 자동, ledger에 기록)
5. **LEARN** — 원칙 surgical 갱신 + ledger append + **승자를 라이브러리에 승격**

### 진화 이력

라운드별 타깃·승자·학습 전체 기록은 `vault/🏠 Prompt Evolution.md`에, append-only 결정 원장은 `vault/30-ledger/prompt-ledger.jsonl`에 있습니다. 지금까지 R1~R19 라운드가 돌며 지금의 라이브러리를 만들었습니다.

## 구조

```
repick-prompt/
├── .claude/skills/prompt-evolve/   # ★ 진화 루프 스킬 (본체)
├── vault/                          # 지식 허브 (Obsidian)
│   ├── 00-principles/              # 프롬프트 DNA + 학습 인덱스 (LEARN이 갱신)
│   ├── 10-references/              # 씨앗 10개 (export-references.mjs로 재생성)
│   ├── 20-generations/             # 라운드별 후보·조립·결과물·점수·결정
│   ├── 30-ledger/                  # prompt-ledger.jsonl (append-only)
│   └── 50-library/                 # ★ 승격 템플릿 = 라이브러리 원본 (LEARN이 여기로 이동)
├── scripts/
│   ├── prompt-loop.mjs             # ledger/run/조립 유틸 (+ 테스트)
│   ├── assemble-run.mjs            # 후보 × 시나리오 값 → 실행용 프롬프트
│   └── export-references.mjs       # 50-library → 10-references
├── app/                            # 라이브러리 뷰어 (Next.js 16, 빌더 UI)
└── docs/DESIGN.md
```

## 라이브러리 뷰어 실행

```bash
cd app && npm install && npm run dev   # http://localhost:3200
```

빈칸 채우기 → 실시간 조립 미리보기 → 복사. 템플릿마다 "프롬프트 해부"(왜 작동하는가) 학습 패널 포함.

> ⚠️ 셸에 `NODE_ENV=development`가 전역 설정된 환경이라 build/start 스크립트에 `NODE_ENV=production`을 박아 두었습니다.

## 현재 라이브러리 (29종 / 11카테고리)

글쓰기 / 이메일 / 이미지 생성 / 기획 / 요약·정리 / 분석 / 리서치 / 코딩 / 제작 / 보고·문서 / 커리어 — 11개 카테고리에 템플릿 28종. 전체 목록과 미리보기는 앱 뷰어 또는 `vault/50-library/`에서 확인하세요.

## 수동으로 템플릿 추가

`vault/50-library/<slug>.md`를 추가하고 `node scripts/build-library.mjs` 실행 — `{{key}}` 토큰 ↔ `fields[].key` 매핑, `optional` 필드는 비우면 줄 제거. 단, 새 템플릿은 `vault/00-principles/prompt-principles.md`의 DNA를 따를 것 (루프로 만들면 자동 준수).
