# VertixHub

PC parts storefront for a store in Baguio City: catalog, PC Builder with compatibility checks, cart, checkout, order history and a store admin.

## How it fits together

| Piece | Where it runs | Code |
| --- | --- | --- |
| Storefront (Next.js 14, static export) | GitHub Pages | `app/`, `components/` |
| API (Hono) | Neon Functions | `functions/api.ts` |
| Database (Postgres) | Neon | `db/schema.sql` |
| Product photos | Neon Object Storage, bucket `product-images` | `functions/lib/storage.ts` |

The browser talks to the API with a bearer token. Checkout sends only product ids and quantities; the API prices the order from the database and reserves stock inside a transaction.

The cart and the one saved PC build stay in the browser. Accounts, orders, stock and prices live in Neon.

## Run it locally

Needs Node 20 or newer.

```bash
npm install
cp .env.example .env        # then fill in the Neon URLs and ADMIN_PASSWORD
npm run db:migrate          # creates the tables (safe to re-run)
npm run db:seed             # loads data/products.json and the Admin account
npm run api:dev             # API on http://localhost:8787
npm run dev                 # storefront on http://localhost:3000
```

Sign in as `Admin` with the `ADMIN_PASSWORD` from `.env`, then change it under Account.

Photo uploads in the admin need Object Storage credentials, which Neon injects only when the API runs on Neon (or after `neon env pull`). Without them the upload button is disabled and says why.

## Deploy

See [docs/NEON.md](docs/NEON.md) for the API and database, then push to `main` to publish the storefront through `.github/workflows/deploy.yml`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Storefront dev server |
| `npm run api:dev` | API on Node against the database in `.env` |
| `npm run db:migrate` | Applies `db/schema.sql` |
| `npm run db:seed` | Inserts missing products and the Admin account; never overwrites edits |
| `npm run build:static` | Static export into `out/` under `/E-Commerce-Website` |

## Not built yet

- Online payment. Checkout records the order and reserves stock without charging; the page says so. The hand-off point is marked `TODO` in `app/checkout/page.tsx`.
- Privacy Policy and Terms of Service pages.
- Product photos for the seeded catalog: most image URLs in `data/products.json` no longer resolve. Upload replacements from Admin > Inventory.
