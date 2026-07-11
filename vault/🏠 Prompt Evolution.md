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

## 라운드별 결정 (진화 체인)
- [[2026-07-12-cold-email/DECISION|R1 — b (발송 세트 완결성 승, auto)]]
