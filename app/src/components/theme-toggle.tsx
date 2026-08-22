"use client";

import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "system" | "light" | "dark";

const NEXT: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<Theme, string> = { system: "시스템 설정", light: "라이트", dark: "다크" };

/** 초기값을 "system"(속성 없음)으로 두어 서버·클라이언트 렌더가 어긋나지 않게 한다.
 *  토글은 <html data-theme> 을 직접 바꿔 전역 토큰이 따라오게 한다. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  function cycle() {
    const next = NEXT[theme];
    setTheme(next);
    if (next === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="grid size-9 place-items-center border border-line text-mut hover:text-fg"
      aria-label={`화면 테마: ${LABEL[theme]}. 눌러서 ${LABEL[NEXT[theme]]}(으)로 전환`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
