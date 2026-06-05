# 03 — Product Search

## Goal
`PRODUCT_SEARCH` → maps to intent: `SEARCH_PRODUCT`

## Description
User wants to find specific products by name, type, brand, category, price range, features, use case, or recipient. This is the highest-volume intent.

## Action Mapping
`SEARCH_PRODUCT` → `CatalogService.getProducts({ search, category, brand, maxPrice, sort })`

## Expected Entities
| Entity | Examples |
|--------|---------|
| `productType` | phone, laptop, headphones, shoes, watch, TV |
| `brand` | Samsung, Apple, Sony, Nike, Adidas, OnePlus |
| `category` | electronics, fashion, kitchen, fitness |
| `maxPrice` | under 20000, below 500, cheap |
| `minPrice` | above 1000, at least 5000 |
| `color` | black, white, blue, red, gold |
| `size` | small, medium, large, XL, size 10 |
| `ram` | 8GB RAM, 16GB |
| `storage` | 256GB, 512GB, 1TB |
| `sort` | cheapest, best rated, newest, most popular |

## Clarification Rules
| Missing Entity | Clarification |
|---------------|--------------|
| Brand only, no type | "What type of [brand] product?" |
| Generic product, no budget | "What is your budget?" (optional, skip if not needed) |
| Very vague query | "Could you tell me more? (category/budget/brand)" |

## Follow-up Context Chain
```
Need phone
  ↓
Under 20000
  ↓ (filters by price)
Samsung
  ↓ (filters by brand)
256GB
  ↓ (filters by storage)
Black color
  ↓ (filters by color)
Show first one
  ↓ (GET_PRODUCT on result[0])
Add to cart
```

## Edge Cases
- "Need something" → ask category
- "Phone" alone → valid, search directly
- "Samsung" alone → search brand
- "Under 500" alone → ask what product

---

## 1000+ Real-World Utterances

### PHONES / MOBILES / SMARTPHONES
phone
phones
mobile
mobiles
smartphone
smartphones
need phone
need a phone
want a phone
buy phone
looking for phone
show phones
show me phones
show mobiles
find phone
search phone
phone under 20000
phone under 15000
phone under 10000
phone under 50000
phone under 500 dollars
phone under 1000
budget phone
cheap phone
affordable phone
low cost phone
mid range phone
premium phone
flagship phone
best phone
best smartphone
good phone
nice phone
new phone
latest phone
android phone
iOS phone
5G phone
5G mobile
gaming phone
camera phone
best camera phone
phone with best camera
best selfie phone
selfie phone
photo phone
battery life phone
long battery phone
phone with big battery
fast charging phone
waterproof phone
rugged phone
student phone
phone for student
phone for college
college phone
school phone
phone for old people
phone for kids
kids phone
first phone
beginner phone
iphone
apple phone
apple iphone
samsung phone
samsung mobile
samsung galaxy
galaxy phone
oneplus phone
realme phone
redmi phone
xiaomi phone
xiaomi mobile
oppo phone
vivo phone
motorola phone
nokia phone
pixel phone
google pixel
huawei phone
nothing phone
phone with 128gb
phone with 256gb
256gb phone
128gb phone
8gb ram phone
12gb ram phone
phone with 8gb ram
phone with 12gb ram
black phone
white phone
blue phone
gold phone
silver phone
red phone
green phone
show me iphones
show me samsung phones
show me oneplus phones
best phone under 20k
best phone under 15k
best phone under 10k
cheapest phone
most affordable phone
flagship under 40000
phone with snapdragon
phone with dimensity
phone with amoled display
amoled phone
oled phone

### LAPTOPS / COMPUTERS / NOTEBOOKS
laptop
laptops
notebook
computer
pc
show laptops
need laptop
want laptop
buy laptop
looking for laptop
laptop under 50000
laptop under 40000
laptop under 30000
laptop under 1000
laptop under 500
budget laptop
cheap laptop
affordable laptop
student laptop
college laptop
work laptop
office laptop
gaming laptop
gaming computer
gaming pc
video editing laptop
programming laptop
developer laptop
coding laptop
software developer laptop
lightweight laptop
thin laptop
portable laptop
ultrabook
slim laptop
macbook
apple laptop
dell laptop
hp laptop
lenovo laptop
asus laptop
acer laptop
msi laptop
razer laptop
alienware
asus rog
i5 laptop
i7 laptop
i9 laptop
ryzen 5 laptop
ryzen 7 laptop
8gb ram laptop
16gb ram laptop
32gb ram laptop
256gb ssd laptop
512gb ssd laptop
1tb laptop
4k laptop
touchscreen laptop
2 in 1 laptop
convertible laptop
chromebook
windows laptop
mac laptop
linux laptop
best laptop for college
best laptop for gaming
best laptop for students
best laptop for programming
laptop with 8 hours battery
laptop with good battery
laptop with ssd
fast laptop
best performance laptop

### TVs / TELEVISIONS / DISPLAYS
tv
television
smart tv
smart television
show tvs
need tv
buy tv
tv under 30000
tv under 20000
tv under 50000
55 inch tv
65 inch tv
43 inch tv
32 inch tv
4k tv
full hd tv
oled tv
qled tv
samsung tv
lg tv
sony tv
mi tv
xiaomi tv
tcl tv
hisense tv
android tv
google tv
fire tv
curved tv
flat tv
wall mount tv

