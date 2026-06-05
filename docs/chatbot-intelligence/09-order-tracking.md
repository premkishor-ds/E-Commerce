# 09 — Order Tracking

## Goal
`ORDER_TRACKING` → maps to intent: `TRACK_ORDER`

## Description
User wants to know the current status, location, or estimated delivery date of their order.

## Action Mapping
`TRACK_ORDER` → `SalesService.getOrderById()` or `SalesService.getOrders()` (latest)

## Expected Entities
| Entity | Examples |
|--------|---------|
| `orderId` | ORD-A1B2C3D4, ORD-12345678 |
| `reference` | my latest order, last order, recent order |

## Clarification Rules
- No order ID, not logged in → "Please provide your Order ID or log in"
- No order ID, logged in → Show latest order status
- Invalid order ID → "That order ID wasn't found. Please double-check."

## Follow-up Examples
```
Track my order
  ↓ (shows latest order status)
What's the estimated delivery?
  ↓ (shows delivery date from tracking)
Can I change the address?
  ↓ → MODIFY_ORDER intent
```

---

## 250+ Real-World Utterances

### Direct Track Requests
track order
track my order
track my package
track my parcel
track my shipment
track my delivery
track shipment
track package
track parcel
track delivery
order tracking
package tracking
parcel tracking
shipment tracking
delivery tracking
where is my order
where is my package
where is my parcel
where's my order
where's my package
where's my delivery
where is my delivery
where is it
find my order
find my package
locate my order
locate my package
check my order
check order status
check my delivery
order status
delivery status
shipping status
package status
parcel status
what's the status
status of my order
status of my package
status update
give me order status
order update
delivery update
shipping update
package update

### With Order ID
track ORD-12345678
track order ORD-A1B2C3
track ORD12345
where is ORD-A1B2C3D4
status of ORD-ABCD1234
check ORD-12345
order status ORD-ABCD
where is order ORD-ABC
track order number 12345
track order #12345
track #ORD-12345

### Latest / Recent Order
where is my latest order
track my latest order
track my last order
where is my recent order
most recent order status
last order status
last order tracking
track most recent
check my last order
what happened to my last order
last order where is it
my latest purchase
track my latest purchase
track recent purchase
my most recent order

### Questions About Delivery
when will my order arrive
when will it arrive
when is my delivery
when is my order coming
when will it be delivered
delivery date
estimated delivery date
expected delivery
arrival time
arrival date
will it arrive today
will it arrive tomorrow
is it coming today
is it coming tomorrow
will it be here on time
is it on the way
is it shipped
has it shipped
has it been shipped
is it out for delivery
out for delivery
is it out
on its way
on the way
in transit
in shipping
how far is my order
how many days more
how many days left
days until delivery
days for delivery
3 days left
when does it come

### Delivery Problem Queries
order not arrived
order hasn't arrived
order still not here
order delayed
delayed delivery
order delay
late delivery
delivery late
delivery is late
where is it, it's been days
it should have arrived already
supposed to arrive today
should be here by now
expected date passed
delivery overdue
past expected date
wrong delivery date

### Tracking Number
tracking number
get tracking number
what's the tracking number
tracking id
parcel tracking number
waybill number
tracking code
airway bill
consignment number
courier tracking
courier number
courier service
which courier
which delivery service
fedex
dhl
ups
amazon logistics
shiprocket
bluedart

### Voice / Informal
yo where's my order
hey where's my package
bro where's my stuff
my stuff isn't here yet
i ordered like 3 days ago where is it
just want to know where my order is
just checking if my order is shipped
ordered yesterday where is it
ordered last week what happened
it's been a week no update
waiting on my order
still waiting
still haven't got it
any update on my order
any news on my order
nothing yet from delivery
no delivery yet
no sign of package
did you ship my order
have you shipped it yet
not delivered yet
not received yet
haven't received anything

### Typo / Misspelled
trak order
trakc order
where is mi order
ordur status
delivery statuss
shiping status
pakage status
orderd tracking
where iz my order
shipment stauts
delivry status
delivry tracking
wher is my package
were is my parcel
