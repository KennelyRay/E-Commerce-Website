/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  
  // GitHub Pages configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? '/E-Commerce-Website' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/E-Commerce-Website' : '',
  
  distDir: 'out',
}

module.exports = nextConfig 