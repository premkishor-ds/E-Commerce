# 30 — Multi-Intent Queries

## Goal
`MULTI_INTENT` → Detect and sequence multiple intents in one message

## Description
Users often ask for multiple things in a single message. The bot must detect all intents, handle them in logical order, and respond to each.

## Multi-Intent Detection Rules
1. Split on conjunctions: "and", "also", "plus", "as well as"
2. Identify primary vs secondary intent
3. Process primary first, queue secondary
4. Inform user of all actions being taken

## Priority Order (when multi-intent)
1. Safety/Security first (account issues)
2. Order management (time-sensitive)
3. Cart/Purchase
4. Search/Browse
5. Informational

---

## 200+ Multi-Intent Utterances

### SEARCH + COMPARE
search for phones and compare top 2
find laptops and compare the best ones
show earbuds and compare prices
search samsung and compare with apple
find shoes and compare nike vs adidas
show me phones and tell me the best one

### SEARCH + ADD TO CART
find headphones and add to cart
search sony speakers and buy the first one
show me shoes under 2000 and add to cart
find a laptop and place an order
search for gaming mouse and purchase it
show phone under 20000 and checkout

### COMPARE + RECOMMEND
compare these two and recommend the best
compare and suggest which to buy
show comparison and help me decide
evaluate both and tell me which to get
compare specs and recommend
show differences and advise me

### CART + CHECKOUT
add to cart and checkout
add item and place order
put in cart and buy now
add to cart and apply coupon
add to cart and use coupon SAVE20
add item and checkout immediately
cart it and pay

### TRACK + MODIFY
track my order and change the address
check order status and update delivery address
where's my order and can i change address
track and modify delivery slot
find my order and reschedule

### CANCEL + REFUND
cancel order and get refund
cancel and request refund
cancel my order and refund payment
i want to cancel and get my money back
cancel order and initiate refund
stop the order and refund me

### RETURN + EXCHANGE
return or exchange this
return or swap for different size
i want to return or exchange
return if defective or exchange for working one
return broken item and get replacement
send back and exchange for different color

### ORDER + TICKET
track order and raise a complaint
check order status and create support ticket
where is my order and i want to complain
order not arrived and i need to report
track order and escalate

### SEARCH + WISHLIST
search phones and save to wishlist
find headphones and add to wishlist
show laptops and heart the best one
search earbuds and wishlist them

### PROFILE + ORDER
view my profile and my orders
show account info and order history
my account and my purchases
profile and transactions

### CART + WISHLIST
move wishlist to cart and checkout
add from wishlist to cart and buy
transfer saved items and checkout
wishlist to cart and pay

### MULTI-SEARCH
search phones and laptops
show me phones and earphones
find shoes and bags
i need a phone and headphones
looking for laptop and mouse
need phone, earbuds and case
search gaming laptop and gaming chair

### PAYMENT + ORDER
check payment status and order status
payment and order both
billing and shipping
verify payment and track order
payment confirmed and order status

### SUPPORT + ESCALATE
create ticket and talk to agent
raise issue and escalate
file complaint and connect to human
ticket and live agent please
report problem and human support

### ADDRESS + CHECKOUT
add address and checkout
new address and place order
update address and complete order
change address and finalize

### COUPON + CHECKOUT
apply coupon and checkout
use discount code and buy
promo code and checkout
coupon SAVE20 and place order

### ANALYTICS + SETTLEMENT (Vendor)
show my sales and settlements
analytics and payout
my revenue and pending settlement
sales report and commission details

### VOICE MULTI-INTENT
track my order and cancel it if delayed
show phones and add cheapest to cart
compare both and buy the better one
search and recommend and add to cart
buy and track and let me know when shipped
add to cart buy and send invoice after
find shoes size 10 and add to wishlist
show all my orders and return the last one
view profile and update my name
