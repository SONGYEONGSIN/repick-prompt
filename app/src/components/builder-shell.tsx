"use client";

import dynamic from "next/dynamic";
import type { PromptTemplate } from "@/data/templates";

/**
 * 빌더는 localStorage에서 초안을 복원하므로 클라이언트 전용으로 렌더한다.
 * 서버 HTML에는 스켈레톤만 남는다.
 */
const Builder = dynamic(() => import("./builder").then((m) => m.Builder), {
  ssr: false,
  loading: () => (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      <div className="h-96 animate-pulse rounded-lg border border-line bg-panel" />
      <div className="h-96 animate-pulse rounded-lg border border-line bg-panel" />
    </div>
  ),
});

export function BuilderShell({ template }: { template: PromptTemplate }) {
  return <Builder template={template} />;
}
