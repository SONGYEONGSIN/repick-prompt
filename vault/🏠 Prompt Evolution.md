---
tags: [home, prompt]
---

# 🏠 Prompt Evolution Loop — 홈

RE:PROMPT 템플릿의 **자기개선 루프** 지식 허브. 프롬프트 지식을 쌓고 → 템플릿으로 생성 → 사용·피드백으로 채점 → 학습을 되돌리는 폐루프. (repick-design의 Design Evolution Loop와 동일 구조)

## 핵심 노트
- [[prompt-principles]] — 현재의 프롬프트 DNA (LEARN이 갱신)

## 폴더 구조
- `00-principles/` — 프롬프트 DNA + 학습 인덱스
- `10-references/` — 씨앗 (검증된 외부 프롬프트 패턴 수집)
- `20-generations/` — 라운드별 템플릿 개정안·평가·결정
- `30-ledger/` — 결정 로그 (반증용)

## 루프 운용 (repick-design 방식 계승)
1. **EVALUATE** — 템플릿 사용 피드백·결과물 품질 수집
2. **ANALYZE** — 어떤 필드/요구사항/형식이 품질을 갈랐는지 분석
3. **IMPROVE** — `app/src/data/templates.ts` surgical 개정 + 본 vault에 근거 기록
