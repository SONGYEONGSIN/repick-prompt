아래에 '필라핏' 프로토타입을 만들었어요. 코드블록 하나를 통째로 복사해서 사용하시면 됩니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <!-- 아래 줄이 있어야 휴대폰에서 화면이 자동으로 맞춰집니다. 지우지 마세요 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>필라핏 · 수업 예약</title>

  <style>
    /* =========================================================
       색깔 바꾸기: 아래 변수 값만 바꾸면 전체 색이 한 번에 바뀝니다.
       (예: --메인색 을 #f6b6c9 → #a8d5c8 로 바꾸면 초록빛 파스텔이 됩니다)
       ========================================================= */
    :root {
      --메인색: #f4a6bd;        /* 여기 색을 바꾸세요 (버튼·강조 색) */
      --메인색-진하게: #e07a9a;  /* 여기 색을 바꾸세요 (버튼 눌렀을 때) */
      --배경색: #fdf6f8;         /* 여기 색을 바꾸세요 (전체 배경) */
      --카드색: #ffffff;         /* 여기 색을 바꾸세요 (카드 배경) */
      --글자색: #4a4a4a;         /* 여기 색을 바꾸세요 (기본 글자) */
      --연한글자: #9a9a9a;       /* 여기 색을 바꾸세요 (부가 설명 글자) */
      --대기색: #f6c667;         /* 여기 색을 바꾸세요 (대기 등록 버튼) */
      --테두리: #f0e2e7;         /* 여기 색을 바꾸세요 (선·구분선) */
    }

    /* 기본 여백 정리 */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: "Apple SD Gothic Neo", "맑은 고딕", "Malgun Gothic", sans-serif;
      background: var(--배경색);
      color: var(--글자색);
      line-height: 1.5;
      padding: 16px;
    }

    /* 전체를 가운데 정렬하고 최대 폭을 정합니다 (컴퓨터에서도 너무 넓어지지 않게) */
    .감싸기 {
      max-width: 480px;
      margin: 0 auto;
    }

    /* ===== 맨 위 스튜디오 이름 영역 ===== */
    .머리말 {
      text-align: center;
      padding: 24px 0 16px;
    }
    .머리말 .로고 {
      font-size: 40px; /* 이모지 크기 */
    }
    .머리말 h1 {
      font-size: 26px;
      margin-top: 4px;
      color: var(--메인색-진하게);
      letter-spacing: 1px;
    }
    .머리말 p {
      font-size: 13px;
      color: var(--연한글자);
      margin-top: 4px;
    }

    /* ===== 공통 영역 제목 ===== */
    .영역제목 {
      font-size: 17px;
      font-weight: bold;
      margin: 24px 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ===== 시간표 카드 ===== */
    .수업카드 {
      background: var(--카드색);
      border: 1px solid var(--테두리);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .수업정보 .요일 {
      display: inline-block;
      background: var(--배경색);
      border: 1px solid var(--테두리);
      color: var(--메인색-진하게);
      font-size: 12px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 8px;
      margin-bottom: 6px;
    }
    .수업정보 .이름 {
      font-size: 16px;
      font-weight: bold;
    }
    .수업정보 .시간 {
      font-size: 13px;
      color: var(--연한글자);
      margin-top: 2px;
    }
    .수업정보 .자리 {
      font-size: 13px;
      margin-top: 4px;
    }
    .자리.여유 { color: #4a9d7f; }   /* 자리 있음 색 */
    .자리.마감 { color: var(--메인색-진하게); font-weight: bold; }

    /* ===== 버튼 ===== */
    .예약버튼 {
      border: none;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      background: var(--메인색);
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.05s ease, background 0.15s ease;
    }
    .예약버튼:hover { background: var(--메인색-진하게); }
    .예약버튼:active { transform: scale(0.96); }

    /* 정원이 찬 수업 버튼 (대기 등록) */
    .예약버튼.대기 { background: var(--대기색); color: #6b4b00; }

    /* 이미 예약(또는 대기)한 뒤의 버튼 모양 */
    .예약버튼.완료 { background: #d7d0d3; color: #fff; cursor: default; }
    .예약버튼.완료:hover { background: #d7d0d3; }

    /* ===== 내 예약 목록 ===== */
    #내예약목록 { list-style: none; }
    .예약항목 {
      background: var(--카드색);
      border: 1px solid var(--테두리);
      border-left: 5px solid var(--메인색);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .예약항목.대기표시 { border-left-color: var(--대기색); }
    .예약항목 .왼쪽 .제목 { font-weight: bold; font-size: 15px; }
    .예약항목 .왼쪽 .보조 { font-size: 12px; color: var(--연한글자); margin-top: 2px; }
    .예약항목 .상태 {
      font-size: 12px;
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 999px;
      background: #eafaf3;
      color: #4a9d7f;
    }
    .예약항목 .상태.대기 { background: #fdf3dc; color: #a97b1a; }

    /* 예약이 하나도 없을 때 안내 문구 */
    .빈안내 {
      text-align: center;
      color: var(--연한글자);
      font-size: 14px;
      padding: 24px 0;
      background: var(--카드색);
      border: 1px dashed var(--테두리);
      border-radius: 16px;
    }

    /* 맨 아래 문구 */
    .꼬리말 {
      text-align: center;
      font-size: 12px;
      color: var(--연한글자);
      margin: 28px 0 10px;
    }
  </style>
</head>

<body>
  <div class="감싸기">

    <!-- ================= 맨 위: 스튜디오 이름 =================
         여기 글자를 바꾸세요: 스튜디오 이름과 한 줄 소개 -->
    <header class="머리말">
      <div class="로고">🤸‍♀️</div>
      <h1>필라핏 스튜디오</h1>
      <p>카톡 없이도 예약 · 노쇼 걱정 끝</p>
    </header>

    <!-- ================= 주간 시간표 ================= -->
    <div class="영역제목">🗓️ 이번 주 시간표</div>
    <!-- 이 자리에 수업 카드들이 자동으로 채워집니다 (아래 자바스크립트 참고) -->
    <div id="시간표"></div>

    <!-- ================= 내 예약 목록 ================= -->
    <div class="영역제목">📋 내 예약</div>
    <ul id="내예약목록"></ul>

    <div class="꼬리말">필라핏 · 만져볼 수 있는 첫 화면 (연습용)</div>
  </div>

  <script>
    /* =========================================================
       예시 수업 내용입니다.
       여기 글자를 바꾸세요: 수업 이름·요일·시간·정원 숫자
       - 정원(총) : 전체 자리 수
       - 신청(현재): 지금까지 예약한 사람 수
       - 신청 == 정원 이면 자동으로 '대기 등록' 버튼으로 바뀝니다.
       ========================================================= */
    var 수업들 = [
      { 아이디: 1, 요일: "월", 시간: "10:00", 이름: "기구 초급", 정원: 6, 신청: 4 },
      { 아이디: 2, 요일: "화", 시간: "19:30", 이름: "매트 중급", 정원: 8, 신청: 8 },
      { 아이디: 3, 요일: "목", 시간: "20:00", 이름: "기구 중급", 정원: 6, 신청: 5 },
      { 아이디: 4, 요일: "토", 시간: "09:00", 이름: "모닝 스트레칭", 정원: 10, 신청: 3 },
    ];

    // 내가 예약(또는 대기)한 수업들을 담아두는 곳 (파일을 새로 열면 비워집니다)
    var 내예약 = [];

    /* ---- 시간표를 화면에 그리는 함수 ---- */
    function 시간표그리기() {
      var 담을곳 = document.getElementById("시간표");
      담을곳.innerHTML = ""; // 매번 새로 그리기 위해 비웁니다

      수업들.forEach(function (수업) {
        var 마감됨 = 수업.신청 >= 수업.정원;
        var 이미신청 = 내예약.some(function (e) { return e.아이디 === 수업.아이디; });

        // 카드 하나 만들기
        var 카드 = document.createElement("div");
        카드.className = "수업카드";

        // 왼쪽 정보
        var 자리글 = 마감됨
          ? '<div class="자리 마감">정원 ' + 수업.정원 + '명 · 마감 😢</div>'
          : '<div class="자리 여유">정원 ' + 수업.정원 + '명 중 ' + 수업.신청 + '명 · 잔여 ' + (수업.정원 - 수업.신청) + '석</div>';

        var 정보 = document.createElement("div");
        정보.className = "수업정보";
        정보.innerHTML =
          '<span class="요일">' + 수업.요일 + '</span>' +
          '<div class="이름">' + 수업.이름 + '</div>' +
          '<div class="시간">' + 수업.시간 + '</div>' +
          자리글;

        // 오른쪽 버튼
        var 버튼 = document.createElement("button");
        버튼.className = "예약버튼";
        if (이미신청) {
          버튼.classList.add("완료");
          버튼.textContent = 마감됨 ? "대기 완료" : "예약 완료 ✓";
          버튼.disabled = true;
        } else if (마감됨) {
          버튼.classList.add("대기");
          버튼.textContent = "대기 등록";
          버튼.onclick = function () { 예약하기(수업.아이디); };
        } else {
          버튼.textContent = "예약하기";
          버튼.onclick = function () { 예약하기(수업.아이디); };
        }

        카드.appendChild(정보);
        카드.appendChild(버튼);
        담을곳.appendChild(카드);
      });
    }

    /* ---- '예약하기 / 대기 등록' 버튼을 눌렀을 때 실행되는 함수 ---- */
    function 예약하기(아이디) {
      var 수업 = 수업들.find(function (s) { return s.아이디 === 아이디; });
      if (!수업) return;

      var 대기 = 수업.신청 >= 수업.정원; // 마감된 수업이면 '대기'로 처리

      if (!대기) {
        수업.신청 = 수업.신청 + 1; // 자리가 있으면 신청 인원 +1
      }

      // 내 예약 목록에 추가
      내예약.push({
        아이디: 수업.아이디,
        이름: 수업.이름,
        요일: 수업.요일,
        시간: 수업.시간,
        대기여부: 대기,
      });

      시간표그리기();   // 시간표의 잔여석·버튼 상태 새로 그리기
      내예약그리기();   // 아래 '내 예약' 목록 새로 그리기
    }

    /* ---- 내 예약 목록을 화면에 그리는 함수 ---- */
    function 내예약그리기() {
      var 목록 = document.getElementById("내예약목록");
      목록.innerHTML = "";

      // 예약이 하나도 없을 때 안내 문구
      if (내예약.length === 0) {
        목록.innerHTML =
          '<div class="빈안내">아직 예약한 수업이 없어요.<br>위 시간표에서 수업을 골라 예약해 보세요 👆</div>';
        return;
      }

      내예약.forEach(function (예약) {
        var 항목 = document.createElement("li");
        항목.className = "예약항목" + (예약.대기여부 ? " 대기표시" : "");
        항목.innerHTML =
          '<div class="왼쪽">' +
            '<div class="제목">' + 예약.이름 + '</div>' +
            '<div class="보조">' + 예약.요일 + '요일 · ' + 예약.시간 + '</div>' +
          '</div>' +
          '<span class="상태' + (예약.대기여부 ? " 대기" : "") + '">' +
            (예약.대기여부 ? "대기 중" : "예약 확정") +
          '</span>';
        목록.appendChild(항목);
      });
    }

    /* ---- 화면이 처음 열릴 때 그리기 시작 ---- */
    시간표그리기();
    내예약그리기();
  </script>
</body>
</html>
```

---

### 이 파일을 여는 방법 (3단계)

1. 위 코드블록을 통째로 복사해서 **메모장(윈도우)** 또는 **텍스트편집기(맥)** 에 붙여넣습니다.
2. 파일 이름을 **`index.html`** 로 저장합니다. (맥의 텍스트편집기는 '포맷 → 일반 텍스트로 만들기'로 바꾼 뒤 저장하세요.)
3. 저장한 **`index.html` 파일을 더블클릭**합니다. 브라우저에서 바로 화면이 뜹니다.

---

### 열었을 때 눈으로 확인할 체크리스트 (3개)

1. 첫 화면이 뜨는가 — 맨 위에 '필라핏 스튜디오', 그 아래 이번 주 시간표(월·화·목·토 4개 수업)와 '내 예약' 영역이 보이면 성공.
2. 그 버튼을 누르면 반응하는가 — '예약하기'를 누르면 아래 '내 예약'에 그 수업이 추가되고 잔여석 숫자가 줄어들며, 정원이 찬 화 19:30 매트 중급은 '대기 등록' 버튼으로 나타나고 누르면 '대기 중'으로 추가되면 성공.
3. 화면을 좁혀도 안 깨지는가 — 브라우저 창을 휴대폰처럼 좁게 줄여도 카드와 글자가 겹치거나 잘리지 않고 세로로 잘 정렬되면 성공.

---

### 마음에 안 들 때 그대로 붙여넣어 쓸 "다음 수정 요청" 문장 (3개)

1. 색을 바꾸고 싶을 때: "지금은 분홍 파스텔인데, 전체를 민트/초록 파스텔 톤으로 바꿔주세요. 버튼과 강조 색도 같이 바꿔주세요."
2. 버튼이나 항목을 더 넣고 싶을 때: "시간표에 '수 07:00 아침 기구 초급(정원 6명 중 2명)' 수업을 하나 더 추가해주세요. 그리고 각 예약 항목에 '예약 취소' 버튼을 넣어 누르면 내 예약에서 빠지게 해주세요."
3. 글자·문구를 바꾸고 싶을 때: "스튜디오 이름을 '필라핏'에서 '○○필라테스'로 바꾸고, 맨 위 소개 문구를 '오늘도 코어 단단하게 💪'로 바꿔주세요."
