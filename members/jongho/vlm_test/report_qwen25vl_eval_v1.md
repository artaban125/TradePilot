
## pdf / invoice  —  50건, 전체 필드 정확도 98.7% (2307/2337), 완전일치 문서 26/50, JSON 실패 0, 평균 11.5s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.6% (249/250) |
| 당사자 | 95.0% (399/420) |
| 품목 | 99.6% (1339/1344) |
| 금액 | 98.5% (197/200) |
| 조건·문구 | 100.0% (123/123) |

자주 틀린 필드 (상위 8):
- issuer.country: 7회  예) 정답='United Kingdom' 예측=None
- bill_to.name: 5회  예) 정답='Suprêmes délices' 예측='Suprèmes délices'
- items.description: 4회  예) 정답='Valkoinen suklaa' 예측='Valkoinen suiklaa'
- totals.tax_total: 3회  예) 정답='156.88' 예측='157.88'
- ship_to.city: 3회  예) 정답='México D.F.' 예측='Mexico D.F.'
- ship_to.name: 2회  예) 정답='Folk och fä HB' 예측='Folk och få HB'
- bill_to.city: 2회  예) 정답='I. de Margarita' 예측='Porlamar'
- due_date: 1회  예) 정답='2018-08-06' 예측='2018-06-08'

## pdf / purchase_order  —  50건, 전체 필드 정확도 88.7% (1385/1562), 완전일치 문서 0/50, JSON 실패 0, 평균 9.1s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.2% (248/250) |
| 당사자 | 70.9% (304/429) |
| 품목 | 100.0% (564/564) |
| 금액 | 100.0% (169/169) |
| 조건·문구 | 66.7% (100/150) |

자주 틀린 필드 (상위 8):
- instructions: 50회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- deliver_to.name: 41회  예) 정답='Cobalt Wholesale Ltd' 예측=None
- deliver_to.city: 41회  예) 정답='Bristol' 예측=None
- deliver_to.country: 41회  예) 정답='United Kingdom' 예측=None
- vendor.city: 2회  예) 정답='Sydney' 예측="Hunter's Hill"
- issue_date: 1회  예) 정답='2015-06-04' 예측='2015-04-06'
- delivery_date: 1회  예) 정답='2015-06-04' 예측='2015-04-06'

## pdf_text / invoice  —  50건, 전체 필드 정확도 99.7% (2329/2337), 완전일치 문서 42/50, JSON 실패 0, 평균 11.6s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.6% (249/250) |
| 당사자 | 99.3% (417/420) |
| 품목 | 99.9% (1343/1344) |
| 금액 | 98.5% (197/200) |
| 조건·문구 | 100.0% (123/123) |

자주 틀린 필드 (상위 8):
- totals.tax_total: 3회  예) 정답='156.88' 예측='157.88'
- bill_to.city: 2회  예) 정답='I. de Margarita' 예측='Porlamar'
- ship_to.city: 1회  예) 정답='México D.F.' 예측='Mexico D.F.'
- due_date: 1회  예) 정답='2018-08-06' 예측='2018-06-08'
- items.discount_rate: 1회  예) 정답='0.05' 예측='0.00'

## pdf_text / purchase_order  —  50건, 전체 필드 정확도 93.1% (1455/1562), 완전일치 문서 1/50, JSON 실패 0, 평균 9.1s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 96.8% (242/250) |
| 당사자 | 88.3% (379/429) |
| 품목 | 100.0% (564/564) |
| 금액 | 100.0% (169/169) |
| 조건·문구 | 67.3% (101/150) |

자주 틀린 필드 (상위 8):
- instructions: 49회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측='Thank you for trusting Cobalt Wholesale Ltd for your supply needs.'
- deliver_to.name: 16회  예) 정답='Cobalt Wholesale Ltd' 예측=None
- deliver_to.city: 16회  예) 정답='Bristol' 예측=None
- deliver_to.country: 16회  예) 정답='United Kingdom' 예측=None
- delivery_date: 7회  예) 정답='2016-10-15' 예측=None
- vendor.city: 2회  예) 정답='Sydney' 예측="Hunter's Hill"
- issue_date: 1회  예) 정답='2015-06-04' 예측='2015-04-06'

## scan / invoice  —  50건, 전체 필드 정확도 98.8% (2308/2337), 완전일치 문서 29/50, JSON 실패 0, 평균 11.5s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.2% (248/250) |
| 당사자 | 96.0% (403/420) |
| 품목 | 99.7% (1340/1344) |
| 금액 | 97.5% (195/200) |
| 조건·문구 | 99.2% (122/123) |

자주 틀린 필드 (상위 8):
- bill_to.name: 5회  예) 정답='Suprêmes délices' 예측='Suprèmes délices'
- totals.tax_total: 5회  예) 정답='156.88' 예측='158.48'
- ship_to.city: 4회  예) 정답='México D.F.' 예측='Mexico D.F.'
- bill_to.city: 3회  예) 정답='México D.F.' 예측='Mexico D.F.'
- items.description: 3회  예) 정답='Valkoinen suklaa' 예측='Valkoinen suiklaa'
- ship_to.name: 2회  예) 정답='Folk och fä HB' 예측='Folk och få HB'
- due_date: 2회  예) 정답='2018-08-06' 예측='2018-06-08'
- issuer.country: 1회  예) 정답='United Kingdom' 예측=None

## scan / purchase_order  —  50건, 전체 필드 정확도 91.6% (1431/1562), 완전일치 문서 0/50, JSON 실패 0, 평균 9.1s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.2% (248/250) |
| 당사자 | 82.1% (352/429) |
| 품목 | 100.0% (564/564) |
| 금액 | 98.8% (167/169) |
| 조건·문구 | 66.7% (100/150) |

자주 틀린 필드 (상위 8):
- instructions: 50회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- deliver_to.name: 25회  예) 정답='Cobalt Wholesale Ltd' 예측=None
- deliver_to.city: 25회  예) 정답='Bristol' 예측=None
- deliver_to.country: 25회  예) 정답='United Kingdom' 예측=None
- vendor.city: 1회  예) 정답='Sydney' 예측="Hunter's Hill"
- totals.tax_total: 1회  예) 정답='188.71' 예측='193.08'
- totals.freight: 1회  예) 정답='0.00' 예측='Federal Shipping'
- vendor.country: 1회  예) 정답='Singapore' 예측='South-East Asia'

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| pdf | invoice | **98.7%** | 99.6% | 95.0% | 99.6% | 98.5% | 100.0% | 26/50 | 11.5s |
| pdf | purchase_order | **88.7%** | 99.2% | 70.9% | 100.0% | 100.0% | 66.7% | 0/50 | 9.1s |
| pdf_text | invoice | **99.7%** | 99.6% | 99.3% | 99.9% | 98.5% | 100.0% | 42/50 | 11.6s |
| pdf_text | purchase_order | **93.1%** | 96.8% | 88.3% | 100.0% | 100.0% | 67.3% | 1/50 | 9.1s |
| scan | invoice | **98.8%** | 99.2% | 96.0% | 99.7% | 97.5% | 99.2% | 29/50 | 11.5s |
| scan | purchase_order | **91.6%** | 99.2% | 82.1% | 100.0% | 98.8% | 66.7% | 0/50 | 9.1s |
