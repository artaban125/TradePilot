# 데이터셋 준비 도구 (prepare_dataset.py)

Hugging Face의 [Company Documents v2](https://huggingface.co/datasets/AyoubChLin/Company-document-dataset-v2)
(합성 비즈니스 문서, Apache-2.0)를 내려받아 **원하는 문서 종류·언어만 골라 정리**하는 스크립트입니다.
어떤 PC나 서버에서든 같은 명령으로 **같은 데이터**를 다시 만들 수 있습니다(데이터셋 버전 고정).

## 1. 설치

```bash
# Python 3.9 이상
pip install -r requirements.txt          # pyarrow, huggingface_hub
```

conda를 쓰는 경우
```bash
conda create -y -p ./.venv-data python=3.12
./.venv-data/bin/pip install -r requirements.txt
```

## 2. 실행

```bash
# 기본값: 영문 5종(송장·발주서·견적서·선적지시서·포장명세서) + 스캔 이미지
python prepare_dataset.py
```

| 단계 | 내용 | 팀 GPU 서버 기준 소요 |
|---|---|---|
| 다운로드 | 5종 원본 약 16 GB → `data/raw/company_docs_v2` | 약 3분 |
| 정리 | 영문만 골라 → `data/company_docs_v2_en` (약 9 GB) | 약 7분 |
| 검증 | 원본과 결과 건수 재대조 | 약 30초 |

### 자주 쓰는 옵션

| 옵션 | 설명 | 기본값 |
|---|---|---|
| `--types` | 문서 종류. `all` 은 13종 전체 | 5종 |
| `--locales` | 남길 언어 `en`, `fr` | `en` |
| `--splits` | `train`, `validation`, `test` 중 선택 | 전체 |
| `--no-scans` | 스캔 이미지 제외 (용량 약 1/3) | 포함 |
| `--raw` / `--out` | 원본 / 결과 폴더 | `data/raw/company_docs_v2` / `data/company_docs_v2_en` |
| `--revision` | 데이터셋 버전(커밋 해시). `main` 은 최신 | `0e9f519…` (2026-10-07) |
| `--skip-download` | 원본이 이미 있으면 다운로드 생략 | |
| `--force` | 기존 결과를 지우고 처음부터 정리 | |
| `--delete-raw` | 정리·검증 성공 후 원본 삭제 (용량 절약) | |

### 예시

```bash
# 빠른 동작 확인 (1분 이내): 발주서 test split만
python prepare_dataset.py --types purchase_order --splits test

# 송장만, 영어+프랑스어, 스캔 제외
python prepare_dataset.py --types invoice --locales en fr --no-scans --out data/invoice_en_fr

# 노트북처럼 디스크가 작을 때: 정리 후 원본 삭제
python prepare_dataset.py --delete-raw

# 이미 받은 원본으로 다른 조건의 데이터 다시 만들기
python prepare_dataset.py --skip-download --locales fr --out data/company_docs_v2_fr
```

## 3. 결과 폴더

```
<out>/
├─ data/<종류>/<split>.parquet     PDF 원본 + 전체 컬럼 (한 행 = 문서 1건)
├─ scans/<종류>/<split>.parquet    스캔·사진 이미지 (doc_id 로 문서와 연결)
├─ labels/<종류>/<split>.jsonl     {"doc_id": ..., "gold": {정답 JSON}} 한 줄에 1건
├─ summary.json                    건수 + 출처 + 버전 + 실행 옵션 (재현용 기록)
└─ dataset_summary.md              사람이 읽는 요약 표
```

주요 컬럼: `extracted_data`(정답 JSON), `file_content`(PDF 텍스트), `rendered`(인쇄된 값), `boxes`(필드 좌표), `pdf`(PDF 바이트)

## 4. 참고

- **이어하기**: 다운로드나 정리 중에 끊겨도 같은 명령을 다시 실행하면 끝난 부분은 건너뛰고 이어서 진행합니다.
- **디스크**: 원본(16 GB)과 결과(9 GB)를 합쳐 약 25 GB가 필요합니다. 서버의 루트 디스크처럼 작은 곳에는 받지 말고 `--raw`, `--out`을 큰 디스크로 지정하세요. Hugging Face 캐시 위치는 환경변수 `HF_HOME`으로 바꿀 수 있습니다.
- **검증 실패 시**: 원본을 지우지 않고 종료 코드 1로 끝납니다. `--force`로 다시 정리해 보세요.
- **기준 건수 (영문 5종, 기본값)**: 문서 137,785건, 스캔 47,954장
