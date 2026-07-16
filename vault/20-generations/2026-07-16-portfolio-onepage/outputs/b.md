# 김하늘 포트폴리오 — 완성된 단일 HTML 파일

아래 코드 전체를 복사해 사용하시면 됩니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>김하늘 — 작은 F&B 브랜드의 얼굴을 만드는 브랜드 디자이너</title>
<style>
  /* ---------- 기본 리셋 & 변수 ---------- */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #FAF6F0;          /* 따뜻한 크림 배경 */
    --ink: #2B2620;          /* 짙은 갈색-검정 본문 */
    --ink-soft: #6E655A;     /* 부드러운 회갈색 보조 텍스트 */
    --accent: #C4622D;       /* 따뜻한 테라코타 포인트 */
    --accent-soft: #E8C4A8;  /* 연한 살구 */
    --card: #FFFFFF;
    --line: #E5DCCF;
    --oat: #D9A441;          /* 오트오트 — 그래놀라 골드 */
    --oat-bg: #F5E7CB;
    --moru: #5B6B5A;         /* 카페 모루 — 차분한 세이지 그린 */
    --moru-bg: #E4E9E1;
    --glow: #C96A83;         /* 글로우데이 — 뷰티 로즈 */
    --glow-bg: #F6E3E8;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
  }

  section { padding: 0 24px; }
  .inner { max-width: 760px; margin: 0 auto; }

  /* ---------- 첫 화면 ---------- */
  .hero {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    padding: 48px 24px;
  }

  .hero-name {
    font-size: clamp(15px, 2.4vw, 18px);
    letter-spacing: 0.35em;
    text-indent: 0.35em;
    color: var(--accent);
    font-weight: 700;
    margin-bottom: 28px;
  }

  .hero-title {
    font-size: clamp(28px, 6vw, 48px);
    font-weight: 800;
    line-height: 1.4;
    max-width: 640px;
  }

  .hero-title em {
    font-style: normal;
    color: var(--accent);
  }

  .hero-scroll {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: var(--ink-soft);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.25s;
  }

  .hero-scroll:hover { color: var(--accent); }

  .hero-scroll .arrow {
    width: 1px;
    height: 44px;
    background: currentColor;
    position: relative;
  }

  .hero-scroll .arrow::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -4px;
    width: 9px;
    height: 9px;
    border-right: 1px solid currentColor;
    border-bottom: 1px solid currentColor;
    transform: rotate(45deg);
  }

  /* ---------- 섹션 공통 ---------- */
  .section-lead {
    padding-top: 96px;
    margin-bottom: 40px;
  }

  .section-lead h2 {
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 800;
    margin-bottom: 12px;
  }

  .section-lead p {
    color: var(--ink-soft);
    font-size: clamp(15px, 2.5vw, 17px);
    max-width: 560px;
  }

  /* ---------- 대표 작업 카드 ---------- */
  .works { padding-bottom: 40px; }

  .work-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 28px;
    transition: box-shadow 0.25s, transform 0.25s;
  }

  .work-card:hover {
    box-shadow: 0 8px 32px rgba(43, 38, 32, 0.09);
  }

  /* 카드 상단 비주얼 — 색·타이포·도형만으로 구성 */
  .work-visual {
    height: 190px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .visual-oat { background: var(--oat-bg); }
  .visual-moru { background: var(--moru-bg); }
  .visual-glow { background: var(--glow-bg); }

  .visual-mark {
    font-weight: 800;
    letter-spacing: 0.08em;
    z-index: 2;
    text-align: center;
  }

  .visual-oat .visual-mark { color: var(--oat); font-size: clamp(26px, 5vw, 36px); }
  .visual-moru .visual-mark { color: var(--moru); font-size: clamp(26px, 5vw, 36px); }
  .visual-glow .visual-mark { color: var(--glow); font-size: clamp(26px, 5vw, 36px); }

  .visual-sub {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-indent: 0.3em;
    margin-top: 8px;
    opacity: 0.75;
  }

  /* 오트오트: 그래놀라 알갱이를 연상시키는 점 패턴 */
  .visual-oat::before, .visual-oat::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: var(--oat);
    opacity: 0.22;
  }
  .visual-oat::before { width: 160px; height: 160px; top: -60px; left: -40px; }
  .visual-oat::after { width: 110px; height: 110px; bottom: -40px; right: -20px; }

  .dot {
    position: absolute;
    border-radius: 50%;
    background: var(--oat);
    opacity: 0.35;
  }
  .dot1 { width: 14px; height: 14px; top: 30%; right: 18%; }
  .dot2 { width: 9px; height: 9px; bottom: 26%; left: 22%; }
  .dot3 { width: 11px; height: 11px; top: 22%; left: 34%; }

  /* 카페 모루: 컵과 간판을 연상시키는 기하 도형 */
  .visual-moru::before {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border: 1.5px solid var(--moru);
    border-radius: 50%;
    opacity: 0.25;
    top: -80px;
    right: -60px;
  }
  .visual-moru::after {
    content: "";
    position: absolute;
    width: 90px;
    height: 90px;
    background: var(--moru);
    opacity: 0.15;
    border-radius: 12px;
    transform: rotate(12deg);
    bottom: -30px;
    left: 8%;
  }

  /* 글로우데이: 화면(스크린) 프레임을 연상시키는 라운드 사각 */
  .visual-glow::before {
    content: "";
    position: absolute;
    width: 120px;
    height: 220px;
    border: 1.5px solid var(--glow);
    border-radius: 28px;
    opacity: 0.3;
    transform: rotate(-14deg);
    top: -30px;
    left: 6%;
  }
  .visual-glow::after {
    content: "";
    position: absolute;
    width: 150px;
    height: 150px;
    background: var(--glow);
    opacity: 0.12;
    border-radius: 50%;
    bottom: -60px;
    right: -30px;
  }

  /* 카드 본문 */
  .work-body { padding: 28px 28px 8px; }

  .work-meta {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--ink-soft);
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .work-name {
    font-size: clamp(20px, 3.5vw, 24px);
    font-weight: 800;
    margin-bottom: 14px;
  }

  .work-hook {
    font-size: clamp(15px, 2.6vw, 17px);
    line-height: 1.75;
    margin-bottom: 20px;
  }

  .work-hook strong { color: var(--accent); font-weight: 700; }

  /* 펼치기 버튼 */
  .work-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    border-top: 1px solid var(--line);
    padding: 18px 28px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 700;
    color: var(--accent);
    cursor: pointer;
    transition: background 0.2s;
  }

  .work-toggle:hover { background: #FBF4EC; }

  .work-toggle .chev {
    width: 10px;
    height: 10px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.3s;
    flex-shrink: 0;
    margin-left: 12px;
  }

  .work-card.open .work-toggle .chev { transform: rotate(-135deg); }

  /* 펼쳐지는 상세 */
  .work-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.45s ease;
  }

  .work-detail-inner {
    padding: 8px 28px 32px;
    border-top: 1px dashed var(--line);
  }

  .detail-row { margin-top: 20px; }

  .detail-label {
    display: inline-block;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #fff;
    background: var(--ink);
    border-radius: 999px;
    padding: 4px 14px;
    margin-bottom: 10px;
  }

  .detail-row p {
    font-size: 15px;
    color: var(--ink);
    line-height: 1.8;
  }

  .detail-note {
    font-size: 13.5px;
    color: var(--ink-soft);
    margin-top: 6px;
  }

  /* ---------- 일하는 방식 ---------- */
  .how { padding-bottom: 40px; }

  .how-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .how-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 26px;
  }

  .how-card h3 {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 10px;
    color: var(--accent);
  }

  .how-card p {
    font-size: 15px;
    line-height: 1.8;
  }

  .tool-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .tool-tags span {
    font-size: 13px;
    font-weight: 600;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 5px 14px;
    background: var(--bg);
  }

  .career-line {
    margin-top: 20px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 26px;
  }

  .career-line h3 {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 14px;
    color: var(--accent);
  }

  .career-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .career-step {
    display: flex;
    align-items: baseline;
    gap: 14px;
    font-size: 15px;
  }

  .career-step .years {
    flex-shrink: 0;
    font-weight: 800;
    font-size: 13px;
    color: var(--ink-soft);
    letter-spacing: 0.05em;
    min-width: 52px;
  }

  /* ---------- 연락 ---------- */
  .contact {
    padding-top: 96px;
    padding-bottom: 120px;
    text-align: center;
  }

  .contact h2 {
    font-size: clamp(24px, 5vw, 34px);
    font-weight: 800;
    margin-bottom: 16px;
  }

  .contact > .inner > p {
    color: var(--ink-soft);
    font-size: clamp(15px, 2.6vw, 17px);
    max-width: 480px;
    margin: 0 auto 36px;
  }

  .contact-btn {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    font-size: 17px;
    font-weight: 800;
    text-decoration: none;
    padding: 18px 48px;
    border-radius: 999px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(196, 98, 45, 0.3);
  }

  .contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(196, 98, 45, 0.4);
  }

  .contact-sub {
    margin-top: 28px;
    font-size: 15px;
    color: var(--ink-soft);
  }

  .contact-sub a {
    color: var(--ink);
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1.5px solid var(--accent-soft);
    padding-bottom: 1px;
  }

  .contact-sub a:hover { border-bottom-color: var(--accent); }

  footer {
    text-align: center;
    padding: 0 24px 48px;
    font-size: 13px;
    color: var(--ink-soft);
  }

  /* ---------- 모바일 ---------- */
  @media (max-width: 640px) {
    .how-grid { grid-template-columns: 1fr; }
    .work-body { padding: 24px 20px 8px; }
    .work-toggle { padding: 16px 20px; }
    .work-detail-inner { padding: 8px 20px 28px; }
    .work-visual { height: 160px; }
  }
