"""VLM 제로샷 추출: Qwen2.5-VL-7B / InternVL3-8B (같은 프롬프트·같은 해상도·같은 생성 설정).

평가셋 폴더 구조: <eval-dir>/<type>/<doc_id>/{scan.jpg, pdf.png, pdf_text.txt, gold.json}
결과: <out-dir>/<mode>/<type>/<doc_id>.json  (이미 있으면 건너뜀 → 중단 후 다시 실행하면 이어서 진행)

사용법 (저장소 최상위에서):
  T=members/jongho/vlm_test
  python $T/scripts/run_eval.py --model qwen25vl  --eval-dir data/eval/tradepilot_eval_v1 \
         --out-dir $T/results/qwen25vl/eval_v1 --modes scan pdf pdf_text
  python $T/scripts/run_eval.py --model internvl3 --eval-dir data/eval/tradepilot_eval_v1 \
         --out-dir $T/results/internvl3/eval_v1 --modes scan pdf pdf_text
  # 입력만 만들어 토큰 수 확인 (모델 로딩 없음)
  python $T/scripts/run_eval.py --model internvl3 --eval-dir data/eval/tradepilot_eval_v1 --out-dir /tmp/x --dry-run 2
"""
import argparse, json, math, os, re, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prompt import PROMPTS, TEXT_HINT  # noqa: E402

MODELS = {
    "qwen25vl": {"id": "Qwen/Qwen2.5-VL-7B-Instruct", "revision": None},
    "internvl3": {"id": "OpenGVLab/InternVL3-8B-hf", "revision": "259a3b64a14623c0ec91a045cb43f7c5af5fa6af"},
}
# mode -> (이미지 파일, 텍스트 힌트 사용 여부)  — knlee eval_vlm.py 와 동일
MODES = {"scan": ("scan.jpg", False), "pdf": ("pdf.png", False), "pdf_text": ("pdf.png", True)}


def load_image(path, max_pixels):
    from PIL import Image
    img = Image.open(path).convert("RGB")
    w, h = img.size
    if w * h > max_pixels:
        s = math.sqrt(max_pixels / (w * h))
        img = img.resize((int(w * s), int(h * s)), Image.LANCZOS)
    return img


def parse_json(text):
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    return json.loads(text[text.find("{"): text.rfind("}") + 1])


def build_inputs(processor, img, prompt):
    messages = [{"role": "user", "content": [{"type": "image", "image": img}, {"type": "text", "text": prompt}]}]
    return processor.apply_chat_template(messages, add_generation_prompt=True, tokenize=True,
                                         return_dict=True, return_tensors="pt")


