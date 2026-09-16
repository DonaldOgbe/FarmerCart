# FarmerCart

A marketplace connecting Nigerian farmers directly to buyers — no middlemen, no markups. Farmers list produce by the unit they actually sell in (50kg bags, crates, tonnes), buyers shop and check out with Paystack or cash on delivery.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (local development) / PostgreSQL (production) + Prisma 7
- **Auth:** JWT (httpOnly cookies)
- **Payments:** Paystack
- **Images:** Cloudinary

## Features

- Dual-role accounts — Buyers and Farmers, with role-based access to the seller dashboard
- Farmers list produce with agricultural sale units (bag, crate, tonne, etc.) and manage stock
- Persistent server-side cart tied to the logged-in user
- Address book, checkout with COD or Paystack online payment
- Order tracking for buyers, sales dashboard for farmers

## Getting Started

### Prerequisites
- Node.js 18+
- A Cloudinary account
- A Paystack account (test keys are fine for development)
- No database installation needed for local dev — SQLite runs as a local file. A PostgreSQL database (e.g. Supabase) is only required for production deployment.

### Backend setup

```bash
cd server
npm install
```

Create `server/.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
PAYSTACK_SECRET_KEY="..."
PORT=8000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

Run migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```

> **Note:** `dev.db` is created automatically in the `server/` folder on first migration. It's git-ignored — don't commit it.

### Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_BACKEND_URL="http://localhost:8000"
VITE_CURRENCY="₦"
```

```bash
npm run dev
```

## Database: local vs. production

This project uses **SQLite for local development** (zero setup, no hosted DB needed to start coding) and **PostgreSQL for production**. Switching between them means updating the `provider` in `prisma/schema.prisma`, `DATABASE_URL` in `.env`, and the Prisma adapter in `server/prisma.ts` (`@prisma/adapter-better-sqlite3` for SQLite, `@prisma/adapter-pg` for PostgreSQL). Some schema features (native Postgres array types, `@db.*` type annotations) only apply to the PostgreSQL schema variant.

## Deployment

- **Database:** Supabase (PostgreSQL) — SQLite's local file storage does not persist on Render's ephemeral disk, so production always runs on Postgres
- **Backend:** Render
- **Frontend:** Vercel

## License

MIT