### HEADPHONES / EARPHONES / EARBUDS / AUDIO
headphones
headphone
earphones
earphone
earbuds
earbud
wireless earbuds
wireless headphones
bluetooth earbuds
bluetooth headphones
noise cancelling headphones
noise cancelling earbuds
anc headphones
anc earbuds
gaming headset
over ear headphones
on ear headphones
in ear headphones
open back headphones
closed back headphones
studio headphones
bass headphones
headphones under 1000
headphones under 500
headphones under 2000
cheap earbuds
wireless earbuds under 1000
earbuds under 500
airpods
apple earbuds
apple airpods
sony headphones
bose headphones
sennheiser headphones
jbl earbuds
jbl headphones
samsung earbuds
galaxy buds
oneplus earbuds
realme earbuds
boat earbuds
boat headphones
skullcandy headphones
show me earbuds
need earbuds
looking for earphones
buy headphones
good earbuds
cheap earbuds
best earbuds
best headphones
workout earbuds
gym earbuds
running earbuds
sports earbuds

### SPEAKERS / SOUNDBARS
bluetooth speaker
portable speaker
wireless speaker
outdoor speaker
waterproof speaker
party speaker
soundbar
home theater
surround sound
jbl speaker
bose speaker
sony speaker
marshall speaker
boat speaker
mini speaker
small speaker
big speaker
bass speaker
loud speaker

### WATCHES / SMARTWATCHES / FITNESS BANDS
watch
watches
smartwatch
smart watch
fitness band
fitness tracker
activity tracker
smart band
wearable
apple watch
samsung watch
galaxy watch
fitbit
garmin watch
amazfit
mi band
boat watch
noise watch
sports watch
running watch
swimming watch
underwater watch
waterproof smartwatch
watch under 5000
watch under 10000
cheap watch
luxury watch
digital watch
analog watch

### CAMERAS / PHOTOGRAPHY
camera
digital camera
dslr
mirrorless camera
action camera
gopro
sony camera
canon camera
nikon camera
fujifilm camera
camera under 30000
budget camera
entry level camera
beginner camera
professional camera
vlogging camera
travel camera
point and shoot

### TABLETS / IPADS
tablet
tablets
ipad
android tablet
samsung tablet
lenovo tablet
drawing tablet
kids tablet
cheap tablet
tablet under 20000

### SHOES / FOOTWEAR
shoes
sneakers
sports shoes
running shoes
casual shoes
formal shoes
leather shoes
sandals
slippers
boots
hiking boots
football boots
cricket shoes
basketball shoes
gym shoes
training shoes
nike shoes
adidas shoes
puma shoes
reebok shoes
skechers shoes
shoes under 2000
shoes under 5000
cheap shoes
affordable shoes
comfortable shoes
shoes size 9
shoes size 10

### CLOTHING / APPAREL / FASHION
t-shirt
tshirt
shirt
formal shirt
casual shirt
polo shirt
hoodie
sweatshirt
jacket
winter jacket
leather jacket
jeans
denim
trousers
pants
shorts
track pants
gym shorts
dress
kurta
saree
top
crop top
blouse
leggings
yoga pants
coat
blazer
suit
sportswear
activewear
men clothes
women clothes
kids clothes
xl clothes
xl shirt
large size clothes
clothing under 500
cheap clothes
affordable clothes

### BAGS / ACCESSORIES
bag
bags
backpack
laptop bag
school bag
travel bag
handbag
purse
wallet
men wallet
ladies bag
sports bag
gym bag
tote bag
messenger bag
sling bag
branded bag
cheap bag

### KITCHEN / HOME APPLIANCES
blender
mixer
juicer
rice cooker
pressure cooker
microwave
oven
toaster
coffee maker
air fryer
instant pot
kitchen appliance
cooker
electric kettle
induction cooktop
dishwasher
water purifier
air purifier
vacuum cleaner
room heater
ceiling fan
table fan
air conditioner
ac
washing machine
refrigerator
fridge
freezer

### FITNESS / SPORTS / OUTDOOR
treadmill
exercise bike
yoga mat
dumbbell
dumbbells
gym equipment
kettlebell
resistance band
pull up bar
barbell
weight bench
rowing machine
elliptical
skipping rope
jump rope
football
cricket bat
cricket kit
badminton racket
tennis racket
cycling helmet
bicycle
cycle
mountain bike
road bike
swimming gear
goggles
sports equipment
outdoor gear
camping gear
tent
sleeping bag
hiking shoes

### GAMING / GAMING GEAR
gaming mouse
gaming keyboard
gaming chair
gaming headset
gaming monitor
controller
joystick
ps5
ps4
xbox
nintendo switch
gaming laptop
gaming pc
gaming accessories
gaming gear

### BEAUTY / PERSONAL CARE
face wash
moisturizer
sunscreen
serum
toner
lipstick
foundation
mascara
eyeshadow
blush
highlighter
face mask
skincare products
hairdryer
hair straightener
curling iron
shampoo
conditioner
electric shaver
trimmer
perfume
deodorant

### SEARCH BY FEATURE / USE CASE
best for gaming
best for streaming
best for watching movies
best for work
best for working from home
best for students
best for travel
best for gym
best for running
best for outdoor
best for photography
best for video editing
best for music
best for calls
best for battery life
best under budget
best quality
highest rated
most reviewed
most sold
fast delivery products
prime products
top picks
staff picks
trending
viral products
popular items

### COMPARISON-STYLE SEARCHES
phones vs tablets
laptop vs tablet
iphone vs samsung
apple vs samsung
earbuds vs headphones
bluetooth vs wired
wired vs wireless
cheap vs premium
best value options
compare phones
compare laptops

### VOICE/INFORMAL STYLE
gimme a phone
lemme see laptops
yo show me some shoes
bro i need headphones
sis i want a watch
lol need a new phone
bruh show me gaming gear
wanna see some laptops
wanna buy some shoes
can u show earbuds
can u find me a laptop
any good phones
any affordable laptops
any cheap earbuds
something for gaming
something for office
something for gym
something for home
something for gifting
something wireless
something waterproof
something under budget
