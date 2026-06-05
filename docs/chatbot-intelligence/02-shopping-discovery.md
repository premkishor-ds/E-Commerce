# 02 — Shopping Discovery

## Goal
`SHOPPING_DISCOVERY` → maps to intent: `SEARCH_PRODUCT` or `SHOPPING_ASSISTANT` or `BROWSE_CATEGORY`

## Description
User wants to browse, discover, or explore products without a specific product in mind. May want to be guided, see what's available, or explore by category, budget, occasion, or recipient.

## Action Mapping
- Vague browsing → `SEARCH_PRODUCT` (trigger category guide)
- Guided assistance → `SHOPPING_ASSISTANT`
- Category selection → `BROWSE_CATEGORY`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `category` | electronics, fashion, kitchen, fitness, books |
| `budget` / `maxPrice` | under 50, cheap, budget-friendly |
| `occasion` | birthday, gift, anniversary, wedding |
| `recipient` | for mom, for dad, for kids, for wife |
| `brand` | Samsung, Nike, Apple |
| `sort` | trending, popular, best sellers, new arrivals |

## Clarification Rules
- Missing category → Ask: "What type of product are you looking for?"
- Missing budget on gift query → Ask: "What's your budget for this gift?"

## Follow-up Examples
```
Show me something
  ↓
What category?
  ↓
Electronics
  ↓
What's your budget?
  ↓
Under 5000
  ↓ (show results)
```

## Edge Cases
- "Need something" → Ask what category
- "Show me stuff" → Offer category menu
- "Anything good" → Offer trending products

---

## 500+ Real-World Utterances

### Pure Browsing / Discovery
i want to browse
just browsing
looking around
window shopping
let me look around
show me what you have
show me your products
show me what's available
show me everything
show me all products
what do you have
what do you sell
what products do you have
what products do you offer
what's available
what's in stock
show me products
list products
view products
browse products
browse all products
browse catalog
see catalog
view catalog
open catalog
show catalog
explore products
discover products
shop now
start shopping
let me shop
i want to shop
i'm shopping
ready to shop
time to shop

### Need / Want (Vague)
i need something
i want something
looking for something
searching for something
find me something
get me something
show me something
i need to buy something
want to buy something
looking to buy
want to purchase
need to purchase
want to order
looking to order
something to buy
what can i buy
what should i buy
need something to buy
what do you have to buy
anything to buy
things to buy
stuff to buy
goods to buy
items to buy
products to buy

### Gift Shopping
looking for a gift
need a gift
want to buy a gift
gift shopping
shopping for a gift
gift ideas
gift suggestions
gift options
what gifts do you have
gifts for someone
need gift ideas
birthday gift
birthday present
anniversary gift
anniversary present
christmas gift
holiday gift
diwali gift
eid gift
wedding gift
housewarming gift
graduation gift
baby shower gift
fathers day gift
mothers day gift
valentines day gift
gift for him
gift for her
gift for them
gift for friend
gift for wife
gift for husband
gift for girlfriend
gift for boyfriend
gift for mom
gift for dad
gift for parents
gift for grandma
gift for grandpa
gift for kids
gift for child
gift for baby
gift for teen
gift for teenager
gift for coworker
gift for boss
gift under 50
gift under 100
gift under 500
gift under 1000
cheap gift
affordable gift
luxury gift
expensive gift
unique gift
special gift
personalized gift
practical gift
useful gift
tech gift
gadget gift
fashion gift
cool gift
awesome gift
best gift

### Category Browsing
show me electronics
browse electronics
electronics section
electronics category
electronics products
what electronics do you have
show me fashion
browse fashion
fashion section
fashion products
what clothes do you have
clothing section
show me clothes
show me apparel
apparel section
show me home products
home section
home and kitchen
kitchen products
show me kitchen items
show me fitness products
fitness section
sports section
sports products
show me sports gear
show me books
books section
book products
show me toys
toys section
toy products
show me beauty products
beauty section
skincare products
show me health products
health section
wellness products
show me automotive
automotive section
car accessories
show me gaming
gaming section
gaming products
show me furniture
furniture section
home decor
home furniture
show me laptops
show me phones
show me tablets
show me headphones
show me earbuds
show me speakers
show me cameras
show me TVs
show me monitors
show me keyboards
show me shoes
show me bags
show me watches
show me sunglasses
show me jackets
show me t-shirts
show me jeans

### Trending / Popular / New
trending products
trending items
what's trending
what's popular
popular products
best sellers
best selling products
most popular products
top products
top rated products
top selling
hot products
hot deals
new arrivals
latest products
newest products
just arrived
recently added
what's new
what's new here
new products
fresh arrivals
fresh products
just launched
recently launched
featured products
highlighted products
special products
recommended products
today's picks
daily picks
editor's picks
staff picks
our picks
hand-picked
curated products

### Budget-Based Shopping
cheap products
budget products
affordable products
cheap stuff
budget buys
value products
best value
great deals
deals
good deals
hot deals
sale items
discounted items
on sale
items on sale
products on discount
clearance
clearance items
outlet products
under 500
products under 500
under 1000
under 2000
under 5000
under 10000
under 50 dollars
under 100 dollars
budget shopping
low budget shopping
something inexpensive
something affordable
not too expensive
not very expensive
reasonably priced
mid range products
premium products
luxury products
high end products
expensive products

### Occasion/Lifestyle Based
products for home
home essentials
home necessities
house products
daily use products
everyday products
daily essentials
essentials
must have products
need for office
office essentials
work from home products
school supplies
study products
student products
gym products
workout products
exercise products
outdoor products
adventure gear
travel products
camping products
party products
party supplies
festival products
wedding products
baby products
newborn products
pet products
pet supplies
eco friendly products
organic products
sustainable products
green products

### Just Entered Store / Exploratory
let's see what's here
see what's available
curious what you sell
want to explore
exploring the store
exploring the catalog
just looking
just checking
seeing what you have
seeing what's available
checking out the products
taking a look
having a look
browsing through
going through the catalog
scanning products
scanning the store
checking the inventory
looking for inspiration
need inspiration
want inspiration
inspire me
surprise me
show me something cool
show me something nice
show me something interesting
something for me
something i might like
anything you recommend
anything good here
what do you suggest
what would you suggest
give me suggestions
give me recommendations
something new
something trending
something popular
something cheap
something premium

### Voice Style
okay show me what you got
hey what do you sell
yo show me some products
show me your stuff
what kind of stuff do you have
lemme see the products
let me check out the products
what have you got for me
what's good today
what's hot today
wanna see what's available
let me browse around
gonna shop a bit
shopping time
time to look around
