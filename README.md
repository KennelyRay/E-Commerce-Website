# VertixHub

PC parts storefront for a store in Baguio City: catalog, PC Builder with compatibility checks, cart, checkout, order history and a store admin.

## How it fits together

| Piece | Where it runs | Code |
| --- | --- | --- |
| Storefront (Next.js 14) | Vercel, https://vertixhub.vercel.app | `app/`, `components/` |
| API (Hono) | Neon Functions | `functions/api.ts` |
| Database (Postgres) | Neon | `db/schema.sql` |
| Product photos | Neon Object Storage, bucket `product-images` | `functions/lib/storage.ts` |

The browser talks to the API with a bearer token. Checkout sends only product ids and quantities; the API prices the order from the database and reserves stock inside a transaction.

The cart and the one saved PC build stay in the browser. Accounts, orders, stock and prices live in Neon.

## Catalog

`data/products.json` holds 39 real parts. Prices are launch MSRPs converted at PHP 57 per USD (the `launchPriceUsd` field keeps the source figure); stock is a placeholder of 10 per part. Set real prices and stock in Admin > Inventory.

Product photos come from Wikimedia Commons under CC0, CC BY or CC BY-SA licences. These licences require a credit, so each product stores `imageCredit` (author, licence, source) and the product page shows it under the photo. Keep the credit if you reuse a photo elsewhere. Uploading your own photo in the admin removes the credit automatically.

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

- API and database: see [docs/NEON.md](docs/NEON.md).
- Storefront: Vercel builds on every push. In the Vercel project settings, set `NEXT_PUBLIC_API_URL` to `https://br-soft-mode-az0zpm32-api.compute.c-3.ap-southeast-1.aws.neon.tech` for Production and Preview. It is read at build time, so redeploy after changing it.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Storefront dev server |
| `npm run api:dev` | API on Node against the database in `.env` |
| `npm run db:migrate` | Applies `db/schema.sql` |
| `npm run db:seed` | Inserts missing products and the Admin account; never overwrites edits |
| `npm run catalog:sync -- --upload <apiUrl>` | Replaces the catalog with `data/products.json` (overwrites edits) and copies credited photos into the bucket |
| `npm run build:static` | Optional static export into `out/` (for static hosts such as GitHub Pages) |

## Not built yet

- Online payment. Checkout records the order and reserves stock without charging; the page says so. The hand-off point is marked `TODO` in `app/checkout/page.tsx`.
- Privacy Policy and Terms of Service pages.
- Photos for the two AM5 boards (MSI MPG B650 Carbon WiFi, ASUS TUF Gaming B650-Plus WiFi). No freely licensed photo exists; upload your own from Admin > Inventory.
