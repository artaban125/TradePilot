# VLM 모델 비교 테스트: Qwen2.5-VL-7B vs InternVL3-8B (김종호)

설계서의 "Vision 비교 후보 InternVL3-8B를 기준선 단계에서 같은 평가셋으로 1회 비교"를 수행한 결과입니다 (W-04).
이규남 님의 [`members/knlee/vlm_test`](../../knlee/vlm_test/) 기준선과 **같은 프롬프트·같은 해상도·같은 채점 규칙**으로 비교했습니다.

## 결과 요약 2: 발행사 전체 (2026-11-27, 평가셋 `tradepilot_eval_v3`, 프롬프트 v2)

발행사 43곳(송장 26, 발주서 17) × 10건, 레이아웃 종류별 4종으로 다시 비교했습니다. 정답은 `gold_printed.json`(인쇄된 값만) 기준입니다.

| 입력 방식 | 송장 Qwen2.5-VL | 송장 InternVL3 | 발주서 Qwen2.5-VL | 발주서 InternVL3 |
| --- | --- | --- | --- | --- |
| 스캔 이미지 (`scan`) | 94.3% | **95.5%** | 94.6% | **95.6%** |
| PDF 이미지 (`pdf`) | 95.0% | **95.4%** | 94.2% | 94.3% |
| PDF 이미지 + 텍스트 힌트 (`pdf_text`) | 95.7% | **98.4%** | 94.6% | **98.0%** |
| 완전일치 문서 수 (`pdf_text`) | 85/260 | **151/260** | 72/170 | **115/170** |

- 양식이 다양해지면 **InternVL3가 모든 방식에서 같거나 높습니다.** 문서당 시간도 0.7~0.9초 빠릅니다 (송장 9.6초, 발주서 8.4초, pdf_text).
- Qwen은 modern·sidebar 레이아웃과 국가 칸(주 약자 출력), 품명(설명 줄까지 포함)에서 많이 틀립니다.
- v2 프롬프트로 발주서 `instructions` 누락은 대부분 해결됐지만, 송장 `notes` 문장이 `instructions`로 들어가는 부작용이 생겼습니다.
- JSON 파싱 실패: 2,520건 중 1건 (InternVL3, pdf, 송장)
- eval_v3에서 v1 프롬프트는 실행하지 않아, 모델 차이와 프롬프트 효과를 나눠 볼 수는 없습니다.
- 상세: [`report_compare_eval_v3.md`](report_compare_eval_v3.md), 모델별 보고서: `report_<model>_eval_v3_{clean,scan}.md`

## 결과 요약 1: 발행사 1곳 (2026-11-26, RTX 4090, bf16, 평가셋 `tradepilot_eval_v1` 송장 50 + 발주서 50)

| 입력 방식 | 송장 Qwen2.5-VL | 송장 InternVL3 | 발주서 Qwen2.5-VL | 발주서 InternVL3 |
| --- | --- | --- | --- | --- |
| 스캔 이미지 (`scan`) | **98.8%** | 95.8% | 91.6% | **91.9%** |
| PDF 이미지 (`pdf`) | **98.7%** | 96.1% | 88.7% | **90.1%** |
| PDF 이미지 + 텍스트 힌트 (`pdf_text`) | **99.7%** | 98.8% | 93.1% | 93.1% |
| 완전일치 문서 수 (`pdf_text`) | **42/50** | 24/50 | 1/50 | **7/50** |

| 항목 | Qwen2.5-VL-7B | InternVL3-8B |
| --- | --- | --- |
| 문서당 시간 (송장 / 발주서) | 11.5초 / 9.1초 | 11.0초 / 8.2초 |
| 최대 GPU 메모리 | 16.2 GB | 15.4 GB |
| 이미지 토큰 (1.6M 픽셀) | 약 2,040 | 1,792 (6타일 + 썸네일) |
| JSON 파싱 실패 | 0 / 300 | 0 / 300 |

