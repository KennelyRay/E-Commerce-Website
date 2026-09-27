import { CartItem, Product } from '@/types';

// Only device-local state lives here: the cart and the one saved PC build.
// Accounts, orders and stock are on the server (lib/api.ts).
const STORAGE_KEYS = {
  cart: 'vertixhub_cart',
  savedBuild: 'vertixhub_saved_build',
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked; the cart still works for this visit.
  }
}

/**
 * Merges duplicate lines and refreshes each product from the live catalog, capping
 * quantities at current stock. Lines for products the catalog no longer has are
 * dropped once the catalog has loaded.
 */
export function hydrateCartItems(items: CartItem[], catalog: Product[]): CartItem[] {
  const latest = new Map(catalog.map((product) => [product.id, product]));
  const merged = new Map<string, CartItem>();

  items.forEach((item) => {
    const product = catalog.length ? latest.get(item.product.id) : item.product;
    if (!product) return;
    const existing = merged.get(product.id);
    const quantity = Math.min(product.stock, Math.max(0, item.quantity + (existing?.quantity ?? 0)));
    if (quantity > 0) {
      merged.set(product.id, { id: existing?.id ?? item.id, product, quantity });
    }
  });

  return Array.from(merged.values());
}

export function getStoredCartItems(): CartItem[] {
  return readJson<CartItem[]>(STORAGE_KEYS.cart, []);
}

export function saveStoredCartItems(items: CartItem[]) {
  writeJson(STORAGE_KEYS.cart, items);
}

export function saveBuildSnapshot(snapshot: Record<string, unknown>) {
  writeJson(STORAGE_KEYS.savedBuild, snapshot);
}

export function getBuildSnapshot<T>() {
  return readJson<T | null>(STORAGE_KEYS.savedBuild, null);
}
