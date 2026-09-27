'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/hooks/useCatalog';
import { categoryHref, summarizeCategories } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { Reveal } from '@/components/Reveal';
import { Breadcrumbs, EmptyState } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

export default function CategoriesPage() {
  const { products, isLoading, error } = useCatalog();
  const categories = useMemo(() => summarizeCategories(products), [products]);

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Categories' }]} />
      <div className="mt-4 max-w-2xl border-b border-line pb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Categories</h1>
        <p className="mt-2 text-muted">Every part we stock, grouped the way you would spec a build: platform first, then graphics, storage and power.</p>
      </div>

      {error ? (
        <div className="mt-8">
          <EmptyState title="Categories did not load" body={error} />
        </div>
      ) : (
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => <li key={index} className="skeleton h-48 rounded-card" />)
            : categories.map((category, index) => {
                const items = products.filter((product) => product.category === category.name);
                return (
                  <Reveal as="li" key={category.name} delay={(index % 2) * 60} className="card flex flex-col overflow-hidden transition-colors hover:border-ink/30 sm:flex-row">
                    <Link href={categoryHref(category.name)} prefetch={false} className="group flex shrink-0 items-center justify-center bg-white p-6 sm:w-44" tabIndex={-1} aria-hidden="true">
                      {category.image && <ProductImage src={category.image} alt="" loading="lazy" className="h-32 w-full object-contain transition-transform duration-300 group-hover:scale-105" />}
                    </Link>
                    <div className="flex flex-1 flex-col border-t border-line p-5 sm:border-l sm:border-t-0">
                      <p className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</p>
                      <h2 className="mt-1 text-xl font-bold">
                        <Link href={categoryHref(category.name)} prefetch={false} className="hover:underline underline-offset-4">
                          {category.name}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted">{category.blurb}</p>
                      <ul className="mt-3 space-y-1 text-sm">
                        {items.map((product) => (
                          <li key={product.id} className="flex justify-between gap-3">
                            <Link href={productHref(product.id)} prefetch={false} className="truncate hover:underline underline-offset-4">
                              {product.name}
                            </Link>
                            <span className="shrink-0 tabular-nums text-muted">{formatPrice(product.price)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-auto pt-4 font-mono text-xs text-muted">
                        {category.count} {category.count === 1 ? 'part' : 'parts'} · {category.inStock} in stock ·{' '}
                        {category.minPrice === category.maxPrice
                          ? formatPrice(category.minPrice)
                          : `${formatPrice(category.minPrice, { whole: true })} to ${formatPrice(category.maxPrice, { whole: true })}`}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
        </ol>
      )}
    </div>
  );
}
