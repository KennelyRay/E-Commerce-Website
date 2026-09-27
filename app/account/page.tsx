'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { api, ApiError, errorMessage, productHref } from '@/lib/api';
import { formatDate, formatPrice, orderStatusLabels, paymentLabels } from '@/lib/format';
import { ProductImage } from '@/components/ProductImage';
import { Breadcrumbs, EmptyState, PageLoader, Spinner } from '@/components/ui';
import { Order } from '@/types';

const STATUS_TRACK: Order['status'][] = ['paid', 'processing', 'shipped', 'delivered'];

function StatusTrack({ status }: { status: Order['status'] }) {
  const current = Math.max(0, STATUS_TRACK.indexOf(status));

  return (
    <ol className="grid grid-cols-4 gap-1" aria-label={`Order status: ${orderStatusLabels[status]}`}>
      {STATUS_TRACK.map((step, index) => (
        <li key={step} className="min-w-0">
          <div className={`h-1 rounded-full transition-colors duration-500 ${index <= current ? 'bg-ok' : 'bg-line'}`} />
          <p className={`mt-1.5 truncate text-xs ${index === current ? 'font-semibold text-ink' : 'text-muted'}`}>
            {orderStatusLabels[step]}
          </p>
        </li>
      ))}
    </ol>
  );
}

function OrderRow({ order, defaultOpen }: { order: Order; defaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={`order-${order.id}`}
        className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 p-4 text-left transition-colors hover:bg-sunken/60 sm:p-5"
      >
        <span className="min-w-[140px]">
          <span className="block font-mono text-sm">{order.orderNumber}</span>
          <span className="block text-xs text-muted">{formatDate(order.createdAt)}</span>
        </span>
        <span className="text-sm text-muted">
          {units} {units === 1 ? 'item' : 'items'}
        </span>
        <span className="text-sm font-medium">{orderStatusLabels[order.status]}</span>
        <span className="ml-auto font-display text-lg font-bold tabular-nums">{formatPrice(order.total)}</span>
        <ChevronDown className={`h-5 w-5 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div id={`order-${order.id}`} className="animate-fade-in border-t border-line p-4 sm:p-5">
          <StatusTrack status={order.status} />
          <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-white p-1">
                    <ProductImage src={item.product.image} alt="" className="h-full w-full object-contain" />
                  </span>
                  <Link href={productHref(item.product.id)} prefetch={false} className="min-w-0 flex-1 truncate text-sm hover:underline underline-offset-4">
                    {item.product.name}
                  </Link>
                  <span className="text-sm text-muted">× {item.quantity}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">VAT</dt>
                <dd className="tabular-nums">{formatPrice(order.tax)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
              <div className="pt-3 text-muted">
                {paymentLabels[order.paymentMethod]} · Estimated delivery {formatDate(order.estimatedDelivery, 'short')}
                <br />
                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
              </div>
            </dl>
          </div>
        </div>
      )}
    </li>
  );
}

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.newPassword.length < 8) {
      setError({ field: 'newPassword', message: 'Use at least 8 characters.' });
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await api('/auth/password', { method: 'POST', body: form });
      setForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed. Other devices were signed out.');
    } catch (caught) {
      setError({ field: caught instanceof ApiError ? caught.field : undefined, message: errorMessage(caught) });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="card mt-4 space-y-3 p-4">
      <h2 className="text-base font-bold">Change password</h2>
      {(['currentPassword', 'newPassword'] as const).map((field) => (
        <div key={field}>
          <label htmlFor={field} className="label">
            {field === 'currentPassword' ? 'Current password' : 'New password'}
          </label>
          <input
            id={field}
            type="password"
            autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
            value={form[field]}
            onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
            aria-invalid={error?.field === field}
            className={`field ${error?.field === field ? 'field-error' : ''}`}
          />
        </div>
      ))}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error.message}
        </p>
      )}
      <button type="submit" disabled={isSaving || !form.currentPassword || !form.newPassword} className="btn-outline w-full">
        {isSaving && <Spinner />}
        Update password
      </button>
    </form>
  );
}

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?next=/account');
    }
  }, [user, isLoading, router]);

  const [ordersError, setOrdersError] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    setOrdersError(null);
    api<Order[]>('/orders')
      .then(setOrders)
      .catch((error) => setOrdersError(errorMessage(error)));
  }, []);

  useEffect(() => {
    if (user) loadOrders();
  }, [user, loadOrders]);

  const totalSpent = useMemo(() => (orders ?? []).reduce((sum, order) => sum + order.total, 0), [orders]);

  if (isLoading || !user) {
    return <PageLoader label="Loading your account" />;
  }

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Account' }]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-xl font-bold text-bg" aria-hidden="true">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
            <p className="text-sm text-muted">
              {user.email} · @{user.username} · Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.isAdmin && (
            <Link href="/admin" prefetch={false} className="btn-outline">
              Store admin
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="btn-ghost text-danger"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        <section aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="text-xl font-bold">
            Orders
          </h2>
          {ordersError ? (
            <div className="mt-4">
              <EmptyState
                title="Orders did not load"
                body={ordersError}
                action={
                  <button type="button" className="btn-dark" onClick={loadOrders}>
                    Try again
                  </button>
                }
              />
            </div>
          ) : orders === null ? (
            <div className="mt-4 space-y-3">
              <div className="skeleton h-20" />
              <div className="skeleton h-20" />
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No orders yet"
                body="Orders you place will show here with their status and delivery estimate."
                action={
                  <Link href="/products" prefetch={false} className="btn-dark">
                    Shop all parts
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order, index) => (
                <OrderRow key={order.id} order={order} defaultOpen={index === 0} />
              ))}
            </ul>
          )}
        </section>

        <aside className="h-fit">
          <dl className="card divide-y divide-line">
            <div className="p-4">
              <dt className="spec-key">Orders placed</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{orders?.length ?? 0}</dd>
            </div>
            <div className="p-4">
              <dt className="spec-key">Total spent</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{formatPrice(totalSpent)}</dd>
            </div>
          </dl>
          <ChangePassword />
        </aside>
      </div>
    </div>
  );
}
