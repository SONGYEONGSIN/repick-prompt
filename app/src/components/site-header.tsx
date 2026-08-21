import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

/** 「초고」 마크 — 원고지 한 칸과 그 위에 그어진 교정 획. 생성형 SVG 라 외부 에셋이 없다. */
export function ChogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <path d="M7 15.5 L12.5 8" stroke="var(--acc)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12.5 8 L14.5 12" stroke="var(--acc)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <ChogoMark className="size-6" />
          <span className="text-[17px] font-extrabold tracking-[-0.02em]">초고</span>
          <span className="hidden font-mono text-[11px] text-mut trk-caption uppercase sm:inline">
            草稿
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/templates" className="text-[13px] text-mut hover:text-fg">
            템플릿
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-2 px-6 py-8">
        <p className="text-[13px] text-mut">
          초고 — 승인받기 전까지는 초고로 둡니다.
        </p>
        <p className="font-mono text-[11px] text-mut trk-caption uppercase">repick family</p>
      </div>
    </footer>
  );
}
