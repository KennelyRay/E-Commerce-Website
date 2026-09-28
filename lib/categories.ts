import { Product } from '@/types';

export type CategoryInfo = {
  name: string;
  slug: string;
  blurb: string;
};

// Only categories the catalog actually stocks. Order follows a typical build sequence.
export const CATEGORY_INFO: CategoryInfo[] = [
  { name: 'Processors', slug: 'processors', blurb: 'AMD and Intel desktop CPUs' },
  { name: 'Motherboards', slug: 'motherboards', blurb: 'AM5, AM4 and LGA1700 boards' },
  { name: 'Memory (RAM)', slug: 'memory', blurb: 'DDR5 and DDR4 desktop kits' },
  { name: 'Graphics Cards', slug: 'graphics-cards', blurb: 'GeForce and Radeon GPUs' },
  { name: 'Storage', slug: 'storage', blurb: 'NVMe and SATA SSDs, hard drives' },
  { name: 'Power Supplies', slug: 'power-supplies', blurb: 'ATX power supplies' },
  { name: 'Cases', slug: 'cases', blurb: 'Mid and full towers' },
  { name: 'Cooling', slug: 'cooling', blurb: 'Air and liquid CPU coolers' },
];

export type CategorySummary = CategoryInfo & {
  count: number;
  inStock: number;
  minPrice: number;
  maxPrice: number;
  image?: string;
};

export function summarizeCategories(products: Product[]): CategorySummary[] {
  return CATEGORY_INFO.map((info) => {
    const items = products.filter((product) => product.category === info.name);
    const prices = items.map((product) => product.price);
    const lead = items.find((product) => product.featured) ?? items[0];

    return {
      ...info,
      count: items.length,
      inStock: items.filter((product) => product.stock > 0).length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      image: lead?.image,
    };
  }).filter((category) => category.count > 0);
}

export function categoryHref(name: string) {
  return `/products?category=${encodeURIComponent(name)}`;
}
