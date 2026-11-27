/* TradePilot 프로토타입 시연 데이터.
   금액은 기획서 2.1 예시(Atlas Cycles, 총 15,691.93 GBP)를 기준으로 품목·할인·운송비·세금이 실제로 맞도록 구성했다.
   발주서는 설계서 5장 번역 규칙 예시(T/T, B/L)를 쓰도록 구성했다. 모든 회사·계좌는 가상 정보다. */

const TERMS = {
  ci:     { ko: "상업 송장", raw: "Commercial Invoice", explain: "물건을 판 쪽이 산 쪽에 보내는 정식 청구서예요. 대금 지급과 수입 통관의 기준 서류가 돼요." },
  po:     { ko: "발주서", raw: "Purchase Order", explain: "사려는 쪽이 파는 쪽에 보내는 주문서예요. 품목·수량·가격·납기를 약속해요." },
  net30:  { ko: "30일 이내 지급", raw: "Net 30", explain: "송장 발행일부터 30일 안에 대금을 보내라는 뜻이에요." },
  tt:     { ko: "전신환 송금", raw: "T/T", explain: "은행을 통해 해외 계좌로 돈을 보내는 방식이에요. Bank Transfer, Wire Transfer도 같은 뜻으로 써요." },
  iban:   { ko: "국제 계좌번호", raw: "IBAN", explain: "유럽 등에서 쓰는 국제 계좌번호 형식이에요. 해외 송금 때 계좌번호 칸에 이 번호를 넣어요." },
  swift:  { ko: "은행 식별 코드", raw: "SWIFT/BIC", explain: "해외 송금 때 돈을 받을 은행을 찾는 국제 코드예요." },
  vat:    { ko: "부가가치세", raw: "VAT", explain: "물건값에 붙는 세금이에요." },
  freight:{ ko: "운송비", raw: "Freight", explain: "물건을 보내는 데 드는 운반 비용이에요." },
  fob:    { ko: "본선 인도", raw: "FOB", explain: "판매자가 약속한 항구에서 물건을 배에 실을 때까지 비용과 책임을 지는 조건이에요. 그 뒤의 운송비와 위험은 구매자가 져요." },
  bl:     { ko: "선하증권", raw: "B/L", explain: "선박 회사가 화물을 받았다는 증명서예요. 물건을 찾을 권리가 담겨 있어 대금 결제의 근거로 써요." },
  adv:    { ko: "선지급", raw: "in advance", explain: "물건을 보내기 전에 대금 일부를 먼저 받는 것이에요." },
  restock:{ ko: "재입고 수수료", raw: "Restocking fee", unreg: true, explain: "" }
};

const DEPTS = [
  { id: "fin", name: "경리" },
  { id: "pur", name: "구매" },
  { id: "pro", name: "생산" },
  { id: "log", name: "물류" }
];

const INV_ITEMS = [
  { code: "TR-900", ko: "여행용 자전거", raw: "Touring Bike TR-900", qty: 11, unit: "대", price: 1050.05, disc: "2%", total: 11319.54 },
  { code: "PD-220", ko: "알루미늄 페달", raw: "Alloy Pedals PD-220", qty: 5, unit: "세트", price: 119.99, disc: "2%", total: 587.95 },
  { code: "VS-14",  ko: "반사 조끼", raw: "Reflective Vest", qty: 4, unit: "벌", price: 64.99, disc: null, total: 259.96 },
  { code: "GL-08",  ko: "사이클 장갑", raw: "Cycling Gloves", qty: 6, unit: "켤레", price: 24.99, disc: null, total: 149.94 },
  { code: "CR-3",   ko: "차량용 자전거 거치대", raw: "Car Bike Rack", qty: 1, unit: "개", price: 254.25, disc: null, total: 254.25 }
];