</style>
</head>
<body>

<!-- ========== 첫 화면 ========== -->
<section class="hero">
  <div class="hero-name">KIM HANEUL &middot; 김하늘</div>
  <h1 class="hero-title">작은 F&amp;B 브랜드의 얼굴을 만드는<br><em>5년차 브랜드 디자이너</em>입니다.</h1>
  <a class="hero-scroll" href="#works">
    대표 작업 보기
    <span class="arrow"></span>
  </a>
</section>

<!-- ========== 대표 작업 ========== -->
<section class="works" id="works">
  <div class="inner">
    <div class="section-lead">
      <h2>대표 작업</h2>
      <p>로고 한 장이 아니라, 패키지·간판·화면까지 브랜드가 손님을 만나는 모든 접점을 만들었습니다. 카드를 누르면 맡은 역할과 과정, 결과를 자세히 볼 수 있습니다.</p>
    </div>

    <!-- 작업 1: 오트오트 -->
    <article class="work-card" id="card-oat">
      <div class="work-visual visual-oat" aria-hidden="true">
        <span class="dot dot1"></span><span class="dot dot2"></span><span class="dot dot3"></span>
        <div class="visual-mark">OATOAT<span class="visual-sub">GRANOLA REBRANDING</span></div>
      </div>
      <div class="work-body">
        <div class="work-meta">2024 &middot; 리브랜딩 &middot; 단독 진행</div>
        <h3 class="work-name">오트오트 — 수제 그래놀라 리브랜딩</h3>
        <p class="work-hook">패키지를 새로 입힌 뒤 <strong>와디즈 펀딩 1,800만 원</strong>을 달성했고, 대표님으로부터 재방문 구매도 늘었다는 이야기를 들은 프로젝트입니다. 작은 브랜드가 가진 이야기를 로고부터 인스타 템플릿까지 하나의 얼굴로 이어지게 만들었습니다.</p>
      </div>
      <button class="work-toggle" aria-expanded="false" aria-controls="detail-oat" onclick="toggleCard('card-oat')">
        역할 &middot; 과정 &middot; 결과 자세히 보기 <span class="chev"></span>
      </button>
      <div class="work-detail" id="detail-oat">
        <div class="work-detail-inner">
          <div class="detail-row">
            <span class="detail-label">맡은 역할</span>
            <p>로고, 패키지 6종, 인스타그램 템플릿까지 브랜드의 시각 접점 전체를 혼자 진행했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">과정</span>
            <p>수제 그래놀라라는 제품의 성격이 매대와 피드에서 한눈에 전해지도록, 로고 &rarr; 패키지 &rarr; SNS 템플릿이 한 사람 손에서 일관되게 이어지는 작업으로 설계했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">결과</span>
            <p>패키지 리뉴얼 후 와디즈 펀딩 1,800만 원 달성.</p>
            <p class="detail-note">대표님에 따르면 재방문 구매도 늘었다고 합니다 (수치로 집계된 자료는 없습니다).</p>
          </div>
        </div>
      </div>
    </article>

    <!-- 작업 2: 카페 모루 -->
    <article class="work-card" id="card-moru">
      <div class="work-visual visual-moru" aria-hidden="true">
        <div class="visual-mark">MORU<span class="visual-sub">CAFE BRAND IDENTITY</span></div>
      </div>
      <div class="work-body">
        <div class="work-meta">2023 &middot; BI &middot; 공간 브랜딩 일체</div>
        <h3 class="work-name">카페 모루 — 브랜드 아이덴티티</h3>
        <p class="work-hook">오픈 <strong>3개월 만에 지역 블로그와 인스타그램에 다수 소개</strong>된 카페입니다. 로고에서 간판, 메뉴판, 컵과 포장까지 손님이 만나는 모든 지점을 하나의 인상으로 통일해, 공간 자체가 사진이 잘 나오는 브랜드가 되도록 만들었습니다.</p>
      </div>
      <button class="work-toggle" aria-expanded="false" aria-controls="detail-moru" onclick="toggleCard('card-moru')">
        역할 &middot; 과정 &middot; 결과 자세히 보기 <span class="chev"></span>
      </button>
      <div class="work-detail" id="detail-moru">
        <div class="work-detail-inner">
          <div class="detail-row">
            <span class="detail-label">맡은 역할</span>
            <p>로고, 간판, 메뉴판, 컵&middot;포장 일체를 디자인했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">과정</span>
            <p>카페는 손님이 브랜드를 "공간으로" 경험합니다. 그래서 로고 단품이 아니라 간판&middot;메뉴판&middot;컵&middot;포장이 한 공간 안에서 서로를 받쳐주도록 일체로 설계했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">결과</span>
            <p>오픈 3개월 만에 지역 블로그&middot;인스타그램에 다수 소개되었고, 공간 사진이 잘 나온 프로젝트로 남았습니다.</p>
            <p class="detail-note">소개 건수를 따로 집계하지는 않았습니다.</p>
          </div>
        </div>
      </div>
    </article>

    <!-- 작업 3: 글로우데이 -->
    <article class="work-card" id="card-glow">
      <div class="work-visual visual-glow" aria-hidden="true">
        <div class="visual-mark">GLOWDAY<span class="visual-sub">BRAND RENEWAL &middot; IN-HOUSE</span></div>
      </div>
      <div class="work-body">
        <div class="work-meta">2025 &middot; 인하우스 &middot; 리뉴얼 리드</div>
        <h3 class="work-name">글로우데이 — 브랜드 리뉴얼</h3>
        <p class="work-hook">리뉴얼 후 마케팅팀으로부터 <strong>전환율이 12% 개선되었다</strong>는 피드백을 받은 프로젝트입니다. 디자이너 2명과 함께한 팀 작업으로, 저는 리뉴얼 방향을 잡는 리드를 맡았습니다 — 혼자 한 일과 함께 한 일을 구분해 말씀드리는 것이 제 원칙입니다.</p>
      </div>
      <button class="work-toggle" aria-expanded="false" aria-controls="detail-glow" onclick="toggleCard('card-glow')">
        역할 &middot; 과정 &middot; 결과 자세히 보기 <span class="chev"></span>
      </button>
      <div class="work-detail" id="detail-glow">
        <div class="work-detail-inner">
          <div class="detail-row">
            <span class="detail-label">맡은 역할</span>
            <p>디자이너 2명과 함께 리뉴얼을 리드했고, 앱스토어 스크린샷 일체와 온보딩 일러스트 12종을 작업했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">과정</span>
            <p>셋이 함께한 작업입니다. 저는 리드로서 방향을 잡고, 사용자가 브랜드를 처음 만나는 앱스토어 스크린샷과 온보딩 화면을 직접 담당했습니다.</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">결과</span>
            <p>마케팅팀 피드백 기준 전환율 12% 개선.</p>
            <p class="detail-note">측정 기간은 제가 정확히 기억하지 못해, 미팅에서 물어보시면 당시 자료 기준으로 확인해 드리겠습니다.</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>

