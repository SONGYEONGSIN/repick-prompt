---
tags: [home, prompt]
---

# 🏠 Prompt Evolution Loop — 홈

RE:PROMPT 템플릿의 **자기개선 루프** 지식 허브. 프롬프트 지식을 쌓고 → 템플릿으로 생성 → 사용·피드백으로 채점 → 학습을 되돌리는 폐루프. (repick-design의 Design Evolution Loop와 동일 구조)

## 핵심 노트
- [[prompt-principles]] — 현재의 프롬프트 DNA (LEARN이 갱신)
- [[MEMORY]] — 학습 인덱스

## 루프 실행
`/prompt-evolve "<타깃 작업>"` — `.claude/skills/prompt-evolve/SKILL.md`의 5단계:
**RETRIEVE**(DNA+씨앗+최근 결정) → **GENERATE**(후보 N개 병렬, 방향 분산) →
**AUTO-SCORE**(동일 시나리오로 실제 결과물 생성 → 블라인드 심사 + DNA 준수) →
**HUMAN GATE**(승자 선택, --auto 가능) → **LEARN**(원칙 surgical 갱신 + ledger + 라이브러리 승격)

## 폴더 구조
- `00-principles/` — 프롬프트 DNA + 학습 인덱스
- `10-references/` — 씨앗 (검증된 프롬프트 10개, `scripts/export-references.mjs`로 재생성)
- `20-generations/` — 라운드별 후보·결과물·점수·결정
- `30-ledger/` — 결정 로그 `prompt-ledger.jsonl` (append-only, 반증용)
- `40-queries/` — named query 템플릿 (질의 결과는 위키에 축적 — Karpathy LLM wiki 패턴)

## 라운드별 결정 (진화 체인)
- [[2026-07-12-cold-email/DECISION|R1 — b (발송 세트 완결성 승, auto)]]
- [[2026-07-12-prototype/DECISION|R2 — c (실데이터 필수 빈칸, 20/20)]]
- [[2026-07-12-webpage/DECISION|R3 — c (방법론은 요구사항 문장으로, 20/20)]]
- [[2026-07-12-reels-script/DECISION|R4 — c (숏폼 문법 내장 3연속, 20/20)]]
- [[2026-07-12-work-report/DECISION|R5 — c (결정 요청 상단 고정, 19/20)]]
- [[2026-07-13-cover-letter-interview/DECISION|R6 — c (검증형 부속물 타이브레이커 5연속, 20/20)]]
- [[2026-07-13-cs-reply/DECISION|R7 — b (결합형 첫 승, 내장 5연승 종료 — 대상 맥락 빈칸 승격, 20/20)]]
- [[2026-07-13-product-detail-page/DECISION|R8 — a (자기검증 내장 첫 도전 승 — 약점 정면 인정 승격, 20/20)]]
- [[2026-07-14-resume/DECISION|R9 — b (raw에 없는 세부 창작 금지 승격 — [확인 필요] 정직성 승, 17/20, auto)]]
- [[2026-07-17-process-judgment/DECISION|R11 — a (결합형 4승 — 행동 착지 강화: 하지 말 것, 라틴 방진 만장일치 57.5/60)]]
- [[2026-07-17-marketing-email/DECISION|R12 — c (단일 목표 정렬 — 결합형 연승 종료, 성과 판정 카드 승격, 55.5/60)]]
- [[2026-07-20-insta-content/DECISION|R15 — b (측정-실험 문법 — 결합형 3연패, 감의 출처는 감으로 승격, 58/60)]]
- [[2026-07-15-cs-reply-reason-ab/DECISION|H1-1 — 가설 A/B: 이유 병기 vs R7 챔피언 (천장 효과 무승부)]]
- [[2026-07-16-portfolio-onepage/DECISION|R10 — b (결합형 3승째 — 발송물 정련 강화: 인용 화법, 38/40)]]
- [[2026-07-15-cold-email-reason-ab/DECISION|H1-2 — 가설 A/B 재검: 이유 병기 vs R1 챔피언 (승격, v1.8 + 18종 소급)]]
- [[2026-07-18-interview-qa-prep/DECISION|R14 — b (압박질문 정면 대응 — raw 미확정 지점 질문화 신규 승격, 라틴 방진 만장일치 56/60)]]
- [[2026-07-19-business-email-reply/DECISION|R16 — b (전항목 커버리지 강제 — 다목적 원문 완전성 자기점검, 라틴 방진 만장일치 106/120, 애매 판정으로 DNA 미변경·정제 질문)]]
- [[2026-07-21-presentation-script/DECISION|R17 — a (결합형 표준 — 복수 이해관계자 연결 신규 승격, 결합형 3연패 이후 첫 승, 라틴 방진 만장일치 57/60)]]
