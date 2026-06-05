# 17 — Wallet

## Goal
`WALLET` → maps to intent: `VIEW_WALLET`

## Description
User wants to view wallet balance, add funds, view transaction history, or use wallet to pay.

## Action Mapping
`VIEW_WALLET` → `ProfileService.getProfile()` + `ProfileService.getWalletTransactions()` + optional `ProfileService.addWalletFunds()`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `amount` | add 100, load 500, top up 200 |
| `action` | view, add, load, deposit, check |

---

## 200+ Real-World Utterances

### VIEW WALLET
wallet
my wallet
wallet balance
check wallet
view wallet
show wallet
wallet details
wallet info
how much in wallet
how much wallet balance
wallet amount
available balance
store balance
store credit
credit balance
account credit
remaining balance
current balance
wallet page
go to wallet
open wallet
wallet section

### ADD FUNDS
add to wallet
add money to wallet
add funds
add funds to wallet
top up wallet
top up
load wallet
load money
deposit to wallet
deposit
add credits
add store credits
recharge wallet
fund wallet
add balance
add more to wallet
i want to add money
load 100
add 50 to wallet
add 100 to wallet
add 500 to wallet
load 200 to wallet
deposit 100
put 50 in wallet
increase wallet balance
refill wallet
top up with 200

### USE WALLET
pay with wallet
wallet payment
use wallet balance
use my wallet
use store credit
use my credits
pay from wallet
checkout with wallet
wallet checkout
deduct from wallet

### TRANSACTION HISTORY
wallet transactions
wallet history
transaction history in wallet
wallet activity
wallet log
recent wallet transactions
past wallet transactions
all wallet transactions
spending history in wallet
wallet spending

### Voice/Informal
how much do i have in wallet
my wallet has how much
check my credits
see my store balance
add money please
top up please
load some money
put money in wallet
i have some credit?
what's my wallet amount