<!-- ========== 일하는 방식과 강점 ========== -->
<section class="how">
  <div class="inner">
    <div class="section-lead">
      <h2>일하는 방식</h2>
      <p>"예쁜 디자인"보다 "그 브랜드에 맞는 디자인"을 만드는 것이 제 일이라고 생각합니다.</p>
    </div>
    <div class="how-grid">
      <div class="how-card">
        <h3>주 종목</h3>
        <p>브랜드 아이덴티티와 패키지가 주 종목입니다. 위 세 작업 모두 로고 한 장이 아니라 패키지&middot;간판&middot;화면까지, 브랜드가 손님을 만나는 접점 전체를 다뤘습니다.</p>
        <div class="tool-tags">
          <span>Illustrator</span><span>Photoshop</span><span>Figma</span>
        </div>
      </div>
      <div class="how-card">
        <h3>제 역할을 분명히 말합니다</h3>
        <p>팀 작업에서는 제가 한 일과 함께 한 일을 구분해서 말하려고 합니다. 글로우데이도 제가 리드였지만 셋이 같이 한 작업이라고 말씀드리는 이유입니다. 포트폴리오에서 과장한 한 줄은 미팅에서 반드시 돌아온다고 믿기 때문입니다.</p>
      </div>
    </div>
    <div class="career-line">
      <h3>경력</h3>
      <div class="career-steps">
        <div class="career-step"><span class="years">4년</span><span>에이전시 — 브랜드&middot;패키지 디자인</span></div>
        <div class="career-step"><span class="years">1년</span><span>뷰티 스타트업 인하우스 (글로우데이)</span></div>
        <div class="career-step"><span class="years">현재</span><span>프리랜서 전환 준비 중 — 새 프로젝트를 맡을 수 있습니다</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 연락 ========== -->
