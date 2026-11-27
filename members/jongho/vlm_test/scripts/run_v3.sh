#!/bin/bash
# eval_v3 (발행사 전체 × 10건) v2 프롬프트 제로샷 추출 + 채점 (저장소 최상위에서 실행)
#   PYTHON=<python> nohup bash members/jongho/vlm_test/scripts/run_v3.sh > members/jongho/vlm_test/logs/run_v3.log 2>&1 &
# 평가셋 만들기 (한 번만):
#   python members/jongho/vlm_test/scripts/build_eval_set.py --out data/eval/tradepilot_eval_v3 \
#          --splits train validation test --per-company 10
# 중단돼도 다시 실행하면 끝난 문서는 건너뛰고 이어서 진행한다.
set -u
T=members/jongho/vlm_test
P=${PYTHON:-python}
V3=data/eval/tradepilot_eval_v3
PR=${PROMPT:-v2}
export TOKENIZERS_PARALLELISM=false

for m in qwen25vl internvl3; do
  echo "===== $m eval_v3 clean $PR $(date +%F_%T)"
  $P -W ignore $T/scripts/run_eval.py --model $m --prompt $PR --eval-dir $V3/clean \
     --out-dir $T/results/$m/eval_v3_clean_$PR --modes pdf pdf_text
  echo "===== $m eval_v3 scan $PR $(date +%F_%T)"
  $P -W ignore $T/scripts/run_eval.py --model $m --prompt $PR --eval-dir $V3/scan \
     --out-dir $T/results/$m/eval_v3_scan_$PR --modes scan
done

echo "===== scoring $(date +%F_%T)"
for m in qwen25vl internvl3; do
  for s in clean scan; do for g in gold gold_printed; do
    $P $T/scripts/score.py --eval-dir $V3/$s --out-dir $T/results/$m/eval_v3_${s}_$PR --gold-file $g.json \
       --report $T/results/${m}_eval_v3_${s}_${PR}_${g}.md > /dev/null
  done; done
done
echo "ALL_DONE $(date +%F_%T)"
