import { defineConfig } from '@neon/config/v1';

// Deploy with `neon deploy`. Neon injects DATABASE_URL and the Object Storage
// credentials (AWS_*) into the function; the values below are the extra settings.
export default defineConfig({
  functions: {
    api: {
      name: 'VertixHub API',
      source: './functions/api.ts',
      env: {
        // Browser origins allowed to call the deployed API, comma separated.
        // Local development uses ALLOWED_ORIGINS from .env instead.
        ALLOWED_ORIGINS: process.env.PRODUCTION_ORIGINS ?? 'https://kennelyray.github.io',
        PRODUCT_IMAGE_BUCKET: 'product-images',
      },
    },
  },
  buckets: {
    // Product photos are public so the storefront can load them directly.
    'product-images': { access: 'public_read' },
  },
});
