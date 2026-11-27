"""평가셋 v2 생성 (tradepilot_eval_v2): 레이아웃(발행사) 다양성을 갖춘 Invoice·PO 평가셋.

tradepilot_eval_v1(50+50)은 100건 모두 test split의 발행사 1곳(레이아웃 1종)이라,
처음 보는 양식에 대한 성능을 보기 위해 validation+test의 발행사 8곳에서 고르게 뽑는다.

실행 (저장소 최상위에서):
  python members/jongho/vlm_test/scripts/build_eval_set.py
입력: data/company_docs_v2_en (tools/dataset_prep/prepare_dataset.py 결과)
출력 구조 (members/knlee/vlm_test 의 eval_vlm.py / score.py 와 같은 문서 폴더 형식):
  <out>/clean/<type>/<doc_id>/pdf.png            PDF 1페이지를 150 DPI로 렌더링 (1241x1754)
  <out>/scan/<type>/<doc_id>/scan.jpg            열화(scan/photo) 이미지 원본 그대로
  .../pdf_text.txt                               PDF 텍스트 레이어 (인쇄 여부 확인용)
  .../gold.json                                  원본 정답 (extracted_data 그대로)
  .../gold_printed.json                          인쇄된 값만 남긴 정답 (나머지는 null)
  .../printed_report.json                        필드별 인쇄 확인 결과
  .../meta.json                                  split, 회사, 레이아웃, 스캔 프로필 등
  <out>/manifest.jsonl, <out>/summary.json, <out>/README.md

선정 기준 (사용자 확정 2026-11-26):
  - 문서 종류: invoice, purchase_order / 언어: en / 1페이지 문서만
  - split: validation + test (학습에 쓰지 않는 발행사) — 레이아웃(=발행사)별로 고르게
  - clean: 종류별 100건, scan: 종류별 50건 (clean과 겹치지 않는 문서, scan/photo 반반)
"""
import argparse, collections, datetime as dt, io, json, random, re, unicodedata
from decimal import Decimal, InvalidOperation
from pathlib import Path

import pyarrow.parquet as pq
import pymupdf

TYPES = ["invoice", "purchase_order"]
SPLITS = ["validation", "test"]
META_COLS = ["doc_id", "split", "pages", "company", "company_name", "layout", "theme", "source",
             "items_count", "number"]
ALWAYS_KEEP = {"doc_type", "currency", "totals.currency"}  # 문자 그대로 인쇄되지 않아도 추론 가능한 값


# ---------------------------------------------------------------- 인쇄 여부 확인
def squash(s: str) -> str:
    s = unicodedata.normalize("NFKC", str(s)).casefold()
    s = re.sub(r"[‐-―−]", "-", s)
    return re.sub(r"\s+", "", s)


def money_variants(v):
    try:
        d = Decimal(str(v))
    except InvalidOperation:
        return []
    out = {str(v), f"{d:.2f}", f"{d:,.2f}"}
    if d == d.to_integral_value():
        out |= {f"{int(d)}", f"{int(d):,}"}
    return out


def rate_variants(v):
    try:
        p = Decimal(str(v)) * 100
    except InvalidOperation:
        return []
    out = {f"{p.normalize():f}%", f"{p:.1f}%", f"{p:.2f}%", f"{p:.0f}%"}
    return out


DATE_FMTS = ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%d.%m.%Y", "%d %b %Y", "%b %d, %Y", "%d %B %Y",
             "%B %d, %Y", "%d-%b-%Y", "%Y/%m/%d", "%b %d %Y", "%d %b, %Y"]


def date_variants(v):
    try:
        d = dt.date.fromisoformat(str(v))
    except ValueError:
        return []
    out = {d.strftime(f) for f in DATE_FMTS}
    out |= {f"{d.month}/{d.day}/{d.year}", f"{d.day}/{d.month}/{d.year}", f"{d.day}.{d.month}.{d.year}"}
    for mon in (d.strftime("%b"), d.strftime("%B")):            # 일(day) 앞 0 없는 형식
        out |= {f"{d.day} {mon} {d.year}", f"{mon} {d.day}, {d.year}", f"{d.day}-{mon}-{d.year}"}
    return out


def date_wrapped(v, fc: str) -> bool:
    """좁은 표 칸에서 연도가 다음 줄로 밀린 경우: '월 일,' 또는 '일 월' 부분 + 연도가 모두 인쇄됨."""
    try:
        d = dt.date.fromisoformat(str(v))
    except ValueError:
        return False
    if str(d.year) not in fc:
        return False
    heads = set()
    for mon in (d.strftime("%b"), d.strftime("%B")):
        heads |= {f"{mon} {d.day},", f"{mon} {d.day:02d},", f"{d.day} {mon}", f"{d.day:02d} {mon}"}
    return any(squash(h) in fc for h in heads)


