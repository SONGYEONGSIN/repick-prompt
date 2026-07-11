import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-[17px] font-extrabold tracking-tight">
            RE:<span className="text-acc">PROMPT</span>
          </span>
          <span className="hidden font-mono text-[11px] text-mut trk-caption uppercase sm:inline">
            prompt builder
          </span>
        </Link>
        <p className="font-mono text-[11px] text-mut trk-caption uppercase">
          채우고 · 배우고 · 복사하고
        </p>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-2 px-6 py-8">
        <p className="text-[13px] text-mut">
          RE:PROMPT — 좋은 프롬프트는 재능이 아니라 구조입니다.
        </p>
        <p className="font-mono text-[11px] text-mut/60 trk-caption uppercase">repick family</p>
      </div>
    </footer>
  );
}
