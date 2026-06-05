# 32 — Typo Queries

## Goal
`TYPO_TOLERANCE` → Correct typos and map to correct intent

## Description
Real users make typos constantly. The intent engine must handle misspellings, transpositions, extra/missing letters, phonetic spellings, and SMS-style abbreviations.

## Typo Resolution Strategy
1. Apply fuzzy string matching (Levenshtein distance ≤ 2)
2. Normalize: lowercase, remove extra spaces, trim
3. Common substitutions: vowel swaps, double letters, missing letters
4. Keyword stems: "ordr" → "order", "retrun" → "return"
5. After correction, classify normally

---

## 2000+ Typo Utterances (Categorized)

### ORDER TRACKING TYPOS
trak order
trakc order
track ordr
track ordeer
trck order
tra order
trakc my ordr
where iz my order
where si my order
wheres my ordeer
wher is my order
wher my order
were is my order
were is my parcel
where iz my pakage
track my ordeer
track my ordr
track my parcel
track mi parcel
check ordur
check ordr status
ordr status
ordur status
order statuss
ordeer status
ordar status
ordrs status
ordeer tracking
trakcing number
trackin number
trackng
trakcing
trackingg
shiping status
shping status
siphing status
shipment stauts
shipmnt status
delivry status
delvery status
deilvery status
delivrey status
deliveri status
delivary status
parcel statuss
pakage status
pakage tracking
pcakage tracking
pakge tracking

### CANCEL ORDER TYPOS
cancl order
cancle order
cancell order
canel order
canceel order
can el order
cancle my order
cncl order
cncel my order
canclled
cancled order
i want to cancle
please cancl
stop my ordder
cncl my ordeer
cancle the purchase
cansel order
cancel od
cacnel order
cnacl my order

### RETURN ORDER TYPOS
retrun order
reutrn order
retun my order
retunr item
reeturn
return ordr
retunr my order
riturn order
retrn order
retern item
i want to retun
reeturn pleas
retutn this
returrn item
send bak
send bacck
sned back
snend it back
retrun this
retrun prodcut

### REFUND TYPOS
refnd
refnud
refudn
rfeund
rfund
refund pleas
rfund me
get reufnd
reufnd request
refunnd
reefund
mony back
moneey back
money bakc
moeny back
get mony back
refund requets
refund requset
requst refund

### PRODUCT SEARCH TYPOS
phoen
phoone
phnoe
phne
mobil
moble
moibel
mobilee
laptopp
laptpo
lptop
laoptop
lpatop
latpop
lapton
lpotop
headfone
headphon
headhpone
headfones
hedaphones
earbud
earbods
earbuds
earbods
earphones
earfones
earphonse
earphoones
smasung
samsng
samsnug
samsun
sansung
smasung phone
samsong
sasung
iphoen
ipohne
iphone
ihphone
iphonne
apple iphoen
iphnoe
oneplus
one plus
onepls
1plus
sny headphones
snoy
soyn
soni headphones
nikee shoes
niike
neke shoes
adidass
adidos
adiddas
puma shoees
shoee
shose
shoe
schoes
shooes
t-sirt
tsirt
tshrit
t shrit
t sirt
jenes
jeens
jains
denims
deniim

### CART TYPOS
crat
craet
caard
carr
crat items
shoping cart
shopng cart
shpping cart
shooping cart
shoping bag
add to crat
add to craet
veiw cart
vew cart
viwe cart
my crat
my craet
clear crat
empyt cart
emtpy cart
chekout
chekcout
chcekout
che kout
checkut
checkou
chekout now
procced to checkout
prceed checkout
proceeed to pay
prceed to pay
buy nwo
buy noe
buynow

### WISHLIST TYPOS
wishlst
wishist
wish list
wishlits
wihslist
wishlsit
wislist
add to wishlst
my wishlst
veiw wishlst
vew wishlist
my favorties
favourtes
favourits
favorties
favorits
hearted items
my liked items
saved prodcts
saved prducts
saved prodcuts

### PAYMENT TYPOS
payement
payement methods
paymnt
paymnet
paymnets
paymant
paymets
my payemnts
payment methds
payment metohds
saved crad
savd card
credit crad
debit crad
add crad
remove crad
delete crad
uip payment
upi paymnt
cod
cash on delviery
cash on delivry
net bankng
netbankng
walelt
walleet
walett
walet balance
walet funds
add to walelt
topup walelt
top-up walelt
coupon cde
cupon code
couon code
prmo code
promo cde
dscount code
discunt code
aply coupon
appyl coupon
apply cupon

### SUPPORT TYPOS
crate ticket
crete ticket
creat ticket
ceeate ticket
creat tickt
suprt ticket
suport ticket
tickt
tickeet
tickt status
veiw tickets
view ticktes
my ticktes
my tickts
raisse complaint
rase complaint
raise complint
compliant
complint
report problm
reprot problem
report isseu
issue reprot

### PROFILE TYPOS
profle
profiel
porfle
proifle
profilee
my profle
view profle
upadate profile
upddate profile
udpate profile
updte profile
chagne name
chagne my name
chane my name
changge name
chnge name
updat email
update emial
update emali
chagne password
chnage password
pasword change
passwrod change
passwordd change
new pasword
new passwrod
adress
adress management
adresses
my adresses
add adress
upadte address
dlete address
deleet address

### TRACKING / ORDER MANAGEMENT TYPOS
invoce
invocie
invioce
invice
downlaod invoice
downlod invoice
downlood invoice
downloaad invoice
bill
get bil
get bll
reordeer
rorder
re-oder
reodeer
repurchase
re-purchase
purchse again
buy agian
ordeer again

### GENERAL INTENT TYPOS
logn
logi in
lgoin
signn in
signin
signi n
sing in
regsiter
registeer
regiter
registr
regster
creat account
creat an account
logut
log ot
signout
sign ot
helpp
heelp
hlep
pleease help
pleas help
pleese help
asistance
asistant
asist me
shw me
sow me
fnd product
serach
searcch
searcg
searc
serach products
searh for
looking fo
lookig for
loking for
lookin for
