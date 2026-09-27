import React from 'react';
import Link from 'next/link';
import { CATEGORY_INFO, categoryHref } from '@/lib/categories';
import { Wordmark } from '@/components/ui';

export const STORE_CONTACT = {
  email: 'support@vertixhub.com',
  phone: '+63 998 427 6714',
  phoneHref: 'tel:+639984276714',
  address: '#5943 Purok 2 Irisan, Baguio City, Philippines',
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-3 text-sm text-muted">
            Desktop PC parts, shipped from Baguio City to anywhere in the Philippines.
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic">
            <p className="text-muted">{STORE_CONTACT.address}</p>
            <p>
              <a className="link" href={`mailto:${STORE_CONTACT.email}`}>
                {STORE_CONTACT.email}
              </a>
            </p>
            <p>
              <a className="link" href={STORE_CONTACT.phoneHref}>
                {STORE_CONTACT.phone}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Shop by category">
          <h2 className="spec-key mb-3 font-mono">Shop</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {CATEGORY_INFO.map((category) => (
              <li key={category.name}>
                <Link href={categoryHref(category.name)} prefetch={false} className="text-ink hover:underline underline-offset-4">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Store">
          <h2 className="spec-key mb-3 font-mono">Store</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/pc-builder" prefetch={false} className="hover:underline underline-offset-4">
                PC Builder
              </Link>
            </li>
            <li>
              <Link href="/contact#faq" prefetch={false} className="hover:underline underline-offset-4">
                Shipping, returns and payment
              </Link>
            </li>
            <li>
              <Link href="/account" prefetch={false} className="hover:underline underline-offset-4">
                Order history
              </Link>
            </li>
            <li>
              <Link href="/about" prefetch={false} className="hover:underline underline-offset-4">
                About the store
              </Link>
            </li>
            <li>
              <Link href="/contact" prefetch={false} className="hover:underline underline-offset-4">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="shell py-5 text-xs text-muted">© {new Date().getFullYear()} VertixHub. Shipping and 12% VAT are itemized before you pay.</p>
      </div>
    </footer>
  );
}