function invBase() {
  return {
    kind: "invoice",
    docBadge: "상업 송장",
    currency: "GBP",
    procSec: "18.4",
    paper: {
      title: "INVOICE",
      no: "INV-24-0917", date: "21 Sep 2024", due: "21 Oct 2024", terms: "Net 30", cur: "GBP",
      seller: ["Atlas Cycles Ltd.", "14 Ancoats Street", "Manchester M4 6DE, United Kingdom"],
      billto: ["Hanbit Bike Co., Ltd.", "88 Jungang-daero, Dong-gu", "Busan 48731, Republic of Korea"],
      shipto: ["Hanbit Bike Logistics Center", "45 Sinhang-ro, Gangseo-gu", "Busan 46762, Republic of Korea"],
      method: "Bank Transfer", bank: "NatWest, London", iban: "GB29 NWBK 6016 1331 9268 19", swift: "NWBKGB2L",
      subtotal: "12,814.65", discount: "-243.01", freight: "1,902.10", tax: "1,218.19", total: "15,691.93",
      notes: "Goods dispatched within 2 business days. Tracking number will be sent by email. A 15% restocking fee applies to returns."
    },
    summary: {
      total: 15691.93,
      key: { label: "결제 기한", value: "2024.10.21", dday: 7, sub: "발행일 2024.09.21 · 30일 이내 지급" },
      from: { name: "Atlas Cycles Ltd.", c: "영국 맨체스터", role: "보낸 곳" },
      to: { name: "Hanbit Bike Co., Ltd.", c: "대한민국 부산 · 우리 회사", role: "받는 곳" }
    },
    issues: [],
    groups: [
      { title: "문서 정보", rows: [
        { f: "no", l: "송장 번호", v: "INV-24-0917" },
        { f: "date", l: "발행일", v: "2024.09.21", r: "21 Sep 2024" },
        { f: "cur", l: "통화", v: "영국 파운드", r: "GBP" },
        { f: "title", l: "문서 종류", v: "{{ci|상업 송장}}", r: "Invoice" }
      ]},
      { title: "당사자", rows: [
        { f: "seller", l: "발행사", v: "Atlas Cycles Ltd.", r: "영국 · Manchester" },
        { f: "billto", l: "청구처", v: "Hanbit Bike Co., Ltd.", r: "대한민국 · Busan" },
        { f: "shipto", l: "배송지", v: "Hanbit Bike Logistics Center", r: "대한민국 · Busan" }
      ]},
      { title: "결제·인도 조건", rows: [
        { f: "due", l: "결제 기한", v: "2024.10.21 <span class=\"date-chip soon\">D-7</span>", r: "21 Oct 2024" },
        { f: "terms", l: "결제 조건", v: "{{net30|30일 이내 지급 (Net 30)}}" },
        { f: "method", l: "결제 방식", v: "{{tt|전신환 송금 (T/T)}}", r: "Bank Transfer" },
        { f: "bank", l: "받는 은행", v: "NatWest · 영국 런던" },
        { f: "iban", l: "{{iban|IBAN}}", v: "<span class=\"mono\">GB29 NWBK 6016 1331 9268 19</span>" },
        { f: "swift", l: "{{swift|SWIFT}}", v: "<span class=\"mono\">NWBKGB2L</span>" },
        { f: "inco", l: "인도 조건", v: null }
      ]},
      { title: "비고", rows: [
        { f: "notes", l: "비고", ai: true, v: "영업일 2일 이내에 출고되며, 배송 조회 번호는 이메일로 보내 드립니다. 반품 시 15%의 {{restock|재입고 수수료}}가 붙습니다.", r: "Goods dispatched within 2 business days. Tracking number will be sent by email. A 15% restocking fee applies to returns." }
      ]}
    ],
    items: INV_ITEMS,
    totals: [
      { f: "subtotal", l: "소계 (할인 전)", v: "12,814.65" },
      { f: "discount", l: "할인 (자전거·페달 2%)", v: "−243.01" },
      { f: "freight", l: "{{freight|운송비}}", v: "1,902.10" },
      { f: "tax", l: "세금 ({{vat|VAT}})", v: "1,218.19" },
      { f: "total", l: "총액", v: "15,691.93", total: true }
    ],
    explain: "영국 맨체스터의 자전거 회사 <b>Atlas Cycles</b>가 우리 회사(Hanbit Bike)에 여행용 자전거 11대와 페달·반사 조끼·장갑·차량용 거치대를 팔고 보낸 {{ci|상업 송장}}입니다. 물건값 <span class=\"n\">12,814.65</span>파운드에서 자전거와 페달에 2% 할인이 들어가 <span class=\"n\">12,571.64</span>파운드가 되었고, 여기에 {{freight|운송비}} <span class=\"n\">1,902.10</span>파운드와 세금 <span class=\"n\">1,218.19</span>파운드를 더해 <b>총 <span class=\"n\">15,691.93</span>파운드</b>입니다. 이 금액을 <b>2024년 10월 21일까지</b>({{net30|30일 이내 지급}}) 문서에 적힌 영국 NatWest 은행 계좌로 {{tt|전신환 송금}}하면 됩니다. 물건은 영업일 2일 안에 출고되고, 배송 조회 번호는 이메일로 옵니다.",
    termIds: ["ci", "net30", "tt", "iban", "swift", "freight", "vat", "restock"],
    checklist: {
      fin: [
        { t: "15,691.93 GBP를 NatWest 계좌로 송금하기", src: [["due", "결제 기한"], ["total", "총액"]], due: "10/21", dday: 7, imp: true },
        { t: "받는 계좌(IBAN·SWIFT)가 거래처 등록 정보와 같은지 확인하기", src: [["iban", "IBAN"], ["swift", "SWIFT"]] },
        { t: "세금 1,218.19 GBP 증빙용으로 송장 원본 보관하기", src: [["tax", "세금"]] }
      ],
      pur: [
        { t: "품목 5종·수량이 우리 발주 내용과 같은지 대조하기", src: [["items", "품목"]], imp: true },
        { t: "자전거·페달 2% 할인이 약속한 조건대로 들어갔는지 확인하기", src: [["discount", "할인"]] }
      ],
      pro: [],
      log: [
        { t: "출고 후 이메일로 오는 배송 조회 번호 확인하기", src: [["notes", "비고"]], due: "출고 2영업일 내" },
        { t: "부산 물류센터 입고 일정 잡기", src: [["shipto", "배송지"]] },
        { t: "반품하면 15% 재입고 수수료가 붙는다는 조건 공유하기", src: [["notes", "비고"]] }
      ]
    },
    procChips: ["INV-24-0917", "Atlas Cycles Ltd.", "GBP 15,691.93", "Net 30"]
  };
}