def leaf_status(path: str, value, fc: str, boxed: set) -> str:
    """printed | prefix | not_found | kept(항상 유지) | boxed(좌표 있음)"""
    if path in ALWAYS_KEEP:
        return "kept"
    if re.sub(r"\.\d+\.", ".N.", path) in boxed or path in boxed:
        return "boxed"
    last = path.split(".")[-1]
    s = str(value)
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        cands = date_variants(s)
    elif last.endswith("rate"):
        cands = rate_variants(s) | {s}
    elif re.fullmatch(r"-?\d+(\.\d+)?", s):
        cands = money_variants(s)
    else:
        cands = {s}
    if any(squash(c) and squash(c) in fc for c in cands):
        return "printed"
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s) and date_wrapped(s, fc):
        return "printed_wrapped"
    q = squash(s)
    if len(q) > 40 and q[:40] in fc:      # 긴 문장이 줄바꿈·말줄임으로 일부만 인쇄된 경우
        return "prefix"
    return "not_found"


def printed_only(gold, fc: str, boxed: set):
    report = {}

    def walk(node, path):
        if isinstance(node, dict):
            return {k: walk(v, f"{path}.{k}" if path else k) for k, v in node.items()}
        if isinstance(node, list):
            return [walk(v, f"{path}.{i}") for i, v in enumerate(node)]
        if node is None or node == "":
            return None
        st = leaf_status(path, node, fc, boxed)
        report[path] = st
        return node if st != "not_found" else None

    return walk(gold, ""), report


