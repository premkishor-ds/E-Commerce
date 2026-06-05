# 11 — Returns

## Goal
`RETURNS` → maps to intent: `RETURN_ORDER`

## Description
User wants to return a product, initiate a return request, get a return label, or understand the return policy.

## Action Mapping
`RETURN_ORDER` → Multi-step: Order ID → Create support ticket (High priority)

## Expected Entities
| Entity | Examples |
|--------|---------|
| `orderId` | ORD-A1B2C3D4 |
| `reason` | defective, wrong item, not as described, changed mind |
| `reference` | my latest order, last order |

## Clarification Rules
- No order ID → Ask for Order ID or "my latest order"
- Reason optional, but capture if provided

## Follow-up Examples
```
Return my order
  ↓
Which order ID? or "my latest order"
  ↓
ORD-12345
  ↓ (ticket created)
When will I get refund?
  ↓ → REFUND intent follow-up
```

---

## 200+ Real-World Utterances

### Direct Return Requests
return
return order
return my order
i want to return
i need to return
i'd like to return
request a return
initiate return
start return
make a return
process return
return product
return item
send it back
send this back
send back the item
send back my order
ship it back
ship back
return shipment
return pickup
schedule return pickup
pickup return
arrange return
return request
file return
submit return request
place return request

### Specific Return Reasons
i want to return defective item
returning damaged product
product is damaged
item is broken
item arrived broken
broken product
defective product
not working
doesn't work
stopped working
faulty item
faulty product
quality issue
bad quality
poor quality
not as described
not what i ordered
wrong item sent
wrong size
wrong color
wrong product
different from what i ordered
not matching description
misleading product
product not matching
item not matching
didn't like it
don't like it
not satisfied
not happy with it
changed my mind
decided not to keep
no longer want it
don't need it anymore

### Return with Order Reference
return ORD-12345
return order ORD-A1B2C3D4
return my latest order
return my last order
return my recent purchase
return what i just received
return the phone i ordered
return the shoes
return the laptop
return the shirt
return the earphones

### Policy Questions
return policy
what is the return policy
how many days to return
return window
how long do i have to return
can i return after 30 days
return deadline
last date to return
return period
when can i return
how does returning work
how do returns work
return process
how long for return pickup
how long for return approval
when will return be approved
return status
return tracking
has my return been received

### Refund Questions (in return context)
when will i get refund
refund after return
refund timeline
how long for refund
refund processing time
when does refund come
refund to card
refund to wallet
original payment refund
refund to bank account
money back
get my money back
i want my money back
full refund
partial refund

### Voice/Informal
yo i wanna return this
hey take this back
bro this thing is broken
this is busted
this isn't working
bad product please return
junk product i want a return
i'm not happy with this, return it
this was a waste, return
terrible product want return
not what i expected, return
didn't like it, return please
i'm disappointed, return
not worth it, return
arrived damaged, return
came broken, return

### Typos / Misspellings
retrun order
reutrn
retun my order
retunr item
reeturn
return ordr
retrun my latset order
retun request
reeturn policy
retturn
