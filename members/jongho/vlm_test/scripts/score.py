"""eval_vlm.py 결과를 정답과 비교해 필드별·그룹별 정확도를 낸다.

사용법: python score.py --eval-dir <평가셋> --out-dir <결과> [--gold-file gold.json|gold_printed.json] [--report report.md]

members/knlee/vlm_test/scripts/score.py (커밋 6f1cba8) 사본. 채점 규칙은 그대로이고 --gold-file 옵션만 추가했다.
tradepilot_eval_v2 는 인쇄된 값만 남긴 gold_printed.json 을 함께 제공한다.
"""
import argparse, collections, json, re, unicodedata
from decimal import Decimal, InvalidOperation
from pathlib import Path

PARTIES = ["issuer", "bill_to", "ship_to", "vendor", "deliver_to"]
ITEM_KEYS = ["sku", "description", "quantity", "unit_price", "discount_rate", "line_total"]
TOTAL_KEYS = ["gross", "discount_total", "subtotal", "freight", "tax_total", "total"]
MONEY = {"unit_price", "line_total", "discount_rate", "quantity"} | {f"totals.{k}" for k in TOTAL_KEYS}


def norm_text(v):
    s = unicodedata.normalize("NFKC", str(v))
    s = re.sub(r"[‐-―−]", "-", s)
    s = " ".join(s.lower().split()).strip(" .")
    return s


def norm(key, v):
    last = key.split(".")[-1]
    is_money = key in MONEY or last in MONEY
    if v is None or v == "":
        # 인쇄되지 않은 0 값(할인율 0, 운임 0 등)은 null 과 같은 것으로 본다
        return "0" if is_money and last != "quantity" else None
    if is_money:
        s = re.sub(r"[£$€,\s]", "", str(v)).replace("%", "")
        try:
            d = abs(Decimal(s))
            if "%" in str(v):
                d = d / 100
            return str(d.normalize())
        except InvalidOperation:
            return norm_text(v)
    return norm_text(v)


def group_of(key):
    if key.startswith("items"):
        return "품목"
    if key.startswith("totals"):
        return "금액"
    if key.split(".")[0] in PARTIES:
        return "당사자"
    if key in ("payment_terms", "payment_instructions", "instructions", "notes", "carrier"):
        return "조건·문구"
    return "기본정보"


# 금액 보조 항목은 문서에 해당 줄이 인쇄된 경우에만 채점한다.
# (할인·운임이 0이면 줄 자체가 없는데 정답 JSON에는 "0.00"이 들어 있음)
TOTAL_LABELS = {"gross": ["gross"], "discount_total": ["discount", "remise"],
                "freight": ["freight", "shipping"],
                "tax_total": ["tax", "vat", "tva"]}


def printed(key, pdf_text):
    labels = TOTAL_LABELS.get(key.removeprefix("totals."))
    return labels is None or any(l in pdf_text.lower() for l in labels)


def gold_fields(g, pdf_text=""):
    p, dates, extra, refs = g["parties"], g.get("dates", {}), g.get("extra", {}), g.get("refs", {})
    f = {"doc_type": g.get("doc_type"), "number": g.get("number"), "issue_date": g.get("issue_date"),
         "due_date": dates.get("due_date"), "delivery_date": dates.get("delivery_date"),
         "currency": g.get("currency"), "payment_terms": extra.get("payment_terms"),
         "payment_instructions": extra.get("payment_instructions"), "instructions": extra.get("instructions"),
         "carrier": refs.get("carrier"), "notes": g.get("notes")}
    for party in PARTIES:
        if party in p:
            f[f"{party}.name"] = p[party].get("name")
            f[f"{party}.city"] = p[party].get("address", {}).get("city")
            f[f"{party}.country"] = p[party].get("address", {}).get("country")
    for k in TOTAL_KEYS:
        if printed(f"totals.{k}", pdf_text):
            f[f"totals.{k}"] = g.get("totals", {}).get(k)
    # 문구 필드는 정답 문장이 실제로 문서에 인쇄된 경우에만 채점한다
    # (데이터셋 정답의 notes 중 일부는 PDF에 없는 문장임)
    flat = norm_text(" ".join(pdf_text.split()))
    for k in ("notes", "instructions", "payment_instructions"):
        if f.get(k) and norm_text(f[k])[:40] not in flat:
            f[k] = None
    items = g.get("items", [])
    return {k: v for k, v in f.items() if v is not None}, items


def pred_fields(d):
    d = d or {}
    f = {k: d.get(k) for k in ["doc_type", "number", "issue_date", "due_date", "delivery_date", "currency",
                                "payment_terms", "payment_instructions", "instructions", "carrier", "notes"]}
    parties = d.get("parties") or {}
    for party in PARTIES:
        for k in ["name", "city", "country"]:
            f[f"{party}.{k}"] = (parties.get(party) or {}).get(k)
    for k in TOTAL_KEYS:
        f[f"totals.{k}"] = (d.get("totals") or {}).get(k)
    return f, d.get("items") or []


