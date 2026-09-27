'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgb(var(--ink))',
              color: 'rgb(var(--bg))',
              borderRadius: '6px',
              fontSize: '14px',
              maxWidth: '420px',
            },
            success: { iconTheme: { primary: 'rgb(var(--ok))', secondary: 'rgb(var(--bg))' } },
            error: { iconTheme: { primary: 'rgb(var(--danger))', secondary: 'rgb(var(--bg))' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
