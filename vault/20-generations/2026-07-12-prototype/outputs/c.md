아래에 '필라핏' 프로토타입을 만들어 드렸어요. 코드를 몰라도 파일 하나만 저장해서 더블클릭하면 브라우저에서 바로 열립니다. 주간 시간표에서 수업을 골라 '예약하기'를 누르면 내 예약 목록에 추가되고, 이미 마감된 수업은 '대기 등록'으로 처리돼요.

## 1. 완성된 단일 HTML 파일 전체 코드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>필라핏 · 우리 동네 필라테스 예약</title>
<style>
  :root {
    --bg: #fbf7ff;
    --card: #ffffff;
    --lav: #c9b6f0;
    --lav-deep: #a888e6;
    --mint: #bfe8dd;
    --mint-deep: #7fcbb8;
    --pink: #ffd6e4;
    --pink-deep: #ff9dbd;
    --peach: #ffe4cf;
    --ink: #4a4360;
    --ink-soft: #857c9c;
    --line: #eee6f7;
    --full: #f3eef9;
    --shadow: 0 8px 24px rgba(160, 130, 220, 0.14);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    padding-bottom: 90px;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(180deg, #fbf7ff 0%, #f6f0ff 100%);
    position: relative;
  }

  /* 상단 헤더 */
  header {
    padding: 26px 22px 18px;
    background: linear-gradient(135deg, var(--lav) 0%, var(--pink) 100%);
    color: #fff;
    border-radius: 0 0 26px 26px;
    box-shadow: var(--shadow);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .brand .logo {
    width: 34px; height: 34px;
    background: rgba(255,255,255,0.9);
    border-radius: 12px;
    display: grid; place-items: center;
    font-size: 18px;
  }
  .brand small {
    display: block;
    font-size: 12px;
    font-weight: 500;
    opacity: 0.92;
    margin-top: 4px;
    letter-spacing: 0;
  }

  /* 화면 전환 */
  .screen { display: none; padding: 18px 18px 20px; }
  .screen.active { display: block; animation: fade 0.28s ease; }
  @keyframes fade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .section-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    margin: 6px 4px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .section-title .hint {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  /* 수업 카드 */
  .card {
    background: var(--card);
    border-radius: 20px;
    padding: 16px 16px 14px;
    margin-bottom: 14px;
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .card.selected {
    border-color: var(--lav-deep);
    box-shadow: 0 10px 26px rgba(168, 136, 230, 0.28);
    transform: translateY(-2px);
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }
  .daytime {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--peach);
    color: #b5713e;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 999px;
  }
  .badge-level {
    font-size: 11px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 999px;
    background: var(--mint);
    color: #3f8a76;
  }
  .cname {
    font-size: 18px;
    font-weight: 800;
    margin: 12px 2px 6px;
    letter-spacing: -0.3px;
  }
  .cap {
    font-size: 13px;
    color: var(--ink-soft);
    margin: 0 2px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cap .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--mint-deep);
  }
  .cap .dot.warn { background: #f0b64d; }
  .cap .dot.full { background: var(--pink-deep); }

  .gauge {
    height: 8px;
    background: var(--full);
    border-radius: 999px;
    overflow: hidden;
    margin: 0 2px 14px;
  }
  .gauge > span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--mint-deep), var(--lav-deep));
    transition: width 0.4s ease;
  }
  .gauge > span.full {
    background: linear-gradient(90deg, var(--pink-deep), #ff7ba7);
  }

  /* 버튼 */
  button { font-family: inherit; cursor: pointer; border: none; }
  .btn {
    width: 100%;
    padding: 13px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    background: var(--lav-deep);
    transition: transform 0.1s ease, opacity 0.2s ease, background 0.2s ease;
  }
  .btn:active { transform: scale(0.97); }
  .btn.wait { background: #f5a3c0; }
  .btn.done {
    background: var(--mint);
    color: #3f8a76;
    cursor: default;
  }
  .btn.done.waited {
    background: #ffe0ec;
    color: #d76a94;
  }

  /* 내 예약 목록 */
  .booking {
    background: var(--card);
    border-radius: 18px;
    padding: 15px 16px;
    margin-bottom: 12px;
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .booking .bmark {
    width: 44px; height: 44px;
    border-radius: 14px;
    display: grid; place-items: center;
    font-size: 20px;
    flex-shrink: 0;
    background: var(--mint);
  }
  .booking.waitlist .bmark { background: var(--pink); }
  .booking .binfo { flex: 1; min-width: 0; }
  .booking .binfo .bt {
    font-size: 12px; color: var(--ink-soft); margin-bottom: 3px;
  }
  .booking .binfo .bn {
    font-size: 16px; font-weight: 800; letter-spacing: -0.3px;
  }
  .booking .bstat {
    font-size: 12px;
    font-weight: 700;
    padding: 6px 11px;
    border-radius: 999px;
    white-space: nowrap;
    background: var(--mint);
    color: #3f8a76;
  }
  .booking.waitlist .bstat {
    background: var(--pink);
    color: #cf5f8a;
  }
  .btn-cancel {
    background: transparent;
    color: var(--ink-soft);
    font-size: 12px;
    text-decoration: underline;
    padding: 4px;
    margin-top: 4px;
  }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--ink-soft);
  }
  .empty .emoji { font-size: 44px; display: block; margin-bottom: 14px; }
  .empty .go {
    margin-top: 18px;
    display: inline-block;
    background: var(--lav-deep);
    color: #fff;
    padding: 11px 22px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 14px;
  }

  /* 하단 탭바 */
  .tabbar {
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--line);
    display: flex;
    padding: 8px 0 14px;
    box-shadow: 0 -6px 20px rgba(160,130,220,0.10);
  }
  .tab {
    flex: 1;
    text-align: center;
    background: transparent;
    color: var(--ink-soft);
    font-size: 12px;
    font-weight: 700;
    padding: 6px 0;
  }
  .tab .ic { font-size: 21px; display: block; margin-bottom: 3px; filter: grayscale(0.4) opacity(0.7); }
  .tab.active { color: var(--lav-deep); }
  .tab.active .ic { filter: none; }
  .tab .count {
    display: inline-block;
    min-width: 18px;
    background: var(--pink-deep);
    color: #fff;
    font-size: 10px;
    border-radius: 999px;
    padding: 1px 5px;
    margin-left: 4px;
    vertical-align: middle;
  }

  /* 토스트 */
  #toast {
    position: fixed;
    bottom: 96px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--ink);
    color: #fff;
    padding: 13px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(74,67,96,0.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 50;
    text-align: center;
    max-width: 88%;
  }
  #toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
