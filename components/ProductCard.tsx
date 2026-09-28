'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatSku } from '@/lib/format';
import { Price, StockTag } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

// The specs a builder compares first in each category.
const KEY_SPECS: Record<string, string[]> = {
  'Graphics Cards': ['Memory', 'Power Consumption'],
  Processors: ['Socket', 'Cores', 'TDP'],
  Motherboards: ['Socket', 'Chipset', 'Form Factor'],
  'Memory (RAM)': ['Capacity', 'Speed'],
  Storage: ['Capacity', 'Interface', 'Form Factor'],
  'Power Supplies': ['Wattage', 'Efficiency'],
  Cases: ['Form Factor'],
  Cooling: ['Type', 'Height', 'Radiator'],
};

export function keySpecLine(product: Product, limit = 3) {
  const keys = KEY_SPECS[product.category] ?? [];
  return keys
    .map((key) => {
      const value = product.specifications?.[key];
      return value && key === 'Cores' ? `${value} cores` : value;
    })
    .filter(Boolean)
    .slice(0, limit)
    .map((value) => (value && value.length > 22 ? `${value.slice(0, 20)}…` : value))
    .join(' · ');
}

type ProductCardProps = {
  product: Product;
  layout?: 'grid' | 'row';
  priority?: boolean;
};

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  const specLine = keySpecLine(product);
  const soldOut = product.stock <= 0;
  const href = productHref(product.id);

  const addButton = (
    <button
      type="button"
      onClick={() => addToCart(product)}
      disabled={soldOut}
      className={layout === 'row' ? 'btn-dark px-4' : 'btn-dark w-full'}
      aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {soldOut ? 'Sold out' : 'Add to cart'}
    </button>
  );

  if (layout === 'row') {
    return (
      <article className="group card flex flex-col gap-4 p-3 transition-colors hover:border-ink/30 sm:flex-row sm:items-center sm:p-4">
        <Link href={href} prefetch={false} className="flex shrink-0 items-center justify-center overflow-hidden rounded-control bg-white p-3 sm:h-32 sm:w-40" tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.image} alt="" loading="lazy" className="h-40 w-full object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:h-full" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="spec-key">
            {product.category} · {formatSku(product.id)}
          </p>
          <h3 className="mt-1 font-sans text-base font-semibold leading-snug" style={{ fontStretch: '100%' }}>
            <Link href={href} prefetch={false} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h3>
          {specLine && <p className="mt-1 font-mono text-xs text-muted">{specLine}</p>}
          <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:w-48 sm:flex-col sm:items-end">
          <div className="sm:text-right">
            <Price product={product} />
            <StockTag stock={product.stock} className="mt-1" />
          </div>
          {addButton}
        </div>
      </article>
    );
  }

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-colors hover:border-ink/30">
      <Link href={href} prefetch={false} className="relative block bg-white" tabIndex={-1} aria-hidden="true">
        <div className="flex aspect-[4/3] items-center justify-center p-6">
          <ProductImage src={product.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          />
        </div>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-control bg-ink px-2 py-1 text-[11px] font-semibold text-bg">Staff pick</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col border-t border-line p-4">
        <p className="spec-key">
          {product.category} · {formatSku(product.id)}
        </p>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] font-sans text-[15px] font-semibold leading-snug" style={{ fontStretch: '100%' }}>
          <Link href={href} prefetch={false} className="after:absolute after:inset-0 hover:underline underline-offset-4">
            {product.name}
          </Link>
        </h3>
        {specLine && <p className="mt-1 truncate font-mono text-xs text-muted">{specLine}</p>}

        <div className="mt-auto pt-4">
          <div className="mb-3">
            <Price product={product} size="sm" />
            <StockTag stock={product.stock} className="mt-1" />
          </div>
          <div className="relative z-10">{addButton}</div>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="space-y-2 border-t border-line p-4">
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton mt-4 h-11 w-full" />
      </div>
    </div>
  );
}
