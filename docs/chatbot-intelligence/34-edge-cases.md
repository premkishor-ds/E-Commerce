# 34 — Edge Cases

## Goal
`EDGE_CASE_HANDLING` → Handle unusual but real-world scenarios

## Description
Edge cases that break normal intent flow. Each case needs specific handling to prevent errors or dead ends.

---

## Edge Case Categories

### 1. EMPTY CART CHECKOUT
Trigger: User tries to checkout with empty cart
Detection: `CHECKOUT` intent + `cart.items.length === 0`
Response: "Your cart is empty. Add items before checking out!"
Recovery: Suggest browse/search

### 2. DUPLICATE ADD TO CART
Trigger: User adds same item twice
Detection: Product already in cart
Response: "This item is already in your cart. Increase quantity instead?"
Recovery: Offer UPDATE_CART_QUANTITY

### 3. OUT OF STOCK ADD
Trigger: User tries to add out-of-stock item
Detection: `inventory.stock === 0`
Response: "This item is currently out of stock. Set a restock alert?"
Recovery: Offer PRICE_ALERT (restock type)

### 4. CANCEL ALREADY-SHIPPED ORDER
Trigger: Cancel request on non-Pending order
Detection: `order.status !== 'Pending'`
Response: "This order is [status] and can't be cancelled. Return it instead?"
Recovery: Suggest RETURN_ORDER

### 5. RETURN OUTSIDE WINDOW
Trigger: Return request on old delivered order (>30 days)
Detection: Check order date
Response: "This order is outside our 30-day return window."
Recovery: Offer CREATE_TICKET with special request

### 6. INSUFFICIENT WALLET BALANCE
Trigger: Wallet payment with insufficient balance
Detection: `walletBalance < orderTotal`
Response: "Insufficient wallet balance. Add funds or choose another method?"
Recovery: Offer alternate payment or ADD_WALLET_FUNDS

### 7. INVALID ORDER ID
Trigger: Order ID not found
Detection: `getOrderById()` returns null
Response: "Order ID not found. Please double-check or view your orders."
Recovery: Offer VIEW_ORDERS

### 8. EXPIRED COUPON
Trigger: User applies expired coupon
Detection: Coupon validation failure
Response: "Coupon [CODE] has expired. Try SAVE20 instead!"
Recovery: Suggest valid coupon

### 9. ALREADY LOGGED IN
Trigger: Logged-in user tries to login/register
Detection: `userId` exists + LOGIN intent
Response: "You're already logged in! Want to view your profile or logout?"
Recovery: Offer VIEW_PROFILE or LOGOUT

### 10. GUEST TRIES PROTECTED ACTION
Trigger: Guest user accesses customer-only feature
Detection: No userId + protected intent
Response: "Please log in or create an account to [action]."
Recovery: Offer LOGIN or REGISTER + GUEST_CHECKOUT if relevant

### 11. SESSION EXPIRED
Trigger: User continues after token expiry
Detection: Auth failure during action
Response: "Your session has expired. Please log in again."
Recovery: Trigger LOGIN flow

### 12. NO SEARCH RESULTS
Trigger: Search returns empty
Detection: `results.length === 0`
Response: "No results for '[query]'. Try different keywords or browse categories."
Recovery: Offer category suggestions

### 13. VERY LONG MESSAGE
Trigger: User sends extremely long message
Detection: `message.length > 500`
Strategy: Extract entities, focus on primary intent, ignore noise

### 14. ALL CAPS MESSAGE
Trigger: User types in all caps (often angry)
Detection: `message === message.toUpperCase()`
Strategy: Normalize to lowercase, detect emotional context

### 15. REPEATED SAME MESSAGE
Trigger: User sends same message multiple times
Detection: Recent history has identical messages
Response: "I see you've sent this a few times. Let me connect you with a human agent."
Recovery: Offer LIVE_AGENT

---

## 200+ Edge Case Triggering Utterances

### Empty Cart Edge Cases
checkout with nothing
i have nothing in cart
cart is empty checkout
place order without items
buy without adding anything
skip cart go to checkout
checkout directly

### Already In Cart
add same thing again
add it again
add another of the same
duplicate add
add same product
i already added this add again

### Out of Stock
add out of stock item
buy unavailable item
get item that's not available
order item showing unavailable
add to cart out of stock product
buy something that's sold out
out of stock add

### Non-Cancellable Orders
cancel shipped order
cancel delivered order
cancel order that was delivered
cancel completed order
cancel paid order
cancel order that left warehouse
cancel order in transit
cancel delivered order refund

### Large Orders / Bulk
order 100 units
order in bulk
bulk purchase
wholesale order
corporate order
order for resale
order for office
100 pieces
order 50 units
buy in quantity

### Multiple Addresses Edge Cases
i have no saved addresses checkout
checkout without address saved
first time address at checkout
no address add new at checkout
change address at last minute

### Payment Edge Cases
wallet balance zero
wallet empty checkout
not enough wallet
insufficient balance
card declined
payment failed
upi failed
transaction failed
bank rejected
payment bounced
payment pending
payment stuck
payment processing too long

### Invalid Inputs in Flows
abc as price
text as phone number
wrong email format
missing @ in email
no domain in email
very short password
password too weak
invalid order id format
letters in order id that expects numbers

### Duplicate Account
register with existing email
sign up again same email
create account again
already have account register

### Session Edge Cases
my session timed out
i was logged out
automatically logged out
session expired login
kicked out
logged me out
why am i logged out

### Connectivity/Technical
bot not responding
bot is slow
response is late
no reply
bot stopped working
bot crashed
bot keeps restarting
bot restarted
chat reset
conversation reset

### Multiple Rapid Messages
(user sends 5 messages in 2 seconds)
phone
samsung
under 20000
black
256gb

### Conflicting Instructions
add to cart and remove from cart
cancel order and track order
return and reorder
buy and return
add and clear cart
checkout and cancel
login and logout

### Permission Edge Cases
admin trying customer action
vendor trying admin action
customer trying vendor action
guest trying all actions
trying without login
accessing restricted feature
unauthorized access
