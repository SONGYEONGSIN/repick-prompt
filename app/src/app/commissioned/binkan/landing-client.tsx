"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sun, Moon, Monitor, Plus, Minus } from "lucide-react";
import type { Group, Item } from "../home-v2/data";
import { BinkanLogo, BinkanMark } from "./logo";
import styles from "./binkan.module.css";

type Theme = "system" | "light" | "dark";
const NEXT_THEME: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const THEME_LABEL: Record<Theme, string> = { system: "시스템 설정", light: "라이트", dark: "다크" };

/** 4요소 데모 — 제품이 이미 쓰고 있는 예시 문구를 그대로 쓴다(지어내지 않는다) */
const PARTS = [
  {
    id: "role",
    name: "역할",
    line: "AI에게 직업을 준다",
    text: "당신은 한국어 유튜브 교육형 채널의 작가입니다.",
    why: "역할이 정해지면 그 직업의 어휘와 기준으로 답합니다.",
  },
  {
    id: "context",
    name: "맥락",
    line: "상황과 변수를 채운다",
    text: "대상 시청자: 초보자 / 목표: 교육 / 길이: 7분",
    why: "같은 요청도 대상과 목표가 다르면 정답이 달라집니다.",
  },
  {
    id: "req",
    name: "요구사항",
    line: "품질 기준을 명시한다",
    text: "첫 15초 훅을 강하게. 과장된 표현은 피할 것.",
    why: "‘잘 써줘’는 기준이 아닙니다. 검증 가능한 기준을 줍니다.",
  },
  {
    id: "format",
    name: "출력 형식",
    line: "받을 모양을 정한다",
    text: "출력: 제목 후보 3개 + 장면별 스크립트",
    why: "형식을 정하면 받아서 바로 쓸 수 있습니다.",
  },
] as const;

interface Props {
  groups: Group[];
  items: Item[];
  roundTotal: number;
  withSample: number;
}

