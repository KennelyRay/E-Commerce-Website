'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/hooks/useCatalog';
import { summarizeCategories, categoryHref } from '@/lib/categories';
import { runCompatibilityChecks, socketsMatch, getSpec } from '@/lib/compatibility';
import { discountPercent, formatPrice, formatSku } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/pricing';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { Price, StockTag } from '@/components/ui';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

function SectionHeading({ index, title, action }: { index: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
      <h2 className="flex items-baseline gap-3 text-2xl font-bold sm:text-3xl">
        <span className="font-mono text-sm font-normal text-muted">{index}</span>
        {title}
      </h2>
      {action}
    </div>
  );
}

function OnTheBench({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();
  const product = products[activeIndex] ?? products[0];

  if (!product) {
    return <div className="skeleton aspect-[4/5] w-full rounded-card lg:aspect-auto lg:h-full" />;
  }

  const specs = Object.entries(product.specifications ?? {})
    .filter(([, value]) => Boolean(value))
    .slice(0, 4);

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <p className="spec-key">On the bench</p>
        <div className="flex gap-1" role="tablist" aria-label="Staff picks">
          {products.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={entry.name}
              onClick={() => setActiveIndex(index)}
              className={`h-9 min-w-[36px] rounded-control px-2 font-mono text-xs transition-colors ${
                index === activeIndex ? 'bg-ink text-bg' : 'text-muted hover:bg-sunken hover:text-ink'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div key={product.id} className="grid flex-1 animate-fade-in sm:grid-cols-[1.1fr_1fr]" role="tabpanel">
        <Link href={productHref(product.id)} prefetch={false} className="group flex items-center justify-center bg-white p-6" tabIndex={-1} aria-hidden="true">
          <ProductImage src={product.image} alt="" className="aspect-square w-full max-w-[320px] object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
        </Link>
        <div className="flex flex-col border-t border-line p-5 sm:border-l sm:border-t-0">
          <p className="spec-key">
            {product.category} · {formatSku(product.id)}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-tight">
            <Link href={productHref(product.id)} prefetch={false} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h3>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {specs.map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 py-1.5 text-sm">
                <dt className="text-muted">{key}</dt>
                <dd className="text-right font-mono text-[13px]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto pt-5">
            <Price product={product} size="md" />
            <StockTag stock={product.stock} className="mt-1" />
            <button type="button" className="btn-primary mt-4 w-full" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderDemo({ products }: { products: Product[] }) {
  const cpu = products.find((product) => product.category === 'Processors' && getSpec(product, 'Socket'));
  const boards = products.filter((product) => product.category === 'Motherboards');
  const ram = products.find((product) => product.category === 'Memory (RAM)');
  const [boardId, setBoardId] = useState<string | null>(null);

  const board = boards.find((entry) => entry.id === boardId) ?? boards.find((entry) => !socketsMatch(getSpec(entry, 'Socket'), getSpec(cpu, 'Socket'))) ?? boards[0];
  const checks = useMemo(() => runCompatibilityChecks({ cpu, motherboard: board, ram }), [cpu, board, ram]);

  if (!cpu || !board || boards.length < 2) {
    return null;
  }

  return (
    <div className="rounded-card border border-panel-ink/20 bg-panel-ink/5 p-5">
      <p className="font-mono text-xs text-panel-muted">Try it: pair a {cpu.name} with</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Motherboard">
        {boards.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="radio"
            aria-checked={entry.id === board.id}
            onClick={() => setBoardId(entry.id)}
            className={`min-h-[44px] rounded-control border px-3 py-2 text-left text-sm transition-colors ${
              entry.id === board.id ? 'border-panel-accent bg-panel-accent/15 text-panel-ink' : 'border-panel-ink/25 text-panel-ink hover:border-panel-ink/60'
            }`}
          >
            <span className="block font-semibold">{entry.name}</span>
            <span className="font-mono text-xs opacity-75">{getSpec(entry, 'Socket')}</span>
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2" aria-live="polite">
        {checks.map((check) => (
          <li key={`${board.id}-${check.id}`} className="flex animate-fade-in items-start gap-2 text-sm">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                check.status === 'pass' ? 'bg-ok text-panel' : 'bg-danger text-panel'
              }`}
              aria-hidden="true"
            >
              {check.status === 'pass' ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="text-panel-ink">
              <span className="sr-only">{check.status === 'pass' ? 'Pass: ' : 'Problem: '}</span>
              {check.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StorefrontPage() {
  const { products, isLoading, error } = useCatalog();
  const categories = useMemo(() => summarizeCategories(products), [products]);
  const picks = products.filter((product) => product.featured).slice(0, 4);
  const onSale = products
    .filter((product) => discountPercent(product) > 0 && product.stock > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 6);

  return (
    <div>
      {/* Opening: the headline states what the store does; the bench panel is the focal point. */}
      <section className="shell grid gap-8 pb-16 pt-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:pt-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-balance text-[2.5rem] font-extrabold leading-[1.02] sm:text-6xl" style={{ fontStretch: '118%' }}>
            Parts for the PC you are actually building.
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-lg text-muted">
            Graphics cards, CPUs, boards and memory with the specs up front. The builder checks sockets, memory type and
            power draw before you pay.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" prefetch={false} className="btn-dark px-6">
              Shop all parts
            </Link>
            <Link href="/pc-builder" prefetch={false} className="btn-outline px-6">
              Plan a build
            </Link>
          </div>
          {categories.length > 0 && (
            <div className="mt-10">
              <p className="spec-key mb-2">Jump to</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.name}
                    href={categoryHref(category.name)}
                    prefetch={false}
                    className="inline-flex min-h-[36px] items-center rounded-control border border-line bg-surface px-3 text-sm transition-colors hover:border-ink/40"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {error ? (
          <div className="card flex items-center justify-center p-10 text-center text-muted">{error} Refresh the page to try again.</div>
        ) : (
          <OnTheBench products={picks} />
        )}
      </section>

      {/* Category index: reads like a datasheet table of contents. */}
      <Reveal as="section" className="shell pb-16">
        <SectionHeading
          index="01"
          title="Shop by part"
          action={
            <Link href="/categories" prefetch={false} className="link text-sm">
              All categories
            </Link>
          }
        />
        {isLoading ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="skeleton h-16" />
            ))}
          </div>
        ) : (
          <ol className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {categories.map((category, index) => (
              <li key={category.name} className="border-b border-line">
                <Link
                  href={categoryHref(category.name)}
                  prefetch={false}
                  className="group flex min-h-[64px] items-center gap-4 py-3 transition-colors"
                >
                  <span className="w-6 font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-control bg-white p-1.5">
                    {category.image && (
                      <ProductImage src={category.image} alt="" loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold group-hover:underline underline-offset-4">{category.name}</span>
                    <span className="block truncate text-sm text-muted">{category.blurb}</span>
                  </span>
                  <span className="text-right text-sm">
                    <span className="block tabular-nums">from {formatPrice(category.minPrice)}</span>
                    <span className="block text-xs text-muted">
                      {category.count} {category.count === 1 ? 'part' : 'parts'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Reveal>

      <Reveal as="section" className="shell pb-20">
        <SectionHeading
          index="02"
          title="Staff picks"
          action={
            <Link href="/products" prefetch={false} className="link text-sm">
              Shop all parts
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
            : picks.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Reveal>

      {/* Rhythm break: the one dark band on the page, in the logo's black, reserved for the builder. */}
      <Reveal as="section" className="border-y border-line bg-panel text-panel-ink">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <p className="font-mono text-sm text-panel-muted">03 · PC Builder</p>
            <h2 className="mt-3 text-balance text-3xl font-bold text-panel-ink sm:text-4xl">Catch the wrong socket before it ships.</h2>
            <p className="mt-4 max-w-md text-panel-muted">
              Pick one part per slot and the builder checks four things as you go: CPU and board socket, board and memory
              generation, cooler mounting, and power supply headroom.
            </p>
            <Link href="/pc-builder" prefetch={false} className="btn mt-8 bg-panel-accent px-6 text-panel hover:bg-panel-accent/90">
              Open the builder
            </Link>
          </div>
          {!isLoading && <BuilderDemo products={products} />}
        </div>
      </Reveal>

      {onSale.length > 0 && (
        <Reveal as="section" className="shell pt-20">
          <SectionHeading index="04" title="Marked down" />
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {onSale.map((product) => (
              <li key={product.id} className="border-b border-line">
                <Link href={productHref(product.id)} prefetch={false} className="group flex items-center gap-4 py-3">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-control bg-white p-1.5">
                    <ProductImage src={product.image} alt="" loading="lazy" className="h-full w-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold group-hover:underline underline-offset-4">{product.name}</span>
                    <span className="block text-sm text-muted">{product.category}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold tabular-nums text-accent">{formatPrice(product.price)}</span>
                    <span className="block text-xs text-muted">
                      <span className="line-through">{formatPrice(product.originalPrice ?? product.price)}</span> · {discountPercent(product)}% off
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal as="section" className="shell pt-20">
        <SectionHeading index="05" title="How ordering works" />
        <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Shipping', `Free over ${formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })}. A flat ${formatPrice(SHIPPING_FEE, { whole: true })} below that, anywhere in the Philippines.`],
            ['Tax', 'Prices exclude 12% VAT. It is itemized in your cart before checkout.'],
            ['Payment', 'Card, GCash, Maya or PayPal. Choose at checkout.'],
            ['Returns', 'Unopened items in original packaging can be returned within 30 days.'],
          ].map(([term, detail]) => (
            <div key={term} className="bg-surface p-5">
              <dt className="font-semibold">{term}</dt>
              <dd className="mt-1 text-sm text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
