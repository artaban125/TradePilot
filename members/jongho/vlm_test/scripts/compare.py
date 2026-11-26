"""두 모델의 추출 결과를 한 표로 비교한다 (채점 규칙은 score.py 그대로 재사용).

사용법 (저장소 최상위에서):
  python members/jongho/vlm_test/scripts/compare.py --report members/jongho/vlm_test/results/compare.md

비교 단위: 평가셋 × 입력 방식 × 문서 종류 × 모델
  - 전체 필드 정확도, 그룹별 정확도, 완전일치 문서 수, JSON 파싱 실패, 평균 시간·입출력 토큰
  - eval_v2 는 발행사(레이아웃)별 정확도도 따로 낸다 (처음 보는 양식에 대한 성능 확인)
"""
import argparse, collections, json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from score import gold_fields, group_of, match_items, norm, pred_fields, ITEM_KEYS  # noqa: E402

T = Path("members/jongho/vlm_test")
MODELS = ["qwen25vl", "internvl3"]
NAMES = {"qwen25vl": "Qwen2.5-VL-7B", "internvl3": "InternVL3-8B"}
GROUPS = ["기본정보", "당사자", "품목", "금액", "조건·문구"]
# (결과 폴더 이름, 평가셋 폴더, 채점 정답 파일)
SETS = [("eval_v1", "data/eval/tradepilot_eval_v1", "gold.json"),
        ("eval_v2_clean", "data/eval/tradepilot_eval_v2/clean", "gold_printed.json"),
        ("eval_v2_scan", "data/eval/tradepilot_eval_v2/scan", "gold_printed.json")]


def score_doc(rec, ddir, gold_file):
    gold = json.loads((ddir / gold_file).read_text(encoding="utf-8"))
    gf, gitems = gold_fields(gold, (ddir / "pdf_text.txt").read_text(encoding="utf-8"))
    pf, pitems = pred_fields(rec["pred"])
    checks = [(k, gf[k], pf.get(k)) for k in gf]
    for g, p in match_items(gitems, pitems):
        checks += [(f"items.{k}", g.get(k), p.get(k)) for k in ITEM_KEYS if g.get(k) is not None]
    res = [(group_of(k), k, norm(k, gv) == norm(k, pv)) for k, gv, pv in checks]
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", default=str(T / "results" / "compare.md"))
    a = ap.parse_args()
    lines = []
    emit = lambda s="": (print(s), lines.append(s))  # noqa: E731

    emit("# Qwen2.5-VL-7B vs InternVL3-8B 제로샷 추출 비교\n")
    for m in MODELS:
        cfg = T / "results" / m / "eval_v1" / "run_config.json"
        if cfg.exists():
            c = json.loads(cfg.read_text(encoding="utf-8"))
            emit(f"- {NAMES[m]}: `{c['model_id']}` rev={c['revision']}, torch {c['torch']}, "
                 f"transformers {c['transformers']}, {c['gpu']}, max_pixels={c['max_pixels']}, "
                 f"prompt={c['prompt_version']}")
    emit()
    emit("| 평가셋 | 방식 | 종류 | 모델 | 건수 | 전체 정확도 | " + " | ".join(GROUPS) +
         " | 완전일치 | JSON 실패 | 평균 시간 | 입력/출력 토큰 |")
    emit("|" + "---|" * (10 + len(GROUPS)))
    layout_rows = []
    worst = collections.defaultdict(collections.Counter)
    for set_name, eval_dir, gold_file in SETS:
        eval_dir = Path(eval_dir)
        modes = sorted({p.name for m in MODELS for p in (T / "results" / m / set_name).glob("*") if p.is_dir()})
        for mode in modes:
            for tp in ["invoice", "purchase_order"]:
                for m in MODELS:
                    rdir = T / "results" / m / set_name / mode / tp
                    recs = [json.loads(f.read_text(encoding="utf-8")) for f in sorted(rdir.glob("*.json"))]
                    if not recs:
                        continue
                    grp = collections.defaultdict(lambda: [0, 0])
                    by_layout = collections.defaultdict(lambda: [0, 0])
                    perfect = perr = 0
                    for rec in recs:
                        ddir = eval_dir / tp / rec["doc_id"]
                        perr += rec["pred"] is None
                        res = score_doc(rec, ddir, gold_file)
                        layout = "-"
                        if (ddir / "meta.json").exists():
                            layout = json.loads((ddir / "meta.json").read_text(encoding="utf-8"))["company"]
                        for g, k, ok in res:
                            grp[g][0] += ok; grp[g][1] += 1
                            by_layout[layout][0] += ok; by_layout[layout][1] += 1
                            if not ok:
                                worst[(set_name, mode, tp, m)][k] += 1
                        perfect += all(ok for _, _, ok in res)
                    ok = sum(v[0] for v in grp.values()); tot = sum(v[1] for v in grp.values())
                    n = len(recs)
                    cells = " | ".join(f"{100 * grp[g][0] / grp[g][1]:.1f}%" if grp[g][1] else "-" for g in GROUPS)
                    emit(f"| {set_name} | {mode} | {tp} | {NAMES[m]} | {n} | **{100 * ok / tot:.1f}%** | {cells} | "
                         f"{perfect}/{n} | {perr} | {sum(r['seconds'] for r in recs) / n:.1f}s | "
                         f"{sum(r.get('input_tokens', 0) for r in recs) // n}/"
                         f"{sum(r.get('output_tokens', 0) for r in recs) // n} |")
                    if set_name.startswith("eval_v2"):
                        for lay, (o, t_) in sorted(by_layout.items()):
                            layout_rows.append((set_name, mode, tp, lay, m, o, t_))

    if layout_rows:
        emit("\n## eval_v2 발행사(레이아웃)별 전체 필드 정확도\n")
        emit("| 평가셋 | 종류 | 발행사 | " + " | ".join(NAMES[m] for m in MODELS) + " |")
        emit("|---|---|---|" + "---|" * len(MODELS))
        table = collections.defaultdict(dict)
        for s, mode, tp, lay, m, o, t_ in layout_rows:
            table[(s, tp, lay)][m] = f"{100 * o / t_:.1f}% ({t_})"
        for (s, tp, lay), v in table.items():
            emit(f"| {s} | {tp} | {lay} | " + " | ".join(v.get(m, "-") for m in MODELS) + " |")

    emit("\n## 자주 틀린 필드 (모델별 상위 5)\n")
    for (s, mode, tp, m), c in worst.items():
        emit(f"- {s}/{mode}/{tp} · {NAMES[m]}: " + ", ".join(f"{k} {v}회" for k, v in c.most_common(5)))
    Path(a.report).write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
