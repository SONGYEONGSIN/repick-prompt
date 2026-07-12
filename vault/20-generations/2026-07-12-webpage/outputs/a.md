오트앤조이 소개 원페이지를 아래에 완성해 드렸습니다. 카피는 모두 실제 문장으로 채웠고, 빈칸은 하나도 없습니다. 모든 버튼은 스마트스토어(https://smartstore.naver.com/oatnjoy)로 실제 연결됩니다.

## 완성된 단일 HTML 파일

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>오트앤조이 — 덜 달게, 그래서 매일 아침</title>
  <style>
    :root {
      --bg: #faf6ef;
      --card: #ffffff;
      --ink: #3a332b;
      --ink-soft: #6f6558;
      --line: #e8ddcc;
      --accent: #b07a43;
      --accent-deep: #8a5c2d;
      --accent-soft: #f3e7d5;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      font-family: "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic",
        system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }

    .wrap {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ---------- 헤더 ---------- */
    header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(250, 246, 239, 0.9);
      backdrop-filter: saturate(120%) blur(8px);
      border-bottom: 1px solid var(--line);
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .brand {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    .brand span { color: var(--accent-deep); }

    .nav-cta {
      display: inline-block;
      padding: 9px 16px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #fff;
      background: var(--accent);
      border-radius: 999px;
      text-decoration: none;
      transition: background 0.2s ease;
    }

    .nav-cta:hover { background: var(--accent-deep); }

    /* ---------- 히어로 ---------- */
    .hero {
      padding: 88px 0 72px;
      text-align: center;
    }

    .eyebrow {
      display: inline-block;
      padding: 6px 14px;
      margin-bottom: 22px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-deep);
      background: var(--accent-soft);
      border-radius: 999px;
    }

    .hero h1 {
      font-size: clamp(1.9rem, 5.2vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.25;
      margin-bottom: 20px;
    }

    .hero h1 .hl { color: var(--accent-deep); }

    .hero p.sub {
      max-width: 560px;
      margin: 0 auto 34px;
      font-size: clamp(1rem, 2.6vw, 1.2rem);
      color: var(--ink-soft);
    }

    .btn-primary {
      display: inline-block;
      padding: 16px 34px;
      font-size: 1.05rem;
      font-weight: 800;
      color: #fff;
      background: var(--accent);
      border-radius: 999px;
      text-decoration: none;
      box-shadow: 0 10px 24px rgba(176, 122, 67, 0.28);
      transition: transform 0.15s ease, background 0.2s ease;
    }

    .btn-primary:hover {
      background: var(--accent-deep);
      transform: translateY(-2px);
    }

    .hero .note {
      display: block;
      margin-top: 16px;
      font-size: 0.86rem;
      color: var(--ink-soft);
    }

    /* ---------- 섹션 공통 ---------- */
    section { padding: 64px 0; }

    .section-head {
      text-align: center;
      margin-bottom: 44px;
    }

    .section-head h2 {
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }

    .section-head p {
      color: var(--ink-soft);
      font-size: 1.02rem;
    }

    /* ---------- 핵심 가치 3가지 ---------- */
    .values {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .value-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 32px 26px;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .value-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 30px rgba(58, 51, 43, 0.08);
    }

    .value-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin-bottom: 18px;
      font-size: 1.4rem;
      background: var(--accent-soft);
      border-radius: 14px;
    }

    .value-card h3 {
      font-size: 1.18rem;
      font-weight: 800;
      margin-bottom: 10px;
      letter-spacing: -0.01em;
    }

    .value-card p {
      color: var(--ink-soft);
      font-size: 0.98rem;
    }

    /* ---------- 라인업 ---------- */
    .lineup {
      background: var(--accent-soft);
      border-radius: 24px;
    }

    .flavors {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .flavor {
      background: var(--card);
      border-radius: 16px;
      padding: 26px 22px;
      text-align: center;
    }

    .flavor .dot {
      width: 40px;
      height: 40px;
      margin: 0 auto 14px;
      border-radius: 50%;
    }

    .flavor.orig .dot { background: #d9b382; }
    .flavor.cacao .dot { background: #7c5236; }
    .flavor.berry .dot { background: #b5657f; }

    .flavor h4 {
      font-size: 1.08rem;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .flavor p {
      font-size: 0.92rem;
      color: var(--ink-soft);
    }

    /* ---------- 후기 ---------- */
    .proof {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 24px;
      align-items: stretch;
    }

    .stat-card,
    .review-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 36px 32px;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }

    .stat-num {
      font-size: clamp(2.6rem, 8vw, 3.4rem);
      font-weight: 800;
      color: var(--accent-deep);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat-label {
      margin-top: 12px;
      color: var(--ink-soft);
      font-size: 1rem;
    }

    .review-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .review-card .quote {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.5;
    }

    .review-card .who {
      margin-top: 16px;
      color: var(--ink-soft);
      font-size: 0.92rem;
    }

    /* ---------- 마무리 CTA ---------- */
    .final {
      text-align: center;
      background: var(--ink);
      border-radius: 24px;
      padding: 60px 28px;
      color: #f6efe4;
    }

    .final h2 {
      font-size: clamp(1.6rem, 4.4vw, 2.2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
      color: #fff;
    }

    .final p {
      max-width: 520px;
      margin: 0 auto 30px;
      color: #cfc4b2;
      font-size: 1.05rem;
    }

    /* ---------- 푸터 ---------- */
    footer {
      padding: 40px 0 56px;
      text-align: center;
      color: var(--ink-soft);
      font-size: 0.88rem;
    }

    footer a {
      color: var(--accent-deep);
      font-weight: 700;
      text-decoration: none;
    }

    footer a:hover { text-decoration: underline; }

    /* ---------- 반응형 ---------- */
    @media (max-width: 720px) {
      .values,
      .flavors { grid-template-columns: 1fr; }
      .proof { grid-template-columns: 1fr; }
      .nav-cta { display: none; }
      .hero { padding: 64px 0 52px; }
      section { padding: 48px 0; }
    }
  </style>
</head>
<body>
  <!-- 헤더 -->
  <header>
    <div class="wrap nav">
      <div class="brand">오트앤<span>조이</span></div>
      <a class="nav-cta" href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">구매하기</a>
    </div>
  </header>

  <!-- 히어로 (첫 화면) -->
  <section class="hero">
    <div class="wrap">
      <span class="eyebrow">무설탕·저당 수제 그래놀라</span>
      <h1>덜 달아서 물리지 않는<br /><span class="hl">아침 한 그릇</span></h1>
      <p class="sub">설탕 대신 알룰로스로 단맛을 낸 수제 그래놀라. 대충 때우던 아침을 덜 달고 담백하게 바꿔 드립니다.</p>
      <a class="btn-primary" href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">스마트스토어에서 구매하기</a>
      <span class="note">주 1회 소량 로스팅 · 오리지널 · 카카오 · 베리 3종</span>
    </div>
  </section>

  <!-- 핵심 가치 3가지 -->
  <section>
    <div class="wrap">
      <div class="section-head">
        <h2>오트앤조이가 아침에 진심인 이유</h2>
        <p>단맛은 덜고, 매일 먹어도 부담 없게 만들었습니다.</p>
      </div>
      <div class="values">
        <div class="value-card">
          <div class="value-icon">🌿</div>
          <h3>설탕 대신 알룰로스</h3>
          <p>정제 설탕 없이 알룰로스로만 은은하게 달콤하게. 다이어트 중이라 단맛이 아쉬웠다면 딱 맞는 당도입니다.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">🔥</div>
          <h3>주 1회 소량 로스팅</h3>
          <p>대량으로 쌓아두지 않고 주 1회만 소량으로 굽습니다. 눅눅하지 않은, 갓 구운 바삭함 그대로 보내드려요.</p>
        </div>
        <div class="value-card">
          <div class="value-icon">⏱️</div>
          <h3>바쁜 아침 3분 완성</h3>
          <p>우유나 요거트에 부으면 끝. 아침을 대충 때우던 직장인도 부담 없이 챙겨 먹는 담백한 한 끼입니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 라인업 3종 -->
  <section>
    <div class="wrap lineup" style="padding: 48px 32px;">
      <div class="section-head">
        <h2>취향대로 고르는 3종</h2>
        <p>질리지 않게, 그날 기분 따라 골라 드세요.</p>
      </div>
      <div class="flavors">
        <div class="flavor orig">
          <div class="dot"></div>
          <h4>오리지널</h4>
          <p>오트 본연의 고소함을 살린 가장 담백한 기본 맛.</p>
        </div>
        <div class="flavor cacao">
          <div class="dot"></div>
          <h4>카카오</h4>
          <p>설탕 없이도 진한 카카오 향. 달콤함이 그리울 때.</p>
        </div>
        <div class="flavor berry">
          <div class="dot"></div>
          <h4>베리</h4>
          <p>새콤한 베리를 더해 상큼하게. 요거트와 특히 잘 어울려요.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 후기·실적 (주어진 자료만 사용) -->
  <section>
    <div class="wrap">
      <div class="section-head">
        <h2>먼저 드셔본 분들의 이야기</h2>
        <p>한 번 사고 마는 게 아니라, 다시 찾는 이유가 있습니다.</p>
      </div>
      <div class="proof">
        <div class="stat-card">
          <div class="stat-num">40%</div>
          <div class="stat-label">재구매율</div>
        </div>
        <div class="review-card">
          <p class="quote">"시판 그래놀라보다 덜 달아서 물리지 않아요."</p>
          <p class="who">— 실제 고객 후기</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 마무리 CTA -->
  <section>
    <div class="wrap">
      <div class="final">
        <h2>내일 아침, 덜 달게 시작해보세요</h2>
        <p>주 1회 소량으로만 굽는 만큼 준비된 수량이 넉넉하지 않습니다. 오늘의 아침을 오트앤조이로 바꿔보세요.</p>
        <a class="btn-primary" href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">스마트스토어에서 구매하기</a>
      </div>
    </div>
  </section>

  <!-- 푸터 -->
  <footer>
    <div class="wrap">
      <p>오트앤조이 · 무설탕 저당 수제 그래놀라</p>
      <p style="margin-top:6px;">
        <a href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">스마트스토어 바로가기 →</a>
      </p>
    </div>
  </footer>
</body>
</html>
```

## 이 파일을 여는 방법

1. 위 코드를 `<!DOCTYPE html>`부터 `</html>`까지 전체 복사합니다.
2. 메모장이나 텍스트 편집기에 붙여넣고 "오트앤조이.html"로 저장합니다.
3. 저장한 파일을 더블클릭하면 브라우저에서 바로 열립니다.

## 게시 전 확인 체크리스트

- [ ] 버튼을 눌러 스마트스토어(https://smartstore.naver.com/oatnjoy)로 실제 연결되는지 확인했나요?
- [ ] 오탈자나 어색한 문장은 없는지 처음부터 끝까지 읽어봤나요?
- [ ] 휴대폰 화면에서도 글자와 버튼이 무너지지 않고 잘 보이나요?
- [ ] 지어낸 실적이나 과장 문구 없이, 주어진 사실(재구매율 40%·실제 후기)만 담겼나요?
