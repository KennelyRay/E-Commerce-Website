export const FREE_SHIPPING_THRESHOLD = 2500;
export const SHIPPING_FEE = 150;
export const VAT_RATE = 0.12;

export function computeOrderTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = subtotal * VAT_RATE;

  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    freeShippingGap: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    freeShippingProgress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
  };
}
