import { attachDatabasePool } from '@neon/functions';
import { Pool, PoolClient } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Neon injects it on deploy; locally it comes from .env.');
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

// Lets the Neon runtime recycle idle connections without crashing the function.
attachDatabasePool(pool);

export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
