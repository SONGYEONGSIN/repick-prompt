/** 빈칸 로고 — 채워야 할 사각 프레임과, 방금 채워진 밑줄.
 *  이름이 곧 사용법이므로 마크도 "빈칸"을 그대로 그린다. 생성형 SVG 라 외부 에셋이 없다. */
export function BinkanMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="2.5"
        y="3.5"
        width="19"
        height="17"
        rx="4"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
      <path
        d="M7 9.5h10"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* 채워진 줄 — 액센트는 여기 한 곳에만 쓴다 */}
      <path
        d="M7 14.5h6.5"
        stroke="var(--acc)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BinkanLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <BinkanMark className="size-6" />
      <span className="text-[17px] font-extrabold tracking-[-0.02em]">빈칸</span>
    </span>
  );
}