</style>
</head>
<body>
  <div class="app">
    <header>
      <div class="brand">
        <span class="logo">🧘‍♀️</span>
        <div>
          필라핏
          <small>이번 주, 나에게 맞는 수업을 골라보세요</small>
        </div>
      </div>
    </header>

    <!-- 화면 1: 주간 시간표 -->
    <section id="screen-schedule" class="screen active">
      <div class="section-title">
        이번 주 시간표
        <span class="hint">수업을 눌러 바로 예약하세요</span>
      </div>
      <div id="class-list"><!-- JS로 채워짐 --></div>
    </section>

    <!-- 화면 2: 내 예약 목록 -->
    <section id="screen-bookings" class="screen">
      <div class="section-title">
        내 예약 목록
        <span class="hint">예약과 대기를 한눈에</span>
      </div>
      <div id="booking-list"><!-- JS로 채워짐 --></div>
    </section>
  </div>

  <!-- 하단 탭 -->
  <nav class="tabbar">
    <button class="tab active" id="tab-schedule" onclick="switchTab('schedule')">
      <span class="ic">🗓️</span>시간표
    </button>
    <button class="tab" id="tab-bookings" onclick="switchTab('bookings')">
      <span class="ic">🎫</span>내 예약<span id="tab-count" class="count" style="display:none">0</span>
    </button>
  </nav>

  <div id="toast"></div>

