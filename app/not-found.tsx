'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
                        <Link
                href="/home"
                className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </Link>
          
          <Link
            href="/products"
            className="w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Browse Products</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full text-gray-600 hover:text-gray-900 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
} 