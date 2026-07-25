export type FieldType = "text" | "textarea" | "select";

export interface TemplateField {
  /** template 본문의 {{key}} 토큰과 매핑 */
  key: string;
  label: string;
  type: FieldType;
  /** 초보자용 입력 가이드 한 줄 */
  help?: string;
  placeholder?: string;
  /** select 타입의 제안 칩 — 칩을 눌러도 되고 직접 입력해도 된다 */
  options?: string[];
  /** true면 비워도 된다 — 비우면 해당 줄이 결과에서 제거된다 */
  optional?: boolean;
}

export interface AnatomyItem {
  /** 역할 / 맥락 / 요구사항 / 출력 형식 등 구조 요소 이름 */
  part: string;
  /** 템플릿에서 해당하는 부분 인용 */
  quote: string;
  /** 왜 이 요소가 결과 품질을 올리는가 */
  why: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PromptTemplate {
  slug: string;
  categoryId: string;
  title: string;
  description: string;
  fields: TemplateField[];
  /** {{key}} 토큰을 포함한 프롬프트 본문 */
  template: string;
  anatomy: AnatomyItem[];
  tips: string[];
}
