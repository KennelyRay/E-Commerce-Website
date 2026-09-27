'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui';

// The storefront moved to "/". Keeps old bookmarks and links working.
export default function LegacyHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return <PageLoader label="Opening the store" />;
}
