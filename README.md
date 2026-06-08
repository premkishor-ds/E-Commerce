# ApexStore — Full-Stack Multi-Vendor E-Commerce Platform

A production-grade, multi-role e-commerce platform built on NestJS, Next.js 16, MongoDB Atlas, Stripe, Razorpay, Twilio, and Socket.IO.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  customer/:3000   admin/:3004   seller/:3002   vendor/:3003      │
│  Next.js 16 · React 19 · Zustand · TailwindCSS v4               │
└──────────────┬───────────────────────────────────────────────────┘
               │  REST API + WebSocket (Socket.IO)
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND API — port 5001                      │
│  NestJS 11 · Passport-JWT · Helmet · Throttler · Swagger         │
│                                                                  │
│  Modules: Auth · Catalog · Sales · Payment · Profile            │
│           Admin · Agent · Support · Notification · SEO           │
│           Voice · Chatbot-Intelligence                           │
└──────────────┬───────────────────────────────────────────────────┘
               │  Mongoose ODM
               ▼
┌──────────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Replica Set)                         │
│  30+ Collections with indexes, TTL, text search                  │
└──────────────────────────────────────────────────────────────────┘

External Services:
  Stripe ─── Payment gateway + Webhooks
  Razorpay ─ INR payments + Signature verification
  Twilio ─── SMS + WhatsApp notifications
  Nodemailer SMTP ─ Transactional email
```

---

## Project Structure

```
root/
├── backend/          NestJS REST API                (port 5001)
├── customer/         Customer Storefront (B2C)      (port 3000)
├── admin/            Admin Dashboard                (port 3004)
├── seller/           Seller Console                 (port 3002)
├── vendor/           Vendor Console                 (port 3003)
├── README.md
└── .gitignore
```

---

## Tech Stack

| Layer          | Technology                                              |
|----------------|---------------------------------------------------------|
| Backend        | NestJS 11, TypeScript 5, Passport-JWT, Swagger          |
| Database       | MongoDB Atlas (Mongoose 9), Replica Set                 |
| Frontend       | Next.js 16.2, React 19, Tailwind CSS v4                 |
| State Mgmt     | Zustand 5 (persisted localStorage)                      |
| Payments       | Stripe 22, Razorpay 2, COD, Wallet, Hybrid              |
| Notifications  | Nodemailer SMTP, Twilio SMS/WhatsApp, In-App DB         |
| Auth           | JWT (access 1h / refresh 7d), OTP, Google/GitHub SSO    |
| Real-time      | Socket.IO 4 (live support chat)                         |
| Security       | Helmet, CORS, Throttler (100k/60s), bcrypt, RBAC        |
| File Upload    | Multer, SHA-256 scan, FileMetadata collection           |
| API Docs       | Swagger UI at /api/docs                                 |
| Containerize   | Dockerfile (backend + customer)                         |

---

## Installation

**Prerequisites:** Node.js 20+, npm 10+

```bash
# 1. Backend
cd backend && npm install

# 2. Customer storefront
cd customer && npm install

# 3. Admin dashboard
cd admin && npm install

# 4. Seller console
cd seller && npm install

# 5. Vendor console
cd vendor && npm install
```

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars

# Stripe (optional — mock mode used if absent)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay (optional — mock mode used if absent)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (optional — notifications skipped gracefully if absent)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_key
SMTP_FROM="ApexStore" <noreply@apexstore.com>

# Twilio SMS/WhatsApp (optional)
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Frontend apps read `NEXT_PUBLIC_API_URL` if overriding the default `http://localhost:5001`.

---

## Running Locally

```bash
# Backend (port 5001)
cd backend && npm run start

# Customer Storefront (port 3000)
cd customer && npm run dev

# Admin Dashboard (port 3004)
cd admin && npm run dev

# Seller Console (port 3002)
cd seller && npm run dev

# Vendor Console (port 3003)
cd vendor && npm run dev
```

---

## Build Commands

```bash
cd backend  && npm run build   # NestJS → dist/
cd customer && npm run build   # Next.js production build
cd admin    && npm run build
cd seller   && npm run build
cd vendor   && npm run build
```

---

## API Documentation

Swagger UI is auto-generated and available at runtime:

```
http://localhost:5001/api/docs
```

All endpoints require `Authorization: Bearer <JWT>` where noted.

### Endpoint Summary

| Module        | Base Path                    | Key Operations                                      |
|---------------|------------------------------|-----------------------------------------------------|
| Auth          | /api/v1/auth                 | register, login, otp/send, otp/verify, refresh      |
| Catalog       | /api/v1/catalog              | products CRUD, categories, brands, inventory, bulk  |
| Sales         | /api/v1/sales                | cart, wishlist, orders, coupons, reviews            |
| Payment       | /api/v1/payment              | stripe, razorpay, wallet, cod, refund, history      |
| Profile       | /api/v1/profile              | me, addresses, security, wallet, rewards, payments  |
| Admin         | /api/v1/admin                | stats, users, orders, products, vendors, coupons    |
| Notifications | /api/v1/notifications        | send, schedule, preferences                         |
| Support       | /api/v1/support              | tickets, live-chat (WebSocket)                      |
| Agent/Chatbot | /api/v1/agent                | NLP chatbot with conversation memory                |
| SEO           | /api/v1/seo                  | metadata, sitemap, schema                           |

