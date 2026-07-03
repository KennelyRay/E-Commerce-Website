/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport,
  skipTrailingSlashRedirect: isStaticExport,
  images: {
    unoptimized: true,
  },
  
  // Enable static export only when explicitly requested, so the app can evolve toward API-backed deployments.
  assetPrefix: isStaticExport ? '/E-Commerce-Website' : '',
  basePath: isStaticExport ? '/E-Commerce-Website' : '',
  distDir: isStaticExport ? 'out' : '.next',
}

module.exports = nextConfig 
