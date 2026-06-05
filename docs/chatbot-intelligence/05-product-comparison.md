# 05 — Product Comparison

## Goal
`PRODUCT_COMPARISON` → maps to intent: `COMPARE`

## Description
User wants to compare two or more products side by side — price, specs, ratings, features, stock.

## Action Mapping
`COMPARE` → `CatalogService.getProducts()` × N + comparison table

## Expected Entities
| Entity | Examples |
|--------|---------|
| `compareProductA` | iPhone 15, Samsung S24 |
| `compareProductB` | Pixel 8, OnePlus 12 |
| `attribute` | price, camera, battery, screen, specs |

## Clarification Rules
- Only one product mentioned → "Which other product should I compare it with?"
- No products at all → "Which two products would you like to compare?"

## Follow-up Examples
```
Compare iPhone vs Samsung
  ↓ (comparison table)
Which has better camera?
  ↓ (contextual answer)
Add the cheaper one to cart
```

---

## 200+ Real-World Utterances

### Direct Compare Commands
compare
compare products
compare items
compare these
compare both
compare all
compare these two
compare the two
compare both products

### Vs / Versus Format
iphone vs samsung
apple vs samsung
phone vs laptop
headphones vs earbuds
samsung s24 vs iphone 15
macbook vs dell
oneplus vs realme
sony vs bose
jbl vs boat
nike vs adidas
airpods vs galaxy buds
pixel vs iphone
redmi vs realme
oppo vs vivo
asus vs lenovo
acer vs hp

### Which is Better
which is better
which one is better
which is best
which one should i buy
which to choose
which do you recommend
what should i pick
help me choose between
help me decide between
which is worth buying
what's the difference between
difference between
differences between
what's different
how are they different
how do they compare
contrast
side by side
head to head
face off

### Attribute-Specific Comparisons
which has better camera
which has better battery
which has more ram
which is faster
which is cheaper
which is more affordable
which has better display
which has better screen
which sounds better
which looks better
which is more durable
which lasts longer
which is lighter
which is slimmer
which has more features
which is more popular
which is higher rated
which is better value
which has better reviews
which has more storage
which has better performance
which is newer
which is latest model

### Casual / Informal
a vs b
one vs two
first vs second
this vs that
this one vs that one
option a or option b
a or b
first one or second one
left one or right one
top one or bottom one
should i go with x or y
torn between two
can't decide between
deciding between two
comparing two options
evaluating options
weighing options
pros and cons of each
what are the pros and cons
advantages of each
disadvantages of each
strengths of each
weaknesses of each

### Multiple Product Comparison
compare three phones
compare these three
compare top 3 phones
compare all options
compare the shortlist
all of these
compare everything you showed me
compare the results

### Voice Style
okay compare these two for me
yo which one is better
hey give me a comparison
run a comparison for me
do a quick compare
side by side comparison please
gimme a comparison table
what's the comparison
show me compared
line them up
which wins
which is the winner
who wins
battle of products
battle of phones
best of these two
