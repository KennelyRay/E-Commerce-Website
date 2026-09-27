import { Hono, type Context, type Next } from 'hono';
import { cors } from 'hono/cors';
import { createHash, randomBytes } from 'node:crypto';
import { computeOrderTotals } from '../lib/pricing';
import { pool, withTransaction } from './lib/db';
import { toOrder, toProduct, toUser } from './lib/mappers';
import { hashPassword, verifyPassword } from './lib/password';
import { storageConfigured, uploadProductImage } from './lib/storage';

type AuthUser = ReturnType<typeof toUser>;
type Env = { Variables: { user: AuthUser; tokenHash: string } };

const SESSION_DAYS = 30;
const DELIVERY_DAYS = 5;
const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered'] as const;
const PAYMENT_METHODS = ['credit-card', 'gcash', 'maya', 'paypal'] as const;
const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = new Hono<Env>();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  '*',
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : null),
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  }),
);

class HttpError extends Error {
  constructor(public status: 400 | 401 | 403 | 404 | 409 | 413 | 415 | 429 | 503, message: string, public field?: string) {
    super(message);
  }
}

app.onError((error, c) => {
  if (error instanceof HttpError) {
    return c.json({ error: error.message, field: error.field }, error.status);
  }
  console.error(error);
  return c.json({ error: 'Something went wrong on our side. Please try again.' }, 500);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

// ---------- helpers ----------

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const round2 = (value: number) => Math.round(value * 100) / 100;

async function readJson<T>(c: Context): Promise<T> {
  try {
    return (await c.req.json()) as T;
  } catch {
    throw new HttpError(400, 'Request body must be JSON.');
  }
}

function text(value: unknown, field: string, { min = 1, max = 200 } = {}) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (trimmed.length < min || trimmed.length > max) {
    throw new HttpError(400, `${field} must be between ${min} and ${max} characters.`, field);
  }
  return trimmed;
}

function nonNegative(value: unknown, field: string, { integer = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || (integer && !Number.isInteger(number))) {
    throw new HttpError(400, `${field} must be ${integer ? 'a whole number' : 'a number'} of zero or more.`, field);
  }
  return number;
}

async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  await pool.query(`DELETE FROM sessions WHERE user_id = $1 AND expires_at < now()`, [userId]);
  await pool.query(`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + $3::interval)`, [
    sha256(token),
    userId,
    `${SESSION_DAYS} days`,
  ]);
  return token;
}

// Per-instance throttle on failed sign-ins. Neon may run several instances, so this
// slows guessing rather than guaranteeing a global limit.
const failedLogins = new Map<string, { count: number; until: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 8;

function assertNotThrottled(key: string) {
  const entry = failedLogins.get(key);
  if (entry && entry.until > Date.now() && entry.count >= LOGIN_MAX_FAILURES) {
    throw new HttpError(429, 'Too many failed attempts. Try again in 15 minutes.');
  }
}

function recordFailure(key: string) {
  const entry = failedLogins.get(key);
  const fresh = !entry || entry.until < Date.now();
  failedLogins.set(key, { count: fresh ? 1 : entry!.count + 1, until: fresh ? Date.now() + LOGIN_WINDOW_MS : entry!.until });
}

// ---------- auth middleware ----------

async function requireUser(c: Context<Env>, next: Next) {
  const header = c.req.header('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    throw new HttpError(401, 'Sign in to continue.');
  }

  const tokenHash = sha256(token);
  const { rows } = await pool.query(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [tokenHash],
  );
  if (!rows[0]) {
    throw new HttpError(401, 'Your session has expired. Sign in again.');
  }
  if (rows[0].is_banned) {
    await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [rows[0].id]);
    throw new HttpError(403, 'This account has been suspended. Contact support for help.');
  }

  c.set('user', toUser(rows[0]));
  c.set('tokenHash', tokenHash);
  await next();
}

async function requireAdmin(c: Context<Env>, next: Next) {
  if (!c.get('user').isAdmin) {
    throw new HttpError(403, 'Admin access only.');
  }
  await next();
}

// ---------- public ----------

app.get('/health', async (c) => {
  await pool.query('SELECT 1');
  return c.json({ ok: true, storage: storageConfigured });
});

app.get('/products', async (c) => {
  const { rows } = await pool.query(`SELECT * FROM products ORDER BY featured DESC, (CASE WHEN id ~ '^\\d+$' THEN id::int END), id`);
  // Stock changes with every order, so browsers must revalidate rather than reuse a stale list.
  c.header('Cache-Control', 'no-cache');
  return c.json(rows.map(toProduct));
});

