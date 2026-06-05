# 35 — Conversation Recovery

## Goal
`CONVERSATION_RECOVERY` → Get stuck conversations back on track

## Description
When a conversation reaches a dead end, the user abandons a flow, or the bot gives a wrong response, it must proactively recover the conversation.

## Recovery Triggers
1. User types "no/cancel" mid-flow → exit flow, suggest alternatives
2. User goes silent for 3+ turns without progress → proactive prompt
3. Bot gives irrelevant response → user says "wrong" / "that's not what I meant"
4. Flow error → graceful error + alternative path
5. User says "start over" → reset flow, return to GREET

## Recovery Response Templates

### Gentle Recovery
"Let me start fresh. What are you looking for today? 🛒"

### Error Recovery
"Oops, something went wrong on my end. Let me try again or connect you with a human agent."

### Flow Abandonment Recovery
"No worries! You can always come back. Here's what I can help you with: [suggestions]"

### Correction Recovery
"Got it, let me correct that! What did you actually mean?"

---

## 200+ Recovery-Triggering Utterances

### Restart / Reset Requests
start over
restart
start fresh
restart conversation
reset chat
reset conversation
new conversation
fresh start
begin again
go back to beginning
beginning
from the start
from scratch
clean slate
wipe slate
forget everything
forget all that
ignore what i said
disregard previous
pretend i didn't say that
undo
undo all
undo last
go back
go back to start
back to menu
back to home
back to beginning
main menu
home
homepage

### Correction Requests
that's wrong
that was wrong
no that's not it
not what i said
not what i meant
misunderstood
you misunderstood
bot misunderstood
wrong interpretation
incorrect interpretation
wrong intent
wrong answer
incorrect answer
you got it wrong
totally wrong
completely wrong
off track
way off
missed the point
missed what i said
not even close
way off base
misread my message
misread the request
read it wrong
took it the wrong way
interpreted wrong

### Abandonment Signals
never mind
forget it
doesn't matter
leave it
leave this
leave that
let it be
not important
not urgent anymore
changed my mind
i'll do it later
maybe some other time
not now
later
not today
another time
skip this
skip it
forget about it
abandon
abandon this
i'm done with this
done talking
done here
thanks bye
bye
goodbye
see ya
later
i'm leaving
signing off
done for now
till later
catch you later
ttyl

### Confusion Recovery
i'm lost
totally lost
confused
very confused
i don't get it
lost track
what are we doing
what just happened
what happened
where were we
what was i doing
i forgot what i was doing
i lost my place
where did we leave off
pick up where we left off
continue from where
resume where we left
resume previous
let's resume
resume chat
pick up the chat
continue our conversation
continuing from before

### Graceful Error Recovery
something went wrong
it broke
it crashed
not working
try again
can you retry
retry that
please try again
error occurred
getting an error
error message
showing error
technical issue
technical problem
something technical
backend error
server error
500 error
connection error
can't process
failed to load
didn't load
page error
something is off
something is broken

### Out-of-Flow Recovery
i'm in the middle of something else
i got distracted
came back
i went away
i was busy
back now
i'm back
sorry was away
sorry for the wait
sorry for delay
sorry for interruption
interrupted
let me continue
continuing
where was i
where were we
back on topic
back to main thing
back to what we were discussing
getting back on track
back on track

### Proactive Suggestions (Bot Recovery Responses)
# These are example BOT recovery messages the bot should know to offer:
Can I help you find a product?
Want to track an order?
Need help with your account?
Looking for support?
Want to browse products?
Would you like to see trending items?
Can I search something for you?
Want to continue checkout?
Should I show your cart?
Want to apply a coupon?
Shall I connect you with a live agent?
Would you like to see your order history?
Want to go back to the main menu?
Can I suggest something based on your history?
Shall we start from the beginning?