const SCENARIOS = {};

SCENARIOS.inv = Object.assign(invBase(), { id: "inv", file: "INV-24-0917_AtlasCycles.pdf", sampleTitle: "정상 송장", sampleDesc: "영국 자전거 회사가 보낸 청구서 · GBP" });

SCENARIOS.err = (function () {
  const s = invBase();
  s.id = "err";
  s.file = "INV-24-0917_rev.pdf";
  s.sampleTitle = "금액 오류 송장";
  s.sampleDesc = "총액이 틀리고 결제 기한이 빠진 청구서";
  s.paper.due = null;
  s.paper.total = "15,961.93";
  s.procSec = "19.1";
  s.summary.total = 15961.93;
  s.summary.totalBad = { computed: "15,691.93" };
  s.summary.key = { label: "결제 기한", value: "2024.10.21", estimated: true, sub: "문서에 없음 · Net 30으로 계산한 날짜" };
  s.issues = [
    { sev: "error", f: "total", title: "총액이 맞지 않아요",
      msg: "품목·운송비·세금을 더하면 15,691.93 GBP인데 문서에는 15,961.93 GBP로 적혀 있어요. 송금하기 전에 거래처에 정확한 금액을 확인하세요.",
      cmp: [["문서에 적힌 총액", "15,961.93", true], ["계산한 총액", "15,691.93"], ["차이", "270.00"]] },
    { sev: "warning", f: "due", title: "결제 기한이 문서에 없어요",
      msg: "결제 조건(Net 30)으로 계산하면 2024년 10월 21일이에요. 거래처에 기한을 확인하세요." }
  ];
  s.groups[2].rows[0] = { f: "due", l: "결제 기한", v: "2024.10.21 <span class=\"pill pill-warn\">추정</span>", r: "문서에 없음 · 발행일 + 30일로 계산", issue: "warning" };
  s.totals[4] = { f: "total", l: "총액", v: "15,961.93", sub: "계산 15,691.93", total: true, issue: "error" };
  s.explain = "영국 맨체스터의 자전거 회사 <b>Atlas Cycles</b>가 우리 회사(Hanbit Bike)에 여행용 자전거 11대와 페달·반사 조끼·장갑·차량용 거치대를 팔고 보낸 {{ci|상업 송장}}입니다. 물건값에 할인·{{freight|운송비}}·세금을 더하면 <span class=\"n\">15,691.93</span>파운드인데, <b>문서의 총액은 <span class=\"n\">15,961.93</span>파운드로 적혀 있어 <span class=\"n\">270.00</span>파운드 차이가 납니다.</b> 결제 기한도 문서에 없어서, {{net30|30일 이내 지급}} 조건으로 계산하면 2024년 10월 21일입니다. <b>송금하기 전에 거래처에 정확한 총액과 기한을 먼저 확인하세요.</b>";
  s.checklist.fin = [
    { t: "송금 전에 거래처에 정확한 총액 확인하기 (문서 15,961.93 ≠ 계산 15,691.93)", src: [["total", "총액"]], imp: true, check: true },
    { t: "거래처에 결제 기한 확인하기 (계산상 2024.10.21)", src: [["due", "결제 기한"]], due: "10/21", dday: 7, check: true },
    { t: "받는 계좌(IBAN·SWIFT)가 거래처 등록 정보와 같은지 확인하기", src: [["iban", "IBAN"], ["swift", "SWIFT"]] },
    { t: "세금 1,218.19 GBP 증빙용으로 송장 원본 보관하기", src: [["tax", "세금"]] }
  ];
  s.procChips = ["INV-24-0917", "Atlas Cycles Ltd.", "!총액 불일치", "!결제 기한 없음"];
  return s;
})();

