/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/E-Commerce-Website' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/E-Commerce-Website' : '',
}

module.exports = nextConfig 