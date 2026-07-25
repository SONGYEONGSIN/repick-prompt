// 라이브러리의 원본은 vault/50-library/*.md 다.
// CATEGORIES·TEMPLATES 는 templates.generated.ts (생성물) 에서 온다 — 그 파일을 손으로 고치지 마세요.
import type { PromptTemplate } from "./templates.types";
import { CATEGORIES, TEMPLATES } from "./templates.generated";

export type {
  FieldType,
  TemplateField,
  AnatomyItem,
  Category,
  PromptTemplate,
} from "./templates.types";
export { CATEGORIES, TEMPLATES };

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function templateBySlug(slug: string): PromptTemplate | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
