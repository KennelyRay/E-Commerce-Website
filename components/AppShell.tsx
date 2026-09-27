'use client';

import { usePathname } from 'next/navigation';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  // The admin console and sign-in page use their own chrome.
  const isBare = pathname.startsWith('/admin') || pathname.startsWith('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[200] rounded-control bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {!isBare && <Navbar />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isBare && <Footer />}
      <CartDrawer />
    </div>
  );
}
