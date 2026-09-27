import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

// Schema changes use the direct (unpooled) connection, as Neon recommends.
const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Set DATABASE_URL_UNPOOLED or DATABASE_URL in .env first.');
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(readFileSync(join(__dirname, '..', 'db', 'schema.sql'), 'utf8'));
    const { rows } = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1`);
    console.log(`Schema applied. Tables: ${rows.map((row) => row.table_name).join(', ')}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
