'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, HardDrive, Zap, Monitor, CircuitBoard, Fan, Box, Gamepad2,
  Crown, Sparkles, Target, Award, Shield, Activity, TrendingUp,
  ArrowRight, Star, ChevronDown, Eye, Flame, Rocket, Settings,
  BarChart3, Search, Filter, MousePointer, Headphones, Package
} from 'lucide-react';

const categories = [
  {
    id: 'graphics-cards',
    name: 'Graphics Cards',
    description: 'Legendary GPUs for gaming, rendering, and AI workloads that push the boundaries of visual excellence',
    icon: Monitor,
    image: 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
    count: 25,
    color: 'from-green-500 to-emerald-600',
    premium: true,
    performance: 'Ultra High',
    priceRange: '₱15,000 - ₱180,000'
  },
  {
    id: 'processors',
    name: 'Processors',
    description: 'Intel and AMD CPUs engineered for every performance requirement and legendary computing power',
    icon: Cpu,
    image: 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
    count: 18,
    color: 'from-blue-500 to-indigo-600',
    premium: true,
    performance: 'Extreme',
    priceRange: '₱8,000 - ₱85,000'
  },
  {
    id: 'memory-ram',
    name: 'Memory (RAM)',
    description: 'High-speed DDR4 and DDR5 memory modules with stunning RGB lighting for ultimate performance',
    icon: Zap,
    image: 'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
    count: 15,
    color: 'from-red-500 to-rose-600',
    premium: false,
    performance: 'High',
    priceRange: '₱3,500 - ₱25,000'
  },
  {
    id: 'motherboards',
    name: 'Motherboards',
    description: 'Premium motherboards with latest chipsets, advanced features, and legendary connectivity',
    icon: CircuitBoard,
    image: 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
    count: 22,
    color: 'from-purple-500 to-pink-600',
    premium: true,
    performance: 'Professional',
    priceRange: '₱6,000 - ₱45,000'
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Lightning-fast NVMe SSDs, SATA drives, and massive storage solutions for every need',
    icon: HardDrive,
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
    count: 30,
    color: 'from-yellow-500 to-orange-600',
    premium: false,
    performance: 'Ultra Fast',
    priceRange: '₱2,000 - ₱35,000'
  },
  {
    id: 'power-supplies',
    name: 'Power Supplies',
    description: 'Efficient and reliable PSUs with 80+ certifications for stable, legendary power delivery',
    icon: Zap,
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
    count: 12,
    color: 'from-teal-500 to-cyan-600',
    premium: false,
    performance: 'Reliable',
    priceRange: '₱4,500 - ₱18,000'
  },
  {
    id: 'peripherals',
    name: 'Peripherals',
    description: 'Gaming keyboards, precision mice & premium accessories for legendary gaming performance',
    icon: Gamepad2,
    image: 'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
    count: 35,
    color: 'from-orange-500 to-red-600',
    premium: true,
    performance: 'Elite Gaming',
    priceRange: '₱1,500 - ₱15,000'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    description: 'High-refresh gaming monitors with vibrant displays and legendary visual clarity',
    icon: Monitor,
    image: 'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
    count: 28,
    color: 'from-indigo-500 to-purple-600',
    premium: true,
    performance: 'Ultra Visual',
    priceRange: '₱8,000 - ₱120,000'
  },
  {
    id: 'cases',
    name: 'PC Cases',
    description: 'Premium cases with exceptional airflow, RGB lighting, and legendary build quality',
    icon: Box,
    image: 'https://c1.neweggimages.com/productimage/nb1280/11-146-315-01.jpg',
    count: 20,
    color: 'from-gray-500 to-slate-600',
    premium: false,
    performance: 'Stylish',
    priceRange: '₱3,000 - ₱25,000'
  },
  {
    id: 'cooling',
    name: 'Cooling Solutions',
    description: 'Advanced air and liquid cooling systems for optimal temperatures and silent operation',
    icon: Fan,
    image: 'https://c1.neweggimages.com/productimage/nb1280/35-181-150-01.jpg',
    count: 16,
    color: 'from-cyan-500 to-blue-600',
    premium: false,
    performance: 'Cool & Quiet',
    priceRange: '₱2,500 - ₱20,000'
  },
  {
    id: 'audio',
    name: 'Audio & Headsets',
    description: 'Premium gaming headsets and audio equipment for immersive legendary experiences',
    icon: Headphones,
    image: 'https://c1.neweggimages.com/productimage/nb1280/26-138-474-01.jpg',
    count: 24,
    color: 'from-pink-500 to-rose-600',
    premium: true,
    performance: 'Immersive',
    priceRange: '₱2,000 - ₱30,000'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Essential cables, adapters, and components to complete your legendary build',
    icon: Package,
    image: 'https://c1.neweggimages.com/productimage/nb1280/12-423-223-01.jpg',
    count: 42,
    color: 'from-emerald-500 to-teal-600',
    premium: false,
    performance: 'Essential',
    priceRange: '₱500 - ₱8,000'
  }
];