app.get('/products/:id', async (c) => {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [c.req.param('id')]);
  if (!rows[0]) throw new HttpError(404, 'This part is not in the catalog.');
  return c.json(toProduct(rows[0]));
});

// ---------- auth ----------

app.post('/auth/register', async (c) => {
  const body = await readJson<Record<string, unknown>>(c);
  const name = text(body.name, 'name', { min: 2, max: 80 });
  const username = text(body.username, 'username', { min: 3, max: 32 });
  const email = text(body.email, 'email', { max: 254 }).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) throw new HttpError(400, 'Use letters, numbers, dots, dashes or underscores.', 'username');
  if (!EMAIL.test(email)) throw new HttpError(400, 'Enter a valid email address.', 'email');
  if (password.length < 8 || password.length > 200) throw new HttpError(400, 'Use at least 8 characters.', 'password');

  const taken = await pool.query(`SELECT lower(username) = lower($1) AS username_taken, lower(email) = lower($2) AS email_taken FROM users WHERE lower(username) = lower($1) OR lower(email) = lower($2)`, [username, email]);
  if (taken.rows.some((row) => row.username_taken)) throw new HttpError(409, 'That username is taken.', 'username');
  if (taken.rows.some((row) => row.email_taken)) throw new HttpError(409, 'An account already uses that email.', 'email');

  const { rows } = await pool.query(
    `INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, username, email, await hashPassword(password)],
  );
  const token = await createSession(rows[0].id);
  return c.json({ token, user: toUser(rows[0]) }, 201);
});

app.post('/auth/login', async (c) => {
  const body = await readJson<Record<string, unknown>>(c);
  const identifier = text(body.username, 'username', { max: 254 });
  const password = typeof body.password === 'string' ? body.password : '';
  const throttleKey = `${identifier.toLowerCase()}|${c.req.header('x-forwarded-for')?.split(',')[0] ?? ''}`;
  assertNotThrottled(throttleKey);

  const { rows } = await pool.query(`SELECT * FROM users WHERE lower(username) = lower($1) OR lower(email) = lower($1) LIMIT 1`, [identifier]);
  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    recordFailure(throttleKey);
    throw new HttpError(401, 'Username or password is incorrect.');
  }
  if (user.is_banned) {
    throw new HttpError(403, 'This account has been suspended. Contact support for help.');
  }

  failedLogins.delete(throttleKey);
  const token = await createSession(user.id);
  return c.json({ token, user: toUser(user) });
});

app.get('/auth/me', requireUser, (c) => c.json({ user: c.get('user') }));

app.post('/auth/logout', requireUser, async (c) => {
  await pool.query(`DELETE FROM sessions WHERE token_hash = $1`, [c.get('tokenHash')]);
  return c.json({ ok: true });
});

app.post('/auth/password', requireUser, async (c) => {
  const body = await readJson<Record<string, unknown>>(c);
  const current = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const next = typeof body.newPassword === 'string' ? body.newPassword : '';
  if (next.length < 8 || next.length > 200) throw new HttpError(400, 'Use at least 8 characters.', 'newPassword');

  const { rows } = await pool.query(`SELECT password_hash FROM users WHERE id = $1`, [c.get('user').id]);
  if (!(await verifyPassword(current, rows[0].password_hash))) throw new HttpError(400, 'Current password is incorrect.', 'currentPassword');

  await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [await hashPassword(next), c.get('user').id]);
  // Sign out every other device.
  await pool.query(`DELETE FROM sessions WHERE user_id = $1 AND token_hash <> $2`, [c.get('user').id, c.get('tokenHash')]);
  return c.json({ ok: true });
});

// ---------- orders ----------

async function loadOrders(where: string, params: unknown[]) {
  const { rows: orders } = await pool.query(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 500`, params);
  if (orders.length === 0) return [];
  const { rows: items } = await pool.query(`SELECT * FROM order_items WHERE order_id = ANY($1::uuid[])`, [orders.map((order) => order.id)]);
  return orders.map((order) => toOrder(order, items.filter((item) => item.order_id === order.id)));
}

app.get('/orders', requireUser, async (c) => c.json(await loadOrders('WHERE user_id = $1', [c.get('user').id])));

