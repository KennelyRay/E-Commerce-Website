'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          {product.originalPrice && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
          {product.stock < 10 && (
            <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-2 py-1 rounded text-sm font-medium">
              Low Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₱{product.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}; 