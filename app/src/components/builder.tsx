"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import type { PromptTemplate, TemplateField } from "@/data/templates";
import { assemble, missingRequired, previewLines } from "@/lib/prompt";

type Values = Record<string, string>;

const storageKey = (slug: string) => `repick-prompt:v1:${slug}`;

/** ssr:false로만 렌더되므로 localStorage 접근이 안전하다 */
function loadSaved(slug: string): Values {
  try {
    const saved = localStorage.getItem(storageKey(slug));
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {}; // 저장값이 깨져 있으면 빈 폼으로 시작
  }
}

function FieldInput({
  field,
  index,
  value,
  onChange,
}: {
  field: TemplateField;
  index: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputId = `field-${field.key}`;
  const baseInput =
    "w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-[15px] text-fg placeholder:text-mut/50 focus:border-acc/60 transition-colors";

  return (
    <div>
      <label htmlFor={inputId} className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs text-acc trk-stat">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[15px] font-semibold">{field.label}</span>
        {field.optional && (
          <span className="text-[11px] text-mut trk-caption uppercase">선택</span>
        )}
      </label>
      {field.help && <p className="mt-1 pl-7 text-[13px] leading-relaxed text-mut">{field.help}</p>}
      <div className="mt-2 pl-7">
        {field.type === "textarea" ? (
          <textarea
            id={inputId}
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInput} resize-y font-mono text-[13px] leading-relaxed`}
          />
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? (field.options ? "칩을 누르거나 직접 입력" : undefined)}
            className={baseInput}
          />
        )}
        {field.options && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {field.options.map((option) => {
              const active = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange(active ? "" : option)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${
                    active
                      ? "border-acc bg-acc text-fg"
                      : "border-line text-mut hover:border-acc/50 hover:text-fg"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function Builder({ template }: { template: PromptTemplate }) {
  const [values, setValues] = useState<Values>(() => loadSaved(template.slug));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(template.slug), JSON.stringify(values));
    } catch {
      // 저장 불가(시크릿 모드 등)여도 빌더는 동작해야 한다
    }
  }, [values, template.slug]);

  const lines = useMemo(() => previewLines(template, values), [template, values]);
  const missing = useMemo(() => missingRequired(template, values), [template, values]);
  const requiredTotal = template.fields.filter((f) => !f.optional).length;
  const requiredFilled = requiredTotal - missing.length;

  async function copyPrompt() {
    const text = assemble(template, values);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setValues({});
    try {
      localStorage.removeItem(storageKey(template.slug));
    } catch {
      // noop
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      {/* 입력 폼 */}
      <section aria-label="프롬프트 빈칸 입력">
        <p className="font-mono text-[11px] text-mut trk-caption uppercase">
          Fig 1. 빈칸 채우기 — {requiredFilled}/{requiredTotal} 입력됨
        </p>
        <div className="mt-6 flex flex-col gap-7">
          {template.fields.map((field, i) => (
            <FieldInput
              key={field.key}
              field={field}
              index={i}
              value={values[field.key] ?? ""}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}
        </div>
      </section>

      {/* 실시간 미리보기 */}
      <section aria-label="완성된 프롬프트 미리보기" className="lg:sticky lg:top-8 lg:self-start">
        <div className="overflow-hidden rounded-lg border border-line bg-panel">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="font-mono text-[11px] text-mut trk-caption uppercase">
              Fig 2. 완성 프롬프트
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-mut transition-colors hover:text-fg"
              >
                <RotateCcw size={13} aria-hidden />
                초기화
              </button>
              <button
                type="button"
                onClick={copyPrompt}
                className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  copied ? "bg-acc/20 text-acc" : "bg-acc text-fg hover:bg-acc/85"
                }`}
              >
                {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
            <div className="font-mono text-[13px] leading-[1.75]">
              {lines.map(({ segments }, i) => (
                <div key={i} className="grid grid-cols-[2rem_1fr]">
                  <span className="select-none pr-3 text-right text-[11px] leading-[1.75] text-mut/40">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre-wrap break-words">
                    {segments.length === 0
                      ? " "
                      : segments.map((seg, j) =>
                          seg.kind === "text" ? (
                            <span key={j} className="text-mut">
                              {seg.value}
                            </span>
                          ) : seg.filled ? (
                            <mark key={j} className="rounded bg-acc/25 px-1 text-fg">
                              {seg.value}
                            </mark>
                          ) : (
                            <span
                              key={j}
                              className={`rounded border border-dashed px-1 ${
                                seg.optional
                                  ? "border-line text-mut/70"
                                  : "border-warn/50 text-warn"
                              }`}
                            >
                              [{seg.label}]
                            </span>
                          ),
                        )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {missing.length > 0 && (
            <p className="border-t border-line px-4 py-2.5 text-[12px] text-warn">
              필수 {missing.length}개({missing.map((f) => f.label).join(", ")})가 비어 있어요 —
              지금 복사하면 [빈칸]으로 복사됩니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
