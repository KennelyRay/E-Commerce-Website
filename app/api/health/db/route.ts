import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [productCount, userCount, orderCount] = await Promise.all([
      db.product.count(),
      db.user.count(),
      db.order.count(),
    ]);

    return NextResponse.json({
      ok: true,
      database: 'neon-postgresql',
      counts: {
        products: productCount,
        users: userCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database connection failed';

    return NextResponse.json(
      {
        ok: false,
        database: 'neon-postgresql',
        error: message,
      },
      { status: 500 },
    );
  }
}
