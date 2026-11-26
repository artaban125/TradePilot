"""Qwen2.5-VL 일괄 추출 평가 (서버용, bf16 기본).

사용법:
    python eval_vlm.py --eval-dir vlm_eval_set --out-dir results/bf16 --modes scan pdf pdf_text
    python eval_vlm.py ... --quant 4bit          # 노트북(8GB)용
eval-dir 구조: <type>/<doc_id>/{scan.jpg, pdf.png, pdf_text.txt, gold.json}
결과: <out-dir>/<mode>/<type>/<doc_id>.json  (이미 있으면 건너뜀 → 중단 후 재실행 가능)
"""
import argparse, json, math, re, time
from pathlib import Path

import torch
from PIL import Image
from transformers import AutoProcessor, BitsAndBytesConfig, Qwen2_5_VLForConditionalGeneration

MODEL_ID = "Qwen/Qwen2.5-VL-7B-Instruct"

SCHEMA_PROMPT = """You are a document information extraction system.
Read this business document image and return ONLY one JSON object with exactly this structure:

{
  "doc_type": "invoice | purchase_order | quote | shipping_order | packing_slip",
  "number": string,
  "issue_date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD" or null,
  "delivery_date": "YYYY-MM-DD" or null,
  "currency": "ISO 4217 code, e.g. USD, EUR, GBP",
  "parties": {
    "issuer":     {"name": string, "city": string, "country": string},
    "bill_to":    {"name": string, "city": string, "country": string} or null,
    "ship_to":    {"name": string, "city": string, "country": string} or null,
    "vendor":     {"name": string, "city": string, "country": string} or null,
    "deliver_to": {"name": string, "city": string, "country": string} or null
  },
  "items": [
    {"sku": string, "description": string, "quantity": number,
     "unit_price": "decimal string", "discount_rate": "decimal string, 2% -> 0.02, none -> 0.00",
     "line_total": "decimal string"}
  ],
  "totals": {"gross": string or null, "discount_total": string or null, "subtotal": string or null,
             "freight": string or null, "tax_total": string or null, "total": string},
  "payment_terms": string or null,
  "payment_instructions": string or null,
  "instructions": string or null,
  "carrier": string or null,
  "notes": string or null
}

Field meaning:
- issuer: the company whose letterhead/logo is on the document.
- bill_to: "Bill to" block. ship_to: "Ship to" block. Fill both if both are printed, even if identical.
- vendor: the supplier the order is placed with (purchase orders). deliver_to: "Deliver to" block.
- city: the city name only (not the street, not the postal code).
- payment_terms: the short terms line (e.g. "Net 30 days"). payment_instructions: the sentence about how to pay.
- instructions: request sentences to the vendor (purchase orders). notes: the "Notes" text.

Rules:
- Copy names, SKUs and texts exactly as printed.
- Money values: digits and a dot only, no currency symbol, no thousands separator (e.g. "12814.65").
- Discount amounts are positive numbers (e.g. "243.01").
- Use null for anything not printed in the document. Do not guess.
- Output JSON only, no explanation, no markdown fences."""

TEXT_HINT = """

The exact text of this document, extracted from the PDF text layer in reading order, is given below.
Use it to read characters and numbers precisely; use the image for layout (which value belongs to which label/column).
<<<PDF_TEXT
{text}
PDF_TEXT>>>"""

MODES = {"scan": ("scan.jpg", False), "pdf": ("pdf.png", False), "pdf_text": ("pdf.png", True)}


def load_image(path, max_pixels):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    if w * h > max_pixels:
        s = math.sqrt(max_pixels / (w * h))
        img = img.resize((int(w * s), int(h * s)), Image.LANCZOS)
    return img


def parse_json(text):
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    return json.loads(text[text.find("{"): text.rfind("}") + 1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-dir", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--modes", nargs="+", default=list(MODES))
    ap.add_argument("--quant", choices=["none", "4bit"], default="none")
    ap.add_argument("--max-pixels", type=int, default=1_600_000)
    ap.add_argument("--limit", type=int, default=0, help="문서 종류별 최대 건수 (0=전체)")
    a = ap.parse_args()

    kw = dict(device_map="cuda:0", dtype=torch.bfloat16, attn_implementation="sdpa")
    if a.quant == "4bit":
        kw["quantization_config"] = BitsAndBytesConfig(
            load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.float16,
            llm_int8_skip_modules=["visual", "lm_head"])
        kw["dtype"] = torch.float16
    t0 = time.time()
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(MODEL_ID, **kw).eval()
    processor = AutoProcessor.from_pretrained(MODEL_ID)
    print(f"[load] {time.time() - t0:.1f}s, GPU {torch.cuda.memory_allocated() / 2**30:.2f} GiB", flush=True)

    eval_dir, out_dir = Path(a.eval_dir), Path(a.out_dir)
    docs = []
    for tdir in sorted(p for p in eval_dir.iterdir() if p.is_dir()):
        ds = sorted(p for p in tdir.iterdir() if p.is_dir())
        docs += ds[: a.limit] if a.limit else ds

    for mode in a.modes:
        fname, use_text = MODES[mode]
        times = []
        for d in docs:
            out = out_dir / mode / d.parent.name / f"{d.name}.json"
            if out.exists():
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            prompt = SCHEMA_PROMPT
            if use_text:
                prompt += TEXT_HINT.format(text=(d / "pdf_text.txt").read_text(encoding="utf-8"))
            img = load_image(d / fname, a.max_pixels)
            messages = [{"role": "user", "content": [{"type": "image"}, {"type": "text", "text": prompt}]}]
            text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = processor(text=[text], images=[img], return_tensors="pt").to(model.device)
            t1 = time.time()
            with torch.inference_mode():
                gen = model.generate(**inputs, max_new_tokens=2000, do_sample=False)
            raw = processor.batch_decode(gen[:, inputs["input_ids"].shape[1]:], skip_special_tokens=True)[0]
            dt = time.time() - t1
            times.append(dt)
            rec = {"doc_id": d.name, "type": d.parent.name, "mode": mode, "seconds": round(dt, 2),
                   "input_tokens": int(inputs["input_ids"].shape[1]), "raw": raw}
            try:
                rec["pred"] = parse_json(raw)
            except Exception as e:  # noqa: BLE001
                rec["pred"], rec["parse_error"] = None, str(e)
            out.write_text(json.dumps(rec, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"[{mode}] {d.parent.name}/{d.name} {dt:.1f}s tokens={rec['input_tokens']}"
                  f"{' PARSE_ERROR' if rec['pred'] is None else ''}", flush=True)
        if times:
            print(f"[{mode}] done {len(times)} docs, avg {sum(times) / len(times):.1f}s", flush=True)
    print(f"[peak GPU] {torch.cuda.max_memory_allocated() / 2**30:.2f} GiB")


if __name__ == "__main__":
    main()
