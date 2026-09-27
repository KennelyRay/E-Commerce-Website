'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { discountPercent, formatPrice, stockState } from '@/lib/format';
import { Product } from '@/types';

export function Wordmark({ className = '', showMark = true }: { className?: string; showMark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showMark && <LogoMark size={26} className="shrink-0 text-ink" />}
      <span className="font-display text-[19px] font-extrabold tracking-tight text-ink" style={{ fontStretch: '125%' }}>
        VertixHub
      </span>
    </span>
  );
}

const toneClasses = {
  ok: 'text-ok',
  warn: 'text-warn',
  danger: 'text-danger',
} as const;

export function StockTag({ stock, className = '' }: { stock: number; className?: string }) {
  const state = stockState(stock);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${toneClasses[state.tone]} ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {state.label}
    </span>
  );
}

export function Price({
  product,
  size = 'md',
  quantity = 1,
}: {
  product: Pick<Product, 'price' | 'originalPrice'>;
  size?: 'sm' | 'md' | 'lg';
  quantity?: number;
}) {
  const off = discountPercent(product);
  const sizeClass = size === 'lg' ? 'text-3xl sm:text-4xl' : size === 'md' ? 'text-lg' : 'text-[15px]';

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`font-display font-bold tabular-nums ${sizeClass} ${off ? 'text-accent' : 'text-ink'}`}>
        {formatPrice(product.price * quantity)}
      </span>
      {off > 0 && product.originalPrice ? (
        <>
          <span className="text-sm text-muted line-through tabular-nums">{formatPrice(product.originalPrice * quantity)}</span>
          <span className="text-xs font-semibold text-accent">{off}% off</span>
        </>
      ) : null}
    </div>
  );
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  size = 'md',
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const buttonSize = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';

  return (
    <div className="inline-flex items-center rounded-control border border-line bg-surface" role="group" aria-label={label}>
      <button
        type="button"
        className={`${buttonSize} inline-flex items-center justify-center text-ink transition-colors hover:bg-sunken disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span key={value} className="min-w-[2.5rem] animate-fade-in text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${buttonSize} inline-flex items-center justify-center text-ink transition-colors hover:bg-sunken disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} prefetch={false} className="hover:text-ink hover:underline underline-offset-4">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      {body ? <p className="mx-auto mt-2 max-w-md text-muted">{body}</p> : null}
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="shell flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-muted">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return <span className={`h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} aria-hidden="true" />;
}
