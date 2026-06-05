# 24 — Voice Commerce

## Goal
`VOICE_COMMERCE` → maps to multiple intents based on spoken/voice-style input

## Description
Voice-style queries are typically shorter, more casual, use pronouns (it/this/that), incomplete sentences, and natural speech patterns. The bot must infer context from conversation history.

## Key Characteristics
- Short incomplete phrases
- Pronoun references ("it", "this", "that one")
- Action words without subject ("buy it", "add it", "track it")
- Contractions and informal language
- Number references ("show first one", "the second one")

## Strategy
1. Use conversation memory to resolve pronouns
2. Last mentioned product = "it" / "this" / "that"
3. Last shown list item + number = specific product
4. "The first one" = results[0], "the second" = results[1]

---

## 200+ Voice-Style Utterances

### Product Reference by Pronoun
buy it
add it
get it
i'll take it
take it
want it
buy this
add this
get this
i'll take this
take this
i want this one
i'll go with this
this one
that one
the other one
the second one
the first one
show first one
show second one
show the third one
show number two
number one please
option 1
option 2
the blue one
the black one
the cheaper one
the expensive one
the better one
the lighter one
the one with more ram
the one with 256gb
the samsung one
the apple one

### Short Commands
show it
details please
tell me more
more info
specs
reviews
add it to cart
buy now
add to cart
checkout
order it
track it
cancel it
return it
exchange it
refund it
show warranty
show specs
show colors
show sizes
show variants
compare them
compare both
which is better
add to wishlist
save it
heart it

### Contextual Follow-ups
how about this one
what about this
and this one
also this one
show me the next one
any more
more options
different ones
others
another one
show another
how about the cheaper one
and the other option
this or that
one or two
yes this one
no the other one
i'll think about it
maybe later
remind me about this
save this

### Natural Conversation
okay add that to my cart
can you add that for me
yeah buy the first one
go ahead add it
yeah go with that
add all of them
add both
add the first two
grab both
get all three
put both in cart
yep all good add it
confirm add
yes add please
add please
please add
add it please

### Voice Action Shortcuts
open my cart
show my cart
quick checkout
fast checkout
express checkout
place order fast
quick order
confirm order now
order right now
pay right now
complete purchase
done add it
done buying it
buy everything
buy all
get all

### Natural Questions (Voice)
how much is it
how much does it cost
what's the price
is it available
can i get it today
will it come fast
what colors does it come in
does it come in black
is there a cheaper option
is there a discount
any coupon for this
can i pay by cod
any offer on this
is this the latest model
is it new
is it in stock
can i return it
what if i don't like it
is it a good buy
is it worth it