# ---------------------------------------------------------------- 표본 추출
def allocate(groups: dict, n: int) -> dict:
    """레이아웃(발행사)별로 n건을 최대한 고르게 배분 (부족한 그룹의 남는 몫은 다른 그룹으로)."""
    quota, left, open_g = {g: 0 for g in groups}, n, sorted(groups)
    while left > 0 and open_g:
        share = max(1, left // len(open_g))
        for g in list(open_g):
            take = min(share, len(groups[g]) - quota[g], left)
            quota[g] += take
            left -= take
            if quota[g] >= len(groups[g]):
                open_g.remove(g)
            if left == 0:
                break
    return quota


def pick_scans(cands_by_group, quota, rng):
    """그룹별 할당량 안에서 scan/photo 프로필을 번갈아 선택."""
    chosen = []
    for g, q in quota.items():
        by_prof = collections.defaultdict(list)
        for row in cands_by_group[g]:
            by_prof[row["profile"]].append(row)
        for lst in by_prof.values():
            rng.shuffle(lst)
        profs = sorted(by_prof)
        i = 0
        picked = set()  # 한 문서가 scan·photo 둘 다 있을 때 두 번 뽑히지 않게 한다
        while q > 0 and any(by_prof.values()):
            p = profs[i % len(profs)]
            if by_prof[p]:
                row = by_prof[p].pop()
                if row["doc_id"] not in picked:
                    picked.add(row["doc_id"])
                    chosen.append(row)
                    q -= 1
            i += 1
    return chosen


# ---------------------------------------------------------------- 메인
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="data/company_docs_v2_en")
    ap.add_argument("--out", default="data/eval/tradepilot_eval_v2")
    ap.add_argument("--n-clean", type=int, default=100)
    ap.add_argument("--n-scan", type=int, default=50)
    ap.add_argument("--dpi", type=int, default=150)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--splits", nargs="+", default=SPLITS, help="뽑을 split (기본: validation test)")
    ap.add_argument("--per-company", type=int, default=0,
                    help="발행사별 N건씩 (clean·scan 각각, 부족하면 있는 만큼). 0이면 --n-clean/--n-scan 균등 배분")
    a = ap.parse_args()
    src, out = Path(a.src), Path(a.out)
    rng = random.Random(a.seed)
    manifest, summary = [], {"created": dt.datetime.now().isoformat(timespec="seconds"),
                             "source": str(src), "seed": a.seed, "dpi": a.dpi,
                             "criteria": f"en, 1-page, {'+'.join(a.splits)}, "
                                         + (f"{a.per_company} per issuer" if a.per_company
                                            else "stratified by issuer layout"),
                             "types": {}}

    for t in TYPES:
        meta_rows = []
        for sp in a.splits:
            meta_rows += pq.read_table(src / "data" / t / f"{sp}.parquet", columns=META_COLS).to_pylist()
        one_page = {r["doc_id"]: r for r in meta_rows if r["pages"] == 1}

        scan_rows = []
        for sp in a.splits:
            scan_rows += pq.read_table(src / "scans" / t / f"{sp}.parquet",
                                       columns=["doc_id", "split", "page", "profile"]).to_pylist()
        scan_ok = [r for r in scan_rows if r["page"] == 0 and r["doc_id"] in one_page]
        scan_docs = {r["doc_id"] for r in scan_ok}

        # 1) clean: 스캔이 없는 문서를 우선 사용해 scan 후보를 아껴 둔다
        groups = collections.defaultdict(list)
        for did, r in one_page.items():
            groups[r["company"]].append(did)
        for g in groups:
            groups[g].sort()
            rng.shuffle(groups[g])
            groups[g].sort(key=lambda d: d in scan_docs)       # 스캔 없는 문서가 앞으로
        q_clean = ({g: min(a.per_company, len(v)) for g, v in groups.items()} if a.per_company
                   else allocate(groups, a.n_clean))
        clean_ids = [d for g, q in q_clean.items() for d in groups[g][:q]]

        # 2) scan: clean과 겹치지 않는 문서
        sgroups = collections.defaultdict(list)
        for r in scan_ok:
            if r["doc_id"] not in clean_ids:
                sgroups[one_page[r["doc_id"]]["company"]].append(r)
        for g in sgroups:
            sgroups[g].sort(key=lambda r: (r["doc_id"], r["profile"]))
        q_scan = ({g: min(a.per_company, len({r["doc_id"] for r in v})) for g, v in sgroups.items()}
                  if a.per_company else allocate({g: v for g, v in sgroups.items()}, a.n_scan))
        scan_pick = pick_scans(sgroups, q_scan, rng)
        scan_ids = [r["doc_id"] for r in scan_pick]
        assert not set(clean_ids) & set(scan_ids)

        # 3) 상세 컬럼 읽기 (선택된 문서만)
        need = set(clean_ids) | set(scan_ids)
        full = {}
        for sp in a.splits:
            tb = pq.read_table(src / "data" / t / f"{sp}.parquet",
                               columns=["doc_id", "pdf", "extracted_data", "file_content", "options", "boxes"],
                               filters=[("doc_id", "in", list(need))])
            for r in tb.to_pylist():
                full[r["doc_id"]] = r
        scan_img = {}
        want = {(r["doc_id"], r["profile"]) for r in scan_pick}
        for sp in a.splits:
            tb = pq.read_table(src / "scans" / t / f"{sp}.parquet",
                               columns=["doc_id", "page", "profile", "image", "params", "width", "height"],
                               filters=[("doc_id", "in", scan_ids), ("page", "=", 0)])
            for r in tb.to_pylist():
                if (r["doc_id"], r["profile"]) in want:
                    scan_img[r["doc_id"]] = r

        stat = collections.Counter()
        field_stat = collections.defaultdict(collections.Counter)
        for kind, ids in (("clean", clean_ids), ("scan", scan_ids)):
            for did in ids:
                r, m = full[did], one_page[did]
                d = out / kind / t / did
                d.mkdir(parents=True, exist_ok=True)
                gold = json.loads(r["extracted_data"])
                fc = r["file_content"] or ""
                boxed = set(json.loads(r["boxes"] or "{}").keys())
                gp, rep = printed_only(gold, squash(fc), {re.sub(r"\.\d+\.", ".N.", b) for b in boxed} | boxed)
                for p, st in rep.items():
                    field_stat[re.sub(r"\.\d+", "[]", p)][st] += 1
                (d / "gold.json").write_text(json.dumps(gold, ensure_ascii=False, indent=1), encoding="utf-8")
                (d / "gold_printed.json").write_text(json.dumps(gp, ensure_ascii=False, indent=1), encoding="utf-8")
                (d / "printed_report.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding="utf-8")
                (d / "pdf_text.txt").write_text(fc, encoding="utf-8")
                meta = {k: m[k] for k in META_COLS if k != "pages"} | {"type": t, "set": kind,
                        "options": json.loads(r["options"] or "{}")}
                if kind == "clean":
                    doc = pymupdf.open(stream=r["pdf"]["bytes"], filetype="pdf")
                    pix = doc[0].get_pixmap(dpi=a.dpi)
                    pix.save(str(d / "pdf.png"))
                    meta["image"] = {"file": "pdf.png", "width": pix.width, "height": pix.height, "dpi": a.dpi}
                else:
                    s = scan_img[did]
                    (d / "scan.jpg").write_bytes(s["image"]["bytes"])
                    meta["image"] = {"file": "scan.jpg", "width": s["width"], "height": s["height"],
                                     "profile": s["profile"], "params": json.loads(s["params"] or "{}")}
                (d / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
                manifest.append({"set": kind, "type": t, "doc_id": did, "split": m["split"],
                                 "company": m["company"], "layout": f'{m["layout"]}/{m["theme"]}',
                                 "image": meta["image"]["file"], "profile": meta["image"].get("profile")})
                stat[(kind, m["company"], meta["image"].get("profile"))] += 1

        summary["types"][t] = {
            "available_1page": len(one_page), "available_1page_with_scan": len(scan_docs),
            "clean": len(clean_ids), "scan": len(scan_ids),
            "by_set_company_profile": {" / ".join(str(x) for x in k): v for k, v in sorted(stat.items())},
            "printed_check": {p: dict(c) for p, c in sorted(field_stat.items())},
        }
        print(t, "clean", len(clean_ids), "scan", len(scan_ids), dict(stat), flush=True)

    with open(out / "manifest.jsonl", "w", encoding="utf-8") as f:
        for row in manifest:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    (out / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=1), encoding="utf-8")
    print("DONE", len(manifest), "docs ->", out)


if __name__ == "__main__":
    main()
