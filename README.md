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

| 라운드 | 타깃 | 승자 | 학습 |
|--------|------|------|------|
| R1 (2026-07-12) | 콜드 아웃리치 이메일 | b — 가이드 최대화 (심사 19/20) | 승부처는 문장력이 아니라 **발송 세트 완결성**(서명·팔로업·체크리스트) |
| R2 (2026-07-12) | 프로토타입 제작 | c — 프레임워크 내장 (심사 20/20) | **실데이터는 필수 빈칸으로** — 묻지 않으면 AI가 창작으로 메꾼다 (최소 빈칸 후보가 가짜 수업 20개 창작, 12점 3위) |
| R3 (2026-07-12) | 웹페이지(랜딩) 제작 | c — 프레임워크 내장 (심사 20/20) | **검증된 방법론은 요구사항 문장으로 내장** — 구조를 몰라도 전환형 페이지가 나온다 |
| R4 (2026-07-12) | 인스타 릴스·숏폼 대본 | c — 프레임워크 내장 (심사 20/20) | 프레임워크 내장 **3연속 승** 확정. 실행 여건(장비·인력)은 기본값에 맡기지 말고 빈칸/요구사항으로 고정 |

## 구조

```
repick-prompt/
├── .claude/skills/prompt-evolve/   # ★ 진화 루프 스킬 (본체)
├── vault/                          # 지식 허브 (Obsidian)
│   ├── 00-principles/              # 프롬프트 DNA + 학습 인덱스 (LEARN이 갱신)
│   ├── 10-references/              # 씨앗 10개 (export-references.mjs로 재생성)
│   ├── 20-generations/             # 라운드별 후보·조립·결과물·점수·결정
│   └── 30-ledger/                  # prompt-ledger.jsonl (append-only)
├── scripts/
│   ├── prompt-loop.mjs             # ledger/run/조립 유틸 (+ 테스트)
│   ├── assemble-run.mjs            # 후보 × 시나리오 값 → 실행용 프롬프트
│   └── export-references.mjs       # templates.ts → 10-references
├── app/                            # 라이브러리 뷰어 (Next.js 16, 빌더 UI)
│   └── src/data/templates.ts       # ★ 템플릿 라이브러리 = 데이터 (승격 대상)
└── docs/DESIGN.md
```

## 라이브러리 뷰어 실행

```bash
cd app && npm install && npm run dev   # http://localhost:3000
```

빈칸 채우기 → 실시간 조립 미리보기 → 복사. 템플릿마다 "프롬프트 해부"(왜 작동하는가) 학습 패널 포함.

> ⚠️ 셸에 `NODE_ENV=development`가 전역 설정된 환경이라 build/start 스크립트에 `NODE_ENV=production`을 박아 두었습니다.

## 현재 라이브러리 (14종 / 9카테고리)

글쓰기(유튜브 스크립트·링크드인·블로그·**릴스 대본 ← R4 생성**) / **이메일(콜드 아웃리치 ← R1 생성)** / 이미지 생성(썸네일) / 기획(서비스 아이디어·마케팅 실험) / 요약·정리(회의록) / 분석(고객 인터뷰) / 리서치(경쟁사 조사) / 코딩(코드 리뷰) / **제작(작동하는 프로토타입·원페이지 랜딩페이지 ← R2·R3 생성)**

## 수동으로 템플릿 추가

`app/src/data/templates.ts`의 `TEMPLATES` 배열에 객체 추가 — `{{key}}` 토큰 ↔ `fields[].key` 매핑, `optional` 필드는 비우면 줄 제거. 단, 새 템플릿은 `vault/00-principles/prompt-principles.md`의 DNA를 따를 것 (루프로 만들면 자동 준수).
