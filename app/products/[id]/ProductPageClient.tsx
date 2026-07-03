'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, Minus, Plus, RefreshCw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getCatalogProductById, getCatalogProducts } from '@/lib/shop';
import { Product } from '@/types';

interface ProductPageClientProps {
  product: Product | undefined;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = () => {
      setCatalogProducts(getCatalogProducts());
    };

    loadProducts();
    window.addEventListener('vertixhub:storefront-updated', loadProducts);

    return () => {
      window.removeEventListener('vertixhub:storefront-updated', loadProducts);
    };
  }, []);

  const activeProduct = useMemo(
    () => (product ? getCatalogProductById(product.id) ?? product : undefined),
    [product, catalogProducts],
  );

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    setQuantity((currentQuantity) => Math.min(Math.max(1, currentQuantity), Math.max(activeProduct.stock, 1)));
  }, [activeProduct]);

  if (!activeProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <p className="text-gray-600 mb-8">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/products"
              prefetch={false}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity);
  };

  const relatedProducts = catalogProducts
    .filter((entry) => entry.category === activeProduct.category && entry.id !== activeProduct.id)
    .slice(0, 4);
  const specifications = activeProduct.specifications || {};
  const allImages = activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images : [activeProduct.image];
  const currentImage = allImages[selectedImageIndex] || activeProduct.image;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/products"
          prefetch={false}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative mb-4">
                <img src={currentImage} alt={activeProduct.name} className="w-full h-96 object-cover rounded-lg" />
                {activeProduct.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)}% OFF
                  </div>
                )}
                {activeProduct.stock < 10 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    Only {activeProduct.stock} left
                  </div>
                )}

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1)
                      }
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </>
                )}

                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${activeProduct.name} view ${index + 1}`} className="w-full h-20 object-cover" />
                      {index === selectedImageIndex && <div className="absolute inset-0 bg-primary-500/20"></div>}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>Expert Support</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                  {activeProduct.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{activeProduct.name}</h1>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">{renderStars(activeProduct.rating)}</div>
                <span className="text-gray-600">({activeProduct.reviews} reviews)</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-medium">
                  {activeProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₱{activeProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
                {activeProduct.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₱{activeProduct.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">{activeProduct.description}</p>

              {Object.keys(specifications).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(specifications)
                      .slice(0, 4)
                      .map(([key, value]) =>
                        value ? (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium text-gray-900">{value}</span>
                          </div>
                        ) : null,
                      )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-8">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-gray-100 rounded">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(activeProduct.stock || 1, quantity + 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={activeProduct.stock === 0}
                className="w-full bg-gradient-primary text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{activeProduct.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
              </button>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.tags.map((tag, index) => (
                    <span key={index} className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(specifications).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'specifications', name: 'Specifications' },
                  { id: 'reviews', name: 'Reviews' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Overview</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{activeProduct.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What&apos;s Included</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {activeProduct.name}</li>
                        <li>• Installation Guide</li>
                        <li>• Warranty Documentation</li>
                        <li>• Customer Support Access</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Compatibility</h4>
                      <p className="text-gray-600">
                        Compatible with modern systems. Check specifications for detailed requirements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(specifications).map(([key, value]) =>
                      value ? (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                          <span className="font-medium text-gray-900">{key}:</span>
                          <span className="text-gray-600 text-right">{value}</span>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="flex items-center space-x-1">{renderStars(activeProduct.rating)}</div>
                    <span className="text-2xl font-bold text-gray-900">{activeProduct.rating}</span>
                    <span className="text-gray-600">({activeProduct.reviews} reviews)</span>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">{renderStars(5)}</div>
                        <span className="font-medium text-gray-900">Excellent Product!</span>
                      </div>
                      <p className="text-gray-600">
                        Great performance and build quality. Exactly what I needed for my gaming setup.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- Verified Buyer</p>
                    </div>

                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">{renderStars(4)}</div>
                        <span className="font-medium text-gray-900">Good Value</span>
                      </div>
                      <p className="text-gray-600">
                        Solid performance for the price. Installation was straightforward.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- Verified Buyer</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  prefetch={false}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₱{relatedProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₱{relatedProduct.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
