# 릴리즈 절차

`reprompt` 플러그인의 배포 단위는 `plugin/`, 마켓플레이스는 레포 루트 `.claude-plugin/marketplace.json`(`source: "./plugin"`). 설치 시 캐시에는 `plugin/`만 복사된다.

## 버전 정책

| 자리수 | 언제 | 예 |
|---|---|---|
| **patch** | 라이브러리·DNA **데이터** 변경 (진화 라운드 승격) | 1.2.0 → 1.2.1 |
| **minor** | `SKILL.md`·스크립트의 **계약** 변경 (인자·출력·인터페이스) | 1.2.5 → 1.3.0 |
| **major** | 파괴적 변경 | 1.9.0 → 2.0.0 |

**배포물이 바뀌면 반드시 버전을 올린다.** 안 올리면 기존 설치자에게 전달되지 않는다 — `claude plugin update`는 **버전을 비교해** 갱신 여부를 정하기 때문이다. 2026-08-04 실측:

```
main 33종/DNA v1.22 · 설치 캐시 32종/DNA v1.21 · plugin.json 1.2.0 (미범프)
→ claude plugin update  →  "already at the latest version (1.2.0)"
```

새 템플릿이 main에 있어도 **영영 전달되지 않았다.** "설치자는 마켓플레이스가 main을 클론하니 항상 최신을 받는다"는 것은 **신규 설치에만** 참이다.

마켓플레이스를 특정 태그에 고정하는 방법은 없다 — `claude plugin marketplace add`에 ref 옵션이 없고 `--sparse`는 모노레포 경로용이다. 따라서 **버전 범프가 유일한 전달 수단**이다.

진화 라운드는 매일 승격하므로 patch가 매일 오른다(1년 뒤 `1.2.365` 수준). 자리수를 patch로 둔 이유는 데이터 추가가 인터페이스를 바꾸지 않기 때문이고, 그 덕에 **버전만 보고 "계약이 바뀌었나"를 구분**할 수 있다.

## 새 버전 릴리즈

0. 번들 재생성 — 볼트 DNA·라이브러리를 배포물에 반영:
   ```bash
   node scripts/build-plugin-bundle.mjs && node scripts/wiki-lint.mjs
   ```
   `plugin/skills/reprompt/dna/`·`library/`는 **생성물이다.** 손으로 고치지 않는다. 어긋난 채로 릴리즈하면 설치자에게 낡은 원칙과 빠진 템플릿이 배포된다 — `wiki-lint`가 FAIL로 막는다.
1. 버전 범프 — `plugin/.claude-plugin/plugin.json`의 `version`:
   ```bash
   node -e "import('./scripts/release-version.mjs').then(m=>m.writeVersion('plugin/.claude-plugin/plugin.json', process.argv[1]))" 1.1.0
   ```
2. `CHANGELOG.md` 최상단에 새 버전 섹션(`## [1.1.0] - YYYY-MM-DD`) 추가.
3. 커밋: `git commit -am "chore(release): v1.1.0"`.
4. 검증: `claude plugin validate .` (0 errors).
5. 태그 + push: `claude plugin tag ./plugin --push -m "reprompt %s"` (→ `reprompt--v1.1.0` 생성·origin push) + `git push origin main`.
6. 설치자 갱신: `claude plugin marketplace update` + `claude plugin update reprompt@repick-prompt`.
   **마켓플레이스 이름을 붙여야 한다** — 설치명이 `reprompt@repick-prompt`라 `claude plugin update reprompt`는 `✘ Plugin "reprompt" not found`로 실패한다.

## 사용자 설치

```bash
claude plugin marketplace add https://github.com/SONGYEONGSIN/repick-prompt
claude plugin install reprompt@repick-prompt
```
다음 세션부터 `/reprompt` 활성화. (로컬 개발: `claude plugin marketplace add ./`)

## dry-run 검증

실제 태그 없이: `claude plugin tag ./plugin --dry-run`
