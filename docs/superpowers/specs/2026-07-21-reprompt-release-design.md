# RE:PROMPT 진화 — 릴리즈 워크플로우 + 플러그인 루트 좁히기 설계 (스코프 D)

> 작성일: 2026-07-21 · 상태: 승인됨(설계) → 구현 계획 대기
> 브랜치: `feat/reprompt-release`
> 선행: 스코프 A(스킬)·C(플러그인 패키징) 완료·main 머지.

## 배경 / 목표

스코프 C에서 `reprompt`를 설치 가능한 플러그인으로 만들었다. 스코프 D는 (1) 반복 가능한 **릴리즈 워크플로우**를 세우고, (2) 스코프 C가 남긴 **캐시 bloat**(`source:"./"`가 레포 전체를 설치자 캐시로 복사)를 첫 릴리즈 전에 고친다. 실제 GitHub push·공개는 사용자가 나중에 직접 한다(이 스코프는 로컬 준비까지).

## 결정 (브레인스토밍)

- **플러그인 루트 좁히기**: 첫 릴리즈 전에 수정.
- **릴리즈 자동화**: 문서화된 런북 + 얇은 헬퍼(CI 아님).
- **공개**: 로컬 준비만(dry-run 검증), push·공개는 사용자 몫.

## 실측 검증 (프로토타입, 2026-07-21)

throwaway 구조로 확인: 마켓플레이스 루트를 `plugin/` 서브디렉토리로 두고 `claude plugin marketplace add <path>/plugin` → `install` 시, **설치 캐시에는 `plugin/` 서브트리만 복사되고 형제 디렉토리(`bloat/`)는 복사되지 않음**. 즉 마켓플레이스 루트 = 복사 단위. 좁히기가 bloat를 확실히 해결한다.

## Part 1 — 플러그인 루트 좁히기

플러그인 본체를 전용 `plugin/` 서브트리로 이동. 마켓플레이스 루트 = `plugin/` → 설치 시 이것만 복사됨.

목표 레이아웃:
```
repo-root/
├── plugin/                         ← 플러그인/마켓플레이스 루트 (설치 단위)
│   ├── .claude-plugin/
│   │   ├── plugin.json             (repo-root/.claude-plugin/에서 이동)
│   │   └── marketplace.json        (이동; plugins[0].source: "./")
│   └── skills/reprompt/            (repo-root/skills/에서 git mv)
│       ├── SKILL.md
│       ├── scripts/reprompt-init.mjs (+ .test.mjs)
│       └── dna/prompt-principles.md
├── CHANGELOG.md                    NEW (Part 2)
├── RELEASING.md                    NEW (Part 2)
├── scripts/release-version.mjs     NEW (Part 2, +테스트)
├── vault/ app/ docs/ .claude/      ← 미배포 (형제, 설치 제외)
```

- repo-root의 기존 `.claude-plugin/`는 통째로 `plugin/.claude-plugin/`로 이동(빈 디렉토리 잔존 금지).
- `skills/reprompt/`는 `plugin/skills/reprompt/`로 `git mv`(이력 보존).
- `$CLAUDE_SKILL_DIR` 경로 해석·헬퍼 테스트는 위치만 바뀌고 그대로 동작(상대 import).
- **설치·개발 명령이 바뀐다**: `claude plugin marketplace add ./plugin` → `claude plugin install reprompt@repick-prompt`.
- 검증: `claude plugin validate ./plugin` 통과 + 도그푸드 설치 시 캐시에 vault/app/docs **없음** 확인 + 정리(uninstall/remove).

## Part 2 — 릴리즈 인프라

### `CHANGELOG.md` (repo root, Keep a Changelog)
- `## [1.0.0] - 2026-07-21` 시드: reprompt 메타프롬프팅 스킬(스코프 A) + 플러그인 패키징(C) + 플러그인 루트 좁히기(D).

### `RELEASING.md` (repo root) — 런북
1. `plugin/.claude-plugin/plugin.json` version 범프(`scripts/release-version.mjs <newver>` 또는 수동).
2. `CHANGELOG.md`에 새 버전 섹션 추가.
3. 커밋(`chore(release): vX.Y.Z`).
4. `claude plugin validate ./plugin` 통과 확인.
5. `claude plugin tag ./plugin --push -m "reprompt %s"` → `reprompt--v<X.Y.Z>` 태그 생성·origin push.
6. 설치자: `claude plugin marketplace update` + `claude plugin update reprompt`.

### `scripts/release-version.mjs` (+ `release-version.test.mjs`) — 얇은 헬퍼
- `readVersion(pluginJsonPath): string` — plugin.json의 version 읽기.
- `bumpVersion(pluginJsonObj, newVersion): newObj` — semver 형식 검증 후 version만 교체한 **새 객체** 반환(불변). 잘못된 semver면 throw.
- `writeVersion(pluginJsonPath, newVersion): void` — 읽기→bump→쓰기(2-space + 개행 보존).
- 기존 `reprompt-init.mjs`와 동일한 tested-helper 패턴(ESM, node:test, 순수·불변·경계검증).

## Part 3 — v1.0.0 준비 (push 안 함)

- `plugin/.claude-plugin/plugin.json` version = `1.0.0` 확인.
- `claude plugin validate ./plugin` 통과.
- **`claude plugin tag ./plugin --dry-run`** → `reprompt--v1.0.0`을 만들 것임을 확인(실제 태그·push 없음).
- RELEASING.md에 사용자가 나중에 실행할 정확한 공개 명령 명시:
  `claude plugin tag ./plugin --push -m "reprompt %s"` (+ 필요 시 `git push origin main`).

## 검증

- 헬퍼 유닛 테스트 통과: `node --test scripts/release-version.test.mjs` + `node --test plugin/skills/reprompt/scripts/reprompt-init.test.mjs`(이동 후).
- `claude plugin validate ./plugin` 통과.
- 도그푸드 설치 캐시에 vault/app/docs 부재 확인(좁히기 실증) + 전역 상태 원복.
- `claude plugin tag ./plugin --dry-run`이 `reprompt--v1.0.0`을 보고.
- git mv 이력 보존(`git log --follow`).

## 유닛 경계

- `plugin/` — 배포 단위(매니페스트 + 마켓플레이스 + 스킬). 좁히기의 결과.
- `scripts/release-version.mjs` — 버전 조작(순수·테스트).
- `RELEASING.md` / `CHANGELOG.md` — 릴리즈 절차·이력(문서, 미배포).

## 제외 / 후속

- 실제 push·GitHub 공개(사용자), CI 자동화, 웹앱 메타프롬프팅 UI.
- 향후: 사용 피드백 → reprompt DNA 역류 학습(스코프 A 후속).

## 문서 갱신 필요 (구현 시)

- 스코프 C 문서/메모리의 설치 명령 `marketplace add ./` → `marketplace add ./plugin`으로 정정.
