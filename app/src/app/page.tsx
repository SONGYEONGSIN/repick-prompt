import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Explorer } from "@/components/explorer";
import { CATEGORIES, TEMPLATES } from "@/data/templates";

const PRINCIPLES = [
  {
    name: "역할",
    line: "AI에게 직업을 준다",
    example: "당신은 한국어 유튜브 교육형 채널의 작가입니다.",
    why: "역할이 정해지면 그 직업의 어휘와 기준으로 답합니다. 막연한 '써줘'보다 결과가 한 단계 올라갑니다.",
  },
  {
    name: "맥락",
    line: "상황과 변수를 채운다",
    example: "대상 시청자: 초보자 / 목표: 교육 / 길이: 7분",
    why: "같은 요청도 대상과 목표가 다르면 정답이 다릅니다. 맥락이 결과의 방향을 결정합니다.",
  },
  {
    name: "요구사항",
    line: "품질 기준을 명시한다",
    example: "첫 15초 훅을 강하게. 과장된 표현은 피할 것.",
    why: "'잘 써줘'는 기준이 아닙니다. 검증 가능한 기준을 주면 결과를 받았을 때 스스로 평가할 수 있습니다.",
  },
  {
    name: "출력 형식",
    line: "받을 모양을 정한다",
    example: "출력: 제목 후보 3개 + 장면별 스크립트",
    why: "형식을 지정하면 받아서 바로 쓸 수 있습니다. 정리하느라 쓰는 시간이 사라집니다.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero — 비대칭 좌측정렬 + clamp 초대형 스케일 */}
        <section className="mx-auto max-w-[1120px] px-6 pb-24 pt-24 lg:pt-32">
          <p className="font-mono text-[12px] text-acc trk-eyebrow uppercase">
            AI 초보자를 위한 프롬프트 빌더
          </p>
          <h1 className="mt-6 max-w-[17ch] text-[clamp(38px,7vw,84px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            좋은 프롬프트는
            <br />
            재능이 아니라 <span className="text-acc">구조</span>다
          </h1>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-mut">
            검증된 템플릿의 빈칸만 채우면 완성도 높은 프롬프트가 실시간으로 조립됩니다.
            그리고 템플릿마다 붙어 있는 해부도가 <strong className="font-semibold text-fg">왜 이 구조가 작동하는지</strong>를
            알려줘서, 쓰다 보면 어느새 직접 쓸 수 있게 됩니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[12px] text-mut trk-stat uppercase">
            <span>
              <span className="text-fg font-semibold">{TEMPLATES.length}</span> 템플릿
            </span>
            <span>
              <span className="text-fg font-semibold">{CATEGORIES.length}</span> 카테고리
            </span>
            <span>
              <span className="text-fg font-semibold">4</span>요소 구조 학습
            </span>
            <span>
              <span className="text-fg font-semibold">0</span>원 · 로그인 없음
            </span>
          </div>
        </section>

        {/* 프롬프트 기본기 — 4요소 */}
        <section className="border-y border-line bg-panel/50">
          <div className="mx-auto max-w-[1120px] px-6 py-24">
            <p className="font-mono text-[11px] text-mut trk-caption uppercase">
              Fig 0. 좋은 프롬프트의 4요소
            </p>
            <h2 className="mt-4 max-w-[24ch] text-[clamp(24px,3.4vw,36px)] font-extrabold leading-tight tracking-[-0.02em]">
              모든 템플릿은 같은 뼈대 위에 서 있습니다
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((p, i) => (
                <article key={p.name} className="relative bg-bg p-6">
                  <span aria-hidden className="ghost-num absolute -right-1 -top-3 text-[72px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[17px] font-extrabold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-acc">{p.line}</p>
                  <p className="mt-4 rounded border border-line bg-panel px-3 py-2.5 font-mono text-[12px] leading-relaxed text-mut">
                    {p.example}
                  </p>
                  <p className="mt-4 text-[13px] leading-relaxed text-mut">{p.why}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 템플릿 탐색 */}
        <section className="mx-auto max-w-[1120px] px-6 py-24">
          <p className="font-mono text-[11px] text-mut trk-caption uppercase">
            Fig 1. 템플릿 라이브러리
          </p>
          <h2 className="mt-4 text-[clamp(24px,3.4vw,36px)] font-extrabold leading-tight tracking-[-0.02em]">
            지금 할 일을 고르세요
          </h2>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-mut">
            빈칸 몇 개만 채우면 2분 안에 완성됩니다. 입력한 내용은 브라우저에만 저장돼요.
          </p>
          <div className="mt-10">
            <Explorer />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
