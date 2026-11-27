(function () {
  "use strict";

  /* ---------- 아이콘 ---------- */
  const I = {
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.5 3 3 6-7"/></svg>',
    checkCircle: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.2"/><path d="m5.4 8.2 1.8 1.8 3.4-3.8"/></svg>',
    alert: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.6 3.4 2.3 14.6A1.6 1.6 0 0 0 3.7 17h12.6a1.6 1.6 0 0 0 1.4-2.4L11.4 3.4a1.6 1.6 0 0 0-2.8 0Z"/><path d="M10 8v3.5"/><circle cx="10" cy="14" r=".6" fill="currentColor"/></svg>',
    warn: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10" cy="10" r="7.2"/><path d="M10 6.2v4.6"/><circle cx="10" cy="13.6" r=".6" fill="currentColor"/></svg>',
    dash: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 8h6"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h12"/><path d="m12 6 4 4-4 4"/></svg>',
    back: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.5 5.5 8l4.5 4.5"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 3.5v9M3.5 8h9"/></svg>',
    minus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3.5 8h9"/></svg>',
    fit: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"/></svg>',
    spark: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c.3 2.9 1.6 4.2 4.5 4.5-2.9.3-4.2 1.6-4.5 4.5-.3-2.9-1.6-4.2-4.5-4.5C6.4 5.7 7.7 4.4 8 1.5Z"/><path d="M12.6 9.6c.15 1.3.75 1.9 2.05 2.05-1.3.15-1.9.75-2.05 2.05-.15-1.3-.75-1.9-2.05-2.05 1.3-.15 1.9-.75 2.05-2.05Z" opacity=".7"/></svg>',
    lock: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="9" width="12" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg>',
    clock: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 1.6"/></svg>',
    trash: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h12M8 6V4.5h4V6M6 6l.7 10h6.6L14 6"/></svg>',
    doc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 2.5h6.5L15 6v11.5H5z"/><path d="M11.5 2.5V6H15"/></svg>',
    blur: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M9 11h6M9 14.5h3"/><path d="m3 3 18 18"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M10 10.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.4"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.2l2.6 1.6M9.5 2.8h5"/></svg>',
    link: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6.5 9.5 9.5 6.5"/><path d="M7 4.6 8.3 3.3a2.6 2.6 0 0 1 3.7 3.7L10.7 8.3M5.3 7.7 4 9a2.6 2.6 0 0 0 3.7 3.7L9 11.4"/></svg>'
  };

  /* ---------- 상태 ---------- */
  const S = { scn: "inv", scr: "upload", file: null, fileErr: null, checks: {}, filter: "all", zoom: 0.92, errKind: "read", timers: [] };
  const $ = (q, el) => (el || document).querySelector(q);
  const $$ = (q, el) => Array.from((el || document).querySelectorAll(q));
  const screen = $("#screen");

  const T = (s) => String(s).replace(/\{\{(\w+)\|([^}]+)\}\}/g, (m, k, txt) => {
    const t = TERMS[k] || {};
    return `<span class="term${t.unreg ? " unreg" : ""}" tabindex="0" data-term="${k}">${txt}</span>`;
  });
  const amt = (n, cur, bad) => {
    const [i, d] = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(".");
    return `<div class="amt num${bad ? " bad" : ""}">${i}<span class="dec">.${d}</span><span class="cur">${cur}</span></div>`;
  };
  const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const clearTimers = () => { S.timers.forEach(clearTimeout); S.timers = []; };
  const sc = () => SCENARIOS[S.scn];

  /* ---------- 원문 종이 ---------- */
  function paperHTML(s) {
    const p = s.paper;
    const lines = (a) => a.map((x, i) => i === 0 ? `<b style="all:unset;font-weight:700">${x}</b>` : x).join("<br>");
    const items = s.items.map((it) => `<tr><td>${it.code}</td><td>${it.raw}</td><td class="r">${it.qty}</td><td class="r">${money(it.price)}</td>${s.kind === "invoice" ? `<td class="r">${it.disc || "–"}</td>` : ""}<td class="r">${money(it.total)}</td></tr>`).join("");
    if (s.kind === "po") {
      return `<div class="paper">
        <div class="p-head"><div><div class="p-logo"><i></i>GLOBAL BIKE RETAILERS</div><div class="p-addr" data-f="buyer">${lines(p.buyer)}</div></div><div class="p-title" data-f="title">PURCHASE<br>ORDER</div></div>
        <div class="p-meta"><dl class="p-kv"><dt>PO Number</dt><dd><span data-f="no">${p.no}</span></dd><dt>PO Date</dt><dd><span data-f="date">${p.date}</span></dd><dt>Currency</dt><dd><span data-f="cur">${p.cur}</span></dd></dl>
          <dl class="p-kv"><dt>Latest Shipment</dt><dd><span data-f="shipdate">${p.shipdate}</span></dd><dt>Incoterms</dt><dd><span data-f="inco">${p.inco}</span></dd><dt>Carrier</dt><dd><span data-f="carrier">${p.carrier}</span></dd></dl></div>
        <div class="p-parties"><div data-f="vendor"><b>Vendor</b>${lines(p.vendor)}</div><div data-f="deliver"><b>Deliver To</b>${lines(p.deliver)}</div></div>
        <table class="p-items" data-f="items"><thead><tr><th>Item</th><th>Description</th><th class="r">Qty</th><th class="r">Unit Price</th><th class="r">Amount</th></tr></thead><tbody>${items}</tbody></table>
        <div class="p-bottom"><div><span class="p-sec">Payment Terms</span><span data-f="payterms">${p.payterms}</span><div style="margin-top:8px"><span class="p-sec">Port of Loading / Discharge</span>${p.pol} → ${p.pod}</div></div>
          <div class="p-totals"><div data-f="subtotal"><span>Subtotal</span><span>${p.subtotal}</span></div><div class="grand" data-f="total"><span>Total (EUR)</span><span>${p.total}</span></div></div></div>
        <div class="p-notes" data-f="notes"><span class="p-sec">Special Instructions</span>${p.notes}</div>
        <div class="p-sign"><span>Authorized by: M. Weber, Purchasing</span><span>Page 1 of 1</span></div></div>`;
    }
    return `<div class="paper">
      <div class="p-head"><div><div class="p-logo"><i></i>ATLAS CYCLES</div><div class="p-addr" data-f="seller">${lines(p.seller)}</div></div><div class="p-title" data-f="title">${p.title}</div></div>
      <div class="p-meta"><dl class="p-kv"><dt>Invoice No.</dt><dd><span data-f="no">${p.no}</span></dd><dt>Invoice Date</dt><dd><span data-f="date">${p.date}</span></dd>${p.due ? `<dt>Due Date</dt><dd><span data-f="due">${p.due}</span></dd>` : ""}</dl>
        <dl class="p-kv"><dt>Terms</dt><dd><span data-f="terms">${p.terms}</span></dd><dt>Currency</dt><dd><span data-f="cur">${p.cur}</span></dd><dt>Customer ID</dt><dd>HB-2291</dd></dl></div>
      <div class="p-parties"><div data-f="billto"><b>Bill To</b>${lines(p.billto)}</div><div data-f="shipto"><b>Ship To</b>${lines(p.shipto)}</div></div>
      <table class="p-items" data-f="items"><thead><tr><th>Item</th><th>Description</th><th class="r">Qty</th><th class="r">Unit Price</th><th class="r">Disc.</th><th class="r">Amount</th></tr></thead><tbody>${items}</tbody></table>
      <div class="p-bottom"><div data-f="bank"><span class="p-sec">Payment Details</span>Method: <span data-f="method">${p.method}</span><br>Bank: ${p.bank}<br>IBAN: <span data-f="iban">${p.iban}</span><br>SWIFT/BIC: <span data-f="swift">${p.swift}</span></div>
        <div class="p-totals"><div data-f="subtotal"><span>Subtotal</span><span>${p.subtotal}</span></div><div data-f="discount"><span>Discount</span><span>${p.discount}</span></div><div data-f="freight"><span>Freight</span><span>${p.freight}</span></div><div data-f="tax"><span>VAT</span><span>${p.tax}</span></div><div class="grand" data-f="total"><span>Total (GBP)</span><span>${p.total}</span></div></div></div>
      <div class="p-notes" data-f="notes"><span class="p-sec">Notes</span>${p.notes}</div>
      <div class="p-sign"><span>Thank you for your business.</span><span>Page 1 of 1</span></div></div>`;
  }

  /* ---------- S1 시작·업로드 ---------- */
  function renderUpload() {
    let zone;
    if (S.file && !S.fileErr) {
      const ext = S.file.name.split(".").pop().toUpperCase();
      zone = `<div class="dz-inner">
        <div class="file-chip"><span class="file-ic${ext === "PDF" ? "" : " img"}">${ext}</span>
          <div class="file-meta"><div class="file-name">${escapeHTML(S.file.name)}</div>
          <div class="file-sub"><span>${(S.file.size / 1048576).toFixed(1)} MB</span><span class="pill pill-ok">${I.check}지원 형식</span></div></div></div>
        <div class="dz-actions"><button class="btn btn-primary" id="go">분석 시작</button><button class="btn btn-ghost" id="pick2">다른 파일</button></div>
        <span class="muted" style="font-size:12px">시연: 올린 파일 대신 선택한 시나리오의 예시 결과를 보여 줘요</span></div>`;
    } else if (S.fileErr) {
      zone = `<div class="dz-inner"><div class="dz-icon" style="background:var(--danger-soft);color:var(--danger)">${I.alert}</div>
        <div class="dz-err">${S.fileErr.title}</div><div class="dz-sub">${S.fileErr.msg}</div>
        <div class="dz-actions"><button class="btn btn-primary" id="pick2">다른 파일 선택</button></div></div>`;
    } else {
      zone = `<div class="dz-inner"><div class="dz-icon">${I.upload}</div>
        <div class="dz-title">파일을 여기에 끌어다 놓으세요</div>
        <div class="dz-sub">또는 <button class="btn btn-primary btn-sm" id="pick" style="margin:0 4px">파일 선택</button></div>
        <div class="dz-rules"><span class="pill pill-mute">JPG · PNG · PDF</span><span class="pill pill-mute">1페이지</span><span class="pill pill-mute">최대 20MB</span><span class="pill pill-mute">영문 송장 · 발주서</span></div></div>`;
    }
    const samples = ["inv", "err", "po"].map((k) => {
      const s = SCENARIOS[k];
      return `<button class="sample" data-sample="${k}"><div class="sample-thumb">${paperHTML(s)}</div><div class="sample-body"><b>${s.sampleTitle}</b><span>${s.sampleDesc}</span></div></button>`;
    }).join("");
    screen.innerHTML = `<div class="s1">
      <div class="s1-hero"><span class="eyebrow">영문 송장 · 발주서 정리</span>
        <h2>해외 거래 서류, 올리면<br>한글로 정리해 드려요</h2>
        <p>거래정보 표, 쉬운 해설, 부서별 할 일까지 30초 안에 만들어요. 금액은 자동으로 검산해서 틀린 곳을 먼저 알려 드려요.</p></div>
      <div class="drop"><div class="drop-zone${S.fileErr ? " err" : ""}" id="dz" role="button" tabindex="0" aria-label="파일 올리기">${zone}</div></div>
      <div class="samples"><div class="samples-head"><h3>파일이 없으신가요? 예시 문서로 해 보세요</h3><span class="muted" style="font-size:12.5px">누르면 바로 분석을 시작해요</span></div>
        <div class="sample-grid">${samples}</div></div>
      <div class="trust">
        <div>${I.lock}<span><b>사내 서버에서만 처리</b>문서가 회사 밖으로 나가지 않아요</span></div>
        <div>${I.clock}<span><b>약 30초</b>1페이지 문서 기준</span></div>
        <div>${I.trash}<span><b>처리 후 자동 삭제</b>보관 기간은 팀 결정 후 표시 (제안: 24시간)</span></div>
      </div></div>`;

    const dz = $("#dz");
    const pick = () => $("#file").click();
    dz.addEventListener("click", (e) => { if (e.target.closest("#go")) return; if (!S.file || S.fileErr || e.target.closest("#pick2")) pick(); });
    dz.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target === dz) { e.preventDefault(); pick(); } });
    ["dragenter", "dragover"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); }));
    dz.addEventListener("drop", (e) => { const fs = e.dataTransfer && e.dataTransfer.files; if (fs && fs.length) acceptFile(fs[0], fs.length); });
    const go = $("#go");
    if (go) go.addEventListener("click", (e) => { e.stopPropagation(); go.disabled = true; go.textContent = "올리는 중…"; setTimeout(() => goTo("proc"), 350); });
    $$("[data-sample]").forEach((b) => b.addEventListener("click", () => { setScenario(b.dataset.sample, false); goTo("proc"); }));
  }

  function acceptFile(f, count) {
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    S.file = f; S.fileErr = null;
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext)) {
      S.fileErr = { title: `${ext.toUpperCase() || "이"} 파일은 지원하지 않아요`, msg: "PDF나 JPG·PNG 이미지로 저장해서 다시 올려 주세요." };
    } else if (f.size > 20 * 1048576) {
      S.fileErr = { title: "파일이 20MB보다 커요", msg: `지금 파일은 ${(f.size / 1048576).toFixed(1)}MB예요. 해상도를 낮춰 스캔하거나 PDF를 압축해서 올려 주세요.` };
    } else if (count > 1) {
      toast("한 번에 한 문서만 올릴 수 있어요. 첫 파일만 선택했어요.");
    }
    renderUpload();
  }

  /* ---------- S2 처리 중 ---------- */
  const STEPS = [
    { t: "문서 읽기", d: "글자와 표를 인식해 항목을 찾고 있어요", dur: 1500,
      dn: (s) => `항목 ${s.groups.reduce((a, g) => a + g.rows.length, 0)}개와 품목 ${s.items.length}줄을 찾았어요` },
    { t: "금액 검산", d: "품목 합계·세금·총액을 계산해 맞춰 보고 있어요", dur: 900,
      dn: (s) => s.issues.length ? `확인이 필요한 곳을 ${s.issues.length}건 찾았어요` : "모든 금액이 맞아요" },
    { t: "용어 확인 · 번역", d: "무역 용어집에서 용어를 찾아 한국어로 옮기고 있어요", dur: 1100,
      dn: (s) => `무역 용어 ${s.termIds.length}개를 찾아 정해진 번역으로 옮겼어요` },
    { t: "해설 · 할 일 작성", d: "쉬운 해설과 부서별 체크리스트를 쓰고 있어요", dur: 1300,
      dn: (s) => `해설과 할 일 ${Object.values(s.checklist).reduce((a, l) => a + l.length, 0)}개를 만들었어요` }
  ];
  function renderProc() {
    clearTimers();
    const s = sc();
    screen.innerHTML = `<div class="s2">
      <div class="scan-stage" id="stage">${paperHTML(s)}<div class="scan-line"></div></div>
      <div class="card proc"><div><h2>문서를 분석하고 있어요</h2><p class="lead">${escapeHTML(S.file && !S.fileErr ? S.file.name : s.file)}</p></div>
        <ol class="steps" id="steps">${STEPS.map((st, i) => `<li class="step wait" data-i="${i}"><span class="dot">${i + 1}</span><div><div class="st-title">${st.t}</div><div class="st-sub">${st.d}</div></div><span class="st-time"></span></li>`).join("")}</ol>
        <div class="bar"><i id="bar" style="width:4%"></i></div>
        <div class="proc-foot"><span id="elapsed">0.0초 경과 · 보통 30초 안에 끝나요</span><button class="btn btn-text" id="cancel">취소</button></div></div></div>`;
    document.title = "① 문서 읽기 · TradePilot";
    $("#cancel").addEventListener("click", () => { clearTimers(); goTo("upload"); });
    const total = STEPS.reduce((a, b) => a + b.dur, 0);
    const realTotal = parseFloat(s.procSec) * 1000;
    const t0 = performance.now();
    const tick = () => {
      const el = performance.now() - t0;
      const shown = Math.min(el / total * realTotal, realTotal) / 1000;
      const e = $("#elapsed"); if (!e) return;
      e.textContent = `${shown.toFixed(1)}초 경과 · 보통 30초 안에 끝나요`;
      $("#bar").style.width = Math.min(100, 4 + el / total * 96) + "%";
      if (el < total) S.timers.push(setTimeout(tick, 100));
    };
    tick();
    let acc = 0;
    const chipPos = [[8, 10], [52, 30], [14, 62], [50, 80]];
    STEPS.forEach((st, i) => {
      S.timers.push(setTimeout(() => {
        $$(".step").forEach((li, j) => {
          li.className = "step " + (j < i ? "done" : j === i ? "now" : "wait");
          const dot = $(".dot", li);
          dot.innerHTML = j < i ? I.check : j === i ? `<span class="spin" aria-hidden="true"></span>` : String(j + 1);
        });
        document.title = `${"①②③④"[i]} ${st.t} 중 · TradePilot`;
        const stage = $("#stage");
        if (stage && s.procChips[i]) {
          const bad = s.procChips[i].startsWith("!");
          const c = document.createElement("span");
          c.className = "chip-pop" + (bad ? " bad" : "");
          c.style.left = chipPos[i][0] + "%"; c.style.top = chipPos[i][1] + "%";
          c.innerHTML = `<span class="ck">${bad ? "!" : I.check}</span>${bad ? s.procChips[i].slice(1) : s.procChips[i]}`;
          stage.appendChild(c);
        }
      }, acc));
      acc += st.dur;
      S.timers.push(setTimeout(() => {
        const li = $$(".step")[i]; if (!li) return;
        li.className = "step done"; $(".dot", li).innerHTML = I.check;
        $(".st-sub", li).textContent = typeof st.dn === "function" ? st.dn(s) : st.dn;
        $(".st-time", li).textContent = (st.dur / total * parseFloat(s.procSec)).toFixed(1) + "초";
      }, acc));
    });
    S.timers.push(setTimeout(() => goTo("result"), acc + 450));
  }

  /* ---------- S3 결과 ---------- */
  function renderResult() {
    clearTimers();
    const s = sc();
    document.title = `${s.file} · TradePilot`;
    const ck = S.checks[s.id] || (S.checks[s.id] = {});
    const issueMap = {}; s.issues.forEach((x) => { issueMap[x.f] = x.sev; });

    const issuesHTML = s.issues.length ? `<section class="issues" aria-label="확인 필요">
      <div class="issues-head">${I.alert}확인이 필요한 곳이 ${s.issues.length}건 있어요<span class="cnt">오류 ${s.issues.filter((x) => x.sev === "error").length} · 주의 ${s.issues.filter((x) => x.sev === "warning").length}</span></div>
      ${s.issues.map((x) => `<div class="issue ${x.sev}"><span class="ic">${x.sev === "error" ? I.alert : I.warn}</span>
        <div><b>${x.title}</b><p>${x.msg}</p>${x.cmp ? `<div class="compare">${x.cmp.map((c) => `<div class="${c[2] ? "bad" : ""}"><small>${c[0]}</small><strong class="num">${c[1]} <span style="font-size:11.5px;color:var(--ink-3);font-weight:500">GBP</span></strong></div>`).join("")}</div>` : ""}</div>
        <button class="btn btn-ghost btn-sm" data-jump="${x.f}">표에서 보기</button></div>`).join("")}</section>` : "";

    const k = s.summary.key;
    const ddayPill = k.estimated ? `<span class="pill pill-warn">${I.warn}추정 · 확인 필요</span>` : k.dday <= 7 ? `<span class="pill pill-warn">D-${k.dday}</span>` : `<span class="pill pill-mute">D-${k.dday}</span>`;
    const summary = `<div class="summary">
      <div class="card sum"><div class="k">${s.kind === "po" ? "발주 총액" : "내야 할 금액"}${s.summary.totalBad ? `<span class="pill pill-danger">계산과 다름</span>` : ""}</div>${amt(s.summary.total, s.currency, !!s.summary.totalBad)}
        <div class="s">${s.summary.totalBad ? `계산한 총액 <b class="num" style="color:var(--ink)">${s.summary.totalBad.computed}</b> ${s.currency}` : s.kind === "po" ? "선지급 30% 6,298.50 · 잔금 14,696.50" : "품목 5종 · 할인 · 운송비 · 세금 포함"}</div></div>
      <div class="card sum"><div class="k">${k.label}${ddayPill}</div><div class="v2">${k.value}</div><div class="s">${k.sub}</div></div>
      <div class="card sum"><div class="k">거래 당사자</div><div class="party"><div><div class="pn">${s.summary.from.name}</div><div class="pc">${s.summary.from.c}</div></div><span class="arrow">${I.arrow}</span><div><div class="pn">${s.summary.to.name}</div><div class="pc">${s.summary.to.c}</div></div></div></div>
      <div class="card sum"><div class="k">금액 검산</div>${s.issues.length ? `<div class="chk-big bad"><i>${I.alert}</i>확인 필요 ${s.issues.length}건</div><div class="s">위 카드에서 이유를 확인하세요</div>` : `<div class="chk-big ok"><i>${I.check}</i>검산 통과</div><div class="s">품목 ${s.items.length}줄과 금액 ${s.totals.filter((t) => t.v != null).length}개 항목 계산 일치</div>`}</div></div>`;

    const groups = s.groups.map((g) => `<div class="group"><div class="group-title">${g.title}</div>
      ${g.route && s.route ? routeHTML(s.route) : ""}
      ${g.rows.map((r) => propHTML(r, issueMap[r.f] || r.issue)).join("")}</div>`).join("");

    const itemRows = s.items.map((it) => `<tr data-link="items"><td class="code">${it.code}</td><td>${it.ko}<span class="raw">${it.raw}</span></td><td class="r">${it.qty} ${it.unit}</td><td class="r">${money(it.price)}</td>${s.kind === "invoice" ? `<td class="r">${it.disc || '<span class="muted">–</span>'}</td>` : ""}<td class="r"><b>${money(it.total)}</b></td></tr>`).join("");
    const totals = s.totals.map((t) => {
      const iss = issueMap[t.f] || t.issue;
      const st = iss === "error" ? I.alert : t.v == null ? I.dash : I.checkCircle;
      return `<div class="trow${t.total ? " total" : ""}${iss ? " issue-" + iss : ""}" data-link="${t.f}" id="row-${t.f}"><span class="tl">${T(t.l)}</span><span class="tv">${t.v == null ? `<span class="muted" style="font-weight:400">문서에 없음</span><small>${t.note || ""}</small>` : `${t.v}${t.sub ? `<small>${t.sub}</small>` : ""}`}</span><span class="ps${t.v == null ? " none" : ""}" title="${iss === "error" ? "계산과 다름" : t.v == null ? "문서에 없음" : "계산 일치"}">${st}</span></div>`;
    }).join("");

    const allTodos = DEPTS.flatMap((d) => (s.checklist[d.id] || []).map((x, i) => ({ ...x, key: d.id + i })));
    const doneN = allTodos.filter((x) => ck[x.key]).length;
    const depts = DEPTS.map((d) => {
      let list = (s.checklist[d.id] || []).map((x, i) => ({ ...x, key: d.id + i }));
      const left = list.filter((x) => !ck[x.key]).length;
      if (S.filter === "imp") list = list.filter((x) => x.imp || x.check);
      if (S.filter === "due") list = list.filter((x) => x.due);
      const rows = list.length ? list.map((x) => todoHTML(x, ck[x.key])).join("") : `<div class="empty-row">${(s.checklist[d.id] || []).length ? "이 조건에 맞는 할 일이 없어요" : `이 문서에는 ${d.name} 부서 할 일이 없어요`}</div>`;
      return `<div class="dept"><div class="dept-head"><h4>${d.name}</h4><span class="left">${(s.checklist[d.id] || []).length ? `남은 할 일 ${left}개` : "해당 없음"}</span></div>${rows}</div>`;
    }).join("");

    screen.innerHTML = `
      <div class="r-head">
        <div class="r-file"><button class="btn btn-ghost btn-sm" id="new">${I.back}새 문서</button><span class="sep"></span><h2>${s.file}</h2><span class="pill pill-accent">${s.docBadge}</span></div>
        <div class="r-meta"><span class="legend"><span><span class="sw"></span>표 = 문서에서 읽은 값</span><span class="ai">${I.spark}AI가 쓴 글</span></span><span class="done-ck"><i>${I.check}</i>${s.procSec}초 만에 완료</span></div>
      </div>
      <div class="r-body">
        ${issuesHTML}
        ${summary}
        <div class="split">
          <aside class="card viewer" aria-label="원문">
            <div class="v-bar"><span><b style="color:var(--ink)">원문</b> · 1 / 1쪽</span>
              <span class="v-tools"><button id="zo" aria-label="축소">${I.minus}</button><span class="z" id="zv">${Math.round(S.zoom * 100)}%</span><button id="zi" aria-label="확대">${I.plus}</button><button id="zf" aria-label="화면에 맞춤">${I.fit}</button></span></div>
            <div class="v-canvas" id="canvas">${paperHTML(s)}</div>
          </aside>
          <div class="col">
            <nav class="rnav" aria-label="결과 영역"><a href="#sec-explain">쉬운 해설</a><a href="#sec-info">거래정보</a><a href="#sec-todo">부서별 할 일 <span class="n">${allTodos.length - doneN}</span></a></nav>
            <section class="card sec" id="sec-explain">
              <div class="sec-head"><h3>쉬운 해설</h3><span class="aside"><span class="ai">${I.spark}AI 작성</span></span></div>
              <div class="sec-body"><p class="explain">${T(s.explain)}</p>
                <p class="explain-note">${I.checkCircle.replace("<svg", '<svg class="ico"')}숫자와 날짜는 문서 값을 그대로 옮겼어요. 점선 밑줄 단어에 마우스를 올리면 뜻이 나와요.</p>
                <div class="terms"><div class="terms-head"><span>이 문서에 나온 무역 용어 ${s.termIds.length}개</span><span class="muted">출처: 팀 무역 용어집</span></div>
                  <div class="term-list">${s.termIds.map((id) => { const t = TERMS[id]; return `<span class="term-chip${t.unreg ? " unreg" : ""}" tabindex="0" data-term="${id}">${t.ko}<span class="raw">${t.raw}</span>${t.unreg ? '<span class="tag tag-warn">용어집 미등록</span>' : ""}</span>`; }).join("")}</div></div></div>
            </section>
            <section class="card sec" id="sec-info">
              <div class="sec-head"><h3>거래정보</h3><span class="aside">행에 마우스를 올리면 원문 위치가 표시돼요</span></div>
              ${groups}
              <div class="group"><div class="group-title">품목 ${s.items.length}개</div>
                <div class="tbl-wrap" style="padding:0 18px 4px"><table class="items" id="row-items"><thead><tr><th>코드</th><th>품명</th><th class="r">수량</th><th class="r">단가</th>${s.kind === "invoice" ? '<th class="r">할인</th>' : ""}<th class="r">금액 (${s.currency})</th></tr></thead><tbody>${itemRows}</tbody></table></div></div>
              <div class="group"><div class="group-title">금액 (${s.currency})</div><div class="totals">${totals}</div></div>
            </section>
            <section class="card sec" id="sec-todo">
              <div class="sec-head"><h3>부서별 할 일</h3><span class="aside"><span class="ai">${I.spark}AI 작성</span>· 금액·날짜는 문서 값</span></div>
              <div class="cl-top"><div class="cl-prog"><span class="t"><b>${allTodos.length}개 중 ${doneN}개</b> 완료</span><div class="bar"><i style="width:${allTodos.length ? doneN / allTodos.length * 100 : 0}%"></i></div></div>
                <span class="seg" id="flt"><button data-f="all" aria-pressed="${S.filter === "all"}">전체</button><button data-f="imp" aria-pressed="${S.filter === "imp"}">중요</button><button data-f="due" aria-pressed="${S.filter === "due"}">기한 있음</button></span></div>
              ${depts}
            </section>
            <p class="foot-note"><span>✦ 표시는 AI가 쓴 글이라 틀릴 수 있어요. 표의 값과 원문으로 확인하세요.</span><span>업로드 문서와 결과는 처리 후 자동 삭제돼요 (보관 기간 팀 결정 필요).</span></p>
          </div>
        </div>
      </div>`;

    // 원문 표시: 문제 칸
    s.issues.forEach((x) => { $$(`#canvas [data-f="${x.f}"]`).forEach((el) => el.classList.add(x.sev === "error" ? "bad" : "warnbox")); });
    applyZoom();
    $("#new").addEventListener("click", () => { S.file = null; S.fileErr = null; goTo("upload"); });
    $("#zi").addEventListener("click", () => { S.zoom = Math.min(1.6, S.zoom + 0.1); applyZoom(); });
    $("#zo").addEventListener("click", () => { S.zoom = Math.max(0.5, S.zoom - 0.1); applyZoom(); });
    $("#zf").addEventListener("click", () => { const c = $("#canvas"); S.zoom = Math.max(0.5, Math.min(1.6, (c.clientWidth - 40) / 600)); applyZoom(); });
    $$("[data-jump]").forEach((b) => b.addEventListener("click", () => jumpTo(b.dataset.jump)));
    $$(".todo .src button").forEach((b) => b.addEventListener("click", () => jumpTo(b.dataset.go)));
    $$(".cb").forEach((c) => c.addEventListener("change", () => { ck[c.dataset.k] = c.checked; const y = window.scrollY; renderResult(); window.scrollTo(0, y); }));
    $$("#flt button").forEach((b) => b.addEventListener("click", () => { S.filter = b.dataset.f; const y = window.scrollY; renderResult(); window.scrollTo(0, y); }));
    bindLinks();
  }

  function routeHTML(r) {
    return `<div class="route"><div class="route-line"><div class="port"><b>${r.from}</b><small>${r.fromSub}</small></div><div class="route-track"><i></i><span>${r.mark}</span></div><div class="port end"><b>${r.to}</b><small>${r.toSub}</small></div></div></div>`;
  }
  function propHTML(r, iss) {
    const missing = r.v == null;
    const st = iss === "error" ? I.alert : iss === "warning" ? I.warn : missing ? I.dash : I.checkCircle;
    const val = missing ? "문서에 없음" : T(r.v);
    return `<div class="prop${iss ? " issue-" + iss : ""}" data-link="${r.f}" id="row-${r.f}"><span class="pl">${T(r.l)}</span>
      <span class="pv${missing ? " missing" : ""}">${r.ai ? `<span class="ai" style="margin-right:4px">${I.spark}</span>` : ""}${val}${r.r ? `<span class="pr">${r.ai ? "원문: " : ""}${r.r}</span>` : ""}</span>
      <span class="ps${missing ? " none" : ""}" title="${iss === "error" ? "계산과 다름" : iss === "warning" ? "확인 필요" : missing ? "문서에 없음" : "문서에서 읽음"}">${st}</span></div>`;
  }
  function todoHTML(x, on) {
    const chip = x.due ? `<span class="date-chip${x.dday != null && x.dday <= 7 ? " soon" : ""}">${x.dday != null ? `D-${x.dday} · ` : ""}${x.due}</span>` : "";
    return `<div class="todo${on ? " checked" : ""}"><input type="checkbox" class="cb" id="cb-${S.scn}-${x.key}" data-k="${x.key}" ${on ? "checked" : ""} aria-label="${escapeHTML(x.t)}">
      <label for="cb-${S.scn}-${x.key}"><div class="tt">${x.t}</div></label>
      <div class="right">${x.check ? '<span class="tag tag-warn">확인 필요</span>' : ""}${x.imp ? '<span class="tag">중요</span>' : ""}${chip}</div>
      <span></span><div class="src">근거: ${x.src.map((p) => `<button data-go="${p[0]}">${p[1]}</button>`).join(" · ")}</div></div>`;
  }
  function applyZoom() { const p = $("#canvas .paper"); if (p) p.style.zoom = S.zoom; const z = $("#zv"); if (z) z.textContent = Math.round(S.zoom * 100) + "%"; }

  function bindLinks() {
    const hl = (f, on) => {
      $$(`#canvas [data-f="${f}"]`).forEach((el) => el.classList.toggle("hl", on));
      $$(`[data-link="${f}"]`).forEach((el) => el.classList.toggle("hl", on));
    };
    $$("[data-link]").forEach((row) => {
      row.addEventListener("mouseenter", () => { hl(row.dataset.link, true); const t = $(`#canvas [data-f="${row.dataset.link}"]`); if (t) scrollInCanvas(t); });
      row.addEventListener("mouseleave", () => hl(row.dataset.link, false));
    });
    $$("#canvas [data-f]").forEach((el) => {
      el.addEventListener("mouseenter", (e) => { e.stopPropagation(); hl(el.dataset.f, true); });
      el.addEventListener("mouseleave", () => hl(el.dataset.f, false));
    });
  }
  function scrollInCanvas(t) {
    const c = $("#canvas"); if (!c) return;
    const cr = c.getBoundingClientRect(), tr = t.getBoundingClientRect();
    if (tr.top < cr.top + 20 || tr.bottom > cr.bottom - 20) c.scrollTo({ top: c.scrollTop + (tr.top - cr.top) - c.clientHeight / 3, behavior: "smooth" });
  }
  function jumpTo(f) {
    const row = document.getElementById("row-" + f);
    if (!row) return;
    row.scrollIntoView({ block: "center", behavior: "smooth" });
    row.classList.remove("flash"); void row.offsetWidth; row.classList.add("flash");
    const t = $(`#canvas [data-f="${f}"]`); if (t) { t.classList.add("hl"); scrollInCanvas(t); setTimeout(() => t.classList.remove("hl"), 1800); }
  }

  /* ---------- S4 오류 ---------- */
  const ERRS = {
    read: { ic: I.blur, title: "문서 글자를 읽지 못했어요", msg: "흐리거나 기울어진 스캔일 수 있어요. 더 선명하게 다시 스캔해서 올려 주세요.",
      meta: [["이렇게 해 보세요", "300dpi 이상, 문서가 반듯하게 놓인 상태로 스캔"], ["지원하는 문서", "영문 상업 송장 · 발주서, 1페이지"]], main: "다시 올리기", sub: "예시 문서로 해 보기", code: "ERR_UNREADABLE" },
    type: { ic: I.question, title: "송장이나 발주서가 아닌 것 같아요", msg: "TradePilot은 영문 상업 송장과 발주서만 정리할 수 있어요. 올린 문서가 맞는지 확인해 주세요.",
      meta: [["읽은 문서", "영문 견적 요청서(RFQ)로 보여요"], ["지원하는 문서", "영문 상업 송장 · 발주서, 1페이지"]], main: "다른 문서 올리기", sub: "예시 문서로 해 보기", code: "ERR_UNSUPPORTED_DOC" },
    timeout: { ic: I.timer, title: "처리 시간이 너무 오래 걸렸어요", msg: "서버가 바쁠 수 있어요. 같은 파일로 잠시 후 다시 시도해 주세요.",
      meta: [["걸린 시간", "60초 넘게 응답 없음"], ["다시 해도 같다면", "담당자에게 아래 오류 코드를 알려 주세요"]], main: "다시 시도", sub: "다른 파일 올리기", code: "ERR_TIMEOUT · req 7f3a91" }
  };
  function renderError() {
    clearTimers();
    const e = ERRS[S.errKind];
    document.title = "처리하지 못했어요 · TradePilot";
    screen.innerHTML = `<div class="s4"><div class="card err-card"><div class="err-ic">${e.ic}</div><h2>${e.title}</h2><p>${e.msg}</p>
      <div class="err-meta">${e.meta.map((m) => `<div><b>${m[0]}</b>${m[1]}</div>`).join("")}</div>
      <div class="err-actions"><button class="btn btn-primary" id="e-main">${e.main}</button><button class="btn btn-ghost" id="e-sub">${e.sub}</button></div>
      <span class="err-code">${e.code}</span></div></div>`;
    $("#e-main").addEventListener("click", () => { if (S.errKind === "timeout") goTo("proc"); else { S.file = null; goTo("upload"); } });
    $("#e-sub").addEventListener("click", () => { S.file = null; if (S.errKind === "timeout") goTo("upload"); else { setScenario("inv", false); goTo("proc"); } });
  }

  /* ---------- 화면 전환 ---------- */
  function goTo(scr) {
    S.scr = scr;
    $$("#seg-scr button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.scr === scr || (scr === "err" && b.dataset.scr === "err-read"))));
    const errSeg = $("#seg-err"); if (errSeg) errSeg.hidden = scr !== "err";
    if (scr === "upload") { clearTimers(); document.title = "TradePilot UX·UI 초안"; renderUpload(); }
    else if (scr === "proc") renderProc();
    else if (scr === "result") renderResult();
    else renderError();
    const app = $("#app"); const r = app.getBoundingClientRect();
    if (r.top < 0) window.scrollTo({ top: window.scrollY + r.top - 12, behavior: "auto" });
  }
  function setScenario(k, rerender) {
    S.scn = k; S.filter = "all";
    $$("#seg-scn button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.scn === k)));
    if (rerender) goTo(S.scr === "err" ? "err" : S.scr);
  }

  /* ---------- 용어 설명 카드 ---------- */
  const tip = $("#tip");
  function showTip(el) {
    const t = TERMS[el.dataset.term]; if (!t) return;
    tip.innerHTML = t.unreg
      ? `<div><span class="t-ko">${t.ko}</span> <span class="t-raw">(${t.raw})</span></div><div class="t-body">용어집에 없는 표현이라 AI가 직역했어요. 지어낸 설명을 보여 주지 않도록 설명은 비워 뒀어요.</div><div class="t-src"><span class="tag tag-warn">용어집 미등록</span><span>미등록 목록에 기록됨</span></div>`
      : `<div><span class="t-ko">${t.ko}</span> <span class="t-raw">(${t.raw})</span></div><div class="t-body">${t.explain}</div><div class="t-src"><span>팀 무역 용어집</span><span>항상 같은 번역으로 고정</span></div>`;
    const r = el.getBoundingClientRect();
    tip.classList.add("on");
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    let y = r.bottom + 8; if (y + h > window.innerHeight - 8) y = r.top - h - 8;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  const hideTip = () => tip.classList.remove("on");
  document.addEventListener("mouseover", (e) => { const el = e.target.closest("[data-term]"); if (el) showTip(el); else hideTip(); });
  document.addEventListener("focusin", (e) => { const el = e.target.closest("[data-term]"); if (el) showTip(el); else hideTip(); });
  document.addEventListener("scroll", hideTip, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });

  /* ---------- 토스트 ---------- */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "card"; t.setAttribute("role", "status");
    t.style.cssText = "position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:10px 16px;z-index:120;font-size:13.5px;box-shadow:var(--shadow-2)";
    t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* ---------- 시연 조작 ---------- */
  $$("#seg-scn button").forEach((b) => b.addEventListener("click", () => setScenario(b.dataset.scn, true)));
  $$("#seg-scr button").forEach((b) => b.addEventListener("click", () => goTo(b.dataset.scr === "err-read" ? "err" : b.dataset.scr)));
  (function addErrSeg() {
    const wrap = document.createElement("span");
    wrap.id = "seg-err"; wrap.hidden = true;
    wrap.innerHTML = `오류 종류 <span class="seg">${[["read", "판독 불가"], ["type", "문서 종류 아님"], ["timeout", "시간 초과"]].map(([k, l]) => `<button data-err="${k}" aria-pressed="${k === S.errKind}">${l}</button>`).join("")}</span>`;
    $("#seg-scr").parentElement.after(wrap);
    $$("button", wrap).forEach((b) => b.addEventListener("click", () => { S.errKind = b.dataset.err; $$("button", wrap).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderError(); }));
  })();
  $("#file").addEventListener("change", (e) => { const fs = e.target.files; if (fs && fs.length) acceptFile(fs[0], fs.length); e.target.value = ""; });

  /* ---------- 디자인 근거 ---------- */
  function renderDesign() {
    const toks = [["--bg", "바탕", "Mercury 회색"], ["--surface", "카드", "흰 카드"], ["--ink", "글자", ""], ["--ink-2", "보조 글자", ""], ["--accent", "강조", "Mercury·Ramp 남색"], ["--accent-soft", "강조 배경", ""], ["--ok", "통과", "Rossum 체크"], ["--warn", "주의", "Mercury 연체 주황"], ["--danger", "오류", "Stripe 누락 빨강"], ["--line", "구분선", "Linear"]];
    $("#ds").innerHTML = `
      <div class="ds-intro"><h2>하나의 스타일로 묶은 방법</h2>
        <p>참고 서비스마다 장점이 달라서, 각 서비스의 <b>패턴</b>만 가져오고 <b>색·글꼴·간격·모서리·그림자</b>는 아래 토큰 하나로 통일했어요. 기본 톤은 금융 업무 도구 중 가장 차분하고 완성도가 높은 Mercury를 따랐고, 상태 색은 Stripe, 정보 밀도는 Linear, 체크리스트는 Things 3에서 가져왔어요.</p>
        <div class="principles">
          <div><b>색은 상태에만</b>강조색(남색)은 버튼·링크·AI 표시에만, 빨강·주황은 문제에만 써요.</div>
          <div><b>숫자가 주인공</b>금액은 크게, 소수점은 작게, 모든 숫자는 같은 폭(tabular)으로 맞춰요.</div>
          <div><b>카드는 역할별로</b>요약·해설·거래정보·할 일만 카드로 나누고, 안쪽은 구분선으로 정리해요.</div>
          <div><b>✦ = AI가 쓴 글</b>해설·번역 문장·체크리스트에만 붙여 문서 값과 구분해요.</div>
        </div></div>
      <div><h3 class="sec-t">색 토큰</h3><div class="tokens">${toks.map(([v, n, src]) => `<div class="tok"><div class="sw" style="background:var(${v})"></div><div><b>${n}</b><span>${v}</span>${src ? `<br><span style="font-family:var(--font-ko)">${src}</span>` : ""}</div></div>`).join("")}</div></div>
      <div><h3 class="sec-t">글자 크기 단계</h3><div class="type-scale">
        <div><small>36 · 화면 제목</small><span style="font-size:30px;font-weight:700;letter-spacing:-0.03em;font-family:var(--font-ko)">한글로 정리해 드려요</span></div>
        <div><small>28 · 금액</small><span class="amt num" style="display:inline-block">15,691<span class="dec">.93</span><span class="cur">GBP</span></span></div>
        <div><small>15.5 · 해설 본문</small><span class="explain" style="font-size:15.5px">총 15,691.93파운드를 2024년 10월 21일까지 보내면 됩니다.</span></div>
        <div><small>14 · 표 값</small><span style="font-size:14px;font-weight:500">30일 이내 지급 (Net 30)</span></div>
        <div><small>12.5 · 보조 설명</small><span style="font-size:12.5px;color:var(--ink-3)">원문: Net 30</span></div>
        <div><small>글꼴</small><span>Inter(숫자·영문) + Noto Sans KR(한글) · 원문 종이는 Helvetica 계열</span></div></div></div>
      <div><h3 class="sec-t">화면 영역별 참고 근거</h3><div class="maps">${DESIGN_MAP.map((m) => `<div class="map"><div class="map-ours"><span class="eyebrow">${m.area}</span><h4>${m.name}</h4><ul class="take">${m.take.map((t) => `<li>${t}</li>`).join("")}</ul><p class="drop-it">${m.drop}</p></div>
        <div class="map-refs">${m.refs.map(([img, svc, cap]) => `<a class="ref" href="img/${img}" target="_blank" rel="noopener"><img src="img/${img}" alt="${svc}: ${cap}"><b>${svc}</b><span>${cap}</span></a>`).join("")}</div></div>`).join("")}</div></div>
      <div><h3 class="sec-t">살펴본 서비스 ${SERVICES.length}곳</h3><div class="svc-list"><table><thead><tr><th>서비스</th><th>본 화면</th><th>가져온 것 / 제외 이유</th><th>출처</th></tr></thead><tbody>
        ${SERVICES.map(([n, w, t, u, used]) => `<tr><td><b>${n}</b>${used ? "" : ' <span class="tag">제외</span>'}</td><td>${w}</td><td class="${used ? "" : "x"}">${t}</td><td><a href="${u}" target="_blank" rel="noopener">열기</a></td></tr>`).join("")}</tbody></table></div></div>`;
  }

  /* ---------- UX 정의서 ---------- */
  let mdLoaded = false;
  function loadMD() {
    if (mdLoaded) return; mdLoaded = true;
    fetch("ux.md").then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }).then((txt) => {
      const html = window.marked ? window.marked.parse(txt) : `<pre>${escapeHTML(txt)}</pre>`;
      const el = $("#md"); el.innerHTML = html;
      $$("table", el).forEach((t) => { const w = document.createElement("div"); w.className = "tblw"; t.parentNode.insertBefore(w, t); w.appendChild(t); });
    }).catch(() => { $("#md").innerHTML = '<p class="md-loading">UX 정의서를 불러오지 못했어요. 새로고침해 주세요.</p>'; mdLoaded = false; });
  }

  /* ---------- 바깥 탭 ---------- */
  function route() {
    const v = (location.hash || "#proto").slice(1);
    const view = ["proto", "ux", "design"].includes(v) ? v : "proto";
    $$(".tabs a").forEach((a) => a.setAttribute("aria-current", a.dataset.view === view ? "page" : "false"));
    $("#v-proto").hidden = view !== "proto"; $("#v-ux").hidden = view !== "ux"; $("#v-design").hidden = view !== "design";
    if (view === "ux") loadMD();
    hideTip();
  }
  window.addEventListener("hashchange", route);

  renderDesign();
  route();
  goTo("upload");
})();
