import { ChogoMark } from "./site-header";

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

/** 좋은 프롬프트의 4요소 — 기존 홈에 있던 교육 콘텐츠. 대상이 초보자라 버리지 않고
 *  랜딩이 아니라 고르는 화면 아래로 옮겼다. */
export function Principles() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-20">
        <p className="flex items-center gap-2 font-mono text-[11.5px] uppercase text-acc trk-caption">
          <ChogoMark className="size-4" />
          좋은 프롬프트의 4요소
        </p>
        <h2 className="mt-4 max-w-[22ch] text-[clamp(24px,3.2vw,36px)] font-extrabold leading-[1.14] tracking-[-0.025em]">
          모든 템플릿은 같은 뼈대 위에 서 있습니다
        </h2>

        <ol className="mt-9 grid gap-px sm:grid-cols-2" style={{ background: "var(--line)" }}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.name} className="bg-panel p-6">
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tabular-nums text-acc">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] font-semibold">{p.name}</span>
                <span className="text-[13px] text-mut">{p.line}</span>
              </p>
              <p className="mt-3 border-l-2 border-line pl-3 font-mono text-[12.5px] leading-relaxed text-fg">
                {p.example}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-mut">{p.why}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
