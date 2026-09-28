import { Client } from 'pg';
import productsData from '../data/products.json';

/*
  Replaces the catalog in the database with data/products.json (unlike db:seed, this
  overwrites edits), then copies each credited photo from its source into the
  product-images bucket through the API's admin upload.

    npm run catalog:sync                       # database only
    npm run catalog:sync -- --upload <apiUrl>  # also re-host photos (needs ADMIN_PASSWORD)
*/

type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  tags: string[];
  specifications: Record<string, string>;
  imageCredit?: { author: string; license: string; licenseUrl?: string | null; sourceUrl: string };
};

const products = productsData.products as unknown as CatalogProduct[];
const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const uploadIndex = process.argv.indexOf('--upload');
const apiUrl = uploadIndex > -1 ? process.argv[uploadIndex + 1]?.replace(/\/$/, '') : undefined;
// Wikimedia asks automated clients to identify themselves.
const USER_AGENT = 'VertixHubCatalogSync/1.0 (https://vertixhub.vercel.app)';

async function syncDatabase() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    for (const product of products) {
      await client.query(
        `INSERT INTO products (id, name, description, price, original_price, image, images, category, stock, rating, reviews, featured, tags, specifications, image_credit)
         VALUES ($1, $2, $3, $4, $5, $6, '[]', $7, $8, 0, 0, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
           original_price = EXCLUDED.original_price, category = EXCLUDED.category, stock = EXCLUDED.stock,
           rating = 0, reviews = 0, featured = EXCLUDED.featured, tags = EXCLUDED.tags,
           specifications = EXCLUDED.specifications, image_credit = EXCLUDED.image_credit,
           -- Keep a photo already re-hosted in our bucket; otherwise take the catalog's.
           image = CASE WHEN products.image LIKE '%/product-images/%' AND EXCLUDED.image_credit IS NOT NULL THEN products.image ELSE EXCLUDED.image END,
           updated_at = now()`,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.originalPrice ?? null,
          product.image,
          product.category,
          product.stock,
          product.featured ?? false,
          JSON.stringify(product.tags),
          JSON.stringify(product.specifications),
          product.imageCredit ? JSON.stringify(product.imageCredit) : null,
        ],
      );
    }
    console.log(`Database: ${products.length} products written.`);
    const { rows } = await client.query(`SELECT id, image FROM products`);
    return new Map(rows.map((row) => [row.id as string, row.image as string]));
  } finally {
    await client.end();
  }
}

async function uploadPhotos(apiBase: string, currentImages: Map<string, string>) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is required for --upload.');

  const login = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Admin', password }),
  });
  if (!login.ok) throw new Error(`Admin sign-in failed (${login.status}).`);
  const { token } = (await login.json()) as { token: string };

  let uploaded = 0;
  let skipped = 0;
  try {
    for (const product of products) {
      const current = currentImages.get(product.id) ?? '';
      if (!product.image || !product.imageCredit) continue;
      if (current.includes('/product-images/')) {
        skipped += 1;
        continue;
      }

      const source = await fetch(product.image, { headers: { 'User-Agent': USER_AGENT } });
      if (!source.ok) throw new Error(`Download failed for ${product.name} (${source.status}).`);
      const type = source.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
      const form = new FormData();
      form.append('file', new Blob([await source.arrayBuffer()], { type }), `product-${product.id}`);
      form.append('keepCredit', 'true');

      const response = await fetch(`${apiBase}/admin/products/${product.id}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!response.ok) throw new Error(`Upload failed for ${product.name}: ${await response.text()}`);
      uploaded += 1;
      console.log(`  uploaded ${product.id} ${product.name}`);
      // Be gentle with Wikimedia's servers.
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  } finally {
    await fetch(`${apiBase}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  }
  console.log(`Photos: ${uploaded} uploaded, ${skipped} already hosted.`);
}

async function main() {
  if (!connectionString) throw new Error('Set DATABASE_URL in .env first.');
  const images = await syncDatabase();
  if (apiUrl) await uploadPhotos(apiUrl, images);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
