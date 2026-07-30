#!/usr/bin/env bash
# 진화 루틴 워치독 — 자율 루틴이 "조용히" 멈춘 것을 감지한다.
#
# 문제: 클라우드 루틴(trig_01C7e66nxxHq8ELBMj5syCty, 매일 03:00 KST)은 실패해도 알림이 없다.
#       유일한 신호가 "PR의 부재"라서 사람이 매일 기억해서 확인해야만 감지된다.
# 해법: 이상이면 exit 1 — GitHub이 스케줄 워크플로 실패를 이메일로 알린다. 부재를 존재로 바꾼다.
#
# 정상 no-op(머지 대기 / 백로그 소진)과 실패를 구분하는 것이 이 스크립트의 핵심이다.
# 구분하지 못하면 늑대소년이 되어 결국 무시당한다.

set -euo pipefail

# 경로·임계값은 env 로 덮어쓸 수 있다 — 각 분기를 실제로 실패시켜 봐야 워치독을 믿을 수 있다.
LEDGER="${LEDGER:-vault/30-ledger/prompt-ledger.jsonl}"
BACKLOG="${BACKLOG:-vault/backlog.md}"
PR_STALE_DAYS="${PR_STALE_DAYS:-3}"     # 열린 evolve PR이 이만큼 방치되면 알림 (사람이 머지를 잊음)
LEDGER_STALE_DAYS="${LEDGER_STALE_DAYS:-2}" # PR도 없는데 ledger가 이만큼 안 늘면 실패 의심

status=0
say() { printf '%s\n' "$*"; }
alert() { printf '::error::%s\n' "$*"; status=1; }

# --- 1. 열린 evolve/* PR ---------------------------------------------------
# 주의: `gh pr list --head 'evolve/'` 는 접두사 매칭이 아니라 정확 일치라 항상 0을 반환한다.
#       (evolve/* PR 8개가 실재하는 상태에서 0을 돌려주는 것을 실측 확인, 2026-07-31)
#       접두사로 거르려면 반드시 jq startswith 를 쓴다.
open_prs=$(gh pr list --state open --json number,headRefName,createdAt \
  --jq '[.[] | select(.headRefName | startswith("evolve/"))
         | {number, branch: .headRefName, ageDays: ((now - (.createdAt | fromdateiso8601)) / 86400 | floor)}]')
open_count=$(jq 'length' <<<"$open_prs")

if [ "$open_count" -gt 0 ]; then
  oldest=$(jq 'max_by(.ageDays) | .ageDays' <<<"$open_prs")
  jq -r '.[] | "  #\(.number) \(.branch) — \(.ageDays)일 경과"' <<<"$open_prs"
  if [ "$oldest" -gt "$PR_STALE_DAYS" ]; then
    alert "열린 evolve PR이 ${oldest}일째 머지되지 않았다. 루틴은 선행 가드로 계속 no-op 하므로 진화가 멈춘 상태다 — 머지하거나 닫아라."
  else
    say "OK — 열린 evolve PR ${open_count}건(최장 ${oldest}일). 루틴은 정상적으로 no-op 한다. 사람 차례."
  fi
  exit "$status"
fi

# --- 2. 백로그 대기열 ------------------------------------------------------
# '## 대기열' 섹션만 센다 — '## 방향 가설' 에도 `- [ ]` 항목이 있어 전체 grep 은 틀린다.
pending=$(awk '/^## 대기열/{f=1;next} /^## /{f=0} f && /^- \[ \] /{c++} END{print c+0}' "$BACKLOG")

if [ "$pending" -eq 0 ]; then
  alert "백로그 대기열이 비었다. 루틴은 '백로그 소진'으로 no-op 하므로 새 타깃을 ${BACKLOG} 맨 아래에 추가해야 진화가 재개된다."
  exit "$status"
fi

# --- 3. ledger 진척 --------------------------------------------------------
# 열린 PR도 없고 백로그도 남았는데 ledger가 안 늘었다 = 루틴이 돌지 않았거나 중간에 죽었다.
last_epoch=$(git log -1 --format=%ct -- "$LEDGER")
if [ -z "$last_epoch" ]; then
  alert "${LEDGER} 의 커밋 이력을 못 읽었다 (checkout 이 얕은지 확인 — fetch-depth: 0 필요)."
  exit "$status"
fi
ledger_age=$(jq -n --argjson t "$last_epoch" '((now - $t) / 86400) | floor')
entries=$(wc -l < "$LEDGER" | tr -d ' ')

say "ledger ${entries}건, 마지막 진척 ${ledger_age}일 전 / 백로그 대기 ${pending}건 / 열린 evolve PR 없음"

if [ "$ledger_age" -gt "$LEDGER_STALE_DAYS" ]; then
  alert "루틴 실패 의심 — 열린 PR도 없고 백로그도 ${pending}건 남았는데 ${ledger_age}일째 진척이 없다. 루틴 상태를 확인하라: https://claude.ai/code/routines/trig_01C7e66nxxHq8ELBMj5syCty"
else
  say "OK — 진화 루프 정상."
fi

exit "$status"
