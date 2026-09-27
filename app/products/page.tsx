'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCatalog } from '@/hooks/useCatalog';
import { useDialog } from '@/hooks/useDialog';
import { summarizeCategories } from '@/lib/categories';
import { discountPercent, formatPrice } from '@/lib/format';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { matchesQuery } from '@/components/SearchPalette';
import { Breadcrumbs, EmptyState, PageLoader } from '@/components/ui';
import { Product } from '@/types';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'discount' | 'name' | 'newest';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Staff picks first' },
  { value: 'price-low', label: 'Price, low to high' },
  { value: 'price-high', label: 'Price, high to low' },
  { value: 'discount', label: 'Biggest markdown' },
  { value: 'newest', label: 'Newest additions' },
  { value: 'name', label: 'Name, A to Z' },
];

type Filters = {
  category: string;
  query: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
};

const EMPTY_FILTERS: Filters = { category: 'All', query: '', minPrice: '', maxPrice: '', inStock: false, onSale: false };

function sortProducts(products: Product[], sort: SortKey) {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'discount':
        return discountPercent(b) - discountPercent(a);
      case 'newest':
        return Number(b.id) - Number(a.id);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
      default:
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
    }
  });
}

function FilterPanel({
  filters,
  setFilters,
  categories,
  total,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: Array<{ name: string; count: number }>;
  total: number;
}) {
  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="spec-key mb-2">Category</legend>
        <div className="space-y-0.5">
          {[{ name: 'All', count: total }, ...categories].map((category) => {
            const checked = filters.category === category.name;
            return (
              <label
                key={category.name}
                className={`flex min-h-[40px] cursor-pointer items-center justify-between rounded-control px-2.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-accent ${
                  checked ? 'bg-ink text-bg' : 'text-ink hover:bg-sunken'
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={checked}
                    onChange={() => update({ category: category.name })}
                    className="sr-only"
                  />
                  {category.name === 'All' ? 'All parts' : category.name}
                </span>
                <span className={`font-mono text-xs ${checked ? 'text-bg/75' : 'text-muted'}`}>{category.count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="spec-key mb-2">Price (₱)</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="min-price"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(event) => update({ minPrice: event.target.value })}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="max-price"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(event) => update({ maxPrice: event.target.value })}
              className="field"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="spec-key mb-2">Availability</legend>
        {(
          [
            ['inStock', 'In stock only'],
            ['onSale', 'Marked down'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={(event) => update({ [key]: event.target.checked })}
              className="h-4 w-4 rounded border-line accent-[rgb(var(--accent))]"
            />
            {label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function FilterSheet({ isOpen, onClose, children, resultCount }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; resultCount: number }) {
  const ref = useDialog<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-x-0 bottom-0 flex max-h-[85vh] animate-pop-in flex-col rounded-t-card bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <h2 className="text-lg font-bold">Filters</h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close filters">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="border-t border-line p-4">
          <button type="button" onClick={onClose} className="btn-dark w-full">
            Show {resultCount} {resultCount === 1 ? 'part' : 'parts'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Catalog() {
  const { products, isLoading, error } = useCatalog();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY_FILTERS,
    category: searchParams?.get('category') || 'All',
    query: searchParams?.get('query') || '',
  }));
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'row'>('grid');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Follow navigation from outside the page (header search, category links).
  useEffect(() => {
    const category = searchParams?.get('category') || 'All';
    const query = searchParams?.get('query') || '';
    setFilters((current) =>
      current.category === category && current.query.trim() === query ? current : { ...current, category, query },
    );
  }, [searchParams]);

  // Keep category and search in the URL so a filtered view can be shared.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== 'All') params.set('category', filters.category);
    if (filters.query.trim()) params.set('query', filters.query.trim());
    const next = params.toString();
    if (next !== (searchParams?.toString() ?? '')) {
      router.replace(next ? `${pathname}?${next}` : pathname ?? '/products', { scroll: false });
    }
    // searchParams is intentionally left out: this effect only pushes local changes outward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.query, pathname, router]);

  const categories = useMemo(() => summarizeCategories(products).map(({ name, count }) => ({ name, count })), [products]);

  const results = useMemo(() => {
    const min = filters.minPrice ? Number(filters.minPrice) : 0;
    const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
    const filtered = products.filter(
      (product) =>
        (filters.category === 'All' || product.category === filters.category) &&
        matchesQuery(product, filters.query) &&
        product.price >= min &&
        product.price <= max &&
        (!filters.inStock || product.stock > 0) &&
        (!filters.onSale || discountPercent(product) > 0),
    );
    return sortProducts(filtered, sort);
  }, [products, filters, sort]);

  const chips: Array<{ label: string; clear: Partial<Filters> }> = [];
  if (filters.category !== 'All') chips.push({ label: filters.category, clear: { category: 'All' } });
  if (filters.query.trim()) chips.push({ label: `"${filters.query.trim()}"`, clear: { query: '' } });
  if (filters.minPrice) chips.push({ label: `From ${formatPrice(Number(filters.minPrice), { whole: true })}`, clear: { minPrice: '' } });
  if (filters.maxPrice) chips.push({ label: `Up to ${formatPrice(Number(filters.maxPrice), { whole: true })}`, clear: { maxPrice: '' } });
  if (filters.inStock) chips.push({ label: 'In stock', clear: { inStock: false } });
  if (filters.onSale) chips.push({ label: 'Marked down', clear: { onSale: false } });

  const title = filters.query.trim() && filters.category === 'All' ? `Results for "${filters.query.trim()}"` : filters.category === 'All' ? 'All parts' : filters.category;
  const resultKey = JSON.stringify({ ...filters, sort, view });

  const panel = <FilterPanel filters={filters} setFilters={setFilters} categories={categories} total={products.length} />;

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Shop', href: filters.category !== 'All' ? '/products' : undefined }, ...(filters.category !== 'All' ? [{ label: filters.category }] : [])]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {isLoading ? 'Loading parts' : `${results.length} of ${products.length} ${products.length === 1 ? 'part' : 'parts'}`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <label htmlFor="catalog-search" className="sr-only">
            Search within the catalog
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            placeholder="Filter by name or spec"
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            className="field pl-9"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{panel}</div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setIsSheetOpen(true)} className="btn-outline px-3 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters{chips.length ? ` (${chips.length})` : ''}
            </button>

            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, ...chip.clear }))}
                className="inline-flex min-h-[36px] animate-fade-in items-center gap-1.5 rounded-control bg-sunken px-3 text-sm text-ink transition-colors hover:bg-line"
                aria-label={`Remove filter ${chip.label}`}
              >
                {chip.label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
            {chips.length > 1 && (
              <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="min-h-[36px] px-2 text-sm text-muted underline underline-offset-4 hover:text-ink">
                Clear all
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select id="sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="field h-10 min-h-0 w-auto py-0 pr-8 text-sm">
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="hidden rounded-control border border-line bg-surface p-0.5 sm:flex" role="group" aria-label="Layout">
                {(
                  [
                    ['grid', LayoutGrid, 'Grid view'],
                    ['row', List, 'List view'],
                  ] as const
                ).map(([value, Icon, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setView(value)}
                    aria-pressed={view === value}
                    aria-label={label}
                    className={`flex h-9 w-9 items-center justify-center rounded-[4px] transition-colors ${view === value ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error ? (
            <EmptyState title="The catalog did not load" body={error} action={<button type="button" className="btn-dark" onClick={() => window.location.reload()}>Reload the page</button>} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title="No parts match these filters"
              body="Try a wider price range or a different category. Search matches names, brands and specs such as AM5 or DDR5."
              action={
                <button type="button" className="btn-dark" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Clear all filters
                </button>
              }
            />
          ) : (
            <div key={resultKey} className={view === 'grid' ? 'grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
              {results.map((product, index) => (
                <div key={product.id} className="animate-pop-in [animation-fill-mode:both]" style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}>
                  <ProductCard product={product} layout={view} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} resultCount={results.length}>
        {panel}
      </FilterSheet>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading parts" />}>
      <Catalog />
    </Suspense>
  );
}
