# FarmerCart

A marketplace connecting Nigerian farmers directly to buyers — no middlemen, no markups. Farmers list produce by the unit they actually sell in (50kg bags, crates, tonnes), buyers shop and check out with Paystack or cash on delivery.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Prisma 7
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
- A PostgreSQL database (local or hosted, e.g. Supabase)
- A Cloudinary account
- A Paystack account (test keys are fine for development)

### Backend setup

\`\`\`bash
cd server
npm install
\`\`\`

Create `server/.env`:
\`\`\`
DATABASE_URL="postgresql://user:password@host:5432/dbname"
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
\`\`\`

Run migrations and start the server:
\`\`\`bash
npx prisma migrate deploy
npm run dev
\`\`\`

### Frontend setup

\`\`\`bash
cd client
npm install
\`\`\`

Create `client/.env`:
\`\`\`
VITE_BACKEND_URL="http://localhost:8000"
VITE_CURRENCY="₦"
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

## Deployment

- **Database:** Supabase (PostgreSQL)
- **Backend:** Render
- **Frontend:** Vercel

## License

MIT