'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/';

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;

    if (redirect && redirect !== location.pathname) {
      router.replace(redirect);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isLoginPage && <Footer />}
    </div>
  );
}
