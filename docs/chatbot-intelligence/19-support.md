# 19 — Support

## Goal
`SUPPORT` → maps to intents: `CREATE_TICKET`, `VIEW_TICKETS`, `ESCALATE`

## Description
User wants to report an issue, create a support ticket, view existing tickets, escalate a problem, or get help from a human agent.

## Action Mapping
| Intent | Action |
|--------|--------|
| `CREATE_TICKET` | Multi-step: subject → message → `SupportService.createTicket()` |
| `VIEW_TICKETS` | `SupportService.getCustomerTickets()` |
| `ESCALATE` | `SupportService.startLiveChatSession()` |

## Expected Entities
| Entity | Examples |
|--------|---------|
| `priority` | urgent, high, low |
| `subject` | damaged product, missing order, billing issue |

---

## 250+ Real-World Utterances

### CREATE TICKET
create ticket
open ticket
raise ticket
submit ticket
new ticket
support ticket
file complaint
raise complaint
report issue
report problem
i have a complaint
i have an issue
i have a problem
complaint
problem
issue
bug
incident
trouble
i need to report
please help me with an issue
i need to raise an issue
i need to file a complaint
help with my problem
report a problem
customer complaint
lodge complaint
file a report
register complaint
submit complaint
submit issue
open support case
raise support case

### SPECIFIC SUPPORT SCENARIOS
my order is missing
my order never arrived
wrong item delivered
item arrived damaged
product is defective
product not working
billing error
overcharged
charged twice
duplicate charge
payment issue
payment problem
incorrect invoice
wrong price charged
missing refund
refund not received
refund delayed
return not processed
exchange not done
delivery problem
delivery issue
courier problem
tracking not updating
tracking issue
account problem
account locked
can't login
login issue
password problem
can't access account
account suspended
account blocked
item quality issue
quality complaint
product complaint
packaging damaged
packaging issue

### VIEW TICKETS
my tickets
view tickets
show tickets
ticket status
ticket list
all tickets
ticket history
open tickets
pending tickets
resolved tickets
closed tickets
my support tickets
my complaints
my issues
my cases
ticket number
ticket id
check ticket status
ticket update
any response on ticket
has my ticket been resolved

### ESCALATE
escalate
escalate issue
escalate complaint
escalate ticket
escalate problem
i want to escalate
need escalation
urgent issue
urgent problem
this is urgent
emergency
critical issue
need immediate help
need urgent help
help immediately
asap
right now
immediately
this needs to be fixed now
this is serious
serious issue
severity high
priority high

### Voice/Informal
yo i have a problem
hey help me with this
bro something is wrong
sis there's an issue
this is messed up
something went wrong
not right
not working right
things went wrong
need to complain
want to complain
gotta complain
have to report
must report this
so frustrated
this is wrong
this is unfair
fix this
please fix this
help please
please help now

### Typos
crate ticket
ceate ticket
submitt ticket
raisse ticket
compliant
complint
probem
isseu
tickt
view ticktes
ticket statuss
