# 김하늘 — 인터랙티브 원페이지 포트폴리오

## 완성된 단일 HTML 파일 (전체 코드)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>김하늘 — 브랜드·그래픽 디자이너</title>
<style>
  /* ========== 기본 설정 ========== */
  :root {
    --bg: #FAF6F0;          /* 따뜻한 미색 배경 */
    --ink: #2B2320;         /* 짙은 웜 브라운 본문 */
    --ink-soft: #6B5D53;    /* 보조 텍스트 */
    --accent: #B5543B;      /* 테라코타 포인트 */
    --accent-deep: #96432E; /* 포인트 진한 톤 (호버) */
    --card: #FFFFFF;
    --line: #E8DFD3;
    --nav-h: 56px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--nav-h) + 16px);
  }

  body {
    font-family: "Apple SD Gothic Neo", "Pretendard", "Malgun Gothic",
                 "Segoe UI", system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
  }

  a { color: inherit; }
  img { max-width: 100%; display: block; }

  /* ========== 스크롤 등장 애니메이션 ========== */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: none;
  }
  .reveal.delay-1 { transition-delay: 0.08s; }
  .reveal.delay-2 { transition-delay: 0.16s; }

  /* 동작 줄이기 설정: 모든 움직임 제거, 콘텐츠 즉시 표시 */
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
    .reveal { opacity: 1; transform: none; }
  }

  /* ========== 상단 고정 메뉴 ========== */
  .top-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: var(--nav-h);
    background: rgba(250, 246, 240, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  .top-nav .brand {
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.02em;
    text-decoration: none;
  }
  .top-nav ul {
    display: flex;
    gap: 4px;
    list-style: none;
  }
  .top-nav ul a {
    display: inline-block;
    padding: 8px 12px;
    font-size: 14px;
    text-decoration: none;
    color: var(--ink-soft);
    border-radius: 6px;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease;
  }
  .top-nav ul a:hover { color: var(--ink); }
  .top-nav ul a.active {
    color: var(--accent);
    font-weight: 700;
    border-bottom-color: var(--accent);
    border-radius: 6px 6px 0 0;
  }

  /* ========== 공통 레이아웃 ========== */
  .wrap {
    max-width: 880px;
    margin: 0 auto;
    padding: 0 20px;
  }
  section { padding: 88px 0; }
  .section-label {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin-bottom: 12px;
  }
  h2 {
    font-size: clamp(24px, 4vw, 32px);
    line-height: 1.35;
    margin-bottom: 40px;
  }

  /* ========== 첫 화면 (히어로) ========== */
  .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: var(--nav-h);
  }
  .hero .eyebrow {
    font-size: 15px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }
  .hero h1 {
    font-size: clamp(38px, 7vw, 64px);
    line-height: 1.25;
    letter-spacing: -0.01em;
    margin-bottom: 20px;
  }
  .hero .tagline {
    font-size: clamp(17px, 2.5vw, 21px);
    color: var(--ink-soft);
    max-width: 34em;
    margin-bottom: 12px;
  }
  .hero .for-whom {
    font-size: 15px;
    color: var(--ink-soft);
    background: #F3EBDF;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 8px 18px;
    display: inline-block;
    width: fit-content;
    margin-top: 10px;
  }
  .scroll-hint {
    margin-top: 56px;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
  .scroll-hint .arrow {
    display: inline-flex;
    width: 34px; height: 34px;
    border: 1.5px solid var(--ink);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    animation: bob 1.8s ease-in-out infinite;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(6px); }
  }
  .scroll-hint:hover .arrow { background: var(--line); }

  /* ========== 작업물 카드 ========== */
  .cards { display: grid; gap: 28px; }

  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(43, 35, 32, 0.08);
  }

  .card-toggle {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 0;
    -webkit-tap-highlight-color: rgba(181, 84, 59, 0.12);
  }

  /* 색 블록 + 타이포그래피 표지 (진짜 이미지로 교체 예정 자리) */
  .cover {
    aspect-ratio: 21 / 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-align: center;
    padding: 20px;
  }
  .cover .cover-title {
    font-size: clamp(26px, 5vw, 44px);
    font-weight: 800;
    letter-spacing: 0.04em;
  }
  .cover .cover-sub {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .cover-oat  { background: #E9B860; color: #4A3212; }
  .cover-moru { background: #4E5B44; color: #F3EEDC; }
  .cover-glow { background: linear-gradient(135deg, #F4C6C0, #EBA6A6); color: #6E323C; }

  .card-head { padding: 22px 24px; }
  .card-head .meta {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 6px;
  }
  .card-head h3 {
    font-size: 20px;
    line-height: 1.4;
    margin-bottom: 6px;
  }
  .card-head .summary {
    font-size: 15px;
    color: var(--ink-soft);
  }
  .card-head .open-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    font-size: 14px;
    font-weight: 700;
    color: var(--accent);
  }
  .card-head .chev {
    display: inline-block;
    transition: transform 0.3s ease;
  }
  .card.open .chev { transform: rotate(180deg); }
  .card.open .open-label .label-text::after { content: " 접기"; }
  .card:not(.open) .open-label .label-text::after { content: " 보기"; }

  /* 상세 펼침: grid-rows 0fr → 1fr 로 부드럽게 */
  .card-detail {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s ease;
  }
  .card-detail > .detail-inner {
    overflow: hidden;
    visibility: hidden;
    transition: visibility 0.45s;
  }
  .card.open .card-detail { grid-template-rows: 1fr; }
  .card.open .card-detail > .detail-inner { visibility: visible; }

  .detail-body {
    border-top: 1px solid var(--line);
    padding: 24px;
    display: grid;
    gap: 18px;
  }
  .detail-body h4 {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 6px;
  }
  .detail-body p { font-size: 15.5px; }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 24px 22px;
    list-style: none;
  }
  .tags li {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink-soft);
    background: #F3EBDF;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 4px 12px;
  }

  /* ========== 소개·강점 ========== */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  @media (max-width: 640px) {
    .about-grid { grid-template-columns: 1fr; }
  }
  .about-block {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 26px;
  }
  .about-block h3 {
    font-size: 16px;
    margin-bottom: 12px;
    color: var(--accent);
  }
  .about-block p, .about-block li { font-size: 15.5px; }
  .about-block ul { list-style: none; display: grid; gap: 8px; }
  .about-block li::before {
    content: "—";
    color: var(--accent);
    margin-right: 8px;
  }
  .about-lead {
    font-size: clamp(17px, 2.4vw, 20px);
    max-width: 36em;
    margin-bottom: 36px;
  }

  /* ========== 연락 ========== */
  .contact {
    text-align: center;
    padding-bottom: 120px;
  }
  .contact h2 { margin-bottom: 16px; }
  .contact .contact-lead {
    color: var(--ink-soft);
    max-width: 32em;
    margin: 0 auto 14px;
    font-size: 16.5px;
  }
  .contact .insta-line {
    font-size: 15.5px;
    margin-bottom: 36px;
  }
  .contact .insta-line a {
    color: var(--accent);
    font-weight: 700;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
  }
  .contact .insta-line a:hover { color: var(--accent-deep); }

  .cta {
    display: inline-block;
    background: var(--accent);
    color: #FFF8F2;
    text-decoration: none;
    font-size: clamp(17px, 2.6vw, 20px);
    font-weight: 800;
    padding: 20px 44px;
    border-radius: 999px;
    transition: background 0.2s ease, transform 0.2s ease;
    box-shadow: 0 8px 20px rgba(181, 84, 59, 0.28);
  }
  .cta:hover {
    background: var(--accent-deep);
    transform: translateY(-2px);
  }
  .cta:active { transform: translateY(0); }

  footer {
    border-top: 1px solid var(--line);
    padding: 28px 0;
    text-align: center;
    font-size: 13.5px;
    color: var(--ink-soft);
  }
</style>
</head>
<body>

<!-- ===== 상단 고정 메뉴 ===== -->
<nav class="top-nav" aria-label="페이지 메뉴">
  <a class="brand" href="#home">김하늘</a>
  <ul>
    <li><a href="#works" data-target="works">작업물</a></li>
    <li><a href="#about" data-target="about">소개</a></li>
    <li><a href="#contact" data-target="contact">연락</a></li>
  </ul>
</nav>

<main>
  <!-- ===== 첫 화면 ===== -->
  <section class="hero wrap" id="home">
    <p class="eyebrow reveal">BRAND &amp; GRAPHIC DESIGNER</p>
    <h1 class="reveal delay-1">김하늘<br>작은 브랜드의 얼굴을 만듭니다.</h1>
    <p class="tagline reveal delay-2">로고 · 패키지 · BI — 브랜드가 손님에게 처음 건네는 인상을 디자인합니다.</p>
    <p class="for-whom reveal delay-2">소규모 F&amp;B · 라이프스타일 브랜드 대표님과 함께합니다</p>
    <a class="scroll-hint reveal delay-2" href="#works">
      <span class="arrow" aria-hidden="true">↓</span>
      작업물 먼저 보기
    </a>
  </section>

  <!-- ===== 작업물 ===== -->
  <section class="wrap" id="works">
    <p class="section-label reveal">WORKS</p>
    <h2 class="reveal">브랜드의 얼굴이 된 작업들</h2>

    <div class="cards">

      <!-- 카드 1 · 오트오트 -->
      <article class="card reveal">
        <button class="card-toggle" type="button" aria-expanded="false" aria-controls="detail-oat">
          <!-- 여기에 실제 이미지 -->
          <div class="cover cover-oat" role="img" aria-label="오트오트 리브랜딩 표지">
            <span class="cover-title">오트오트</span>
            <span class="cover-sub">Granola Rebranding</span>
          </div>
          <div class="card-head">
            <p class="meta">2024 · 리브랜딩</p>
            <h3>수제 그래놀라 ‘오트오트’ 리브랜딩</h3>
            <p class="summary">로고부터 패키지 6종, 인스타 템플릿까지 혼자 처음부터 끝까지.</p>
            <span class="open-label"><span class="label-text">자세히</span> <span class="chev" aria-hidden="true">▾</span></span>
          </div>
        </button>
        <div class="card-detail" id="detail-oat">
          <div class="detail-inner">
            <div class="detail-body">
              <div>
                <h4>맡은 일</h4>
                <p>수제 그래놀라 브랜드 ‘오트오트’의 리브랜딩 전체 — 로고, 패키지 6종, 인스타그램 템플릿까지 혼자 진행했습니다.</p>
              </div>
              <div>
                <h4>어떻게 했는지</h4>
                <p>로고에서 출발해 패키지 6종, 인스타그램 템플릿까지 매대와 피드 어디서 만나도 같은 브랜드로 읽히도록, 기획부터 마무리까지 한 사람의 손에서 일관되게 완성했습니다.</p>
              </div>
              <div>
                <h4>결과</h4>
                <p>패키지 리뉴얼 후 와디즈 펀딩 1,800만 원을 달성했습니다. 대표님께서 재방문 구매도 늘었다고 전해 주셨습니다.</p>
              </div>
            </div>
            <ul class="tags">
              <li>로고</li><li>패키지 6종</li><li>인스타 템플릿</li><li>1인 진행</li>
            </ul>
          </div>
        </div>
      </article>

      <!-- 카드 2 · 카페 모루 -->
      <article class="card reveal">
        <button class="card-toggle" type="button" aria-expanded="false" aria-controls="detail-moru">
          <!-- 여기에 실제 이미지 -->
          <div class="cover cover-moru" role="img" aria-label="카페 모루 BI 표지">
            <span class="cover-title">모루</span>
            <span class="cover-sub">Cafe Brand Identity</span>
          </div>
          <div class="card-head">
            <p class="meta">2023 · BI</p>
            <h3>카페 ‘모루’ 브랜드 아이덴티티</h3>
            <p class="summary">로고, 간판, 메뉴판, 컵·포장 — 매장에서 손에 닿는 모든 것.</p>
            <span class="open-label"><span class="label-text">자세히</span> <span class="chev" aria-hidden="true">▾</span></span>
          </div>
        </button>
        <div class="card-detail" id="detail-moru">
          <div class="detail-inner">
            <div class="detail-body">
              <div>
                <h4>맡은 일</h4>
                <p>카페 ‘모루’의 BI 전체 — 로고, 간판, 메뉴판, 컵과 포장까지 일체로 디자인했습니다.</p>
              </div>
              <div>
                <h4>어떻게 했는지</h4>
                <p>길에서 보이는 간판부터 손에 쥐는 컵까지, 손님이 매장에서 만나는 모든 접점이 하나의 인상으로 이어지도록 아이덴티티를 묶어 완성했습니다.</p>
              </div>
              <div>
                <h4>결과</h4>
                <p>오픈 3개월 만에 지역 블로그와 인스타그램에 소개되기 시작했습니다.</p>
              </div>
            </div>
            <ul class="tags">
              <li>로고</li><li>간판</li><li>메뉴판</li><li>컵 · 포장</li>
            </ul>
          </div>
        </div>
      </article>

      <!-- 카드 3 · 글로우데이 -->
      <article class="card reveal">
        <button class="card-toggle" type="button" aria-expanded="false" aria-controls="detail-glow">
          <!-- 여기에 실제 이미지 -->
          <div class="cover cover-glow" role="img" aria-label="글로우데이 브랜드 리뉴얼 표지">
            <span class="cover-title">글로우데이</span>
            <span class="cover-sub">App Brand Renewal</span>
          </div>
          <div class="card-head">
            <p class="meta">2025 · 브랜드 리뉴얼 (인하우스)</p>
            <h3>뷰티 앱 ‘글로우데이’ 브랜드 리뉴얼</h3>
            <p class="summary">디자이너 2명과 함께 리뉴얼 리드 — 스토어의 첫인상을 다시 설계.</p>
            <span class="open-label"><span class="label-text">자세히</span> <span class="chev" aria-hidden="true">▾</span></span>
          </div>
        </button>
        <div class="card-detail" id="detail-glow">
          <div class="detail-inner">
            <div class="detail-body">
              <div>
                <h4>맡은 일</h4>
                <p>뷰티 앱 ‘글로우데이’의 브랜드 리뉴얼을 디자이너 2명과 함께 리드했습니다.</p>
              </div>
              <div>
                <h4>어떻게 했는지</h4>
                <p>앱스토어 스크린샷 일체와 온보딩 일러스트 12종을 제작해, 사용자가 앱을 처음 만나는 순간의 인상을 새 브랜드에 맞춰 정리했습니다.</p>
              </div>
              <div>
                <h4>결과</h4>
                <p>마케팅팀 집계 기준, 리뉴얼 후 스토어 전환율이 12% 개선되었습니다.</p>
              </div>
            </div>
            <ul class="tags">
              <li>리뉴얼 리드</li><li>스토어 스크린샷</li><li>온보딩 일러스트 12종</li>
            </ul>
          </div>
        </div>
      </article>

    </div>
  </section>

  <!-- ===== 소개·강점 ===== -->
  <section class="wrap" id="about">
    <p class="section-label reveal">ABOUT</p>
    <h2 class="reveal">로고부터 패키지, 온라인 콘텐츠까지<br>한 손에서 이어지게 만듭니다.</h2>
    <p class="about-lead reveal">브랜드 아이덴티티·패키지 디자인 5년차입니다. 에이전시에서 4년, 뷰티 스타트업 인하우스에서 1년을 보내며 작은 브랜드의 얼굴을 만드는 일을 해왔고, 지금은 프리랜서 전환을 준비하며 함께할 브랜드를 찾고 있습니다.</p>
    <div class="about-grid">
      <div class="about-block reveal">
        <h3>걸어온 길</h3>
        <ul>
          <li>브랜드 아이덴티티 · 패키지 디자인 5년차</li>
          <li>에이전시 4년 — 다양한 브랜드 프로젝트</li>
          <li>뷰티 스타트업 인하우스 1년 — 리뉴얼 리드</li>
          <li>프리랜서 전환 준비 중</li>
        </ul>
      </div>
      <div class="about-block reveal delay-1">
        <h3>다루는 도구</h3>
        <ul>
          <li>Illustrator</li>
          <li>Photoshop</li>
          <li>Figma</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ===== 연락 ===== -->
  <section class="wrap contact" id="contact">
    <p class="section-label reveal">CONTACT</p>
    <h2 class="reveal">브랜드의 얼굴, 같이 만들어볼까요?</h2>
    <p class="contact-lead reveal">브랜딩이나 패키지를 맡길 디자이너를 찾고 계시다면, 편하게 문의 주세요. 지금 준비 중인 이야기를 들려주시면 제가 어떻게 도울 수 있을지 답장으로 정리해 드리겠습니다.</p>
    <p class="insta-line reveal">인스타그램 <a href="https://www.instagram.com/haneul.design" target="_blank" rel="noopener">@haneul.design</a> DM도 언제든 열려 있습니다.</p>
    <a class="cta reveal delay-1" href="mailto:hello@haneulkim.design?subject=%EB%B8%8C%EB%9E%9C%EB%94%A9%20%EB%AC%B8%EC%9D%98">hello@haneulkim.design 로 문의 메일 보내기</a>
  </section>
</main>

<footer>
  김하늘 · hello@haneulkim.design · 인스타그램 @haneul.design
</footer>

<script>
(function () {
  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1) 스크롤 등장: 은은하게 떠오르기 ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    // 동작 줄이기 설정 또는 구형 브라우저: 애니메이션 없이 바로 표시
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('visible');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    for (var j = 0; j < reveals.length; j++) io.observe(reveals[j]);
  }

  /* ---- 2) 작업물 카드: 클릭/터치로 그 자리에서 펼침·접힘 ---- */
  var toggles = document.querySelectorAll('.card-toggle');
  for (var k = 0; k < toggles.length; k++) {
    toggles[k].addEventListener('click', function () {
      var card = this.closest('.card');
      var isOpen = card.classList.toggle('open');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---- 3) 고정 메뉴: 현재 보고 있는 섹션 표시 ---- */
  var navLinks = document.querySelectorAll('.top-nav a[data-target]');
  var sections = [];
  for (var m = 0; m < navLinks.length; m++) {
    var sec = document.getElementById(navLinks[m].getAttribute('data-target'));
    if (sec) sections.push({ link: navLinks[m], el: sec });
  }
  function updateActiveNav() {
    var pos = window.scrollY + 120;
    var currentLink = null;
    for (var n = 0; n < sections.length; n++) {
      if (sections[n].el.offsetTop <= pos) currentLink = sections[n].link;
    }
    // 페이지 맨 아래에 닿으면 마지막 섹션(연락)을 활성화
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      currentLink = sections.length ? sections[sections.length - 1].link : currentLink;
    }
    for (var p = 0; p < navLinks.length; p++) {
      navLinks[p].classList.toggle('active', navLinks[p] === currentLink);
    }
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();
})();
</script>
</body>
</html>
```

---

## 파일 여는 법 3단계

1. 위 코드를 전부 복사해서 **메모장**(맥이라면 '텍스트 편집기')에 붙여넣습니다.
2. **"포트폴리오.html"** 이라는 이름으로 저장합니다. (저장할 때 파일 형식을 '모든 파일'로 두고, 이름 끝이 반드시 `.html`로 끝나야 합니다.)
3. 저장한 파일을 **더블클릭**하면 브라우저에서 바로 열립니다. 인터넷이 없어도 작동합니다.

---

## 진짜 이미지로 바꾸는 법 (코드 몰라도 OK)

각 작업물 카드 안에는 `<!-- 여기에 실제 이미지 -->` 라는 표시가 3군데 있습니다. 그 바로 아랫줄에 있는 색 블록을 내 사진으로 바꾸면 됩니다.

1. 포트폴리오에 넣을 사진(작업물 촬영 컷, 화면 캡처 등)을 **포트폴리오.html 파일과 같은 폴더**에 넣습니다. 예: `oatoat.jpg`
2. 메모장으로 포트폴리오.html을 다시 열고, `<!-- 여기에 실제 이미지 -->` 를 찾습니다. (메모장에서 Ctrl+F로 "여기에"를 검색하면 빠릅니다.)
3. 그 아래에 있는 `<div class="cover ...">` 부터 `</div>` 까지(색 블록 한 덩어리)를 지우고, 그 자리에 아래 한 줄을 넣습니다. 파일 이름만 내 사진 이름으로 바꾸세요.

```html
<img src="oatoat.jpg" alt="오트오트 패키지 사진" style="width:100%; aspect-ratio:21/9; object-fit:cover;">
```

4. 저장 후 파일을 다시 더블클릭해 사진이 잘 보이는지 확인합니다. 나머지 두 카드도 같은 방법으로 바꾸면 됩니다.

> 참고: 다른 사람에게 보낼 때는 **html 파일과 사진 파일을 같은 폴더에 담아 함께** 보내야 사진이 보입니다.

---

## 공유 전 체크리스트 4개

- [ ] 카드 3개를 전부 눌러서 상세가 펼쳐졌다 접히는지 확인했다.
- [ ] 맨 아래 연락 버튼을 눌러 메일 앱이 열리는지, 인스타 링크가 내 계정으로 가는지 확인했다.
- [ ] 휴대폰에서 파일을 열어 카드 펼침·메뉴 이동·연락 버튼이 터치로 잘 되는지 확인했다.
- [ ] 이름(김하늘), 메일(hello@haneulkim.design), 인스타(@haneul.design)에 오탈자가 없는지 확인했다.

---

## 검증 메모 — 열람자(대표님) 시점에서 찾은 망설임 지점 3가지와 수정

1. **"이 디자이너가 내 규모의 브랜드를 맡아줄까?"라는 첫 화면의 망설임** → 히어로에 "소규모 F&B·라이프스타일 브랜드 대표님과 함께합니다" 배지를 추가해, 첫 화면에서 바로 '내 얘기'로 읽히게 했습니다.
2. **수치의 출처가 없으면 오히려 의심이 생기는 지점** → 전환율 12%에는 "마케팅팀 집계 기준", 재방문 증가에는 "대표님께서 전해 주셨습니다"처럼 말할 수 있는 만큼만 담백하게 표기해, 미팅에서 그대로 답할 수 있는 페이지로 만들었습니다.
3. **연락 버튼을 눌러도 "메일에 뭐라고 쓰지?" 하고 닫아버리는 지점** → 메일 버튼에 제목("브랜딩 문의")이 미리 채워지게 하고, 연락 섹션에 "준비 중인 이야기를 들려주시면 답장으로 정리해 드리겠다"는 안내를 붙여 첫 문장의 부담을 낮췄습니다.

---

## 수정 요청 예시 문장 3개

1. "방금 그 파일에서 첫 화면 배경색만 남색으로 바꿔줘."
2. "작업물 카드 순서를 글로우데이가 맨 위로 오게 바꿔줘."
3. "연락 버튼 문구를 '지금 인스타 DM 보내기'로 바꾸고 인스타 링크로 연결해줘."
