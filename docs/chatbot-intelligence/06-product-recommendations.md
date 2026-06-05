# 06 — Product Recommendations

## Goal
`PRODUCT_RECOMMENDATIONS` → maps to intent: `RECOMMEND`

## Description
User wants personalized suggestions, trending items, similar products, frequently bought together, or use-case-based picks.

## Action Mapping
`RECOMMEND` → `CatalogService.getPersonalizedRecommendations()` / `getTrendingProducts()` / `getSimilarProducts()` / `getFrequentlyBoughtTogether()`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `category` | phones, laptops, shoes |
| `brand` | Samsung, Nike |
| `use case` | gaming, travel, gym, office |
| `recipient` | for me, for mom, for kids |
| `budget` | under 5000, around 20000 |

## Clarification Rules
- No context → return personalized (if logged in) or trending (guest)
- "Something for gaming" → ask budget if missing

## Follow-up Examples
```
Recommend something
  ↓
What category?
  ↓
Electronics
  ↓
What's your budget?
  ↓
Around 15000
  ↓ (personalized list)
```

---

## 200+ Real-World Utterances

### Direct Recommendation Requests
recommend
recommend something
recommend products
suggest something
suggest products
give me suggestions
what do you recommend
what do you suggest
what would you suggest
what should i buy
what should i get
what should i go with
what do you think i should buy
your recommendation
your suggestions
i need suggestions
need recommendations
give recommendations
make recommendations

### Trending / Popular
trending
trending products
trending items
what's trending
what's popular
popular products
best sellers
top products
top picks
hot products
hot items
hot deals
viral products
what's hot
what's selling
most sold
most bought
most ordered
most popular
highly popular
very popular

### Personalized
something for me
suggest for me
based on my history
based on what i've bought
based on my searches
personalized recommendations
what do i like
products i might like
suggestions for my taste
something i would like
products like what i bought
similar to my purchases
things i'm interested in
what's recommended for me

### Similar Products
similar products
similar items
something similar
show similar
products like this
items like this
more like this
same type of product
same category
something like that
alternatives
alternative products
other options
other choices
different options
more options
something else like this
other products like this

### Frequently Bought Together
frequently bought together
what goes with this
what pairs with this
bundle products
combo products
buy together
often bought together
customers also buy
customers also bought
people also buy
similar purchases
related products
compatible products
accessories for this
what accessories do i need
what else do i need

### Recently Viewed
recently viewed
products i've seen
items i looked at
things i browsed
what i was looking at
something i viewed
items i checked
my browsing history products

### Use-Case Recommendations
best for gaming
best for office
best for travel
best for gym
best for photography
best for students
best for home
best for outdoor
best for cooking
best for working out
products for gaming
products for office use
products for travel
products for gym
good for gaming
good for travel
good for students

### Budget-Based
best under 5000
best under 10000
best under 20000
best value
good value for money
affordable but good
cheap but good quality
budget picks
best budget options
premium picks
luxury options
top of the line
best in class

### Voice/Casual
yo recommend me something
hey what's good
bro what should i get
sis what do you suggest
what's worth buying
what's a good buy
what's a good pick
what should i pick up
pick something for me
choose something for me
help me pick
help me choose
can't decide what to buy
not sure what to buy
want something good
want something nice
want something cool
anything good you can suggest
anything you'd recommend
any favorites
any suggestions
any ideas
hit me with suggestions
throw some suggestions
give me some ideas
what are the top picks
what are the hot picks
what's fire right now
what's popping
