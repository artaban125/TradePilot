
## pdf / invoice  —  50건, 전체 필드 정확도 96.1% (2245/2337), 완전일치 문서 7/50, JSON 실패 0, 평균 10.9s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.8% (247/250) |
| 당사자 | 96.4% (405/420) |
| 품목 | 96.7% (1300/1344) |
| 금액 | 96.0% (192/200) |
| 조건·문구 | 82.1% (101/123) |

자주 틀린 필드 (상위 8):
- items.description: 40회  예) 정답='Mozzarella di Giovanni' 예측='Mozzarella di Giovannni'
- notes: 22회  예) 정답='Invoices overdue after 30 days incur a 2% monthly late fee.' 예측='Thank you for trusting Cobalt Wholesale Ltd for your supply needs.'
- totals.tax_total: 8회  예) 정답='156.88' 예측='167.84'
- bill_to.city: 7회  예) 정답='México D.F.' 예측='México'
- ship_to.name: 3회  예) 정답='Ottilies Käseladen' 예측='Ottilies Käsela den'
- bill_to.name: 3회  예) 정답='France restauration' 예측='France restaurant'
- ship_to.city: 2회  예) 정답='Bräcke' 예측='Sweden'
- due_date: 2회  예) 정답='2018-08-06' 예측='2018-06-06'

## pdf / purchase_order  —  50건, 전체 필드 정확도 90.1% (1408/1562), 완전일치 문서 0/50, JSON 실패 0, 평균 8.1s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 100.0% (250/250) |
| 당사자 | 80.0% (343/429) |
| 품목 | 97.7% (551/564) |
| 금액 | 97.0% (164/169) |
| 조건·문구 | 66.7% (100/150) |

자주 틀린 필드 (상위 8):
- instructions: 50회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- vendor.city: 30회  예) 정답='Sydney' 예측=None
- vendor.name: 28회  예) 정답="G'day, Mate" 예측=None
- vendor.country: 28회  예) 정답='Australia' 예측=None
- items.description: 13회  예) 정답='Lakkalikööri' 예측='Lakkaliköör'
- totals.freight: 4회  예) 정답='0.00' 예측='141.85'
- totals.tax_total: 1회  예) 정답='188.71' 예측='148.04'

## pdf_text / invoice  —  50건, 전체 필드 정확도 98.8% (2310/2337), 완전일치 문서 24/50, JSON 실패 0, 평균 11.0s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.6% (249/250) |
| 당사자 | 98.8% (415/420) |
| 품목 | 99.8% (1341/1344) |
| 금액 | 97.0% (194/200) |
| 조건·문구 | 90.2% (111/123) |

자주 틀린 필드 (상위 8):
- notes: 12회  예) 정답='All products meet UK food safety standards; request documentation with each delivery.' 예측=None
- totals.tax_total: 6회  예) 정답='156.88' 예측='167.88'
- bill_to.city: 4회  예) 정답='México D.F.' 예측='México'
- items.description: 2회  예) 정답='Queso Cabrales' 예측='Queso Cabrare'
- due_date: 1회  예) 정답='2018-08-06' 예측='2018-06-08'
- ship_to.name: 1회  예) 정답='Galería del gastronómo' 예측='Galería del gastronómico'
- items.discount_rate: 1회  예) 정답='0.05' 예측='0.00'

## pdf_text / purchase_order  —  50건, 전체 필드 정확도 93.1% (1455/1562), 완전일치 문서 7/50, JSON 실패 0, 평균 8.2s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 100.0% (250/250) |
| 당사자 | 83.9% (360/429) |
| 품목 | 100.0% (564/564) |
| 금액 | 99.4% (168/169) |
| 조건·문구 | 75.3% (113/150) |

자주 틀린 필드 (상위 8):
- instructions: 37회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측=None
- vendor.name: 23회  예) 정답="G'day, Mate" 예측=None
- vendor.city: 23회  예) 정답='Sydney' 예측=None
- vendor.country: 23회  예) 정답='Australia' 예측=None
- totals.tax_total: 1회  예) 정답='188.71' 예측='190.71'

## scan / invoice  —  50건, 전체 필드 정확도 95.8% (2238/2337), 완전일치 문서 6/50, JSON 실패 0, 평균 11.0s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 99.6% (249/250) |
| 당사자 | 94.8% (398/420) |
| 품목 | 97.0% (1304/1344) |
| 금액 | 93.0% (186/200) |
| 조건·문구 | 82.1% (101/123) |

자주 틀린 필드 (상위 8):
- items.description: 32회  예) 정답='Röd Kaviar' 예측='Rød Kaviar'
- notes: 20회  예) 정답='Invoices overdue after 30 days incur a 2% monthly late fee.' 예측=None
- totals.tax_total: 10회  예) 정답='156.88' 예측='143.84'
- bill_to.city: 7회  예) 정답='México D.F.' 예측='México'
- ship_to.city: 6회  예) 정답='México D.F.' 예측='Mexico D.F.'
- ship_to.name: 5회  예) 정답='Ottilies Käseladen' 예측='Ottiles Käsleden'
- items.line_total: 4회  예) 정답='219.87' 예측='229.87'
- bill_to.name: 3회  예) 정답='Ottilies Käseladen' 예측='Ottilies Käsladen'

## scan / purchase_order  —  50건, 전체 필드 정확도 91.9% (1435/1562), 완전일치 문서 0/50, JSON 실패 0, 평균 8.2s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.0% (245/250) |
| 당사자 | 86.7% (372/429) |
| 품목 | 97.5% (550/564) |
| 금액 | 98.8% (167/169) |
| 조건·문구 | 67.3% (101/150) |

자주 틀린 필드 (상위 8):
- instructions: 49회  예) 정답='Please confirm this order and quote our PO number on all invoices and delivery notes.' 예측='null'
- vendor.name: 17회  예) 정답="G'day, Mate" 예측=None
- vendor.city: 16회  예) 정답='Sydney' 예측=None
- vendor.country: 15회  예) 정답='Australia' 예측=None
- items.description: 13회  예) 정답='Rogede sild' 예측='Rogedé sidt'
- delivery_date: 4회  예) 정답='2019-05-13' 예측=None
- deliver_to.name: 3회  예) 정답='Cobalt Wholesale Ltd' 예측=None
- deliver_to.city: 3회  예) 정답='Bristol' 예측=None

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| pdf | invoice | **96.1%** | 98.8% | 96.4% | 96.7% | 96.0% | 82.1% | 7/50 | 10.9s |
| pdf | purchase_order | **90.1%** | 100.0% | 80.0% | 97.7% | 97.0% | 66.7% | 0/50 | 8.1s |
| pdf_text | invoice | **98.8%** | 99.6% | 98.8% | 99.8% | 97.0% | 90.2% | 24/50 | 11.0s |
| pdf_text | purchase_order | **93.1%** | 100.0% | 83.9% | 100.0% | 99.4% | 75.3% | 7/50 | 8.2s |
| scan | invoice | **95.8%** | 99.6% | 94.8% | 97.0% | 93.0% | 82.1% | 6/50 | 11.0s |
| scan | purchase_order | **91.9%** | 98.0% | 86.7% | 97.5% | 98.8% | 67.3% | 0/50 | 8.2s |
