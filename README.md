# RE:PROMPT — 빈칸만 채우면 완성되는 프롬프트

AI 초보자를 위한 프롬프트 빌더. 검증된 카테고리별 템플릿의 빈칸을 채우면 완성도 높은 프롬프트가 실시간으로 조립되고, 템플릿마다 붙은 **프롬프트 해부**가 왜 이 구조가 작동하는지 알려줍니다.

> repick-design(디자인 자기개선 루프)과 동일 컨셉의 프롬프트 버전 — 지식(vault) → 생성(템플릿) → 학습(해부·피드백) 폐루프.

## 실행

```bash
cd app
npm install
npm run dev        # http://localhost:3000
npm run build      # 프로덕션 빌드 (NODE_ENV=production 강제)
```

> ⚠️ 셸에 `NODE_ENV=development`가 설정돼 있으면 Next.js 프로덕션 빌드가 깨집니다.
> build/start 스크립트에 `NODE_ENV=production`을 박아 방지해 두었습니다.

## 구조

```
repick-prompt/
├── app/                        # Next.js 16 + React 19 + Tailwind 4
│   └── src/
│       ├── app/                # / (홈), /p/[slug] (빌더)
│       ├── components/         # explorer, builder, site-header
│       ├── data/templates.ts   # ★ 템플릿 = 데이터 — 여기만 수정하면 템플릿 추가
│       └── lib/prompt.ts       # 토큰 치환·조립 규칙
├── vault/                      # 프롬프트 지식 허브 (Obsidian)
│   └── 00-principles/          # 프롬프트 DNA — 템플릿 작성·개정 원칙
└── docs/DESIGN.md              # 설계 문서
```

## 템플릿 추가 방법

`app/src/data/templates.ts`의 `TEMPLATES` 배열에 객체 하나를 추가하면 끝. 코드 수정 불필요.

- `template` 본문에 `{{key}}` 토큰 → `fields[]`의 `key`와 매핑
- `optional: true` 필드가 비면 해당 줄이 결과에서 제거됨
- `anatomy[]` (역할/맥락/요구사항/출력 형식)와 `tips[]`는 학습 패널에 표시

새 템플릿은 `vault/00-principles/prompt-principles.md`의 4요소 구조를 따를 것.

## 현재 템플릿 (10종 / 7카테고리)

글쓰기(유튜브 스크립트·링크드인·블로그) / 이미지 생성(썸네일) / 기획(서비스 아이디어·마케팅 실험) / 요약·정리(회의록) / 분석(고객 인터뷰) / 리서치(경쟁사 조사) / 코딩(코드 리뷰)
