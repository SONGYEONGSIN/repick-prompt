# Changelog

이 프로젝트의 주요 변경을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/), 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.2.0] - 2026-08-02

### Added
- **승격 템플릿 2종** — 서비스 FAQ 페이지 작성(R22), 보도자료 작성(R23). 라이브러리 30종 → **32종**.
- **사용 기록에 `layer`·`matched_slug`** — 실행이 1층(라이브러리 히트)이었는지 2층(뼈대 없이 조립)이었는지와, 1층이면 어떤 템플릿이 쓰였는지를 남긴다. 2층 기록만 모으면 라이브러리가 못 덮은 작업이 드러나고, `matched_slug`는 라이브러리 적중률을 준다. 모순된 값(1층인데 슬러그 없음 / 2층인데 있음)은 기록을 오염시키므로 던진다.

### Changed
- 번들 DNA v1.19 → **v1.21**. 조건부 예외 1건(통째로 게시되는 문서는 검토용 부속물 배제, R22)과 신규 원칙 1건(완성 예시 동봉 — 통제 재검으로 순효과 격리, R23)이 반영됐다.
- 3층 훅이 `layer: 2` 기록만 본다 — 1층은 이미 라이브러리가 덮은 작업이라 백로그 제안 대상이 아니다.

## [1.1.0] - 2026-07-31

### Added
- **승격 라이브러리 동봉** — 진화 루프가 라틴 방진 블라인드 심사로 승격한 템플릿 30종을 플러그인에 실어 나른다. 볼트가 없는 레포에서도 검증된 뼈대를 쓸 수 있다.
- **자동 3층 라우팅** — 1층: 라이브러리에 맞는 템플릿이 있으면 그 뼈대에 대화 맥락을 채운다 / 2층: 없으면 기존대로 DNA 4요소로 깎는다 / 3층: 같은 작업이 반복되면 진화 백로그 타깃 제안(훅만, 판정 임계는 미정).
- **`--evolve`** — 볼트가 있는 레포에서만 진화 라운드로 진입한다. 없으면 거부한다(공장은 원본 레포에 있다).
- **사용 기록** — 실행마다 `~/.reprompt/usage.jsonl`에 1건. 쓰기 실패가 실행을 막지 않는다.

### Changed
- 번들 DNA·라이브러리가 **빌드 산출물**이 됐다(`scripts/build-plugin-bundle.mjs`). 수동 `cp` 제거, `wiki-lint`가 드리프트를 FAIL로 차단한다 — 종전 검사는 WARN이라 DNA를 어긋내도, 라이브러리를 통째로 지워도 통과했다.
- 번들 DNA v1.14 → **v1.19**.

## [1.0.0] - 2026-07-21

### Added
- `reprompt` 메타프롬프팅 스킬 — 대화 맥락을 프롬프트 DNA(v1.14)로 맞춤 프롬프트로 깎아 `.reprompt/<날짜>-<slug>/`에 6파일(BRIEF/PROMPT/RATIONALE/OUTPUT/INSPECTION.md + meta.json)로 산출·실행·점검하는 6단계 루프.
- 실행환경 변환 4타깃: general / coding(Goal 중지요건 + Ultracode 제약) / image(구도·피사체·스타일·조명·카메라) / research(출처·범위·검증).
- Claude Code 플러그인 패키징: `plugin/` 배포 단위 + 자체 마켓플레이스(`repick-prompt`), `${CLAUDE_SKILL_DIR}` 기반 이식성, 번들 DNA.

[1.2.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.2.0
[1.1.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.1.0
[1.0.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.0.0