<section class="contact" id="contact">
  <div class="inner">
    <h2>우리 브랜드 이야기를 들려주세요</h2>
    <p>어떤 브랜드인지, 어떤 고민이 있는지 편하게 적어 보내주세요. 읽고 답장드리겠습니다.</p>
    <a class="contact-btn" href="mailto:hello@haneulkim.design?subject=%5B%EB%B8%8C%EB%9E%9C%EB%94%A9%20%EB%AC%B8%EC%9D%98%5D%20&body=%EB%B8%8C%EB%9E%9C%EB%93%9C%20%EC%9D%B4%EB%A6%84%3A%0A%ED%95%98%EA%B3%A0%20%EA%B3%84%EC%8B%A0%20%EC%9D%BC%3A%0A%EA%B3%A0%EB%AF%BC%EC%9D%B4%EB%82%98%20%ED%95%84%EC%9A%94%ED%95%9C%20%EC%9E%91%EC%97%85%3A%0A">이메일로 문의하기</a>
    <p class="contact-sub">
      hello@haneulkim.design &nbsp;&middot;&nbsp;
      인스타그램 <a href="https://instagram.com/haneul.design" target="_blank" rel="noopener">@haneul.design</a>
    </p>
  </div>
</section>

<footer>&copy; 김하늘 &middot; Brand Designer</footer>

