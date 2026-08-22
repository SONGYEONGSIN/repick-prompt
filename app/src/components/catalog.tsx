"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Group, Item } from "@/data/landing.generated";

const PAGE = 12;

const SORTS = [
  { id: "recent", label: "최근 승격순" },
  { id: "title", label: "이름순" },
  { id: "fields", label: "빈칸 적은 순" },
] as const;

type SortId = (typeof SORTS)[number]["id"];


/** 검색창이 비어 있으면 초보자는 무엇을 칠지 모른다 — 실제 템플릿을 가리키는 예시를 준다 */
const EXAMPLES = ["보고서", "응대 메일", "회의 정리", "이미지"];

interface Props {
  groups: Group[];
  items: Item[];
  withSample: number;
}

/** 카드 상단 미리보기 줄 — 실제 산출물이 있으면 그것, 없으면 출력 형식 */
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

export function Catalog({ groups, items, withSample }: Props) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>("recent");
  const [shown, setShown] = useState(PAGE);
  const [preview, setPreview] = useState<Item | null>(null);

  // 드로어가 열려 있을 때 Esc 로 닫는다 — 키보드만 쓰는 사람의 탈출구
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

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

  const visible = filtered.slice(0, shown);
  const hasFilter = Boolean(query.trim() || group);

  function reset() {
    setQuery("");
    setGroup(null);
    setShown(PAGE);
  }

  return (
    <div className="relative">
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-paper" />

        <div className="relative">

          {/* ── 목록 머리말 — 랜딩이 아니라 고르는 화면이다 ──────── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 pb-8 pt-12">
              <p className="font-mono text-[11.5px] uppercase text-acc trk-caption">
                검증된 뼈대
              </p>
              <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                무엇이 나오는지 먼저 보고 고르세요
              </h1>
              <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-mut">
                템플릿 {items.length}종. 카드에 그 템플릿이 실제로 만들어낸 결과가 붙어 있습니다.
              </p>

              <div className="mt-7 max-w-[620px]">
                <label htmlFor="q" className="sr-only">
                  템플릿 검색
                </label>
                <div className="flex items-center gap-2 rounded-full border border-line bg-panel py-2 pl-5 pr-2 focus-within:border-acc">
                  <Search className="size-[18px] shrink-0 text-mut" aria-hidden="true" />
                  <input
                    id="q"
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShown(PAGE);
                    }}
                    placeholder="보고서 요약, 고객 응대 메일…"
                    className="w-full bg-transparent py-1.5 text-[16px] outline-none placeholder:text-mut"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-mut hover:text-fg"
                      aria-label="검색어 지우기"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-acc text-bg"
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => {
                        setQuery(ex);
                        setShown(PAGE);
                      }}
                      className="rounded-full border border-line px-3 py-1 text-[13px] text-mut transition-colors hover:border-acc hover:text-fg motion-reduce:transition-none"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 필터 ─────────────────────────────────────────────── */}
          <section className="border-b border-line">
            <div className="mx-auto max-w-[1120px] px-6 py-4">
              <h2 className="sr-only">템플릿 목록</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGroup(null);
                    setShown(PAGE);
                  }}
                  aria-pressed={group === null}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors motion-reduce:transition-none ${
                    group === null
                      ? "border-acc bg-acc text-white"
                      : "border-line text-mut hover:text-fg"
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
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors motion-reduce:transition-none ${
                        on ? "border-acc bg-acc text-white" : "border-line text-mut hover:text-fg"
                      }`}
                    >
                      {g.name} <span className="tabular-nums opacity-70">{g.count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-[13px] text-mut">
                    <span className="tabular-nums text-fg">{filtered.length}</span>
                    <span className="trk-stat"> 개 결과</span>
                  </p>
                  {group && (
                    <button
                      type="button"
                      onClick={() => setGroup(null)}
                      className="flex items-center gap-1 rounded-full border border-acc px-2.5 py-1 text-[12px] text-fg"
                    >
                      {groupName(group)}
                      <X className="size-3" aria-hidden="true" />
                      <span className="sr-only">분류 필터 해제</span>
                    </button>
                  )}
                  {query.trim() && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="flex items-center gap-1 rounded-full border border-acc px-2.5 py-1 text-[12px] text-fg"
                    >
                      “{query.trim()}”
                      <X className="size-3" aria-hidden="true" />
                      <span className="sr-only">검색어 해제</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="font-mono text-[12px] text-mut trk-stat">
                    정렬
                  </label>
                  <div className="relative">
                    <select
                      id="sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortId)}
                      className="appearance-none rounded-full border border-line bg-panel py-1.5 pl-4 pr-9 text-[13px] text-fg"
                    >
                      {SORTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-mut"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 그리드 ───────────────────────────────────────────── */}
          <section className="mx-auto max-w-[1120px] px-6 py-10">
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
              <>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((it) => (
                    <li
                      key={it.slug}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-acc motion-reduce:transition-none"
                    >
                      {/* 사진 자리에 결과물 미리보기 — 우리에겐 사진이 없고, 대신 나오는 것이 있다 */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-bg">
                        <pre className="whitespace-pre-wrap break-words px-4 pt-4 font-mono text-[10.5px] leading-[1.7] text-mut">
                          {previewLines(it, 7).join("\n")}
                        </pre>
                        <div
                          aria-hidden="true"
                          className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent`}
                        />
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
                        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-mut">
                          {it.desc}
                        </p>

                        <p className="mt-3 flex flex-wrap items-center gap-x-2.5 font-mono text-[10.5px] text-mut">
                          <span className="tabular-nums">빈칸 {it.fields}</span>
                          {it.round !== null && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">R{it.round}</span>
                            </>
                          )}
                          {it.score !== null && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">심사 {it.score}/120</span>
                            </>
                          )}
                        </p>

                        <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                          {it.sample ? (
                            <button
                              type="button"
                              onClick={() => setPreview(it)}
                              className="text-[13px] text-acc hover:underline"
                            >
                              결과물 미리보기
                            </button>
                          ) : (
                            <span className="text-[13px] text-mut">미리보기 없음</span>
                          )}
                          <Link
                            href={`/p/${it.slug}`}
                            className="ml-auto inline-flex items-center gap-1 text-[13px] text-mut hover:text-fg"
                          >
                            쓰기
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {shown < filtered.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShown((n) => n + PAGE)}
                      className="rounded-full border border-line px-6 py-2.5 text-[14px] text-fg hover:border-acc"
                    >
                      더 보기
                      <span className="ml-2 font-mono text-[12px] tabular-nums text-mut">
                        {filtered.length - shown}개 남음
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            <p className="mt-10 text-center font-mono text-[12px] text-mut">
            <span className="tabular-nums">{withSample}</span>
            <span className="trk-stat">종은 카드 미리보기가 실제 심사 산출물입니다</span>
          </p>

          {hasFilter && filtered.length > 0 && (
              <p className="mt-6 text-center text-[13px] text-mut">
                <button type="button" onClick={reset} className="hover:text-fg hover:underline">
                  필터 모두 지우기
                </button>
              </p>
            )}
          </section>

        </div>
      </div>

      {/* ── 결과물 미리보기 드로어 ─────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="미리보기 닫기"
            onClick={() => setPreview(null)}
            className="absolute inset-0 bg-black/70"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pv-title"
            className={`relative m-4 flex max-h-[82vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-line bg-panel `}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line p-5">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase text-mut trk-caption">
                  <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-acc" />
                  {groupName(preview.group)}
                </p>
                <h2 id="pv-title" className="mt-2 text-[19px] font-semibold">
                  {preview.title}
                </h2>
                <p className="mt-1 font-mono text-[11px] text-mut">
                  {preview.round !== null && <span className="tabular-nums">R{preview.round} </span>}
                  심사 1위 산출물 · 발췌
                  {preview.score !== null && (
                    <span className="tabular-nums"> · {preview.score}/120</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-mut hover:text-fg"
                aria-label="닫기"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <pre className="flex-1 overflow-auto whitespace-pre-wrap break-words bg-bg p-5 font-mono text-[12.5px] leading-relaxed text-fg">
              {previewLines(preview, 40).join("\n")}
            </pre>

            <div className="flex items-center justify-between gap-3 border-t border-line p-4">
              <p className="text-[12px] text-mut">빈칸 {preview.fields}개를 채우면 이런 결과가 나옵니다</p>
              <Link
                href={`/p/${preview.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-acc px-4 py-2 text-[13px] font-semibold text-white"
              >
                이 템플릿 쓰기
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