app.post('/orders', requireUser, async (c) => {
  const body = await readJson<Record<string, any>>(c);
  const user = c.get('user');

  const requested = new Map<string, number>();
  for (const item of Array.isArray(body.items) ? body.items : []) {
    const quantity = Number(item?.quantity);
    if (typeof item?.productId !== 'string' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new HttpError(400, 'Each cart line needs a product and a quantity between 1 and 99.');
    }
    requested.set(item.productId, (requested.get(item.productId) ?? 0) + quantity);
  }
  if (requested.size === 0) throw new HttpError(400, 'Your cart is empty.');

  const paymentMethod = body.paymentMethod;
  if (!PAYMENT_METHODS.includes(paymentMethod)) throw new HttpError(400, 'Choose a payment method.', 'paymentMethod');

  const address = body.shippingAddress ?? {};
  const shippingAddress = {
    firstName: text(address.firstName, 'firstName', { min: 2, max: 60 }),
    lastName: text(address.lastName, 'lastName', { min: 2, max: 60 }),
    email: text(address.email, 'email', { max: 254 }),
    address: text(address.address, 'address', { min: 10, max: 200 }),
    city: text(address.city, 'city', { max: 80 }),
    zipCode: text(address.zipCode, 'zipCode', { min: 4, max: 4 }),
    country: 'Philippines',
  };
  if (!EMAIL.test(shippingAddress.email)) throw new HttpError(400, 'Enter a valid email address.', 'email');
  if (!/^\d{4}$/.test(shippingAddress.zipCode)) throw new HttpError(400, 'Philippine ZIP codes have 4 digits.', 'zipCode');

  const order = await withTransaction(async (client) => {
    // Lock the rows so two checkouts cannot sell the same last unit.
    const { rows: products } = await client.query(`SELECT * FROM products WHERE id = ANY($1::text[]) ORDER BY id FOR UPDATE`, [[...requested.keys()]]);
    const byId = new Map(products.map((row) => [row.id as string, row]));

    let subtotal = 0;
    for (const [productId, quantity] of requested) {
      const product = byId.get(productId);
      if (!product) throw new HttpError(409, 'A part in your cart is no longer sold. Remove it and try again.');
      if (product.stock < quantity) {
        throw new HttpError(409, product.stock === 0 ? `${product.name} just sold out.` : `Only ${product.stock} of ${product.name} left. Lower the quantity and try again.`);
      }
      subtotal += Number(product.price) * quantity;
    }

    const totals = computeOrderTotals(round2(subtotal));
    const orderNumber = `VTX-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`;

    const { rows: inserted } = await client.query(
      `INSERT INTO orders (order_number, user_id, subtotal, shipping, tax, total, payment_method, status, shipping_address, estimated_delivery)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8, now() + $9::interval) RETURNING *`,
      [orderNumber, user.id, round2(totals.subtotal), round2(totals.shipping), round2(totals.tax), round2(totals.total), paymentMethod, shippingAddress, `${DELIVERY_DAYS} days`],
    );

    const items = [];
    for (const [productId, quantity] of requested) {
      const product = byId.get(productId)!;
      await client.query(`UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2`, [quantity, productId]);
      const { stock: _stock, ...snapshot } = toProduct(product);
      const { rows } = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_snapshot) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [inserted[0].id, productId, quantity, product.price, snapshot],
      );
      items.push(rows[0]);
    }

    return toOrder(inserted[0], items);
  });

  return c.json(order, 201);
});

// ---------- admin ----------

const admin = new Hono<Env>();
admin.use('*', requireUser, requireAdmin);

admin.get('/orders', async (c) => c.json(await loadOrders('', [])));

admin.patch('/orders/:id', async (c) => {
  const { status } = await readJson<{ status?: string }>(c);
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) throw new HttpError(400, 'Unknown order status.', 'status');
  const { rowCount } = await pool.query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, c.req.param('id')]);
  if (!rowCount) throw new HttpError(404, 'Order not found.');
  const [order] = await loadOrders('WHERE id = $1', [c.req.param('id')]);
  return c.json(order);
});

