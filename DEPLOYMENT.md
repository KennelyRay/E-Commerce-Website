# VertixHub Deployment Guide

This guide will help you deploy your VertixHub e-commerce website to various hosting platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account (for GitHub Pages)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📦 Build for Production

### Static Export (Recommended)
```bash
# Build and export static files
npm run deploy

# Files will be generated in the 'out' directory
# Ready for static hosting
```

### Preview Build Locally
```bash
# Serve the built files locally
npm run serve
```

## 🌐 Hosting Options

### 1. GitHub Pages (Free) ⭐ Recommended

#### Automatic Deployment
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select "GitHub Actions" as source
4. The workflow will automatically deploy on every push to main

#### Manual Deployment
```bash
# Build the project
npm run deploy

# Push the 'out' folder to gh-pages branch
npx gh-pages -d out
```

**URL:** `https://yourusername.github.io/your-repo-name`

### 2. Vercel (Free tier available)

#### One-Click Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Netlify (Free tier available)

#### Drag & Drop
1. Run `npm run deploy`
2. Go to [Netlify](https://netlify.com)
3. Drag the `out` folder to deploy

#### Git Integration
1. Connect your GitHub repository
2. Set build command: `npm run deploy`
3. Set publish directory: `out`

### 4. Firebase Hosting (Free tier available)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run deploy
firebase deploy
```

### 5. AWS S3 + CloudFront

```bash
# Build the project
npm run deploy

# Upload to S3 bucket
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Configuration

### Custom Domain
1. Add your domain to `public/CNAME` file:
```
yourdomain.com
```

2. Update DNS settings:
- For GitHub Pages: Add CNAME record pointing to `yourusername.github.io`
- For other platforms: Follow their custom domain guides

### Environment Variables
Create `.env.local` for any environment-specific settings:
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### SEO Configuration
Update `public/robots.txt` with your domain:
```
Sitemap: https://yourdomain.com/sitemap.xml
```

## 🛠️ Build Configuration

### Next.js Config (`next.config.js`)
- ✅ Static export enabled
- ✅ Image optimization disabled (for static hosting)
- ✅ Trailing slash handling
- ✅ Asset optimization

### Package Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and prepare for deployment
- `npm run serve` - Preview production build locally
- `npm run clean` - Clean build artifacts

## 📱 Features Included

### ✅ Static Site Generation
- Pre-rendered pages for fast loading
- SEO-friendly URLs
- No server required

### ✅ Progressive Web App Ready
- Service worker support
- Offline functionality
- Mobile-optimized

### ✅ Performance Optimized
- Image optimization
- Code splitting
- Lazy loading

### ✅ SEO Optimized
- Meta tags
- Open Graph support
- Structured data ready

## 🔍 Troubleshooting

### Build Errors

#### "Module not found" Error
```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

#### Image Loading Issues
- Ensure all images use absolute URLs
- Check `next.config.js` has `unoptimized: true`

#### Routing Issues
- Verify `trailingSlash: true` in `next.config.js`
- Check file names match route patterns

### Performance Issues

#### Slow Loading
- Optimize images (use WebP format)
- Enable compression on your hosting platform
- Use CDN for static assets

#### Large Bundle Size
```bash
# Analyze bundle size
npx @next/bundle-analyzer
```

## 📊 Monitoring

### Analytics Setup
Add Google Analytics or other tracking:

1. Get your tracking ID
2. Add to environment variables
3. Include tracking code in `app/layout.tsx`

### Error Monitoring
Consider adding error tracking:
- Sentry
- LogRocket
- Rollbar

## 🔐 Security

### Content Security Policy
Add CSP headers in hosting platform:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
```

### HTTPS
- ✅ All hosting platforms provide free SSL
- Ensure all external resources use HTTPS

## 📞 Support

For deployment issues:
1. Check the build logs
2. Verify all environment variables
3. Test locally with `npm run serve`
4. Check hosting platform documentation

---

Happy hosting! 🚀 Your VertixHub store is ready to serve customers worldwide. 