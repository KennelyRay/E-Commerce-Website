'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { PageLoader } from '@/components/ui';

// Product pages read ?id= so parts added in the admin work without rebuilding the static site.
function ProductRoute() {
  const id = useSearchParams()?.get('id') ?? '';
  return <ProductDetail id={id} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading part" />}>
      <ProductRoute />
    </Suspense>
  );
}
