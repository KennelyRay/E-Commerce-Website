import { serve } from '@hono/node-server';

// Runs the Neon Function locally on Node, against the database in .env.
// `neon dev` does the same once the Neon CLI is installed and linked.
async function main() {
  const { default: app } = await import('../functions/api');
  const port = Number(process.env.API_PORT ?? 8787);
  serve({ fetch: app.fetch, port }, () => console.log(`VertixHub API on http://localhost:${port}`));
}

main();
