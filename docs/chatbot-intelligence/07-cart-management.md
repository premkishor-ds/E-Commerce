# 07 — Cart Management

## Goal
`CART_MANAGEMENT` → maps to intents: `ADD_CART`, `REMOVE_CART`, `VIEW_CART`, `UPDATE_CART_QUANTITY`, `SAVE_CART_FOR_LATER`, `RESTORE_SAVED_CART`, `CLEAR_CART` (via REMOVE_CART)

## Description
User wants to add, remove, view, update quantity, save, restore, or clear their shopping cart.

## Action Mapping
| Intent | Action |
|--------|--------|
| `ADD_CART` | `SalesService.addToCart()` + `ADD_TO_CART` frontend action |
| `REMOVE_CART` | `SalesService.removeFromCart()` + `REMOVE_FROM_CART` frontend action |
| `VIEW_CART` | `SalesService.getCartWithProducts()` |
| `UPDATE_CART_QUANTITY` | `SalesService.updateCartQuantity()` |
| `SAVE_CART_FOR_LATER` | `SalesService.saveCartForLater()` |
| `RESTORE_SAVED_CART` | `SalesService.restoreSavedCart()` |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `productType` / `productName` | headphones, Samsung phone, the blue shirt |
| `quantity` | 2, three, change to 5 |
| `action` | add, remove, update, clear, save, restore |

## Clarification Rules
- "Add to cart" with no product → "Which product would you like to add?"
- "Remove" with no product and cart has items → Show cart items, ask which to remove
- "Update quantity" with no number → "How many would you like?"

## Follow-up Context
```
Add headphones to cart
  ↓
Add 2 more
  ↓ (understands context: same product)
Remove it
  ↓ (understands: remove that product)
Clear cart
  ↓ (confirm clear)
```

---

## 250+ Real-World Utterances

### ADD TO CART
add to cart
add it to cart
add this to cart
add item to cart
add product to cart
put it in cart
put this in cart
put in cart
throw it in cart
throw this in cart
drop it in cart
drop in cart
place in cart
save to cart
save for cart
add to my cart
add to my basket
add to basket
cart it
buy it
buy this
buy now
i'll take it
i'll take this
i'll take that
i'll buy this
i'll buy it
i want this
i want it
get it
get this
get that
take it
take this
pick it up
pick this up
order this
order it
purchase it
purchase this
add headphones to cart
add phone to cart
add laptop to cart
add shoes to cart
add shirt to cart
add samsung to cart
add apple watch to cart
add the first one to cart
add the second one to cart
add that one to cart
add the red one
add the black one
add the 256gb one
add the xl size
add the large one

### REMOVE FROM CART
remove from cart
remove it from cart
remove this from cart
remove item from cart
delete from cart
delete it from cart
delete this from cart
take out from cart
take it out of cart
take out of cart
remove product from cart
delete product from cart
remove headphones from cart
remove phone from cart
remove the shirt from cart
remove the first item
remove item 1
remove the last item
i don't want this anymore
i changed my mind
cancel this item
cancel that item
don't want it
no longer want it
not interested anymore
drop this item
drop it
remove it

### CLEAR / EMPTY CART
clear cart
empty cart
clear my cart
empty my cart
remove all items
delete all items
remove everything from cart
clear all items
wipe cart
reset cart
start fresh
start over with cart
i want a fresh cart
new cart please
clear everything
remove all
delete all
clear out cart
clean out cart

### VIEW CART
view cart
my cart
show cart
show my cart
cart summary
what's in cart
what's in my cart
cart contents
items in cart
cart items
list cart items
show cart items
cart total
my cart total
what do i have in cart
check cart
check my cart
see cart
look at cart
open cart
what's in the basket
my basket
show basket

### UPDATE QUANTITY
update quantity
change quantity
increase quantity
decrease quantity
reduce quantity
modify quantity
set quantity
change qty
update qty
change the amount
update amount
more of this
less of this
add more
add one more
add 2 more
add 3 more
reduce by one
reduce by 2
set to 2
set to 3
change to 2
change to 5
quantity to 3
make it 2
make it 3
make it 5
i want 2 of this
i want 3 of these
i need 2 pieces
2 units please
3 items please
change to 2 quantity
update to 5
set quantity to 4
change quantity to 3
increase by 1
increase by 2
decrease by 1
decrease by 2
add one more piece
one more please
make it one
make it two
make it three
just one
only one
two of these
three of those

### SAVE FOR LATER
save cart for later
save my cart for later
save cart
save my cart
stash my cart
hold my cart
keep my cart
preserve my cart
bookmark cart
save for now
save and come back
i'll come back later
save this for later
store cart
store my cart
save to drafts
keep on hold

### RESTORE SAVED CART
restore cart
restore my cart
restore saved cart
get back my cart
retrieve cart
retrieve my cart
bring back my cart
bring my cart back
recover cart
get my saved cart
get saved cart
load saved cart
load my cart
resume cart
resume shopping
continue from where i left
continue shopping
i saved my cart
get what i saved
where is my saved cart

### APPLY COUPON (Cart context)
apply coupon
use coupon
add coupon
coupon code
promo code
apply promo
use promo
apply code
enter coupon
enter code
discount code
apply discount code
save20
use SAVE20
apply voucher
voucher code

### VOICE / INFORMAL STYLE
yo add this to cart
hey throw that in my cart
bro put it in cart
add that thing to my cart
can u add this
can you put this in my cart
plz add to cart
add pls
cart it please
go ahead add it
yes add it
yes buy it
yes put it in cart
yep cart it
yeah add it
add it yeah
go for it
do it
add the thing
add that stuff
