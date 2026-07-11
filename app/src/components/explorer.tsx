"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CATEGORIES, TEMPLATES, categoryName } from "@/data/templates";

export function Explorer() {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (category && t.categoryId !== category) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        categoryName(t.categoryId).toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
            category === null
              ? "border-acc bg-acc text-fg"
              : "border-line text-mut hover:border-acc/50 hover:text-fg"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          const count = TEMPLATES.filter((t) => t.categoryId === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(active ? null : c.id)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                active
                  ? "border-acc bg-acc text-fg"
                  : "border-line text-mut hover:border-acc/50 hover:text-fg"
              }`}
            >
              {c.name}
              <span className={`ml-1.5 font-mono text-[11px] ${active ? "text-fg/70" : "text-mut/60"}`}>
                {count}
              </span>
            </button>
          );
        })}
        <div className="relative ml-auto w-full sm:w-64">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mut/60"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="템플릿 검색"
            aria-label="템플릿 검색"
            className="w-full rounded-full border border-line bg-panel py-1.5 pl-9 pr-4 text-[13px] text-fg placeholder:text-mut/50 focus:border-acc/60 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-mut">
          &ldquo;{query}&rdquo;에 맞는 템플릿이 아직 없어요. 다른 키워드로 찾아보세요.
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const index = TEMPLATES.indexOf(t) + 1;
            const required = t.fields.filter((f) => !f.optional).length;
            const optional = t.fields.length - required;
            return (
              <li key={t.slug}>
                <Link
                  href={`/p/${t.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel p-6 transition-colors hover:border-acc/50"
                >
                  <span aria-hidden className="ghost-num absolute -right-2 -top-4 text-[88px]">
                    {String(index).padStart(2, "0")}
                  </span>
                  <p className="font-mono text-[11px] text-acc trk-caption uppercase">
                    {categoryName(t.categoryId)}
                  </p>
                  <h3 className="mt-3 pr-10 text-[19px] font-extrabold leading-snug tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-mut">
                    {t.description}
                  </p>
                  <p className="mt-5 font-mono text-[11px] text-mut/70 trk-stat uppercase">
                    빈칸 {required}개{optional > 0 && ` + 선택 ${optional}개`}
                    <span className="ml-2 text-acc opacity-0 transition-opacity group-hover:opacity-100">
                      → 채우러 가기
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
