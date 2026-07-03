import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/components/AppProviders';
import { AppShell } from '@/components/AppShell';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VertixHub - Premium PC Hardware Store',
  description: 'Your ultimate destination for high-performance PC components and hardware',
  keywords: ['PC hardware', 'graphics cards', 'processors', 'motherboards', 'RAM', 'PSU', 'gaming'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
