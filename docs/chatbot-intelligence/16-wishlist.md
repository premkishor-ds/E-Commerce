# 16 — Wishlist

## Goal
`WISHLIST` → maps to intents: `WISHLIST_ADD`, `WISHLIST_VIEW`, `WISHLIST_REMOVE`, `MOVE_TO_CART`, `CLEAR_WISHLIST`

## Description
User wants to save products for later, view saved items, remove items, move items to cart, or clear their wishlist.

## Action Mapping
| Intent | Action |
|--------|--------|
| `WISHLIST_ADD` | `ProfileService` wishlist update + `UPDATE_WISHLIST` frontend action |
| `WISHLIST_VIEW` | `SalesService.getWishlistWithProducts()` |
| `WISHLIST_REMOVE` | `SalesService.removeFromWishlist()` |
| `MOVE_TO_CART` | `SalesService.moveToCart()` |
| `CLEAR_WISHLIST` | `SalesService.clearWishlist()` |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `productType` | headphones, phone, shoes |
| `productName` | iPhone 15, Sony WH-1000XM5 |

---

## 200+ Real-World Utterances

### ADD TO WISHLIST
add to wishlist
save to wishlist
wishlist item
add wishlist
favourite
favorite
heart it
heart this
like this
save for later
save item
save product
bookmark product
bookmark item
wishlist this
wishlisted
add to favorites
add to favourites
i like this
i love this
this is nice, save it
save this one
save the product
keep this
i want to remember this
save for later buying
add to my list
save to my list
add to saved items
save to saved items

### VIEW WISHLIST
my wishlist
view wishlist
show wishlist
wishlist
my saved items
saved items
favourites
favorites
liked items
hearted items
bookmarked items
my list
saved list
what i saved
products i liked
items i loved
go to wishlist
open wishlist
wishlist page
wishlist section
my saved products

### REMOVE FROM WISHLIST
remove from wishlist
delete from wishlist
unsave
unfavourite
unfavorite
unheart
remove favourite
remove from saved
delete from saved
remove from my list
delete from list
don't want this anymore in wishlist
remove product from wishlist
delete wishlist item
take off wishlist
remove wishlist item

### MOVE TO CART
move to cart
add from wishlist to cart
move wishlist item to cart
wishlist to cart
buy from wishlist
transfer to cart
move to shopping cart
put in cart from wishlist
cart it from wishlist
move saved item to cart
buy saved item

### CLEAR WISHLIST
clear wishlist
empty wishlist
remove all saved
delete all wishlist items
clear all favourites
clear all favorites
wipe wishlist
reset wishlist
start fresh wishlist
clear my list
empty my list

### Voice/Informal
yo save this
hey like this
bro wishlist this
sis add to favorites
heart it
just save it for now
maybe later, save it
not now but save
save for future
remind me about this
keep for later
not buying yet, save
add to wish list
add it to my wish list
