import type { Metadata } from "next";
import { HomeV2 } from "./home-v2-client";
import { GROUPS, ITEMS, ROUND_TOTAL, WITH_SAMPLE } from "./data";

export const metadata: Metadata = {
  title: "RE:PROMPT — 검증된 프롬프트 템플릿 찾기",
  description:
    "빈칸만 채우면 완성되는 검증된 프롬프트 템플릿. 각 템플릿이 실제로 무엇을 만들어내는지 카드에서 바로 확인하세요.",
};

// 공용 SiteHeader 를 쓰지 않는다 — 라이트 테마 토큰을 주문 폴더 안에서만 재정의하므로,
// 헤더까지 이 래퍼 안에 있어야 테마가 화면 전체에 일관되게 적용된다.
export default function HomeV2Page() {
  return (
    <HomeV2 groups={GROUPS} items={ITEMS} roundTotal={ROUND_TOTAL} withSample={WITH_SAMPLE} />
  );
}
