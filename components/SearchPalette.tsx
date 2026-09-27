'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';
import { useCatalog } from '@/hooks/useCatalog';
import { formatPrice } from '@/lib/format';
import { CATEGORY_INFO, categoryHref } from '@/lib/categories';
import { keySpecLine } from '@/components/ProductCard';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

export function matchesQuery(product: Product, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [
    product.name,
    product.category,
    product.description,
    ...product.tags,
    ...Object.values(product.specifications ?? {}),
  ]
    .join(' ')
    .toLowerCase();

  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

export function SearchPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { products } = useCatalog();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    return products.filter((product) => matchesQuery(product, query)).slice(0, 6);
  }, [products, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) {
    return null;
  }

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const seeAllHref = `/products?query=${encodeURIComponent(query.trim())}`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const total = results.length + 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % total);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + total) % total);
    } else if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      go(activeIndex < results.length ? productHref(results[activeIndex].id) : seeAllHref);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[10vh]">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search parts"
        className="relative w-full max-w-xl animate-pop-in overflow-hidden rounded-card bg-surface shadow-overlay"
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by part, brand or spec, e.g. AM5, DDR5, 850W"
            className="h-14 w-full bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={query.trim() ? `search-option-${activeIndex}` : undefined}
            aria-label="Search parts"
          />
          <button type="button" onClick={onClose} className="icon-btn -mr-2 shrink-0" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!query.trim() ? (
          <div className="p-4">
            <p className="spec-key mb-2">Browse a category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_INFO.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => go(categoryHref(category.name))}
                  className="min-h-[36px] rounded-control border border-line px-3 text-sm text-ink transition-colors hover:border-ink/40 hover:bg-sunken"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted">No parts match &ldquo;{query.trim()}&rdquo;.</li>
            )}
            {results.map((product, index) => (
              <li
                key={product.id}
                id={`search-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(productHref(product.id))}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${activeIndex === index ? 'bg-sunken' : ''}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-white p-1">
                  <ProductImage src={product.image} alt="" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product.name}</p>
                  <p className="truncate font-mono text-xs text-muted">{keySpecLine(product) || product.category}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatPrice(product.price)}</span>
              </li>
            ))}
            <li
              id={`search-option-${results.length}`}
              role="option"
              aria-selected={activeIndex === results.length}
              onMouseEnter={() => setActiveIndex(results.length)}
              onClick={() => go(seeAllHref)}
              className={`mx-2 mt-1 cursor-pointer rounded-control px-2 py-2.5 text-sm font-medium ${
                activeIndex === results.length ? 'bg-sunken' : ''
              }`}
            >
              See all results for &ldquo;{query.trim()}&rdquo;
            </li>
          </ul>
        )}

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2 text-xs text-muted sm:flex">
          <span>
            <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd> to move
          </span>
          <span>
            <kbd className="font-mono">Enter</kbd> to open
          </span>
          <span>
            <kbd className="font-mono">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
