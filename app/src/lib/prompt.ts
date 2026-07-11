import type { PromptTemplate, TemplateField } from "@/data/templates";

const TOKEN_RE = /\{\{(\w+)\}\}/g;

export type Segment =
  | { kind: "text"; value: string }
  | { kind: "slot"; key: string; label: string; value: string; filled: boolean; optional: boolean };

export interface PreviewLine {
  segments: Segment[];
}

type Values = Record<string, string>;

function fieldMap(template: PromptTemplate): Map<string, TemplateField> {
  return new Map(template.fields.map((f) => [f.key, f]));
}

function lineSegments(line: string, fields: Map<string, TemplateField>, values: Values): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN_RE)) {
    const [token, key] = match;
    const index = match.index ?? 0;
    if (index > last) segments.push({ kind: "text", value: line.slice(last, index) });
    const field = fields.get(key);
    if (!field) {
      segments.push({ kind: "text", value: token });
    } else {
      const value = (values[key] ?? "").trim();
      segments.push({
        kind: "slot",
        key,
        label: field.label,
        value,
        filled: value.length > 0,
        optional: field.optional === true,
      });
    }
    last = index + token.length;
  }
  if (last < line.length) segments.push({ kind: "text", value: line.slice(last) });
  return segments;
}

/**
 * 빈 optional 슬롯만 있는 줄은 결과에서 제거한다 —
 * "- 참석자: " 같은 반쪽짜리 줄이 복사되는 것을 막는다.
 */
function shouldDropLine(segments: Segment[]): boolean {
  const slots = segments.filter((s): s is Extract<Segment, { kind: "slot" }> => s.kind === "slot");
  if (slots.length === 0) return false;
  return slots.every((s) => !s.filled) && slots.every((s) => s.optional);
}

/** 미리보기용 — 슬롯 하이라이트를 위해 줄·세그먼트 구조를 유지한다 */
export function previewLines(template: PromptTemplate, values: Values): PreviewLine[] {
  const fields = fieldMap(template);
  return template.template
    .split("\n")
    .map((line) => lineSegments(line, fields, values))
    .filter((segments) => !shouldDropLine(segments))
    .map((segments) => ({ segments }));
}

/** 복사용 최종 텍스트 — 미입력 필수 슬롯은 [라벨]로 남긴다 */
export function assemble(template: PromptTemplate, values: Values): string {
  return previewLines(template, values)
    .map(({ segments }) =>
      segments
        .map((s) => (s.kind === "text" ? s.value : s.filled ? s.value : `[${s.label}]`))
        .join(""),
    )
    .join("\n");
}

/** 필수 필드 중 아직 비어 있는 것들 */
export function missingRequired(template: PromptTemplate, values: Values): TemplateField[] {
  return template.fields.filter((f) => !f.optional && !(values[f.key] ?? "").trim());
}
