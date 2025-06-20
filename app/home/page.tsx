'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { CategoryGrid } from '@/components/CategoryGrid';
import { 
  Clock, CheckCircle, HeadphonesIcon, Truck, Shield, Award, Zap, Star, 
  ArrowRight, Play, TrendingUp, Users, Package, Globe, Sparkles,
  Monitor, Cpu, HardDrive, MousePointer, Settings, ChevronDown, 
  Flame, Target, Rocket, Heart, Eye, Gift, Crown,
  Activity, BarChart3, Headphones, ShoppingCart, Quote
} from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

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
          <p className="text-white text-xl font-medium">Crafting your experience...</p>
          <p className="text-purple-300 text-sm mt-2">Welcome to the future of PC building</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const featuredProducts = products.filter(product => product.featured);
  const topRatedProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Left Content */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-full text-white text-sm font-medium">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Welcome back, <span className="text-yellow-400 ml-1">{user.name}</span>
                  <Sparkles className="w-4 h-4 ml-2 text-pink-400" />
                </div>
                
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight">
                  <span className="block">Build</span>
                  <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Legends
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Where champions craft their ultimate gaming rigs. Premium components, 
                  <span className="text-yellow-400 font-semibold"> expert guidance</span>, and 
                  <span className="text-pink-400 font-semibold"> legendary performance</span> await.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 mr-2" />
                    Explore Arsenal
                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
                
                <Link
                  href="/pc-builder"
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    <Settings className="w-6 h-6 mr-2" />
                    Forge Beast
                  </span>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                {[
                  { number: "50K+", label: "Legends Built", icon: Crown },
                  { number: "99.9%", label: "Victory Rate", icon: Target },
                  { number: "24/7", label: "War Support", icon: Shield }
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

            {/* Enhanced Right Visual */}
            <div className="relative animate-slide-in-right">
              {/* Container with proper spacing for floating elements */}
              <div className="relative px-16 py-12">
                {/* Main Dream Build Card - Ultra Enhanced */}
                <div className="relative z-50">
                  <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-purple-500/25 transition-shadow duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Ultimate Build</h3>
                            <p className="text-sm text-gray-600">Performance Beast</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-600">Live</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'RTX 4090 Ti Beast', price: '₱115,000', status: 'In Stock', color: 'green' },
                          { name: 'AMD Ryzen 9 7950X3D', price: '₱38,000', status: 'Hot Deal', color: 'orange' },
                          { name: 'ASUS ROG Maximus Z790', price: '₱25,500', status: 'Limited', color: 'red' },
                        ].map((item, index) => (
                          <div key={index} className="group relative overflow-hidden p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-sm group-hover:text-purple-700 transition-colors duration-300">{item.name}</div>
                                  <div className={`text-xs font-medium ${
                                    item.color === 'green' ? 'text-green-600' :
                                    item.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                                  }`}>{item.status}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-black text-gray-900">{item.price}</div>
                                <div className="text-xs text-gray-500">Best Price</div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl"></div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700">Total Power</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">Build Total</span>
                          <div className="text-right">
                            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₱178,500</span>
                            <div className="text-sm text-green-600 font-medium">Save ₱12,000</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Elements - Properly positioned */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/25 animate-float z-40">
                  <Flame className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 animate-float-delay z-40">
                  <Cpu className="w-10 h-10 text-white" />
                </div>

                <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse z-40">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
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

      {/* Enhanced Trust Indicators */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Legendary Guarantees</h2>
            <p className="text-xl text-gray-600">Built on trust, delivered with excellence</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: 'Lifetime Support', desc: 'Always protected', color: 'from-green-500 to-emerald-600' },
              { icon: Truck, label: 'Lightning Fast', desc: 'Free same-day delivery', color: 'from-blue-500 to-cyan-600' },
              { icon: HeadphonesIcon, label: 'Expert Masters', desc: '24/7 legendary support', color: 'from-purple-500 to-pink-600' },
              { icon: CheckCircle, label: 'Authentic Only', desc: '100% genuine guarantee', color: 'from-orange-500 to-red-600' },
            ].map((item, index) => (
              <div key={index} className="group text-center cursor-pointer">
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-lg group-hover:text-purple-600 transition-colors duration-300">{item.label}</h3>
                <p className="text-gray-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-6">
              <Package className="w-5 h-5 mr-2" />
              Arsenal Categories
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Weapons
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From legendary graphics cards to precision peripherals, every component is handpicked for ultimate domination.
            </p>
          </div>
          
          <CategoryGrid />
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-20">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-6">
                <Crown className="w-5 h-5 mr-2" />
                Champion's Choice
                <Star className="w-4 h-4 ml-2" />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">Featured Legends</h2>
              <p className="text-xl text-gray-300 max-w-2xl">Handpicked components that have proven themselves in the arena of high-performance computing</p>
            </div>
            
            <Link 
              href="/products" 
              className="hidden lg:flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-2xl font-bold hover:scale-105 transition-all duration-300 group"
            >
              <span>View Arsenal</span>
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className="group transform hover:scale-105 transition-all duration-500 hover:-translate-y-2">
                <div className="relative">
                  <ProductCard product={product} />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 lg:hidden">
            <Link 
              href="/products" 
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300"
            >
              <span>Explore Full Arsenal</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-bold mb-8">
                <Award className="w-5 h-5 mr-2" />
                The VertixHub Advantage
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8">
                Trusted by
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Champions
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                We don't just sell hardware – we forge legends. Every component, every build, every interaction is crafted to exceed expectations.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: Users,
                    title: 'Master Crafters',
                    desc: 'Our team includes world-class system architects and performance specialists who live and breathe high-end computing.',
                    color: 'from-blue-500 to-indigo-600'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Performance Obsessed',
                    desc: 'Every component undergoes rigorous testing and optimization to ensure peak performance under any condition.',
                    color: 'from-green-500 to-emerald-600'
                  },
                  {
                    icon: Globe,
                    title: 'Global Excellence',
                    desc: 'We maintain the highest international standards and certifications, delivering world-class quality.',
                    color: 'from-purple-500 to-pink-600'
                  }
                ].map((item, index) => (
                  <div key={index} className="group flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 mb-3 text-xl group-hover:text-purple-600 transition-colors duration-300">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop&crop=center"
                  alt="Professional PC Build"
                  className="w-full h-80 object-cover rounded-2xl shadow-xl"
                />
              </div>
              
              {/* Enhanced Floating Stats */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 z-20">
                <div className="text-4xl font-black text-gray-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-500 font-medium">Satisfaction Rate</div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="absolute -top-8 -right-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white z-20">
                <div className="text-4xl font-black mb-2">24/7</div>
                <div className="text-sm font-medium opacity-90">Expert Support</div>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 mr-1" />
                  <span className="text-xs">Live Now</span>
                </div>
              </div>

              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Top Rated Products */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-bold mb-6">
              <Star className="w-5 h-5 mr-2" />
              Community Favorites
              <Heart className="w-4 h-4 ml-2" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Hall of
              <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Fame
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              These legendary components have earned their place through countless victories and satisfied builders worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRatedProducts.map((product, index) => (
              <div key={product.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative transform hover:scale-105 transition-all duration-500">
                  <ProductCard product={product} />
                </div>
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
              <Rocket className="w-5 h-5 mr-2" />
              Your Legend Awaits
            </div>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
            Ready to Build
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Greatness?
            </span>
          </h2>
          
          <p className="text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join the elite ranks of builders who trust VertixHub to power their ambitions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/pc-builder"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Forge Your Legend
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
            
            <Link
              href="/contact"
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                <HeadphonesIcon className="w-6 h-6 mr-3" />
                Consult Masters
              </span>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: Users, label: "50K+ Legends" },
              { icon: Shield, label: "Lifetime Support" },
              { icon: Crown, label: "Elite Performance" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-sm font-medium text-gray-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite 2s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.3s both;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
} 