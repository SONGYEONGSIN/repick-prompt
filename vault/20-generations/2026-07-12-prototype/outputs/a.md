아래는 요청하신 필라테스 스튜디오 예약·노쇼 관리 서비스 **'필라핏'**의 작동하는 프로토타입입니다. HTML 파일 하나에 디자인과 동작을 모두 담았고, 인터넷 연결 없이 더블클릭만으로 열립니다.

## 완성된 HTML 전체 코드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>필라핏 · 우리 동네 필라테스 예약</title>
<style>
  :root{
    --bg:#fbf7f4;
    --card:#ffffff;
    --primary:#e7a7b1;      /* 파스텔 로즈 */
    --primary-deep:#d98595;
    --mint:#a8d8cf;
    --mint-deep:#7cc0b4;
    --lavender:#c9c1ec;
    --ink:#4a4550;
    --ink-soft:#8a8494;
    --line:#efe7e2;
    --full:#f0b7a0;
    --waitlist:#f4d06f;
    --shadow:0 6px 22px rgba(180,150,160,.16);
    --radius:18px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    font-family:'Apple SD Gothic Neo','Malgun Gothic',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    background:linear-gradient(180deg,#fdf6f3 0%,#f6f1fb 100%);
    color:var(--ink);
    line-height:1.5;
    -webkit-font-smoothing:antialiased;
    padding-bottom:40px;
  }
  header{
    background:linear-gradient(120deg,#f5c6cf 0%,#d9c8ef 100%);
    padding:22px 20px 26px;
    border-radius:0 0 26px 26px;
    box-shadow:var(--shadow);
    position:relative;
    overflow:hidden;
  }
  header::after{
    content:"";
    position:absolute;
    right:-30px;top:-30px;
    width:130px;height:130px;
    background:rgba(255,255,255,.28);
    border-radius:50%;
  }
  .brand{display:flex;align-items:center;gap:10px;position:relative;z-index:1;}
  .brand .logo{
    width:42px;height:42px;border-radius:14px;
    background:#fff;display:flex;align-items:center;justify-content:center;
    font-size:22px;box-shadow:0 3px 10px rgba(0,0,0,.08);
  }
  .brand h1{font-size:22px;color:#fff;letter-spacing:-.5px;text-shadow:0 1px 4px rgba(180,120,140,.25);}
  .brand p{font-size:12.5px;color:#fff;opacity:.92;margin-top:2px;}
  .studio-line{
    margin-top:14px;position:relative;z-index:1;
    display:flex;flex-wrap:wrap;gap:8px;
  }
  .chip{
    background:rgba(255,255,255,.85);
    color:var(--ink);
    font-size:12px;font-weight:600;
    padding:6px 11px;border-radius:999px;
    display:inline-flex;align-items:center;gap:5px;
  }

  .wrap{max-width:960px;margin:0 auto;padding:0 16px;}
  section{margin-top:24px;}
  .sec-title{
    display:flex;align-items:center;justify-content:space-between;
    margin:0 4px 12px;
  }
  .sec-title h2{font-size:17px;letter-spacing:-.3px;}
  .sec-title h2 .ico{margin-right:6px;}
  .sec-title .hint{font-size:12px;color:var(--ink-soft);}

  /* 요일 탭 */
  .day-tabs{
    display:flex;gap:8px;overflow-x:auto;padding:4px 4px 10px;
    -webkit-overflow-scrolling:touch;scrollbar-width:none;
  }
  .day-tabs::-webkit-scrollbar{display:none;}
  .day-tab{
    flex:0 0 auto;
    min-width:64px;text-align:center;
    background:var(--card);border:1.5px solid var(--line);
    border-radius:16px;padding:9px 6px;cursor:pointer;
    transition:.18s;user-select:none;
  }
  .day-tab .dow{font-size:12px;color:var(--ink-soft);font-weight:600;}
  .day-tab .date{font-size:16px;font-weight:700;margin-top:2px;}
  .day-tab.active{
    background:var(--primary);border-color:var(--primary);
    box-shadow:0 4px 12px rgba(217,133,149,.35);
  }
  .day-tab.active .dow,.day-tab.active .date{color:#fff;}
  .day-tab.today .date::after{
    content:"·";display:block;line-height:0;color:var(--mint-deep);font-size:26px;
  }

  /* 수업 카드 */
  .class-grid{display:grid;grid-template-columns:1fr;gap:12px;}
  @media(min-width:640px){.class-grid{grid-template-columns:1fr 1fr;}}
  .class-card{
    background:var(--card);border-radius:var(--radius);
    box-shadow:var(--shadow);padding:16px 16px 14px;
    border:1.5px solid transparent;
    display:flex;flex-direction:column;gap:10px;
    transition:.18s;
  }
  .class-card.mine{border-color:var(--mint);background:linear-gradient(180deg,#f4fbf9,#fff);}
  .cc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
  .cc-time{
    font-size:13px;font-weight:700;color:var(--primary-deep);
    background:#fdeef0;padding:4px 10px;border-radius:999px;white-space:nowrap;
  }
  .cc-title{font-size:16px;font-weight:700;letter-spacing:-.3px;margin-top:2px;}
  .cc-sub{font-size:12.5px;color:var(--ink-soft);margin-top:3px;}
  .cc-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;}
  .badge{
    font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;
  }
  .badge.level{background:#f1edfb;color:#7a6bb5;}
  .seat{display:flex;align-items:center;gap:6px;font-weight:600;}
  .seat .bar{width:70px;height:7px;background:#efe7e2;border-radius:6px;overflow:hidden;}
  .seat .bar span{display:block;height:100%;background:var(--mint-deep);border-radius:6px;}
  .seat.low .bar span{background:var(--full);}
  .seat .txt{font-size:12px;color:var(--ink-soft);}
  .seat .txt b{color:var(--ink);}

  .cc-actions{margin-top:2px;}
  .btn{
    width:100%;border:none;cursor:pointer;
    font-size:14.5px;font-weight:700;letter-spacing:-.2px;
    padding:12px;border-radius:14px;transition:.15s;
    font-family:inherit;
  }
  .btn:active{transform:scale(.98);}
  .btn-book{background:var(--primary);color:#fff;box-shadow:0 4px 12px rgba(217,133,149,.32);}
  .btn-book:hover{background:var(--primary-deep);}
  .btn-wait{background:var(--waitlist);color:#7a5a12;}
  .btn-wait:hover{filter:brightness(.97);}
  .btn-booked{background:#eef7f4;color:var(--mint-deep);border:1.5px solid var(--mint);}
  .btn-waiting{background:#fbf3d6;color:#8a6d1f;border:1.5px solid var(--waitlist);}
  .btn-cancel-inline{background:transparent;color:var(--ink-soft);font-size:12.5px;font-weight:600;padding:8px;}

  .full-tag{
    font-size:11.5px;font-weight:700;color:#c56a48;
    background:#fdeee7;padding:3px 9px;border-radius:999px;
  }

  /* 내 예약 목록 */
  .mylist{display:flex;flex-direction:column;gap:10px;}
  .my-item{
    background:var(--card);border-radius:16px;box-shadow:var(--shadow);
    padding:14px 15px;display:flex;align-items:center;gap:12px;
    border-left:5px solid var(--mint-deep);
  }
  .my-item.wait{border-left-color:var(--waitlist);}
  .my-when{
    text-align:center;min-width:52px;
  }
  .my-when .d{font-size:12px;color:var(--ink-soft);font-weight:600;}
  .my-when .t{font-size:15px;font-weight:800;color:var(--primary-deep);}
  .my-info{flex:1;min-width:0;}
  .my-info .n{font-size:15px;font-weight:700;}
  .my-info .s{font-size:12px;color:var(--ink-soft);margin-top:2px;}
  .my-status{
    font-size:11.5px;font-weight:700;padding:4px 9px;border-radius:999px;white-space:nowrap;
  }
  .my-status.ok{background:#eaf6f2;color:var(--mint-deep);}
  .my-status.wt{background:#fbf3d6;color:#8a6d1f;}
  .my-cancel{
    background:#fbeff1;color:var(--primary-deep);border:none;
    font-size:12px;font-weight:700;padding:8px 11px;border-radius:11px;cursor:pointer;font-family:inherit;
  }
  .my-cancel:active{transform:scale(.96);}
  .empty{
    text-align:center;color:var(--ink-soft);font-size:13.5px;
    background:var(--card);border-radius:16px;padding:28px 16px;box-shadow:var(--shadow);
    border:1.5px dashed var(--line);
  }
  .empty .big{font-size:26px;display:block;margin-bottom:8px;}

  /* 요약 카드 */
  .summary{
    display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;
  }
  .sum-box{
    background:var(--card);border-radius:16px;box-shadow:var(--shadow);
    padding:14px 10px;text-align:center;
  }
  .sum-box .num{font-size:22px;font-weight:800;color:var(--primary-deep);}
  .sum-box.mint .num{color:var(--mint-deep);}
  .sum-box.lav .num{color:#7a6bb5;}
  .sum-box .lbl{font-size:11.5px;color:var(--ink-soft);margin-top:3px;}

  /* 토스트 */
  .toast{
    position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(30px);
    background:var(--ink);color:#fff;font-size:13.5px;font-weight:600;
    padding:12px 20px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.22);
    opacity:0;pointer-events:none;transition:.3s;z-index:99;max-width:90%;text-align:center;
  }
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  footer{text-align:center;color:var(--ink-soft);font-size:11.5px;margin-top:34px;padding:0 16px;}

  @media(max-width:380px){
    .brand h1{font-size:20px;}
    .cc-title{font-size:15px;}
  }
</style>
</head>
<body>

<header>
  <div class="wrap">
    <div class="brand">
      <div class="logo">🧘‍♀️</div>
      <div>
        <h1>필라핏</h1>
        <p>연희동 필라테스 · 회원 예약 앱</p>
      </div>
    </div>
    <div class="studio-line">
      <span class="chip">📍 연희동 스튜디오</span>
      <span class="chip">👋 안녕하세요, 지은 님</span>
      <span class="chip">🎫 잔여 수강권 8회</span>
    </div>
  </div>
</header>

<div class="wrap">

  <!-- 요일 선택 -->
  <section>
    <div class="sec-title">
      <h2><span class="ico">🗓️</span>주간 시간표</h2>
      <span class="hint">7월 셋째 주</span>
    </div>
    <div class="day-tabs" id="dayTabs"></div>
  </section>

  <!-- 수업 목록 -->
  <section>
    <div class="sec-title">
      <h2><span class="ico">💗</span><span id="dayLabel">오늘</span> 수업</h2>
      <span class="hint">잔여석을 확인하고 예약하세요</span>
    </div>
    <div class="class-grid" id="classGrid"></div>
  </section>

  <!-- 내 예약 -->
  <section>
    <div class="sec-title">
      <h2><span class="ico">📌</span>내 예약 목록</h2>
      <span class="hint">예약·대기 현황</span>
    </div>
    <div class="summary">
      <div class="sum-box"><div class="num" id="sumBook">0</div><div class="lbl">예약 확정</div></div>
      <div class="sum-box lav"><div class="num" id="sumWait">0</div><div class="lbl">대기 중</div></div>
      <div class="sum-box mint"><div class="num" id="sumTotal">0</div><div class="lbl">이번 주 총</div></div>
    </div>
    <div class="mylist" id="myList" style="margin-top:14px;"></div>
  </section>

  <footer>
    필라핏 프로토타입 · 실제 결제/로그인은 연결되어 있지 않습니다 🌸<br>
    노쇼는 스튜디오 규정에 따라 수강권이 차감될 수 있어요.
  </footer>
</div>

<div class="toast" id="toast"></div>

<script>
/* ------------------------------------------------------------------
   필라핏 · 데이터 & 로직 (외부 라이브러리 없음)
------------------------------------------------------------------ */

// 요일 데이터 (오늘 = 수요일 가정)
const days = [
  {dow:'월', date:'14'},
  {dow:'화', date:'15'},
  {dow:'수', date:'16', today:true},
  {dow:'목', date:'17'},
  {dow:'금', date:'18'},
  {dow:'토', date:'19'},
  {dow:'일', date:'20'},
];

// 수업 데이터 (요일 인덱스별). booked=현재 예약 인원, cap=정원
let classes = {
  0:[ // 월
    {id:'m1', time:'07:00', dur:'50분', name:'모닝 리포머 플로우', teacher:'김하늘 강사', level:'초급', booked:5, cap:8},
    {id:'m2', time:'10:30', dur:'50분', name:'코어 집중 매트', teacher:'박서연 강사', level:'중급', booked:8, cap:8},
    {id:'m3', time:'19:00', dur:'50분', name:'퇴근 후 릴렉스 스트레칭', teacher:'이가은 강사', level:'전체', booked:6, cap:10},
  ],
  1:[ // 화
    {id:'t1', time:'08:00', dur:'50분', name:'체형교정 리포머', teacher:'정유진 강사', level:'초급', booked:7, cap:8},
    {id:'t2', time:'12:00', dur:'40분', name:'런치 코어 번', teacher:'박서연 강사', level:'중급', booked:4, cap:8},
    {id:'t3', time:'20:00', dur:'50분', name:'딥 스트레칭 & 힐링', teacher:'이가은 강사', level:'전체', booked:9, cap:10},
  ],
  2:[ // 수 (오늘)
    {id:'w1', time:'07:00', dur:'50분', name:'모닝 리포머 플로우', teacher:'김하늘 강사', level:'초급', booked:6, cap:8},
    {id:'w2', time:'10:30', dur:'50분', name:'골반 안정화 필라테스', teacher:'정유진 강사', level:'중급', booked:8, cap:8},
    {id:'w3', time:'18:00', dur:'50분', name:'거북목 개선 집중반', teacher:'박서연 강사', level:'전체', booked:5, cap:8},
    {id:'w4', time:'20:00', dur:'50분', name:'하체라인 리포머', teacher:'이가은 강사', level:'중급', booked:3, cap:6},
  ],
  3:[ // 목
    {id:'th1', time:'09:00', dur:'50분', name:'아침 코어 매트', teacher:'김하늘 강사', level:'초급', booked:4, cap:10},
    {id:'th2', time:'19:00', dur:'50분', name:'전신 순환 리포머', teacher:'정유진 강사', level:'중급', booked:8, cap:8},
    {id:'th3', time:'20:30', dur:'40분', name:'자기 전 이완 요가필라', teacher:'이가은 강사', level:'전체', booked:7, cap:10},
  ],
  4:[ // 금
    {id:'f1', time:'07:30', dur:'50분', name:'불금 파워 코어', teacher:'박서연 강사', level:'중급', booked:6, cap:8},
    {id:'f2', time:'11:00', dur:'50분', name:'체형교정 리포머', teacher:'정유진 강사', level:'초급', booked:5, cap:8},
    {id:'f3', time:'18:30', dur:'50분', name:'주말 앞두고 릴렉스', teacher:'김하늘 강사', level:'전체', booked:10, cap:10},
  ],
  5:[ // 토
    {id:'s1', time:'10:00', dur:'50분', name:'주말 오전 전신 리포머', teacher:'이가은 강사', level:'전체', booked:7, cap:8},
    {id:'s2', time:'11:30', dur:'50분', name:'코어 & 밸런스', teacher:'박서연 강사', level:'중급', booked:8, cap:8},
    {id:'s3', time:'14:00', dur:'40분', name:'주말 힐링 스트레칭', teacher:'김하늘 강사', level:'초급', booked:3, cap:10},
  ],
  6:[ // 일
    {id:'su1', time:'10:00', dur:'50분', name:'일요 모닝 플로우', teacher:'정유진 강사', level:'전체', booked:5, cap:10},
    {id:'su2', time:'16:00', dur:'50분', name:'한 주 마무리 이완', teacher:'이가은 강사', level:'초급', booked:6, cap:8},
  ],
};

// 내 예약 (초기 예시 데이터 - 진짜처럼 미리 채움)
let reservations = [
  {classId:'w1', dayIdx:2, status:'booked'},   // 수 07:00 모닝 리포머 (예약 확정)
  {classId:'th2', dayIdx:3, status:'wait',  waitNo:2}, // 목 19:00 전신 순환 (대기 2번)
  {classId:'s1', dayIdx:5, status:'booked'},   // 토 10:00 주말 전신 (예약 확정)
];
// 초기 예약분을 booked 인원에 반영
reservations.forEach(r=>{
  if(r.status==='booked'){
    const c = findClass(r.dayIdx, r.classId);
    // s1은 데이터상 7 → 내 예약 포함으로 보이게 유지 (이미 반영된 수치로 취급)
  }
});

let activeDay = 2; // 오늘(수)

function findClass(dayIdx, id){
  return (classes[dayIdx]||[]).find(c=>c.id===id);
}
function myRes(dayIdx, id){
  return reservations.find(r=>r.dayIdx===dayIdx && r.classId===id);
}

/* ---------- 렌더링 ---------- */
function renderDays(){
  const box = document.getElementById('dayTabs');
  box.innerHTML = '';
  days.forEach((d,i)=>{
    const el = document.createElement('div');
    el.className = 'day-tab' + (i===activeDay?' active':'') + (d.today?' today':'');
    el.innerHTML = `<div class="dow">${d.dow}</div><div class="date">${d.date}</div>`;
    el.onclick = ()=>{ activeDay=i; renderAll(); };
    box.appendChild(el);
  });
}

function renderClasses(){
  const grid = document.getElementById('classGrid');
  const label = document.getElementById('dayLabel');
  const d = days[activeDay];
  label.textContent = (d.today?'오늘 ':'') + `${d.date}일(${d.dow})`;

  grid.innerHTML = '';
  const list = classes[activeDay] || [];
  if(list.length===0){
    grid.innerHTML = '<div class="empty"><span class="big">🌙</span>이 날은 열린 수업이 없어요.</div>';
    return;
  }

  list.forEach(c=>{
    const left = c.cap - c.booked;
    const isFull = left<=0;
    const mine = myRes(activeDay, c.id);
    const lowClass = (left<=2 && !isFull) ? ' low' : '';
    const pct = Math.min(100, Math.round(c.booked/c.cap*100));

    // 액션 버튼 결정
    let action = '';
    if(mine && mine.status==='booked'){
      action = `<button class="btn btn-booked" onclick="cancel('${c.id}')">✔ 예약됨 · 취소하기</button>`;
    } else if(mine && mine.status==='wait'){
      action = `<button class="btn btn-waiting" onclick="cancel('${c.id}')">⏳ 대기 ${mine.waitNo}번 · 취소</button>`;
    } else if(isFull){
      action = `<button class="btn btn-wait" onclick="waitlist('${c.id}')">🕑 대기 등록</button>`;
    } else {
      action = `<button class="btn btn-book" onclick="book('${c.id}')">예약하기</button>`;
    }

    const seatHtml = isFull
      ? `<span class="full-tag">정원 마감</span>`
      : `<div class="seat${lowClass}"><div class="bar"><span style="width:${pct}%"></span></div><span class="txt">잔여 <b>${left}</b>석</span></div>`;

    const card = document.createElement('div');
    card.className = 'class-card' + (mine?' mine':'');
    card.innerHTML = `
      <div class="cc-top">
        <div>
          <div class="cc-title">${c.name}</div>
          <div class="cc-sub">${c.teacher} · ${c.dur}</div>
        </div>
        <span class="cc-time">${c.time}</span>
      </div>
      <div class="cc-meta">
        <span class="badge level">${c.level}</span>
        ${seatHtml}
      </div>
      <div class="cc-actions">${action}</div>
    `;
    grid.appendChild(card);
  });
}

function renderMyList(){
  const box = document.getElementById('myList');
  box.innerHTML = '';

  if(reservations.length===0){
    box.innerHTML = '<div class="empty"><span class="big">🗒️</span>아직 예약한 수업이 없어요.<br>위 시간표에서 마음에 드는 수업을 골라보세요!</div>';
  } else {
    // 요일 순 정렬
    const sorted = [...reservations].sort((a,b)=> a.dayIdx-b.dayIdx || (findClass(a.dayIdx,a.classId).time > findClass(b.dayIdx,b.classId).time ? 1:-1));
    sorted.forEach(r=>{
      const c = findClass(r.dayIdx, r.classId);
      if(!c) return;
      const d = days[r.dayIdx];
      const isWait = r.status==='wait';
      const item = document.createElement('div');
      item.className = 'my-item' + (isWait?' wait':'');
      item.innerHTML = `
        <div class="my-when">
          <div class="d">${d.date}(${d.dow})</div>
          <div class="t">${c.time}</div>
        </div>
        <div class="my-info">
          <div class="n">${c.name}</div>
          <div class="s">${c.teacher} · ${c.dur}</div>
        </div>
        ${isWait
          ? `<span class="my-status wt">대기 ${r.waitNo}번</span>`
          : `<span class="my-status ok">예약 확정</span>`}
        <button class="my-cancel" onclick="cancel('${c.id}', ${r.dayIdx})">취소</button>
      `;
      box.appendChild(item);
    });
  }

  // 요약 숫자
  const bk = reservations.filter(r=>r.status==='booked').length;
  const wt = reservations.filter(r=>r.status==='wait').length;
  document.getElementById('sumBook').textContent = bk;
  document.getElementById('sumWait').textContent = wt;
  document.getElementById('sumTotal').textContent = reservations.length;
}

function renderAll(){
  renderDays();
  renderClasses();
  renderMyList();
}

/* ---------- 동작 ---------- */
function book(id){
  const c = findClass(activeDay, id);
  if(!c) return;
  if(c.cap - c.booked <= 0){ waitlist(id); return; }
  c.booked++;
  reservations.push({classId:id, dayIdx:activeDay, status:'booked'});
  showToast(`💗 '${c.name}' 예약 완료! (${c.time})`);
  renderAll();
}

function waitlist(id){
  const c = findClass(activeDay, id);
  if(!c) return;
  // 이미 대기중인 사람 수 + 1
  const waitCount = reservations.filter(r=>r.classId===id && r.status==='wait').length;
  const no = waitCount + 1;
  reservations.push({classId:id, dayIdx:activeDay, status:'wait', waitNo:no});
  showToast(`🕑 '${c.name}' 대기 ${no}번으로 등록됐어요. 자리가 나면 알려드릴게요!`);
  renderAll();
}

function cancel(id, dayIdx){
  const dIdx = (dayIdx===undefined) ? activeDay : dayIdx;
  const idx = reservations.findIndex(r=>r.classId===id && r.dayIdx===dIdx);
  if(idx<0) return;
  const r = reservations[idx];
  const c = findClass(dIdx, id);
  // 확정 예약이면 좌석 반환
  if(r.status==='booked' && c){ c.booked = Math.max(0, c.booked-1); }
  reservations.splice(idx,1);
  showToast(`예약을 취소했어요${c?` · '${c.name}'`:''}`);
  renderAll();
}

/* ---------- 토스트 ---------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------- 시작 ---------- */
renderAll();
</script>
</body>
</html>
```

---

## 이 파일을 여는 방법 (3단계)

1. **메모장(윈도우) 또는 텍스트편집기(맥)를 엽니다.** 맥의 '텍스트편집'을 쓸 때는 상단 메뉴 `포맷 → 일반 텍스트로 만들기`를 먼저 눌러 주세요.
2. **위 코드 블록을 통째로 복사해 붙여넣고**, `필라핏.html` 이라는 이름으로 저장합니다. (파일 이름 끝이 반드시 `.html` 로 끝나야 합니다.)
3. **저장한 `필라핏.html` 파일을 더블클릭**하면 크롬·사파리 같은 브라우저에서 화면이 바로 열립니다.

---

## 잘 만들어졌는지 확인하는 체크리스트 (3개)

1. **화면이 뜨는가** — 더블클릭하면 위쪽에 분홍·라벤더 그라데이션의 '필라핏' 헤더와 요일 탭, 수업 카드, 내 예약 목록이 보이나요?
2. **핵심 버튼이 반응하는가** — 잔여석이 있는 수업의 `예약하기`를 누르면 아래 '토스트' 알림이 뜨고 '내 예약 목록'에 추가되며, 정원이 찬 수업(예: 수요일 10:30 골반 안정화)은 노란 `대기 등록` 버튼으로 보이나요? 예약된 카드의 `취소하기`를 누르면 잔여석이 다시 늘어나나요?
3. **휴대폰 크기에서도 보이는가** — 브라우저 창을 휴대폰처럼 좁게 줄였을 때 수업 카드가 한 줄로 세로 정렬되고 글자·버튼이 깨지지 않나요?

---

## 다음에 고치고 싶을 때 그대로 복사해 쓸 수정 요청 문장 (2개)

1. `"필라핏 전체 색을 파스텔 블루·민트 계열로 바꿔주고, 헤더의 스튜디오 이름을 '망원동 스튜디오'로 수정해줘."`
2. `"수업 카드에 '난이도(초급/중급)'뿐 아니라 '수업 강도(별 1~3개)'도 함께 표시되게 추가해줘."`
