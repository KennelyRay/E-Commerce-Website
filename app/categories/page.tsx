'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, HardDrive, Zap, Monitor, CircuitBoard, Fan, Box, Gamepad2 } from 'lucide-react';

const categories = [
  {
    id: 'graphics-cards',
    name: 'Graphics Cards',
    description: 'High-performance GPUs for gaming, rendering, and AI workloads',
    icon: Monitor,
    image: 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
    count: 25,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'processors',
    name: 'Processors',
    description: 'Intel and AMD CPUs for every performance requirement',
    icon: Cpu,
    image: 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
    count: 18,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'memory-ram',
    name: 'Memory (RAM)',
    description: 'High-speed DDR4 and DDR5 memory modules with RGB lighting',
    icon: Zap,
    image: 'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
    count: 15,
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'motherboards',
    name: 'Motherboards',
    description: 'Premium motherboards with latest chipsets and features',
    icon: CircuitBoard,
    image: 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
    count: 22,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'NVMe SSDs, SATA drives, and high-capacity storage solutions',
    icon: HardDrive,
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
    count: 30,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'power-supplies',
    name: 'Power Supplies',
    description: 'Efficient and reliable PSUs with 80+ certifications',
    icon: Zap,
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
    count: 12,
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'peripherals',
    name: 'Peripherals',
    description: 'Gaming keyboards, mice & accessories for ultimate performance',
    icon: Gamepad2,
    image: 'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
    count: 35,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    description: 'High-refresh gaming monitors with vibrant displays',
    icon: Monitor,
    image: 'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
    count: 28,
    color: 'from-indigo-500 to-purple-600'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            PC Hardware Categories
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in-delay">
            Explore our comprehensive selection of premium PC components
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                prefetch={false}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                        {category.count} items
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-primary-600 font-medium text-sm flex items-center">
                        View Products
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="text-center animate-fade-in-delay">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Brands</div>
            </div>
            <div className="text-center animate-fade-in-delay-2">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="text-center animate-fade-in-delay-3">
              <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Authentic</div>
            </div>
          </div>
        </div>
      </div>

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
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
} 