admin.post('/products', async (c) => {
  const body = await readJson<Record<string, any>>(c);
  const specifications = Object.fromEntries(
    Object.entries(body.specifications ?? {})
      .map(([key, value]) => [String(key).trim(), String(value ?? '').trim()])
      .filter(([key, value]) => key && value),
  );
  const tags = (Array.isArray(body.tags) ? body.tags : []).map((tag: unknown) => String(tag).trim().toLowerCase()).filter(Boolean).slice(0, 20);
  const originalPrice = body.originalPrice === undefined || body.originalPrice === null || body.originalPrice === '' ? null : nonNegative(body.originalPrice, 'originalPrice');

  const { rows } = await pool.query(
    `INSERT INTO products (id, name, description, price, original_price, category, stock, featured, tags, specifications)
     VALUES ((SELECT (COALESCE(MAX(id::int), 0) + 1)::text FROM products WHERE id ~ '^\\d+$'), $1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      text(body.name, 'name', { min: 2, max: 160 }),
      text(body.description, 'description', { min: 10, max: 4000 }),
      nonNegative(body.price, 'price'),
      originalPrice,
      text(body.category, 'category', { max: 60 }),
      nonNegative(body.stock ?? 0, 'stock', { integer: true }),
      Boolean(body.featured),
      JSON.stringify(tags),
      JSON.stringify(specifications),
    ],
  );
  return c.json(toProduct(rows[0]), 201);
});

admin.patch('/products/:id', async (c) => {
  const body = await readJson<Record<string, unknown>>(c);
  const sets: string[] = [];
  const values: unknown[] = [];
  const set = (column: string, value: unknown) => {
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  };

  if ('price' in body) set('price', nonNegative(body.price, 'price'));
  if ('originalPrice' in body) set('original_price', body.originalPrice === null ? null : nonNegative(body.originalPrice, 'originalPrice'));
  if ('stock' in body) set('stock', nonNegative(body.stock, 'stock', { integer: true }));
  if ('featured' in body) set('featured', Boolean(body.featured));
  if ('name' in body) set('name', text(body.name, 'name', { min: 2, max: 160 }));
  if ('description' in body) set('description', text(body.description, 'description', { min: 10, max: 4000 }));
  if (sets.length === 0) throw new HttpError(400, 'Nothing to update.');

  values.push(c.req.param('id'));
  const { rows } = await pool.query(`UPDATE products SET ${sets.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`, values);
  if (!rows[0]) throw new HttpError(404, 'Product not found.');
  return c.json(toProduct(rows[0]));
});

admin.post('/products/:id/image', async (c) => {
  if (!storageConfigured) throw new HttpError(503, 'Image uploads need Object Storage, which is not configured here.');

  const form = await c.req.parseBody();
  const file = form.file;
  if (!(file instanceof File)) throw new HttpError(400, 'Attach an image file.', 'file');
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw new HttpError(415, 'Use a JPEG, PNG, WebP or AVIF image.', 'file');
  if (file.size > MAX_IMAGE_BYTES) throw new HttpError(413, 'Images must be 5 MB or smaller.', 'file');

  const id = c.req.param('id');
  const exists = await pool.query(`SELECT 1 FROM products WHERE id = $1`, [id]);
  if (!exists.rowCount) throw new HttpError(404, 'Product not found.');

  const url = await uploadProductImage(`products/${id}/${Date.now()}.${extension}`, new Uint8Array(await file.arrayBuffer()), file.type);
  const { rows } = await pool.query(`UPDATE products SET image = $1, updated_at = now() WHERE id = $2 RETURNING *`, [url, id]);
  return c.json(toProduct(rows[0]));
});

admin.get('/users', async (c) => {
  const { rows } = await pool.query(
    `SELECT u.*, COUNT(o.id)::int AS order_count, COALESCE(SUM(o.total), 0) AS spent
     FROM users u LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id ORDER BY u.created_at`,
  );
  return c.json(rows.map((row) => ({ ...toUser(row), orderCount: row.order_count, spent: Number(row.spent) })));
});

admin.patch('/users/:id', async (c) => {
  const { isBanned } = await readJson<{ isBanned?: boolean }>(c);
  if (typeof isBanned !== 'boolean') throw new HttpError(400, 'isBanned must be true or false.');
  if (c.req.param('id') === c.get('user').id) throw new HttpError(400, 'You cannot ban your own account.');

  const { rows } = await pool.query(`UPDATE users SET is_banned = $1 WHERE id = $2 AND NOT is_admin RETURNING *`, [isBanned, c.req.param('id')]);
  if (!rows[0]) throw new HttpError(404, 'Customer not found, or the account is an admin.');
  if (isBanned) await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [rows[0].id]);
  return c.json(toUser(rows[0]));
});

app.route('/admin', admin);

export default app;
