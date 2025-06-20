import React from 'react';
import productsData from '@/data/products.json';
import ProductPageClient from './ProductPageClient';
import { Product } from '@/types';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Generate static params for all products in JSON file
export async function generateStaticParams() {
  const products = productsData.products as unknown as Product[];
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = (productsData.products as unknown as Product[]).find(p => p.id === params.id);
  
  return <ProductPageClient product={product} />;
} 