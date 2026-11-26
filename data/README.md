# data

데이터는 용량이 커서 Git에 올리지 않습니다. 필요한 데이터를 아래 방법으로 받아 이 폴더에 둡니다.
`data/` 아래에 받은 파일은 `.gitignore`로 제외되므로 실수로 커밋되지 않습니다.

## 어떤 데이터를 받아야 하나요

| 데이터 | 용량 | 용도 | 받는 방법 |
| --- | --- | --- | --- |
| **평가셋** (송장 50 + 발주서 50) | 약 34 MB | VLM 추출 평가, 프롬프트 개선, 화면 개발용 샘플 | [방법 1](#방법-1-평가셋-구글-드라이브) |
| **정제 데이터셋** (영문 5종 전체) | 약 9 GB (작업 중 원본 16 GB 추가 필요) | 합성 문서 생성, 추가 평가셋 구성, 대량 실험 | [방법 2](#방법-2-정제-데이터셋-hugging-face에서-재생성) |

대부분의 작업은 **평가셋만으로 충분합니다.** 정제 데이터셋은 데이터 담당 작업에 필요할 때 받으세요.

---

## 방법 1. 평가셋 (구글 드라이브)

```bash
python tools/download_data.py      # 추가 패키지 필요 없음 (약 34 MB)
```

- `data/eval/tradepilot_eval_v1/`에 풀립니다.
- 받은 파일은 SHA-256으로 자동 검증합니다.
- 이미 받아 둔 평가셋이 있으면 건너뜁니다. 다시 받으려면 `--force`를 붙입니다.
- 자동 다운로드가 안 되면 [구글 드라이브](https://drive.google.com/file/d/17U4-fg56SS-VxMyj3UlgWIHuBW7FSad3/view)에서 직접 받은 뒤 아래처럼 실행합니다.
  ```bash
  python tools/download_data.py --zip 받은파일경로/tradepilot_eval_v1.zip
  ```

```
data/eval/tradepilot_eval_v1/
├─ README.md                      출처·라이선스·구성 방법
├─ manifest.json                  문서 목록 (type, doc_id, number, scan_profile)
├─ invoice/<doc_id>/
│  ├─ scan.jpg                    스캔·사진 형태 이미지
│  ├─ pdf.png                     PDF를 150 dpi로 변환한 이미지
│  ├─ pdf_text.txt                PDF에서 추출한 텍스트 (텍스트 힌트용)
│  └─ gold.json                   정답 JSON
└─ purchase_order/<doc_id>/       같은 구성
```

## 방법 2. 정제 데이터셋 (Hugging Face에서 재생성)

9 GB는 구글 드라이브로 주고받기 어려워서, **원본에서 같은 결과를 다시 만드는 스크립트**를 씁니다.
데이터셋 버전을 고정해 두었기 때문에 누가 실행해도 같은 데이터가 만들어집니다.

```bash
pip install -r tools/dataset_prep/requirements.txt
python tools/dataset_prep/prepare_dataset.py --raw data/raw/company_docs_v2 --out data/company_docs_v2_en
```

- 소요 시간: 다운로드 약 3분 + 정리 약 7분 + 검증 약 30초 (서버 네트워크 기준)
- 필요한 디스크: 약 25 GB (원본 16 GB + 결과 9 GB). 정리가 끝난 뒤 `--delete-raw`를 붙이면 원본을 지웁니다.
- 결과 건수: 문서 137,785건, 스캔 이미지 47,954장 (실행 후 자동으로 원본과 대조해 검증)
- 옵션과 결과 폴더 구조는 [`tools/dataset_prep/README.md`](../tools/dataset_prep/README.md)를 참고하세요.

> **팀 GPU 서버를 쓰는 경우**: 정제 데이터셋이 서버의 프로젝트 데이터 폴더에 이미 있습니다. 다시 받지 말고 그 경로를 그대로 쓰세요 (경로는 팀 내부 공유 문서 참고).

### 클라우드 GPU(A100 등)에서 쓰는 경우

클라우드는 네트워크가 빨라서 Hugging Face에서 바로 받는 편이 가장 빠릅니다. 사용 요금이 시간 단위로 나가므로 아래 순서를 권합니다.

```bash
git clone https://github.com/artaban125/TradePilot.git && cd TradePilot

# 1) 평가셋 (1분 이내) — 대부분의 실험은 이것만으로 충분
python tools/download_data.py

# 2) 정제 데이터셋이 꼭 필요할 때만 (약 10분, 디스크 25 GB)
pip install -r tools/dataset_prep/requirements.txt
python tools/dataset_prep/prepare_dataset.py --delete-raw   # 정리 후 원본 삭제로 디스크 절약

# 필요한 문서 종류만 받으면 더 빠름 (예: 송장·발주서만)
python tools/dataset_prep/prepare_dataset.py --types invoice purchase_order --delete-raw
```

- **모델 가중치도 함께 받아야 합니다.** VLM(Qwen2.5-VL-7B) 약 16 GB, LLM 후보 각 약 15 GB입니다. `HF_HOME`을 넉넉한 디스크로 지정하세요.
- 인스턴스를 지우면 데이터도 사라집니다. 클라우드의 영구 디스크(볼륨)에 `data/`와 `HF_HOME`을 두면 다음에 다시 받지 않아도 됩니다.

---

## 출처와 라이선스
- 원본: [AyoubChLin/Company-document-dataset-v2](https://huggingface.co/datasets/AyoubChLin/Company-document-dataset-v2) (합성 비즈니스 문서)
- 버전: `0e9f5198e7e09f858834e544f96ec12436fdbb5e`
- 라이선스: Apache-2.0
- 모든 문서는 합성 데이터이며 실제 기업·개인 정보가 아닙니다.

## 규칙
- 개발용 평가셋과 최종 고정 평가셋은 분리합니다. 고정 평가셋은 프롬프트 튜닝에 쓰지 않습니다.
- 평가셋을 바꾸면 버전을 올려(`tradepilot_eval_v2`) 새 zip을 만들고, `tools/download_data.py`의 ID와 SHA-256을 함께 고칩니다.