SCENARIOS.po = {
  id: "po", kind: "po", file: "PO-GBR-24-0457.pdf", docBadge: "발주서", currency: "EUR", procSec: "16.9",
  sampleTitle: "발주서", sampleDesc: "독일 판매점이 보낸 주문서 · FOB 부산",
  paper: {
    title: "PURCHASE ORDER",
    no: "PO-GBR-24-0457", date: "02 Oct 2024", cur: "EUR",
    buyer: ["Global Bike Retailers GmbH", "Speicherstadt 12", "20457 Hamburg, Germany"],
    vendor: ["Hanbit Bike Co., Ltd.", "88 Jungang-daero, Dong-gu", "Busan 48731, Republic of Korea"],
    deliver: ["GBR Central Warehouse", "Am Moldauhafen 5", "20457 Hamburg, Germany"],
    shipdate: "15 Nov 2024", inco: "FOB Busan", pol: "Busan, KR", pod: "Hamburg, DE", carrier: "Hapag-Lloyd (nominated by buyer)",
    payterms: "T/T 30% in advance, balance against B/L copy",
    subtotal: "20,995.00", total: "20,995.00",
    notes: "Please pack each bicycle individually and mark the PO number on every carton. Send photos before shipment."
  },
  summary: {
    total: 20995.00,
    key: { label: "최종 선적일", value: "2024.11.15", dday: 32, sub: "부산항에서 배에 실어야 하는 마지막 날" },
    from: { name: "Global Bike Retailers GmbH", c: "독일 함부르크", role: "주문한 곳" },
    to: { name: "Hanbit Bike Co., Ltd.", c: "대한민국 부산 · 우리 회사", role: "공급하는 곳" }
  },
  issues: [],
  groups: [
    { title: "문서 정보", rows: [
      { f: "no", l: "발주 번호", v: "PO-GBR-24-0457" },
      { f: "date", l: "발행일", v: "2024.10.02", r: "02 Oct 2024" },
      { f: "cur", l: "통화", v: "유로", r: "EUR" },
      { f: "title", l: "문서 종류", v: "{{po|발주서}}", r: "Purchase Order" }
    ]},
    { title: "당사자", rows: [
      { f: "buyer", l: "발주처", v: "Global Bike Retailers GmbH", r: "독일 · Hamburg" },
      { f: "vendor", l: "공급사", v: "Hanbit Bike Co., Ltd.", r: "대한민국 · Busan" },
      { f: "deliver", l: "납품처", v: "GBR Central Warehouse", r: "독일 · Hamburg" }
    ]},
    { title: "선적·결제 조건", route: true, rows: [
      { f: "shipdate", l: "최종 선적일", v: "2024.11.15 <span class=\"date-chip\">D-32</span>", r: "Latest shipment: 15 Nov 2024" },
      { f: "inco", l: "인도 조건", v: "{{fob|본선 인도 (FOB)}} · 부산항", r: "FOB Busan" },
      { f: "carrier", l: "운송사", v: "Hapag-Lloyd (발주처 지정)", r: "nominated by buyer" },
      { f: "payterms", l: "결제 조건", v: "{{tt|전신환 송금 (T/T)}} 30% {{adv|선지급}}, 잔금은 {{bl|선하증권 (B/L)}} 사본과 교환", r: "T/T 30% in advance, balance against B/L copy" }
    ]},
    { title: "요청 사항", rows: [
      { f: "notes", l: "요청 사항", ai: true, v: "자전거는 한 대씩 따로 포장하고, 모든 박스에 발주 번호를 적어 주세요. 선적 전에 사진을 보내 주세요.", r: "Please pack each bicycle individually and mark the PO number on every carton. Send photos before shipment." }
    ]}
  ],
  route: { from: "부산항", fromSub: "Busan, KR · 선적항", to: "함부르크항", toSub: "Hamburg, DE · 도착항", mark: "FOB 여기까지 우리 책임" },
  items: [
    { code: "TB-700", ko: "투어링 자전거", raw: "Touring Bike TB-700", qty: 20, unit: "대", price: 940.00, disc: null, total: 18800.00 },
    { code: "HL-12", ko: "자전거 헬멧", raw: "Cycling Helmet HL-12", qty: 30, unit: "개", price: 38.50, disc: null, total: 1155.00 },
    { code: "PD-3", ko: "클릿 페달", raw: "Clipless Pedal PD-3", qty: 20, unit: "세트", price: 52.00, disc: null, total: 1040.00 }
  ],
  totals: [
    { f: "subtotal", l: "소계", v: "20,995.00" },
    { f: "freight", l: "{{freight|운송비}}", v: null, note: "문서에 없음 · FOB라 해상 운송비는 발주처 부담" },
    { f: "total", l: "발주 총액", v: "20,995.00", total: true }
  ],
  explain: "독일 함부르크의 자전거 판매점 <b>Global Bike Retailers</b>가 우리 회사(Hanbit Bike)에 투어링 자전거 20대, 헬멧 30개, 클릿 페달 20세트를 주문한 {{po|발주서}}입니다. 주문 금액은 모두 <b><span class=\"n\">20,995.00</span>유로</b>입니다. 물건은 <b>2024년 11월 15일까지 부산항에서 배에 실어야 하고</b>({{fob|본선 인도}}), 배에 싣기 전까지의 비용과 책임은 우리 회사가 집니다. 대금은 {{tt|전신환 송금}}으로 30%인 <span class=\"n\">6,298.50</span>유로를 먼저 받고, 나머지 <span class=\"n\">14,696.50</span>유로는 {{bl|선하증권}} 사본을 보낸 뒤 받습니다.",
  termIds: ["po", "fob", "tt", "adv", "bl", "freight"],
  checklist: {
    fin: [
      { t: "선지급 30% 6,298.50 EUR 입금 확인하기 (생산 착수 전)", src: [["payterms", "결제 조건"]], imp: true },
      { t: "선적 후 B/L 사본과 함께 잔금 14,696.50 EUR 청구하기", src: [["payterms", "결제 조건"]], due: "선적 후" }
    ],
    pur: [
      { t: "프레임·페달 자재 재고 확인하고 부족분 발주하기", src: [["items", "품목"]] },
      { t: "헬멧 30개 조달처와 단가(38.50 EUR) 맞는지 확인하기", src: [["items", "품목"]] }
    ],
    pro: [
      { t: "자전거 20대·헬멧 30개·페달 20세트 생산과 포장 끝내기", src: [["items", "품목"], ["shipdate", "최종 선적일"]], due: "11/15", dday: 32, imp: true },
      { t: "자전거는 한 대씩 포장하고 박스마다 발주 번호 적기", src: [["notes", "요청 사항"]] },
      { t: "선적 전 제품 사진 찍어 발주처에 보내기", src: [["notes", "요청 사항"]] }
    ],
    log: [
      { t: "Hapag-Lloyd와 부산항 선적 일정 잡기", src: [["carrier", "운송사"], ["shipdate", "최종 선적일"]], due: "11/15", dday: 32, imp: true },
      { t: "B/L을 받으면 사본을 경리에 넘기기", src: [["payterms", "결제 조건"]] }
    ]
  },
  procChips: ["PO-GBR-24-0457", "Global Bike Retailers", "EUR 20,995.00", "FOB Busan"]
};