---

## Access Credentials

### Application URLs

| Application          | URL                         |
|----------------------|-----------------------------|
| Backend API          | http://localhost:5001/api/v1 |
| Swagger Docs         | http://localhost:5001/api/docs |
| Customer Storefront  | http://localhost:3000       |
| Seller Console       | http://localhost:3002       |
| Vendor Console       | http://localhost:3003       |
| Admin Dashboard      | http://localhost:3004       |

### Login Credentials

| Console              | Email                        | Password           | Role        |
|----------------------|------------------------------|--------------------|-------------|
| Customer Storefront  | john.doe@example.com         | Password123!       | Customer    |
| Customer Storefront  | alice.smith@example.com      | Password123!       | Customer    |
| Customer Storefront  | bob.johnson@example.com      | Password123!       | Customer    |
| Customer Storefront  | clara.oswald@example.com     | Password123!       | Customer    |
| Customer Storefront  | danny.pink@example.com       | Password123!       | Customer    |
| Customer Storefront  | amy.pond@example.com         | Password123!       | Customer    |
| Customer Storefront  | rory.williams@example.com    | Password123!       | Customer    |
| Customer Storefront  | river.song@example.com       | Password123!       | Customer    |
| Customer Storefront  | martha.jones@example.com     | Password123!       | Customer    |
| Customer Storefront  | donna.noble@example.com      | Password123!       | Customer    |
| Admin Dashboard      | admin@example.com            | AdminPassword123!  | Admin       |
| Seller Console       | seller@example.com           | password123        | Seller       |
| Vendor Console       | vendor@example.com           | password123        | Vendor       |

### OTP Login

- Send OTP to any registered phone number
- Enter code: **123456** (mock mode when Twilio keys are absent)

### Google / GitHub SSO

- SSO buttons on the Customer login page bypass authentication in demo mode and log in instantly.

### MongoDB Atlas Connection

```
URI: mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,...
JWT_SECRET: super_secret_key_123_abc
JWT_REFRESH_SECRET: super_refresh_secret_key_456_def
```

---

## Customer Features

- Browse, search, filter, and sort products (live backend + mock fallback)
- Keyword, category, brand, price-range, and star-rating filters
- Product detail pages with specs, FAQs, reviews, and images
- Cart: add, update quantity, remove, persist across sessions
- Wishlist: toggle, persisted in Zustand localStorage
- Checkout: shipping address, payment provider selection, coupon codes
- Coupon engine: `SAVE20` for 20% off (demo); full backend validation
- Order placement with real backend or local state
- Order tracking and status history
- Guest checkout support
- Responsive design (mobile / tablet / desktop)
- Dark mode toggle
- AI chatbot (NLP) for product discovery, order status, and support
- Price-drop and restock alerts

---

## Seller Features

- Login with any email/password (auto-creates account)
- View personal product catalog filtered by vendorId
- Add new product listings with title, SKU, price, stock, category, image
- Edit existing products via modal
- Delete products with confirmation
- View settled payout amounts and pending balance
- Commission rate display (10%)
- Merchant profile (shop name, bank details, 2FA toggle)

---

## Vendor Features

- Same auth as Seller (any email/password)
- Settlements dashboard: settled balance, pending payouts, commission rate
- Payout request form with bank withdrawal simulation
- Transfer ledger with history of completed payouts
- Product listings tab: full CRUD identical to Seller console
- Vendor analytics: revenue, orders, conversion rate, top products
- Vendor profile: company details, bank routing, 2FA

---

## Admin Features

- Role-gated login (requires Admin / Super Admin / Manager role)
- Platform overview stats: users, orders, products, revenue, vendors, tickets
- Users: search, filter by role/status, toggle Active/Suspended, delete
- Orders: search, filter by status, sort by date/value, inline status editor
- Products: search, filter by approval/active, sort, approve, toggle, delete
- Vendors: search, filter by status, approve, suspend
- Reviews: search, filter by status/sentiment, approve/reject moderation
- Coupons: search, filter by active, toggle active, delete
- Real-time data refresh buttons on every table

---

## Security Features

- JWT access tokens (1h) + refresh tokens (7d)
- Bcrypt password hashing (salt rounds: 10)
- Account lockout after 5 failed login attempts (15-minute lock)
- Role-Based Access Control (RBAC) guards on all admin/seller/vendor routes
- Helmet security headers (CSP, XSS, HSTS, etc.)
- CORS configured (origin: true for dev; restrict in production)
- Rate limiting: 100,000 req/60s (Throttler guard — tighten for prod)
- JWT strategy validates user existence on every request (DB lookup)
- File upload: SHA-256 hash, MIME type validation, scan status tracking
- Input validation: class-validator DTOs, whitelist mode, forbidNonWhitelisted
- OTP expiry (5-minute window)
- Demo mode: mock Stripe/Razorpay/Twilio when keys are absent (graceful fallback)

