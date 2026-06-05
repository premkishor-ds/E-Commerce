# 20 — Live Agent

## Goal
`LIVE_AGENT` → maps to intent: `LIVE_AGENT` (alias `ESCALATE`)

## Description
User wants to connect to a human support representative for real-time chat.

## Action Mapping
`LIVE_AGENT` → `SupportService.startLiveChatSession()` → WebSocket live chat

## Clarification Rules
- Not logged in → Ask to login first
- Already in live session → Route messages to live agent directly

---

## 200+ Real-World Utterances

### Direct Live Agent Requests
live agent
live chat
talk to agent
speak to agent
connect to agent
reach agent
get agent
human agent
human support
talk to human
speak to human
connect to human
human please
real person
real person please
agent please
i want a human
i want to speak to someone
i need a real person
i need human support
connect me to support
put me through to support
transfer to agent
transfer to human
put me in queue
agent queue
support queue

### Frustrated / Urgent Agent Requests
i want to talk to a person
just give me a human
stop the bot give me a human
i don't want bot help
bot isn't helping
the bot can't fix this
need a real person now
put me through to someone
someone help me please
a real agent please
i insist on human help
bot is useless give me agent
the chatbot doesn't understand
escalate to human
escalate me
human intervention needed
i need proper support
proper support please
professional support

### Polite Requests
could you connect me to a live agent
may i speak with a support agent
is there a human i can talk to
can i chat with someone
is there a live support option
do you have live support
live support please
connect me please

### Voice/Informal
yo get me an agent
hey human please
bro connect me to someone
transfer me
put me through
get someone on the line
get a human on this
let me talk to a person
enough bot, human now
done with bot, need human
agent immediately
now please
right now
urgent human
need help now
escalate now

### Post-Bot Frustration
bot keeps failing
bot doesn't understand
bot is not helping
chatbot useless
this bot is dumb
this bot doesn't get it
chatbot giving wrong answers
bot wrong
incorrect bot response
wrong answer bot
bot keeps saying same thing
not useful bot
unhelpful bot
tired of bot
done with bot
done talking to bot
want human not bot
bypass bot
skip the bot

### Typos
live agnt
live aget
liev agent
humn support
humna agent
talkk to agent
conect agent
real persn
human pleas
escalte
conect to human
