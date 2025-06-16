'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { Clock, CheckCircle, HeadphonesIcon, Truck, Shield, Award, Zap, Star } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your PC paradise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const products: Product[] = productsData.products;
  const featuredProducts = products.filter(product => product.featured);
  const latestProducts = products.slice(0, 4);

  const features = [
    {
      icon: Truck,
      title: 'Free Express Shipping',
      description: 'Free shipping on orders over $100. Get your components delivered in 1-2 days.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee. Return any component within 30 days.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Expert Support',
      description: 'Get help from PC building experts anytime with our dedicated support team.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Warranty Protection',
      description: 'Extended warranty coverage and protection plans for all components.',
      color: 'from-red-500 to-rose-500'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Gaming Enthusiast',
      content: 'VertixHub helped me build my dream gaming rig. The RTX 4090 I got from them runs everything at max settings!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      content: 'Amazing service and authentic products. My workstation build handles 4K video editing like a breeze.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4e2?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Esports Pro',
      content: 'Professional grade components at competitive prices. The support team really knows their stuff!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium PC components from top brands, carefully curated for performance and reliability
            </p>
          </div>
          <div className="animate-slide-up">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600">Handpicked components for the ultimate PC experience</p>
            </div>
            <Link 
              href="/products" 
              className="group bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center"
            >
              View All Products
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose VertixHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than just a hardware store - we're your trusted PC building partner
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`bg-gradient-to-r ${feature.color} rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Arrivals
            </h2>
            <p className="text-xl text-gray-600">
              Get your hands on the newest PC components and cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of satisfied customers building their dream PCs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm opacity-80">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Build Your Dream PC?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Join thousands of gamers, creators, and professionals who trust VertixHub for their PC builds
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/products"
                className="group bg-gradient-primary px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center"
              >
                Start Building
                <Zap className="w-6 h-6 ml-2 group-hover:animate-pulse" />
              </Link>
              <Link
                href="/contact"
                className="group border-2 border-white/30 backdrop-blur-sm bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
              >
                Get Expert Help
                <HeadphonesIcon className="w-6 h-6 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
} 