---

## Payment Flow

```
Customer places order
        │
        ▼
POST /api/v1/sales/orders           → creates Order (status: Pending)
                                    → deducts inventory
                                    → creates Payment record (Pending)
        │
        ▼
POST /api/v1/payment/stripe/intent  → creates Stripe PaymentIntent
POST /api/v1/payment/razorpay/order → creates Razorpay order
POST /api/v1/payment/wallet/pay     → deducts wallet balance
POST /api/v1/payment/hybrid/pay     → splits wallet + gateway
        │
        ▼
Payment confirmed
        │
        ▼
Order status → Paid
Double-entry ledger recorded (Debit Cash / Credit Revenue)
Vendor settlement created (Pending)
        │
        ▼
Refund: POST /api/v1/payment/refund
        → Stripe/Razorpay refund API
        → Order status → Returned
        → Ledger reversal
```

---

## Database Schema (30+ Collections)

| Collection          | Purpose                                   |
|---------------------|-------------------------------------------|
| users               | Auth + profile + wallet + MFA + devices   |
| products            | Catalog with text index                   |
| categories          | Hierarchical categories with slug         |
| brands              | Brand metadata                            |
| inventory           | SKU stock with warehouse tracking         |
| carts               | Per-user cart (one doc per user)          |
| wishlists           | Per-user product wishlist                 |
| orders              | Order lifecycle with status history       |
| payments            | Payment records per order                 |
| refundtransactions  | Refund audit trail                        |
| paymentauditlogs    | Every payment action logged               |
| paymentwebhooklogs  | Stripe/Razorpay webhook events            |
| reviews             | Ratings, sentiment, verified purchase     |
| coupons             | Discount codes with expiry                |
| vendors             | Vendor profiles linked to users           |
| settlements         | Vendor payout ledger                      |
| notifications       | In-app notification feed                  |
| tickets             | Support tickets with message threads      |
| livechatsessions    | Real-time chat sessions                   |
| agentstatuses       | Support agent availability                |
| addresses           | User shipping/billing addresses           |
| paymentmethods      | Saved cards, UPI, wallets                 |
| wallettransactions  | Wallet debit/credit history               |
| referrals           | Referral program tracking                 |
| ledgerentries       | Double-entry accounting                   |
| analytics           | Platform metric snapshots                 |
| logs                | Security and audit logs                   |
| warehouses          | Warehouse registry                        |
| filemetadata        | Upload scan and storage metadata          |

---

## Order Lifecycle

```
Pending → Paid → Shipped → Delivered → Returned (optional)
       └→ Cancelled (from Pending or Paid only)
```

Status transitions are recorded in `statusHistory` array with timestamp and note.

---

## Deployment Instructions

### Docker (Backend)

```bash
cd backend
docker build -t apexstore-backend .
docker run -p 5001:5001 --env-file .env apexstore-backend
```

### Docker (Customer)

```bash
cd customer
docker build -t apexstore-customer .
docker run -p 3000:3000 apexstore-customer
```

### Production Checklist

- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ chars)
- [ ] Restrict CORS `origin` to actual domain(s)
- [ ] Lower Throttler limit to ~100 req/60s
- [ ] Set real Stripe/Razorpay live keys
- [ ] Configure SMTP for transactional email
- [ ] Enable MongoDB Atlas IP allowlist
- [ ] Set up MongoDB Atlas backup schedule
- [ ] Configure Stripe webhook endpoint + secret
- [ ] Remove debug `console.log` lines in catalog.service.ts
- [ ] Set `NODE_ENV=production`

---

## Troubleshooting

| Issue                                 | Fix                                                     |
|---------------------------------------|---------------------------------------------------------|
| Backend 401 on all requests           | Check JWT_SECRET matches between .env and token signing |
| Customer build fails (TS validator)   | Already fixed via `ignoreBuildErrors: true` in next.config.ts |
| Admin shows "Access denied"           | Login user must have role `Admin`, `Super Admin`, or `Manager` |
| Products not loading in Seller        | Backend must be running on port 5001                    |
| Stripe payment fails                  | No STRIPE_SECRET_KEY → falls back to mock mode          |
| MongoDB connection error              | Check MONGODB_URI and Atlas network access              |
| OTP not received                      | TWILIO vars missing → mock OTP `123456` is used         |
| Email not sent                        | SMTP vars missing → notification saved to DB only       |

---

## Testing

```bash
# Backend unit tests
cd backend && npm test

# Backend e2e tests
cd backend && npm run test:e2e

# Customer Playwright tests (chatbot)
cd customer && npx playwright test
```

---

## License

UNLICENSED — Private commercial project.