- 상세 비교표: [`report_compare_eval_v1.md`](report_compare_eval_v1.md), 모델별 채점 보고서: `report_qwen25vl_eval_v1.md`, `report_internvl3_eval_v1.md`
- **재현 확인**: 이번 Qwen 출력 300건이 11.24 knlee 기준선 출력과 글자 단위로 모두 동일 → 두 모델이 기준선과 같은 조건에서 비교됨
- 시간은 `generate` 구간만 측정 (이미지 로딩·전처리·모델 로딩 제외). scan과 pdf는 같은 해상도로 줄여 넣으므로 입력 토큰이 같고 시간 차이도 0.1초 이내. 시간은 출력 길이에 비례 (두 모델 모두 출력 100토큰당 약 1.9초)

### 판단
- **송장은 Qwen2.5-VL이 뚜렷하게 우세**합니다 (특히 이미지만 넣을 때 +2.6~3.0%p, 완전일치 42 vs 24).
- 발주서는 비슷하거나 InternVL3가 약간 앞서지만, **틀리는 칸이 서로 다릅니다.**
- InternVL3는 0.5~0.9초 빠르고 메모리를 0.8 GB 덜 쓰지만 정확도 차이를 뒤집을 정도는 아닙니다.
- → **Qwen2.5-VL-7B를 기본 VLM으로 유지**하고, 발주서 약점은 프롬프트 개선(W-05)으로 대응하는 것을 제안합니다.
- (11.27 추가) 이 판단은 발행사 1곳 결과입니다. 발행사 전체(eval_v3)에서는 InternVL3가 앞서므로 위 "결과 요약 2"를 함께 보세요.

### 모델별 주요 실패 유형

| 모델 | 문서 | 자주 틀린 필드 | 예 |
| --- | --- | --- | --- |
| 공통 | 발주서 | `instructions` 누락 (37~50/50) | 요청 문구를 null로 출력 |
| Qwen2.5-VL | 발주서 | `deliver_to` 누락 (pdf 41, scan 25, pdf_text 16건) | 납품처 블록을 비움 |
| InternVL3 | 발주서 | `vendor` 누락 (pdf 28~30, pdf_text 23, scan 17건) | 공급사 블록을 비움 |
| InternVL3 | 송장 | 품명 철자 오류 (pdf 40, scan 32건) | `Röd Kaviar` → `Rød Kaviar`, `Giovanni` → `Giovannni` |
| InternVL3 | 송장 | `notes` 누락·오인 (12~22건) | 비고 대신 감사 문구를 출력 |
| 공통 | 송장 | 세금이 두 줄일 때 `tax_total` 합산 오류 | `156.88` → `167.84` |

### 주의할 점
- `tradepilot_eval_v1` 100건은 **모두 test split의 발행사 1곳(`cobalt-wholesale-ltd`), 레이아웃 1종**입니다. 다른 양식에서의 성능은 이 결과로 알 수 없습니다.
  → 발행사 8곳·레이아웃 8종으로 만든 `tradepilot_eval_v2`(300건)를 준비했습니다 (아래 참고, 아직 미실행).
- 채점은 knlee `score.py` 규칙 그대로입니다 (정답 `gold.json` 기준, 인쇄되지 않은 일부 문구·0원 합계는 제외).

## 폴더 구성

| 파일 | 내용 |
| --- | --- |
| `scripts/prompt.py` | 추출 프롬프트. v1: knlee `eval_vlm.py`(커밋 6f1cba8) 문구 그대로, v2: v1에서 필드 설명·규칙 일부 수정 (`PROMPTS`) |
| `scripts/run_eval.py` | Qwen2.5-VL-7B / InternVL3-8B(-hf) 추출. 입력 방식 `scan`·`pdf`·`pdf_text`, `--prompt v1|v2`, 이어서 실행 가능 |
| `scripts/score.py` | knlee `score.py` 사본 + `--gold-file` 옵션 (v2의 `gold_printed.json` 채점용) |
| `scripts/compare.py` | 두 모델 결과를 한 표로 비교, v2는 발행사(레이아웃)별 정확도도 출력 |
| `scripts/build_eval_set.py` | 평가셋 생성. 기본은 v2, `--splits`·`--per-company`로 v3 (발행사별 N건) |
| `scripts/run_all.sh` | eval_v1·v2: 추출 → 채점 → 비교표 일괄 실행 |
| `scripts/run_v3.sh` | eval_v3: 두 모델 × (clean pdf·pdf_text, scan) 추출 → 채점 |
| `eval_sets/tradepilot_eval_v3_manifest.jsonl` | eval_v3 문서 목록 830건 (set, type, doc_id, split, company, layout). 데이터 파일은 Git에 올리지 않음 |
| `eval_sets/tradepilot_eval_v3_summary.json` | eval_v3 구성 요약 (발행사·스캔 프로필별 건수, 인쇄 확인 통계) |
| `report_*.md` | 실행별 결과 보고서 (results/에서 복사) |

