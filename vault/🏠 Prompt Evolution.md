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
- [[2026-07-23-newsletter/DECISION|R18 — a (결합형 표준 2연승 — 실데이터 필수 빈칸 강화: 다음 호 예고도 전용 빈칸 필요, 라틴 방진 만장일치 49/60, auto)]]
- [[2026-07-24-business-proposal/DECISION|R19 — b (결정자 관문 정렬형 — 결정 기준별 1:1 대응 구조 신규 승격, 결합형 2연승 종료, 라틴 방진 만장일치 57/60, auto)]]
- [[2026-07-26-sns-ad-copy/DECISION|R20 — 중단 (미완: 후보 3개·결과물까지 생성, 블라인드 심사 전 종료. 승자 없음, 백로그 미소비)]]
- [[2026-07-30-user-persona/DECISION|R21 — a (결합형 표준 — 참조자 질문 직결 구조 신규 승격, 라틴 방진 만장일치 111/120, auto)]]
- [[2026-07-31-service-faq/DECISION|R22 — c (완성 예시 동봉 — 라틴 방진 만장일치 103/120, auto; 발송 세트 착지 조건부 예외 신규 승격, 검증 대상이던 완성 예시 가설은 애매 판정으로 DNA 미변경·정제 질문)]]
- [[2026-08-01-press-release/DECISION|R23 — c (완성 예시 동봉 — a와 예시 유무만 다른 통제쌍이 라틴 방진 3/3 전승, 2/3 라운드 1위·총점 102.0/120, auto; R22 애매 판정 해소, DNA v1.21 신규 승격)]]
- [[2026-08-02-job-posting/DECISION|R24 — c (XML 구조 태그 — a와 태그 유무만 다른 통제쌍, 2/3 라운드 1위·총점 112/120, auto; 가설이 겨냥한 지시이행도 축은 3라운드 전부 동점이라 애매 판정으로 DNA 미변경, raw 창작 금지 원칙은 신규 도메인(채용 공고)에서 재현 강화 v1.22)]]
- [[2026-08-04-metrics-report-memo/DECISION|R25 — c (판단 착지 우선형 — 결정 요청 상단 고정+행동 착지 결합 재확인 v1.23, 2/3 라운드 1위·총점 103/120, auto; b와 1점 차 근소 우세, 교란요인 전용 빈칸 부재는 근거 약해 관찰 메모로만 기록)]]
- [[2026-08-05-research-questions/DECISION|R26 — c (실전 인터뷰 진행 최적화형 — 발송 세트 착지+다음 관문 대비물 강화 v1.24, 라틴 방진 만장일치 106/120, auto; 편향 차단형(b)의 인라인 자가점검 로그는 환각억제 축 우세에도 사용성 저하로 패배, 통제 재검을 backlog 방향 가설로 기록)]]
- [[2026-08-06-long-document-summary/DECISION|R27 — a (결합형 표준+자가점검 로그 본문노출 — 2/3 라운드 1위·총점 99/120, auto; raw 창작 금지 강화(계산·파생 수치 v1.25)+발송 세트 착지 v1.20 강화(배치 타이브레이커: 배제>본문노출>부속분리), backlog 방향 가설(본문노출 vs 부속분리) 채택 소비)]]
- [[2026-08-07-customer-onboarding/DECISION|R28 — b (망설임 선제 봉쇄형 — 라틴 방진 만장일치 109/120, 2위와 +23점 역대 최대 격차, auto; 자기검증 루프 내장 강화 v1.26 — raw에 없는 저항 지점 창작이 부속 메모를 넘어 본문까지 침투하는 유형 확인, 원천 차단형 설계가 더 안전한 대안)]]
