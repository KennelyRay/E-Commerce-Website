'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatSku } from '@/lib/format';
import { FreeShippingMeter } from '@/components/CartDrawer';
import { OrderSummaryRows } from '@/components/OrderSummary';
import { Modal } from '@/components/Modal';
import { Breadcrumbs, EmptyState, QuantityStepper, StockTag } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

export default function CartPage() {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isClearOpen, setIsClearOpen] = useState(false);
  const subtotal = getTotalPrice();

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Cart' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <h1 className="text-3xl font-bold sm:text-4xl">Cart</h1>
        {items.length > 0 && (
          <button type="button" onClick={() => setIsClearOpen(true)} className="min-h-[44px] text-sm text-muted underline underline-offset-4 hover:text-danger">
            Empty cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your cart is empty"
            body="Browse the catalog, or plan a full system in the builder and add it in one go."
            action={
              <>
                <Link href="/products" prefetch={false} className="btn-dark">
                  Shop all parts
                </Link>
                <Link href="/pc-builder" prefetch={false} className="btn-outline">
                  Open the builder
                </Link>
              </>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <Link href={productHref(item.product.id)} prefetch={false} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-control bg-white p-2 sm:h-28 sm:w-28" tabIndex={-1} aria-hidden="true">
                  <ProductImage src={item.product.image} alt="" className="h-full w-full object-contain" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                  <div className="min-w-0">
                    <p className="spec-key">
                      {item.product.category} · {formatSku(item.product.id)}
                    </p>
                    <Link href={productHref(item.product.id)} prefetch={false} className="mt-0.5 block font-semibold leading-snug hover:underline underline-offset-4">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm tabular-nums text-muted">{formatPrice(item.product.price)} each</p>
                    <StockTag stock={item.product.stock} className="mt-1" />
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="font-display text-lg font-bold tabular-nums">{formatPrice(item.product.price * item.quantity)}</p>
                    <div className="flex items-center gap-1">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        max={item.product.stock}
                        onChange={(next) => updateQuantity(item.product.id, next)}
                        label={`Quantity for ${item.product.name}`}
                      />
                      <button type="button" onClick={() => removeFromCart(item.product.id)} className="icon-btn text-muted hover:text-danger" aria-label={`Remove ${item.product.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-5">
              <h2 className="text-lg font-bold">Order summary</h2>
              <div className="mt-4">
                <FreeShippingMeter subtotal={subtotal} />
              </div>
              <div className="mt-5">
                <OrderSummaryRows subtotal={subtotal} itemCount={getTotalItems()} />
              </div>
              <Link href="/checkout" prefetch={false} className="btn-primary mt-5 w-full">
                {user ? 'Continue to checkout' : 'Sign in to check out'}
              </Link>
              <Link href="/products" prefetch={false} className="btn-ghost mt-2 w-full">
                Keep shopping
              </Link>
            </div>
          </aside>
        </div>
      )}

      <Modal
        isOpen={isClearOpen}
        title="Empty your cart?"
        description={`This removes all ${getTotalItems()} items. You cannot undo it.`}
        confirmText="Empty cart"
        cancelText="Keep items"
        variant="danger"
        onConfirm={() => {
          clearCart();
          setIsClearOpen(false);
        }}
        onClose={() => setIsClearOpen(false)}
      />
    </div>
  );
}
