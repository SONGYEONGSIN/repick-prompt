# RE:PROMPT 진화 — `reprompt` 플러그인 패키징 설계 (스코프 C)

> 작성일: 2026-07-21 · 상태: 승인됨(설계) → 구현 계획 대기
> 브랜치: `feat/reprompt-plugin-packaging`
> 선행: 스코프 A(reprompt 스킬) 완료·main 머지. 참조: `2026-07-21-reprompt-meta-prompting-design.md`

## 배경 / 목표

스코프 A에서 만든 `reprompt` 메타프롬프팅 스킬을, 이 레포(repick-prompt)를 **Claude Code 플러그인**으로 패키징해 다른 레포/사용자가 설치할 수 있게 한다. 마켓플레이스도 같은 레포에 두어 단일 소스로 배포한다. 릴리즈(버전 태그) 자동화는 스코프 D.

## 결정 (브레인스토밍)

- 플러그인은 **`reprompt` 스킬만** 배포한다. `prompt-evolve`는 `vault/`·`scripts/`·`app/`에 결합돼 다른 레포에선 깨지므로 제외(레포 내부용으로 `.claude/skills/prompt-evolve/`에 그대로 둔다).
- `reprompt` 스킬을 **플러그인 표준 위치 `skills/reprompt/`**로 옮긴다(현재 `.claude/skills/reprompt/`).
- 마켓플레이스는 **같은 레포**(`.claude-plugin/marketplace.json`).

## 환경 사실 (실측)

- `claude` CLI v2.1.216 존재. `claude plugin validate <path>` = 매니페스트/마켓플레이스 검증. `claude plugin install`, `claude plugin marketplace` 존재.
- 릴리즈(스코프 D)용 `claude plugin tag [path]`가 있고 태그 형식은 **`{name}--v{version}`**(예: `reprompt--v1.0.0`) — plugin.json과 마켓플레이스 엔트리 정합을 검증. (D에서 사용)
- 플러그인 매니페스트 `.claude-plugin/plugin.json`: 필수 `name`, 나머지 optional, **추가 필드 거부**. 레포 루트를 플러그인 루트로 사용 가능.
- 스킬은 플러그인 루트의 **`skills/<name>/`**에서 발견(폴더명=스킬명).
- 번들 스크립트는 **`${CLAUDE_SKILL_DIR}`**로 참조해야 설치 후에도 해석됨. `../` 외부 참조 금지.

## 구조 변경

```
repo-root/                        ← 플러그인 루트 = 레포 루트
├── .claude-plugin/
│   ├── plugin.json               # NEW 매니페스트
│   └── marketplace.json          # NEW 자체 마켓플레이스
├── skills/
│   └── reprompt/                 # git mv .claude/skills/reprompt/ → skills/reprompt/ (이력 보존)
│       ├── SKILL.md              # ${CLAUDE_SKILL_DIR} 경로로 수정
│       ├── scripts/reprompt-init.mjs (+ .test.mjs)
│       └── dna/prompt-principles.md
├── .claude/skills/prompt-evolve/ # 그대로 (미배포)
└── vault/ app/ scripts/ docs/    # 불변
```

## 파일 사양

### `.claude-plugin/plugin.json`
```json
{
  "name": "reprompt",
  "version": "1.0.0",
  "description": "메타프롬프팅 스킬 — 대화 맥락을 프롬프트 DNA로 맞춤 프롬프트로 깎아 파일로 산출·실행·점검",
  "author": { "name": "SONGYEONGSIN", "url": "https://github.com/SONGYEONGSIN" },
  "repository": "https://github.com/SONGYEONGSIN/repick-prompt",
  "keywords": ["prompt", "meta-prompting", "prompt-engineering"]
}
```
- `skills/reprompt/`는 자동 발견되므로 명시적 `skills` 배열은 넣지 않는다 — **단, 구현 시 `claude plugin validate .`로 자동 발견 여부를 확인**하고, 필요하면 스키마가 허용하는 형식으로 declaration 추가.

### `.claude-plugin/marketplace.json`
```json
{
  "name": "repick-prompt",
  "owner": { "maintainer": "SONGYEONGSIN" },
  "plugins": [
    { "name": "reprompt", "source": "./", "category": "productivity", "description": "메타프롬프팅 6단계 루프" }
  ]
}
```
- `source: "./"` = 플러그인 루트가 이 레포 루트.

### `skills/reprompt/SKILL.md` 수정 (이식성)
- Phase 3의 `node -e "import(require('url').pathToFileURL(process.argv[1]).href)…" "<이 스킬 폴더>/scripts/reprompt-init.mjs" …` 에서 `<이 스킬 폴더>` → **`${CLAUDE_SKILL_DIR}`**.
- Phase 0 DNA 로드: "레포에 `vault/00-principles/prompt-principles.md`가 있으면 우선(개발 시), 없으면 **`${CLAUDE_SKILL_DIR}/dna/prompt-principles.md`**"(설치 시).
- Windows `file://` URL 변환(`pathToFileURL`, 스코프 A 수정)은 유지.
- 이 변경은 스코프 A 최종 리뷰의 "스킬폴더 경로 해석 암시적" minor도 해소.

## 검증

- `claude plugin validate .` 통과(스키마·경로·중복·순환 없음).
- 헬퍼 유닛 테스트 이동 후 통과: `node --test skills/reprompt/scripts/reprompt-init.test.mjs` (12/12).
- `${CLAUDE_SKILL_DIR}` 해석 실측: 스킬 런타임에서 실제로 스킬 폴더로 확장되는지 확인. **없으면 폴백** — Claude Code가 스킬 로드 시 주입하는 "Base directory for this skill" 경로를 에이전트가 치환.
- reprompt E2E 스모크 1회(새 위치): `.reprompt/`에 6파일 생성 확인.
- git mv가 이력을 보존했는지(`git log --follow`) 확인.

## 이 레포에서의 dev 사용

`reprompt`를 `skills/`로 옮기면 이 레포에서 project-skill로는 자동 로드되지 않는다(project skill은 `.claude/skills/`). 개발 중 사용은 자체 마켓플레이스로 설치:
`claude plugin marketplace add .` → `claude plugin install reprompt`. (구현 단계에서 절차·동작 확인)

## 유닛 경계

- `.claude-plugin/plugin.json` — 배포 정체성(이름·버전·메타).
- `.claude-plugin/marketplace.json` — 배포 소스(어디서 설치).
- `skills/reprompt/` — 실제 기능(이동 + 이식성 수정).
- 세 유닛은 독립적으로 검증 가능(`plugin validate` / 유닛 테스트 / E2E).

## 스코프 C 제외 → 스코프 D

- `claude plugin tag`로 `reprompt--v1.0.0` 태그 발행 / CHANGELOG / 버전 범프 워크플로우.
- 버전 업 시 마켓플레이스 `source` ref 갱신 전략.

## 미해결/후속

- 웹앱 메타프롬프팅 UI(스코프 A 웹 표면)는 여전히 별도 후속.
- `${CLAUDE_SKILL_DIR}` 또는 명시적 `skills` declaration 필요 여부는 구현 첫 태스크에서 `claude plugin validate`로 확정.
