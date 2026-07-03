import productsData from '@/data/products.json';
import { Address, CartItem, Order, PaymentMethod, Product, User } from '@/types';

const STORAGE_KEYS = {
  cart: 'vertixhub_cart',
  currentUser: 'vertixhub_current_user',
  orders: 'vertixhub_orders',
  productOverrides: 'vertixhub_product_overrides',
  savedBuild: 'vertixhub_saved_build',
  users: 'vertixhub_users',
} as const;

type ProductOverride = Partial<Pick<Product, 'featured' | 'originalPrice' | 'price' | 'stock'>>;

type CheckoutPayload = {
  user: User;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

const baseProducts = productsData.products as Product[];

const adminUser: User = {
  id: 'admin-1',
  name: 'Administrator',
  username: 'Admin',
  email: 'admin@vertixhub.com',
  password: '12345',
  isAdmin: true,
  isBanned: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage`, error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function emitStorefrontUpdate(eventName = 'vertixhub:storefront-updated') {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
}

export function getCatalogProducts(): Product[] {
  const overrides = readJson<Record<string, ProductOverride>>(STORAGE_KEYS.productOverrides, {});

  return baseProducts.map((product) => {
    const override = overrides[product.id];

    return {
      ...product,
      ...override,
      price: Number(override?.price ?? product.price),
      stock: Math.max(0, Math.floor(Number(override?.stock ?? product.stock))),
      featured: override?.featured ?? product.featured ?? false,
    };
  });
}

export function getCatalogProductById(productId: string) {
  return getCatalogProducts().find((product) => product.id === productId);
}

export function updateCatalogProduct(
  productId: string,
  updates: ProductOverride,
): Product | undefined {
  const overrides = readJson<Record<string, ProductOverride>>(STORAGE_KEYS.productOverrides, {});
  const currentOverride = overrides[productId] ?? {};

  overrides[productId] = {
    ...currentOverride,
    ...updates,
  };

  writeJson(STORAGE_KEYS.productOverrides, overrides);
  emitStorefrontUpdate();

  return getCatalogProductById(productId);
}

export function getUsers(): User[] {
  const storedUsers = readJson<User[]>(STORAGE_KEYS.users, []);

  if (!storedUsers.some((user) => user.username === adminUser.username)) {
    const nextUsers = [...storedUsers, adminUser];
    writeJson(STORAGE_KEYS.users, nextUsers);
    return nextUsers;
  }

  return storedUsers;
}

export function saveUsers(users: User[]) {
  writeJson(STORAGE_KEYS.users, users);
  emitStorefrontUpdate();
}

export function ensureAdminUser() {
  return getUsers();
}

export function getCurrentUser(): User | null {
  return readJson<User | null>(STORAGE_KEYS.currentUser, null);
}

export function setCurrentUser(user: User | null) {
  if (!isBrowser()) {
    return;
  }

  if (user) {
    writeJson(STORAGE_KEYS.currentUser, user);
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.currentUser);
  }

  emitStorefrontUpdate('vertixhub:auth-updated');
}

export function hydrateCartItems(items: CartItem[]): CartItem[] {
  const latestProducts = new Map(getCatalogProducts().map((product) => [product.id, product]));
  const mergedByProductId = new Map<string, CartItem>();

  items.forEach((item) => {
    const latestProduct = latestProducts.get(item.product.id) ?? item.product;
    const existingItem = mergedByProductId.get(latestProduct.id);
    const nextQuantity = Math.min(
      latestProduct.stock,
      Math.max(0, item.quantity + (existingItem?.quantity ?? 0)),
    );

    if (nextQuantity > 0) {
      mergedByProductId.set(latestProduct.id, {
        id: existingItem?.id ?? item.id,
        product: latestProduct,
        quantity: nextQuantity,
      });
    }
  });

  return Array.from(mergedByProductId.values());
}

export function getStoredCartItems(): CartItem[] {
  const items = readJson<CartItem[]>(STORAGE_KEYS.cart, []);
  return hydrateCartItems(items);
}

export function saveStoredCartItems(items: CartItem[]) {
  writeJson(STORAGE_KEYS.cart, hydrateCartItems(items));
  emitStorefrontUpdate();
}

export function getOrders(): Order[] {
  return readJson<Order[]>(STORAGE_KEYS.orders, []);
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders()
    .filter((order) => order.userId === userId)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export function saveBuildSnapshot(snapshot: Record<string, unknown>) {
  writeJson(STORAGE_KEYS.savedBuild, snapshot);
}

export function getBuildSnapshot<T>() {
  return readJson<T | null>(STORAGE_KEYS.savedBuild, null);
}

export function placeOrder(payload: CheckoutPayload): Order {
  const catalog = new Map(getCatalogProducts().map((product) => [product.id, product]));

  payload.items.forEach((item) => {
    const latestProduct = catalog.get(item.product.id);

    if (!latestProduct) {
      throw new Error(`Product ${item.product.id} is no longer available.`);
    }

    if (latestProduct.stock < item.quantity) {
      throw new Error(`Only ${latestProduct.stock} unit(s) left for ${latestProduct.name}.`);
    }
  });

  payload.items.forEach((item) => {
    const latestProduct = catalog.get(item.product.id);

    if (latestProduct) {
      updateCatalogProduct(item.product.id, {
        stock: latestProduct.stock - item.quantity,
      });
    }
  });

  const createdAt = new Date().toISOString();
  const estimatedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: `VTX-${Date.now().toString(36).toUpperCase()}`,
    userId: payload.user.id,
    items: hydrateCartItems(payload.items),
    subtotal: payload.subtotal,
    shipping: payload.shipping,
    tax: payload.tax,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    status: 'paid',
    createdAt,
    estimatedDelivery: estimatedDeliveryDate,
    shippingAddress: payload.shippingAddress,
  };

  const orders = getOrders();
  writeJson(STORAGE_KEYS.orders, [order, ...orders]);
  emitStorefrontUpdate();

  return order;
}
