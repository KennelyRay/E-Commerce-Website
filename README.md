# VertixHub - Premium PC Hardware E-commerce Store

A modern, fully responsive e-commerce website built with Next.js 14, TypeScript, and Tailwind CSS. Specialized in PC hardware components with a beautiful purple/pink gradient theme.

## 🚀 Live Demo & Deployment

### Quick Deployment Options

1. **GitHub Pages (Free)** ⭐ Recommended
   ```bash
   # Push to GitHub repository
   # Enable GitHub Actions in Settings → Pages
   # Automatic deployment on every push
   ```

2. **Local Testing**
   ```bash
   npm install          # Install dependencies
   npm run dev         # Development server
   npm run deploy      # Build for production (Windows)
   npm run deploy:unix # Build for production (Mac/Linux)
   npm run serve       # Preview production build
   ```

3. **One-Click Hosting**
   - [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
   - [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog** - Browse premium PC components
- **Smart Search** - Filter by category, price, and features
- **Shopping Cart** - Add, remove, and modify quantities
- **Checkout Process** - Complete order flow
- **User Accounts** - Registration and login system
- **Admin Panel** - Product and user management

### 🎨 Modern Design
- **Responsive Design** - Mobile-first approach
- **Purple/Pink Gradient Theme** - Beautiful modern aesthetic
- **Smooth Animations** - Engaging user interactions
- **Professional UI** - Clean and intuitive interface

### ⚡ Performance & SEO
- **Static Site Generation** - Lightning-fast loading
- **Image Optimization** - Optimized for web delivery
- **SEO Optimized** - Meta tags and structured data
- **PWA Ready** - Progressive web app capabilities

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Hosting:** Static export compatible with any host

## 📦 PC Hardware Categories

- **Graphics Cards** - NVIDIA RTX, AMD Radeon series
- **Processors** - Intel Core, AMD Ryzen CPUs
- **Motherboards** - Gaming and workstation boards
- **Memory (RAM)** - DDR4/DDR5 with RGB lighting
- **Storage** - NVMe SSDs, SATA drives
- **Power Supplies** - 80+ certified PSUs
- **Cases** - Mid-tower, full-tower cases
- **Cooling** - Air and liquid cooling solutions

## 🔐 Authentication System

### User Features
- Account registration and login
- Profile management
- Order history (localStorage based)
- Shopping cart persistence

### Admin Features
- **Username:** Admin
- **Password:** 12345
- Product management (add, edit, delete)
- User management and moderation
- Sales analytics and inventory tracking

## 💾 Data Storage

Currently uses **localStorage** for data persistence, making it compatible with static hosting platforms like GitHub Pages. All user data, products, and shopping cart contents are stored locally in the browser.

### To Use a Database:
For production with real data persistence, consider:
- **MongoDB Atlas** + **Next.js API Routes**
- **Supabase** for PostgreSQL
- **Firebase Firestore**
- **PlanetScale** for MySQL

## 📱 Pages & Routes

- `/` - Login/Registration landing page
- `/home` - Main homepage (authenticated)
- `/products` - Product catalog with filtering
- `/products/[id]` - Individual product pages
- `/categories` - Browse by hardware category
- `/cart` - Shopping cart management
- `/checkout` - Order completion
- `/account` - User profile and settings
- `/admin` - Admin dashboard and management
- `/about` - Company information
- `/contact` - Contact form and support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git for version control

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/vertixhub-ecommerce.git

# Navigate to project directory
cd vertixhub-ecommerce

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Windows
npm run deploy

# Mac/Linux/CI
npm run deploy:unix

# Preview production build
npm run serve
```

## 🌐 Hosting Configuration

### Static Export Optimized
- ✅ Next.js static export enabled
- ✅ Image optimization disabled for static hosting
- ✅ Trailing slash handling
- ✅ No server-side functionality required

### Files Generated
- Static HTML, CSS, and JavaScript files
- Pre-rendered product pages
- SEO-friendly URLs
- `.nojekyll` file for GitHub Pages

### Hosting Platforms Tested
- ✅ GitHub Pages
- ✅ Vercel
- ✅ Netlify
- ✅ Firebase Hosting
- ✅ AWS S3 + CloudFront

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run deploy       # Build and prepare for deployment (Windows)
npm run deploy:unix  # Build and prepare for deployment (Unix)
npm run serve        # Preview production build
npm run lint         # Run ESLint
npm run clean        # Clean build artifacts
```

## 🎯 Key Features Implemented

### Frontend Features
- [x] Responsive design with mobile-first approach
- [x] Purple/pink gradient theme throughout
- [x] Smooth animations and transitions
- [x] Product filtering and search
- [x] Shopping cart with persistence
- [x] User authentication system
- [x] Admin panel with management features

### Backend Features (localStorage)
- [x] User registration and login
- [x] Product data management
- [x] Shopping cart persistence
- [x] Admin authentication
- [x] User ban/unban functionality

### Performance Features
- [x] Static site generation
- [x] Optimized bundle size
- [x] Image optimization
- [x] Code splitting
- [x] SEO optimization

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration for static export
- `tailwind.config.js` - Custom purple/pink theme colors
- `package.json` - Dependencies and build scripts
- `.github/workflows/deploy.yml` - Automated deployment
- `public/.nojekyll` - GitHub Pages configuration

## 📞 Support & Documentation

- **Deployment Guide:** See `DEPLOYMENT.md` for detailed hosting instructions
- **Issue Tracking:** Use GitHub Issues for bug reports
- **Feature Requests:** Open a GitHub Discussion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build process
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**VertixHub** - Built with ❤️ for PC enthusiasts worldwide.
