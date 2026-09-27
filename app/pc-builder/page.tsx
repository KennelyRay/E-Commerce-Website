'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Search, X } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { keySpecLine } from '@/components/ProductCard';
import { Breadcrumbs, PageLoader, Price, StockTag } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/hooks/useCatalog';
import { useDialog } from '@/hooks/useDialog';
import {
  BUILD_SLOTS,
  BuildSlot,
  CheckResult,
  estimateWattage,
  firstNumber,
  getSpec,
  PCBuild,
  PCBuildKey,
  recommendedPsuWattage,
  runCompatibilityChecks,
} from '@/lib/compatibility';
import { formatDate, formatPrice } from '@/lib/format';
import { getBuildSnapshot, saveBuildSnapshot } from '@/lib/shop';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { productHref } from '@/lib/api';

type PresetId = 'gaming' | 'creator' | 'value';
type ProductSort = 'recommended' | 'price-asc' | 'price-desc';

type SavedBuildSnapshot = {
  name: string;
  componentIds: Partial<Record<PCBuildKey, string>>;
  timestamp: string;
};

const PRESETS: Array<{ id: PresetId; name: string; detail: string }> = [
  { id: 'gaming', name: 'High-refresh gaming', detail: 'Spends most of the budget on the graphics card.' },
  { id: 'creator', name: 'Editing and streaming', detail: 'More cores, more memory, larger SSD.' },
  { id: 'value', name: 'Value build', detail: 'Cheapest in-stock part that fits each slot.' },
];

const DEFAULT_NAME = 'Untitled build';

// Which checks affect which slot, so a failing check can be shown on the right row.
const CHECKS_BY_SLOT: Partial<Record<PCBuildKey, string[]>> = {
  cpu: ['socket', 'cooler'],
  motherboard: ['socket', 'memory'],
  ram: ['memory'],
  cooling: ['cooler'],
  psu: ['power'],
  gpu: ['power'],
};

function productsFor(products: Product[], slot: BuildSlot) {
  return products.filter((product) => product.category === slot.category);
}

function candidateChecks(build: PCBuild, slot: BuildSlot, candidate: Product): CheckResult[] {
  const relevant = CHECKS_BY_SLOT[slot.key] ?? [];
  return runCompatibilityChecks({ ...build, [slot.key]: candidate }).filter((check) => relevant.includes(check.id));
}

