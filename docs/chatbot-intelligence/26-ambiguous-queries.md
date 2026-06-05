# 26 — Ambiguous Queries

## Goal
`AMBIGUOUS` → Resolve to specific intent via clarification

## Description
Queries that could match multiple intents. The bot must identify which intent is most likely based on context and ask targeted clarification if needed.

## Disambiguation Strategy
1. Check conversation history for recent context
2. Detect primary action word (track vs cancel vs return)
3. Ask ONE clarifying question
4. Map to most confident intent

## Common Ambiguities
| Query | Could Be |
|-------|---------|
| "my order" | VIEW_ORDERS, TRACK_ORDER, CANCEL_ORDER |
| "return" | RETURN_ORDER, EXCHANGE_ORDER |
| "phone" | SEARCH_PRODUCT, GET_PRODUCT |
| "account" | VIEW_PROFILE, LOGIN, REGISTER |
| "wallet" | VIEW_WALLET, ADD_WALLET, PAY_WITH_WALLET |
| "cancel" | CANCEL_ORDER, REMOVE_CART, CANCEL_TICKET |

---

## 200+ Ambiguous Utterances

### Order Ambiguity
my order
order
recent order
latest order
about my order
the order
my purchase
the purchase
something about my order
order problem
order question
order issue
i have a question about my order
regarding my order
concerning my order
my order from yesterday
my order from last week
the order i placed
what about my order
update on order
order info

### Product Ambiguity
the product
the item
the thing i want
that item
this item
the product i was looking at
looking at something
the one i was checking
something i liked
something i saw
that product from before
similar product
product question
product issue

### Return/Exchange Ambiguity
send it back
i want to send this back
take it back
take this back
don't want it
don't want this anymore
not keeping it
giving it back
returning
exchanging
changing it
swap it
swap this
not satisfied

### Account Ambiguity
account
my account
account issues
account settings
account help
something with my account
account question
account concern
profile
my profile
profile help

### Payment Ambiguity
payment
payment issue
payment problem
about payment
my payment
the payment
payment question
payment concern
billing
billing issue
billing problem
charged
i was charged
charge
my bill
the bill

### Cart/Checkout Ambiguity
shopping
my shopping
the cart
shopping cart
continue shopping
continue
ready
want to proceed
want to continue
let's continue
what next
next step
what should i do next
proceed

### Support Ambiguity
problem
issue
trouble
concern
complaint
matter
question
inquiry
help needed
assistance needed
need help
something wrong
not right
doesn't seem right
something is off
feeling off about this
unsure about this
confused about this
not clear

### Notification Ambiguity
notify me
alert me
let me know
inform me
update me
send me info
keep me posted
keep me updated
stay updated
get updates
follow up
follow this

### Pronoun-Only Ambiguity
it
this
that
it all
all of this
those
these
them
the one
that one
this one
these ones
those ones
the same
same thing
same one
another one
more of this
less of that
