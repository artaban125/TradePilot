# knowledge

번역과 RAG 해설에 함께 쓰는 무역 지식 베이스입니다. 담당: **한병준** (검토: 이규남)

| 파일 (예정) | 내용 | 규모 |
| --- | --- | --- |
| `glossary.yaml` | 무역 용어사전: 표기 변형, 한국어 이름, 쉬운 설명 | 100~150개 |
| `doc_types.yaml` | 문서 종류 안내: 받으면 누가 무엇을 하는지 | 3~5개 |
| `rules.yaml` | 조건별 대응 규칙: 조건 → 설명·할 일·확인 등급·담당 부서 | 40~60개 |
| `examples.yaml` | 해설 모범 예시 | 10~20개 |

```yaml
- id: term_net_terms
  keys: ["Net 15", "Net 30", "net 30 days"]
  ko: 외상 지급 기한
  display: "{N}일 이내 지급 (Net {N})"
  explain: 송장을 받은 날부터 정해진 날수 안에 돈을 보내라는 뜻입니다.
  doc_types: [invoice, purchase_order]
  source: 무역 실무 일반
```
