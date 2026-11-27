
## scan / invoice  —  230건, 전체 필드 정확도 94.3% (7611/8075), 완전일치 문서 55/230, JSON 실패 0, 평균 10.0s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 98.3% (991/1008) |
| 당사자 | 89.0% (1422/1597) |
| 품목 | 94.8% (4023/4245) |
| 금액 | 100.0% (811/811) |
| 조건·문구 | 87.9% (364/414) |

자주 틀린 필드 (상위 8):
- items.description: 203회  예) 정답='Mountain-100 Black, 48' 예측='Mountain-100 Black, 48 Top-of-the-line competition mountain bike. Performance-enhancing options include the innovative HL Frame, super-smooth front suspension, and traction for all terrain.'
- issuer.country: 108회  예) 정답='USA' 예측='CO'
- notes: 50회  예) 정답='Use proper technique to maximize performance benefits.' 예측=None
- bill_to.country: 48회  예) 정답='Australia' 예측='NSW'
- items.discount_rate: 18회  예) 정답='0.00' 예측='0.082'
- issue_date: 13회  예) 정답='2024-09-05' 예측='2024-05-09'
- bill_to.city: 11회  예) 정답='Brasília' 예측='Brasilia'
- due_date: 4회  예) 정답='2024-10-05' 예측='2024-05-10'

## scan / purchase_order  —  170건, 전체 필드 정확도 94.6% (4874/5150), 완전일치 문서 69/170, JSON 실패 0, 평균 9.3s
| 그룹 | 정확도 |
|---|---|
| 기본정보 | 97.2% (826/850) |
| 당사자 | 84.9% (1230/1449) |
| 품목 | 98.5% (1738/1765) |
| 금액 | 99.5% (614/617) |
| 조건·문구 | 99.4% (466/469) |

자주 틀린 필드 (상위 8):
- issuer.country: 89회  예) 정답='USA' 예측='MA'
- deliver_to.country: 74회  예) 정답='USA' 예측='MA'
- vendor.country: 52회  예) 정답='United States' 예측='CA'
- items.description: 23회  예) 정답='LL Mountain Seat/Saddle' 예측='LL Mountain Seat/Saddle Synthetic leather. Features gel for increased comfort.'
- delivery_date: 11회  예) 정답='2023-10-26' 예측=None
- number: 7회  예) 정답='PO133284' 예측='P0133284'
- issue_date: 6회  예) 정답='2015-01-04' 예측='2015-04-01'
- vendor.city: 4회  예) 정답='West Covina' 예측='#103'

## 요약
| 방식 | 종류 | 전체 정확도 | 기본정보 | 당사자 | 품목 | 금액 | 조건·문구 | 완전일치 | 평균 시간 |
|---|---|---|---|---|---|---|---|---|---|
| scan | invoice | **94.3%** | 98.3% | 89.0% | 94.8% | 100.0% | 87.9% | 55/230 | 10.0s |
| scan | purchase_order | **94.6%** | 97.2% | 84.9% | 98.5% | 99.5% | 99.4% | 69/170 | 9.3s |
