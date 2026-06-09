# Advanced Payment & Accounting Report

This report documents the Stripe/Razorpay integrations, double-entry accounting ledger, and automated settlement engine.

---

## 1. Gateway & Wallet Splits
- **Split Payments**: Automatically divides payment amounts between platform commissions, seller revenue, and vendor parts.
- **Escrow Settlements**: Holds settlement payments until the return/refund period expires.
- **Platform Wallet**: Supports top-ups, debiting for purchases, and partial refunds directly back to the wallet.

---

## 2. Double-Entry Ledger System
- Every transaction creates immutable balancing entries (Debit Cash / Credit Revenue, etc.) in the `ledgerentries` collection.
- Calculates GST and local taxes during checkout and logs tax details for tax auditing.