/* 디자인 근거: 우리 컴포넌트 ↔ 참고 서비스 */
const DESIGN_MAP = [
  { area: "S1 시작·업로드", name: "업로드 카드와 예시 문서",
    take: ["첫 화면 = 업로드 화면. 큰 카드 하나에 끌어다 놓기·선택을 모음 (remove.bg)", "\"파일이 없으신가요?\" 예시 썸네일로 바로 체험 (remove.bg)", "한 줄 헤드라인 + 버튼 하나의 절제된 톤 (Reducto)", "\"무엇이 필요한가 / 얼마나 걸리나\" 안내 칸 (Stripe)"],
    drop: "버린 것: 사진 중심 히어로, 큰 마케팅 문구. 업무 도구라 업로드가 주인공이어야 함.",
    refs: [["removebg.jpg", "remove.bg", "업로드 카드 + 예시 이미지"], ["reducto.jpg", "Reducto", "한 줄 헤드라인과 버튼 하나"], ["stripe_start.jpg", "Stripe", "필요한 것·걸리는 시간 안내"]] },
  { area: "S2 처리 중", name: "스캔 + 4단계 진행 표시",
    take: ["문서 위를 훑는 스캔 효과로 \"읽는 중\"을 보여 줌 (Ramp)", "찾은 값이 체크 칩으로 떠오름 (Ramp, Mercury)", "완료·진행·대기 3상태를 모양으로 구분하는 단계 표시 (Stripe)"],
    drop: "버린 것: 여러 문서 일괄 스캔 화면. 우리는 한 번에 한 문서.",
    refs: [["ramp_scan.jpg", "Ramp", "문서 스캔 중"], ["ramp_capture.jpg", "Ramp", "추출 값 체크 칩"], ["stripe_steps.jpg", "Stripe", "완료·진행·대기 단계 표시"]] },
  { area: "S3 결과 · 요약", name: "큰 금액 + 기한 + 당사자 카드",
    take: ["금액은 크게, 소수점은 작게 (Mercury 결제 화면)", "기한 옆 상태 배지와 상대 날짜(D-7) (Mercury 상태 표)", "급한 것만 주황, 나머지는 무채색 (Mercury)", "\"18.4초 · 완료 ✓\" 소요 시간과 완료 표시 (Vercel)"],
    drop: "버린 것: 여러 건 합계 대시보드. 우리는 문서 한 건 요약.",
    refs: [["mercury_invoice.jpg", "Mercury", "큰 금액·기한 + 문서 미리보기"], ["mercury_status.jpg", "Mercury", "연체 배지와 상대 날짜"], ["vercel_summary.jpg", "Vercel", "소요 시간 + 완료 표시"]] },
  { area: "S3 결과 · 확인 필요", name: "문제 카드와 값 비교",
    take: ["문제를 한곳에 모으고 카드마다 이동 버튼 (Stripe)", "상태 한 줄 + 바로 이유를 쓰는 요약 (Ramp)", "\"문서 값 / 계산 값\" 비교 카드 (Mercury 중복 송장)", "빨간 상자로 원문 위치 표시 (Rossum)"],
    drop: "버린 것: 승인·반려 버튼. 우리 서비스는 결제 시스템이 아님.",
    refs: [["stripe_review.jpg", "Stripe", "누락 항목 카드 + 수정 버튼"], ["ramp_flag.jpg", "Ramp", "검토 필요 상태 + 이유"], ["mercury_dup.jpg", "Mercury", "비교 카드"]] },
  { area: "S3 결과 · 원문 대조", name: "왼쪽 원문, 오른쪽 결과",
    take: ["원문과 필드 목록을 나란히, 필드를 고르면 원문 위치 강조 (Rossum)", "필드 옆 체크로 \"읽음·검산 통과\" 표시 (Rossum)", "문서 미리보기 위 크게 보기 버튼 (Mercury)"],
    drop: "버린 것: 값 직접 수정·확정 버튼. MVP는 읽기 전용(수정 기능은 범위 밖).",
    refs: [["rossum.jpg", "Rossum", "필드 ↔ 원문 연결"], ["mercury_ai.jpg", "Mercury", "AI가 찾은 값 표시"]] },
  { area: "S3 결과 · 거래정보", name: "속성 목록 + 품목·금액 표",
    take: ["회색 이름 + 진한 값의 2열 속성 목록 (Linear)", "금액 오른쪽 정렬, 값 아래 보조 정보 작게 (Brex)", "선적항 → 도착항 경로 막대 (Flexport)", "묶음 제목과 개수로 정리 (Vercel)"],
    drop: "버린 것: 굵은 격자 표. 칸이 많아 보이면 읽기 어려움.",
    refs: [["linear_props.jpg", "Linear", "속성 패널"], ["brex_table.jpg", "Brex", "금액 정렬·보조 금액"], ["flexport_route.jpg", "Flexport", "운송 경로 진행 막대"]] },
  { area: "S3 결과 · 쉬운 해설", name: "짧은 해설 + 그 자리 용어 설명",
    take: ["긴 공지를 두세 문장으로 줄이는 해요체 (토스)", "단어 위에서 뜨는 미리보기 카드 (Wikipedia)", "✦ 기호로 AI가 만든 내용 표시 (Mercury)"],
    drop: "버린 것: 채팅형 질의응답. 설계서에서 대화 기능은 제외.",
    refs: [["toss_dodont.jpg", "토스", "UX 라이팅 Don't / Do"], ["wiki_preview.jpg", "Wikipedia", "용어 미리보기 카드"], ["mercury_ai.jpg", "Mercury", "✦ AI 표시"]] },
  { area: "S3 결과 · 체크리스트", name: "부서 섹션 + 기한 칩",
    take: ["파란 섹션 제목 + 얇은 구분선 + 체크박스 목록 (Things 3)", "날짜 칩과 \"중요\" 태그 (Things 3)", "필터(전체·중요) (Things 3)", "연체·임박만 색으로 강조 (Mercury)"],
    drop: "버린 것: 담당자 지정·알림. 저장 기능이 없는 MVP 범위.",
    refs: [["things.jpg", "Things 3", "섹션별 할 일 목록"], ["mercury_billpay.jpg", "Mercury", "기한 필터와 상태 요약"]] },
  { area: "S4 오류", name: "원인 + 해결 + 버튼 하나",
    take: ["가운데 아이콘 + 한 줄 상태 + 바로 할 행동 (Linear)", "\"무엇이 필요한가\" 2칸 안내를 오류 해결 안내로 응용 (Stripe)"],
    drop: "버린 것: 빈 화면처럼 보이는 오류. 오류는 오류답게 원인을 밝힘.",
    refs: [["linear_empty.jpg", "Linear", "빈 상태 + 행동 링크"], ["stripe_start.jpg", "Stripe", "2칸 안내"]] }
];

