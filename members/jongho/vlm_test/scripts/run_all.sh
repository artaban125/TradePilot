#!/bin/bash
# Qwen2.5-VL-7B vs InternVL3-8B 제로샷 추출 + 채점 + 비교표 일괄 실행 (저장소 최상위에서 실행)
#   nohup bash members/jongho/vlm_test/scripts/run_all.sh > members/jongho/vlm_test/logs/run_all.log 2>&1 &
#   SETS="v1 v2" 로 실행하면 tradepilot_eval_v2(300건)까지 평가한다. 기본은 v1(100건)만.
# 중단돼도 다시 실행하면 끝난 문서는 건너뛰고 이어서 진행한다.
set -u
T=members/jongho/vlm_test
P=${PYTHON:-python}
SETS=${SETS:-v1}
V1=data/eval/tradepilot_eval_v1
V2=data/eval/tradepilot_eval_v2
export TOKENIZERS_PARALLELISM=false

for m in qwen25vl internvl3; do
  if [[ " $SETS " == *" v1 "* ]]; then
    echo "===== $m eval_v1 $(date +%F_%T)"
    $P -W ignore $T/scripts/run_eval.py --model $m --eval-dir $V1 --out-dir $T/results/$m/eval_v1 --modes scan pdf pdf_text
  fi
  if [[ " $SETS " == *" v2 "* ]]; then
    echo "===== $m eval_v2 clean $(date +%F_%T)"
    $P -W ignore $T/scripts/run_eval.py --model $m --eval-dir $V2/clean --out-dir $T/results/$m/eval_v2_clean --modes pdf
    echo "===== $m eval_v2 scan $(date +%F_%T)"
    $P -W ignore $T/scripts/run_eval.py --model $m --eval-dir $V2/scan --out-dir $T/results/$m/eval_v2_scan --modes scan
  fi
done

echo "===== scoring $(date +%F_%T)"
for m in qwen25vl internvl3; do
  if [[ " $SETS " == *" v1 "* ]]; then
    $P $T/scripts/score.py --eval-dir $V1 --out-dir $T/results/$m/eval_v1 --report $T/results/${m}_eval_v1.md > /dev/null
  fi
  if [[ " $SETS " == *" v2 "* ]]; then
    for s in clean scan; do for g in gold gold_printed; do
      $P $T/scripts/score.py --eval-dir $V2/$s --out-dir $T/results/$m/eval_v2_$s --gold-file $g.json \
         --report $T/results/${m}_eval_v2_${s}_${g}.md > /dev/null
    done; done
  fi
done
$P $T/scripts/compare.py --report $T/results/compare.md > /dev/null
echo "ALL_DONE $(date +%F_%T)"
