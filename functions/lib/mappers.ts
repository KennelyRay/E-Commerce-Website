// Converts snake_case rows into the camelCase shapes the storefront already uses (types/index.ts).
// numeric columns arrive from pg as strings, so money is parsed here in one place.

type Row = Record<string, any>;

const money = (value: unknown) => (value === null || value === undefined ? undefined : Number(value));

export function toProduct(row: Row) {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: Number(row.price),
    originalPrice: money(row.original_price),
    image: row.image as string,
    images: (row.images as string[]) ?? [],
    category: row.category as string,
    stock: Number(row.stock),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    featured: Boolean(row.featured),
    tags: (row.tags as string[]) ?? [],
    specifications: (row.specifications as Record<string, string>) ?? {},
  };
}

export function toUser(row: Row) {
  return {
    id: row.id as string,
    name: row.name as string,
    username: row.username as string,
    email: row.email as string,
    isAdmin: Boolean(row.is_admin),
    isBanned: Boolean(row.is_banned),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export function toOrder(row: Row, items: Row[]) {
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    userId: row.user_id as string,
    items: items.map((item) => ({
      id: item.id as string,
      quantity: Number(item.quantity),
      product: { ...(item.product_snapshot as object), id: item.product_id ?? item.product_snapshot?.id, price: Number(item.unit_price) },
    })),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    total: Number(row.total),
    paymentMethod: row.payment_method as string,
    status: row.status as string,
    createdAt: new Date(row.created_at).toISOString(),
    estimatedDelivery: new Date(row.estimated_delivery).toISOString(),
    shippingAddress: row.shipping_address,
  };
}
