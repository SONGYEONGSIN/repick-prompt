"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus } from "lucide-react";
import type { Group, Item } from "@/data/landing.generated";
import { routeTask, slotsFor } from "@/lib/route-match";


const SAMPLES = [
  "계약서가 우리 보안 요건을 지키는지 대조하고 싶어",
  "장애 원인을 정리해서 팀장님께 보고해야 해",
  "유튜브 교육 영상 대본을 써야 해",
];

interface Props {
  groups: Group[];
  items: Item[];
  roundTotal: number;
  withSample: number;
}

export function Landing({ groups, items, roundTotal, withSample }: Props) {
  const [task, setTask] = useState(SAMPLES[0]);
  const [openId, setOpenId] = useState<string | null>(null);

  const routed = useMemo(() => routeTask(task, items), [task, items]);
  const slots = useMemo(() => slotsFor(task, routed), [task, routed]);

  const groupName = useMemo(() => {
    const byId = new Map(groups.map((g) => [g.id, g.name]));
    return (id: string) => byId.get(id) ?? id;
  }, [groups]);

  const history = useMemo(
    () => items.filter((i) => i.round !== null && i.score !== null).slice(0, 5),
    [items]
  );

  const needCount = slots.filter((s) => s.need).length;

  return (
    <>

      {/* ── 1. 히어로 — 원고지 한 장 위에서 초고가 잡힌다 ───────────── */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <p
            className="font-mono text-[11.5px] uppercase trk-caption"
            style={{ color: "var(--acc)" }}
          >
            원고지 1매 · 프롬프트 초고
          </p>
          <h1 className="mt-5 max-w-[15ch] text-[clamp(38px,6vw,68px)] font-extrabold leading-[1.06] tracking-[-0.035em]">
            시키면, 초고가 잡힌다
          </h1>
          <p
            className="mt-6 max-w-[44ch] text-[17px] leading-relaxed"
            style={{ color: "var(--mut)" }}
          >
            원하는 것을 한 줄로 적으세요. 네 칸으로 갈라 구조를 세우고,
            <strong style={{ color: "var(--fg)" }}> 승인받기 전까지는 초고로 둡니다.</strong>
          </p>

          {/* 원고지 — 입력 한 줄 + 네 칸 */}
          <div className={`mt-10 border border-line bg-panel`}>
            {/* 입력 행 */}
            <div className="flex items-stretch border-b" style={{ borderColor: "var(--line)" }}>
              <span
                className={`grid w-14 shrink-0 place-items-center border-r font-mono text-[11px] text-mut tabular-nums`}
                style={{ borderColor: "var(--line-soft)" }}
                aria-hidden="true"
              >
                00
              </span>
              <div className="min-w-0 flex-1 px-5 py-5">
                <label htmlFor="task" className="sr-only">
                  무엇을 만들고 싶은지 한 줄로 적으세요
                </label>
                <input
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="예: 계약서가 우리 보안 요건을 지키는지 대조하고 싶어"
                  className="w-full bg-transparent text-[clamp(17px,2.1vw,22px)] font-semibold outline-none"
                  style={{ color: "var(--fg)" }}
                />
              </div>
            </div>

            {/* 판정 행 — 스킬의 1층/2층 라우팅을 그대로 표시한다 */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-5 py-3"
              style={{ borderColor: "var(--line-soft)" }}
            >
              <span
                className="border px-2 py-0.5 font-mono text-[11px] tabular-nums"
                style={{
                  borderColor: routed.layer === 1 ? "var(--acc)" : "var(--line)",
                  color: routed.layer === 1 ? "var(--acc)" : "var(--mut)",
                }}
              >
                {routed.layer === 1 ? "1층 · 검증된 뼈대" : "2층 · 새로 깎음"}
              </span>
              <span className="font-mono text-[11.5px]" style={{ color: "var(--mut)" }}>
                {routed.layer === 1 && routed.hit ? (
                  <>
                    {routed.hit.title} · R{routed.hit.round} 승격 ·{" "}
                    <span className="tabular-nums">심사 {routed.hit.score}/120</span>
                  </>
                ) : (
                  <>맞는 승격본이 없어 DNA 4요소로 새로 세웁니다</>
                )}
              </span>
              {needCount > 0 && (
                <span className="ml-auto font-mono text-[11.5px]" style={{ color: "var(--acc)" }}>
                  확인 필요 <span className="tabular-nums">{needCount}</span>곳
                </span>
              )}
            </div>

            {/* 네 칸 */}
            <ol>
              {slots.map((s, i) => (
                <li key={s.name} className="flex items-stretch">
                  <span
                    className={`grid w-14 shrink-0 place-items-center border-r border-b font-mono text-[11px] text-mut tabular-nums`}
                    style={{ borderColor: "var(--line-soft)" }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`min-w-0 flex-1 px-5 py-4 `}>
                    <p
                      className="font-mono text-[10.5px] uppercase trk-caption"
                      style={{ color: "var(--mut)" }}
                    >
                      {s.name}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed">
                      {s.need ? <span className={"needs-check"}>{s.text}</span> : s.text}
                      {i === slots.length - 1 && <span className="inline-block w-0.5 h-[1em] align-[-0.15em] bg-acc" aria-hidden="true" />}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11.5px]" style={{ color: "var(--mut)" }}>
              예시
            </span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTask(s)}
                className="border px-3 py-1 text-[12.5px]"
                style={{
                  borderColor: task === s ? "var(--acc)" : "var(--line)",
                  color: task === s ? "var(--acc)" : "var(--mut)",
                }}
              >
                {s.length > 22 ? `${s.slice(0, 22)}…` : s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. 승인 게이트 ──────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <p
            className="font-mono text-[11.5px] uppercase trk-caption"
            style={{ color: "var(--acc)" }}
          >
            원고지 2매 · 승인 게이트
          </p>
          <h2 className="mt-4 max-w-[20ch] text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.14] tracking-[-0.028em]">
            결과를 던지지 않고, 먼저 보여주고 묻습니다
          </h2>
          <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed" style={{ color: "var(--mut)" }}>
            대부분의 도구는 결과만 줍니다. 초고는 실행 전에 <strong style={{ color: "var(--fg)" }}>무엇을 왜 그렇게
            세웠는지</strong>와 <strong style={{ color: "var(--fg)" }}>스스로 세운 가정</strong>을 내놓고 승인을 받습니다.
            여기서 고치면 다시 세웁니다.
          </p>

          <div className="mt-9 grid gap-px" style={{ background: "var(--line)" }}>
            {[
              { k: "무엇을 썼나", v: "1층이면 어떤 승격본을 뼈대로 썼는지, 2층이면 어떤 DNA 장치를 배치했는지" },
              { k: "무엇을 지어냈나", v: "가진 자료가 아닌 것은 채우지 않고 [확인 필요]로 남깁니다" },
              { k: "무엇을 가정했나", v: "묻지 않고 넘어간 부분을 문장으로 적어 되돌릴 수 있게 합니다" },
            ].map((r, i) => (
              <div key={r.k} className="grid gap-3 p-5 sm:grid-cols-[180px_1fr]" style={{ background: "var(--panel)" }}>
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--acc)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] font-semibold">{r.k}</span>
                </p>
                <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--mut)" }}>
                  {r.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 근거 — 이미 지어진 것들 ───────────────────────────── */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="font-mono text-[11.5px] uppercase trk-caption"
                style={{ color: "var(--acc)" }}
              >
                원고지 3매 · 검증된 뼈대
              </p>
              <h2 className="mt-4 max-w-[22ch] text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.14] tracking-[-0.028em]">
                {items.length}종은 이미 심사를 통과했습니다
              </h2>
            </div>
            <Link
              href="/commissioned/home-v2"
              className="inline-flex items-center gap-1.5 border px-4 py-2 text-[13px]"
              style={{ borderColor: "var(--line)" }}
            >
              전체 보기
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--line)" }}>
            {items.slice(0, 6).map((it, i) => (
              <li key={it.slug} className="min-w-0 p-5" style={{ background: "var(--panel)" }}>
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums" style={{ color: "var(--acc)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase trk-caption" style={{ color: "var(--mut)" }}>
                    {groupName(it.group)}
                  </span>
                </p>
                <h3 className="mt-2 text-[16px] font-semibold leading-snug">
                  <Link href={`/p/${it.slug}`}>{it.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: "var(--mut)" }}>
                  {it.desc}
                </p>
                <p className="mt-3 font-mono text-[10.5px] tabular-nums" style={{ color: "var(--mut)" }}>
                  빈칸 {it.fields}
                  {it.round !== null && ` · R${it.round}`}
                  {it.score !== null && ` · 심사 ${it.score}/120`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. 심사 기록 ────────────────────────────────────────── */}
      <section id="evidence" className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <p className="font-mono text-[11.5px] uppercase trk-caption" style={{ color: "var(--acc)" }}>
            원고지 4매 · 심사 기록
          </p>
          <h2 className="mt-4 max-w-[24ch] text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.14] tracking-[-0.028em]">
            사용 후기 대신, 채점표를 공개합니다
          </h2>
          <p className="mt-5 max-w-[56ch] text-[15.5px] leading-relaxed" style={{ color: "var(--mut)" }}>
            후보 셋을 지어 AI 심사자 셋이 순서를 바꿔 세 번 블라인드로 채점하고, 이긴 것만 뼈대가 됩니다.
            진 후보의 결과물도 남아 있습니다.
          </p>

          <ul className="mt-8 grid gap-px" style={{ background: "var(--line)" }}>
            {history.map((it) => {
              const open = openId === it.slug;
              return (
                <li key={it.slug} style={{ background: "var(--panel)" }}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : it.slug)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-mono text-[12px] tabular-nums" style={{ color: "var(--acc)" }}>
                      R{it.round}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{it.title}</span>
                      <span className="mt-0.5 block font-mono text-[11px] tabular-nums" style={{ color: "var(--mut)" }}>
                        심사 {it.score}/120
                      </span>
                    </span>
                    <span className="grid size-7 shrink-0 place-items-center border" style={{ borderColor: "var(--line)" }}>
                      {open ? <Minus className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t px-5 py-4" style={{ borderColor: "var(--line-soft)" }}>
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed">
                        {(it.sample ?? it.desc)
                          .split("\n")
                          .map((l) => l.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, ""))
                          .filter((l) => l.trim() && !/^[-|:\s]+$/.test(l))
                          .slice(0, 12)
                          .join("\n")}
                      </pre>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 font-mono text-[12px]" style={{ color: "var(--mut)" }}>
            <span className="tabular-nums">{withSample}</span>
            <span className="trk-stat">종은 실제 산출물이 그대로 남아 있습니다 · </span>
            <span className="tabular-nums">{roundTotal}</span>
            <span className="trk-stat">라운드째 진화 중</span>
          </p>
        </div>
      </section>

      {/* ── 5. 마무리 ───────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <h2 className="max-w-[16ch] text-[clamp(28px,4.4vw,52px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
            첫 칸부터 채워보세요
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#task"
              className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-semibold"
              style={{ background: "var(--acc)", color: "var(--panel)" }}
            >
              원고지 열기
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <span className="font-mono text-[12px]" style={{ color: "var(--mut)" }}>
              <span className="tabular-nums">0</span>
              <span className="trk-stat">원 · 로그인 없음</span>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