export function Landing({ groups, items, roundTotal, withSample }: Props) {
  const [theme, setTheme] = useState<Theme>("system");
  const [on, setOn] = useState<string[]>(["role"]);
  const [tab, setTab] = useState<string>(groups[0]?.id ?? "");
  const [openRound, setOpenRound] = useState<string | null>(null);

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const groupName = useMemo(() => {
    const byId = new Map(groups.map((g) => [g.id, g.name]));
    return (id: string) => byId.get(id) ?? id;
  }, [groups]);

  const assembled = PARTS.filter((p) => on.includes(p.id));
  const filled = assembled.length;

  const preview = useMemo(
    () => items.filter((i) => i.group === tab).slice(0, 3),
    [items, tab]
  );

  /** 최근 승격 기록 — 지어낸 후기 대신 실측 심사 기록을 소셜프루프 자리에 둔다 */
  const history = useMemo(
    () => items.filter((i) => i.round !== null && i.score !== null).slice(0, 5),
    [items]
  );

  function toggle(id: string) {
    setOn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className={styles.root} data-theme={theme === "system" ? undefined : theme}>
      <div className="relative">
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${styles.gridBg}`} />

        <div className="relative">
          {/* ── 헤더 ─────────────────────────────────────────────── */}
          <header className="border-b border-line">
            <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
              <BinkanLogo />
              <nav className="flex items-center gap-5">
                <Link href="/commissioned/home-v2" className="text-[13px] text-mut hover:text-fg">
                  템플릿
                </Link>
                <Link
                  href="/commissioned/home-v2/split"
                  className="hidden text-[13px] text-mut hover:text-fg sm:block"
                >
                  탐색
                </Link>
                <button
                  type="button"
                  onClick={() => setTheme(NEXT_THEME[theme])}
                  className="grid size-9 place-items-center rounded-full border border-line text-mut hover:text-fg"
                  aria-label={`화면 테마: ${THEME_LABEL[theme]}. 눌러서 ${THEME_LABEL[NEXT_THEME[theme]]}(으)로 전환`}
                >
                  <ThemeIcon className="size-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </header>

          {/* ── 1. 히어로 ────────────────────────────────────────── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-24 text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 font-mono text-[11.5px] uppercase text-mut trk-caption">
                <BinkanMark className="size-3.5" />
                AI 초보자를 위한 프롬프트 빌더
              </p>

              <h1 className="mx-auto mt-7 max-w-[19ch] text-[clamp(38px,6.4vw,72px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                빈칸만 채우면
                <br />
                프롬프트가 <span className="text-acc">완성</span>된다
              </h1>

              <p className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-relaxed text-mut">
                좋은 프롬프트는 재능이 아니라 구조입니다. 검증을 통과한 템플릿 {items.length}종에
                빈칸만 채우세요.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/commissioned/home-v2"
                  className="inline-flex items-center gap-2 rounded-full bg-acc px-6 py-3 text-[15px] font-semibold text-white"
                >
                  템플릿 {items.length}종 둘러보기
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="#how"
                  className="rounded-full border border-line px-6 py-3 text-[15px] text-fg hover:border-acc"
                >
                  어떻게 만드나요
                </a>
              </div>

              <p className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-line bg-panel px-4 py-1.5 font-mono text-[11.5px] text-mut">
                <span className="tabular-nums text-fg">{roundTotal}</span>
                <span className="trk-stat">라운드 진화</span>
                <span aria-hidden="true">·</span>
                <span className="text-fg">AI 3심</span>
                <span className="trk-stat">블라인드 심사</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-fg">0</span>
                <span className="trk-stat">원 · 로그인 없음</span>
              </p>
            </div>
          </section>

          {/* ── 2. 제품 프리뷰 ───────────────────────────────────── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 py-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11.5px] uppercase text-acc trk-caption">Fig 1. 라이브러리</p>
                  <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-tight tracking-[-0.025em]">
                    무엇이 나오는지 먼저 보고 고릅니다
                  </h2>
                </div>
                <Link
                  href="/commissioned/home-v2"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] text-fg hover:border-acc"
                >
                  전체 보기
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {groups.map((g) => {
                  const active = tab === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTab(g.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors motion-reduce:transition-none ${
                        active ? "border-acc bg-acc text-white" : "border-line text-mut hover:text-fg"
                      }`}
                    >
                      {g.name} <span className="tabular-nums opacity-70">{g.count}</span>
                    </button>
                  );
                })}
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map((it) => (
                  <li
                    key={it.slug}
                    className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-bg">
                      <pre className="whitespace-pre-wrap break-words px-4 pt-4 font-mono text-[10.5px] leading-[1.7] text-mut">
                        {(it.sample ?? it.outputs.map((o) => `· ${o}`).join("\n") ?? it.desc)
                          .split("\n")
                          .map((l) => l.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, ""))
                          .filter((l) => l.trim() && !/^[-|:\s]+$/.test(l))
                          .slice(0, 7)
                          .join("\n")}
                      </pre>
                      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-16 ${styles.fadeBottom}`} />
                    </div>
                    <div className="flex flex-1 flex-col border-t border-line p-4">
                      <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase text-mut trk-caption">
                        <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-acc" />
                        {groupName(it.group)}
                      </p>
                      <h3 className="mt-2 text-[16px] font-semibold leading-snug">
                        <Link href={`/p/${it.slug}`} className="hover:text-acc">
                          {it.title}
                        </Link>
                      </h3>
                      {/* 근거 태그 — 사진 위 오버레이가 아니라 분리된 행에 둔다 */}
                      <p className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-mut">
                          빈칸 {it.fields}
                        </span>
                        {it.round !== null && (
                          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-mut">
                            R{it.round} 승격
                          </span>
                        )}
                        {it.score !== null && (
                          <span className="rounded border border-acc px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-acc">
                            심사 {it.score}/120
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── 3. 가치 — 조작이 증명을 실시간으로 갱신한다 ────────── */}
          <section id="how" className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 py-24">
              <p className="font-mono text-[11.5px] uppercase text-acc trk-caption">Fig 2. 좋은 프롬프트의 4요소</p>
              <h2 className="mt-3 max-w-[22ch] text-[clamp(26px,3.4vw,38px)] font-extrabold leading-tight tracking-[-0.025em]">
                눌러보세요. 빈칸이 채워질수록 프롬프트가 자랍니다
              </h2>

              <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <ul className="grid gap-3">
                  {PARTS.map((p, i) => {
                    const active = on.includes(p.id);
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-pressed={active}
                          className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors motion-reduce:transition-none ${
                            active ? "border-acc bg-panel" : "border-line bg-panel hover:border-acc"
                          }`}
                        >
                          <span
                            className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${
                              active ? "border-acc bg-acc text-white" : "border-line text-mut"
                            }`}
                          >
                            {active ? (
                              <Check className="size-3.5" aria-hidden="true" />
                            ) : (
                              <Plus className="size-3.5" aria-hidden="true" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-baseline gap-2">
                              <span className="font-mono text-[11px] tabular-nums text-mut">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[16px] font-semibold">{p.name}</span>
                              <span className="text-[13px] text-mut">{p.line}</span>
                            </span>
                            <span className="mt-1.5 block text-[13.5px] leading-relaxed text-mut">
                              {p.why}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
                  <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                    <p className="font-mono text-[11px] uppercase text-mut trk-caption">완성되는 프롬프트</p>
                    <p className="font-mono text-[11px] text-mut">
                      <span className="tabular-nums text-fg">{filled}</span>
                      <span className="tabular-nums"> / {PARTS.length} 요소</span>
                    </p>
                  </div>

                  {/* 완성도 게이지 — 색만으로 뜻을 전하지 않도록 숫자를 함께 둔다 */}
                  <div className="h-1 w-full bg-bg">
                    <div
                      className={`h-full bg-acc ${styles.meterFill}`}
                      style={{ width: `${(filled / PARTS.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex-1 bg-bg p-5">
                    {assembled.length === 0 ? (
                      <p className="font-mono text-[13px] text-mut">
                        왼쪽에서 요소를 켜면 여기에 프롬프트가 쌓입니다.
                      </p>
                    ) : (
                      <ol className="space-y-3">
                        {assembled.map((p) => (
                          <li key={p.id} className={styles.lineIn}>
                            <p className="font-mono text-[10.5px] uppercase text-acc trk-caption">
                              {p.name}
                            </p>
                            <p className="mt-1 font-mono text-[13px] leading-relaxed text-fg">
                              {p.text}
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <p className="border-t border-line px-5 py-3 text-[12.5px] text-mut">
                    {filled < PARTS.length
                      ? `${PARTS.length - filled}개 요소가 비어 있습니다. 빠진 만큼 결과가 흔들립니다.`
                      : "네 요소가 모두 찼습니다. 템플릿은 이 상태를 기본값으로 시작합니다."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. 소셜프루프 대체 — 실측 심사 기록 ───────────────── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 py-24">
              <p className="font-mono text-[11.5px] uppercase text-acc trk-caption">Fig 3. 검증 기록</p>
              <h2 className="mt-3 max-w-[24ch] text-[clamp(26px,3.4vw,38px)] font-extrabold leading-tight tracking-[-0.025em]">
                사용 후기 대신, 심사 기록을 공개합니다
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-mut">
                모든 템플릿은 후보 3개를 만들어 AI 심사자 3명이 순서를 바꿔 세 번 블라인드로 채점한 뒤
                이긴 것만 올립니다. 진 후보의 결과물까지 남아 있습니다.
              </p>

              <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
                {history.map((it) => {
                  const open = openRound === it.slug;
                  return (
                    <li key={it.slug}>
                      <button
                        type="button"
                        onClick={() => setOpenRound(open ? null : it.slug)}
                        aria-expanded={open}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-bg"
                      >
                        <span className="font-mono text-[12px] tabular-nums text-acc">R{it.round}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold">{it.title}</span>
                          <span className="mt-0.5 block font-mono text-[11px] text-mut">
                            {groupName(it.group)} · <span className="tabular-nums">심사 {it.score}/120</span>
                          </span>
                        </span>
                        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-mut">
                          {open ? (
                            <Minus className="size-3.5" aria-hidden="true" />
                          ) : (
                            <Plus className="size-3.5" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                      {open && (
                        <div className="border-t border-line bg-bg px-5 py-4">
                          <p className="font-mono text-[10.5px] uppercase text-mut trk-caption">
                            이 라운드 1위 산출물 · 발췌
                          </p>
                          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-fg">
                            {(it.sample ?? it.desc)
                              .split("\n")
                              .map((l) => l.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, ""))
                              .filter((l) => l.trim() && !/^[-|:\s]+$/.test(l))
                              .slice(0, 14)
                              .join("\n")}
                          </pre>
                          <Link
                            href={`/p/${it.slug}`}
                            className="mt-3 inline-flex items-center gap-1 text-[13px] text-acc hover:underline"
                          >
                            이 템플릿 쓰기
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 font-mono text-[12px] text-mut">
                <span className="tabular-nums">{withSample}</span>
                <span className="trk-stat">종은 실제 산출물을 그대로 확인할 수 있습니다</span>
              </p>
            </div>
          </section>

          {/* ── 5. 마무리 CTA ───────────────────────────────────── */}
          <section>
            <div className="mx-auto max-w-[1120px] px-6 py-24 text-center">
              <h2 className="mx-auto max-w-[18ch] text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                오늘 쓸 프롬프트, 빈칸부터 채우세요
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/commissioned/home-v2"
                  className="inline-flex items-center gap-2 rounded-full bg-acc px-6 py-3 text-[15px] font-semibold text-white"
                >
                  템플릿 둘러보기
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <span className="font-mono text-[12px] text-mut">
                  <span className="tabular-nums">0</span>
                  <span className="trk-stat">원 · 로그인 없음</span>
                </span>
              </div>
            </div>
          </section>

          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-6 py-8">
              <BinkanLogo />
              <p className="font-mono text-[11.5px] text-mut">
                <span className="tabular-nums">{roundTotal}</span>
                <span className="trk-stat">라운드째 스스로 개선 중</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
