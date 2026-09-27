'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/pricing';
import { STORE_CONTACT } from '@/components/Footer';
import { Breadcrumbs } from '@/components/ui';

const TOPICS = ['Question about a part', 'Build compatibility', 'An existing order', 'Warranty or return', 'Something else'];

const FAQS: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: 'Where do you ship, and how long does it take?',
    a: 'Anywhere in the Philippines, from our store in Baguio City. The estimated delivery shown at checkout is about five days after the order is placed.',
  },
  {
    q: 'How much is shipping?',
    a: `Free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, { whole: true })}. Below that it is a flat ${formatPrice(SHIPPING_FEE, { whole: true })}.`,
  },
  {
    q: 'Do prices include VAT?',
    a: 'No. Product prices exclude the 12% VAT, which is itemized in the cart and at checkout before you place the order.',
  },
  {
    q: 'Which payment methods can I pick?',
    a: 'Card, GCash, Maya or PayPal. Online payment is not connected yet, so placing an order reserves the stock without charging you.',
  },
  {
    q: 'Can I return a part?',
    a: 'Unopened items in their original packaging can be returned within 30 days. Send us your order number through the form on this page.',
  },
  {
    q: 'How do I know the parts will work together?',
    a: (
      <>
        Use the <Link href="/pc-builder" prefetch={false} className="link">PC Builder</Link>. It checks CPU and board sockets, memory type,
        cooler mounting and power supply headroom from the listed specs. Each product page also lists parts it fits with.
      </>
    ),
  },
];

type FormState = { name: string; email: string; topic: string; orderNumber: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

function FaqItem({ q, a, index }: { q: string; a: React.ReactNode; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const id = `faq-${index}`;

  return (
    <div className="border-b border-line">
      <h3 className="font-sans text-base" style={{ fontStretch: '100%' }}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={id}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left font-semibold"
        >
          {q}
          <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </h3>
      {/* Grid row transition animates to the content's natural height. */}
      <div id={id} className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className={`overflow-hidden transition-[visibility] duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
          <p className="pb-4 pr-8 text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', topic: TOPICS[0], orderNumber: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPrepared, setIsPrepared] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: FormErrors = {};
    if (form.name.trim().length < 2) next.name = 'Tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter an email we can reply to.';
    if (form.message.trim().length < 10) next.message = 'Add a few more details so we can help.';
    setErrors(next);

    const firstError = Object.keys(next)[0];
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }

    const subject = `${form.topic}${form.orderNumber.trim() ? ` (${form.orderNumber.trim()})` : ''}`;
    const body = `${form.message.trim()}\n\n${form.name.trim()}\n${form.email.trim()}`;
    window.location.href = `mailto:${STORE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsPrepared(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STORE_CONTACT.email);
      toast.success('Email address copied');
    } catch {
      toast.error('Copy failed. Select the address and copy it manually.');
    }
  };

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'Contact' }]} />

      <div className="mt-4 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Contact</h1>
          <p className="mt-3 max-w-md text-muted">
            Questions about a part, a build or an order. Include your order number if you have one and we can look it up faster.
          </p>

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            <div className="grid grid-cols-[90px_1fr] gap-4 py-4">
              <dt className="text-muted">Email</dt>
              <dd>
                <a className="link" href={`mailto:${STORE_CONTACT.email}`}>
                  {STORE_CONTACT.email}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-4 py-4">
              <dt className="text-muted">Phone</dt>
              <dd>
                <a className="link" href={STORE_CONTACT.phoneHref}>
                  {STORE_CONTACT.phone}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-4 py-4">
              <dt className="text-muted">Store</dt>
              <dd>{STORE_CONTACT.address}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5 sm:p-6">
          {isPrepared ? (
            <div className="animate-pop-in py-6" role="status">
              <h2 className="text-2xl font-bold">Your email is ready to send</h2>
              <p className="mt-2 text-muted">
                We opened your email app with the message filled in. Press send there to reach us. If nothing opened, email{' '}
                <span className="font-medium text-ink">{STORE_CONTACT.email}</span> directly.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" onClick={copyEmail} className="btn-dark">
                  Copy email address
                </button>
                <button type="button" onClick={() => setIsPrepared(false)} className="btn-outline">
                  Edit message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <h2 className="text-xl font-bold sm:col-span-2">Write to us</h2>
              <div>
                <label htmlFor="contact-name" className="label">
                  Name
                </label>
                <input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} className={`field ${errors.name ? 'field-error' : ''}`} />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 text-sm text-danger">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className="label">
                  Email
                </label>
                <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} className={`field ${errors.email ? 'field-error' : ''}`} />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 text-sm text-danger">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-topic" className="label">
                  Topic
                </label>
                <select id="contact-topic" name="topic" value={form.topic} onChange={handleChange} className="field">
                  {TOPICS.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="contact-orderNumber" className="label">
                  Order number <span className="font-normal text-muted">(optional)</span>
                </label>
                <input id="contact-orderNumber" name="orderNumber" placeholder="VTX-" value={form.orderNumber} onChange={handleChange} className="field font-mono" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`field py-2.5 ${errors.message ? 'field-error' : ''}`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-sm text-danger">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                <button type="submit" className="btn-dark px-6">
                  Open in my email app
                </button>
                <p className="text-xs text-muted">Sends from your own email, so our reply lands in your inbox.</p>
              </div>
            </form>
          )}
        </div>
      </div>

      <section id="faq" className="mt-20 scroll-mt-24 grid gap-8 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq-heading">
        <div>
          <h2 id="faq-heading" className="text-2xl font-bold sm:text-3xl">
            Shipping, returns and payment
          </h2>
          <p className="mt-2 text-muted">The store policies, in short.</p>
        </div>
        <div className="border-t border-line">
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
