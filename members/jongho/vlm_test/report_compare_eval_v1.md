# Qwen2.5-VL-7B vs InternVL3-8B 제로샷 추출 비교

- Qwen2.5-VL-7B: `Qwen/Qwen2.5-VL-7B-Instruct` rev=None, torch 2.6.0+cu124, transformers 5.20.2, NVIDIA GeForce RTX 4090, max_pixels=1600000, prompt=v1-knlee-6f1cba8
- InternVL3-8B: `OpenGVLab/InternVL3-8B-hf` rev=259a3b64a14623c0ec91a045cb43f7c5af5fa6af, torch 2.6.0+cu124, transformers 5.20.2, NVIDIA GeForce RTX 4090, max_pixels=1600000, prompt=v1-knlee-6f1cba8

| 평가셋 | 방식 | 종류 | 모델 | 건수 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | JSON 실패 | 평균 시간 | 입력/출력 토큰 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| eval_v1 | pdf | invoice | Qwen2.5-VL-7B | 50 | **98.7%** | 99.6% | 95.0% | 99.6% | 98.5% | 100.0% | 26/50 | 0 | 11.5s | 2689/614 |
| eval_v1 | pdf | invoice | InternVL3-8B | 50 | **96.1%** | 98.8% | 96.4% | 96.7% | 96.0% | 82.1% | 7/50 | 0 | 10.9s | 2419/589 |
| eval_v1 | pdf | purchase_order | Qwen2.5-VL-7B | 50 | **88.7%** | 99.2% | 70.9% | 100.0% | 100.0% | 66.7% | 0/50 | 0 | 9.1s | 2689/478 |
| eval_v1 | pdf | purchase_order | InternVL3-8B | 50 | **90.1%** | 100.0% | 80.0% | 97.7% | 97.0% | 66.7% | 0/50 | 0 | 8.1s | 2419/435 |
| eval_v1 | pdf_text | invoice | Qwen2.5-VL-7B | 50 | **99.7%** | 99.6% | 99.3% | 99.9% | 98.5% | 100.0% | 42/50 | 0 | 11.6s | 3348/611 |
| eval_v1 | pdf_text | invoice | InternVL3-8B | 50 | **98.8%** | 99.6% | 98.8% | 99.8% | 97.0% | 90.2% | 24/50 | 0 | 11.0s | 3078/586 |
| eval_v1 | pdf_text | purchase_order | Qwen2.5-VL-7B | 50 | **93.1%** | 96.8% | 88.3% | 100.0% | 100.0% | 67.3% | 1/50 | 0 | 9.1s | 3213/476 |
| eval_v1 | pdf_text | purchase_order | InternVL3-8B | 50 | **93.1%** | 100.0% | 83.9% | 100.0% | 99.4% | 75.3% | 7/50 | 0 | 8.2s | 2943/436 |
| eval_v1 | scan | invoice | Qwen2.5-VL-7B | 50 | **98.8%** | 99.2% | 96.0% | 99.7% | 97.5% | 99.2% | 29/50 | 0 | 11.5s | 2689/612 |
| eval_v1 | scan | invoice | InternVL3-8B | 50 | **95.8%** | 99.6% | 94.8% | 97.0% | 93.0% | 82.1% | 6/50 | 0 | 11.0s | 2419/593 |
| eval_v1 | scan | purchase_order | Qwen2.5-VL-7B | 50 | **91.6%** | 99.2% | 82.1% | 100.0% | 98.8% | 66.7% | 0/50 | 0 | 9.1s | 2689/482 |
| eval_v1 | scan | purchase_order | InternVL3-8B | 50 | **91.9%** | 98.0% | 86.7% | 97.5% | 98.8% | 67.3% | 0/50 | 0 | 8.2s | 2419/441 |

## 자주 틀린 필드 (모델별 상위 5)

- eval_v1/pdf/invoice · Qwen2.5-VL-7B: issuer.country 7회, bill_to.name 5회, items.description 4회, totals.tax_total 3회, ship_to.city 3회
- eval_v1/pdf/invoice · InternVL3-8B: items.description 40회, notes 22회, totals.tax_total 8회, bill_to.city 7회, ship_to.name 3회
- eval_v1/pdf/purchase_order · Qwen2.5-VL-7B: instructions 50회, deliver_to.name 41회, deliver_to.city 41회, deliver_to.country 41회, vendor.city 2회
- eval_v1/pdf/purchase_order · InternVL3-8B: instructions 50회, vendor.city 30회, vendor.name 28회, vendor.country 28회, items.description 13회
- eval_v1/pdf_text/invoice · Qwen2.5-VL-7B: totals.tax_total 3회, bill_to.city 2회, ship_to.city 1회, due_date 1회, items.discount_rate 1회
- eval_v1/pdf_text/invoice · InternVL3-8B: notes 12회, totals.tax_total 6회, bill_to.city 4회, items.description 2회, due_date 1회
- eval_v1/pdf_text/purchase_order · Qwen2.5-VL-7B: instructions 49회, deliver_to.name 16회, deliver_to.city 16회, deliver_to.country 16회, delivery_date 7회
- eval_v1/pdf_text/purchase_order · InternVL3-8B: instructions 37회, vendor.name 23회, vendor.city 23회, vendor.country 23회, totals.tax_total 1회
- eval_v1/scan/invoice · Qwen2.5-VL-7B: bill_to.name 5회, totals.tax_total 5회, ship_to.city 4회, bill_to.city 3회, items.description 3회
- eval_v1/scan/invoice · InternVL3-8B: items.description 32회, notes 20회, totals.tax_total 10회, bill_to.city 7회, ship_to.city 6회
- eval_v1/scan/purchase_order · Qwen2.5-VL-7B: instructions 50회, deliver_to.name 25회, deliver_to.city 25회, deliver_to.country 25회, vendor.city 1회
- eval_v1/scan/purchase_order · InternVL3-8B: instructions 49회, vendor.name 17회, vendor.city 16회, vendor.country 15회, items.description 13회
