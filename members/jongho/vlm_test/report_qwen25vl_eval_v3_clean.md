
## pdf / invoice  —  260건, 전체 필드 정확도 95.0% (9040/9518), 완전일치 문서 78/260, JSON 실패 0, 평균 10.2s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.5% (1106/1123) |
| 당사자 | 89.1% (1563/1754) |
| 품목 | 95.5% (5084/5323) |
| 금액 | 100.0% (882/882) |
| 조건·문구 | 92.9% (405/436) |

자주 틀린 필드 (상위 8):
- items.description: 235회  예) 정답='Road-550-W Yellow, 38' 예측='Road-550-W Yellow, 38 Same technology as all of our Road series bikes, but the frame is sized for a woman. Perfect all-around bike for road or racing.'
- issuer.country: 126회  예) 정답='USA' 예측='CO'
- bill_to.country: 51회  예) 정답='United States' 예측='CA'
- notes: 31회  예) 정답='Thank you for your order; we value your trust in our products.' 예측=None
- issue_date: 13회  예) 정답='2024-08-02' 예측='2024-02-08'
- due_date: 4회  예) 정답='2022-02-06' 예측='2022-06-02'
- bill_to.name: 4회  예) 정답='Virginia Srini' 예측='Virginia Srinivasa'
- bill_to.city: 4회  예) 정답='Berkshire' 예측='RG11 5TP Berkshire'

## pdf / purchase_order  —  170건, 전체 필드 정확도 94.2% (4660/4948), 완전일치 문서 68/170, JSON 실패 0, 평균 9.0s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 93.9% (798/850) |
| 당사자 | 84.9% (1199/1413) |
| 품목 | 98.9% (1585/1602) |
| 금액 | 100.0% (613/613) |
| 조건·문구 | 98.9% (465/470) |

자주 틀린 필드 (상위 8):
- issuer.country: 89회  예) 정답='USA' 예측='CO'
- deliver_to.country: 67회  예) 정답='USA' 예측='CO'
- vendor.country: 55회  예) 정답='United States' 예측=None
- delivery_date: 35회  예) 정답='2015-07-06' 예측=None
- items.description: 17회  예) 정답='Long-Sleeve Logo Jersey, M' 예측='Long-Sleeve Logo Jersey, M Unisex long-sleeve AWC logo microfiber cycling jersey'
- number: 11회  예) 정답='PO2160911' 예측='P02160911'
- issue_date: 6회  예) 정답='2019-04-01' 예측='2019-01-04'
- instructions: 5회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None

## pdf_text / invoice  —  260건, 전체 필드 정확도 95.7% (9111/9518), 완전일치 문서 85/260, JSON 실패 0, 평균 10.3s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.6% (1107/1123) |
| 당사자 | 91.1% (1598/1754) |
| 품목 | 95.7% (5095/5323) |
| 금액 | 100.0% (882/882) |
| 조건·문구 | 98.4% (429/436) |

자주 틀린 필드 (상위 8):
- items.description: 220회  예) 정답='Short-Sleeve Classic Jersey, XL' 예측='Short-Sleeve Classic Jersey, XL\nShort sleeve classic breathable jersey with superior moisture control, front zipper, and 3 back pockets.'
- issuer.country: 113회  예) 정답='USA' 예측='MA'
- bill_to.country: 37회  예) 정답='United States' 예측='TN'
- issue_date: 13회  예) 정답='2024-12-30' 예측='12/30/2024'
- items.discount_rate: 8회  예) 정답='0.00' 예측='0.082'
- notes: 5회  예) 정답='Thank you for your business.' 예측=None
- due_date: 3회  예) 정답='2025-03-07' 예측='2025-07-03'
- bill_to.city: 3회  예) 정답='Berkshire' 예측='RG11 5TP Berkshire'

## pdf_text / purchase_order  —  170건, 전체 필드 정확도 94.6% (4680/4948), 완전일치 문서 72/170, JSON 실패 0, 평균 9.0s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 93.1% (791/850) |
| 당사자 | 86.6% (1224/1413) |
| 품목 | 98.8% (1583/1602) |
| 금액 | 100.0% (613/613) |
| 조건·문구 | 99.8% (469/470) |

자주 틀린 필드 (상위 8):
- issuer.country: 80회  예) 정답='USA' 예측='CO'
- deliver_to.country: 63회  예) 정답='USA' 예측='CO'
- delivery_date: 48회  예) 정답='2015-07-06' 예측=None
- vendor.country: 44회  예) 정답='United States' 예측='TX'
- items.description: 16회  예) 정답='Long-Sleeve Logo Jersey, M' 예측='Long-Sleeve Logo Jersey, M Unisex long-sleeve AWC logo microfiber cycling jersey'
- number: 6회  예) 정답='PO2160911' 예측='P02160911'
- issue_date: 5회  예) 정답='2024-12-22' 예측='12/22/2024'
- items.discount_rate: 3회  예) 정답='0.00' 예측='0.082'

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| pdf | invoice | **95.0%** | 98.5% | 89.1% | 95.5% | 100.0% | 92.9% | 78/260 | 10.2s |
| pdf | purchase_order | **94.2%** | 93.9% | 84.9% | 98.9% | 100.0% | 98.9% | 68/170 | 9.0s |
| pdf_text | invoice | **95.7%** | 98.6% | 91.1% | 95.7% | 100.0% | 98.4% | 85/260 | 10.3s |
| pdf_text | purchase_order | **94.6%** | 93.1% | 86.6% | 98.8% | 100.0% | 99.8% | 72/170 | 9.0s |
