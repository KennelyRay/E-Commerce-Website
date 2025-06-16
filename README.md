# VertixHub - Premium PC Hardware Store

A fully functional, modern e-commerce website specialized in PC components and gaming hardware. Built with Next.js 14, React 18, TypeScript, and Tailwind CSS. Features user authentication, admin panel, and complete shopping functionality.

## 🚀 Features

### Core E-Commerce Functionality
- **PC Hardware Catalog**: Specialized product catalog for graphics cards, processors, motherboards, RAM, storage, PSUs, cases, and cooling
- **Advanced Search & Filtering**: Find products by name, category, price range, and ratings
- **Shopping Cart**: Add/remove items, adjust quantities, persistent cart using localStorage
- **Complete Checkout Process**: Order form with shipping and payment information
- **Responsive Design**: Fully responsive across all device sizes

### Authentication & User Management
- **User Registration & Login**: Secure account creation and authentication
- **Admin Authentication**: Special admin login (Admin/12345) with elevated privileges
- **User Profiles**: Personal account pages with profile information
- **Session Management**: Persistent login with localStorage

### Admin Panel Features
- **Product Management**: Add, edit, delete, and manage product inventory
- **Stock Management**: Track and update product stock levels
- **User Management**: View registered users and ban/unban accounts
- **Sales Dashboard**: View total users, products, revenue estimates, and low stock alerts
- **Category Management**: Organize products by PC component categories

### User Experience
- **Modern Purple/Pink Theme**: Custom gradient design with VertixHub branding
- **Toast Notifications**: Real-time feedback for all user actions
- **Protected Routes**: Authentication-required pages with automatic redirects
- **Product Details**: Comprehensive product pages with specs and reviews
- **Related Products**: Smart recommendations for PC builders

### Technical Features
- **Static Export Compatible**: Optimized for GitHub Pages deployment
- **TypeScript**: Full type safety throughout the application
- **Performance Optimized**: Fast loading with Next.js 14 optimizations
- **Mobile-First**: Responsive design that works on all devices
- **Local Storage Database**: Client-side data persistence for users, products, and cart

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom purple/pink gradient theme
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API with useReducer
- **Authentication**: Custom implementation with localStorage
- **Data Storage**: JSON files + localStorage for all data persistence
- **Deployment**: GitHub Pages (static export)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vertixhub.git
   cd vertixhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication

### User Accounts
- Create account with email and password
- Login with registered credentials
- Automatic redirect based on user type

### Admin Access
- **Username**: Admin
- **Password**: 12345
- Access to admin panel with full management capabilities

### Features by User Type
- **Regular Users**: Shopping, cart management, profile viewing
- **Administrators**: All user features + product management + user management + analytics

## 🚀 Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to Pages section
   - Set source to "GitHub Actions"

2. **Push to main branch**
   ```bash
   git push origin main
   ```

3. **Automatic deployment**
   - GitHub Actions will automatically build and deploy
   - Your site will be available at `https://username.github.io/repository-name`

## 📁 Project Structure

```
vertixhub/
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles with custom gradients
│   ├── layout.tsx         # Root layout with auth provider
│   ├── page.tsx          # Login/Register page (landing)
│   ├── home/             # Main homepage (post-login)
│   ├── admin/            # Admin panel
│   ├── account/          # User profile page
│   ├── products/         # Products catalog
│   ├── cart/            # Shopping cart
│   └── checkout/        # Checkout process
├── components/           # Reusable components
│   ├── Navbar.tsx       # Navigation with auth state
│   ├── Footer.tsx       # Footer with VertixHub branding
│   ├── Hero.tsx         # Hero section
│   ├── ProductCard.tsx  # Product display cards
│   └── CategoryGrid.tsx # PC component categories
├── context/             # React Context
│   ├── CartContext.tsx  # Cart state management
│   └── AuthContext.tsx  # Authentication state
├── data/               # Static data
│   └── products.json   # PC hardware product database
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions for all entities
└── public/             # Static assets
```

## 🎨 Customization

### Adding PC Components

Edit `data/products.json` to add or modify PC hardware:

```json
{
  "id": "unique-id",
  "name": "NVIDIA GeForce RTX 4090",
  "description": "Ultimate gaming graphics card...",
  "price": 1599.99,
  "originalPrice": 1699.99,
  "image": "component-image-url",
  "category": "Graphics Cards",
  "stock": 12,
  "rating": 4.9,
  "reviews": 324,
  "featured": true,
  "tags": ["nvidia", "rtx", "gaming", "ray-tracing"]
}
```

### Branding & Styling

The project uses a custom purple/pink gradient theme. Customize in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Purple gradient colors
  },
  purple: {
    // Purple color palette
  },
  pink: {
    // Pink color palette
  }
},
backgroundImage: {
  'gradient-primary': 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
}
```

### Admin Panel Configuration

Modify admin credentials in `context/AuthContext.tsx`:

```javascript
// Check admin credentials
if (email === 'Admin' && password === '12345') {
  // Admin user creation
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files for deployment

## 🌟 Key Features Breakdown

### Authentication System
- User registration and login
- Admin authentication
- Session persistence
- Route protection
- Automatic redirects

### Shopping Experience
- PC component catalog
- Advanced filtering
- Shopping cart with persistence
- Complete checkout flow
- Order confirmation

### Admin Management
- Product CRUD operations
- Stock level management
- User account management
- Sales analytics dashboard
- Low stock alerts

### User Experience
- Purple/pink gradient theme
- Responsive design
- Toast notifications
- Loading states
- Error handling

## 🛡️ Security Features

- Client-side authentication state management
- Protected route implementation
- Admin privilege separation
- User ban/unban functionality
- Session validation

## 🚀 PC Hardware Categories

- **Graphics Cards**: NVIDIA RTX, AMD Radeon series
- **Processors**: Intel Core, AMD Ryzen CPUs
- **Motherboards**: Gaming and professional motherboards
- **Memory (RAM)**: DDR4 and DDR5 memory kits
- **Storage**: NVMe SSDs and traditional storage
- **Power Supplies**: Modular and non-modular PSUs
- **Cases**: Gaming cases with RGB and airflow
- **Cooling**: Air coolers and liquid cooling solutions

## 📞 Support

For support, email support@vertixhub.com or create an issue in the GitHub repository.

---

Built with ❤️ for PC enthusiasts using Next.js and Tailwind CSS
