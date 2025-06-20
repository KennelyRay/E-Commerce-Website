# VertixHub - PC Hardware E-Commerce Store

A premium PC hardware e-commerce website built with Next.js, featuring a complete shopping experience for PC enthusiasts and builders.

## 🚀 Features

### Core E-Commerce Features
- **Product Catalog**: Browse extensive collection of PC components
- **Advanced Search & Filtering**: Find products by category, price, rating
- **Shopping Cart**: Add, remove, and modify cart items
- **User Authentication**: Register, login, and manage user accounts
- **Admin Panel**: Comprehensive admin dashboard for user management
- **PC Builder Tool**: Interactive component selector for building custom PCs

### Technical Features
- **Static Site Generation**: Optimized for GitHub Pages hosting
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Type-safe development
- **Modern UI**: Clean, professional design with gradient themes
- **Fast Performance**: Optimized for speed and SEO

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: GitHub Pages (Static Export)
- **Data Storage**: Static JSON + localStorage for user data

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/E-Commerce-Website.git
   cd E-Commerce-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Build & Deploy

### Development
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
```

### GitHub Pages Deployment
```bash
npm run deploy    # Build and prepare for GitHub Pages
```

The site will be available at: `https://your-username.github.io/E-Commerce-Website`

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── pc-builder/        # PC building tool
├── components/            # Reusable UI components
├── context/               # React Context providers
├── data/                  # Static product data (JSON)
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── lib/                   # Utility functions
```

## 🎨 Brand Identity

- **Name**: VertixHub
- **Theme**: Purple/Pink gradient design
- **Focus**: Premium PC hardware components
- **Target**: Gaming enthusiasts and PC builders

## 🔐 Admin Access

**Default Admin Credentials:**
- Username: `Admin`
- Password: `12345`

Admin features include:
- User management (ban/unban)
- Product catalog viewing
- Sales statistics
- Low stock alerts

## 📱 Key Pages

- **Landing Page**: Login/Register with VertixHub branding
- **Home**: Hero section with featured products and categories
- **Products**: Complete catalog with search and filtering
- **PC Builder**: Interactive tool for building custom PCs
- **Admin Panel**: Comprehensive dashboard for store management
- **Account**: User profile and settings

## 🎯 Product Categories

- Graphics Cards (GPUs)
- Processors (CPUs)
- Motherboards
- Memory (RAM)
- Storage (SSDs/HDDs)
- Power Supplies (PSUs)
- PC Cases
- Cooling Solutions
- Peripherals
- Monitors

## 🚀 Performance Features

- **Static Generation**: All pages pre-built for fast loading
- **Image Optimization**: Responsive images with lazy loading
- **Code Splitting**: Automatic code splitting for faster page loads
- **SEO Optimized**: Meta tags and structured data
- **Mobile Responsive**: Perfect experience on all devices

## 🛡️ Data Management

- **Products**: Static JSON data for consistent product catalog
- **Users**: localStorage for user accounts and authentication
- **Cart**: localStorage for shopping cart persistence
- **Orders**: localStorage for order history

## 🔧 Customization

### Adding Products
Edit `data/products.json` to add or modify products:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "description": "Product description",
  "price": 999.99,
  "originalPrice": 1199.99,
  "image": "https://example.com/image.jpg",
  "category": "Graphics Cards",
  "stock": 50,
  "rating": 4.5,
  "reviews": 123,
  "featured": true,
  "tags": ["gaming", "rgb", "high-performance"]
}
```

### Styling
Customize the theme in `tailwind.config.js`:
- Primary colors
- Gradient backgrounds
- Component styles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@vertixhub.com
- GitHub Issues: [Create an issue](https://github.com/your-username/E-Commerce-Website/issues)

---

**VertixHub** - Build Your Dream PC 🚀