const SERVICES = [
  ["Rossum", "송장 검증 화면", "원문 ↔ 필드 연결, 필드 체크", "https://updates.rossum.ai/en/interactive-bounding-boxes-for-a-20-annotation-experience", true],
  ["Ramp", "AP·송장 자동화", "스캔 화면, 추출 칩, 검토 필요 요약", "https://ramp.com/accounts-payable", true],
  ["Mercury", "Bill Pay·Invoicing", "금액·기한 요약, 상태 배지, AI 표시, 비교 카드", "https://mercury.com/invoicing", true],
  ["Brex", "Bill Pay", "금액 정렬, 보조 금액, 표 밀도", "https://www.brex.com/product/bill-pay", true],
  ["Stripe", "온보딩·검토 화면", "단계 표시, 누락 카드, 시작 안내", "https://www.saasui.design/pattern/onboarding/stripe", true],
  ["Linear", "업무 관리", "속성 패널, 빈 상태", "https://www.saasui.design/pattern/dashboard/linear", true],
  ["Things 3", "할 일 앱", "섹션별 체크리스트, 날짜 칩", "https://culturedcode.com/things/", true],
  ["Vercel", "배포 요약", "소요 시간 + 완료 표시, 묶음별 개수", "https://vercel.com/docs/deployments", true],
  ["Flexport", "물류 플랫폼", "선적 → 도착 경로 막대", "https://www.flexport.com/", true],
  ["Wikipedia", "링크 미리보기", "용어 설명 카드", "https://en.wikipedia.org/wiki/Incoterms", true],
  ["토스", "UX 라이팅", "쉬운 해요체 문장", "https://toss.im/tossfeed/article/uxwriter-interview", true],
  ["remove.bg", "업로드 첫 화면", "업로드 카드, 예시 파일", "https://www.remove.bg/ko", true],
  ["Reducto", "문서 AI", "절제된 첫 화면 톤", "https://reducto.ai/", true],
  ["Wise Business", "해외 송금", "제품 화면이 공개 페이지에 거의 없어 제외", "https://wise.com/gb/business/", false],
  ["Attio", "CRM", "AI 대화형 화면 위주라 이번 과제와 맞지 않아 제외", "https://attio.com/", false],
  ["Upstage", "Document Parse", "로그인해야 볼 수 있어 화면 확인 못 함", "https://console.upstage.ai/playground/document-parsing", false]
];
