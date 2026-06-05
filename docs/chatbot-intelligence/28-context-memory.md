# 28 — Context Memory

## Goal
`CONTEXT_MEMORY` → Used by `AgentMemoryService` to persist and recall conversation context

## Description
The chatbot must remember entities, preferences, history, and context across the entire conversation session. Context should persist across multiple turns.

## Memory Layers
| Layer | Storage | TTL |
|-------|---------|-----|
| Session (turn-by-turn) | `ChatSession.messages[]` | Session duration |
| Search History | `ChatSession.searchHistory` + `UserMemory.searchHistory` | Persistent |
| Viewed Products | `ChatSession.viewedProducts` + `UserMemory.viewedProducts` | Persistent |
| Guest Profile | `GuestProfile` | Until merge/expiry |
| User Memory | `UserMemory` (MongoDB) | Persistent |

## Context Resolution Rules
1. "it/this/that" → last mentioned product in session
2. "same" → last action repeated
3. "under budget" → last mentioned maxPrice
4. "that brand" → last mentioned brand entity
5. Follow-up refinements → merge with last search entities
6. "my last order" → latest from `SalesService.getOrders()`

---

## 250+ Context-Memory-Dependent Utterances

### Product Context References
add it to cart
buy it
get it
show more of it
see more like this
similar to this
more like that
compare with this
compare with the last one
compare this one with that one
add this too
add that as well
what's the price of this
what's the rating of that
is this available
does that come in black
show warranty for this
return policy for that
add to wishlist
save this
heart it
tell me more about it
show specs of this
what's in the box
how much does this cost
is it on sale
any discount on this

### Brand Context References
show me more samsung
more from samsung
other samsung products
other apple products
show more from that brand
more from that company
same brand different model
other models by this brand
similar brand
something similar
a cheaper version
a more expensive version
better model
lower model
upgraded version

### Price Context References
something cheaper
something less expensive
more affordable
under my budget
within budget
below that price
above that price
same price range
around that price
cheaper than this
more expensive than that
double the budget
half the price
similar price
same budget
in that range

### Search Context References
search again
search differently
same search
same query
refine search
narrow down
filter this
same products
in those results
from those results
among those
in that list
from that list
the first result
first search result
the top result
second result

### Order Context References
that order
track that
return that
cancel that
exchange that
modify that
download invoice for that order
get details of that order
about that order
what's that order status
invoice for that
related to that order
same order
the order i mentioned
last order
recent order

### Conversation Memory Flow Examples (Multi-turn)
# Turn 1
User: show me phones
Bot: Found 12 phones...

# Turn 2
User: under 20000
Bot: (filters previous search to under 20000)

# Turn 3  
User: samsung
Bot: (further filters to Samsung brand)

# Turn 4
User: black color
Bot: (further filters to black Samsung phones under 20000)

# Turn 5
User: show first one
Bot: (shows details of results[0])

# Turn 6
User: add to cart
Bot: (adds that product to cart)

# Turn 7
User: checkout
Bot: (starts checkout with cart items)

---

# Second Example Flow
# Turn 1
User: track my order
Bot: Order #A1B2C3D4 is Shipped

# Turn 2
User: cancel it
Bot: (cancels order #A1B2C3D4 — resolved from context)

# Turn 3
User: get refund
Bot: (initiates refund for that same cancelled order)

---

# Third Example Flow
# Turn 1
User: i need a laptop for gaming
Bot: Found 4 gaming laptops...

# Turn 2
User: under 60000
Bot: (filters to under 60000)

# Turn 3
User: which one has more ram
Bot: (answers from context about the filtered laptops)

# Turn 4
User: add the best rated one
Bot: (adds top rated result from the filtered list)

---

### Memory-Test Utterances
show me same thing again
show me that again
what were those products again
remind me what i searched
what was the last product
what did i just look at
what did i just search
i forget what i was looking at
go back to previous results
go back
previous results
what was the last thing i added
what's in my cart again
what's the last order
go back to that
that product again
that brand again
that search again
that price again
same budget
same brand
same category
same type
same specs
same size
same color

### Cross-Session Memory
remember my preferences
save my preferences
i always buy
i usually buy
i prefer
my favorite brand
my usual size
my usual budget
i've bought this before
i bought this last time
same as before
same as usual
same as always
based on my past
based on my history
based on what i usually buy
based on my preferences
you should know my taste
