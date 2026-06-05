# 15 — Address Management

## Goal
`ADDRESS_MANAGEMENT` → maps to intents: `ADDRESS_MANAGE`, `ADD_ADDRESS`, `UPDATE_ADDRESS`, `DELETE_ADDRESS`, `SET_DEFAULT_ADDRESS`

## Description
User wants to view, add, update, delete, or set a default shipping/billing address.

## Action Mapping
| Intent | Action |
|--------|--------|
| `ADDRESS_MANAGE` | `ProfileService.getAddresses()` |
| `ADD_ADDRESS` | Multi-step address collection flow |
| `UPDATE_ADDRESS` | Select address + update fields |
| `DELETE_ADDRESS` | Select address + confirm delete |
| `SET_DEFAULT_ADDRESS` | Select address + set as default |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `addressLabel` | Home, Office, Work |
| `city` | Mumbai, Delhi, New York |
| `pincode` | 400001, 10001 |

---

## 200+ Real-World Utterances

### VIEW ADDRESSES
my addresses
view addresses
show addresses
list addresses
address list
manage addresses
my shipping addresses
saved addresses
delivery addresses
all addresses
address management
my delivery locations
my locations
address book
address section
go to addresses
open addresses
address page

### ADD ADDRESS
add address
add new address
new address
new shipping address
new delivery address
new location
add home address
add office address
add work address
add a new address
save new address
save address
add delivery location
create new address
set up address
enter new address
i want to add address
add another address
add one more address
add second address
add different address

### UPDATE ADDRESS
update address
edit address
change address
modify address
update my address
change my address
update home address
update office address
change pincode
update pincode
change zip code
update zip
change city
update city
change street
update street name
address correction
correct my address
fix address
address update
address change
new address details
different address info

### DELETE ADDRESS
delete address
remove address
delete home address
remove office address
delete saved address
remove saved location
delete delivery address
remove address from list
take off address
delete address number 1
remove address 1
delete first address
get rid of address

### SET DEFAULT ADDRESS
set default address
make default
default address
set as default
primary address
my primary address
main address
primary delivery
use this as default
this is my main address
make it primary
mark as default
use as primary
home as default
office as default

### Voice/Informal
add my home address please
my address is wrong
wrong address saved
address is incorrect
wrong address
update it please
delete the old address
i don't live there anymore
moved to new place
new location
moved
new home address
new office address
deliver to new address
save my new address

### Typos
adress management
adres management
my adresses
add adress
deleet address
update adres
defualt address
dafault address
set defalt address
