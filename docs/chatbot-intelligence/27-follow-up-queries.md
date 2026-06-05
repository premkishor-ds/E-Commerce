# 27 — Follow-up Queries

## Goal
`FOLLOW_UP` → Resolve within active conversation context

## Description
Users rarely provide all information in one message. The bot must handle follow-up messages that refine, filter, confirm, deny, or extend the previous conversation.

## Follow-up Resolution Rules
1. If previous intent = SEARCH_PRODUCT and user sends a filter → apply filter
2. If previous reply showed a list and user sends a number → select item[n-1]
3. If previous intent = any and user sends "yes/confirm" → confirm action
4. If user sends "no/cancel" → cancel current flow
5. If user adds "and also" → detect multi-intent follow-up
6. If user references "it/this/that" → resolve from last mentioned entity

---

## 200+ Follow-up Utterances

### Refinement Follow-ups (after search)
under 20000
below 500
black color
in black
white color
samsung brand
apple only
with 8gb ram
256gb storage
5 star rated
above 4 stars
best rated
cheapest one
most expensive
latest model
newest
most popular
in stock only
with fast delivery

### Selection Follow-ups (after list shown)
first one
the first
first
one
1
second one
the second
second
two
2
third one
three
3
last one
the last
the cheapest
the best one
the top one
the most popular
the highest rated
the one with most reviews
the samsung one
the apple one
option a
option b
option 1
option 2
i'll go with number 1
i'll take number 2

### Confirmation Follow-ups
yes
yeah
yep
yup
ok
okay
sure
confirm
confirmed
correct
that's right
right
go ahead
proceed
do it
please do
yes please
please yes
i confirm
i agree
absolutely
definitely
of course
for sure

### Denial Follow-ups
no
nope
nah
not really
no thanks
cancel
abort
stop
don't
never mind
forget it
i changed my mind
actually no
on second thought no
i don't want this
skip this
skip
not that one
different one
another option
something else
not this
not these

### Clarification Follow-ups
what does that mean
explain please
can you clarify
more details
more info
i don't understand
not clear
confused
what
huh
pardon
come again
could you repeat
i mean
what i meant was
let me rephrase
what i actually want is
i was asking about
i wanted to know about
not what i meant

### Continuation Follow-ups
and also
also
additionally
plus
furthermore
another thing
one more thing
and another thing
besides that
what about
how about
what if
even if
can i also
can i additionally
as well
along with

### Refinement After Product Details
does it come in red
does it come in blue
is there a black version
is there a cheaper model
is there a more expensive version
what's the storage on this
does it have warranty
what's the rating on this
is it available
can i get it by tomorrow
is there a discount
any coupon for this
can i pay by cod
how much shipping
free shipping on this
what's the return policy for this

### Order Context Follow-ups (after order shown)
cancel that one
return that order
track that one
modify that order
download invoice for that
exchange that item
get a refund for that
report issue with that order
what's the status of that
when will that arrive
that one please
that order
use that one

### Wishlist / Cart Context
add that to cart
add to wishlist
add to my list
save that
buy that
buy this now
checkout with that
remove that from cart
remove that from wishlist
compare with wishlist item
move that to cart
move to cart
buy from wishlist

### Time-Based Follow-ups
today
tomorrow
asap
right now
immediately
by friday
by end of week
by monday
this week
next week
within 2 days
in 3 days
before the weekend
urgent
fast
quickly
quick

### Correction Follow-ups
i made a mistake
wrong
i meant
actually
sorry, i meant
not that
the other one
let me correct
correction
i was wrong
ignore that
please ignore previous
redo
redo this
let me start over
start fresh
restart
different product
different order
