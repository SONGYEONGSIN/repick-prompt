# Changelog

이 프로젝트의 주요 변경을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/), 버전은 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.0.0] - 2026-07-21

### Added
- `reprompt` 메타프롬프팅 스킬 — 대화 맥락을 프롬프트 DNA(v1.14)로 맞춤 프롬프트로 깎아 `.reprompt/<날짜>-<slug>/`에 6파일(BRIEF/PROMPT/RATIONALE/OUTPUT/INSPECTION.md + meta.json)로 산출·실행·점검하는 6단계 루프.
- 실행환경 변환 4타깃: general / coding(Goal 중지요건 + Ultracode 제약) / image(구도·피사체·스타일·조명·카메라) / research(출처·범위·검증).
- Claude Code 플러그인 패키징: `plugin/` 배포 단위 + 자체 마켓플레이스(`repick-prompt`), `${CLAUDE_SKILL_DIR}` 기반 이식성, 번들 DNA.

[1.0.0]: https://github.com/SONGYEONGSIN/repick-prompt/releases/tag/reprompt--v1.0.0
