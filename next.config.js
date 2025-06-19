/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: '',
  basePath: '',
  
  distDir: 'out',
  
  webpack: (config, { isServer }) => {
    // Fix for sql.js in browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Handle sql.js wasm files
    config.resolve.alias = {
      ...config.resolve.alias,
      'sql.js': require.resolve('sql.js/dist/sql-wasm.js'),
    };
    
    return config;
  },
}

module.exports = nextConfig 