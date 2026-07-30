# Changelog

이 프로젝트의 주요 변경을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/), 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

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

[1.1.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.1.0
[1.0.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.0.0
