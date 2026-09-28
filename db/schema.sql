-- VertixHub schema. Safe to re-run: every statement is idempotent.
-- Apply with `npm run db:migrate`.

CREATE TABLE IF NOT EXISTS products (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  description     text NOT NULL DEFAULT '',
  price           numeric(12, 2) NOT NULL CHECK (price >= 0),
  original_price  numeric(12, 2) CHECK (original_price IS NULL OR original_price >= 0),
  image           text NOT NULL DEFAULT '',
  images          jsonb NOT NULL DEFAULT '[]',
  category        text NOT NULL,
  stock           integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating          real NOT NULL DEFAULT 0,
  reviews         integer NOT NULL DEFAULT 0,
  featured        boolean NOT NULL DEFAULT false,
  tags            jsonb NOT NULL DEFAULT '[]',
  specifications  jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

-- Author and licence for photos that require a credit (e.g. Wikimedia Commons, CC BY-SA).
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_credit jsonb;

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  username       text NOT NULL,
  email          text NOT NULL,
  password_hash  text NOT NULL,
  is_admin       boolean NOT NULL DEFAULT false,
  is_banned      boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Usernames and emails are unique regardless of letter case.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- Only a SHA-256 of each session token is stored, so a database leak does not leak live sessions.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash  text PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        text NOT NULL UNIQUE,
  user_id             uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  subtotal            numeric(12, 2) NOT NULL,
  shipping            numeric(12, 2) NOT NULL,
  tax                 numeric(12, 2) NOT NULL,
  total               numeric(12, 2) NOT NULL,
  payment_method      text NOT NULL CHECK (payment_method IN ('credit-card', 'gcash', 'maya', 'paypal')),
  status              text NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered')),
  shipping_address    jsonb NOT NULL,
  estimated_delivery  timestamptz NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id        text REFERENCES products (id) ON DELETE SET NULL,
  quantity          integer NOT NULL CHECK (quantity > 0),
  unit_price        numeric(12, 2) NOT NULL,
  -- The product as it was at purchase time, so order history survives later edits.
  product_snapshot  jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
