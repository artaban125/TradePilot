# VLM 비교 (eval_v3, 프롬프트 v2) — Qwen2.5-VL-7B vs InternVL3-8B

- 실행: 2026-11-27 10:31~17:05, RTX 4090, bf16, 프롬프트 `v2-20261127`
- 평가셋: `tradepilot_eval_v3` — 발행사 전체(송장 26곳, 발주서 17곳) × 10건. clean 430건(pdf, pdf_text), scan 400건
  (문서 목록: [`eval_sets/tradepilot_eval_v3_manifest.jsonl`](eval_sets/tradepilot_eval_v3_manifest.jsonl))
- 채점: `score.py`, 정답 `gold_printed.json`(문서에 인쇄된 값만). 모델별 상세: `report_<model>_eval_v3_{clean,scan}.md`
- JSON 파싱 실패: 2,520건 중 1건 (InternVL3, pdf, 송장 `1a29f000c8546a9e`, 출력 JSON 문법 오류)

## 1. 요약

| 종류 | 방식 | 건수 | 정확도 Qwen / InternVL3 | 완전일치 Qwen / InternVL3 | 평균 시간(초) Qwen / InternVL3 |
| --- | --- | --- | --- | --- | --- |
| 송장 | pdf | 260 | 95.0% / **95.4%** | **78** / 59 | 10.18 / **9.44** |
| 송장 | pdf_text | 260 | 95.7% / **98.4%** | 85 / **151** | 10.27 / **9.59** |
| 송장 | scan | 230 | 94.3% / **95.5%** | 55 / **60** | 9.95 / **9.09** |
| 발주서 | pdf | 170 | 94.2% / 94.3% | **68** / 38 | 8.97 / **8.19** |
| 발주서 | pdf_text | 170 | 94.6% / **98.0%** | 72 / **115** | 9.02 / **8.36** |
| 발주서 | scan | 170 | 94.6% / **95.6%** | **69** / 54 | 9.30 / **8.41** |

- 최대 GPU 메모리: InternVL3 15.3 GB
- 발행사 43곳 중 InternVL3가 높은 곳 28, Qwen이 높은 곳 11 (pdf_text 기준)

## 2. 레이아웃별 정확도 (pdf_text)

| 종류 | 레이아웃 | 건수 | Qwen | InternVL3 |
| --- | --- | --- | --- | --- |
| 송장 | classic | 80 | 97.8% | 98.9% |
| 송장 | letterhead | 50 | 96.0% | 97.3% |
| 송장 | modern | 70 | 94.4% | 98.4% |
| 송장 | sidebar | 60 | 93.7% | 98.2% |
| 발주서 | classic | 50 | 96.4% | 98.8% |
| 발주서 | letterhead | 40 | 98.1% | 98.2% |
| 발주서 | modern | 40 | 92.2% | 94.9% |
| 발주서 | sidebar | 40 | 91.4% | 99.9% |

## 3. 정확도가 낮은 발행사 (pdf_text, 두 모델 평균 하위 8)

| 종류 | 발행사 | Qwen | InternVL3 |
| --- | --- | --- | --- |
| 발주서 | vantage-outdoor-corp | 89.2% | 92.6% |
| 발주서 | harbor-velo-co | 89.7% | 92.9% |
| 송장 | union-sound-corp | 88.4% | 94.6% |
| 송장 | lumen-media-corp | 87.7% | 95.4% |
| 송장 | quarry-music-llc | 85.6% | 99.4% |
| 송장 | quarry-recordings-plc | 89.8% | 95.6% |
| 송장 | boreal-components-co | 93.6% | 93.6% |
| 발주서 | iris-sports-corp | 91.1% | 96.2% |

## 4. 자주 틀린 필드 (pdf_text)

| 모델 | 종류 | 상위 필드 (틀린 횟수) |
| --- | --- | --- |
| Qwen | 송장 | `items.description` 220 (품명 아래 설명 줄까지 붙임), `issuer.country` 113, `bill_to.country` 37 (국가 대신 주 약자 CO·CA 등), `issue_date` 13 (월·일 뒤바뀜) |
| Qwen | 발주서 | `issuer.country` 80, `deliver_to.country` 63, `delivery_date` 48, `vendor.country` 44 |
| InternVL3 | 송장 | `notes` 51, `items.description` 49, `issuer.country` 22, `bill_to.city` 12 |
| InternVL3 | 발주서 | `vendor.country` 24, `issuer.country` 16, `deliver_to.country` 12, `instructions` 12 |

송장 `notes` 문장이 `instructions` 칸에 들어간 건수 (v2 프롬프트의 `instructions` 정의가 넓어서 생긴 부작용):

| 모델 | pdf | pdf_text | scan |
| --- | --- | --- | --- |
| Qwen | 27 | 3 | 47 |
| InternVL3 | 80 | 49 | 88 |

## 5. 해석

- eval_v1(발행사 1곳)에서는 Qwen이 앞섰지만, 발행사·레이아웃이 다양한 eval_v3에서는 **InternVL3가 모든 방식에서 같거나 높습니다** (pdf_text +2.7~3.4%p, 완전일치 151 vs 85, 115 vs 72).
- Qwen은 modern·sidebar 레이아웃에서 크게 떨어지고, 국가 칸에 주 약자를 넣는 오류가 많습니다.
- 이미지만 넣을 때(pdf, scan)의 완전일치 문서 수는 Qwen이 많은 경우가 있습니다.
- 발주서 `instructions`는 v2 프롬프트로 대부분 해결됐습니다 (eval_v1 v1 프롬프트에서는 Cobalt 50건 중 49건 누락).

## 6. 주의할 점

- eval_v3에서 v1 프롬프트는 실행하지 않았습니다. 이번 차이가 모델 차이인지, v2 프롬프트가 두 모델에 다르게 작용한 결과인지는 구분할 수 없습니다.
- 발행사 43곳 중 35곳이 train split 회사입니다. 파인튜닝할 경우 eval_v3 830건은 학습 데이터에서 제외해야 합니다.
- 데이터셋 전체의 `instructions` 정답은 27,204건 모두 같은 문장("Please confirm this order and quote our PO number…")입니다.
- 종류별 레이아웃은 4종뿐인 합성 문서라, 실제 무역 문서에서의 성능은 따로 확인해야 합니다.
