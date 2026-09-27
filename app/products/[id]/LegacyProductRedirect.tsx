'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productHref } from '@/lib/api';
import { PageLoader } from '@/components/ui';

export function LegacyProductRedirect({ id }: { id: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(productHref(id));
  }, [id, router]);

  return <PageLoader label="Opening part" />;
}
