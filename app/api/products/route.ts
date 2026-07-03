import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load products';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
