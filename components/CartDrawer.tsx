'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDialog } from '@/hooks/useDialog';
import { formatPrice } from '@/lib/format';
import { computeOrderTotals, FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { QuantityStepper } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const { freeShippingGap, freeShippingProgress } = computeOrderTotals(subtotal);

  return (
    <div>
      <p className="text-sm text-ink">
        {freeShippingGap > 0 ? (
          <>
            Add <strong className="tabular-nums">{formatPrice(freeShippingGap)}</strong> for free shipping
          </>
        ) : (
          <>Free shipping unlocked</>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken"
        role="progressbar"
        aria-label={`Progress toward free shipping at ${formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(freeShippingProgress * 100)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${freeShippingGap > 0 ? 'bg-ink' : 'bg-ok'}`}
          style={{ width: `${freeShippingProgress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, lastAddedId } = useCart();
  const panelRef = useDialog<HTMLDivElement>(isDrawerOpen, closeDrawer);

  if (!isDrawerOpen) {
    return null;
  }

  const subtotal = getTotalPrice();
  const count = getTotalItems();

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={closeDrawer} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] animate-slide-in-right flex-col bg-surface shadow-overlay"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id="cart-drawer-title" className="text-lg font-bold">
            Cart <span className="font-sans text-sm font-normal text-muted">({count} {count === 1 ? 'item' : 'items'})</span>
          </h2>
          <button type="button" onClick={closeDrawer} className="icon-btn -mr-2" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">Parts you add will show up here.</p>
            <Link href="/products" prefetch={false} onClick={closeDrawer} className="btn-dark mt-6">
              Shop all parts
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-4">
              <FreeShippingMeter subtotal={subtotal} />
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex gap-3 py-4 ${item.product.id === lastAddedId ? 'animate-pop-in' : ''}`}
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-control bg-white p-2">
                    <ProductImage src={item.product.image} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={productHref(item.product.id)}
                      prefetch={false}
                      onClick={closeDrawer}
                      className="line-clamp-2 text-sm font-semibold leading-snug hover:underline underline-offset-4"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm tabular-nums text-muted">{formatPrice(item.product.price)} each</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        min={1}
                        max={item.product.stock}
                        onChange={(next) => updateQuantity(item.product.id, next)}
                        label={`Quantity for ${item.product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="icon-btn h-9 w-9 text-muted hover:text-danger"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-display text-xl font-bold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Shipping and 12% VAT are calculated at checkout.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/cart" prefetch={false} onClick={closeDrawer} className="btn-outline">
                  View cart
                </Link>
                <Link href="/checkout" prefetch={false} onClick={closeDrawer} className="btn-primary">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
