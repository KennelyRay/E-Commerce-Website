'use client';

import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-primary text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Welcome to
              <span className="block text-pink-300">VertixHub</span>
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Build the ultimate gaming PC with premium hardware components. Your trusted partner for high-performance computing.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="Shopping"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-primary-900 px-4 py-2 rounded-lg font-bold">
                Up to 50% OFF
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-primary-600 px-4 py-2 rounded-lg font-bold shadow-lg">
                Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 