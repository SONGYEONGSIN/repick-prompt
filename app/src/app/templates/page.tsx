import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Catalog } from "@/components/catalog";
import { Principles } from "@/components/principles";
import { GROUPS, ITEMS, WITH_SAMPLE } from "@/data/landing.generated";

export const metadata: Metadata = {
  title: "템플릿 — 초고",
  description:
    "검증을 통과한 프롬프트 템플릿 목록. 각 템플릿이 실제로 무엇을 만들어내는지 카드에서 바로 확인하세요.",
};

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Catalog groups={GROUPS} items={ITEMS} withSample={WITH_SAMPLE} />
        <Principles />
      </main>
      <SiteFooter />
    </>
  );
}
