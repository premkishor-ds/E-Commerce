# 10 — Order Management

## Goal
`ORDER_MANAGEMENT` → maps to intents: `VIEW_ORDERS`, `CANCEL_ORDER`, `MODIFY_ORDER`, `REORDER`, `DOWNLOAD_INVOICE`

## Description
User wants to view order history, cancel an order, modify delivery details/payment/items, reorder a past purchase, or download an invoice.

## Action Mapping
| Intent | Action |
|--------|--------|
| `VIEW_ORDERS` | `SalesService.getOrders(userId)` |
| `CANCEL_ORDER` | `SalesService.updateOrderStatus('Cancelled')` |
| `MODIFY_ORDER` | Multi-step flow: address/slot/payment/items |
| `REORDER` | Re-add items from past order to cart |
| `DOWNLOAD_INVOICE` | Invoice PDF link |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `orderId` | ORD-A1B2C3D4 |
| `status` | Pending, Shipped, Delivered, Cancelled |
| `modifyType` | address, payment, slot, quantity |

## Clarification Rules
- Cancel without ID → Show pending orders, ask which to cancel
- Modify without specifying change → Show modification options menu

## Follow-up Examples
```
My orders
  ↓ (list of orders)
Cancel ORD-12345
  ↓ (confirm?)
Yes cancel it
  ↓ (cancelled ✅)
```

---

## 250+ Real-World Utterances

### VIEW ORDERS
my orders
my order history
order history
view orders
show orders
list orders
all my orders
see my orders
check my orders
past orders
previous orders
recent orders
old orders
completed orders
show completed orders
show all orders
order list
order records
order log
my purchases
my past purchases
purchase history
bought items
what i've ordered
what i've bought
orders made
placed orders
show placed orders
total orders
all orders made
what orders do i have
any orders
my order page
go to orders
orders section
review my orders
i want to see my orders

### CANCEL ORDER
cancel order
cancel my order
cancel this order
i want to cancel
i need to cancel
please cancel
cancel please
stop my order
abort order
abort my order
dont want order anymore
don't want this order
change my mind
i changed my mind
cancel the purchase
cancel the shipment
stop shipment
stop delivery
cancel order ORD-12345
cancel ORD-A1B2
cancel my recent order
cancel last order
cancel latest order
cancel the pending order
cancel order for phone
cancel laptop order
i want to cancel my order placed today
cancel order placed yesterday
cancel today's order
cancel order immediately
undo my order
reverse the order
i don't want it delivered

### MODIFY ORDER
modify order
change order
update order
edit order
change delivery address
update delivery address
change my delivery address
update my address for order
different delivery address
deliver to different address
change order address
update order address
reschedule delivery
change delivery date
update delivery date
change delivery slot
morning slot
evening slot
afternoon slot
change payment method for order
update payment for order
different payment
change to cod
change to stripe
change items in order
update items
change quantity in order
reduce quantity
add item to existing order
remove item from order
order modification

### REORDER
reorder
buy again
order again
purchase again
repeat order
repeat my order
same order again
same as last time
same as before
order the same thing
get the same
order same items
order this again
place same order
one more time
i want to reorder
reorder my last order
reorder latest purchase
order what i bought before
get what i ordered last time
same order from last week
my regular order

### DOWNLOAD INVOICE
download invoice
get invoice
invoice
invoice pdf
receipt
order receipt
billing receipt
purchase receipt
print invoice
save invoice
download receipt
get bill
billing document
tax invoice
gst invoice
payment receipt
order bill
invoice for order
invoice ORD-12345
get invoice for last order
invoice for my purchase

### Voice/Informal
yo show me my orders
hey list my orders
bro i want to cancel
i'm cancelling this order
need to cancel asap
gotta cancel this
cancel it please
take it back
i don't want it
don't deliver
stop the delivery
switch the address
new address please
change where it's going
change the delivery location
deliver somewhere else
different place please
other address
different slot
morning please
not morning, evening
change slot to evening

### Typos / Misspellings
my ordrs
my ordes
cancell order
canel order
modifie order
ordr history
cancle my order
downlod invoice
invoic pdf
rorder
reoder
veiw orders
shw orders
