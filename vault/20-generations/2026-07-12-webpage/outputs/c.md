아래에 오트앤조이 원페이지 랜딩페이지를 완성해 드렸습니다. 그대로 붙여넣어 게시하시면 됩니다.

## 완성된 웹페이지 (index.html)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>오트앤조이 — 덜 단 무설탕 수제 그래놀라</title>
  <style>
    :root {
      --cream: #faf5ec;
      --ink: #3d342a;
      --muted: #7a6f60;
      --oat: #b5794a;
      --oat-dark: #96612f;
      --line: #ece2d2;
      --card: #ffffff;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
        "Malgun Gothic", "맑은 고딕", sans-serif;
      background: var(--cream);
      color: var(--ink);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }

    .wrap {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding: 0 22px;
    }

    section { padding: 64px 0; }

    /* 버튼 */
    .btn {
      display: block;
      width: 100%;
      background: var(--oat);
      color: #fff;
      text-align: center;
      text-decoration: none;
      font-size: 1.15rem;
      font-weight: 700;
      padding: 20px 24px;
      border-radius: 14px;
      box-shadow: 0 6px 16px rgba(150, 97, 47, 0.25);
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn:hover { background: var(--oat-dark); }
    .btn:active { transform: translateY(1px); }

    /* 첫 화면 */
    .hero {
      background: linear-gradient(180deg, #f3ead9 0%, var(--cream) 100%);
      padding: 72px 0 60px;
      text-align: center;
    }
    .hero .brand {
      display: inline-block;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--oat-dark);
      background: #fff;
      padding: 7px 16px;
      border-radius: 999px;
      border: 1px solid var(--line);
      margin-bottom: 26px;
    }
    .hero h1 {
      font-size: 2.05rem;
      line-height: 1.35;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .hero p.sub {
      font-size: 1.1rem;
      color: var(--muted);
      margin-bottom: 34px;
    }
    .hero .note {
      font-size: 0.9rem;
      color: var(--muted);
      margin-top: 14px;
    }

    /* 공통 제목 */
    h2.title {
      font-size: 1.55rem;
      line-height: 1.4;
      letter-spacing: -0.01em;
      margin-bottom: 18px;
    }

    /* 문제 공감 */
    .problem { text-align: left; }
    .problem p {
      font-size: 1.12rem;
      color: var(--ink);
      margin-bottom: 16px;
    }
    .problem p.dim { color: var(--muted); font-size: 1.05rem; }

    /* 해결과 혜택 */
    .benefits { background: #f6eede; }
    .benefit-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 24px 22px;
      margin-bottom: 16px;
    }
    .benefit-card h3 {
      font-size: 1.2rem;
      margin-bottom: 8px;
    }
    .benefit-card p {
      color: var(--muted);
      font-size: 1.02rem;
    }
    .benefit-card .tag {
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--oat-dark);
      margin-bottom: 10px;
    }

    /* 사회적 증거 */
    .proof { text-align: center; }
    .stat {
      background: var(--oat);
      color: #fff;
      border-radius: 18px;
      padding: 34px 24px;
      margin-bottom: 20px;
    }
    .stat .num { font-size: 2.6rem; font-weight: 800; line-height: 1; }
    .stat .label { font-size: 1.05rem; margin-top: 10px; opacity: 0.95; }
    .review {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 26px 22px;
      text-align: left;
    }
    .review p.quote {
      font-size: 1.15rem;
      line-height: 1.6;
      margin-bottom: 10px;
    }
    .review p.who { font-size: 0.9rem; color: var(--muted); }

    /* FAQ */
    .faq-item {
      border-bottom: 1px solid var(--line);
      padding: 22px 0;
    }
    .faq-item:first-of-type { border-top: 1px solid var(--line); }
    .faq-item h3 {
      font-size: 1.12rem;
      margin-bottom: 8px;
    }
    .faq-item h3::before {
      content: "Q. ";
      color: var(--oat-dark);
      font-weight: 800;
    }
    .faq-item p { color: var(--muted); font-size: 1.02rem; }

    /* 마지막 행동 유도 */
    .final {
      background: linear-gradient(180deg, var(--cream) 0%, #f0e6d3 100%);
      text-align: center;
    }
    .final h2 { margin-bottom: 24px; }

    /* 푸터 */
    footer {
      text-align: center;
      padding: 40px 0 56px;
      color: var(--muted);
      font-size: 0.92rem;
    }
    footer strong { color: var(--ink); font-size: 1rem; }
    footer a { color: var(--oat-dark); text-decoration: none; word-break: break-all; }
    footer .row { margin-top: 8px; }

    @media (min-width: 480px) {
      .hero h1 { font-size: 2.4rem; }
      .btn { width: auto; min-width: 320px; margin: 0 auto; }
      .final .btn, .hero .btn { display: inline-block; }
    }
  </style>
</head>
<body>

  <!-- 첫 화면 -->
  <header class="hero">
    <div class="wrap">
      <span class="brand">오트앤조이</span>
      <h1>바쁜 아침에도, 덜 달지만 든든한 무설탕 수제 그래놀라</h1>
      <p class="sub">아침을 대충 때우는 직장인을 위한 저당 그래놀라 3종</p>
      <a class="btn" href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">스마트스토어에서 구매하기</a>
      <p class="note">오리지널 · 카카오 · 베리 &nbsp;|&nbsp; 주 1회 소량 로스팅</p>
    </div>
  </header>

  <!-- 문제 공감 -->
  <section class="problem">
    <div class="wrap">
      <h2 class="title">아침, 챙기고 싶은데 시간이 없죠</h2>
      <p>알람을 끄고 겨우 일어나면 이미 시간은 빠듯합니다. 아침은 늘 커피 한 잔이나 대충 집은 무언가로 넘기게 됩니다.</p>
      <p>그렇다고 시판 그래놀라를 사보면, 이번엔 너무 달아서 물립니다. 다이어트 중이라 단맛이 부담스러운 날엔 손이 잘 가지 않죠.</p>
      <p class="dim">이대로면 아침은 계속 대충 넘어가고, 그때그때 단 걸로 허기를 채우는 습관만 쌓이기 쉽습니다. 아침 한 끼를 바꾸는 것만으로도 하루의 시작이 달라질 수 있는데 말이죠.</p>
    </div>
  </section>

  <!-- 해결과 혜택 -->
  <section class="benefits">
    <div class="wrap">
      <h2 class="title">그래서 오트앤조이는 이렇게 만듭니다</h2>

      <div class="benefit-card">
        <span class="tag">덜 달다</span>
        <h3>설탕 대신 알룰로스</h3>
        <p>설탕을 빼고 알룰로스로 단맛을 냈습니다. 달아서 물리는 부담 없이, 매일 먹기 좋게 담백합니다.</p>
      </div>

      <div class="benefit-card">
        <span class="tag">갓 만든 신선함</span>
        <h3>주 1회 소량 로스팅</h3>
        <p>미리 쌓아두지 않고 주 1회 소량만 굽습니다. 갓 만든 상태로 평균 3일 안에 발송합니다.</p>
      </div>

      <div class="benefit-card">
        <span class="tag">물리지 않게</span>
        <h3>오리지널 · 카카오 · 베리 3종</h3>
        <p>매일 같은 맛은 금방 질립니다. 기분에 따라 골라 먹을 수 있는 3종으로, 아침이 지겹지 않습니다.</p>
      </div>
    </div>
  </section>

  <!-- 사회적 증거 -->
  <section class="proof">
    <div class="wrap">
      <h2 class="title">먹어본 분들이 다시 찾습니다</h2>

      <div class="stat">
        <div class="num">40%</div>
        <div class="label">다시 주문해 주신 재구매율</div>
      </div>

      <div class="review">
        <p class="quote">"시판 그래놀라보다 덜 달아서 물리지 않아요."</p>
        <p class="who">— 오트앤조이 실제 구매 후기</p>
      </div>
    </div>
  </section>

  <!-- 자주 묻는 질문 -->
  <section class="faq">
    <div class="wrap">
      <h2 class="title">주문 전, 이런 점이 궁금하실 거예요</h2>

      <div class="faq-item">
        <h3>정말 안 단가요? 무설탕인데 맛있나요?</h3>
        <p>설탕 대신 알룰로스를 써서 시판 제품보다 확실히 덜 답니다. 단맛을 아예 없앤 게 아니라, 물리지 않을 만큼 담백하게 잡았습니다. 다이어트 중이라 단맛이 부담스러운 분들께 특히 잘 맞습니다.</p>
      </div>

      <div class="faq-item">
        <h3>주문하면 언제쯤 받을 수 있나요?</h3>
        <p>주 1회 소량 로스팅해 갓 만든 상태로 보내드리기 때문에, 주문 후 평균 3일 안에 발송됩니다. 미리 대량으로 쌓아두고 파는 방식이 아니라 신선하게 받으실 수 있습니다.</p>
      </div>

      <div class="faq-item">
        <h3>세 가지 맛 중 뭘 골라야 할지 모르겠어요.</h3>
        <p>담백하게 시작하고 싶다면 오리지널, 진한 초코 향을 원하면 카카오, 상큼한 과일 맛이 좋다면 베리를 추천합니다. 매일 번갈아 먹으면 질리지 않으니, 처음이라면 3종을 함께 맛보시는 것도 좋습니다.</p>
      </div>
    </div>
  </section>

  <!-- 마지막 행동 유도 -->
  <section class="final">
    <div class="wrap">
      <h2 class="title">내일 아침은, 덜 달지만 든든하게 시작하세요</h2>
      <a class="btn" href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">스마트스토어에서 구매하기</a>
    </div>
  </section>

  <!-- 푸터 -->
  <footer>
    <div class="wrap">
      <strong>오트앤조이</strong>
      <div class="row">무설탕 · 저당 수제 그래놀라</div>
      <div class="row">문의 · 구매: <a href="https://smartstore.naver.com/oatnjoy" target="_blank" rel="noopener">네이버 스마트스토어</a></div>
    </div>
  </footer>

</body>
</html>
```

## 파일 여는 법 (코드를 몰라도 3단계)

1. 위 코드 블록 안의 내용을 처음부터 끝까지 전부 복사해서 **메모장(윈도우) 또는 텍스트편집기(맥)** 에 붙여넣습니다.
   - 맥의 텍스트편집기라면 먼저 상단 메뉴 [포맷] → [일반 텍스트로 만들기]를 눌러 주세요.
2. **index.html** 이라는 이름으로 저장합니다. (파일 이름 뒤가 `.txt`가 아니라 `.html`로 끝나야 합니다.)
3. 저장한 **index.html 파일을 더블클릭**하면 인터넷 창에서 페이지가 열립니다.

## 게시 전 체크리스트 5가지

1. **버튼 링크 확인** — "스마트스토어에서 구매하기" 버튼 두 개를 눌러 실제로 `https://smartstore.naver.com/oatnjoy` 로 이동하는지 확인하세요.
2. **오탈자 확인** — 브랜드명(오트앤조이), 맛 이름(오리지널·카카오·베리), 문구에 오타가 없는지 눈으로 훑어보세요.
3. **휴대폰 화면 확인** — 폰으로 파일을 열어 글자가 충분히 크고, 버튼이 엄지로 누르기 편한지, 한 줄에 글자가 너무 몰리지 않는지 보세요.
4. **숫자·후기 사실 확인** — 재구매율 40%와 후기 문구가 실제 내용과 일치하는지 한 번 더 대조하세요.
5. **첫 화면 3초 테스트** — 페이지를 처음 보는 사람에게 3초만 보여주고, "누구를 위한 무엇을 파는지" 바로 이해하는지 확인하세요.
