import type { Metadata } from "next";
import { SplitExplorer } from "./split-client";
import { GROUPS, ITEMS, ROUND_TOTAL, WITH_SAMPLE } from "../data";

export const metadata: Metadata = {
  title: "RE:PROMPT — 템플릿 탐색 (분할 보기)",
  description:
    "왼쪽에서 고르면 오른쪽에 실제 결과물이 바로 뜹니다. 같은 데이터의 분할 탐색 아키타입 비교본.",
};

export default function SplitPage() {
  return (
    <SplitExplorer
      groups={GROUPS}
      items={ITEMS}
      roundTotal={ROUND_TOTAL}
      withSample={WITH_SAMPLE}
    />
  );
}
