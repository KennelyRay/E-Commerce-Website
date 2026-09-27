'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { api, errorMessage } from '@/lib/api';
import { Product } from '@/types';

type CatalogState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

// One shared copy of the catalog for every component, fetched once per visit
// and refreshed after anything that changes stock or prices.
let state: CatalogState = { products: [], isLoading: true, error: null };
let inflight: Promise<void> | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function setState(next: Partial<CatalogState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

export function refreshCatalog() {
  inflight ??= api<Product[]>('/products', { auth: false })
    .then((products) => {
      loaded = true;
      setState({ products, isLoading: false, error: null });
    })
    .catch((error) => setState({ isLoading: false, error: errorMessage(error) }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Latest catalog without subscribing, for code outside React (cart hydration). */
export function getCatalogSnapshot() {
  return state.products;
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const serverState: CatalogState = { products: [], isLoading: true, error: null };

export function useCatalog() {
  const snapshot = useSyncExternalStore(subscribeCatalog, () => state, () => serverState);

  useEffect(() => {
    if (!loaded) void refreshCatalog();
  }, []);

  return { ...snapshot, reload: refreshCatalog };
}