<script>
  // ===== 미리 채워둔 예시 수업 데이터 =====
  var classes = [
    { id: "c1", day: "월", time: "10:00", name: "기구 초급",     level: "초급", capacity: 6,  booked: 4  },
    { id: "c2", day: "화", time: "19:30", name: "매트 중급",     level: "중급", capacity: 8,  booked: 8  },
    { id: "c3", day: "목", time: "20:00", name: "기구 중급",     level: "중급", capacity: 6,  booked: 5  },
    { id: "c4", day: "토", time: "09:00", name: "모닝 스트레칭", level: "입문", capacity: 10, booked: 3  }
  ];

  // 내 예약: { classId, status: "예약완료" | "대기중" }
  var myBookings = [];

  // ===== 토스트 =====
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ===== 준비 중 안내 (아직 안 만든 버튼용) =====
  function comingSoon() {
    toast("준비 중이에요 🙏");
  }

  // ===== 시간표 그리기 =====
  function renderClasses() {
    var wrap = document.getElementById("class-list");
    wrap.innerHTML = "";

    classes.forEach(function (c) {
      var isFull = c.booked >= c.capacity;
      var mine = myBookings.find(function (b) { return b.classId === c.id; });
      var ratio = Math.min(100, Math.round((c.booked / c.capacity) * 100));

      var dotClass = "dot";
      if (isFull) dotClass = "dot full";
      else if (c.capacity - c.booked <= 1) dotClass = "dot warn";

      var capText = isFull
        ? "정원 " + c.capacity + "명 · 마감"
        : "정원 " + c.capacity + "명 중 " + c.booked + "명 예약";

      // 버튼 상태 결정
      var btnHtml;
      if (mine && mine.status === "예약완료") {
        btnHtml = '<button class="btn done">✔ 예약 완료됨</button>';
      } else if (mine && mine.status === "대기중") {
        btnHtml = '<button class="btn done waited">⏳ 대기 등록됨</button>';
      } else if (isFull) {
        btnHtml = '<button class="btn wait" onclick="reserve(\'' + c.id + '\')">대기 등록하기</button>';
      } else {
        btnHtml = '<button class="btn" onclick="reserve(\'' + c.id + '\')">예약하기</button>';
      }

      var card = document.createElement("div");
      card.className = "card" + (mine ? " selected" : "");
      card.innerHTML =
        '<div class="card-top">' +
          '<span class="daytime">📅 ' + c.day + ' · ' + c.time + '</span>' +
          '<span class="badge-level">' + c.level + '</span>' +
        '</div>' +
        '<div class="cname">' + c.name + '</div>' +
        '<div class="cap"><span class="' + dotClass + '"></span>' + capText + '</div>' +
        '<div class="gauge"><span class="' + (isFull ? "full" : "") + '" style="width:' + ratio + '%"></span></div>' +
        btnHtml;
      wrap.appendChild(card);
    });
  }

  // ===== 예약 / 대기 등록 =====
  function reserve(classId) {
    var c = classes.find(function (x) { return x.id === classId; });
    if (!c) return;

    // 이미 내 목록에 있으면 중복 방지
    if (myBookings.find(function (b) { return b.classId === classId; })) {
      toast("이미 신청한 수업이에요");
      return;
    }

    var isFull = c.booked >= c.capacity;
    if (isFull) {
      myBookings.push({ classId: classId, status: "대기중" });
      toast("정원이 꽉 찼어요 · " + c.name + " 대기 등록 완료! ⏳");
    } else {
      c.booked += 1; // 자리 하나 채움
      myBookings.push({ classId: classId, status: "예약완료" });
      toast(c.day + " " + c.time + " " + c.name + " 예약 완료! 🎉");
    }

    renderClasses();
    renderBookings();
    updateCount();
  }

  // ===== 예약 취소 =====
  function cancel(classId) {
    var idx = myBookings.findIndex(function (b) { return b.classId === classId; });
    if (idx === -1) return;
    var removed = myBookings[idx];
    var c = classes.find(function (x) { return x.id === classId; });

    // 예약완료였으면 자리 다시 비움
    if (removed.status === "예약완료" && c) {
      c.booked = Math.max(0, c.booked - 1);
    }
    myBookings.splice(idx, 1);
    toast((c ? c.name : "수업") + " 예약을 취소했어요");

    renderClasses();
    renderBookings();
    updateCount();
  }

  // ===== 내 예약 목록 그리기 =====
  function renderBookings() {
    var wrap = document.getElementById("booking-list");
    wrap.innerHTML = "";

    if (myBookings.length === 0) {
      wrap.innerHTML =
        '<div class="empty">' +
          '<span class="emoji">🗓️</span>' +
          '아직 신청한 수업이 없어요.<br>시간표에서 마음에 드는 수업을 골라보세요!' +
          '<br><span class="go" onclick="switchTab(\'schedule\')">시간표 보러 가기</span>' +
        '</div>';
      return;
    }

    myBookings.forEach(function (b) {
      var c = classes.find(function (x) { return x.id === b.classId; });
      if (!c) return;
      var isWait = b.status === "대기중";

      var item = document.createElement("div");
      item.className = "booking" + (isWait ? " waitlist" : "");
      item.innerHTML =
        '<div class="bmark">' + (isWait ? "⏳" : "✅") + '</div>' +
        '<div class="binfo">' +
          '<div class="bt">' + c.day + '요일 · ' + c.time + ' · ' + c.level + '</div>' +
          '<div class="bn">' + c.name + '</div>' +
          '<button class="btn-cancel" onclick="cancel(\'' + c.id + '\')">신청 취소</button>' +
        '</div>' +
        '<div class="bstat">' + (isWait ? "대기 등록" : "예약 완료") + '</div>';
      wrap.appendChild(item);
    });
  }

  // ===== 탭 배지 숫자 =====
  function updateCount() {
    var badge = document.getElementById("tab-count");
    if (myBookings.length > 0) {
      badge.textContent = myBookings.length;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }

  // ===== 화면 전환 =====
  function switchTab(name) {
    document.getElementById("screen-schedule").classList.toggle("active", name === "schedule");
    document.getElementById("screen-bookings").classList.toggle("active", name === "bookings");
    document.getElementById("tab-schedule").classList.toggle("active", name === "schedule");
    document.getElementById("tab-bookings").classList.toggle("active", name === "bookings");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== 첫 실행 =====
  renderClasses();
  renderBookings();
  updateCount();
</script>
</body>
</html>
```

## 2. 컴퓨터에서 열어보는 방법 (코드를 몰라도 따라 할 수 있어요)

1. 컴퓨터에 기본으로 깔려 있는 **메모장(윈도우)** 또는 **텍스트 편집기(맥)** 를 엽니다.
2. 위 코드 블록 안의 코드를 `<!DOCTYPE html>` 부터 맨 끝 `</html>` 까지 **전부 복사해서 붙여넣기** 합니다.
3. **파일 → 저장(다른 이름으로 저장)** 을 누르고, 파일 이름을 `프로토타입.html` 로 적어 저장합니다. (맥 텍스트 편집기라면 먼저 상단 메뉴 서식 → '일반 텍스트로 만들기'를 눌러주세요.)
4. 저장된 `프로토타입.html` 파일을 **더블클릭** 하면 크롬·사파리 같은 브라우저에서 바로 열립니다. 인터넷이 끊겨 있어도 잘 작동해요.

## 3. 지금 보여주는 것 / 아직 없는 것

**지금 이 프로토타입이 보여주는 것**
- 이번 주 시간표에 4개 수업이 이미 채워진 상태 (월 기구 초급, 화 매트 중급-마감, 목 기구 중급, 토 모닝 스트레칭)
- 각 수업의 정원 대비 현재 예약 인원을 막대 게이지와 색깔 점으로 표시
- '예약하기'를 누르면 → 내 예약 목록에 '예약 완료'로 추가되고 인원 수가 1 올라감
- 정원이 찬 수업(화 19:30 매트 중급)은 버튼이 '대기 등록하기'로 바뀌고, 누르면 '대기 등록'으로 목록에 들어감
- 하단 '내 예약' 탭에서 예약/대기 상태를 한눈에 확인하고, '신청 취소'로 되돌릴 수 있음
- 예약할 때마다 하단에 완료 안내 메시지(토스트)가 뜨고, 탭에 신청 개수 배지가 표시됨

**아직 없는 것 (다음에 만들 것)**
- 로그인·회원가입 (지금은 '나' 한 사람 기준으로만 동작)
- 결제·회원권 차감
- 실제 서버·데이터베이스 연동 (파일을 닫으면 예약 내용은 초기화됩니다)
- 대기 순번이 실제로 밀려서 자동으로 예약 전환되는 로직
- 예약 확정 알림 문자/푸시, 노쇼 자동 패널티

## 4. 다른 사람에게 보여주고 물어볼 검증 질문 3개

1. "수업을 예약하는 흐름이 설명 없이도 바로 이해됐나요? 어디서 잠깐 멈칫했나요?"
2. "정원이 찬 수업이 '대기 등록'으로 바뀌는 걸 보고, 이게 대기라는 걸 바로 알 수 있었나요?"
3. "내 예약 목록에서 예약과 대기가 구분돼 보이나요? 여기서 더 있으면 좋겠는 정보가 있나요?"

## 5. 마음에 안 드는 곳을 고쳐달라고 요청하는 예시 문장 3개

1. "카드 색을 지금보다 조금 더 연한 민트 톤으로 바꾸고, 수업 이름 글씨를 더 크게 해줘."
2. "예약할 때 뜨는 '예약 완료' 메시지 대신, 화면 가운데에 확인 팝업이 뜨고 '확인'을 눌러야 닫히게 해줘."
3. "내 예약 목록 맨 위에 '이번 주 내 수업 2개'처럼 요약 문구를 한 줄 넣어줘."
