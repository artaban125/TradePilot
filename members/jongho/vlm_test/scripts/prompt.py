"""VLM 추출 프롬프트 (v1, v2).

v1: members/knlee/vlm_test/scripts/eval_vlm.py (커밋 6f1cba8)의 SCHEMA_PROMPT·TEXT_HINT를 문구 그대로 복사했다.
    11.24 Qwen 기준선과 같은 조건으로 모델을 비교하기 위해 수정하지 않는다.
v2: v1에서 eval_v1 실패 유형에 맞춰 Field meaning·Rules 일부만 바꿨다 (JSON 구조·TEXT_HINT는 같음).
    - instructions / payment_instructions 구분 기준, 꼬리말 제외, notes 범위
    - vendor를 bill_to에 넣지 않기, deliver_to는 발행사와 같아도 채우기
    - 악센트 문자 그대로 옮기기
    예시 문장은 평가 데이터에 없는 문장을 쓴다 (정답 문장을 알려 주지 않기 위해).
run_eval.py --prompt v1|v2 로 고른다.
"""

PROMPT_VERSION = "v1-knlee-6f1cba8"

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

# ---------------------------------------------------------------- v2
_V2_REPLACE = [
    ('- vendor: the supplier the order is placed with (purchase orders). deliver_to: "Deliver to" block.\n',
     '- vendor: the "Vendor" / "Supplier" block of a purchase order. Put it in vendor, never in bill_to.\n'
     '  On a purchase order, bill_to and ship_to are null unless blocks with those labels are printed.\n'
     '- deliver_to: "Deliver to" block. Fill it even if it is the same company as the issuer.\n'),
    ('- payment_terms: the short terms line (e.g. "Net 30 days"). payment_instructions: the sentence about how to pay.\n'
     '- instructions: request sentences to the vendor (purchase orders). notes: the "Notes" text.\n',
     '- payment_terms: the short terms line (e.g. "Net 30 days").\n'
     '- payment_instructions: only a sentence that tells how to pay (bank account, IBAN, transfer, cheque, payment method).\n'
     '- instructions: a sentence that asks the vendor to do something (e.g. "Please send an order confirmation.",\n'
     '  "Ship all items in one delivery."). It may be printed without a label, right below the payment terms;\n'
     '  it is still instructions, not payment_instructions.\n'
     '- notes: the text under a "Notes" label only.\n'
     '- Do not put footer text (thank-you lines, website, e-mail, phone at the bottom of the page) in any field.\n'),
    ('- Copy names, SKUs and texts exactly as printed.\n',
     '- Copy names, SKUs and texts exactly as printed, including accented letters (e.g. ö, é, å; do not change ö to ø).\n'),
]
SCHEMA_PROMPT_V2 = SCHEMA_PROMPT
for _old, _new in _V2_REPLACE:
    assert SCHEMA_PROMPT_V2.count(_old) == 1, _old
    SCHEMA_PROMPT_V2 = SCHEMA_PROMPT_V2.replace(_old, _new)

PROMPTS = {  # --prompt 이름 -> (버전 문자열, 스키마 프롬프트)
    "v1": (PROMPT_VERSION, SCHEMA_PROMPT),
    "v2": ("v2-20261127", SCHEMA_PROMPT_V2),
}