function PartPicker({
  slot,
  build,
  products,
  onPick,
  onClose,
}: {
  slot: BuildSlot | null;
  build: PCBuild;
  products: Product[];
  onPick: (slot: BuildSlot, product: Product) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ProductSort>('recommended');
  const ref = useDialog<HTMLDivElement>(Boolean(slot), onClose);

  useEffect(() => {
    setQuery('');
    setSort('recommended');
  }, [slot?.key]);

  const options = useMemo(() => {
    if (!slot) return [];
    const needle = query.trim().toLowerCase();
    return productsFor(products, slot)
      .filter((product) => !needle || `${product.name} ${product.tags.join(' ')} ${Object.values(product.specifications ?? {}).join(' ')}`.toLowerCase().includes(needle))
      .map((product) => ({ product, checks: candidateChecks(build, slot, product) }))
      .sort((a, b) => {
        if (sort === 'price-asc') return a.product.price - b.product.price;
        if (sort === 'price-desc') return b.product.price - a.product.price;
        const failA = a.checks.some((check) => check.status === 'fail') ? 1 : 0;
        const failB = b.checks.some((check) => check.status === 'fail') ? 1 : 0;
        return failA - failB || Number(b.product.stock > 0) - Number(a.product.stock > 0) || Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured));
      });
  }, [slot, products, build, query, sort]);

  if (!slot) {
    return null;
  }

  const current = build[slot.key];

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] animate-slide-in-right flex-col bg-surface shadow-overlay"
      >
        <div className="border-b border-line px-5 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <h2 id="picker-title" className="text-lg font-bold">
              Choose a {slot.name.toLowerCase()}
            </h2>
            <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-muted">{slot.hint}</p>
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                data-autofocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by name or spec"
                aria-label={`Filter ${slot.name.toLowerCase()} options`}
                className="field pl-9"
              />
            </div>
            <label htmlFor="picker-sort" className="sr-only">
              Sort
            </label>
            <select id="picker-sort" value={sort} onChange={(event) => setSort(event.target.value as ProductSort)} className="field w-auto">
              <option value="recommended">Best fit</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </div>
        </div>

        <ul className="flex-1 space-y-2 overflow-y-auto p-4">
          {options.length === 0 && <li className="py-10 text-center text-sm text-muted">No {slot.category.toLowerCase()} match that filter.</li>}
          {options.map(({ product, checks }) => {
            const soldOut = product.stock <= 0;
            const failing = checks.filter((check) => check.status === 'fail');
            const isCurrent = current?.id === product.id;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => onPick(slot, product)}
                  className={`flex w-full gap-3 rounded-card border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${
                    isCurrent ? 'border-ink bg-sunken' : 'border-line hover:border-ink/40'
                  }`}
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-control bg-white p-1">
                    <ProductImage src={product.image} alt="" className="h-full w-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug">{product.name}</span>
                    <span className="mt-0.5 block truncate font-mono text-xs text-muted">{keySpecLine(product)}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {checks.length > 0 &&
                        (failing.length ? (
                          <span className="text-xs font-medium text-danger">Won&apos;t fit: {failing[0].message}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-ok">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Fits your build
                          </span>
                        ))}
                      <StockTag stock={product.stock} />
                    </span>
                  </span>
                  <span className="text-right">
                    <Price product={product} size="sm" />
                    {isCurrent && <span className="mt-1 block text-xs font-medium text-muted">Selected</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function PowerMeter({ build }: { build: PCBuild }) {
  const draw = estimateWattage(build);
  const recommended = recommendedPsuWattage(build);
  const capacity = firstNumber(getSpec(build.psu, 'Wattage'));
  const scale = Math.max(capacity, recommended, 600);
  const short = capacity > 0 && capacity < recommended;

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">Estimated draw</span>
        <span className="font-mono tabular-nums">{draw}W</span>
      </div>
      <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
        <div className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out ${short ? 'bg-danger' : 'bg-ink'}`} style={{ width: `${(draw / scale) * 100}%` }} />
        {capacity > 0 && <div className="absolute inset-y-0 w-0.5 bg-ok transition-[left] duration-500" style={{ left: `calc(${(capacity / scale) * 100}% - 1px)` }} />}
      </div>
      <p className="mt-2 text-xs text-muted">
        {capacity > 0 ? (
          <>
            PSU <span className="font-mono text-ink">{capacity}W</span> · recommended <span className="font-mono text-ink">{recommended}W</span> or more
          </>
        ) : (
          <>
            Pick a power supply of at least <span className="font-mono text-ink">{recommended}W</span>
          </>
        )}
      </p>
    </div>
  );
}

export default function PCBuilderPage() {
  const router = useRouter();
  const { products, isLoading } = useCatalog();
  const { addManyToCart, closeDrawer } = useCart();
  const [build, setBuild] = useState<PCBuild>({});
  const [buildName, setBuildName] = useState(DEFAULT_NAME);
  const [pickerSlot, setPickerSlot] = useState<BuildSlot | null>(null);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [savedBuild, setSavedBuild] = useState<SavedBuildSnapshot | null>(null);

  useEffect(() => {
    setSavedBuild(getBuildSnapshot<SavedBuildSnapshot>());
  }, []);

  const total = useMemo(() => Object.values(build).reduce((sum, part) => sum + (part?.price ?? 0), 0), [build]);
  const checks = useMemo(() => runCompatibilityChecks(build), [build]);
  const requiredSlots = BUILD_SLOTS.filter((slot) => slot.required);
  const filledRequired = requiredSlots.filter((slot) => build[slot.key]).length;
  const missingRequired = requiredSlots.filter((slot) => !build[slot.key]);
  const failures = checks.filter((check) => check.status === 'fail');
  const partCount = Object.values(build).filter(Boolean).length;
  const isComplete = missingRequired.length === 0;

  const pick = (slot: BuildSlot, product: Product) => {
    setBuild((current) => ({ ...current, [slot.key]: product }));
    setPickerSlot(null);
  };

  const remove = (key: PCBuildKey) => {
    setBuild((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const addBuildToCart = () => {
    const parts = Object.values(build).filter((part): part is Product => Boolean(part) && (part?.stock ?? 0) > 0);
    if (parts.length === 0) {
      toast.error('Pick at least one in-stock part first.');
      return false;
    }
    return addManyToCart(parts.map((product) => ({ product, quantity: 1 }))).addedUnits > 0;
  };

  const checkoutBuild = () => {
    let added = false;
    flushSync(() => {
      added = addBuildToCart();
    });
    if (added) {
      closeDrawer();
      router.push('/checkout');
    }
  };

  const saveBuild = () => {
    const snapshot: SavedBuildSnapshot = {
      name: buildName.trim() || DEFAULT_NAME,
      componentIds: Object.fromEntries(Object.entries(build).filter(([, part]) => part).map(([key, part]) => [key, part!.id])),
      timestamp: new Date().toISOString(),
    };
    saveBuildSnapshot(snapshot);
    setSavedBuild(snapshot);
    toast.success('Build saved on this device.');
  };

  const loadBuild = () => {
    if (!savedBuild?.componentIds) {
      return;
    }
    const catalog = new Map(products.map((product) => [product.id, product]));
    const restored = Object.entries(savedBuild.componentIds).reduce<PCBuild>((accumulator, [key, id]) => {
      const product = id ? catalog.get(id) : undefined;
      if (product) accumulator[key as PCBuildKey] = product;
      return accumulator;
    }, {});
    setBuild(restored);
    setBuildName(savedBuild.name || DEFAULT_NAME);
    toast.success(`Loaded "${savedBuild.name}".`);
  };

  const applyPreset = (presetId: PresetId) => {
    const choose = (key: PCBuildKey, options: { budget?: number; featured?: boolean; cheap?: boolean } = {}) => {
      const slot = BUILD_SLOTS.find((entry) => entry.key === key);
      if (!slot) return undefined;
      const candidates = productsFor(products, slot)
        .filter((product) => product.stock > 0)
        .sort((a, b) => {
          if (options.featured) {
            const delta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
            if (delta) return delta;
          }
          return options.cheap ? a.price - b.price : b.price - a.price;
        });
      if (!options.budget) return candidates[0];
      return candidates.find((product) => product.price <= options.budget!) ?? candidates[candidates.length - 1];
    };

    const presets: Record<PresetId, PCBuild> = {
      gaming: {
        cpu: choose('cpu', { budget: 70000, featured: true }),
        motherboard: choose('motherboard', { budget: 50000, featured: true }),
        ram: choose('ram', { budget: 40000, featured: true }),
        gpu: choose('gpu', { budget: 120000, featured: true }),
        storage: choose('storage', { budget: 30000, featured: true }),
        psu: choose('psu', { budget: 30000 }),
        case: choose('case'),
        cooling: choose('cooling'),
      },
      creator: {
        cpu: choose('cpu', { budget: 80000, featured: true }),
        motherboard: choose('motherboard', { budget: 45000 }),
        ram: choose('ram', { budget: 70000, featured: true }),
        gpu: choose('gpu', { budget: 80000 }),
        storage: choose('storage', { budget: 35000, featured: true }),
        psu: choose('psu', { budget: 25000 }),
        case: choose('case'),
        cooling: choose('cooling'),
      },
      value: {
        cpu: choose('cpu', { cheap: true }),
        motherboard: choose('motherboard', { cheap: true }),
        ram: choose('ram', { cheap: true }),
        gpu: choose('gpu', { cheap: true }),
        storage: choose('storage', { cheap: true }),
        psu: choose('psu', { cheap: true }),
        case: choose('case', { cheap: true }),
      },
    };

    // Swap the board for one that matches the chosen CPU when the preset picked a mismatch.
    const next = presets[presetId];
    if (next.cpu && next.motherboard && runCompatibilityChecks(next).some((check) => check.id === 'socket' && check.status === 'fail')) {
      const fitting = products.find(
        (product) => product.category === 'Motherboards' && product.stock > 0 && getSpec(product, 'Socket')?.replace(/\s/g, '') === getSpec(next.cpu, 'Socket')?.replace(/\s/g, ''),
      );
      if (fitting) next.motherboard = fitting;
    }

    setBuild(next);
    setBuildName(PRESETS.find((preset) => preset.id === presetId)?.name ?? DEFAULT_NAME);
  };

  if (isLoading) {
    return <PageLoader label="Loading parts" />;
  }

  return (
    <div className="shell pb-8 pt-6">
      <Breadcrumbs items={[{ label: 'Store', href: '/' }, { label: 'PC Builder' }]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold sm:text-4xl">PC Builder</h1>
          <p className="mt-1 max-w-xl text-muted">One part per slot. Sockets, memory type, cooler mounting and power are checked as you pick.</p>
        </div>
        <div className="w-full sm:w-80">
          <label htmlFor="build-name" className="label">
            Build name
          </label>
          <input id="build-name" value={buildName} onChange={(event) => setBuildName(event.target.value)} className="field font-semibold" />
        </div>
      </div>

      <section className="mt-6" aria-labelledby="presets-heading">
        <h2 id="presets-heading" className="spec-key mb-2 font-mono">
          Start from a preset
        </h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`min-w-[220px] rounded-card border p-3 text-left transition-colors sm:min-w-0 ${
                buildName === preset.name ? 'border-ink bg-surface' : 'border-line bg-surface hover:border-ink/40'
              }`}
            >
              <span className="block text-sm font-semibold">{preset.name}</span>
              <span className="mt-0.5 block text-xs text-muted">{preset.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ol className="divide-y divide-line border-y border-line" aria-label="Build slots">
          {BUILD_SLOTS.map((slot, index) => {
            const part = build[slot.key];
            const slotFailures = failures.filter((check) => CHECKS_BY_SLOT[slot.key]?.includes(check.id));
            const available = productsFor(products, slot).length;
            return (
              <li key={slot.key} className="grid grid-cols-[28px_1fr] gap-3 py-4 sm:grid-cols-[28px_140px_1fr_auto] sm:items-center">
                <span className="pt-0.5 font-mono text-xs text-muted sm:pt-0">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-sm font-semibold">{slot.name}</p>
                  <p className="text-xs text-muted">{slot.required ? 'Required' : 'Optional'}</p>
                </div>

                {part ? (
                  <div key={part.id} className="col-start-2 flex min-w-0 animate-pop-in items-center gap-3 sm:col-start-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-control bg-white p-1">
                      <ProductImage src={part.image} alt="" className="h-full w-full object-contain" />
                    </span>
                    <span className="min-w-0">
                      <Link href={productHref(part.id)} prefetch={false} className="block truncate text-sm font-medium hover:underline underline-offset-4">
                        {part.name}
                      </Link>
                      <span className="block truncate font-mono text-xs text-muted">{keySpecLine(part)}</span>
                      {slotFailures.map((check) => (
                        <span key={check.id} className="block text-xs font-medium text-danger">
                          {check.message}
                        </span>
                      ))}
                    </span>
                  </div>
                ) : (
                  <p className="col-start-2 text-sm text-muted sm:col-start-3">{available ? `${available} ${available === 1 ? 'option' : 'options'}` : 'None listed right now'}</p>
                )}

                <div className="col-start-2 flex items-center gap-2 sm:col-start-4 sm:justify-end">
                  {part && <span className="mr-2 text-sm font-semibold tabular-nums">{formatPrice(part.price)}</span>}
                  <button type="button" onClick={() => setPickerSlot(slot)} disabled={!available} className={part ? 'btn-outline h-10 min-h-0 px-3' : 'btn-dark h-10 min-h-0 px-4'}>
                    {part ? 'Change' : 'Choose'}
                  </button>
                  {part && (
                    <button type="button" onClick={() => remove(slot.key)} className="icon-btn h-10 w-10 text-muted hover:text-danger" aria-label={`Remove ${slot.name.toLowerCase()}`}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card divide-y divide-line">
            <div className="p-5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted">Required parts</span>
                <span className="font-mono tabular-nums">
                  {filledRequired}/{requiredSlots.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-label="Required parts chosen" aria-valuemin={0} aria-valuemax={requiredSlots.length} aria-valuenow={filledRequired}>
                <div className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out" style={{ width: `${(filledRequired / requiredSlots.length) * 100}%` }} />
              </div>
              <p className="mt-4 spec-key">Build total</p>
              <p key={total} className="animate-fade-in font-display text-3xl font-bold tabular-nums">
                {formatPrice(total)}
              </p>
              <p className="text-xs text-muted">Before 12% VAT and shipping</p>
            </div>

            <div className="p-5">
              {partCount > 0 ? (
                <PowerMeter build={build} />
              ) : (
                <p className="text-sm text-muted">Estimated power draw appears once you pick parts.</p>
              )}
            </div>

            <div className="p-5">
              <p className="spec-key mb-2">Checks</p>
              {checks.length === 0 ? (
                <p className="text-sm text-muted">Pick a CPU and motherboard to start checking.</p>
              ) : (
                <ul className="space-y-2" aria-live="polite">
                  {checks.map((check) => (
                    <li key={check.id + check.message} className="flex animate-fade-in items-start gap-2 text-sm">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-bg ${check.status === 'pass' ? 'bg-ok' : 'bg-danger'}`} aria-hidden="true">
                        {check.status === 'pass' ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="sr-only">{check.status === 'pass' ? 'Pass: ' : 'Problem: '}</span>
                        {check.message}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {missingRequired.length > 0 && partCount > 0 && (
                <p className="mt-3 text-xs text-muted">Still needed: {missingRequired.map((slot) => slot.name.toLowerCase()).join(', ')}.</p>
              )}
            </div>

            <div className="space-y-2 p-5">
              <button type="button" onClick={addBuildToCart} disabled={partCount === 0} className="btn-primary w-full">
                Add {partCount || ''} {partCount === 1 ? 'part' : 'parts'} to cart
              </button>
              <button
                type="button"
                onClick={checkoutBuild}
                disabled={!isComplete || failures.length > 0}
                className="btn-outline w-full"
                title={!isComplete ? 'Choose every required part first' : failures.length ? 'Fix the failing checks first' : undefined}
              >
                Check out this build
              </button>
              {(!isComplete || failures.length > 0) && partCount > 0 && (
                <p className="text-xs text-muted">{failures.length ? 'Fix the failing checks to check out the whole build.' : 'Choose every required part to check out the whole build.'}</p>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button type="button" onClick={saveBuild} disabled={partCount === 0} className="btn-ghost h-10 min-h-0 px-2">
                  Save
                </button>
                <button type="button" onClick={loadBuild} disabled={!savedBuild} className="btn-ghost h-10 min-h-0 px-2">
                  Load
                </button>
                <button type="button" onClick={() => setIsClearOpen(true)} disabled={partCount === 0} className="btn-ghost h-10 min-h-0 px-2 text-danger">
                  Clear
                </button>
              </div>
              {savedBuild && (
                <p className="text-center text-xs text-muted">
                  Saved: {savedBuild.name}, {formatDate(savedBuild.timestamp, 'short')}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <PartPicker slot={pickerSlot} build={build} products={products} onPick={pick} onClose={() => setPickerSlot(null)} />

      <Modal
        isOpen={isClearOpen}
        title="Clear this build?"
        description="Every selected part is removed. A saved build on this device is not affected."
        confirmText="Clear build"
        cancelText="Keep it"
        variant="danger"
        onConfirm={() => {
          setBuild({});
          setBuildName(DEFAULT_NAME);
          setIsClearOpen(false);
        }}
        onClose={() => setIsClearOpen(false)}
      />
    </div>
  );
}
