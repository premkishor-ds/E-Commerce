# Project Audit Report
## Enterprise Multi-Vendor E-Commerce Platform

This document presents the full project audit of the **ApexStore** full-stack multi-vendor e-commerce platform.

---

## 1. Route Map (Frontend Portals)

The platform is divided into four distinct Next.js frontend portals (running React 19, Next.js 16, Zustand 5, and TailwindCSS v4):

| Portal | Port | Directory Path | Key Routes / Subpages |
|---|---|---|---|
| **Customer Storefront** | `3000` | `customer/src/app` | `/`, `/auth`, `/checkout`, `/product`, `/profile`, `/search`, `/support`, `/wishlist` |
| **Seller Console** | `3002` | `seller/src/app` | `/page.tsx` (Monolithic Dashboard with Personal Product Catalog CRUD, Payout Requests, Merchant Profile, and 2FA settings) |
| **Vendor Console** | `3003` | `vendor/src/app` | `/page.tsx` (Monolithic Console featuring Settlements Dashboard, Payout Ledger, Product CRUD, and Company Analytics) |
| **Admin Dashboard** | `3004` | `admin/src/app` | `/page.tsx` (Monolithic Workspace with Platform Stats, User Management, Orders & Products approval, Audit/API/Security Logs Viewer, Settings, and Help Desk Tickets/Feedback moderator) |

---

## 2. API Map (NestJS Backend)

The NestJS backend runs on port `5001`. Below is the API route map, including endpoints, verbs, guards, and roles:

### Auth Module (`/api/v1/auth`)
*   `POST /register`: Registers a new user.
*   `POST /login`: Standard user login (locked out after 5 consecutive failures).
*   `POST /otp/send`: Generates and sends OTP SMS via Twilio (or mock mode fallback).
*   `POST /otp/verify`: Validates OTP code.
*   `POST /refresh`: Issues a new access token using a refresh token.

### Catalog Module (`/api/v1/catalog`)
*   `GET /products`: Query active products with pagination, filtering, and text search.
*   `POST /products` (Seller/Vendor/Admin): Adds a new product listing.
*   `PUT /products/:id` (Seller/Vendor/Admin): Edits product listing.
*   `DELETE /products/:id` (Seller/Vendor/Admin): Deletes product listing.
*   `GET /categories`: Retrieve category hierarchy.

### Sales Module (`/api/v1/sales`)
*   `GET /cart`: Fetch the current user's shopping cart.
*   `POST /cart`: Add/update items in the cart.
*   `POST /orders`: Place a new order (supports regular customers and guest checkout).
*   `GET /orders/:id`: Track order lifecycle and status history.
*   `POST /coupons/validate`: Verifies discount coupon (e.g., `SAVE20`).

### Payment Module (`/api/v1/payment`)
*   `POST /stripe/intent`: Create a Stripe PaymentIntent (mocked if credentials are missing).
*   `POST /razorpay/order`: Create a Razorpay order.
*   `POST /wallet/pay`: Pay using internal user wallet balance.
*   `POST /hybrid/pay`: Split payment between wallet and external gateways.
*   `POST /refund`: Initiates partial or full refunds.

### Profile Module (`/api/v1/profile`)
*   `GET /me`: Returns logged-in user profile, wallet balance, and membership level.
*   `PUT /me`: Updates personal profile and timezone preference.

### Admin Module (`/api/v1/admin`)
*   `GET /stats` (Admin/Super Admin): General platform analytics.
*   `GET /users` (Admin/Super Admin): User list with filtering/sorting.
*   `PUT /users/:id` (Admin/Super Admin): Modify user roles, status (Active/Suspended), or wallet balance.
*   `DELETE /users/:id` (Admin/Super Admin): Deletes user.
*   `GET /orders` (Admin/Super Admin): Retrieve and search all client orders.
*   `PUT /orders/:id/status` (Admin/Super Admin): Update order status inline.
*   `GET /products` (Admin/Super Admin): View catalog and approve/toggle listings.
*   `PUT /products/:id/approve` (Admin/Super Admin): Approve vendor product.
*   `GET /vendors` (Admin/Super Admin): Manage vendor profiles and approve/suspend status.
*   `GET /reviews` (Admin/Super Admin): Moderator review queue.
*   `PUT /reviews/:id/moderate` (Admin/Super Admin): Approve/reject a customer review.
*   `GET /settings/:category` (Admin/Super Admin): System configurations (General, Email, SMS, Storage, API).
*   `PUT /settings/:category` (Admin/Super Admin): Update system configuration.
*   `GET /audit-logs`, `/search-logs`, `/activity-logs`, `/chatbot-logs`, `/api-logs`, `/security-logs`, `/import-logs`, `/export-logs`, `/guest-logs`, `/change-history` (Admin/Super Admin): Multi-log viewing tables.
*   `PUT /logs/retention` (Admin/Super Admin): Purge old logs according to retention rules.

### Support & Chatbot Modules (`/api/v1/support`, `/api/v1/agent`)
*   `GET /support/tickets`: List user help tickets.
*   `POST /agent/query`: NLP Chatbot queries for discovery, order status, and FAQs.

