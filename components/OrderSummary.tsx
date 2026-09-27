'use client';

import React from 'react';
import { formatPrice } from '@/lib/format';
import { computeOrderTotals } from '@/lib/pricing';

export function OrderSummaryRows({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  const totals = computeOrderTotals(subtotal);

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </dt>
        <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className={`tabular-nums ${totals.shipping === 0 ? 'font-medium text-ok' : ''}`}>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">VAT (12%)</dt>
        <dd className="tabular-nums">{formatPrice(totals.tax)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-2xl font-bold tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
