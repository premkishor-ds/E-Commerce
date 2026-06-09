## Goal
`CANCEL_ORDER` → maps to intent: `CANCEL_ORDER`

## Description
Cancel an order.

## Action Mapping
CancelOrderAction

## Expected Entities
| Entity | Examples |
| `orderId` | ORD-12345, ORD-ABCDE |

## Clarification Rules
| Missing Entity | Clarification |
| `orderId` | "Please specify the order ID you wish to cancel." |

## Utterances
cancel order
please cancel my order
cancel this order
cancel ORD-12345
