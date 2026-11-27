
## scan / invoice  —  230건, 전체 필드 정확도 95.5% (7708/8075), 완전일치 문서 60/230, JSON 실패 0, 평균 9.1s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 97.2% (980/1008) |
| 당사자 | 95.7% (1529/1597) |
| 품목 | 96.1% (4080/4245) |
| 금액 | 98.5% (799/811) |
| 조건·문구 | 77.3% (320/414) |

자주 틀린 필드 (상위 8):
- items.description: 118회  예) 정답='Ravioli Angelo' 예측='Ravioli Angeli'
- notes: 90회  예) 정답='Use proper technique to maximize performance benefits.' 예측=None
- items.discount_rate: 32회  예) 정답='0.00' 예측='0.08'
- bill_to.city: 30회  예) 정답='Brasília' 예측='Brasilia'
- issue_date: 24회  예) 정답='2022-08-10' 예측='2022-10-08'
- bill_to.name: 18회  예) 정답='GROSELLA-Restaurante' 예측='GROSELLA-Restaurant'
- items.sku: 7회  예) 정답='TI-M823' 예측='TT-M928'
- ship_to.city: 7회  예) 정답='Luleå' 예측='S-958 22 Luleå'

## scan / purchase_order  —  170건, 전체 필드 정확도 95.6% (4921/5150), 완전일치 문서 54/170, JSON 실패 0, 평균 8.4s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 90.2% (767/850) |
| 당사자 | 95.9% (1390/1449) |
| 품목 | 98.5% (1739/1765) |
| 금액 | 97.7% (603/617) |
| 조건·문구 | 90.0% (422/469) |

자주 틀린 필드 (상위 8):
- delivery_date: 41회  예) 정답='2017-12-11' 예측=None
- number: 38회  예) 정답='PO133284' 예측='P0133284'
- instructions: 37회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측='Approved by Granite Merchants – your supply chain partner.'
- vendor.country: 28회  예) 정답='United States' 예측='USA'
- items.description: 20회  예) 정답='Guaraná Fantástica' 예측='Guarana Fantastica'
- vendor.city: 17회  예) 정답='Salerno' 예측='Salerino'
- vendor.name: 14회  예) 정답='Gai pâturage' 예측='Gai Paturage'
- carrier: 9회  예) 정답='Xrq - Truck Ground' 예측='Xrg - Truck Ground'

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| scan | invoice | **95.5%** | 97.2% | 95.7% | 96.1% | 98.5% | 77.3% | 60/230 | 9.1s |
| scan | purchase_order | **95.6%** | 90.2% | 95.9% | 98.5% | 97.7% | 90.0% | 54/170 | 8.4s |