const featuredCategories = ['graphics-cards', 'processors', 'peripherals', 'monitors'];
const buildTypes = [
  { name: 'Gaming Beast', description: 'Ultimate gaming performance', icon: Flame, color: 'from-red-500 to-orange-500' },
  { name: 'Content Creator', description: 'Professional workstation', icon: Award, color: 'from-purple-500 to-pink-500' },
  { name: 'Budget Build', description: 'Best value performance', icon: Target, color: 'from-blue-500 to-indigo-500' },
  { name: 'Elite Workstation', description: 'Maximum productivity', icon: Crown, color: 'from-yellow-500 to-orange-500' }
];

export default function CategoriesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'premium' && category.premium) ||
                         (selectedFilter === 'essential' && !category.premium);
    return matchesSearch && matchesFilter;
  });

  const premiumCategories = categories.filter(cat => cat.premium);
  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
              <Package className="w-5 h-5 mr-2" />
              Component Arsenal
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6">
              <span className="block">Legendary</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Categories
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Explore our comprehensive collection of 
              <span className="text-yellow-400 font-semibold"> premium PC components</span>. 
              Every category crafted for 
              <span className="text-pink-400 font-semibold"> legendary performance</span>.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: `${categories.length}`, label: "Categories", icon: Package },
                { number: `${totalProducts}+`, label: "Products", icon: Award },
                { number: `${premiumCategories.length}`, label: "Premium Lines", icon: Crown },
                { number: "4.9★", label: "Avg Rating", icon: Star }
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filters */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search component categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-2">
                {[
                  { key: 'all', label: 'All Categories', icon: Package },
                  { key: 'premium', label: 'Premium', icon: Crown },
                  { key: 'essential', label: 'Essential', icon: Shield }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      selectedFilter === filter.key
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <filter.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-bold text-purple-600">{filteredCategories.length}</span> categories
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-bold text-purple-600">{totalProducts}+</span> total products available
              </div>
            </div>
          </div>

          {/* Build Type Shortcuts */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Build Your Legend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buildTypes.map((buildType, index) => {
                const IconComponent = buildType.icon;
                return (
                  <div key={buildType.name} className="group bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${buildType.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-black text-gray-900 mb-2 text-lg group-hover:text-purple-600 transition-colors duration-300">{buildType.name}</h3>
                      <p className="text-gray-600 text-sm">{buildType.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Categories */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black text-gray-900">Featured Categories</h2>
              <div className="flex items-center space-x-2 text-yellow-600">
                <Crown className="w-6 h-6" />
                <span className="font-bold">Premium Collection</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.filter(cat => featuredCategories.includes(cat.id)).map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    prefetch={false}
                    className="group relative"
                  >
                    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden border border-gray-100 hover:border-purple-200">
                      {/* Premium Badge */}
                      {category.premium && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </div>
                        </div>
                      )}

                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-500`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <IconComponent className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-600">{category.count}</div>
                            <div className="text-xs text-gray-500">products</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {category.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Performance:</span>
                            <span className="font-bold text-gray-900">{category.performance}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price Range:</span>
                            <span className="font-bold text-purple-600">{category.priceRange}</span>
                          </div>
                        </div>
                        
                        {/* Hover Action */}
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-600 font-black flex items-center">
                              Explore Collection
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-bold text-gray-600">4.9</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* All Categories */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black text-gray-900">All Categories</h2>
              <div className="text-gray-600">
                <span className="font-bold text-purple-600">{filteredCategories.length}</span> categories found
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    prefetch={false}
                    className="group"
                  >
                    <div 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-purple-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        {category.premium && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-bold">
                            {category.count}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {category.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-purple-600">{category.priceRange}</span>
                          <span className="text-sm text-gray-500">{category.performance}</span>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-purple-600 font-bold text-sm flex items-center">
                            View Products
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* No Results State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">No Categories Found</h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your search didn't match any categories. Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  View All Categories
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
            <Rocket className="w-5 h-5 mr-2" />
            Ready to Build?
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Create Your
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Use our PC Builder to craft the perfect system or browse our legendary collection
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/pc-builder"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                PC Builder Tool
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
            
            <Link
              href="/products"
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                <Eye className="w-6 h-6 mr-3" />
                Browse All Products
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-black text-purple-600 mb-2">{totalProducts}+</div>
              <div className="text-gray-600 font-medium">Products</div>
            </div>
            <div className="text-center animate-fade-in-delay">
              <div className="text-4xl font-black text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Brands</div>
            </div>
            <div className="text-center animate-fade-in-delay-2">
              <div className="text-4xl font-black text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
            <div className="text-center animate-fade-in-delay-3">
              <div className="text-4xl font-black text-purple-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Authentic</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 