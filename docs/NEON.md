# Neon PostgreSQL Setup

This project now includes a server-side PostgreSQL setup for Neon using Prisma.

## Local commands

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Environment

Create a local `.env` file with:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require&channel_binding=require"
```

## Verification

Run the app and open:

- `/api/health/db`
- `/api/products`

If the database is connected, the health endpoint returns record counts and the products endpoint returns the seeded catalog.
