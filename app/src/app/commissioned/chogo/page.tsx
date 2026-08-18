import type { Metadata } from "next";
import { Chogo } from "./chogo-client";
import { GROUPS, ITEMS, ROUND_TOTAL, WITH_SAMPLE } from "../home-v2/data";

export const metadata: Metadata = {
  title: "초고 — 시키면, 초고가 잡힌다",
  description:
    "원하는 것을 한 줄로 적으면 네 칸으로 구조를 세웁니다. 승인받기 전까지는 초고로 두는 프롬프트 빌더.",
};

export default function ChogoPage() {
  return <Chogo groups={GROUPS} items={ITEMS} roundTotal={ROUND_TOTAL} withSample={WITH_SAMPLE} />;
}
