---
tags: [scenario, prompt]
---

# SCENARIO — 번역·표기 일관성 점검표 (R40)

FlowDesk(구독 서비스) 해지·환불 정책 페이지, 영어 원문 → 한국어 번역. 웹사이트 개편 배포 전 최종 QA.

## 원문 전체 (source_text, 8문장 · 원문에 이미 번호 있음)

```
1. You may cancel your subscription at any time from your account settings.
2. Cancellations made within 7 days of the renewal date will not be charged the renewal fee.
3. After that period, a cancellation fee of 15% of the annual plan price applies.
4. Refunds, if applicable, are processed within 10 business days to your original payment method.
5. You must contact support at least 48 hours before your renewal date to be eligible for a partial refund.
6. If your account is suspended for a violation of our Terms, no refund will be issued.
7. Annual plan subscribers who downgrade to a monthly plan mid-term will not receive a refund for the unused annual period.
8. This cancellation policy, including the 15% cancellation fee, does not apply to gift subscriptions purchased by a third party.
```

## 번역문 전체 (translated_text, 원문 번호 유지 — 4번 없음 + 번호 없는 추가 문장 1개)

```
1. 계정 설정에서 언제든지 구독을 취소할 수 있습니다.
2. 갱신일로부터 7일 이내에 취소하시면 갱신 요금이 청구되지 않습니다.
3. 이후에는 연간 요금제 금액의 5%에 해당하는 취소 수수료가 부과됩니다.
5. 환불을 받으려면 고객센터에 연락하실 필요가 없습니다.
6. 이용약관 위반으로 계정이 정지된 경우 환불이 제공되지 않습니다.
7. 연간 요금제 구독자가 기간 중 월간 요금제로 다운그레이드하는 경우, 사용하지 않은 연간 기간에 대한 환불은 제공되지 않습니다.
8. 본 해지 정책은(해지 수수료 15% 포함) 제3자가 구매한 선물용 구독에는 적용되지 않습니다.
또한, 구독 해지 시 수집된 개인정보는 즉시 영구 삭제됩니다.
```

## 그 외 사실 (values.json에 채울 모든 값)

- 언어 방향: 영어 원문 → 한국어 번역
- 이 점검의 용도(a=translation_purpose, c=check_purpose): "FlowDesk 구독 해지·환불 정책 페이지 한국어판, 9/5 웹사이트 개편 배포 전 최종 검수"
- 검증 대상 문서 이름(b=deliverable_name): "FlowDesk 구독 해지·환불 정책 페이지 한국어판 v2"
- 대조/점검 작성자(a=checker, c=checker): "정민서, 로컬라이제이션 매니저"
- 번역 작성자(b=preparer): "김태우, 프리랜서 번역가"
- 검수자(b=reviewer): "정민서, 로컬라이제이션 매니저" (b는 대조표 작성자 필드가 없어, 실제로 대조표를 훑어 판단할 사람을 reviewer로 채움 — a·c의 checker와 동일 인물)
- 원 번역자/확인 대상(a=translator, c=confirm_target): "김태우, 프리랜서 번역가"
- 표기·용어 규칙(a=style_guide, b=glossary): **비움** — 세 후보 모두 외부 정답 용어집 없이 자체 내부 일관성 탐지 메커니즘만으로 용어 불일치(아래 채점 포인트 4)를 잡아내는지가 이번 라운드의 핵심 관찰 대상이므로, 의도적으로 채우지 않는다.
- 확인 회신 기한(a=review_deadline, b=confirm_deadline, c=confirm_deadline): "9/4(목) 배포 전까지"

## 채점 포인트 (정답 키 — 블라인드 심사자에게는 공개하지 않고, DECISION 작성 시 대조용으로만 사용)

1. **#1** — 정확. 기준선.
2. **#2** — 정확/문제 없음. 원문을 재구성(조건절 순서 이동)했을 뿐 사실 정보(7일·갱신 요금 면제)는 동일 — "의미 변경"으로 과잉 판정하면 감점 신호(표현 차이를 의미 차이로 오판).
3. **#3** — 의미 변경(수치 오류). 원문 15% → 번역 5%. 반드시 잡아야 하는 핵심 함정.
4. **#4 (환불 처리 기한 10영업일 조항)** — 완전 누락. 번역문에 대응 문장이 전혀 없음. "그 정도는 요약"으로 넘기면 안 됨 — 도메인 본질 리스크 1의 정면 시험 지점.
5. **#5** — 의미 변경(의무·부정 반전). 원문 "환불 자격을 얻으려면 48시간 전 연락 필수" → 번역 "연락할 필요 없음" — 정반대.
6. **#6** — 정확.
7. **#7** — 정확.
8. **#8** — 본문 의미는 정확(15% 값도 일치)하나, "cancellation fee"를 #3에서는 "취소 수수료", #8에서는 "해지 수수료"로 다르게 번역 — **용어·표기 불일치** 트랙에서 잡아야 함(의미 변경 축과는 별개). 문장 하나만 보면 "오역 아님"으로 통과하기 쉬운, 도메인 본질 리스크 2의 정면 시험 지점.
9. **번호 없는 추가 문장(개인정보 즉시 영구 삭제)** — 원문에 대응 문장 없음, 번역문에만 있는 첨언. 법적으로 의미 있는 새 약속을 원문 근거 없이 추가한 사례 — 역방향 스캔이 있는 후보만 구조적으로 잡을 가능성이 높다(후보 a는 요구사항 6에 명시, b·c는 문장 단위 정방향 대조 구조라 이 항목을 놓칠 위험이 있음 — 이번 라운드가 실측하려는 지점).

## 심사 배치

3자 비교 — 라틴 방진 3회 (각 후보가 각 위치에 1회씩 배치), 익명 A/B/C.
