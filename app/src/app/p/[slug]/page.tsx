import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { BuilderShell } from "@/components/builder-shell";
import { TEMPLATES, templateBySlug, categoryName } from "@/data/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = templateBySlug(slug);
  if (!template) return {};
  return {
    title: `${template.title} — RE:PROMPT`,
    description: template.description,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templateBySlug(slug);
  if (!template) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1120px] px-6 pb-24">
        {/* 템플릿 헤더 */}
        <div className="pb-12 pt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-mut transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden />
            전체 템플릿
          </Link>
          <p className="mt-6 font-mono text-[12px] text-acc trk-eyebrow uppercase">
            {categoryName(template.categoryId)}
          </p>
          <h1 className="mt-3 max-w-[24ch] text-[clamp(28px,4.5vw,48px)] font-extrabold leading-tight tracking-[-0.02em]">
            {template.title}
          </h1>
          <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-mut">
            {template.description}
          </p>
        </div>

        <BuilderShell template={template} />

        {/* 프롬프트 해부 — 학습 섹션 */}
        <section aria-label="프롬프트 해부" className="mt-24 border-t border-line pt-16">
          <p className="font-mono text-[11px] text-mut trk-caption uppercase">
            Fig 3. 프롬프트 해부
          </p>
          <h2 className="mt-4 max-w-[26ch] text-[clamp(22px,3vw,32px)] font-extrabold leading-tight tracking-[-0.02em]">
            이 프롬프트가 잘 작동하는 이유
          </h2>
          <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-mut">
            구조를 이해하면 템플릿 없이도 쓸 수 있게 됩니다. 위에서 채운 프롬프트를 요소별로
            뜯어봤어요.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {template.anatomy.map((item, i) => (
              <article key={item.part} className="relative bg-bg p-6">
                <span aria-hidden className="ghost-num absolute -right-1 -top-3 text-[72px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[16px] font-extrabold tracking-tight">{item.part}</h3>
                <blockquote className="mt-3 border-l-2 border-acc/60 pl-3 font-mono text-[12px] leading-relaxed text-mut">
                  {item.quote}
                </blockquote>
                <p className="mt-4 text-[14px] leading-relaxed text-mut">{item.why}</p>
              </article>
            ))}
          </div>

          {template.tips.length > 0 && (
            <div className="mt-8 rounded-lg border border-acc/30 bg-acc/[0.07] p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] text-acc trk-caption uppercase">
                <Lightbulb size={14} aria-hidden />
                한 걸음 더
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {template.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-mut">
                    <span className="font-mono text-[12px] text-acc">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 다음 템플릿 제안 */}
        <section aria-label="다른 템플릿" className="mt-20">
          <p className="font-mono text-[11px] text-mut trk-caption uppercase">다음으로 해보기</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {TEMPLATES.filter((t) => t.slug !== template.slug)
              .slice(0, 3)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/p/${t.slug}`}
                    className="block h-full rounded-lg border border-line bg-panel p-5 transition-colors hover:border-acc/50"
                  >
                    <p className="font-mono text-[10px] text-acc trk-caption uppercase">
                      {categoryName(t.categoryId)}
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-snug">{t.title}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