def list_docs(eval_dir: Path, limit: int):
    docs = []
    for tdir in sorted(p for p in eval_dir.iterdir() if p.is_dir()):
        ds = sorted(p for p in tdir.iterdir() if p.is_dir())
        docs += ds[:limit] if limit else ds
    return docs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", choices=MODELS, required=True)
    ap.add_argument("--eval-dir", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--modes", nargs="+", choices=MODES, default=list(MODES))
    ap.add_argument("--max-pixels", type=int, default=1_600_000, help="knlee 기준선과 같은 값")
    ap.add_argument("--internvl-max-patches", type=int, default=6,
                    help="InternVL 타일 수 상한 (6타일+썸네일 = 이미지 토큰 1,792, Qwen 약 2,040과 비슷한 수준)")
    ap.add_argument("--max-new-tokens", type=int, default=2000)
    ap.add_argument("--limit", type=int, default=0, help="문서 종류별 최대 건수 (0=전체)")
    ap.add_argument("--dry-run", type=int, default=0, help="N건 입력만 만들어 토큰 수 출력 (모델 로딩 안 함)")
    ap.add_argument("--prompt", choices=PROMPTS, default="v1", help="프롬프트 버전 (prompt.py PROMPTS)")
    a = ap.parse_args()
    PROMPT_VERSION, SCHEMA_PROMPT = PROMPTS[a.prompt]

    import torch
    from transformers import AutoModelForImageTextToText, AutoProcessor

    spec = MODELS[a.model]
    rev = {"revision": spec["revision"]} if spec["revision"] else {}
    pkw = dict(rev)
    if a.model == "internvl3":
        pkw["max_patches"] = a.internvl_max_patches
    processor = AutoProcessor.from_pretrained(spec["id"], **pkw)

    eval_dir, out_dir = Path(a.eval_dir), Path(a.out_dir)
    docs = list_docs(eval_dir, a.limit)
    if not docs:
        sys.exit(f"문서가 없습니다: {eval_dir}")

    if a.dry_run:
        for d in docs[: a.dry_run] + docs[-a.dry_run:]:
            for mode in a.modes:
                fname, use_text = MODES[mode]
                if not (d / fname).exists():
                    continue
                prompt = SCHEMA_PROMPT + (TEXT_HINT.format(text=(d / "pdf_text.txt").read_text(encoding="utf-8"))
                                          if use_text else "")
                img = load_image(d / fname, a.max_pixels)
                inp = build_inputs(processor, img, prompt)
                print(f"[dry-run] {a.model} {mode} {d.parent.name}/{d.name} image={img.size} "
                      f"input_tokens={inp['input_ids'].shape[1]}")
        return

    t0 = time.time()
    model = AutoModelForImageTextToText.from_pretrained(
        spec["id"], dtype=torch.bfloat16, device_map="cuda:0", attn_implementation="sdpa", **rev).eval()
    print(f"[load] {a.model} {time.time() - t0:.1f}s, GPU {torch.cuda.memory_allocated() / 2**30:.2f} GiB",
          flush=True)

    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "run_config.json").write_text(json.dumps(
        vars(a) | {"model_id": spec["id"], "revision": spec["revision"], "prompt_version": PROMPT_VERSION,
                   "torch": torch.__version__, "transformers": __import__("transformers").__version__,
                   "gpu": torch.cuda.get_device_name(0)}, ensure_ascii=False, indent=1), encoding="utf-8")

    for mode in a.modes:
        fname, use_text = MODES[mode]
        times = []
        for d in docs:
            if not (d / fname).exists():
                continue
            out = out_dir / mode / d.parent.name / f"{d.name}.json"
            if out.exists():
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            prompt = SCHEMA_PROMPT
            if use_text:
                prompt += TEXT_HINT.format(text=(d / "pdf_text.txt").read_text(encoding="utf-8"))
            img = load_image(d / fname, a.max_pixels)
            inputs = build_inputs(processor, img, prompt).to(model.device)
            if "pixel_values" in inputs:
                inputs["pixel_values"] = inputs["pixel_values"].to(torch.bfloat16)
            torch.cuda.synchronize(); t1 = time.time()
            with torch.inference_mode():
                gen = model.generate(**inputs, max_new_tokens=a.max_new_tokens, do_sample=False)
            torch.cuda.synchronize(); dt = time.time() - t1
            n_in = int(inputs["input_ids"].shape[1])
            raw = processor.batch_decode(gen[:, n_in:], skip_special_tokens=True)[0]
            times.append(dt)
            rec = {"doc_id": d.name, "type": d.parent.name, "mode": mode, "model": a.model,
                   "seconds": round(dt, 2), "input_tokens": n_in, "output_tokens": int(gen.shape[1] - n_in),
                   "raw": raw}
            try:
                rec["pred"] = parse_json(raw)
            except Exception as e:  # noqa: BLE001
                rec["pred"], rec["parse_error"] = None, str(e)
            out.write_text(json.dumps(rec, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"[{a.model}/{mode}] {d.parent.name}/{d.name} {dt:.1f}s in={n_in} out={rec['output_tokens']}"
                  f"{' PARSE_ERROR' if rec['pred'] is None else ''}", flush=True)
        if times:
            print(f"[{a.model}/{mode}] done {len(times)} docs, avg {sum(times) / len(times):.1f}s", flush=True)
    print(f"[peak GPU] {torch.cuda.max_memory_allocated() / 2**30:.2f} GiB", flush=True)


if __name__ == "__main__":
    main()
