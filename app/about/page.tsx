'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/hooks/useCatalog';
import { categoryHref, summarizeCategories } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { STORE_CONTACT } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Breadcrumbs } from '@/components/ui';

const BUILDER_RULES = [
  ['Socket', 'The CPU socket listed in its specs must equal the motherboard socket, for example AM5 with AM5.'],
  ['Memory', 'The memory kit type (DDR5) must appear in the motherboard memory support line.'],
  ['Cooler', 'The CPU socket must appear in the cooler list of supported mounts.'],
  ['Power', 'Estimated draw is CPU power + GPU power + about 150W for board, memory, storage and fans. The PSU must cover that plus 25%, or the GPU maker recommendation if it is higher.'],
];

export default function AboutPage() {
  const { products, isLoading } = useCatalog();
  const categories = useMemo(() => summarizeCategories(products), [products]);

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'About' }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl" style={{ fontStretch: '118%' }}>
            A PC parts store in Baguio City, shipping nationwide.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            VertixHub sells desktop components: processors, motherboards, memory, graphics cards, storage, power supplies, cases and
            cooling. Each listing shows its full spec sheet, and the PC Builder checks the parts against each other before you order.
          </p>
        </div>
        <address className="card h-fit p-5 not-italic">
          <p className="spec-key">Store</p>
          <p className="mt-1">{STORE_CONTACT.address}</p>
          <p className="mt-4">
            <a className="link" href={`mailto:${STORE_CONTACT.email}`}>
              {STORE_CONTACT.email}
            </a>
          </p>
          <p className="mt-1">
            <a className="link" href={STORE_CONTACT.phoneHref}>
              {STORE_CONTACT.phone}
            </a>
          </p>
          <Link href="/contact" prefetch={false} className="btn-dark mt-6 w-full">
            Send us a message
          </Link>
        </address>
      </div>

      <Reveal as="section" className="mt-16" aria-labelledby="stock-heading">
        <h2 id="stock-heading" className="border-b-2 border-ink pb-2 text-2xl font-bold">
          What we stock
        </h2>
        {isLoading ? (
          <div className="skeleton mt-4 h-40" />
        ) : (
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th scope="col" className="py-2 font-normal">
                  Category
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  Parts
                </th>
                <th scope="col" className="hidden py-2 text-right font-normal sm:table-cell">
                  Price range
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.name} className="border-b border-line">
                  <td className="py-2.5">
                    <Link href={categoryHref(category.name)} prefetch={false} className="font-medium hover:underline underline-offset-4">
                      {category.name}
                    </Link>
                  </td>
                  <td className="py-2.5 text-right font-mono tabular-nums">{category.count}</td>
                  <td className="hidden py-2.5 text-right font-mono tabular-nums sm:table-cell">
                    {formatPrice(category.minPrice, { whole: true })} to {formatPrice(category.maxPrice, { whole: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Reveal>

      <Reveal as="section" className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.5fr]" aria-labelledby="rules-heading">
        <div>
          <h2 id="rules-heading" className="text-2xl font-bold">
            How the builder checks a build
          </h2>
          <p className="mt-3 text-muted">
            The checks read the same spec sheets you see on each product page. When a spec is missing, that check is skipped rather
            than guessed.
          </p>
          <Link href="/pc-builder" prefetch={false} className="btn-outline mt-6">
            Open the builder
          </Link>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          {BUILDER_RULES.map(([term, detail]) => (
            <div key={term} className="grid gap-1 py-4 sm:grid-cols-[100px_1fr] sm:gap-4">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-muted">{detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal as="section" className="mt-16 rounded-card bg-panel p-6 text-panel-ink sm:p-8">
        <h2 className="text-2xl font-bold text-panel-ink">Delivery</h2>
        <p className="mt-2 max-w-2xl text-panel-muted">
          Orders ship from Baguio City to addresses in the Philippines, with an estimated delivery of about five days. Shipping is
          free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })}.
        </p>
      </Reveal>
    </div>
  );
}
