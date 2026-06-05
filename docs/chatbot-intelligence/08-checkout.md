# 08 — Checkout

## Goal
`CHECKOUT` → maps to intent: `CHECKOUT`

## Description
User wants to proceed to payment, confirm their order, complete a purchase, or finalize checkout.

## Action Mapping
`CHECKOUT` → Multi-step flow: Address → Payment → Confirm → `SalesService.placeOrder()`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `paymentType` | Stripe, Razorpay, Wallet, COD |
| `guestMode` | checkout as guest, guest checkout |

## Clarification Rules
- Not logged in → Offer Login / Register / Guest Checkout
- Cart empty → "Your cart is empty, add items first"
- Address missing → Start address collection flow

## Multi-Step Flow
```
checkout
  ↓ (if logged in, show addresses)
Select address or add new
  ↓
Select payment method: Stripe / Razorpay / Wallet / COD
  ↓
Order summary confirmation
  ↓ (type "confirm")
Order placed ✅
```

---

## 200+ Real-World Utterances

### Direct Checkout
checkout
check out
proceed to checkout
go to checkout
start checkout
begin checkout
initiate checkout
place order
place my order
complete purchase
complete my purchase
complete order
finalize order
finalize purchase
confirm order
confirm purchase
buy now
pay now
pay for this
pay for order
proceed to pay
proceed to payment
make payment
make the payment
complete payment
process payment
process order
order now
order today
i want to order
ready to order
ready to buy
ready to pay
ready to checkout
let's checkout
let's order
let's buy
let's pay
let me checkout
let me pay
let me order
i'm ready to buy
i'm ready to checkout
i'm ready to pay

### Informal / Casual
checkout please
pay please
order please
buy please
place the order
do the checkout
finalize it
confirm it
done browsing, buy
done shopping, checkout
i've decided, checkout
all set, checkout
okay buy it
ok let's go
let's do this
go ahead and order
go ahead and buy
proceed
continue to payment
continue to buy
continue with order
move to checkout
move forward with purchase

### Guest Checkout
checkout as guest
guest checkout
buy as guest
order as guest
purchase as guest
no account checkout
checkout without account
checkout without login
buy without logging in
shop without account
guest order
anonymous checkout
no login needed
i don't have an account, can i still buy
checkout without registration

### Payment Method Specific
pay with stripe
pay with card
pay by card
credit card payment
debit card payment
card payment
pay with razorpay
pay with upi
upi payment
pay with wallet
use wallet
wallet payment
store credit payment
use my points
cash on delivery
cod
pay on delivery
pay when delivered
pay at door
net banking payment
pay with net banking
emi payment
pay in emi

### Coupon at Checkout
apply coupon at checkout
use discount at checkout
i have a coupon code
apply my code
use promo at checkout

### Address at Checkout
use my home address
use my saved address
use default address
use a new address
different address for delivery
change delivery address
deliver to my office
deliver to home
deliver to a different address
new shipping address
use different address

### Order Review
review my order
check order summary
order summary
see what i'm buying
confirm items
see the total
what's the total
how much will it cost
total with shipping
total with tax
final price
checkout price

### Voice/Typo/Informal
chekout
chekcout
procede to checkout
place oder
plce order
buy nw
pay nwo
ordr now
go ahead pay
lets checkout
lets pay
gotta pay
need to pay
want to complete this
finish it up
wrap it up
get it done
seal the deal
lock it in
