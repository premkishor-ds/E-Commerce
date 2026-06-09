# Order Management System Report

This report outlines the implemented enterprise Order Management System (OMS).

---

## 1. Order Lifecycle
The system enforces the following states and transitions:
`Draft` ➔ `Pending Payment` ➔ `Confirmed` ➔ `Processing` ➔ `Packed` ➔ `Shipped` ➔ `Out For Delivery` ➔ `Delivered` ➔ `Cancelled` ➔ `Returned` ➔ `Refunded`

All state transitions are logged with timestamps and operator IDs inside the `statusHistory` property of the `Order` schema.

---

## 2. Platform Controls
- **Admin**: Has absolute authority to `Force Cancel` orders, override shipping providers, and trigger manual refunds.
- **Seller**: Controls picking, packing, label printing, and courier confirmation.
- **Vendor**: Manages supply chains and updates stock status for purchase orders.

---

## 3. Invoices and Tracking
- Automatic invoice generation upon successful payment processing.
- Multi-carrier shipment tracking updates via background webhooks.
