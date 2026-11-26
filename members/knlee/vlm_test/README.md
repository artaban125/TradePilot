# VLM 기준선 테스트 (이규남)

Qwen2.5-VL-7B-Instruct가 영문 송장·발주서 이미지에서 구조화된 JSON을 얼마나 정확히 뽑는지 확인한 사전 테스트입니다.
기획 단계의 실현 가능성 검증용이며, 이 결과가 W-04 기준선과 W-05 개선 실험의 출발점이 됩니다.

## 결과 요약 (RTX 4090, bf16, 평가셋 송장 50 + 발주서 50)

| 입력 방식 | 송장 정확도 | 발주서 정확도 | 문서당 시간 |
| --- | --- | --- | --- |
| 스캔 이미지 (`scan`) | 98.8% | 91.6% | 송장 11.5초 / 발주서 9.1초 |
| PDF 이미지 (`pdf`) | 98.7% | 88.7% | 송장 11.5초 / 발주서 9.1초 |
| PDF 이미지 + 텍스트 힌트 (`pdf_text`) | **99.7%** | **93.1%** | 송장 11.6초 / 발주서 9.1초 |

필드 그룹별 정확도와 자주 틀린 필드는 [`baseline_report_bf16.md`](baseline_report_bf16.md)에 있습니다.

**발견한 실패 유형과 개선 방향**
| 실패 | 개선 방향 |
| --- | --- |
| 발주서 요청 문구(instructions) 누락, 납품처(deliver_to) 누락 | 프롬프트에 칸 위치·이름 설명 보강 |
| 세금이 두 줄일 때 합산 오류 | 세금을 줄별로 추출하고 합산은 코드로 |
| 날짜의 일·월 뒤바뀜 | 국가별 날짜 형식 규칙으로 후처리 |
| 악센트 문자 오인식 | 전자 PDF는 텍스트 힌트 사용 (`pdf_text`) |

## 실행 방법

필요 패키지: `torch`(CUDA), `transformers`, `pillow`, 4-bit 실행 시 `bitsandbytes`

```bash
# 저장소 최상위에서
T=members/knlee/vlm_test
EVAL=data/eval/tradepilot_eval_v1        # 받는 법: data/README.md

# 빠른 확인 (종류별 3건, 스캔 이미지만)
python $T/scripts/eval_vlm.py --eval-dir $EVAL --out-dir $T/results/smoke --modes scan --limit 3

# 전체 (100건 × 3방식, 4090에서 약 1시간). 접속이 끊겨도 계속 돌도록 nohup 사용
nohup python $T/scripts/eval_vlm.py --eval-dir $EVAL --out-dir $T/results/bf16 > $T/logs/bf16.log 2>&1 &

# 채점
python $T/scripts/score.py --eval-dir $EVAL --out-dir $T/results/bf16 --report $T/results/bf16_report.md
```

| 옵션 | 설명 |
| --- | --- |
| `--modes` | `scan`, `pdf`, `pdf_text` 중 선택 (기본: 셋 다) |
| `--quant 4bit` | 메모리가 작은 GPU용 4-bit 양자화 (기본 `none` = bf16) |
| `--max-pixels` | 입력 이미지 최대 픽셀 수 (기본 1,600,000) |
| `--limit N` | 문서 종류별 최대 N건 |

- 결과는 `<out-dir>/<mode>/<type>/<doc_id>.json`으로 저장되고, 이미 있는 문서는 건너뜁니다. 중간에 멈춰도 다시 실행하면 이어서 진행합니다.
- `results/`와 `logs/`는 `.gitignore`로 제외되어 커밋되지 않습니다.

## 채점 기준 (`score.py`)
- 필드를 5개 그룹(기본정보·당사자·품목·금액·조건·문구)으로 나눠 정확도를 냅니다. 품목은 SKU로 짝을 맞춥니다.
- 정답에는 있지만 **문서에 인쇄되지 않은 값**은 채점에서 뺍니다. 예를 들어 0원이라 표시되지 않은 합계나, 문서에 없는 비고가 그렇습니다.
- 금액은 숫자로 비교하고, 비어 있는 값과 "0"은 같은 것으로 봅니다.

## 파일
| 파일 | 내용 |
| --- | --- |
| `scripts/eval_vlm.py` | 평가셋 일괄 추출 (추출 프롬프트 포함) |
| `scripts/score.py` | 정답 JSON과 비교해 그룹별 정확도·실패 필드 보고서 생성 |
| `baseline_report_bf16.md` | 4090 bf16 기준선 상세 결과 |
