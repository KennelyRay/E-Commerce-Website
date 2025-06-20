'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { 
  Filter, Search, Grid3X3, List, SortAsc, SortDesc, Package, 
  Sparkles, Target, Crown, Flame, Zap, Star, ArrowRight, 
  TrendingUp, Eye, Heart, ChevronDown, Activity, BarChart3,
  Settings, Cpu, Monitor, HardDrive, MousePointer, Gamepad2,
  ShoppingCart, Award, Shield
} from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function ProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [products] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Update category when URL changes
  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const categories = [
    { name: 'All', icon: Package, count: products.length, color: 'from-purple-500 to-pink-600' },
    { name: 'Graphics Cards', icon: Monitor, count: products.filter(p => p.category === 'Graphics Cards').length, color: 'from-green-500 to-emerald-600' },
    { name: 'Processors', icon: Cpu, count: products.filter(p => p.category === 'Processors').length, color: 'from-blue-500 to-indigo-600' },
    { name: 'Motherboards', icon: Settings, count: products.filter(p => p.category === 'Motherboards').length, color: 'from-purple-500 to-pink-600' },
    { name: 'Memory (RAM)', icon: Zap, count: products.filter(p => p.category === 'Memory (RAM)').length, color: 'from-red-500 to-rose-600' },
    { name: 'Storage', icon: HardDrive, count: products.filter(p => p.category === 'Storage').length, color: 'from-yellow-500 to-orange-600' },
    { name: 'Power Supplies', icon: Zap, count: products.filter(p => p.category === 'Power Supplies').length, color: 'from-teal-500 to-cyan-600' },
    { name: 'Cases', icon: Package, count: products.filter(p => p.category === 'Cases').length, color: 'from-indigo-500 to-purple-600' },
    { name: 'Cooling', icon: Activity, count: products.filter(p => p.category === 'Cooling').length, color: 'from-cyan-500 to-blue-600' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured First', icon: Crown },
    { value: 'name', label: 'Name A-Z', icon: SortAsc },
    { value: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
    { value: 'price-high', label: 'Price: High to Low', icon: SortDesc },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'newest', label: 'Newest First', icon: Sparkles },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, minRating]);

  const featuredProducts = products.filter(p => p.featured);
  const topRatedProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-600/30 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-16 h-16 border-4 border-pink-500/30 rounded-full"></div>
            <div className="absolute inset-2 w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-white text-xl font-medium">Loading Arsenal...</p>
          <p className="text-purple-300 text-sm mt-2">Preparing legendary components</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              Elite Arsenal
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6">
              <span className="block">Legendary</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Components
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Discover the ultimate collection of premium PC hardware. 
              <span className="text-yellow-400 font-semibold"> Every component </span>
              handpicked for legendary performance and 
              <span className="text-pink-400 font-semibold"> unmatched quality</span>.
            </p>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { number: `${products.length}+`, label: "Premium Parts", icon: Award },
                { number: `${featuredProducts.length}`, label: "Featured Legends", icon: Crown },
                { number: "4.9★", label: "Average Rating", icon: Star }
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

      {/* Enhanced Search and Filters Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Search Bar */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Main Search */}
              <div className="relative flex-1">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search legendary components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Filter className="w-5 h-5" />
                <span>Advanced Filters</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isFiltersExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {isFiltersExpanded && (
              <div className="mt-8 pt-8 border-t border-gray-200 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Price Range</label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₱{priceRange[0].toLocaleString()}</span>
                        <span>₱{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Minimum Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                          className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-300 ${
                            rating <= minRating
                              ? 'bg-yellow-400 border-yellow-400 text-white'
                              : 'border-gray-200 text-gray-400 hover:border-yellow-400'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${rating <= minRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-white"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value} className="text-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Quick Actions</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          setSortBy('featured');
                          setPriceRange([0, 200000]);
                          setMinRating(0);
                        }}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                      >
                        Clear All Filters
                      </button>
                      <button
                        onClick={() => setSelectedCategory('Graphics Cards')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 rounded-xl hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 text-sm font-medium"
                      >
                        Show GPUs Only
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Category Tabs */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900">Browse by Category</h2>
              <div className="text-gray-600">
                <span className="font-bold text-purple-600">{filteredAndSortedProducts.length}</span> legendary components found
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                        isActive ? 'shadow-lg' : ''
                      }`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${
                        isActive ? 'text-purple-700' : 'text-gray-900 group-hover:text-purple-600'
                      }`}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">{category.count} items</p>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAndSortedProducts.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">
                    {selectedCategory === 'All' ? 'All Components' : selectedCategory}
                  </h2>
                  <p className="text-gray-600">
                    Showing <span className="font-bold text-purple-600">{filteredAndSortedProducts.length}</span> legendary components
                  </p>
                </div>
                
                {/* Featured Products Quick Access */}
                {featuredProducts.length > 0 && selectedCategory === 'All' && (
                  <div className="hidden lg:flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Featured Collection</div>
                      <div className="font-bold text-gray-900">{featuredProducts.length} Premium Items</div>
                    </div>
                    <button
                      onClick={() => setSortBy('featured')}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                    >
                      <Crown className="w-5 h-5" />
                      <span>View Featured</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredAndSortedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="group transform hover:scale-105 transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <ProductCard product={product} />
                      {product.featured && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center z-10">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredAndSortedProducts.length > 12 && (
                <div className="text-center mt-16">
                  <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Eye className="w-6 h-6 mr-2" />
                    Show More Legends
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Enhanced No Results State */
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-gray-900 mb-4">No Legends Found</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your search didn't match any components in our arsenal. Try adjusting your filters or explore our featured collection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortBy('featured');
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                  }}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <Shield className="w-6 h-6" />
                  <span>Reset Filters</span>
                </button>
                
                <button
                  onClick={() => setSortBy('featured')}
                  className="flex items-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                >
                  <Crown className="w-6 h-6" />
                  <span>View Featured</span>
                </button>
              </div>
            </div>
          )}
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
            <Flame className="w-5 h-5 mr-2" />
            Ready to Build?
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Create Your
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Use our PC Builder to craft the perfect system or get expert guidance from our masters
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => router.push('/pc-builder')}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                PC Builder Tool
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            <button
              onClick={() => router.push('/contact')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                <ShoppingCart className="w-6 h-6 mr-3" />
                Expert Consultation
              </span>
            </button>
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
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
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
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
} 