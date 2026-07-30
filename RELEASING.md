# 릴리즈 절차

`reprompt` 플러그인의 배포 단위는 `plugin/`, 마켓플레이스는 레포 루트 `.claude-plugin/marketplace.json`(`source: "./plugin"`). 설치 시 캐시에는 `plugin/`만 복사된다.

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
6. 설치자 갱신: `claude plugin marketplace update` + `claude plugin update reprompt`.

## 사용자 설치

```bash
claude plugin marketplace add https://github.com/SONGYEONGSIN/repick-prompt
claude plugin install reprompt@repick-prompt
```
다음 세션부터 `/reprompt` 활성화. (로컬 개발: `claude plugin marketplace add ./`)

## dry-run 검증

실제 태그 없이: `claude plugin tag ./plugin --dry-run`
