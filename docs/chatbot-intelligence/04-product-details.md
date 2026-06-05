# 04 — Product Details

## Goal
`PRODUCT_DETAILS` → maps to intent: `GET_PRODUCT`

## Description
User wants detailed information about a specific product — description, specs, features, variants, warranty, return policy, delivery, seller info, or availability.

## Action Mapping
`GET_PRODUCT` → `CatalogService.getProductById()` or `getProducts({ search })`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `productType` / `productName` | iPhone 15, Samsung TV, Sony headphones |
| `brand` | Apple, Samsung, Sony |
| `infoType` | specs, warranty, variants, return policy, delivery |

## Clarification Rules
- No product name → "Which product would you like details on?"
- After search results shown → "Type the product name to see details"

## Follow-up Examples
```
Show me phones
  ↓ (list shown)
Tell me about the first one
  ↓
What's the warranty?
  ↓
What colors are available?
  ↓
Add to cart
```

---

## 200+ Real-World Utterances

### Direct Detail Requests
product details
show details
tell me more
more details
more info
detailed view
full details
complete info
all details
show product info
product information
product specs
specifications
show specs
features
list features
product features
what are the features
tell me the features
describe this product
describe it
what is this product
explain this product
explain this
about this product
about this item
about this
info on this
info about this
info on the product
all about it

### Specific Product Detail Queries
tell me about iphone
tell me about samsung
tell me about the laptop
tell me about these headphones
show me details of the phone
show details of samsung tv
product info for sony headphones
what's the spec of this
what are the specs
full spec list
spec sheet
technical specs
tech specs
technical specifications
detailed specifications

### Warranty & Service
warranty
warranty info
warranty period
how long is the warranty
what's the warranty
warranty details
is there a warranty
does it have warranty
1 year warranty
2 year warranty
service warranty
manufacturer warranty
brand warranty
service center
repair options
what if it breaks
what happens if it breaks
replacement warranty
extended warranty
protection plan

### Return Policy
return policy
what's the return policy
how many days for return
return days
can i return this
is it returnable
refund policy
money back policy
exchange policy
30 day return
7 day return
15 day return
no return policy
return window

### Delivery Information
delivery time
delivery estimate
when will it arrive
estimated delivery
shipping time
how long to deliver
how many days delivery
fast delivery
same day delivery
next day delivery
express delivery
delivery options
shipping options
free delivery
free shipping
delivery charges
shipping charges
delivery cost
how much to ship

### Variants & Options
variants
available variants
color options
colors available
what colors
size options
sizes available
available sizes
storage options
available storage
ram options
available configurations
available models
model options
configuration options
different options
other options

### Availability & Stock
is it available
is it in stock
stock availability
check availability
product availability
available now
in stock now
currently available
how many in stock
stock count
can i buy it now
available for purchase
ready to buy
available for delivery
when will it be available
out of stock item details

### Comparison Context
which is better
what's better
better option
best option
which one should i buy
which is recommended
which to choose
which do you recommend
pros and cons
advantages disadvantages
good and bad
strengths and weaknesses

### Rating & Reviews Summary
rating
product rating
average rating
how many stars
star rating
user rating
customer rating
reviews summary
overall rating
review count
how many reviews
what do people say
what do customers say
popular opinion
most liked
most appreciated

### Seller Information
seller info
seller details
who sells this
sold by
vendor info
brand info
authorized seller
official product
original product
authentic product
genuine product

### Price Details
price details
price breakdown
actual price
mrp
market price
discount price
offer price
current price
price today
how much does it cost
how much is it
cost of this product
price of this item
what does it cost
total price
final price
inclusive price
price with tax
tax included
gst inclusive

### Voice/Casual Style
what's this thing about
give me the rundown on this
break down this product for me
what's the deal with this item
run me through this product
talk to me about this
fill me in on this product
what's the full story on this
details on that
details on this one
more on this
more about this
show me more
expand on this
dig deeper
i want to know more
learn more
know more about it
how good is it
is it good
is it worth it
worth buying
should i get it
is this good quality
what makes it special
what's unique about it
what sets it apart
any good
