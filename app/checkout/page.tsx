'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api, ApiError, errorMessage } from '@/lib/api';
import { refreshCatalog } from '@/hooks/useCatalog';
import { computeOrderTotals } from '@/lib/pricing';
import { formatDate, formatPrice, paymentLabels } from '@/lib/format';
import { OrderSummaryRows } from '@/components/OrderSummary';
import { Breadcrumbs, EmptyState, PageLoader, Spinner } from '@/components/ui';
import { CheckoutFormData, Order, PaymentMethod } from '@/types';
import { ProductImage } from '@/components/ProductImage';

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; title: string; detail: string }> = [
  { value: 'credit-card', title: 'Credit or debit card', detail: 'Visa, Mastercard, JCB' },
  { value: 'gcash', title: 'GCash', detail: 'Mobile wallet' },
  { value: 'maya', title: 'Maya', detail: 'Mobile wallet' },
  { value: 'paypal', title: 'PayPal', detail: 'PayPal balance or linked card' },
];

function Field({
  id,
  label,
  error,
  className = '',
  ...inputProps
}: { id: keyof CheckoutFormData; label: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field ${error ? 'field-error' : ''}`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Step({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6" aria-labelledby={`step-${index}`}>
      <h2 id={`step-${index}`} className="flex items-baseline gap-3 text-xl font-bold">
        <span className="font-mono text-sm font-normal text-muted">{index}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <div className="shell max-w-2xl py-12">
      <div className="animate-pop-in">
        <svg viewBox="0 0 52 52" className="h-14 w-14 text-ok" aria-hidden="true">
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M15 27l7 7 15-15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-draw [stroke-dasharray:40] [stroke-dashoffset:40]" />
        </svg>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Order placed</h1>
        <p className="mt-2 text-muted">
          Thanks, {order.shippingAddress.firstName}. Your order number is <span className="font-mono text-ink">{order.orderNumber}</span>.
        </p>
      </div>

      <div className="card mt-8 divide-y divide-line">
        <ul className="p-5">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-white p-1">
                <ProductImage src={item.product.image} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">
                {item.product.name} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="text-sm tabular-nums">{formatPrice(item.product.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="grid gap-4 p-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="spec-key">Total</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{formatPrice(order.total)}</dd>
          </div>
          <div>
            <dt className="spec-key">Payment</dt>
            <dd className="mt-0.5 font-semibold">{paymentLabels[order.paymentMethod]}</dd>
          </div>
          <div>
            <dt className="spec-key">Estimated delivery</dt>
            <dd className="mt-0.5 font-semibold">{formatDate(order.estimatedDelivery)}</dd>
          </div>
        </dl>
        <div className="p-5 text-sm text-muted">
          Shipping to {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account" prefetch={false} className="btn-dark">
          View order history
        </Link>
        <Link href="/products" prefetch={false} className="btn-outline">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?next=/checkout');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const [firstName = '', ...rest] = user.name.split(' ');
      setFormData((current) => ({
        ...current,
        email: current.email || user.email,
        firstName: current.firstName || firstName,
        lastName: current.lastName || rest.join(' '),
      }));
    }
  }, [user]);

  if (isLoading || !user) {
    return <PageLoader label="Loading checkout" />;
  }

  if (completedOrder) {
    return <OrderConfirmation order={completedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="shell py-12">
        <EmptyState
          title="Nothing to check out yet"
          body="Your cart is empty."
          action={
            <Link href="/products" prefetch={false} className="btn-dark">
              Shop all parts
            </Link>
          }
        />
      </div>
    );
  }

  const totals = computeOrderTotals(getTotalPrice());

  const validate = () => {
    const next: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = 'Enter a valid email address.';
    if (formData.firstName.trim().length < 2) next.firstName = 'Enter your first name.';
    if (formData.lastName.trim().length < 2) next.lastName = 'Enter your last name.';
    if (formData.address.trim().length < 10) next.address = 'Include street, barangay and building or house number.';
    if (!formData.city.trim()) next.city = 'Enter your city or municipality.';
    if (!/^\d{4}$/.test(formData.zipCode)) next.zipCode = 'Philippine ZIP codes have 4 digits.';

    if (paymentMethod === 'credit-card') {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) next.cardNumber = 'Card numbers have 16 digits.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        next.expiryDate = 'Use MM/YY.';
      } else {
        const [month, year] = formData.expiryDate.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        if (year < currentYear || (year === currentYear && month < now.getMonth() + 1)) next.expiryDate = 'This card has expired.';
      }
      if (!/^\d{3,4}$/.test(formData.cvv)) next.cvv = '3 or 4 digits on the back of the card.';
    }

    setErrors(next);
    return next;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === 'cardNumber') nextValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    if (name === 'expiryDate') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (name === 'cvv' || name === 'zipCode') nextValue = value.replace(/\D/g, '').slice(0, 4);

    setFormData((current) => ({ ...current, [name]: nextValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    setIsProcessing(true);
    setSubmitError(null);

    // TODO: hand off to a payment gateway here. Until one is connected the server
    // records the order and reserves stock without taking payment (stated on the page).
    try {
      // Only ids and quantities are sent; the server prices the order from the database.
      const order = await api<Order>('/orders', {
        method: 'POST',
        body: {
          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          shippingAddress: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            zipCode: formData.zipCode.trim(),
          },
          paymentMethod,
        },
      });

      setCompletedOrder(order);
      clearCart();
      void refreshCatalog();
      window.scrollTo({ top: 0 });
    } catch (error) {
      const field = error instanceof ApiError ? error.field : undefined;
      if (field && field in formData) {
        const message = errorMessage(error);
        setErrors((current) => ({ ...current, [field]: message }));
        formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus();
      } else {
        setSubmitError(errorMessage(error));
      }
      // Stock may have changed under us; re-price the cart so the summary is current.
      if (error instanceof ApiError && error.status === 409) void refreshCatalog();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Checkout</h1>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-10">
          <Step index="01" title="Contact">
            <Field id="email" label="Email for order updates" type="email" autoComplete="email" value={formData.email} onChange={handleChange} error={errors.email} />
          </Step>

          <Step index="02" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="First name" autoComplete="given-name" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
              <Field id="lastName" label="Last name" autoComplete="family-name" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
              <Field
                id="address"
                label="Street address"
                autoComplete="street-address"
                placeholder="House no., street, barangay"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                className="sm:col-span-2"
              />
              <Field id="city" label="City or municipality" autoComplete="address-level2" value={formData.city} onChange={handleChange} error={errors.city} />
              <Field id="zipCode" label="ZIP code" inputMode="numeric" autoComplete="postal-code" value={formData.zipCode} onChange={handleChange} error={errors.zipCode} />
            </div>
            <p className="mt-3 text-sm text-muted">We ship within the Philippines only.</p>
          </Step>

          <Step index="03" title="Payment">
            <fieldset>
              <legend className="sr-only">Payment method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => {
                  const checked = paymentMethod === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-control border px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-accent ${
                        checked ? 'border-ink bg-surface' : 'border-line bg-surface hover:border-ink/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={checked}
                        onChange={() => setPaymentMethod(option.value)}
                        className="h-4 w-4 accent-[rgb(var(--ink))]"
                      />
                      <span>
                        <span className="block text-sm font-semibold">{option.title}</span>
                        <span className="block text-xs text-muted">{option.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {paymentMethod === 'credit-card' && (
              <div key="card" className="mt-5 grid animate-fade-in gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <Field id="cardNumber" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleChange} error={errors.cardNumber} />
                <Field id="expiryDate" label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} error={errors.expiryDate} />
                <Field id="cvv" label="CVV" inputMode="numeric" autoComplete="cc-csc" value={formData.cvv} onChange={handleChange} error={errors.cvv} />
              </div>
            )}

            <p className="mt-5 rounded-control border border-dashed border-warn/60 p-3 text-sm text-ink">
              <strong>Online payment is not connected yet.</strong> Placing the order records it and reserves the stock. No money is
              taken on this site, and card details are not saved.
            </p>
          </Step>

          {submitError && (
            <p role="alert" className="animate-fade-in rounded-control border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
              {submitError}
            </p>
          )}

          <button type="submit" disabled={isProcessing} className="btn-primary h-14 w-full text-base">
            {isProcessing ? (
              <>
                <Spinner />
                Placing order
              </>
            ) : (
              `Place order · ${formatPrice(totals.total)}`
            )}
          </button>
        </form>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold">Your order</h2>
              <Link href="/cart" prefetch={false} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                Edit cart
              </Link>
            </div>
            <ul className="mt-4 space-y-3 border-b border-line pb-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-control bg-white p-1">
                    <ProductImage src={item.product.image} alt="" className="h-full w-full object-contain" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-bg">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{item.product.name}</span>
                  <span className="text-sm tabular-nums">{formatPrice(item.product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <OrderSummaryRows subtotal={totals.subtotal} itemCount={getTotalItems()} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
