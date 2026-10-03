# Travelling Dreams

Premium travel portal for **hotel stays** and **holiday packages**, with partner branding for **LA Riqueza Hotels**. Built as a modern Next.js application with MySQL, suitable for local development (XAMPP) and production on **Hostinger Web App**.

**Repository:** [github.com/vishal4linux/travellingdreams](https://github.com/vishal4linux/travellingdreams)

---

## Features

### Public site
- Homepage with destinations, packages, hotels, offers, testimonials, and blog teasers
- Hotel search, availability by date, and guest checkout
- Holiday packages with filters (destination, theme, departure city, budget)
- Package detail with itinerary, FAQs, fixed departures, and optional add-ons at checkout
- Custom trip enquiries and contact flows
- Guest **booking lookup** (no login required)
- Customer accounts: register, login, profile, bookings, password reset
- Search with typeahead (header + dedicated search page)
- SEO: sitemap, robots, structured data for hotels and packages

### Booking & payments
- Hotel and package bookings with coupons (`WELCOME10`, etc. after seed)
- **Razorpay** integration with webhook support
- **Mock payment** in development (`ALLOW_MOCK_PAYMENT=1`)
- Partial pay (30% advance) and pay-remaining flow
- Printable booking **voucher** after full payment
- Cancellation request (customer / guest)

### Admin
- Dashboard with booking and enquiry stats
- Bookings and enquiries (status updates)
- Destinations and coupons (create)
- Lists for hotels, packages, offers
- Role-aware navigation (Admin, Booking Manager, Hotel Manager, Content Manager)

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MySQL via [Prisma 6](https://www.prisma.io/) |
| Auth | Signed session cookies (customer + admin), bcrypt passwords |
| Payments | Razorpay + mock provider |
| Validation | Zod |

---

## Prerequisites

- **Node.js 20+** and npm ([nodejs.org](https://nodejs.org))
- **MySQL 8** (e.g. XAMPP MySQL locally, or Hostinger MySQL in production)
- Git

> This app runs on **http://localhost:3000** via `npm run dev`. It does **not** run as a plain PHP site under Apache `htdocs` without the Node dev server.

---

## Local setup (Windows + XAMPP)

### 1. Database

1. Start **MySQL** in XAMPP.
2. Create a database (phpMyAdmin or CLI):

```sql
CREATE DATABASE travelling_dreams CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Project

```powershell
git clone https://github.com/vishal4linux/travellingdreams.git
cd travellingdreams
copy .env.example .env
```

Edit `.env` if your MySQL user/password differ from `root` with an empty password.

### 3. Install and seed

```powershell
npm install
npx prisma db push
npm run db:seed
```

### 4. Run

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Default credentials (after seed)

| Role | URL | Email | Password |
|------|-----|--------|----------|
| Admin | `/admin/login` | `admin@travellingdreams.in` | `ChangeMe123!` |

Override with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before seeding.

**Sample coupon codes:** `WELCOME10` (10% off), `LARIQUEZA500` (₹500 off).

---

## Environment variables

Copy from `.env.example`. Important keys:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | MySQL connection string |
| `SESSION_SECRET` / `NEXTAUTH_SECRET` | Session signing (use strong random values in production) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ALLOW_MOCK_PAYMENT` | `1` in dev to show mock pay button without Razorpay |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Live payments |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp click-to-chat |

Never commit `.env` to Git.

---

## npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run db:push` | Sync Prisma schema to MySQL |
| `npm run db:seed` | Load demo destinations, hotels, packages, admin, coupons |
| `npm run lint` | ESLint |

---

## Deploying on Hostinger

1. Create a **Web App** (Node.js / Next.js) and a **MySQL** database in hPanel.
2. Connect this repository or upload the project.
3. Set environment variables in the panel (especially `DATABASE_URL`, secrets, `NEXT_PUBLIC_SITE_URL`).
4. Build command: `npm run build`  
   Start command: `npm run start`
5. Run migrations/seed once against production DB (SSH or Hostinger terminal):

```bash
npx prisma db push
npm run db:seed
```

6. Point your domain to the Web App and configure Razorpay webhooks to `/api/payments/webhook`.

---

## Project layout (overview)

```
app/              # Routes (pages, API, admin)
components/       # UI and feature components
lib/              # Auth, utils, search helpers
prisma/           # Schema, seed, demo data
services/         # Business logic (bookings, payments, hotels, packages)
middleware.ts     # Admin / account route protection
```

---

## Testing a booking locally

1. Browse **Hotels** or **Packages** → **Book now**.
2. Complete guest details; try coupon `WELCOME10` if total meets minimum.
3. On the payment page, use **Mock full payment** (with `ALLOW_MOCK_PAYMENT=1`).
4. View confirmation and voucher; use **My Booking** → `/account/lookup` with booking ID + email.

---

## License

Private project. All rights reserved unless otherwise specified by the owner.

---

## Author

**Vishal Bhardwaj** — [vishal4linux@gmail.com](mailto:vishal4linux@gmail.com)
