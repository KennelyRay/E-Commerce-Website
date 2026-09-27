# Neon backend

The API (`functions/api.ts`) runs as a Neon Function next to the database. `neon.ts` declares the function and the public `product-images` bucket.

Current deployment: project `winter-shape-89901930` (VertixHub), branch `production` (`br-soft-mode-az0zpm32`).

- API: https://br-soft-mode-az0zpm32-api.compute.c-3.ap-southeast-1.aws.neon.tech
- Product photos: `https://br-soft-mode-az0zpm32.storage.c-3.ap-southeast-1.aws.neon.tech/product-images/...`

## One-time setup

1. Install and link the Neon CLI to this project:

   ```bash
   npm install -g neon@latest
   neon link --project-id winter-shape-89901930 --branch production --no-env-pull
   ```

2. Create the tables and seed data (uses the direct URL in `.env`):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. Deploy the function and the bucket:

   ```bash
   neon config plan            # dry run: shows what will change
   neon deploy --no-env-pull   # --no-env-pull keeps your .env as it is
   neon functions get api      # prints the function URL
   ```

   Neon injects `DATABASE_URL` and the Object Storage credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`). `ALLOWED_ORIGINS` defaults to `https://kennelyray.github.io`; set `PRODUCTION_ORIGINS` before deploying to allow a custom domain as well.

4. Check it:

   ```bash
   curl <function-url>/health    # {"ok":true,"storage":true}
   ```

5. Push to `main` to publish the storefront. The workflow builds against the API URL above unless the repository variable `NEXT_PUBLIC_API_URL` says otherwise.

6. Sign in to the storefront as `Admin` with `ADMIN_PASSWORD` from `.env`, open Account, and change the password.

## Photo URLs

Uploads go to `product-images` (public read) and are served from the branch storage host shown above. This was checked after the first deploy: an uploaded image loaded anonymously with HTTP 200. If Neon changes the host, set `PUBLIC_IMAGE_BASE_URL` in the function `env` in `neon.ts` and redeploy.

The branch also has a private `images` bucket created before this setup. The API does not use it.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/health` | public |
| GET | `/products`, `/products/:id` | public |
| POST | `/auth/register`, `/auth/login` | public (failed sign-ins are throttled) |
| GET | `/auth/me` | signed in |
| POST | `/auth/logout`, `/auth/password` | signed in |
| GET, POST | `/orders` | signed in (own orders only) |
| GET | `/admin/orders`, `/admin/users` | admin |
| PATCH | `/admin/orders/:id`, `/admin/products/:id`, `/admin/users/:id` | admin |
| POST | `/admin/products`, `/admin/products/:id/image` | admin |

## Security notes

- Passwords are hashed with scrypt. Sessions are random 256-bit tokens; only their SHA-256 is stored, and they expire after 30 days. Signing out, changing a password or being banned revokes them.
- Order totals, stock checks and the stock decrement happen in one transaction with row locks, so a modified cart cannot change prices or oversell.
- The sign-in throttle is per function instance, so it slows password guessing rather than enforcing a global limit.
- The database password was shared in a chat while setting this up. Rotate it in the Neon Console (Roles), then update `.env` and redeploy.
