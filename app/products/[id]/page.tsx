import React from 'react';
import productsData from '@/data/products.json';
import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Generate static params for all products
export async function generateStaticParams() {
  return productsData.products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData.products.find(p => p.id === params.id);
  
  return <ProductPageClient product={product} />;
} 