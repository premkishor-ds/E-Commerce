# 33 — Unknown Queries

## Goal
`UNKNOWN_RECOVERY` → Never say "I don't understand". Always recover.

## Description
When a query is completely unclassifiable, the bot must offer graceful recovery options rather than a dead end. The bot should guide users back to useful actions.

## Recovery Levels
| Level | Condition | Response |
|-------|-----------|----------|
| 1 | Has partial entity (brand/product) | Assume SEARCH_PRODUCT |
| 2 | Has action word but unclear | Ask targeted question |
| 3 | Emotional tone detected | Acknowledge + offer support |
| 4 | Completely random | Show capability menu |
| 5 | Off-topic | Politely redirect |

## Recovery Response Template
"I'm not quite sure what you need, but I can help you with:
- 🔍 Search & buy products
- 📦 Track & manage orders
- 🛒 Cart & checkout
- 🎫 Support & returns
What would you like help with?"

---

## 200+ Unknown Query Examples

### Completely Off-Topic
what's the weather today
tell me a joke
who is the president
what's 2 + 2
what's the capital of france
play music
set a reminder
set an alarm
read my email
send an email
call someone
what movies are playing
recommend a restaurant
what time is it
book a flight
book a hotel
translate this
define the word
what is gravity
explain quantum physics
what is the meaning of life
write a poem
write me a story
who won the game
sports score
football results

### Gibberish / Random
asdfgh
qwerty
zxcvbnm
123456
aaabbbccc
random text
testing 123
hello world
foo bar
abcde
xyz
blah blah
yada yada
something something
idk lol
omg wtf
lmao idk
hahaha
lol
xd
:)
:/
:(
;)
:D

### Philosophical / Existential
are you conscious
do you feel things
what is happiness
what is the purpose of shopping
why do we buy things
money is the root of all evil
capitalism
materialism
what's the point
what's the point of all this
life is short
is this worth it
nothing matters
everything is temporary

### Testing the Bot
test
testing
test 1
test 2
can you hear me
is this working
hello is anyone there
is the bot online
bot check
bot status
are you there
are you online
you there
anyone there
working?
hello?
hello hello
is this thing on
echo test
ping

### Incomplete / Cut-off
i want to
i need
can you
please
looking for
trying to
want to buy a
i need to get a
help me find a
show me a
add the
remove the
check my
view my
track the
where is the

### Slang / Coded Language
yolo
fomo
brb
gtg
gg
wp
imo
imho
tbh
idk
lol
omg
wtf
smh
ngl
nvm
ikr
irl
afk
bbl

### Multiple Unrelated Words
phone wallet order
search buy return
cart checkout wallet loyalty
product order address profile
samsung apple sony
help help help help
order order order

### Empty or Near-Empty
(empty message)
   
.
..
...
-
_
*
/
\
|

### Repeated Characters
aaaa
bbbb
hhhh
yyyyyy
nnnnn
eeeee
oooooo
aaaaaa help
pleeeeease
heeeelp
heeey
loooool

### Random Questions About the Store
how long have you been open
when was this store founded
who owns this store
where are you located
what country are you in
what currency do you accept
do you ship internationally
international shipping
do you have a mobile app
app download
apple store
google play
do you have an affiliate program
do you have a loyalty program
do you offer bulk orders
b2b orders
wholesale
corporate orders
