# Return Management System (RMA) Report

This report outlines the customer return and refund workflow.

---

## 1. RMA Status Lifecycle
The system monitors return requests using the following workflow:
`Requested` ➔ `Approved` ➔ `Pickup Scheduled` ➔ `Received` ➔ `Inspected` ➔ `Refunded` / `Rejected`

---

## 2. Inspections & Logistics
- **Inspection Auditing**: Supports upload of media proof (images/videos) of damaged items before approval.
- **Refund Gateways**: Automatically triggers Stripe/Razorpay refunds or credits the Customer's local platform wallet upon approval.
