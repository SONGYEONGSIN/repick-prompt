# RE:PROMPT — 설계 문서 (간략 설계)

> repick-design과 동일 컨셉("지식 → 생성 → 학습" 루프)의 프롬프트 버전.
> AI 초보자가 빈칸만 채우면 완성도 높은 프롬프트를 얻고, 그 과정에서 프롬프트 구조를 배우는 도구.

## 변경 의도

- **문제**: AI 초보자는 프롬프트 작성 자체가 어렵다. 무엇을 어떤 순서로 써야 하는지 모른다.
- **해법**: 검증된 카테고리별 템플릿 → 가이드 폼(빈칸) → 실시간 조립 미리보기 → 복사.
  각 템플릿에 "프롬프트 해부"(왜 이 구조가 작동하나)를 붙여 **쓰면서 배우게** 한다.

## 검증 방법

`npm run build` + `npm run lint` 통과, 템플릿 10종이 홈/빌더 페이지에서 렌더·조립·복사되는지 확인.

## 구조 (repick-design 미러링)

```
repick-prompt/
├── app/                  # Next.js 16 + React 19 + Tailwind 4 (repick-design과 동일 스택)
│   └── src/
│       ├── app/          # 홈(page.tsx), 빌더(p/[slug]/page.tsx)
│       ├── components/   # explorer, builder, copy-button
│       ├── data/         # templates.ts — 템플릿 = 데이터 (코드 수정 없이 추가 가능)
│       └── lib/          # prompt.ts — 토큰 치환·조립 로직
├── vault/                # 프롬프트 지식 시드 (향후 학습 루프의 00-principles)
└── docs/DESIGN.md
```

## 데이터 모델

- `PromptTemplate`: slug / category / title / description / **fields[]** / **template** / anatomy[] / tips[]
- `template` 본문의 `{{key}}` 토큰이 `fields[].key`와 매핑
- 필드 타입: `text` | `textarea` | `select`(제안 칩 + 자유 입력)
- **조립 규칙**:
  - 필수 필드 미입력 → `[라벨]` 유지 + 미리보기에서 경고 하이라이트
  - 선택 필드 미입력 → 해당 줄 자체를 제거 (불완전한 프롬프트 복사 방지)

## 디자인 DNA (repick-design vault/00-principles 계승)

- near-monochrome 다크(#0B0B0F), 액센트 #6E56CF 극소량, 정지 상태에서도 존재감
- 임팩트는 타이포 스케일 대비로 — 비대칭 좌측정렬 히어로, ghost 넘버, eyebrow 트래킹 0.28em
- 폰트 웨이트 정확히 3종 (400/600/800), Pretendard
- **차별점**: 프롬프트 미리보기는 모노스페이스 문서 아티팩트(줄번호 + 슬롯 하이라이트) — "구조가 조립되는 과정"을 시각화
- 금지: 그라데이션 남발, 세리프 헤드라인, 라인아트 장식

## 학습 루프 (향후)

vault/00-principles/prompt-principles.md가 프롬프트 DNA.
사용 데이터·피드백 → 템플릿 개정 → 원칙 갱신의 폐루프는 repick-design의 design-loop 방식을 따른다.
