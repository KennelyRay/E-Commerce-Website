'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { refreshCatalog, useCatalog } from '@/hooks/useCatalog';
import { useDialog } from '@/hooks/useDialog';
import { ThemeToggle } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { ProductImage } from '@/components/ProductImage';
import { EmptyState, PageLoader, Spinner, Wordmark } from '@/components/ui';
import { api, ApiError, errorMessage, productHref } from '@/lib/api';
import { CATEGORY_INFO } from '@/lib/categories';
import { formatDate, formatPrice, formatSku, orderStatusLabels, paymentLabels } from '@/lib/format';
import { AdminUser, Order, Product } from '@/types';

type Section = 'overview' | 'orders' | 'inventory' | 'customers';

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'customers', label: 'Customers' },
];

const LOW_STOCK = 10;
const ORDER_STATUSES = Object.keys(orderStatusLabels) as Order['status'][];

const statusTone: Record<Order['status'], string> = {
  pending: 'text-warn',
  paid: 'text-ink',
  processing: 'text-warn',
  shipped: 'text-ink',
  delivered: 'text-ok',
};

type Remote<T> = { data: T | null; error: string | null };

async function updateProduct(product: Product, patch: Partial<Pick<Product, 'price' | 'stock' | 'featured' | 'originalPrice'>>, success: string) {
  try {
    await api<Product>(`/admin/products/${product.id}`, { method: 'PATCH', body: patch });
    await refreshCatalog();
    toast.success(success);
  } catch (error) {
    toast.error(errorMessage(error));
    await refreshCatalog();
  }
}

function SectionHeader({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <EmptyState
      title="This did not load"
      body={message}
      action={
        <button type="button" className="btn-dark" onClick={onRetry}>
          Try again
        </button>
      }
    />
  );
}

/** Numeric cell that saves on Enter or blur, so each keystroke is not a request. */
function InlineNumber({
  value,
  onCommit,
  label,
  step = 1,
  prefix,
}: {
  value: number;
  onCommit: (next: number) => void;
  label: string;
  step?: number;
  prefix?: string;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const next = Number(draft);
    if (draft.trim() === '' || Number.isNaN(next) || next < 0) {
      setDraft(String(value));
      toast.error(`${label} must be zero or more.`);
      return;
    }
    if (next !== value) onCommit(next);
  };

  return (
    <div className="relative">
      {prefix && <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted">{prefix}</span>}
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={draft}
        aria-label={label}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
          if (event.key === 'Escape') setDraft(String(value));
        }}
        className={`field h-9 min-h-0 w-full text-right tabular-nums ${prefix ? 'pl-6' : ''}`}
      />
    </div>
  );
}