---

## 3. Database Map (Mongoose Schema)

The platform is designed around **48 collections** defined within Mongoose schemas (`backend/src/schemas/schemas.ts`):

1.  **users**: Stores authentication credentials, password hashes, OTP codes, user roles (`Customer`, `Seller`, `Vendor`, `Admin`, `Super Admin`, etc.), wallet balances, referral records, and security details (MFA/lockouts).
2.  **categories**: Hierarchical categories with custom SEO tags and slugs.
3.  **brands**: Brand profiles with description and logos.
4.  **inventory**: Tracks SKU stock quantity (Available, Reserved, Incoming, Damaged) across warehouses with low-stock alerts.
5.  **products**: Catalog products with rating, view metrics, and vendor references. Text indices enabled on title, description, and tags.
6.  **carts**: Current user shopping carts.
7.  **wishlists**: Per-user product wishlist items.
8.  **coupons**: Promo discount codes, validation ranges, and expiry.
9.  **orders**: Order transactions with total price, items breakdown, shipping address, and `statusHistory`.
10. **payments**: Payment transaction records linked to orders.
11. **reviews**: Product ratings with verified purchase status, fake score validation, and sentiment analysis.
12. **tickets**: Support tickets and message threads.
13. **notifications**: In-app push notifications.
14. **logs**: Centralized operational logs.
15. **vendors**: Seller profiles with company details and bank routing.
16. **settlements**: Ledger of payouts to marketplace sellers and vendors.
17. **analytics**: Platform metric snapshots.
18. **addresses**: Customer shipping and billing address records.
19. **paymentmethods**: Saved cards, UPI virtual payment addresses, and wallets.
20. **wallettransactions**: Credits and debits history of customer wallets.
21. **referrals**: Referral program tracker.
22. **refundtransactions**: Audit log of gateway refunds.
23. **paymentauditlogs**: Low-level payment step logs.
24. **paymentwebhooklogs**: External payment webhook payloads.
25. **agentstatuses**: Support agent statuses (Online, Offline, Busy).
26. **livechatsessions**: Websocket-driven customer live support sessions.
27. **ledgerentries**: Double-entry accounting records (Debit Cash / Credit Revenue).
28. **warehouses**: Registered warehouses.
29. **filemetadata**: File validation storage metadata.
30. **adminsessions**: Tracks active admin sessions, client IPs, browser types, and suspicious events.
31. **systemsettings**: Key-value settings categorized by domain.
32. **auditlogs**: Enterprise operations audit log.
33. **searchlogs**: User search terms and result count tracking.
34. **activitylogs**: General tracking of customer/merchant activities.
35. **chatbotlogs**: AI queries, confidence levels, and intents.
36. **analyticscaches**: Aggregated caches for metrics.
37. **apilogs**: Request latency, response size, status, and endpoint details.
38. **securitylogs**: Tracks brute-force attacks, permission violations, and failed logins.
39. **loginlogs**: Tracks user authorization history.
40. **importlogs**: Bulk data import status.
41. **exportlogs**: Data export tracking.
42. **guestlogs**: Anonymous visitors tracking.
43. **changehistories**: Stores field-level diffs (Before/After) for changes made on key entities.
44. **feedbacktickets**: Handles feature requests, bug reports, and suggestions with priority and status.
45. **feedbackcomments**: Interactive comment thread on feedback tickets.
46. **feedbackattachments**: Files uploaded alongside feedback.
47. **feedbackvotes**: Upvotes from users.
48. **feedbackactivitylogs**: Audit trail for feedback status transitions.

---

## 4. Permission Map (RBAC)

RBAC is enforced via custom guards (`backend/src/auth/rbac.guard.ts`) and decorators (`@Roles(...)`):

*   **Super Admin / Admin**: Complete access to stats, user updates/deletion, order modifications, vendor profile approvals, logs, sitemaps, system settings, and customer reviews.
*   **Customer Support**: Authorized to view, assign, escalate, and resolve help tickets, moderate feedback tickets, and launch live chat sessions.
*   **Seller / Vendor**: Authorized to perform catalog CRUD operations, request settlements, and view personal sales analytics.
*   **Customer**: Authorized to view products, manage cart/wishlist, place orders, update profile/addresses, participate in referrals, and submit tickets/feedback.
*   **Guest**: Allowed to view the customer portal catalog and search queries.

---

## 5. Dependency Map

### Version Alignment:
*   **Node.js**: `20+`
*   **NestJS**: `11.x` (Backend)
*   **Next.js**: `16.2.x` (Frontend portals)
*   **React**: `19.x`
*   **Mongoose**: `9.x`
*   **Zustand**: `5.x`
*   **TailwindCSS**: `v4`

### Port Mappings:
*   **Backend REST API**: `5001`
*   **Customer Storefront**: `3000`
*   **Seller Console**: `3002`
*   **Vendor Console**: `3003`
*   **Admin Dashboard**: `3004`
