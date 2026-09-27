import productsData from '@/data/products.json';
import { LegacyProductRedirect } from './LegacyProductRedirect';

// Old /products/<id> links from before product pages moved to /product?id=<id>.
export function generateStaticParams() {
  return productsData.products.map((product) => ({ id: product.id }));
}

export default function LegacyProductPage({ params }: { params: { id: string } }) {
  return <LegacyProductRedirect id={params.id} />;
}
