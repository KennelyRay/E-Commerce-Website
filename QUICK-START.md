# VertixHub - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit: http://localhost:3000

## 🔑 Default Login Credentials

### Admin Account
- **Username:** Admin
- **Password:** 12345
- **Access:** Full admin panel access

### Create New User
- Register a new account on the homepage
- All new users have customer privileges

## 🛠️ Key Features to Test

### 🛍️ Shopping Experience
1. **Browse Products:** Go to `/products` or `/categories`
2. **Add to Cart:** Click "Add to Cart" on any product
3. **View Cart:** Click cart icon in navigation
4. **Checkout:** Complete the checkout process

### 🔧 Admin Panel (Login as Admin)
1. **Dashboard:** View analytics and stats
2. **Products:** Add, edit, or delete products
3. **Users:** Manage user accounts
4. **Database:** Export, import, or reset database
5. **API Test:** Load fresh PC parts data

### 🖥️ PC Builder Tool
1. **Navigate:** Go to `/pc-builder`
2. **Select Components:** Choose CPU, GPU, RAM, etc.
3. **View Total:** See real-time pricing
4. **Add to Cart:** Convert your build to cart

## 📦 Deploy to GitHub Pages

### Quick Deploy
```bash
# Build for production
npm run deploy

# Push to GitHub and enable Pages in settings
git add .
git commit -m "Deploy VertixHub"
git push origin main
```

### Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select "GitHub Actions" as source
4. Your site will be live at: `https://yourusername.github.io/repo-name`

## 🎯 What's Included

✅ **Complete E-commerce Store** - Shopping cart, checkout, user accounts
✅ **Admin Panel** - Product management, user moderation, analytics
✅ **PC Builder Tool** - Interactive PC configuration system
✅ **SQLite Database** - Client-side data persistence
✅ **API Integration** - Real PC parts data from external APIs
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Modern UI** - Purple/pink gradient theme with smooth animations

## 🔧 Configuration

### Environment (Optional)
Create `.env.local` for customization:
```bash
NEXT_PUBLIC_SITE_NAME=YourStoreName
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Branding
- Update logo in `/components/Navbar.tsx`
- Modify colors in `/tailwind.config.js`
- Edit company info in `/app/about/page.tsx`

## 🆘 Need Help?

### Common Issues
- **Port 3000 in use:** Try `npm run dev -- --port 3001`
- **Build errors:** Run `npm run clean` then `npm install`
- **Database issues:** Use admin panel "Reset Database" feature

### Documentation
- `README.md` - Full project documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `README-API.md` - API integration details
- `docs/SQLITE.md` - Database documentation

## 🎉 You're Ready!

The VertixHub e-commerce website is now running and ready for customization. All features are fully functional and the application is production-ready.

**Happy coding! 🚀** 