<script>
  function toggleCard(cardId) {
    var card = document.getElementById(cardId);
    var detail = card.querySelector('.work-detail');
    var toggle = card.querySelector('.work-toggle');
    var isOpen = card.classList.contains('open');

    if (isOpen) {
      detail.style.maxHeight = '0';
      card.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      detail.style.maxHeight = detail.scrollHeight + 'px';
      card.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  // 화면 크기가 바뀌면 열린 카드 높이를 다시 계산 (모바일 회전 대응)
  window.addEventListener('resize', function () {
    document.querySelectorAll('.work-card.open .work-detail').forEach(function (d) {
      d.style.maxHeight = d.scrollHeight + 'px';
    });
  });
</script>

</body>
</html>
```

---

## 여는 법과 보내는 법 (코드를 몰라도 됩니다)

1. 위 코드 전체를 복사해서 **메모장(Windows) 또는 텍스트 편집기(Mac)**에 붙여넣습니다.
2. 파일을 저장할 때 이름을 **"포트폴리오.html"** 로 지정해 저장합니다. (저장 시 파일 형식이 "텍스트"로 되어 있다면 "모든 파일"로 바꾸고 이름 끝에 .html을 꼭 붙이세요.)
3. 저장된 파일을 **더블클릭**하면 브라우저에서 포트폴리오가 열립니다. 처음부터 끝까지 한 번 확인하세요.
4. 확인이 끝나면 그 파일을 **이메일이나 메신저에 첨부해서 그대로 보내면** 됩니다. 받은 사람도 더블클릭만 하면 열립니다.

---

## 자기검증 메모 (페이지 본문과 분리)

의뢰를 고민하는 소규모 F&B 브랜드 대표의 눈으로 처음부터 끝까지 읽고, "왜 이 사람에게 안 맡길까" 싶은 저항 지점 2곳을 찾아 고쳤습니다. 두 곳 모두 새 사실을 추가하지 않고 배치와 표현만 바꿔 해소했습니다.

**저항 1 — "측정 기간은 기억 안 남"**
- 걸린 문구(원문 인용): "마케팅팀이 전환율 12% 개선됐다고 함 (측정 기간은 기억 안 남)"
- 볼 사람이 느꼈을 저항: "기억 안 남"을 그대로 쓰면 수치 자체가 무성의하게 들리고, 12%라는 숫자까지 의심스러워진다. 반대로 괄호를 통째로 빼면 검증 질문("어느 기간이요?")에서 더 크게 무너진다.
- 어떻게 고쳤나: 수치의 출처를 "마케팅팀 피드백 기준"으로 명시해 본문에 두고, 한계는 "측정 기간은 제가 정확히 기억하지 못해, 미팅에서 물어보시면 당시 자료 기준으로 확인해 드리겠습니다"라는 확인 가능한 태도의 문장으로 바꿨다. 숨기지도 부풀리지도 않고, 미팅으로 이어지는 문장으로만 표현을 바꿨다.

**저항 2 — "강점 사례가 바로 안 떠오르는데"**
- 걸린 문구(원문 인용): "강점 사례가 바로 안 떠오르는데, 팀 작업에서는 내 역할을 분명히 말하려고 하는 편"
- 볼 사람이 느꼈을 저항: 강점 섹션이 "글쎄요…"처럼 읽히면, 대표 작업에서 쌓인 신뢰가 여기서 꺾인다. 자기 강점을 설명 못 하는 사람에게 브랜드 설명을 맡기고 싶지 않다.
- 어떻게 고쳤나: 새 강점을 지어내는 대신, 입력에 이미 있는 태도("내 역할을 분명히 말하려고 하는 편"과 글로우데이 사례)를 "제 역할을 분명히 말합니다"라는 단정형 제목의 카드로 승격시켰다. 근거도 입력에 있는 글로우데이("리드였지만 셋이 같이 한 작업") 그대로다. 배치와 표현만 바꿔, 망설임이 아니라 정직함이라는 강점으로 읽히게 했다.

---

## 나중에 실제 작업 사진을 넣고 싶을 때 AI에게 요청할 예시 문장 2개

1. "내 포트폴리오 HTML 파일을 첨부할게. 오트오트 카드의 색 도형 영역을, 같은 폴더에 있는 'oatoat.jpg' 사진으로 바꿔줘. 사진과 HTML 파일을 같은 폴더에 두고 더블클릭하면 열리게 해줘."
2. "포트폴리오 HTML을 줄게. 카페 모루 카드를 눌러 펼쳤을 때 상세 설명 아래에 사진 2장('moru1.jpg', 'moru2.jpg')이 나란히 보이게 추가해줘. 휴대폰에서는 세로로 쌓이게 해줘."

---

## 보내기 전 셀프 체크 3개

1. **연락 버튼이 실제로 눌리는지** — "이메일로 문의하기" 버튼을 눌러서 이메일 작성 창이 열리는지, 받는 사람 주소가 hello@haneulkim.design으로 들어가 있는지 확인하세요.
2. **휴대폰에서 깨지지 않는지** — 파일을 본인 휴대폰으로 보내서 열어보고, 글자가 잘리거나 카드가 화면 밖으로 나가지 않는지, 카드 펼치기가 손가락으로 잘 눌리는지 확인하세요.
3. **오탈자가 없는지** — 이름, 이메일 주소, 인스타그램 아이디, 프로젝트명(오트오트/카페 모루/글로우데이)과 숫자(1,800만 원, 12%, 6종, 12종)를 소리 내어 읽으며 확인하세요.
