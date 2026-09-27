'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDialog } from '@/hooks/useDialog';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { SearchPalette } from '@/components/SearchPalette';
import { Wordmark } from '@/components/ui';

const NAV_LINKS = [
  { name: 'Shop', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'PC Builder', href: '/pc-builder' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('vertixhub_theme', next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`icon-btn ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function AccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <Link href="/login" prefetch={false} className="btn-ghost hidden px-3 sm:inline-flex">
        Sign in
      </Link>
    );
  }

  const initial = (user.name || user.username).charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="icon-btn"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Account menu for ${user.name}`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-bg">{initial}</span>
      </button>
      {isOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-60 animate-pop-in rounded-card bg-surface py-1 shadow-overlay">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <Link role="menuitem" href="/account" prefetch={false} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-sunken">
            Orders and account
          </Link>
          {user.isAdmin && (
            <Link role="menuitem" href="/admin" prefetch={false} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-sunken">
              Store admin
            </Link>
          )}
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
              router.push('/');
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-sunken"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? '/';
  const { user, logout } = useAuth();
  const panelRef = useDialog<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] md:hidden">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm animate-slide-in-right flex-col bg-surface shadow-overlay"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Wordmark />
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={onClose}
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              className={`flex min-h-[48px] items-center rounded-control px-3 font-display text-lg font-semibold ${
                isActive(pathname, link.href) ? 'bg-sunken text-ink' : 'text-ink hover:bg-sunken'
              }`}
              style={{ fontStretch: '112%' }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          {user ? (
            <div className="space-y-2">
              <p className="text-sm text-muted">Signed in as {user.name}</p>
              <Link href="/account" prefetch={false} onClick={onClose} className="btn-outline w-full">
                Orders and account
              </Link>
              {user.isAdmin && (
                <Link href="/admin" prefetch={false} onClick={onClose} className="btn-outline w-full">
                  Store admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="btn-ghost w-full text-danger"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" prefetch={false} onClick={onClose} className="btn-dark w-full">
              Sign in or create account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname() ?? '/';
  const { getTotalItems, openDrawer, addedTick } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const count = getTotalItems();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-ink text-bg">
        <p className="shell py-2 text-center text-xs sm:text-[13px]">
          Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })} · Shipping across the Philippines from Baguio City
        </p>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-bg">
        <div className="shell flex h-16 items-center gap-4">
          <Link href="/" prefetch={false} className="shrink-0 rounded-control" aria-label="VertixHub home">
            <Wordmark />
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${active ? 'text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {link.name}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-[13px] h-0.5 origin-left bg-accent transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden h-10 w-56 items-center gap-2 rounded-control border border-line bg-surface px-3 text-sm text-muted transition-colors hover:border-ink/30 lg:flex"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Search parts</span>
              <kbd className="ml-auto rounded border border-line px-1.5 font-mono text-[11px]">Ctrl K</kbd>
            </button>
            <button type="button" onClick={() => setIsSearchOpen(true)} className="icon-btn lg:hidden" aria-label="Search parts">
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />
            <AccountMenu />

            <button type="button" onClick={openDrawer} className="icon-btn relative" aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span
                  key={addedTick}
                  className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] animate-bump items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent tabular-nums"
                >
                  {count}
                </span>
              )}
            </button>

            <button type="button" onClick={() => setIsMenuOpen(true)} className="icon-btn md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
