# 12 — Exchanges

## Goal
`EXCHANGES` → maps to intent: `EXCHANGE_ORDER`

## Description
User wants to exchange a product for a different size, color, variant, or replacement for a defective item.

## Action Mapping
`EXCHANGE_ORDER` → Multi-step: Order ID → Reason → Variant details → Confirm → Support ticket (High)

## Expected Entities
| Entity | Examples |
|--------|---------|
| `orderId` | ORD-A1B2C3D4 |
| `reason` | wrong size, defective, wrong color |
| `exchangeDetails` | Size L, Black color, 256GB |

## Clarification Rules
- No order → Use latest order
- No reason → Ask for reason
- No new variant → Ask what they want instead

---

## 200+ Real-World Utterances

### Direct Exchange Requests
exchange
exchange order
exchange my order
i want to exchange
need to exchange
request exchange
initiate exchange
start exchange
exchange product
exchange item
swap item
swap product
swap out
swap this out
exchange this
trade in
trade this in
swap for different
exchange for different
change my product

### Size Exchange
wrong size
too small
too big
size doesn't fit
doesn't fit
size issue
need bigger size
need smaller size
exchange for bigger size
exchange for smaller size
size up
size down
size exchange
wrong shoe size
wrong cloth size
need xl instead of l
ordered wrong size
wrong size delivered
size mismatch
can i get size medium instead
can i exchange for size l
exchange shoes for size 9
exchange shirt for xl

### Color Exchange
wrong color
wrong colour
different color
different colour
exchange for black
exchange for white
exchange for blue
exchange for red
color exchange
colour exchange
i wanted black but got white
i wanted blue but got black
not the color i ordered
color mismatch
colour mismatch
wrong color delivered
change color

### Defective / Damaged Exchange
defective exchange
damaged item exchange
broken item exchange
not working exchange
exchange defective product
exchange damaged product
product stopped working exchange
replace defective
replace damaged
replace broken
replacement for defective product
replacement for broken item
exchange for working one
exchange for undamaged one
replacement unit
replace with new unit

### Voice/Informal
yo swap this out
hey exchange this please
bro wrong size
sis wrong color
this doesn't fit, exchange
this is the wrong one, exchange
can i swap it
can i exchange it
i need a different size
i need a different color
different variant please
something else please

### Typos
exchage order
xchange
exchnage
exchenge
exhange
excange order
exchang
swp item
