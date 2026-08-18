import type { Metadata } from "next";
import { Landing } from "./landing-client";
import { GROUPS, ITEMS, ROUND_TOTAL, WITH_SAMPLE } from "../home-v2/data";

export const metadata: Metadata = {
  title: "빈칸 — 빈칸만 채우면 프롬프트가 완성된다",
  description:
    "AI 초보자를 위한 프롬프트 빌더. 검증을 통과한 템플릿에 빈칸만 채우면 완성된 프롬프트가 나옵니다.",
};

export default function BinkanLanding() {
  return (
    <Landing groups={GROUPS} items={ITEMS} roundTotal={ROUND_TOTAL} withSample={WITH_SAMPLE} />
  );
}
