# 13 — Payments

## Goal
`PAYMENTS` → maps to intents: `VIEW_PAYMENT_METHODS`, `ADD_PAYMENT_METHOD`, `DELETE_PAYMENT_METHOD`, `RETRY_PAYMENT`, `VIEW_PAYMENT_HISTORY`, `CHECK_PAYMENT_STATUS`, `APPLY_COUPON`, `REMOVE_COUPON`

## Description
User wants to manage payment methods, check payment status, retry a failed payment, view payment history, or apply/remove coupons.

## Action Mapping
| Intent | Action |
|--------|--------|
| `VIEW_PAYMENT_METHODS` | `ProfileService.getPaymentMethods()` |
| `ADD_PAYMENT_METHOD` | Multi-step: type → details → confirm |
| `DELETE_PAYMENT_METHOD` | `ProfileService.deletePaymentMethod()` |
| `RETRY_PAYMENT` | `PaymentService.retryPayment()` |
| `VIEW_PAYMENT_HISTORY` | `PaymentService.getPaymentHistory()` |
| `CHECK_PAYMENT_STATUS` | `PaymentService.getPaymentHistory()` (latest) |
| `APPLY_COUPON` | `SalesService.validateCoupon()` |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `paymentType` | card, UPI, wallet, COD, net banking |
| `couponCode` | SAVE20, FLAT50, WELCOME10 |
| `amount` | add 100 to wallet, load 500 |

---

## 200+ Real-World Utterances

### VIEW PAYMENT METHODS
payment methods
my payment methods
saved cards
saved payments
my cards
my upi
my payment options
payment options
show payment methods
view payment methods
list payment methods
manage payments
payment management
how do i pay
available payment options
my saved payment info
my billing info
payment details
payment info

### ADD PAYMENT METHOD
add card
add new card
add credit card
add debit card
add upi
add new upi
new payment method
add payment method
save card
save new card
add payment
new card
new upi id
new payment option
add net banking
save payment details
add paypal
add new payment
i want to add a card
i want to save my card
save my payment info

### DELETE PAYMENT METHOD
remove card
delete card
remove payment method
delete payment method
remove my card
delete my card
remove saved card
delete saved card
remove upi
delete upi
remove payment
delete payment
remove billing info
delete payment info
unlink card
unlink payment

### RETRY PAYMENT
retry payment
retry failed payment
try again
payment failed try again
payment unsuccessful retry
my payment failed
payment didn't go through
payment error retry
redo payment
redo the payment
pay again
attempt payment again
try payment again
payment bounced retry
payment declined retry
re-attempt payment

### VIEW PAYMENT HISTORY
payment history
my payments
show payments
list payments
transaction history
my transactions
show transactions
payment records
past payments
previous payments
recent payments
all transactions
payment log
billing history
my billing history
show billing history
transaction list
recent transactions

### CHECK PAYMENT STATUS
payment status
check payment status
did my payment go through
is my payment successful
was my payment accepted
payment confirmation
payment confirmed
payment declined
payment success
payment failed status
transaction status
verify payment
payment verification
payment receipt
proof of payment

### COUPON MANAGEMENT
apply coupon
use coupon
apply code
promo code
discount code
coupon code
coupon
voucher
offer code
use promo
apply promo code
i have a coupon
coupon SAVE20
apply SAVE20
use FLAT50
remove coupon
clear coupon
delete coupon
remove promo
remove discount
coupon not working
invalid coupon
coupon expired
coupon doesn't work
best coupon available
any coupons
any discount codes
any offers

### Voice/Typos
paymnt methods
my paymets
savd cards
add crad
dlete card
coupon cod
aply coupon
promocode
discunt code
payment faild
retry paymnt
