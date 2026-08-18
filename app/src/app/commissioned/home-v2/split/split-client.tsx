"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  LayoutGrid,
} from "lucide-react";
import type { Group, Item } from "../data";
import styles from "../home-v2.module.css";

const PAGE = 20;

const SORTS = [
  { id: "recent", label: "최근 승격순" },
  { id: "title", label: "이름순" },
  { id: "fields", label: "빈칸 적은 순" },
] as const;

type SortId = (typeof SORTS)[number]["id"];
type Theme = "system" | "light" | "dark";

const NEXT_THEME: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const THEME_LABEL: Record<Theme, string> = { system: "시스템 설정", light: "라이트", dark: "다크" };

const EXAMPLES = ["보고서", "응대 메일", "회의 정리", "이미지"];

interface Props {
  groups: Group[];
  items: Item[];
  roundTotal: number;
  withSample: number;
}

function previewLines(item: Item, limit: number): string[] {
  if (item.sample) {
    return item.sample
      .split("\n")
      .map((l) => l.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, ""))
      .filter((l) => l.trim().length > 0 && !/^[-|:\s]+$/.test(l))
      .slice(0, limit);
  }
  if (item.outputs.length) return item.outputs.map((o) => `· ${o}`);
  return [item.desc];
}

export function SplitExplorer({ groups, items, roundTotal, withSample }: Props) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>("recent");
  const [shown, setShown] = useState(PAGE);
  const [theme, setTheme] = useState<Theme>("system");
  const [picked, setPicked] = useState<string | null>(null);

  const groupName = useMemo(() => {
    const byId = new Map(groups.map((g) => [g.id, g.name]));
    return (id: string) => byId.get(id) ?? id;
  }, [groups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = items.filter((it) => {
      if (group && it.group !== group) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        groupName(it.group).toLowerCase().includes(q) ||
        it.outputs.some((o) => o.toLowerCase().includes(q))
      );
    });
    const sorted = [...rows];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    if (sort === "fields") sorted.sort((a, b) => a.fields - b.fields || a.title.localeCompare(b.title, "ko"));
    return sorted;
  }, [items, groupName, query, group, sort]);

  // 선택이 현재 목록 밖이면 첫 항목으로 되돌린다 — 오른쪽 페인이 비는 상태를 만들지 않는다
  const selected = useMemo(() => {
    const hit = filtered.find((it) => it.slug === picked);
    return hit ?? filtered[0] ?? null;
  }, [filtered, picked]);

  const visible = filtered.slice(0, shown);
  const hasFilter = Boolean(query.trim() || group);
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  function reset() {
    setQuery("");
    setGroup(null);
    setShown(PAGE);
  }

  return (
    <div className={styles.root} data-theme={theme === "system" ? undefined : theme}>
      <div className="relative">
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${styles.gridBg}`} />

        <div className="relative">
          {/* ── 헤더 ─────────────────────────────────────────────── */}
          <header className="border-b border-line">
            <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
              <Link href="/" className="font-bold tracking-tight">
                RE:<span className="text-acc">PROMPT</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/commissioned/home-v2"
                  className="inline-flex items-center gap-1.5 text-[13px] text-mut hover:text-fg"
                >
                  <LayoutGrid className="size-4" aria-hidden="true" />
                  카드 보기
                </Link>
                <button
                  type="button"
                  onClick={() => setTheme(NEXT_THEME[theme])}
                  className="grid size-9 place-items-center rounded-full border border-line text-mut hover:text-fg"
                  aria-label={`화면 테마: ${THEME_LABEL[theme]}. 눌러서 ${THEME_LABEL[NEXT_THEME[theme]]}(으)로 전환`}
                >
                  <ThemeIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

          {/* ── 압축 히어로 — 분할 화면을 fold 안에 넣기 위해 최소로 ─── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1320px] px-6 py-7">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[11px] uppercase text-mut trk-caption">
                    <Sparkles className="size-3 text-acc" aria-hidden="true" />
                    AI 초보자를 위한 프롬프트 빌더
                  </p>
                  <h1 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold leading-[1.15] tracking-[-0.025em]">
                    좋은 프롬프트는 재능이 아니라 <span className="text-acc">구조</span>다
                  </h1>
                </div>

                <div className="w-full max-w-[440px]">
                  <label htmlFor="q" className="sr-only">
                    템플릿 검색
                  </label>
                  <div className="flex items-center gap-2 rounded-full border border-line bg-panel py-1.5 pl-4 pr-1.5 focus-within:border-acc">
                    <Search className="size-[17px] shrink-0 text-mut" aria-hidden="true" />
                    <input
                      id="q"
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShown(PAGE);
                      }}
                      placeholder="보고서 요약, 고객 응대 메일…"
                      className="w-full bg-transparent py-1.5 text-[15px] outline-none placeholder:text-mut"
                    />
                    {query ? (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-mut hover:text-fg"
                        aria-label="검색어 지우기"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-acc text-white"
                      >
                        <ArrowRight className="size-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => {
                          setQuery(ex);
                          setShown(PAGE);
                        }}
                        className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-mut transition-colors hover:border-acc hover:text-fg motion-reduce:transition-none"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 필터 ─────────────────────────────────────────────── */}
          <section className="border-b border-line">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-6 py-3">
              <h2 className="sr-only">템플릿 목록</h2>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setGroup(null);
                    setShown(PAGE);
                  }}
                  aria-pressed={group === null}
                  className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors motion-reduce:transition-none ${
                    group === null ? "border-acc bg-acc text-white" : "border-line text-mut hover:text-fg"
                  }`}
                >
                  전체 <span className="tabular-nums opacity-70">{items.length}</span>
                </button>
                {groups.map((g) => {
                  const on = group === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGroup(on ? null : g.id);
                        setShown(PAGE);
                      }}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors motion-reduce:transition-none ${
                        on ? "border-acc bg-acc text-white" : "border-line text-mut hover:text-fg"
                      }`}
                    >
                      {g.name} <span className="tabular-nums opacity-70">{g.count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <p className="font-mono text-[12.5px] text-mut">
                  <span className="tabular-nums text-fg">{filtered.length}</span>
                  <span className="trk-stat"> 개</span>
                </p>
                {hasFilter && (
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1 rounded-full border border-acc px-2.5 py-1 text-[12px] text-fg"
                  >
                    필터 해제
                    <X className="size-3" aria-hidden="true" />
                  </button>
                )}
                <label htmlFor="sort" className="sr-only">
                  정렬 기준
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortId)}
                    className="appearance-none rounded-full border border-line bg-panel py-1 pl-3 pr-8 text-[12.5px] text-fg"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-mut"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── 분할 탐색 ────────────────────────────────────────── */}
          <section className="mx-auto max-w-[1320px] px-6 py-6">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-line bg-panel px-6 py-16 text-center">
                <p className="text-[17px] font-semibold">조건에 맞는 템플릿이 없습니다</p>
                <p className="mt-2 text-[15px] text-mut">검색어나 분류를 바꾸면 다시 찾을 수 있습니다.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-full border border-acc px-5 py-2 text-[14px] text-fg"
                >
                  필터 모두 지우기
                </button>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                {/* 좌 — 밀도형 목록 */}
                <div className="min-w-0">
                  <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
                    {visible.map((it) => {
                      const on = selected?.slug === it.slug;
                      return (
                        <li key={it.slug} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setPicked(it.slug)}
                            aria-current={on ? "true" : undefined}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors motion-reduce:transition-none ${
                              on ? "bg-bg" : "hover:bg-bg"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-1.5 inline-block h-8 w-0.5 shrink-0 ${on ? "bg-acc" : "bg-line"}`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-mono text-[10px] uppercase text-mut trk-caption">
                                {groupName(it.group)}
                              </span>
                              <span
                                className={`mt-0.5 block truncate text-[14.5px] font-semibold ${on ? "text-acc" : ""}`}
                              >
                                {it.title}
                              </span>
                              <span className="mt-1 block font-mono text-[10.5px] text-mut">
                                <span className="tabular-nums">빈칸 {it.fields}</span>
                                {it.round !== null && (
                                  <>
                                    {" · "}
                                    <span className="tabular-nums">R{it.round}</span>
                                  </>
                                )}
                                {it.sample && <span className="text-acc"> · 실제 산출물</span>}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {shown < filtered.length && (
                    <button
                      type="button"
                      onClick={() => setShown((n) => n + PAGE)}
                      className="mt-4 w-full rounded-full border border-line py-2.5 text-[13.5px] text-fg hover:border-acc"
                    >
                      더 보기
                      <span className="ml-2 font-mono text-[11.5px] tabular-nums text-mut">
                        {filtered.length - shown}개 남음
                      </span>
                    </button>
                  )}
                </div>

                {/* 우 — 선택한 템플릿의 실제 결과 */}
                <div className="min-w-0">
                  {selected && (
                    <div className="lg:sticky lg:top-6">
                      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
                        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase text-mut trk-caption">
                              <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-acc" />
                              {groupName(selected.group)}
                            </p>
                            <h3 className="mt-2 text-[20px] font-semibold leading-snug">
                              {selected.title}
                            </h3>
                            <p className="mt-1.5 max-w-[60ch] text-[13.5px] leading-relaxed text-mut">
                              {selected.desc}
                            </p>
                          </div>
                          <Link
                            href={`/p/${selected.slug}`}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-acc px-4 py-2 text-[13px] font-semibold text-white"
                          >
                            쓰기
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </div>

                        <p className="flex flex-wrap items-center gap-x-3 border-b border-line px-5 py-2.5 font-mono text-[11px] text-mut">
                          <span className="tabular-nums">빈칸 {selected.fields}개</span>
                          {selected.round !== null && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">R{selected.round} 승격</span>
                            </>
                          )}
                          {selected.score !== null && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">심사 {selected.score}/120</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{selected.sample ? "아래는 실제 심사 1위 산출물" : "아래는 출력 형식"}</span>
                        </p>

                        <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words bg-bg p-5 font-mono text-[12.5px] leading-relaxed text-fg">
                          {previewLines(selected, 44).join("\n")}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <footer className="border-t border-line">
            <div className="mx-auto max-w-[1320px] px-6 py-8 text-center font-mono text-[12px] text-mut">
              <span className="tabular-nums">{withSample}</span>
              <span className="trk-stat">종은 오른쪽 내용이 실제 심사 산출물입니다 · </span>
              <span className="tabular-nums">{roundTotal}</span>
              <span className="trk-stat">라운드 진화 기록</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
