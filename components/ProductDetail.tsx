'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/hooks/useCatalog';
import { categoryHref } from '@/lib/categories';
import { findCompatibleParts } from '@/lib/compatibility';
import { formatPrice, formatSku } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { ProductCard, keySpecLine } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { Breadcrumbs, EmptyState, PageLoader, Price, QuantityStepper, StockTag } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [origin, setOrigin] = useState('50% 50%');
  const [zoomed, setZoomed] = useState(false);

  // Pointer-follow zoom lets shoppers read ports and labels on the product shot.
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative aspect-square cursor-zoom-in overflow-hidden rounded-card border border-line bg-white"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <ProductImage
        key={src} src={src}
        alt={alt}
        className="h-full w-full animate-fade-in object-contain p-8 transition-transform duration-200 ease-out"
        style={{ transformOrigin: origin, transform: zoomed ? 'scale(1.8)' : 'scale(1)' }}
      />
      <span className="pointer-events-none absolute bottom-3 left-3 hidden rounded-control bg-ink/80 px-2 py-1 text-[11px] text-bg md:block">
        Hover to zoom
      </span>
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { products, isLoading, error, reload } = useCatalog();
  const { addToCart, closeDrawer, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  const product = useMemo(() => products.find((entry) => entry.id === id), [id, products]);

  useEffect(() => {
    if (product) document.title = `${product.name} | VertixHub`;
  }, [product]);

  const inCart = items.find((item) => item.product.id === product?.id)?.quantity ?? 0;
  const available = Math.max(0, (product?.stock ?? 0) - inCart);

  useEffect(() => {
    setQuantity((current) => Math.min(Math.max(1, current), Math.max(1, available)));
  }, [available]);

  useEffect(() => {
    const node = buyBoxRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(node);
    return () => observer.disconnect();
  }, [product?.id]);

  const compatible = useMemo(() => (product ? findCompatibleParts(product, products) : []), [product, products]);
  const related = useMemo(
    () => (product ? products.filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 4) : []),
    [product, products],
  );

  if (isLoading) {
    return <PageLoader label="Loading part" />;
  }

  if (error) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="This part could not be loaded"
          body={error}
          action={
            <button type="button" className="btn-dark" onClick={() => void reload()}>
              Try again
            </button>
          }
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="This part is not in the catalog"
          body="It may have been removed, or the link is mistyped."
          action={
            <Link href="/products" prefetch={false} className="btn-dark">
              Shop all parts
            </Link>
          }
        />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const specs = Object.entries(product.specifications ?? {}).filter(([, value]) => Boolean(value)) as Array<[string, string]>;
  const soldOut = product.stock <= 0;
  const maxedOut = !soldOut && available <= 0;

  const handleAdd = () => addToCart(product, quantity);
  const handleBuyNow = () => {
    if (available > 0) {
      addToCart(product, quantity);
    }
    closeDrawer();
    router.push('/checkout');
  };

  return (
    <div className="shell pb-10 pt-6">
      <Breadcrumbs
        items={[
          { label: 'Store', href: '/' },
          { label: 'Shop', href: '/products' },
          { label: product.category, href: categoryHref(product.category) },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <ZoomImage src={images[imageIndex] ?? product.image} alt={product.name} />
          {images.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <button type="button" className="icon-btn border border-line" onClick={() => setImageIndex((imageIndex - 1 + images.length) % images.length)} aria-label="Previous image">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-none">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={index === imageIndex}
                    className={`h-16 w-16 shrink-0 rounded-control border-2 bg-white p-1 ${index === imageIndex ? 'border-ink' : 'border-transparent'}`}
                  >
                    <ProductImage src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
              <button type="button" className="icon-btn border border-line" onClick={() => setImageIndex((imageIndex + 1) % images.length)} aria-label="Next image">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="spec-key">
            {product.category} · {formatSku(product.id)}
          </p>
          <h1 className="mt-2 text-balance text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          {keySpecLine(product) && <p className="mt-2 font-mono text-sm text-muted">{keySpecLine(product)}</p>}

          <div className="mt-6">
            <Price product={product} size="lg" />
            <p className="mt-1 text-sm text-muted">Excludes 12% VAT, added at checkout.</p>
          </div>

          <p className="mt-6 max-w-prose text-pretty leading-relaxed text-ink/90">{product.description}</p>

          <div ref={buyBoxRef} className="mt-8 rounded-card border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <StockTag stock={product.stock} className="text-sm" />
              {inCart > 0 && (
                <button type="button" onClick={() => router.push('/cart')} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                  {inCart} in your cart
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!soldOut && !maxedOut && (
                <QuantityStepper value={quantity} max={available} onChange={(next) => setQuantity(Math.min(Math.max(1, next), available))} label="Quantity" />
              )}
              <button type="button" onClick={handleAdd} disabled={soldOut || maxedOut} className="btn-primary flex-1 px-6">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {soldOut ? 'Sold out' : maxedOut ? 'All available units are in your cart' : `Add to cart · ${formatPrice(product.price * quantity)}`}
              </button>
            </div>
            {!soldOut && (
              <button type="button" onClick={handleBuyNow} className="btn-outline mt-2 w-full">
                Buy now
              </button>
            )}

            <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Delivery</dt>
                <dd className="text-muted">About 5 days after ordering, anywhere in the Philippines.</dd>
              </div>
              <div>
                <dt className="font-semibold">Shipping</dt>
                <dd className="text-muted">Free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })}.</dd>
              </div>
            </dl>
          </div>

          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/products?query=${encodeURIComponent(tag)}`}
                  prefetch={false}
                  className="inline-flex min-h-[32px] items-center rounded-control bg-sunken px-2.5 font-mono text-xs text-muted transition-colors hover:text-ink"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {specs.length > 0 && (
          <Reveal as="section" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="border-b-2 border-ink pb-2 text-2xl font-bold">
              Specifications
            </h2>
            <dl>
              {specs.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 border-b border-line py-2.5 text-sm">
                  <dt className="text-muted">{key}</dt>
                  <dd className="font-mono text-[13px]">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {compatible.length > 0 && (
          <Reveal as="section" aria-labelledby="fits-heading" delay={80}>
            <h2 id="fits-heading" className="border-b-2 border-ink pb-2 text-2xl font-bold">
              Fits with
            </h2>
            <p className="mt-3 text-sm text-muted">Matched on socket, memory type or power rating from the listed specs.</p>
            <ul className="mt-2">
              {compatible.map((part) => (
                <li key={part.id} className="border-b border-line">
                  <Link href={productHref(part.id)} prefetch={false} className="group flex items-center gap-3 py-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-white p-1">
                      <ProductImage src={part.image} alt="" className="h-full w-full object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold group-hover:underline underline-offset-4">{part.name}</span>
                      <span className="block truncate font-mono text-xs text-muted">{keySpecLine(part) || part.category}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(part.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/pc-builder" prefetch={false} className="link mt-4 inline-block text-sm">
              Plan the rest of the build
            </Link>
          </Reveal>
        )}
      </div>

      {related.length > 0 && (
        <Reveal as="section" className="mt-16" aria-labelledby="related-heading">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
            <h2 id="related-heading" className="text-2xl font-bold">
              More {product.category.toLowerCase()}
            </h2>
            <Link href={categoryHref(product.category)} prefetch={false} className="link text-sm">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((entry) => (
              <ProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Mobile: keeps the purchase action reachable once the buy box scrolls away. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-4 py-3 transition-transform duration-300 lg:hidden ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showStickyBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-sm tabular-nums text-muted">{formatPrice(product.price)}</p>
          </div>
          <button type="button" onClick={handleAdd} disabled={soldOut || maxedOut} tabIndex={showStickyBar ? 0 : -1} className="btn-primary">
            {soldOut ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
