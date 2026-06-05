# 25 — Fallback Handling

## Goal
`FALLBACK` → maps to intent: `UNKNOWN` with recovery logic

## Description
When the bot cannot confidently classify an intent, it must recover gracefully rather than saying "I don't understand". The bot should always offer relevant suggestions.

## Recovery Strategy
1. Partial match → suggest closest intent
2. Product-like words → assume `SEARCH_PRODUCT`
3. Order-related words → assume `TRACK_ORDER` or `VIEW_ORDERS`
4. Anger/frustration → acknowledge + offer `CREATE_TICKET` or `LIVE_AGENT`
5. Completely unknown → offer capability menu (HELP)

## Response Templates
- Level 1 (near match): "Did you mean [intent]? [Suggestion chips]"
- Level 2 (vague): "I can help you with [categories]. Which one fits?"
- Level 3 (totally unknown): "I'm not sure what you need! Here's what I can help with..."

## NEVER Say
- "I don't understand"
- "I can't help with that"
- "Invalid input"
- "Error processing request"
- "Not supported"

---

## 200+ Fallback-Triggering Utterances

### Completely Vague
ok
okay
sure
yes
no
maybe
whatever
anything
something
never mind
forget it
doesn't matter
hmm
hm
ok then
alright
well
so
and
but
because
just
only
still
yet
though
although
however
furthermore
additionally

### Too Short to Classify
hi
hey
hello
yo
sup
ok
k
y
n
mm
uh
ah
oh
huh
wow
cool
nice
great
good
bad
sad
mad
fine
done
ready
set
go
yes
no
maybe
sure
nope
yep

### Incomplete Sentences
i want to
i need to
can you
please
looking for a
i'm trying to
how do i
what is
where is
when is
who is
which is
tell me
show me
help with
i have
i got

### Brand/Product Without Context
samsung
apple
sony
nike
adidas
puma
dell
hp
lenovo
iphone
galaxy
airpods
oneplus
xiaomi
realme
oppo
vivo

### Confusing / Mixed Signals
buy and return
track but cancel
checkout and refund
compare and buy
search and compare and checkout
everything
do everything
all of it
do all
help with all
handle everything
the whole thing
multi-task
multiple things
few things
one more thing
several things
also

### Random / Off-Topic
what's the weather
tell me a joke
what time is it
who invented this
what is this company
history of this store
who is the owner
company info
about us
contact info
address of company
phone number of company
email of company
store location
nearest store
physical store
visit your store
store hours

### Error-Like User Inputs
???
!!!
...
------
######
null
undefined
error
bug
glitch
crash
broken
not working
doesn't load
won't open
can't see
blank page
white screen

### Philosophical / Testing
are you real
are you a bot
are you human
do you have feelings
what's your name
who made you
what are you
are you ai
are you smart
can you think
do you learn
do you remember
