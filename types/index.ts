export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // Main image for backwards compatibility
  images?: string[]; // Additional images for gallery
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  tags: string[];
  specifications?: Record<string, string | undefined>;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addManyToCart: (products: Array<{ product: Product; quantity?: number }>) => {
    addedUnits: number;
    addedProducts: number;
  };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  lastAddedId: string | null;
  addedTick: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

export type PaymentMethod = 'credit-card' | 'gcash' | 'maya' | 'paypal';

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: Address;
}

export type AuthResult = { ok: true } | { ok: false; message: string; field?: string };

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (name: string, username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface AdminUser extends User {
  orderCount: number;
  spent: number;
}
