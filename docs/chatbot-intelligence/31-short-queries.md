# 31 — Short Queries

## Goal
`SHORT_QUERY` → Resolve via context + entity extraction + fallback

## Description
Very short queries (1-3 words) that require context from conversation history to resolve. The bot must use memory to fill in missing information before asking for clarification.

## Resolution Strategy
1. Check if word is a known entity (brand/product/category) → SEARCH_PRODUCT
2. Check conversation context for active flow → continue flow
3. Check if word matches a known keyword → map to intent
4. If ambiguous → ask ONE clarifying question
5. Never reject short queries outright

---

## 300+ Short Queries

### 1-Word Product Queries
phone
laptop
shoes
shirt
watch
bag
headphones
earbuds
speaker
tablet
camera
tv
keyboard
mouse
blender
treadmill
bicycle
perfume
moisturizer
lipstick
sunscreen
book
toy
furniture
sofa
chair
table
lamp
fan
cooler

### 1-Word Brand Queries
samsung
apple
sony
nike
adidas
puma
dell
hp
lenovo
asus
oneplus
realme
oppo
xiaomi
redmi
motorola
jbl
bose
lg
tcl

### 1-Word Action Queries
track
order
cart
wishlist
checkout
cancel
return
exchange
refund
pay
wallet
points
loyalty
compare
recommend
help
support
complaint
login
register
profile
address
notifications
settings
history

### 1-Word Status Queries
status
tracking
shipping
delivery
payment
balance
points
savings

### 2-Word Queries
my orders
my cart
my wishlist
my wallet
my points
my profile
my address
track order
cancel order
return order
exchange order
view cart
add cart
remove cart
compare phones
compare laptops
phone under
laptop under
best phone
best laptop
cheap phone
cheap shoes
samsung phone
apple laptop
gaming phone
gaming laptop
wireless earbuds
bluetooth speaker
good shoes
track parcel
my payment
payment methods
saved cards
add card
coupon code
apply coupon
create ticket
view tickets
talk agent
live chat
change password
update profile
my notifications
price alert
notify me
new address
delete address
order history
payment history
wallet balance
loyalty points

### 3-Word Queries (Common)
need a phone
want a laptop
show me shoes
best gaming phone
best camera phone
phone under 20000
laptop under 50000
track my order
cancel my order
return my order
add to cart
view my cart
clear my cart
my order history
my wishlist items
wallet balance check
my loyalty points
compare two phones
help me choose
support ticket please
talk to human
change my name
update my address
where's my order
where is package
payment not working
payment has failed
refund my order
when will arrive
is it available
is it instock
show my orders
add new address
remove saved card
add new card

### Number-Only Queries (after list shown)
1
2
3
4
5
first
second
third
fourth
fifth
one
two
three
four
five
#1
#2
#3

### Yes/No Queries (in multi-step flows)
yes
no
yes please
no thanks
confirm
cancel
ok
okay
sure
nope
yep
correct
incorrect
right
wrong
that's right
not right
proceed
abort
go ahead
stop

### Emoji Queries
👍
👎
✅
❌
🛒
❤️
💜
🔔
🔍
📦
💰
🎁

### Ultra-Short Natural Responses
ok
k
fine
done
great
got it
understood
noted
i see
ah
oh
hmm
right
yep
nah
maybe
later
now
asap
thanks
thx
ty
np
