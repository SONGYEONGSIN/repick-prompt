# 오트앤조이 원페이지 랜딩페이지

## 첫 화면 헤드라인 후보 3개

1. **(결과 강조형)** 덜 단데 물리지 않는 아침, 3일이면 갓 구운 그래놀라가 도착합니다
2. **(고민 공감형)** 아침은 챙기고 싶은데 시간은 없고, 시판 그래놀라는 너무 달죠
3. **(질문형)** 다이어트 중에도 단맛이 아쉽지 않은 아침, 가능할까요?

→ 페이지에는 **후보 1 (결과 강조형)** 을 적용했습니다. 한 줄만 읽어도 "덜 달다 + 갓 구운 + 빠른 도착"이라는 핵심 결과가 바로 전달되기 때문입니다.

---

## 완성된 단일 HTML 파일 전체

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>오트앤조이 — 덜 단데 물리지 않는 무설탕 수제 그래놀라</title>
<style>
  :root {
    --bg: #faf6ef;
    --card: #ffffff;
    --ink: #3a332b;
    --ink-soft: #6b6156;
    --line: #e7ddcd;
    --brand: #b3763b;
    --brand-deep: #935c28;
    --accent: #f2e9db;
    --shadow: 0 10px 30px rgba(90, 70, 45, 0.10);
  }

  * { box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    font-family: "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "Noto Sans KR", system-ui, -apple-system, sans-serif;
    color: var(--ink);
    background: var(--bg);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  img { max-width: 100%; }

  .wrap {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 22px;
  }

  /* ── 상단 바 ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
  }
  .logo {
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.02em;
    color: var(--brand-deep);
  }
  .logo span { color: var(--ink-soft); font-weight: 600; }
  .topbar .top-cta {
    font-size: 14px;
    font-weight: 700;
    color: var(--brand-deep);
    text-decoration: none;
    border: 1.5px solid var(--brand);
    padding: 8px 14px;
    border-radius: 999px;
  }

  /* ── 히어로 ── */
  .hero {
    padding: 46px 0 54px;
    text-align: center;
  }
  .eyebrow {
    display: inline-block;
    background: #efe4d2;
    color: var(--brand-deep);
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
  }
  .hero h1 {
    font-size: 34px;
    line-height: 1.32;
    letter-spacing: -0.03em;
    margin: 0 0 18px;
    font-weight: 800;
  }
  .hero h1 em {
    font-style: normal;
    color: var(--brand-deep);
    box-shadow: inset 0 -0.5em 0 #f0dcc0;
  }
  .hero p.sub {
    font-size: 17px;
    color: var(--ink-soft);
    margin: 0 auto 30px;
    max-width: 540px;
  }

  /* ── 버튼 ── */
  .btn {
    display: inline-block;
    background: var(--brand);
    color: #fff;
    text-decoration: none;
    font-weight: 800;
    font-size: 18px;
    padding: 17px 34px;
    border-radius: 14px;
    box-shadow: var(--shadow);
    transition: transform .12s ease, background .12s ease;
    letter-spacing: -0.01em;
  }
  .btn:hover { background: var(--brand-deep); transform: translateY(-2px); }
  .btn small {
    display: block;
    font-size: 13px;
    font-weight: 600;
    opacity: .9;
    margin-top: 4px;
  }
  .btn-note {
    margin-top: 14px;
    font-size: 13px;
    color: var(--ink-soft);
  }

  /* ── 그래놀라 3종 뱃지 ── */
  .flavors {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 34px;
  }
  .flavor {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px 18px;
    font-weight: 700;
    font-size: 15px;
    min-width: 120px;
  }
  .flavor b { display: block; color: var(--brand-deep); }
  .flavor span { font-size: 13px; color: var(--ink-soft); font-weight: 500; }

  /* ── 섹션 공통 ── */
  section.block { padding: 52px 0; }
  section.block.alt { background: #f4ecdf; }
  .kicker {
    font-size: 14px;
    font-weight: 800;
    color: var(--brand);
    letter-spacing: 0.02em;
    margin-bottom: 10px;
    text-align: center;
  }
  h2 {
    font-size: 26px;
    line-height: 1.4;
    letter-spacing: -0.02em;
    text-align: center;
    margin: 0 0 30px;
    font-weight: 800;
  }

  /* ── 고민 카드 ── */
  .pain-list {
    display: grid;
    gap: 14px;
  }
  .pain {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 20px 22px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .pain .mark {
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #f0e2cd;
    color: var(--brand-deep);
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .pain p { margin: 0; font-size: 16px; }
  .pain p b { color: var(--ink); }

  /* ── 해결책 ── */
  .solve {
    display: grid;
    gap: 16px;
  }
  .solve-item {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 24px;
  }
  .solve-item h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: var(--brand-deep);
    letter-spacing: -0.02em;
  }
  .solve-item p { margin: 0; color: var(--ink-soft); font-size: 15.5px; }

  /* ── 근거 ── */
  .proof {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .stat {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 26px 20px;
    text-align: center;
  }
  .stat .num {
    font-size: 40px;
    font-weight: 800;
    color: var(--brand-deep);
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .stat .lab {
    margin-top: 8px;
    font-size: 14.5px;
    color: var(--ink-soft);
  }
  .review {
    background: var(--card);
    border: 1px solid var(--line);
    border-left: 4px solid var(--brand);
    border-radius: 14px;
    padding: 24px 26px;
  }
  .review p {
    margin: 0 0 8px;
    font-size: 17px;
    font-style: italic;
    color: var(--ink);
  }
  .review .who { font-size: 14px; color: var(--ink-soft); font-style: normal; }

  .promise {
    background: var(--card);
    border: 1px dashed var(--brand);
    border-radius: 14px;
    padding: 22px 24px;
    margin-top: 18px;
    text-align: center;
    font-size: 15.5px;
    color: var(--ink-soft);
  }
  .promise b { color: var(--ink); }

  /* ── 최종 CTA ── */
  .final {
    text-align: center;
    padding: 60px 0 66px;
  }
  .final h2 { margin-bottom: 14px; }
  .final p.sub {
    color: var(--ink-soft);
    font-size: 16.5px;
    margin: 0 auto 28px;
    max-width: 500px;
  }

  /* ── 푸터 ── */
  footer {
    background: #efe6d6;
    padding: 30px 0;
    text-align: center;
    font-size: 13.5px;
    color: var(--ink-soft);
  }
  footer .logo { font-size: 16px; margin-bottom: 6px; }

  /* ── 반응형 ── */
  @media (max-width: 600px) {
    .hero { padding: 32px 0 40px; }
    .hero h1 { font-size: 27px; }
    .hero p.sub { font-size: 16px; }
    h2 { font-size: 22px; }
    .btn { display: block; font-size: 17px; padding: 16px 20px; }
    .proof { grid-template-columns: 1fr; }
    .topbar .top-cta { display: none; }
    .flavor { min-width: 0; flex: 1 1 40%; text-align: center; }
  }
</style>
</head>
<body>

  <!-- 상단 바 -->
  <div class="wrap">
    <div class="topbar">
      <div class="logo">오트앤조이 <span>oat&joy</span></div>
      <a class="top-cta" href="https://smartstore.naver.com/oatnjoy">스토어 바로가기</a>
    </div>
  </div>

  <!-- 1. 첫 화면 (핵심 약속) -->
  <div class="wrap">
    <section class="hero">
      <span class="eyebrow">설탕 대신 알룰로스 · 주 1회 소량 로스팅</span>
      <h1>덜 단데 물리지 않는 아침,<br><em>3일이면 갓 구운 그래놀라</em>가 도착합니다</h1>
      <p class="sub">아침을 대충 때우던 하루에, 준비 없이 부어 먹기만 하면 되는 담백한 한 그릇을 더했습니다. 무설탕·저당이라 다이어트 중에도 부담 없어요.</p>
      <a class="btn" href="https://smartstore.naver.com/oatnjoy">
        스마트스토어에서 오늘의 그래놀라 받아보기
        <small>주문 후 로스팅 · 평균 3일 내 도착</small>
      </a>
      <div class="btn-note">오리지널 · 카카오 · 베리 3종 중에서 골라 담을 수 있어요</div>

      <div class="flavors">
        <div class="flavor"><b>오리지널</b><span>오트 본연의 담백함</span></div>
        <div class="flavor"><b>카카오</b><span>덜 단 초콜릿 향</span></div>
        <div class="flavor"><b>베리</b><span>새콤달콤 상큼함</span></div>
      </div>
    </section>
  </div>

  <!-- 2. 고객 고민 공감 -->
  <section class="block alt">
    <div class="wrap">
      <div class="kicker">혹시 이런 아침, 보내고 계신가요</div>
      <h2>챙겨 먹고는 싶은데,<br>그게 늘 쉽지가 않죠</h2>
      <div class="pain-list">
        <div class="pain">
          <div class="mark">1</div>
          <p><b>아침은 챙기고 싶은데 준비할 시간이 없어요.</b> 결국 거르거나 편의점에서 대충 때우고, 오전 내내 속이 허전합니다.</p>
        </div>
        <div class="pain">
          <div class="mark">2</div>
          <p><b>시판 그래놀라는 너무 달아요.</b> 몇 입 먹으면 물리고, 당이 걱정돼서 다이어트 중엔 손이 잘 안 갑니다.</p>
        </div>
        <div class="pain">
          <div class="mark">3</div>
          <p><b>덜 달면서 맛있는 걸 찾기가 어려워요.</b> 건강한 척하는 제품은 많은데, 매일 먹고 싶을 만큼 담백하고 맛있는 건 드물죠.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. 해결책 -->
  <section class="block">
    <div class="wrap">
      <div class="kicker">그래서 이렇게 만들었어요</div>
      <h2>덜 달게, 갓 구워서,<br>준비 없이 바로 먹게</h2>
      <div class="solve">
        <div class="solve-item">
          <h3>설탕 대신 알룰로스</h3>
          <p>단맛은 살리되 설탕은 넣지 않았습니다. 무설탕·저당이라 끝까지 물리지 않고, 다이어트 중에도 마음 편히 한 그릇 비울 수 있어요.</p>
        </div>
        <div class="solve-item">
          <h3>주문 후 로스팅, 평균 3일 내 도착</h3>
          <p>미리 잔뜩 만들어 쌓아두지 않습니다. 주 1회 소량으로 굽고, 주문이 들어오면 그때 로스팅해 갓 만든 상태로 보내드려요.</p>
        </div>
        <div class="solve-item">
          <h3>부어 먹기만 하면 끝</h3>
          <p>우유나 요거트에 부으면 준비 끝. 바쁜 아침에도 1분이면 담백한 한 끼가 완성돼서, '아침 챙기기'가 부담이 아니라 습관이 됩니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. 믿을 근거 -->
  <section class="block alt">
    <div class="wrap">
      <div class="kicker">숫자와 후기로 말씀드릴게요</div>
      <h2>한 번 드신 분들이<br>다시 찾는 이유</h2>
      <div class="proof">
        <div class="stat">
          <div class="num">40%</div>
          <div class="lab">재구매율<br>한 번 드신 분 10명 중 4명이 다시 주문했어요</div>
        </div>
        <div class="stat">
          <div class="num">3일</div>
          <div class="lab">평균 도착까지<br>주문 후 로스팅해 갓 만든 상태로</div>
        </div>
      </div>
      <div class="review">
        <p>"시판 그래놀라보다 덜 달아서 물리지 않아요"</p>
        <div class="who">— 오트앤조이를 재구매한 고객 후기</div>
      </div>
      <div class="promise">
        저희는 <b>지어낸 화려한 수식어 대신 두 가지를 약속</b>합니다. 설탕은 넣지 않고 알룰로스로만 단맛을 내는 것, 그리고 미리 쌓아두지 않고 주문 후에 구워 보내는 것. 이 두 가지가 지켜지지 않는 그래놀라는 만들지 않습니다.
      </div>
    </div>
  </section>

  <!-- 5. 행동 유도 -->
  <section class="final">
    <div class="wrap">
      <h2>내일 아침은,<br>덜 달고 갓 구운 한 그릇으로</h2>
      <p class="sub">지금 주문하면 갓 로스팅한 그래놀라가 평균 3일 안에 도착합니다. 오리지널·카카오·베리 중에서 오늘의 취향을 골라보세요.</p>
      <a class="btn" href="https://smartstore.naver.com/oatnjoy">
        스마트스토어에서 오늘의 그래놀라 받아보기
        <small>주문 후 로스팅 · 평균 3일 내 도착</small>
      </a>
      <div class="btn-note">버튼을 누르면 오트앤조이 스마트스토어로 이동합니다</div>
    </div>
  </section>

  <!-- 푸터 -->
  <footer>
    <div class="wrap">
      <div class="logo">오트앤조이 <span>oat&joy</span></div>
      <div>설탕 대신 알룰로스로 만든 무설탕·저당 수제 그래놀라 · 주 1회 소량 로스팅</div>
      <div style="margin-top:6px;">© 오트앤조이. 따뜻하고 담백한 아침을 굽습니다.</div>
    </div>
  </footer>

</body>
</html>
```

---

## 이 파일을 여는 방법 (3줄)

1. 위 코드 블록 전체를 복사해 메모장(윈도우) 또는 텍스트편집기(맥)에 붙여넣습니다.
2. 파일 이름을 `index.html` 로 저장합니다. (맥 텍스트편집기는 "포맷 → 일반 텍스트로 만들기" 후 저장)
3. 저장한 `index.html` 파일을 더블클릭하면 브라우저에서 바로 페이지가 열립니다.

---

## 게시 전 확인 체크리스트 (4개)

- [ ] **오타 확인** — 헤드라인, 후기 문장, 그래놀라 3종 이름(오리지널·카카오·베리)에 오타가 없는지 한 번 더 읽어봅니다.
- [ ] **버튼 링크가 진짜 열리는지** — 상단·중간·하단의 모든 버튼을 눌러 `https://smartstore.naver.com/oatnjoy` 스토어가 실제로 열리는지 확인합니다.
- [ ] **휴대폰에서 보기** — 파일을 휴대폰으로 열어 글자가 잘리거나 버튼이 깨지지 않는지, 스크롤이 매끄러운지 확인합니다.
- [ ] **숫자·정보가 정확한지** — 재구매율 40%, 평균 3일 도착 등 실제 값과 일치하는지, 스토어 주소가 최신인지 점검합니다.