## 실행 방법

필요 패키지: `torch`(CUDA), `transformers>=5`(InternVL3-8B-hf는 transformers 내장 클래스 사용, `trust_remote_code` 불필요), `pillow`, `pymupdf`·`pyarrow`(v2 생성 시)

```bash
# 저장소 최상위에서
T=members/jongho/vlm_test

# 빠른 확인 (종류별 1건)
python $T/scripts/run_eval.py --model internvl3 --eval-dir data/eval/tradepilot_eval_v1 \
       --out-dir $T/results/smoke/internvl3 --modes scan pdf_text --limit 1

# 전체: 두 모델 × eval_v1(100건 × 3방식) → 채점 → 비교표 (4090에서 약 1시간 40분)
nohup bash $T/scripts/run_all.sh > $T/logs/run_all.log 2>&1 &
# eval_v2(300건)까지: SETS="v1 v2" nohup bash $T/scripts/run_all.sh > $T/logs/run_all.log 2>&1 &

# 평가셋 v2 만들기 (data/company_docs_v2_en 필요, 1분 이내, seed 고정 → 같은 300건)
python $T/scripts/build_eval_set.py

# 평가셋 v3 만들기 (발행사 전체 × 10건, seed 고정 → eval_sets/의 목록과 같은 830건)
python $T/scripts/build_eval_set.py --out data/eval/tradepilot_eval_v3 \
       --splits train validation test --per-company 10
# eval_v3 실행: 두 모델 × v2 프롬프트 (4090에서 약 6시간 30분)
PROMPT=v2 nohup bash $T/scripts/run_v3.sh > $T/logs/run_v3.log 2>&1 &
```

| `run_eval.py` 옵션 | 설명 |
| --- | --- |
| `--model` | `qwen25vl` 또는 `internvl3` |
| `--modes` | `scan`, `pdf`, `pdf_text` 중 선택 (기본: 셋 다) |
| `--max-pixels` | 입력 이미지 최대 픽셀 수 (기본 1,600,000, knlee 기준선과 동일) |
| `--internvl-max-patches` | InternVL 타일 수 상한 (기본 6 → 이미지 토큰 1,792) |
| `--limit N` / `--dry-run N` | 문서 종류별 최대 N건 / 모델 없이 입력 토큰 수만 확인 |

- 결과: `results/<model>/eval_v1/<mode>/<type>/<doc_id>.json` (원문 출력 `raw`, 파싱 결과 `pred`, 시간, 입출력 토큰)
- `results/`, `logs/`는 `.gitignore`로 제외됩니다.

## 평가셋 v2 (`data/eval/tradepilot_eval_v2`, 준비만 완료)

| 세트 | 송장 | 발주서 | 구성 |
| --- | --- | --- | --- |
| clean (PDF 150 dpi) | 100 | 100 | validation+test, 발행사별 균등 (송장 레이아웃 5종, 발주서 3종) |
| scan (scan/photo) | 50 | 50 | clean과 겹치지 않는 문서, scan·photo 반반 |

- 영문·1페이지 문서만. 정답은 원본 `gold.json`과 **문서에 실제로 인쇄된 값만 남긴 `gold_printed.json`** 두 가지를 제공합니다.
- 파인튜닝할 경우 v2 문서(`manifest.jsonl`)는 학습·검증 데이터에서 제외해야 합니다.
