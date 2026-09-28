import { Client } from 'pg';
import productsData from '../data/products.json';
import { hashPassword } from '../functions/lib/password';

type SeedProduct = (typeof productsData.products)[number] & { images?: string[]; originalPrice?: number; imageCredit?: object };

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!connectionString || !adminPassword || adminPassword.length < 12) {
  console.error('Set DATABASE_URL and an ADMIN_PASSWORD of at least 12 characters in .env first.');
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    // Products: insert new ones, leave existing rows alone so admin edits to
    // price, stock and images are never overwritten by a re-seed.
    let inserted = 0;
    for (const product of productsData.products as SeedProduct[]) {
      const result = await client.query(
        `INSERT INTO products (id, name, description, price, original_price, image, images, category, stock, rating, reviews, featured, tags, specifications, image_credit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.originalPrice ?? null,
          product.image,
          JSON.stringify(product.images ?? []),
          product.category,
          product.stock,
          product.rating,
          product.reviews,
          product.featured ?? false,
          JSON.stringify(product.tags),
          JSON.stringify(product.specifications ?? {}),
          product.imageCredit ? JSON.stringify(product.imageCredit) : null,
        ],
      );
      inserted += result.rowCount ?? 0;
    }
    console.log(`Products: ${inserted} inserted, ${productsData.products.length - inserted} already present.`);

    const existing = await client.query(`SELECT id FROM users WHERE lower(username) = 'admin'`);
    if (existing.rowCount) {
      console.log('Admin account already exists; password left unchanged.');
    } else {
      await client.query(
        `INSERT INTO users (name, username, email, password_hash, is_admin) VALUES ('Administrator', 'Admin', 'admin@vertixhub.com', $1, true)`,
        [await hashPassword(adminPassword!)],
      );
      console.log('Admin account created (username "Admin", password from ADMIN_PASSWORD).');
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