function Overview({
  products,
  orders,
  users,
  go,
}: {
  products: Product[];
  orders: Order[] | null;
  users: AdminUser[] | null;
  go: (section: Section) => void;
}) {
  const allOrders = orders ?? [];
  const revenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const openOrders = allOrders.filter((order) => order.status !== 'delivered').length;
  const lowStock = products.filter((product) => product.stock < LOW_STOCK).sort((a, b) => a.stock - b.stock);
  const customers = (users ?? []).filter((user) => !user.isAdmin);
  const pending = orders === null || users === null;

  const metrics = [
    { label: 'Revenue', value: formatPrice(revenue), note: `${allOrders.length} ${allOrders.length === 1 ? 'order' : 'orders'} in total` },
    { label: 'Open orders', value: String(openOrders), note: 'Not yet delivered' },
    { label: 'Low stock', value: String(lowStock.length), note: `Parts under ${LOW_STOCK} units` },
    { label: 'Customers', value: String(customers.length), note: `${customers.filter((user) => user.isBanned).length} banned` },
  ];

  return (
    <>
      <SectionHeader title="Overview" detail={`Live store data as of ${formatDate(new Date().toISOString())}`} />
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4" aria-busy={pending}>
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-surface p-4 sm:p-5">
            <dt className="spec-key">{metric.label}</dt>
            <dd className="mt-1 font-display text-2xl font-bold tabular-nums sm:text-3xl">{pending ? <span className="skeleton inline-block h-8 w-20" /> : metric.value}</dd>
            <dd className="mt-0.5 text-xs text-muted">{metric.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="recent-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="recent-heading" className="text-lg font-bold">
              Recent orders
            </h2>
            <button type="button" onClick={() => go('orders')} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
              All orders
            </button>
          </div>
          {orders === null ? (
            <div className="skeleton h-32" />
          ) : orders.length === 0 ? (
            <EmptyState title="No orders yet" body="Orders placed through checkout appear here." />
          ) : (
            <ul className="card divide-y divide-line">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                  <span className="font-mono">{order.orderNumber}</span>
                  <span className="min-w-0 flex-1 truncate text-muted">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </span>
                  <span className={`font-medium ${statusTone[order.status]}`}>{orderStatusLabels[order.status]}</span>
                  <span className="w-28 text-right font-semibold tabular-nums">{formatPrice(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="low-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="low-heading" className="text-lg font-bold">
              Low stock
            </h2>
            <button type="button" onClick={() => go('inventory')} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
              Inventory
            </button>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState title="Stock levels are healthy" body={`Every part has ${LOW_STOCK} or more units.`} />
          ) : (
            <ul className="card divide-y divide-line">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{product.name}</span>
                    <span className={`text-xs font-medium ${product.stock === 0 ? 'text-danger' : 'text-warn'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn-outline h-9 min-h-0 px-3"
                    onClick={() => updateProduct(product, { stock: product.stock + 10 }, `${product.name}: stock set to ${product.stock + 10}.`)}
                  >
                    Add 10
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Orders({ orders, error, onRetry, onChange }: { orders: Order[] | null; error: string | null; onRetry: () => void; onChange: (order: Order) => void }) {
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const all = orders ?? [];
  const visible = filter === 'all' ? all : all.filter((order) => order.status === filter);

  const changeStatus = async (order: Order, status: Order['status']) => {
    setSavingId(order.id);
    try {
      onChange(await api<Order>(`/admin/orders/${order.id}`, { method: 'PATCH', body: { status } }));
      toast.success(`${order.orderNumber} marked ${orderStatusLabels[status].toLowerCase()}.`);
    } catch (caught) {
      toast.error(errorMessage(caught));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <SectionHeader
        title="Orders"
        detail="Customers see status changes on their account page."
        action={
          <div>
            <label htmlFor="order-filter" className="sr-only">
              Filter by status
            </label>
            <select id="order-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="field h-10 min-h-0 w-auto">
              <option value="all">All statuses ({all.length})</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {orderStatusLabels[status]} ({all.filter((order) => order.status === status).length})
                </option>
              ))}
            </select>
          </div>
        }
      />
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : orders === null ? (
        <div className="skeleton h-48" />
      ) : visible.length === 0 ? (
        <EmptyState title={all.length ? 'No orders with this status' : 'No orders yet'} body={all.length ? 'Pick another status filter.' : 'Orders placed through checkout appear here.'} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Order</th>
                <th scope="col" className="px-4 py-3 font-normal">Customer</th>
                <th scope="col" className="px-4 py-3 font-normal">Items</th>
                <th scope="col" className="px-4 py-3 font-normal">Payment</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Total</th>
                <th scope="col" className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-4 py-3">
                    <span className="block font-mono">{order.orderNumber}</span>
                    <span className="text-xs text-muted">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </span>
                    <span className="block text-xs text-muted">{order.shippingAddress.email}</span>
                    <span className="block text-xs text-muted">
                      {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.map((item) => (
                      <span key={item.id} className="block max-w-[220px] truncate">
                        {item.quantity} × {item.product.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3">{paymentLabels[order.paymentMethod]}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <label htmlFor={`status-${order.id}`} className="sr-only">
                      Status for {order.orderNumber}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        disabled={savingId === order.id}
                        onChange={(event) => changeStatus(order, event.target.value as Order['status'])}
                        className={`field h-9 min-h-0 w-auto font-medium ${statusTone[order.status]}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {orderStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                      {savingId === order.id && <Spinner className="text-muted" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ImageUpload({ product, enabled }: { product: Product; enabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Images must be 5 MB or smaller.');
      return;
    }
    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);
    try {
      await api<Product>(`/admin/products/${product.id}/image`, { method: 'POST', body });
      await refreshCatalog();
      toast.success(`New photo saved for ${product.name}.`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!enabled || isUploading}
        className="icon-btn h-9 w-9 text-muted hover:text-ink"
        aria-label={`Upload photo for ${product.name}`}
        title={enabled ? 'Upload photo' : 'Connect Object Storage to upload photos'}
      >
        {isUploading ? <Spinner /> : <Upload className="h-4 w-4" />}
      </button>
    </>
  );
}

type SpecRow = { key: string; value: string };

function AddProductSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(isOpen, onClose);
  const empty = { name: '', category: CATEGORY_INFO[0].name, price: '', originalPrice: '', stock: '0', description: '', tags: '', featured: false };
  const [form, setForm] = useState(empty);
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: '', value: '' }]);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(empty);
      setSpecs([{ key: '', value: '' }]);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const product = await api<Product>('/admin/products', {
        method: 'POST',
        body: {
          name: form.name,
          category: form.category,
          price: form.price,
          originalPrice: form.originalPrice || null,
          stock: form.stock,
          description: form.description,
          featured: form.featured,
          tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          specifications: Object.fromEntries(specs.filter((row) => row.key.trim() && row.value.trim()).map((row) => [row.key.trim(), row.value.trim()])),
        },
      });
      await refreshCatalog();
      toast.success(`${product.name} added as ${formatSku(product.id)}. Upload a photo from the inventory table.`);
      onClose();
    } catch (caught) {
      setError({ field: caught instanceof ApiError ? caught.field : undefined, message: errorMessage(caught) });
    } finally {
      setIsSaving(false);
    }
  };

  const fieldClass = (name: string) => `field ${error?.field === name ? 'field-error' : ''}`;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="add-title" className="absolute inset-y-0 right-0 flex w-full max-w-[560px] animate-slide-in-right flex-col bg-surface shadow-overlay">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id="add-title" className="text-lg font-bold">
            Add a part
          </h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} noValidate className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <div>
              <label htmlFor="new-name" className="label">
                Name
              </label>
              <input id="new-name" data-autofocus value={form.name} onChange={(event) => update({ name: event.target.value })} className={fieldClass('name')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="new-category" className="label">
                  Category
                </label>
                <select id="new-category" value={form.category} onChange={(event) => update({ category: event.target.value })} className="field">
                  {CATEGORY_INFO.map((entry) => (
                    <option key={entry.name}>{entry.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-stock" className="label">
                  Stock
                </label>
                <input id="new-stock" type="number" min={0} inputMode="numeric" value={form.stock} onChange={(event) => update({ stock: event.target.value })} className={fieldClass('stock')} />
              </div>
              <div>
                <label htmlFor="new-price" className="label">
                  Price (₱)
                </label>
                <input id="new-price" type="number" min={0} step={0.01} inputMode="decimal" value={form.price} onChange={(event) => update({ price: event.target.value })} className={fieldClass('price')} />
              </div>
              <div>
                <label htmlFor="new-original" className="label">
                  Was price (₱) <span className="font-normal text-muted">(optional, shows a markdown)</span>
                </label>
                <input id="new-original" type="number" min={0} step={0.01} inputMode="decimal" value={form.originalPrice} onChange={(event) => update({ originalPrice: event.target.value })} className={fieldClass('originalPrice')} />
              </div>
            </div>
            <div>
              <label htmlFor="new-description" className="label">
                Description
              </label>
              <textarea id="new-description" rows={4} value={form.description} onChange={(event) => update({ description: event.target.value })} className={`${fieldClass('description')} py-2.5`} />
            </div>
            <div>
              <label htmlFor="new-tags" className="label">
                Search tags <span className="font-normal text-muted">(comma separated)</span>
              </label>
              <input id="new-tags" placeholder="am5, ddr5, wifi" value={form.tags} onChange={(event) => update({ tags: event.target.value })} className="field" />
            </div>

            <fieldset>
              <legend className="label">Specifications</legend>
              <p className="mb-2 text-xs text-muted">The builder checks read Socket, Memory, Type, Wattage, TDP, Power Consumption and Recommended PSU.</p>
              <div className="space-y-2">
                {specs.map((row, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      aria-label={`Spec ${index + 1} name`}
                      placeholder="Socket"
                      value={row.key}
                      onChange={(event) => setSpecs((current) => current.map((entry, i) => (i === index ? { ...entry, key: event.target.value } : entry)))}
                      className="field w-2/5"
                    />
                    <input
                      aria-label={`Spec ${index + 1} value`}
                      placeholder="AM5"
                      value={row.value}
                      onChange={(event) => setSpecs((current) => current.map((entry, i) => (i === index ? { ...entry, value: event.target.value } : entry)))}
                      className="field flex-1 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs((current) => (current.length > 1 ? current.filter((_, i) => i !== index) : [{ key: '', value: '' }]))}
                      className="icon-btn shrink-0 text-muted hover:text-danger"
                      aria-label={`Remove spec ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setSpecs((current) => [...current, { key: '', value: '' }])} className="btn-ghost mt-2 px-3">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add a spec
              </button>
            </fieldset>

            <label className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(event) => update({ featured: event.target.checked })} className="h-4 w-4 accent-[rgb(var(--ink))]" />
              Show as a staff pick
            </label>
          </div>

          <div className="border-t border-line p-5">
            {error && (
              <p role="alert" className="mb-3 text-sm text-danger">
                {error.message}
              </p>
            )}
            <button type="submit" disabled={isSaving} className="btn-dark w-full">
              {isSaving && <Spinner />}
              Add part
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Inventory({ products, isLoading, error, storageReady }: { products: Product[]; isLoading: boolean; error: string | null; storageReady: boolean | null }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const visible = products.filter(
    (product) =>
      (category === 'All' || product.category === category) &&
      product.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (stockFilter === 'all' || (stockFilter === 'low' ? product.stock < LOW_STOCK : product.stock === 0)),
  );

  return (
    <>
      <SectionHeader
        title="Inventory"
        detail="Edit price or stock, then press Enter or leave the field to save."
        action={
          <button type="button" onClick={() => setIsAdding(true)} className="btn-dark">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a part
          </button>
        }
      />
      {storageReady === false && (
        <p className="mb-4 rounded-control border border-dashed border-warn/60 p-3 text-sm">
          Photo uploads are off: this API is not connected to Neon Object Storage. They turn on once the function runs on Neon with the
          <span className="font-mono"> product-images</span> bucket.
        </p>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parts" aria-label="Search parts" className="field pl-9" />
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category" className="field w-auto">
          <option value="All">All categories</option>
          {CATEGORY_INFO.map((entry) => (
            <option key={entry.name}>{entry.name}</option>
          ))}
        </select>
        <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value as typeof stockFilter)} aria-label="Stock level" className="field w-auto">
          <option value="all">Any stock level</option>
          <option value="low">Under {LOW_STOCK} units</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      {error ? (
        <LoadError message={error} onRetry={() => void refreshCatalog()} />
      ) : isLoading ? (
        <div className="skeleton h-64" />
      ) : visible.length === 0 ? (
        <EmptyState title="No parts match" body="Clear the search or pick another category." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Part</th>
                <th scope="col" className="w-36 px-4 py-3 text-right font-normal">Price</th>
                <th scope="col" className="w-28 px-4 py-3 text-right font-normal">Stock</th>
                <th scope="col" className="px-4 py-3 font-normal">Staff pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-white p-1">
                        <ProductImage src={product.image} alt="" className="h-full w-full object-contain" />
                      </span>
                      <ImageUpload product={product} enabled={storageReady === true} />
                      <span className="min-w-0">
                        <Link href={productHref(product.id)} prefetch={false} className="block truncate font-medium hover:underline underline-offset-4">
                          {product.name}
                        </Link>
                        <span className="font-mono text-xs text-muted">
                          {formatSku(product.id)} · {product.category}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <InlineNumber
                      value={product.price}
                      step={0.01}
                      prefix="₱"
                      label={`Price for ${product.name}`}
                      onCommit={(price) => updateProduct(product, { price }, `${product.name}: price set to ${formatPrice(price)}.`)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <InlineNumber
                      value={product.stock}
                      label={`Stock for ${product.name}`}
                      onCommit={(stock) => updateProduct(product, { stock: Math.floor(stock) }, `${product.name}: stock set to ${Math.floor(stock)}.`)}
                    />
                    {product.stock < LOW_STOCK && (
                      <span className={`mt-1 block text-right text-xs font-medium ${product.stock === 0 ? 'text-danger' : 'text-warn'}`}>{product.stock === 0 ? 'Out' : 'Low'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(product.featured)}
                      aria-label={`Staff pick: ${product.name}`}
                      onClick={() =>
                        updateProduct(product, { featured: !product.featured }, `${product.name} ${product.featured ? 'removed from' : 'added to'} staff picks.`)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.featured ? 'bg-ink' : 'bg-line'}`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-surface shadow transition-transform duration-200 ${product.featured ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddProductSheet isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </>
  );
}

function Customers({ users, error, onRetry, onChange, currentUserId }: { users: AdminUser[] | null; error: string | null; onRetry: () => void; onChange: () => void; currentUserId: string }) {
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<AdminUser | null>(null);

  const rows = (users ?? []).filter((user) => `${user.name} ${user.username} ${user.email}`.toLowerCase().includes(query.trim().toLowerCase()));

  const confirmToggle = async () => {
    if (!pending) return;
    const target = pending;
    setPending(null);
    try {
      await api(`/admin/users/${target.id}`, { method: 'PATCH', body: { isBanned: !target.isBanned } });
      toast.success(`${target.name} ${target.isBanned ? 'can sign in again' : 'is banned and signed out everywhere'}.`);
      onChange();
    } catch (caught) {
      toast.error(errorMessage(caught));
    }
  };

  return (
    <>
      <SectionHeader title="Customers" detail={users ? `${users.length} accounts on this store` : undefined} />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, username or email" aria-label="Search customers" className="field pl-9" />
      </div>

      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : users === null ? (
        <div className="skeleton h-48" />
      ) : rows.length === 0 ? (
        <EmptyState title="No accounts match" body="Try a different name or email." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-normal">Account</th>
                <th scope="col" className="px-4 py-3 font-normal">Joined</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Orders</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Spent</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <span className="block font-medium">
                      {user.name}
                      {user.isAdmin && <span className="ml-2 rounded-control bg-sunken px-1.5 py-0.5 text-xs font-normal text-muted">Admin</span>}
                    </span>
                    <span className="text-xs text-muted">
                      @{user.username} · {user.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(user.createdAt, 'short')}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{user.orderCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatPrice(user.spent)}</td>
                  <td className="px-4 py-3 text-right">
                    {user.isAdmin || user.id === currentUserId ? (
                      <span className="text-xs text-muted">Not editable</span>
                    ) : (
                      <button type="button" onClick={() => setPending(user)} className={user.isBanned ? 'btn-outline h-9 min-h-0 px-3' : 'btn-ghost h-9 min-h-0 px-3 text-danger'}>
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={Boolean(pending)}
        title={pending?.isBanned ? `Unban ${pending?.name}?` : `Ban ${pending?.name}?`}
        description={pending?.isBanned ? 'They will be able to sign in and place orders again.' : 'They are signed out on every device right away and cannot sign in or place orders.'}
        confirmText={pending?.isBanned ? 'Unban' : 'Ban account'}
        cancelText="Cancel"
        variant={pending?.isBanned ? 'default' : 'danger'}
        onConfirm={confirmToggle}
        onClose={() => setPending(null)}
      />
    </>
  );
}

export default function AdminPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const catalog = useCatalog();
  const [section, setSection] = useState<Section>('overview');
  const [orders, setOrders] = useState<Remote<Order[]>>({ data: null, error: null });
  const [users, setUsers] = useState<Remote<AdminUser[]>>({ data: null, error: null });
  const [storageReady, setStorageReady] = useState<boolean | null>(null);
  const isAdmin = Boolean(user?.isAdmin);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace(user ? '/' : '/login?next=/admin');
    }
  }, [user, isAdmin, isLoading, router]);

  const loadOrders = useCallback(() => {
    setOrders({ data: null, error: null });
    api<Order[]>('/admin/orders')
      .then((data) => setOrders({ data, error: null }))
      .catch((error) => setOrders({ data: null, error: errorMessage(error) }));
  }, []);

  const loadUsers = useCallback(() => {
    api<AdminUser[]>('/admin/users')
      .then((data) => setUsers({ data, error: null }))
      .catch((error) => setUsers({ data: null, error: errorMessage(error) }));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadOrders();
    loadUsers();
    api<{ storage: boolean }>('/health', { auth: false })
      .then((health) => setStorageReady(health.storage))
      .catch(() => setStorageReady(false));
  }, [isAdmin, loadOrders, loadUsers]);

  // Section lives in the URL hash so a view can be bookmarked or reloaded.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.replace('#', '') as Section;
      if (SECTIONS.some((entry) => entry.id === hash)) setSection(hash);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = useCallback((next: Section) => {
    setSection(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  }, []);

  const counts = useMemo<Partial<Record<Section, number>>>(
    () => ({
      orders: (orders.data ?? []).filter((order) => order.status !== 'delivered').length,
      inventory: catalog.products.filter((product) => product.stock < LOW_STOCK).length,
    }),
    [orders.data, catalog.products],
  );

  if (isLoading || !isAdmin || !user) {
    return <PageLoader label="Checking admin access" />;
  }

  const signOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:px-5">
          <Link href="/" prefetch={false} aria-label="View the store">
            <Wordmark />
          </Link>
          <span className="rounded-control bg-sunken px-2 py-0.5 font-mono text-[11px] text-muted">Admin</span>
        </div>
        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-2 pb-2 scrollbar-none lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0">
          {SECTIONS.map((entry) => {
            const active = section === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => go(entry.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[40px] shrink-0 items-center justify-between gap-3 rounded-control px-3 text-sm font-medium transition-colors ${
                  active ? 'bg-ink text-bg' : 'text-ink hover:bg-sunken'
                }`}
              >
                {entry.label}
                {counts[entry.id] ? (
                  <span className={`rounded-full px-1.5 font-mono text-[11px] ${active ? 'bg-bg/20 text-bg' : 'bg-sunken text-muted'}`}>{counts[entry.id]}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-line p-4 lg:block">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <div className="mt-3 flex items-center gap-1">
            <ThemeToggle className="h-9 w-9" />
            <Link href="/account" prefetch={false} className="btn-ghost h-9 min-h-0 flex-1 px-2">
              Account
            </Link>
            <button type="button" onClick={signOut} className="btn-ghost h-9 min-h-0 flex-1 px-2 text-danger">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-end gap-1 border-b border-line px-4 py-2 lg:hidden">
          <ThemeToggle />
          <Link href="/account" prefetch={false} className="btn-ghost px-3">
            Account
          </Link>
          <button type="button" onClick={signOut} className="btn-ghost px-3 text-danger">
            Sign out
          </button>
        </div>
        <div key={section} className="mx-auto max-w-[1180px] animate-fade-in px-4 py-8 sm:px-6 lg:px-10">
          {section === 'overview' && <Overview products={catalog.products} orders={orders.data} users={users.data} go={go} />}
          {section === 'orders' && (
            <Orders
              orders={orders.data}
              error={orders.error}
              onRetry={loadOrders}
              onChange={(updated) => setOrders((current) => ({ ...current, data: (current.data ?? []).map((order) => (order.id === updated.id ? updated : order)) }))}
            />
          )}
          {section === 'inventory' && <Inventory products={catalog.products} isLoading={catalog.isLoading} error={catalog.error} storageReady={storageReady} />}
          {section === 'customers' && <Customers users={users.data} error={users.error} onRetry={loadUsers} onChange={loadUsers} currentUserId={user.id} />}
        </div>
      </div>
    </div>
  );
}
