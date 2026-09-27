import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Neon injects these when Object Storage is enabled on the branch (see neon.ts).
const endpoint = process.env.AWS_ENDPOINT_URL_S3;
export const IMAGE_BUCKET = process.env.PRODUCT_IMAGE_BUCKET ?? 'product-images';

export const storageConfigured = Boolean(endpoint && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

const client = storageConfigured
  ? new S3Client({
      region: process.env.AWS_REGION,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null;

/**
 * Uploads to the public_read bucket and returns the URL browsers load the image from.
 * PUBLIC_IMAGE_BASE_URL overrides the default path-style URL if Neon serves public
 * objects from a different host.
 */
export async function uploadProductImage(key: string, body: Uint8Array, contentType: string) {
  if (!client) {
    throw new Error('Object Storage is not configured for this environment.');
  }

  await client.send(
    new PutObjectCommand({
      Bucket: IMAGE_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const base = process.env.PUBLIC_IMAGE_BASE_URL ?? `${endpoint!.replace(/\/$/, '')}/${IMAGE_BUCKET}`;
  return `${base.replace(/\/$/, '')}/${key}`;
}
