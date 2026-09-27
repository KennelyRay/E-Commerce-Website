import { Order, PaymentMethod, Product } from '@/types';

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholePesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number, options: { whole?: boolean } = {}) {
  return (options.whole ? wholePesoFormatter : pesoFormatter).format(value);
}

export function discountPercent(product: Pick<Product, 'price' | 'originalPrice'>) {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export function formatDate(value: string, style: 'long' | 'short' = 'long') {
  return new Date(value).toLocaleDateString('en-PH', {
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: style === 'long' ? 'numeric' : undefined,
  });
}

export function formatSku(id: string) {
  return `VX-${id.padStart(4, '0')}`;
}

export const paymentLabels: Record<PaymentMethod, string> = {
  'credit-card': 'Card',
  gcash: 'GCash',
  maya: 'Maya',
  paypal: 'PayPal',
};

export const orderStatusLabels: Record<Order['status'], string> = {
  pending: 'Pending',
  paid: 'Paid',
  processing: 'Packing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function stockState(stock: number): { label: string; tone: 'ok' | 'warn' | 'danger' } {
  if (stock <= 0) {
    return { label: 'Out of stock', tone: 'danger' };
  }

  if (stock < 10) {
    return { label: `Only ${stock} left`, tone: 'warn' };
  }

  return { label: 'In stock', tone: 'ok' };
}
