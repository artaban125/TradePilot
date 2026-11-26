# schemas

VLM 추출 결과의 JSON 스키마입니다. 세 파트(Vision · LLM · Frontend)를 잇는 계약이라 **전원이 함께 확정**합니다 (W-02, 12.03 동결).

| 파일 (예정) | 내용 |
| --- | --- |
| `common.schema.json` | 송장·발주서 공통: 문서번호, 날짜, 통화, 발행사, 품목, 금액 합계 |
| `invoice.schema.json` | 송장 전용: 청구처, 배송지, 결제 기한, 결제조건, 결제 안내 |
| `purchase_order.schema.json` | 발주서 전용: 공급사, 납품처, 납기일, 요청 문구, 운송사 |

무역 필드(Incoterms, HS 코드, 결제 방식 등)는 `trade` 블록으로 둡니다. VLM에는 문서 종류에 맞는 스키마만 제공합니다.
