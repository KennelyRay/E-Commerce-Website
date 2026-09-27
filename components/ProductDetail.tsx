'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  HeartHandshake,
  Minus,
  Plus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
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
  const discountPercentage = activeProduct.originalPrice
    ? Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)
    : 0;
  const topSpecs = Object.entries(specifications).filter(([, value]) => Boolean(value)).slice(0, 6);
  const savings = activeProduct.originalPrice ? activeProduct.originalPrice - activeProduct.price : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link
          href="/products"
          prefetch={false}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="mb-10 rounded-[2rem] bg-gradient-to-r from-slate-900 via-purple-900 to-fuchsia-900 text-white overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-10 p-8 lg:p-10">
            <div>
              <div className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/15 via-transparent to-pink-500/20 pointer-events-none"></div>
                <img src={currentImage} alt={activeProduct.name} className="w-full h-[380px] lg:h-[520px] object-cover" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {activeProduct.originalPrice && (
                    <div className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      {discountPercentage}% OFF
                    </div>
                  )}
                  {activeProduct.featured && (
                    <div className="rounded-full bg-yellow-400/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                      Featured Pick
                    </div>
                  )}
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                  {activeProduct.stock === 0
                    ? 'Out of stock'
                    : activeProduct.stock < 10
                      ? `Only ${activeProduct.stock} left`
                      : 'Ready to ship'}
                </div>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1)
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </>
                )}

                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-4 py-2 text-sm text-white backdrop-blur-md">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-white shadow-xl shadow-purple-500/20 scale-[1.02]'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img src={image} alt={`${activeProduct.name} view ${index + 1}`} className="w-full h-20 object-cover" />
                      {index === selectedImageIndex && <div className="absolute inset-0 bg-white/15"></div>}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-sm text-white/85">
                    <Shield className="w-5 h-5 text-emerald-300" />
                    <span>2-Year Warranty</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-sm text-white/85">
                    <Truck className="w-5 h-5 text-sky-300" />
                    <span>Free Shipping</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-sm text-white/85">
                    <RefreshCw className="w-5 h-5 text-violet-300" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-sm text-white/85">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85">
                  {activeProduct.category}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/75">
                  SKU #{activeProduct.id}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">{activeProduct.name}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center space-x-1">{renderStars(activeProduct.rating)}</div>
                <span className="text-white/80">({activeProduct.reviews} reviews)</span>
                <span className="text-white/30">|</span>
                <span className={`font-semibold ${activeProduct.stock > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {activeProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex flex-wrap items-end gap-4 mb-3">
                  <span className="text-4xl lg:text-5xl font-black text-white">
                    ₱{activeProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>
                  {activeProduct.originalPrice && (
                    <span className="text-xl text-white/55 line-through">
                      ₱{activeProduct.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-200">
                    <Sparkles className="w-4 h-4" />
                    Save ₱{savings.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">{activeProduct.description}</p>

              {topSpecs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {topSpecs.map(([key, value]) => (
                    <div key={key} className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/50 mb-2">{key}</p>
                      <p className="text-base font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-[1.75rem] bg-white p-6 text-gray-900 shadow-2xl">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">Rating</p>
                    <p className="text-2xl font-black">{activeProduct.rating}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">Reviews</p>
                    <p className="text-2xl font-black">{activeProduct.reviews}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">Stock</p>
                    <p className="text-2xl font-black">{activeProduct.stock}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity</span>
                  <span className="text-sm text-gray-500">Ships within 1-2 business days</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-3 mb-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-2xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(activeProduct.stock || 1, quantity + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={activeProduct.stock === 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white py-4 px-6 font-bold text-lg hover:opacity-95 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>{activeProduct.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                </button>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>Authentic hardware guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                    <HeartHandshake className="w-4 h-4 text-purple-600" />
                    <span>Expert build assistance available</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.tags.map((tag, index) => (
                      <span key={index} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          {Object.keys(specifications).length > 0 && (
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="border-b border-gray-100 px-6 lg:px-8">
                <nav className="flex flex-wrap gap-8">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'specifications', name: 'Specifications' },
                    { id: 'reviews', name: 'Reviews' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-5 border-b-2 font-semibold text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-600 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 lg:p-8">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Why This Product Stands Out</h3>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">{activeProduct.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-3xl bg-slate-50 p-6">
                        <h4 className="font-black text-gray-900 mb-3">What&apos;s Included</h4>
                        <ul className="space-y-3 text-gray-600">
                          <li>• {activeProduct.name}</li>
                          <li>• Installation guide</li>
                          <li>• Warranty documentation</li>
                          <li>• Customer support access</li>
                        </ul>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-6">
                        <h4 className="font-black text-gray-900 mb-3">Best For</h4>
                        <p className="text-gray-600 mb-4">
                          Ideal for enthusiasts who want premium performance, dependable reliability, and strong long-term value.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProduct.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Technical Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(specifications).map(([key, value]) =>
                        value ? (
                          <div key={key} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">{key}</p>
                            <p className="font-semibold text-gray-900">{value}</p>
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Customer Reviews</h3>
                    <div className="rounded-3xl bg-slate-50 p-6 mb-8">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-1">{renderStars(activeProduct.rating)}</div>
                        <span className="text-3xl font-black text-gray-900">{activeProduct.rating}</span>
                        <span className="text-gray-600">({activeProduct.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-1">{renderStars(5)}</div>
                          <span className="font-bold text-gray-900">Excellent Product!</span>
                        </div>
                        <p className="text-gray-600">
                          Great performance and build quality. Exactly what I needed for my gaming setup.
                        </p>
                        <p className="text-sm text-gray-500 mt-3">Verified Buyer</p>
                      </div>

                      <div className="rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-1">{renderStars(4)}</div>
                          <span className="font-bold text-gray-900">Good Value</span>
                        </div>
                        <p className="text-gray-600">
                          Solid performance for the price. Installation was straightforward.
                        </p>
                        <p className="text-sm text-gray-500 mt-3">Verified Buyer</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white p-6 lg:p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Purchase Confidence</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <Shield className="w-6 h-6 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Protected Warranty Coverage</p>
                    <p className="text-sm text-gray-600">Every order includes verified warranty support and after-sales guidance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <Truck className="w-6 h-6 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Fast Nationwide Delivery</p>
                    <p className="text-sm text-gray-600">Orders are processed quickly and packed securely for shipping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <RefreshCw className="w-6 h-6 text-violet-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Hassle-Free Returns</p>
                    <p className="text-sm text-gray-600">Return eligible items within 30 days if they do not fit your build.</p>
                  </div>
                </div>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 lg:p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Related Products</h2>
                  <Link href="/products" prefetch={false} className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/products/${relatedProduct.id}`}
                      prefetch={false}
                      className="group flex items-center gap-4 rounded-3xl border border-gray-100 p-4 hover:border-purple-200 hover:shadow-lg transition-all"
                    >
                      <img src={relatedProduct.image} alt={relatedProduct.name} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{relatedProduct.category}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="font-black text-gray-900">
                            ₱{relatedProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
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
      </div>
    </div>
  );
}
