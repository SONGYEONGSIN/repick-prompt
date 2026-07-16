# 김하늘 포트폴리오 — 완성된 단일 HTML 파일

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="김하늘 — 브랜드·그래픽 디자이너 (5년차). 로고부터 패키지, 간판, 앱 화면까지.">
<title>김하늘 — 브랜드·그래픽 디자이너</title>
<style>
  :root {
    --bg: #FAF6EF;
    --ink: #32281E;
    --accent: #B25B32;
    --line: rgba(50, 40, 30, 0.15);
    --muted: rgba(50, 40, 30, 0.68);
    --card: rgba(255, 255, 255, 0.55);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 76px;
  }

  body {
    background: var(--bg);
    color: var(--ink);
    font-family: "Pretendard Variable", Pretendard, "Apple SD Gothic Neo",
      "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.75;
    word-break: keep-all;
    -webkit-font-smoothing: antialiased;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 6px;
  }

  /* ---------- 상단 고정 메뉴 ---------- */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: rgba(250, 246, 239, 0.93);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }

  .brand {
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    color: var(--ink);
    text-decoration: none;
  }

  .site-header nav { display: flex; gap: 2px; }

  .site-header nav a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.95rem;
    padding: 10px 12px;
    border-radius: 8px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .site-header nav a:hover,
  .site-header nav a:active {
    color: var(--accent);
    background: rgba(178, 91, 50, 0.08);
  }

  main {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 20px 48px;
  }

  section { scroll-margin-top: 76px; }

  /* ---------- 소개 ---------- */
  .hero { padding: 64px 0 48px; }

  .hero h1 {
    font-size: clamp(2.4rem, 10vw, 3.6rem);
    line-height: 1.15;
    letter-spacing: -0.03em;
    font-weight: 800;
  }

  .hero .job {
    margin-top: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
  }

  .hero .lede {
    margin-top: 20px;
    font-size: 1.05rem;
    max-width: 34em;
  }

  .principle {
    margin-top: 24px;
    padding: 14px 16px;
    border-left: 3px solid var(--accent);
    background: var(--card);
    border-radius: 0 12px 12px 0;
    font-size: 0.95rem;
    color: var(--muted);
  }

  .tools {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .tools .label {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--muted);
    margin-right: 4px;
  }

  .chip {
    font-size: 0.85rem;
    padding: 5px 13px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    background: var(--card);
  }

  /* ---------- 프로젝트 ---------- */
  .section-head { padding: 40px 0 20px; }

  .section-head h2 {
    font-size: 1.7rem;
    letter-spacing: -0.02em;
    font-weight: 800;
  }

  .section-head p {
    margin-top: 8px;
    color: var(--muted);
    font-size: 0.98rem;
  }

  .card {
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--card);
    margin-bottom: 16px;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }

  .card.open { border-color: var(--accent); }

  .card-toggle {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    padding: 22px 20px;
    background: none;
    border: 0;
    cursor: pointer;
    text-align: left;
    font: inherit;
    color: inherit;
  }

  .card-toggle .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    font-size: 0.83rem;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .role-badge {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--accent);
    border: 1px solid currentColor;
    padding: 2px 10px;
    border-radius: 999px;
  }

  .card-toggle h3 {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.35;
  }

  .card-toggle .scope {
    margin-top: 8px;
    font-size: 0.92rem;
    color: var(--muted);
  }

  .card-toggle .hint {
    margin-top: 12px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent);
  }

  .icon {
    flex: none;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-size: 1.2rem;
    line-height: 1;
    color: var(--accent);
    transition: transform 0.35s ease, background 0.2s ease;
  }

  .card.open .icon { transform: rotate(45deg); background: rgba(178, 91, 50, 0.1); }

  .card-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s ease;
  }

  .card-body > div { overflow: hidden; }

  .card.open .card-body { grid-template-rows: 1fr; }

  .card-inner {
    padding: 0 20px 26px;
    border-top: 1px dashed var(--line);
  }

  .case-step { padding-top: 22px; }

  .case-step .step-label {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-weight: 800;
    font-size: 1rem;
    margin-bottom: 6px;
  }

  .case-step .num {
    font-size: 0.8rem;
    color: var(--accent);
    font-weight: 800;
    letter-spacing: 0.05em;
  }

  .case-step p { font-size: 0.98rem; }

  .fact-note {
    margin-top: 10px;
    font-size: 0.88rem;
    color: var(--muted);
    border-left: 3px solid var(--accent);
    padding: 2px 0 2px 12px;
  }

  .todo {
    background: rgba(178, 91, 50, 0.14);
    color: var(--accent);
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 6px;
    white-space: nowrap;
  }

  /* ---------- 연락처 ---------- */
  #contact { padding-top: 8px; }

  .contact-box {
    margin-top: 4px;
    padding: 30px 24px;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: var(--card);
    text-align: center;
  }

  .contact-box h2 {
    font-size: 1.55rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .contact-box p {
    margin-top: 10px;
    color: var(--muted);
    font-size: 0.98rem;
    max-width: 30em;
    margin-left: auto;
    margin-right: auto;
  }

  .contact-actions {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 14px 22px;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease;
  }

  .btn:active { transform: scale(0.98); }

  .btn-primary { background: var(--accent); color: #FAF6EF; }
  .btn-primary:hover { background: #9A4A25; }

  .btn-ghost {
    border: 1.5px solid var(--accent);
    color: var(--accent);
  }
  .btn-ghost:hover { background: rgba(178, 91, 50, 0.09); }

  footer {
    padding: 32px 20px 48px;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* ---------- 넓은 화면 ---------- */
  @media (min-width: 700px) {
    body { font-size: 18px; }
    .contact-actions { flex-direction: row; justify-content: center; }
    .card-toggle { padding: 26px 26px; }
    .card-inner { padding: 0 26px 30px; }
  }

  /* ---------- 움직임 줄이기 설정 존중 ---------- */
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { transition: none !important; }
  }
</style>
</head>
<body>

<header class="site-header">
  <a class="brand" href="#top">김하늘</a>
  <nav aria-label="섹션 이동">
    <a href="#about">소개</a>
    <a href="#projects">프로젝트</a>
    <a href="#contact">연락처</a>
  </nav>
</header>

<main id="top">

  <!-- ===== 소개 ===== -->
  <section class="hero" id="about" aria-label="소개">
    <h1>김하늘</h1>
    <p class="job">브랜드·그래픽 디자이너 · 5년차</p>
    <p class="lede">
      로고에서 시작해 패키지, 간판, 메뉴판, 앱 화면까지 —
      브랜드가 사람과 만나는 접점을 끝까지 따라가며 만듭니다.
    </p>
    <p class="principle">
      이 페이지의 성과는 모두 출처를 함께 적었습니다.
      확인되지 않은 숫자는 쓰지 않았고, 확인 중인 항목은
      <span class="todo">[확인 필요]</span>로 그대로 남겨두었습니다.
    </p>
    <div class="tools">
      <span class="label">쓰는 도구</span>
      <span class="chip">Illustrator</span>
      <span class="chip">Photoshop</span>
      <span class="chip">Figma</span>
    </div>
  </section>

  <!-- ===== 프로젝트 ===== -->
  <section id="projects" aria-label="프로젝트">
    <div class="section-head">
      <h2>프로젝트</h2>
      <p>각 케이스는 &ldquo;어떤 문제였나 → 어떻게 접근했나 → 무엇으로 확인됐나&rdquo; 순서로 적었습니다. 카드를 누르면 전문이 펼쳐집니다.</p>
    </div>

    <!-- 오트오트 -->
    <article class="card">
      <button class="card-toggle" aria-expanded="false" aria-controls="case-oatoat" id="toggle-oatoat">
        <span>
          <span class="meta">
            <span>2024 · 수제 그래놀라 브랜드</span>
            <span class="role-badge">혼자 전담</span>
          </span>
          <h3>오트오트 리브랜딩</h3>
          <span class="scope">로고 · 패키지 6종 · 인스타그램 템플릿</span>
          <span class="hint">케이스 읽기</span>
        </span>
        <span class="icon" aria-hidden="true">＋</span>
      </button>
      <div class="card-body" id="case-oatoat" role="region" aria-labelledby="toggle-oatoat">
        <div>
          <div class="card-inner">
            <div class="case-step">
              <p class="step-label"><span class="num">01</span>어떤 문제였나</p>
              <p>수제 그래놀라 브랜드 오트오트의 리브랜딩이었습니다. 로고부터 패키지, 인스타그램 콘텐츠까지 — 브랜드가 보여지는 지점 전체를 새로 정리하는 작업이었습니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">02</span>어떻게 접근했나</p>
              <p>혼자 전담으로 진행했습니다. 로고와 패키지 6종, 인스타그램 템플릿까지 브랜드가 쓰는 그래픽 일체를 제가 만들었습니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">03</span>무엇으로 확인됐나</p>
              <p>패키지 리뉴얼 후 진행된 와디즈 펀딩에서 1,800만 원을 기록했습니다. 대표님께 재방문 구매가 늘었다는 이야기도 들었지만, 집계된 수치가 없어 성과로 적지 않습니다.</p>
              <p class="fact-note">근거: 와디즈 펀딩 페이지에서 확인 가능한 공개 수치</p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- 카페 모루 -->
    <article class="card">
      <button class="card-toggle" aria-expanded="false" aria-controls="case-moru" id="toggle-moru">
        <span>
          <span class="meta">
            <span>2023 · 카페</span>
            <span class="role-badge">혼자 전담</span>
          </span>
          <h3>카페 모루 BI</h3>
          <span class="scope">로고 · 간판 · 메뉴판 · 컵 · 포장 일체</span>
          <span class="hint">케이스 읽기</span>
        </span>
        <span class="icon" aria-hidden="true">＋</span>
      </button>
      <div class="card-body" id="case-moru" role="region" aria-labelledby="toggle-moru">
        <div>
          <div class="card-inner">
            <div class="case-step">
              <p class="step-label"><span class="num">01</span>어떤 문제였나</p>
              <p>카페 모루가 손님과 만나는 모든 접점 — 로고, 간판, 메뉴판, 컵, 포장 — 에 하나로 이어지는 브랜드 아이덴티티가 필요했습니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">02</span>어떻게 접근했나</p>
              <p>혼자 전담으로 로고부터 간판, 메뉴판, 컵, 포장까지 BI 일체를 만들었습니다. 공간에 걸리는 것부터 손에 쥐는 것까지 전부 제 손을 거쳤습니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">03</span>무엇으로 확인됐나</p>
              <p>오픈 3개월 만에 지역 블로그와 인스타그램에서 다수 소개되었습니다. 소개 건수를 집계한 수치는 없어서, 부풀리지 않고 &lsquo;다수&rsquo;라고만 적습니다.</p>
              <p class="fact-note">근거: 지역 블로그·인스타그램 게시물 (집계 수치 없음)</p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- 글로우데이 -->
    <article class="card">
      <button class="card-toggle" aria-expanded="false" aria-controls="case-glowday" id="toggle-glowday">
        <span>
          <span class="meta">
            <span>2025 · 뷰티 앱</span>
            <span class="role-badge">리드 · 디자이너 2명과 팀 작업</span>
          </span>
          <h3>글로우데이 브랜드 리뉴얼</h3>
          <span class="scope">앱스토어 스크린샷 일체 · 온보딩 일러스트 12종</span>
          <span class="hint">케이스 읽기</span>
        </span>
        <span class="icon" aria-hidden="true">＋</span>
      </button>
      <div class="card-body" id="case-glowday" role="region" aria-labelledby="toggle-glowday">
        <div>
          <div class="card-inner">
            <div class="case-step">
              <p class="step-label"><span class="num">01</span>어떤 문제였나</p>
              <p>뷰티 앱 글로우데이의 브랜드 리뉴얼이었습니다. 앱스토어 스크린샷 일체와 온보딩 일러스트 12종이 작업 대상이었습니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">02</span>어떻게 접근했나</p>
              <p>제 역할은 리드였고, 디자이너 2명과 함께 진행한 팀 프로젝트입니다. 앱스토어 스크린샷 일체와 온보딩 일러스트 12종은 저 혼자가 아니라 팀이 함께 만든 결과물입니다.</p>
            </div>
            <div class="case-step">
              <p class="step-label"><span class="num">03</span>무엇으로 확인됐나</p>
              <p>리뉴얼 후 마케팅팀이 전환율 12% 개선을 확인했다고 전해왔습니다. 측정 기간은 <span class="todo">[확인 필요]</span> — 확인되는 대로 이 자리에 채워 넣겠습니다. 이 수치는 저 개인이 아닌, 리뉴얼에 참여한 팀 전체의 성과입니다.</p>
              <p class="fact-note">근거: 마케팅팀 집계 (측정 기간 <span class="todo">[확인 필요]</span>)</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>

  <!-- ===== 연락처 ===== -->
  <section id="contact" aria-label="연락처">
    <div class="section-head">
      <h2>연락처</h2>
    </div>
    <div class="contact-box">
      <h2>브랜딩·패키지, 맡겨보시겠어요?</h2>
      <p>
        F&amp;B·라이프스타일 브랜드의 로고부터 패키지까지 —
        메일이나 인스타그램 DM으로 편하게 문의 주세요.
      </p>
      <div class="contact-actions">
        <a class="btn btn-primary" href="mailto:hello@haneulkim.design">메일 보내기 · hello@haneulkim.design</a>
        <a class="btn btn-ghost" href="https://instagram.com/haneul.design" target="_blank" rel="noopener">인스타그램 DM · @haneul.design</a>
      </div>
    </div>
  </section>

</main>

<footer>
  김하늘 · 브랜드·그래픽 디자이너 · hello@haneulkim.design
</footer>

<script>
  // 인터랙션 1: 프로젝트 카드 펼침/접힘 (부드러운 전환은 CSS grid-template-rows가 담당)
  document.querySelectorAll('.card-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      var isOpen = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
  // 인터랙션 2: 상단 메뉴 앵커 이동 — 브라우저 기본 앵커 + CSS scroll-behavior: smooth
  // 인터랙션 3: 펼침·이동 시 부드러운 전환 — CSS transition (prefers-reduced-motion 시 자동 해제)
</script>

</body>
</html>
```

---

## 파일 여는 법 3단계

1. 메모장(텍스트 편집기)을 열고 위 HTML 코드를 전체 복사해 붙여넣습니다.
2. **"포트폴리오.html"** 이름으로 저장합니다. (저장할 때 파일 형식이 선택 가능하면 "모든 파일", 인코딩은 UTF-8을 고릅니다)
3. 저장한 파일을 더블클릭하면 브라우저에서 바로 열립니다. 인터넷 연결은 필요 없습니다.

---

## 사실 대조표

페이지에 실린 성과·수치 문구를 메모 원문과 나란히 대조한 표입니다.

| 페이지에 실린 문구 | 근거가 된 메모 원문 (인용) |
|---|---|
| "와디즈 펀딩에서 1,800만 원을 기록했습니다" + 근거 표기 "와디즈 펀딩 페이지에서 확인 가능한 공개 수치" | "패키지 리뉴얼 후 와디즈 펀딩 1,800만 원 (와디즈 페이지에서 확인 가능)" |
| "재방문 구매가 늘었다는 이야기도 들었지만, 집계된 수치가 없어 성과로 적지 않습니다" | "재방문 구매 증가는 대표님 말로만 들어 수치 없음" |
| "오픈 3개월 만에 지역 블로그와 인스타그램에서 다수 소개되었습니다 … '다수'라고만 적습니다" | "오픈 3개월 만에 지역 블로그·인스타 다수 소개 (집계 수치 없음)" |
| "마케팅팀이 전환율 12% 개선을 확인했다고 전해왔습니다. 측정 기간은 [확인 필요]" | "마케팅팀이 전환율 12% 개선이라 했는데 측정 기간은 기억 안 남" |
| "제 역할은 리드였고, 디자이너 2명과 함께 진행한 팀 프로젝트입니다 … 팀이 함께 만든 결과물입니다" / "이 수치는 … 팀 전체의 성과입니다" | "내 역할: 리드였지만 디자이너 2명과 함께 진행" |
| 오트오트·카페 모루 카드의 역할 배지 "혼자 전담" | "[오트오트] 내 역할: 혼자 전담" / "[카페 모루] 내 역할: 혼자 전담" |
| "패키지 6종", "온보딩 일러스트 12종", "브랜드·그래픽 디자이너 · 5년차" | "패키지 6종·인스타 템플릿" / "온보딩 일러스트 12종" / "김하늘 — 브랜드·그래픽 디자이너 (5년차)" |
| 도구 표기 "Illustrator / Photoshop / Figma" | "실제로 쓴 도구·기술: Illustrator, Photoshop, Figma" |

**출력 전 자체 점검 결과** (볼 사람 시점에서 짚을 만한 문구 3개를 대조한 기록):

1. **"와디즈 펀딩 1,800만 원"** → 메모에 "와디즈 페이지에서 확인 가능"이라는 근거 문장이 있어 그대로 유지. 다만 메모에 URL이 없어 '보러 가기' 버튼은 만들지 않음.
2. **"전환율 12% 개선"** → 수치 자체는 메모에 있으나 측정 기간이 "기억 안 남"이므로, 기간을 그럴듯하게 특정하지 않고 [확인 필요]로 표시. 출처(마케팅팀 집계)와 팀 성과임을 문장에 명시.
3. **"지역 블로그·인스타 다수 소개"** → 메모에 "집계 수치 없음"이 명시되어 있어 건수를 만들지 않고 '다수'로 유지하며, 집계 수치가 없다는 사실도 문장에 그대로 적음. 초안에서 "화제가 되었다"류의 표현은 근거 원문이 없어 제외함.

---

## [확인 필요] 목록

게시 전에 주인이 채우거나 지워야 할 자리와 확인 방법입니다.

| # | 자리 | 확인 방법 한 줄 |
|---|---|---|
| 1 | 글로우데이 카드 — "전환율 12% 개선"의 **측정 기간 [확인 필요]** (본문·근거 표기 두 곳) | 글로우데이 마케팅팀에 측정 기간과 비교 기준(리뉴얼 전후 어느 구간을 비교했는지)을 문의해 괄호 안을 채운다. 확인이 안 되면 수치 문장 자체를 빼는 것이 안전하다. |
| 2 | 오트오트 카드 — "재방문 구매가 늘었다는 이야기" 문장 (현재 '수치 없음'으로 명시된 상태) | 오트오트 대표님께 재구매 관련 수치(재구매율 등)가 있는지 확인해, 있으면 수치로 교체하고 없으면 이 문장은 지워도 케이스가 성립한다. |
| 3 | (선택) 오트오트 카드 — 와디즈 페이지 링크 버튼 자리 | 와디즈에서 오트오트 펀딩 페이지 URL을 확보하면 카드 결과 단락에 '와디즈에서 확인하기' 버튼을 추가할 수 있다. URL 확보 전에는 버튼을 만들지 않는다. |

---

## 예상 검증 질문 3개

1. **"와디즈 1,800만 원이요? 어디서 확인할 수 있죠?"**
   → 와디즈 펀딩 페이지에 공개된 수치라고 답하고, 그 자리에서 해당 페이지를 열어 보여주면 된다 (메모 근거: "와디즈 페이지에서 확인 가능").

2. **"전환율 12%는 디자이너님 혼자 만든 성과인가요? 어떻게 측정한 거죠?"**
   → 리드로 참여했지만 디자이너 2명과 함께한 팀 성과이고, 수치는 마케팅팀 집계이며 측정 기간은 현재 확인 중이라고 페이지에 적힌 그대로 답하면 된다 — 페이지와 답변이 일치하므로 무너질 지점이 없다.

3. **"카페 모루가 '다수 소개'됐다는 건 정확히 몇 건인가요?"**
   → 집계한 수치가 없어서 페이지에도 '다수'로만 적었다고 답하고, 오픈 3개월 시점에 지역 블로그·인스타그램에 소개된 사실 자체만 말하면 된다 (메모 근거: "집계 수치 없음").
