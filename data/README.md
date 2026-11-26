# data

데이터는 용량이 커서 Git에 올리지 않습니다. 이 폴더에는 안내 문서만 있습니다.

| 데이터 | 출처 | 용량 |
| --- | --- | --- |
| 원본 문서 | [AyoubChLin/Company-document-dataset-v2](https://huggingface.co/datasets/AyoubChLin/Company-document-dataset-v2) (Apache-2.0), 버전 `0e9f5198e7e09f858834e544f96ec12436fdbb5e` | 약 16 GB (영문 5종) |
| 영문 정리본 | 원본에서 영문 문서만 추린 것 | 약 9 GB |
| 평가셋 | 송장 50 + 발주서 50 (test split, 1페이지, 스캔·PDF·정답 JSON) | 약 36 MB |

- 데이터 준비 스크립트는 추후 `tools/`로 추가 예정입니다.
- 개발용 평가셋과 최종 고정 평가셋은 분리합니다. 고정 평가셋은 프롬프트 튜닝에 쓰지 않습니다.