def match_items(gold_items, pred_items):
    """SKU가 같은 품목끼리 짝짓고, 없으면 같은 순번끼리 짝짓는다."""
    by_sku = {norm_text(it.get("sku", "")): it for it in pred_items if it.get("sku")}
    pairs = []
    for i, g in enumerate(gold_items):
        p = by_sku.get(norm_text(g.get("sku", ""))) or (pred_items[i] if i < len(pred_items) else {})
        pairs.append((g, p or {}))
    return pairs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-dir", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--report")
    ap.add_argument("--gold-file", default="gold.json", help="gold.json(원본) 또는 gold_printed.json(인쇄된 값만, v2)")
    a = ap.parse_args()
    eval_dir, out_dir = Path(a.eval_dir), Path(a.out_dir)

    lines = []
    def emit(s=""):
        print(s); lines.append(s)

    summary = {}
    for mode_dir in sorted(p for p in out_dir.iterdir() if p.is_dir()):
        mode = mode_dir.name
        for type_dir in sorted(p for p in mode_dir.iterdir() if p.is_dir()):
            tp = type_dir.name
            grp = collections.defaultdict(lambda: [0, 0])
            field_err = collections.Counter()
            examples = collections.defaultdict(list)
            n_docs = perfect = parse_err = 0
            secs = []
            for rf in sorted(type_dir.glob("*.json")):
                rec = json.loads(rf.read_text(encoding="utf-8"))
                ddir = eval_dir / tp / rec["doc_id"]
                gold = json.loads((ddir / a.gold_file).read_text(encoding="utf-8"))
                n_docs += 1; secs.append(rec["seconds"])
                if rec["pred"] is None:
                    parse_err += 1
                gf, gitems = gold_fields(gold, (ddir / "pdf_text.txt").read_text(encoding="utf-8"))
                pf, pitems = pred_fields(rec["pred"])
                checks = [(k, gf[k], pf.get(k)) for k in gf]
                for i, (g, p) in enumerate(match_items(gitems, pitems)):
                    for k in ITEM_KEYS:
                        if g.get(k) is not None:
                            checks.append((f"items.{k}", g.get(k), p.get(k)))
                ok_all = True
                for k, gv, pv in checks:
                    g_ = group_of(k)
                    grp[g_][1] += 1
                    if norm(k, gv) == norm(k, pv):
                        grp[g_][0] += 1
                    else:
                        ok_all = False
                        field_err[k] += 1
                        if len(examples[k]) < 2:
                            examples[k].append((rec["doc_id"], gv, pv))
                perfect += ok_all
            tot_ok = sum(v[0] for v in grp.values()); tot = sum(v[1] for v in grp.values())
            summary[(mode, tp)] = (tot_ok / tot if tot else 0, {k: v[0] / v[1] for k, v in grp.items()},
                                   perfect, n_docs, parse_err, sum(secs) / max(len(secs), 1))
            emit(f"\n## {mode} / {tp}  —  {n_docs}건, 전체 필드 정확도 {100 * tot_ok / tot:.1f}% "
                 f"({tot_ok}/{tot}), 완전일치 문서 {perfect}/{n_docs}, JSON 실패 {parse_err}, 평균 {summary[(mode, tp)][5]:.1f}s")
            emit("| 그룹 | 정확도 |"); emit("|---|---|")
            for g_ in ["기본정보", "당사자", "품목", "금액", "조건·문구"]:
                if g_ in grp:
                    emit(f"| {g_} | {100 * grp[g_][0] / grp[g_][1]:.1f}% ({grp[g_][0]}/{grp[g_][1]}) |")
            emit("\n자주 틀린 필드 (상위 8):")
            for k, c in field_err.most_common(8):
                ex = "; ".join(f"정답={gv!r} 예측={pv!r}" for _, gv, pv in examples[k][:1])
                emit(f"- {k}: {c}회  예) {ex}")

    emit("\n## 요약")
    emit("| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |")
    emit("|---|---|---|---|---|---|---|---|---|---|")
    for (mode, tp), (acc, g, perf, n, pe, s) in summary.items():
        cells = " | ".join(f"{100 * g[x]:.1f}%" if x in g else "-" for x in ["기본정보", "당사자", "품목", "금액", "조건·문구"])
        emit(f"| {mode} | {tp} | **{100 * acc:.1f}%** | {cells} | {perf}/{n} | {s:.1f}s |")
    if a.report:
        Path(a.report).write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
