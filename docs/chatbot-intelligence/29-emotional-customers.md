# 29 — Emotional Customers

## Goal
`EMOTIONAL_HANDLING` → Acknowledge emotion → Offer appropriate resolution

## Description
Users express emotions — anger, frustration, disappointment, urgency, sadness, excitement, confusion. The bot must detect emotional tone and respond with empathy before resolving the issue.

## Emotional Response Strategy
1. ACKNOWLEDGE the emotion ("I understand your frustration")
2. APOLOGIZE if warranted ("I'm sorry you had this experience")
3. OFFER immediate resolution path
4. Escalate to live agent if emotion is severe
5. NEVER be dismissive or mechanical

## Emotion → Intent Mapping
| Emotion | Primary Intent |
|---------|---------------|
| Angry (order) | `TRACK_ORDER` or `CREATE_TICKET` or `LIVE_AGENT` |
| Frustrated (product) | `RETURN_ORDER` or `CREATE_TICKET` |
| Urgent | `LIVE_AGENT` |
| Confused | `HELP` |
| Happy/Excited | `RECOMMEND` or continue flow |
| Sad (disappointment) | `CREATE_TICKET` with high priority |

---

## 300+ Emotional Utterances

### ANGRY CUSTOMERS
this is ridiculous
this is unacceptable
this is outrageous
this is disgraceful
i am furious
i am livid
i am beyond angry
i am so angry
extremely angry
absolutely furious
very upset
deeply upset
this is a scam
you scammed me
i've been cheated
i've been robbed
taking money for nothing
you took my money
charged my card but no delivery
fraud
this is fraud
you're cheating customers
terrible service
worst experience
worst service ever
horrible experience
terrible experience
never buying again
i'm never shopping here again
i will never use this again
leaving a bad review
reporting you
calling consumer court
consumer complaint
legal action
this is illegal
taking legal action
this won't go unpunished
demand a refund immediately
give me my money back now
i want a refund right now
immediate refund
refund or i dispute
i will dispute this charge
i will chargeback
bank dispute
unbelievably bad service
incompetent service

### FRUSTRATED CUSTOMERS
very frustrated
so frustrated
extremely frustrated
beyond frustrated
i'm frustrated
frustrated with this
i've been waiting for days
i've been waiting for weeks
it's been 10 days
still no delivery
still no product
no one is helping
nobody responds
no response from support
silence from your end
completely ignored
feeling ignored
my complaint was ignored
my issue was ignored
no resolution yet
problem still not fixed
still the same problem
this keeps happening
it happened again
same problem again
this is the third time
recurring issue
issue not resolved
unresolved issue
i've contacted support multiple times
multiple complaints
multiple tickets
nothing is done
nothing has been done
nothing gets fixed
wasting my time
you're wasting my time
this is a waste of my time
annoying service
this is annoying
so annoying
not acceptable
not good enough
below standard
poor service
bad service
bad customer service
unsatisfied
very unsatisfied
extremely unsatisfied
not happy at all
unhappy customer
unhappy with service

### DISAPPOINTED CUSTOMERS
very disappointed
deeply disappointed
extremely disappointed
i'm disappointed
disappointed with this
this let me down
let down by this
not what i expected
didn't meet expectations
expectations not met
below expectations
far below what was promised
not what was advertised
misleading advertisement
false advertising
product doesn't match description
product quality is terrible
terrible quality
quality is awful
quality is poor
not worth the money
waste of money
lost money
bad investment
regret buying this
i regret this purchase
wish i hadn't bought this
should have read reviews
bad decision to buy
won't recommend to anyone
not recommending
negative recommendation
telling everyone to avoid
telling friends to avoid

### CONFUSED CUSTOMERS
i'm confused
so confused
very confused
totally confused
completely confused
extremely confused
don't understand
can't figure this out
not sure what to do
clueless
lost
overwhelmed
too complicated
this is complicated
this is complex
makes no sense
doesn't make sense
can't make sense of this
instructions not clear
steps not clear
process is unclear
unclear instructions
confusing process
confusing steps
i followed the steps but nothing happened
i did what you said but it didn't work
not working as expected
not working as described
i think i did it wrong
made a mistake
did something wrong by accident
accidentally did something
don't know how to fix this
need step by step
need a guide
need clearer instructions
more help please
need more explanation

### EXCITED / HAPPY CUSTOMERS
this is amazing
love this
i love shopping here
great service
excellent service
awesome experience
fantastic service
best shopping experience
loving this
really happy
very happy
extremely happy
so glad i found this
so glad you have this
perfect
exactly what i wanted
exactly what i needed
this is exactly it
you're amazing
you're the best
this bot is helpful
super helpful bot
love the chatbot
the assistant is great
great recommendation
loved the suggestion
exactly what i was looking for
found what i needed
so excited
very excited
can't wait
can't wait to receive it
can't wait for delivery
excited to get it
thrilled

### URGENT / EMERGENCY
urgent
emergency
asap
immediately
right now
need help now
help me now
can't wait
no time to wait
time sensitive
very urgent
critically urgent
need resolution immediately
fix this now
this needs immediate attention
dropping everything for this
this is my priority
first priority
top priority
must be solved today
needs to be solved today
must fix asap
this can't wait
there's no time
i have limited time
fix before tonight
fix before tomorrow
i'm leaving tomorrow
i'm traveling tomorrow
need before travel
need delivery today
need today
today delivery
by tonight
very time sensitive
racing against time

### EMPATHY-NEEDING SITUATIONS
gift that arrived damaged
ordered for someone's birthday, it's ruined
it was a gift, now it's ruined
ordered for a special occasion
ordered for my wedding
ordered for the baby shower
ordered as a surprise, now ruined
i'm embarrassed to give this as a gift
family is waiting for delivery
sick relative waiting for medicine
waiting for important equipment
equipment needed for work
urgent work requirement
job depends on this
health depends on this
medical use
needed for medical purposes
it's not just a product, it's important
it means a lot to me
emotional purchase
sentimental item
it was supposed to be special
