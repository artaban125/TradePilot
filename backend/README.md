# backend

FastAPI 서버와 AI 파이프라인입니다. 담당: **이규남** (VLM 추출 모듈은 **김종호**)

| 파일 (예정) | 역할 | WBS |
| --- | --- | --- |
| `app.py` | FastAPI 진입점, 업로드 → 결과 JSON 반환 | W-09 |
| `src/ingest.py` | 입력 처리: PDF → 이미지, 전자 PDF 텍스트 추출 | W-05 |
| `src/extraction.py` | VLM(Qwen2.5-VL) 필드 추출 → JSON | W-04, W-05 |
| `src/validation.py` | 날짜·금액 정규화, 품목·세금·총액 검산, 누락 탐지 | W-06 |
| `src/retrieval.py` | 키워드 기반 RAG: 무역 용어집 매칭, 규칙 조회, 미등록 표현 수집 | W-07 |
| `src/generation.py` | 미등록 표현 직역, 쉬운 해설·부서별 체크리스트 생성 | W-08 |
| `src/evaluation.py` | 필드 F1, 오류 탐지율 등 평가 | W-12 |
| `prompts/` | VLM·LLM 프롬프트 (파일명에 버전 표기, 예: `vlm_extract_v1.txt`) | W-05, W-08 |
