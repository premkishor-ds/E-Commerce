# 18 — Loyalty Points

## Goal
`LOYALTY` → maps to intent: `VIEW_LOYALTY`

## Description
User wants to view loyalty points, membership tier, redeem/convert points, or understand how the rewards program works.

## Action Mapping
`VIEW_LOYALTY` → `ProfileService.getProfile()` + optional `ProfileService.convertPoints()`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `points` | convert 100 points, redeem 500 |
| `action` | view, convert, redeem, exchange |

---

## 200+ Real-World Utterances

### VIEW POINTS
loyalty
loyalty points
my points
reward points
rewards
my rewards
check points
view points
show points
points balance
how many points
how many loyalty points
remaining points
available points
earned points
total points
points summary
points overview
points page
go to rewards
open rewards
rewards section
my tier
membership tier
tier level
gold member
silver member
platinum member
rewards program
loyalty program
what is my tier
what level am i

### REDEEM / CONVERT
redeem points
convert points
exchange points
use points
spend points
cash in points
convert to wallet
convert to credit
exchange for credit
redeem for discount
use loyalty for discount
how to use points
how to redeem points
points to cash
convert 100 points
redeem 500 points
exchange 200 points
use 1000 points

### HOW LOYALTY WORKS
how does loyalty work
how do points work
how do i earn points
how to earn points
how to get points
points per purchase
earning rate
how much per order
how to increase tier
how to reach gold
how to reach platinum
benefits of loyalty
tier benefits
rewards benefits
what are the perks
perks of loyalty
loyalty perks
member benefits

### Voice/Informal
how many points do i have
got any points
check my rewards
what are my points worth
can i use my points
my points expired
do points expire
points expiry
how long are points valid
points validity
earn more points
i want to redeem
redeem please
