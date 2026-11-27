
## pdf / invoice  —  260건, 전체 필드 정확도 95.4% (9079/9518), 완전일치 문서 59/260, JSON 실패 1, 평균 9.4s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 95.8% (1076/1123) |
| 당사자 | 93.6% (1642/1754) |
| 품목 | 96.4% (5132/5323) |
| 금액 | 99.3% (876/882) |
| 조건·문구 | 81.0% (353/436) |

자주 틀린 필드 (상위 8):
- items.description: 148회  예) 정답='Flotemysost' 예측='Flotemysoest'
- notes: 81회  예) 정답='Clean your bike after each ride, lubricate the chain, and check tire pressure regularly.' 예측=None
- bill_to.city: 47회  예) 정답='Helsinki' 예측='Porthaninkatu'
- issue_date: 33회  예) 정답='2021-01-18' 예측='2021-01-17'
- items.discount_rate: 23회  예) 정답='0.00' 예측='0.08'
- issuer.country: 18회  예) 정답='USA' 예측='CO, USA'
- bill_to.name: 14회  예) 정답='Terhi Hämäläinen' 예측='Terhi Hämaläinen'
- ship_to.city: 10회  예) 정답='Matraville' 예측='Lord'

## pdf / purchase_order  —  170건, 전체 필드 정확도 94.3% (4668/4948), 완전일치 문서 38/170, JSON 실패 0, 평균 8.2s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 88.2% (750/850) |
| 당사자 | 93.1% (1316/1413) |
| 품목 | 98.4% (1576/1602) |
| 금액 | 97.9% (600/613) |
| 조건·문구 | 90.6% (426/470) |

자주 틀린 필드 (상위 8):
- number: 72회  예) 정답='PO-2022-233945' 예측='P0-2022-233945'
- vendor.city: 35회  예) 정답='Ste-Hyacinthe' 예측='Jucheville'
- instructions: 31회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- vendor.country: 25회  예) 정답='United States' 예측=None
- items.description: 25회  예) 정답='NuNuCa Nuß-Nougat-Creme' 예측='NuNuCa Nu6-Nougat-Creme'
- delivery_date: 22회  예) 정답='2018-04-18' 예측=None
- vendor.name: 20회  예) 정답="Forêts d'érables" 예측="Froêts d'êrables"
- carrier: 13회  예) 정답='Xrq - Truck Ground' 예측='Xqr - Truck Ground'

## pdf_text / invoice  —  260건, 전체 필드 정확도 98.4% (9361/9518), 완전일치 문서 151/260, JSON 실패 0, 평균 9.6s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.0% (1112/1123) |
| 당사자 | 97.6% (1712/1754) |
| 품목 | 99.0% (5270/5323) |
| 금액 | 100.0% (882/882) |
| 조건·문구 | 88.3% (385/436) |

자주 틀린 필드 (상위 8):
- notes: 51회  예) 정답='Thank you for your order; we value your trust in our products.' 예측=None
- items.description: 49회  예) 정답='NuNuCa Nuß-Nougat-Creme' 예측='NuNuCa Nuß-Nougat- Creme'
- issuer.country: 22회  예) 정답='USA' 예측='CO'
- bill_to.city: 12회  예) 정답='Vienne' 예측='Innere Stadt'
- issue_date: 8회  예) 정답='2024-08-02' 예측='2024-02-08'
- bill_to.country: 6회  예) 정답='USA' 예측='MA'
- currency: 2회  예) 정답='USD' 예측='EUR'
- items.unit_price: 2회  예) 정답='3.94' 예측='7.89'

## pdf_text / purchase_order  —  170건, 전체 필드 정확도 98.0% (4848/4948), 완전일치 문서 115/170, JSON 실패 0, 평균 8.4s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.7% (839/850) |
| 당사자 | 95.0% (1342/1413) |
| 품목 | 100.0% (1602/1602) |
| 금액 | 99.8% (612/613) |
| 조건·문구 | 96.4% (453/470) |

자주 틀린 필드 (상위 8):
- vendor.country: 24회  예) 정답='United States' 예측=None
- issuer.country: 16회  예) 정답='USA' 예측='OR, USA'
- deliver_to.country: 12회  예) 정답='USA' 예측='OR, USA'
- instructions: 12회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- vendor.city: 11회  예) 정답='Dallas' 예측=None
- delivery_date: 10회  예) 정답='2024-12-31' 예측=None
- vendor.name: 8회  예) 정답='Compete, Inc.' 예측=None
- carrier: 5회  예) 정답='Overnight J-Fast' 예측='Overnight J- Fast'

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| pdf | invoice | **95.4%** | 95.8% | 93.6% | 96.4% | 99.3% | 81.0% | 59/260 | 9.4s |
| pdf | purchase_order | **94.3%** | 88.2% | 93.1% | 98.4% | 97.9% | 90.6% | 38/170 | 8.2s |
| pdf_text | invoice | **98.4%** | 99.0% | 97.6% | 99.0% | 100.0% | 88.3% | 151/260 | 9.6s |
| pdf_text | purchase_order | **98.0%** | 98.7% | 95.0% | 100.0% | 99.8% | 96.4% | 115/170 | 8.4s |
