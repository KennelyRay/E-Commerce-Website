'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, Edit, Trash2, Users, Package, DollarSign, TrendingUp, Eye, EyeOff, 
  BarChart3, ShoppingCart, AlertTriangle, Search, Filter, Download,
  Calendar, ArrowUp, ArrowDown, Star, Zap, Shield, Activity, Crown,
  Sparkles, Heart, Award, Target, Rocket, CheckCircle, TrendingDown,
  Database, Settings, Bell, ChevronDown, ArrowRight, Monitor, Cpu
} from 'lucide-react';
import { Product, User } from '@/types';
import productsData from '@/data/products.json';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('vertixhub_users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Failed to parse users from localStorage:', error);
        setUsers([]);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        {/* Loading Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-purple-500/20 rounded-full text-purple-300 text-sm font-bold mb-4">
            <Crown className="w-5 h-5 mr-2" />
            Admin Access
          </div>
          <p className="text-white/80 text-xl font-medium">Loading Legendary Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  const categories = [
    'All',
    'Graphics Cards',
    'Processors',
    'Motherboards',
    'Memory (RAM)',
    'Storage',
    'Power Supplies',
    'Cases',
    'Cooling'
  ];

  const handleToggleBan = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: !u.isBanned } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('vertixhub_users', JSON.stringify(updatedUsers));
    
    const targetUser = users.find(u => u.id === userId);
    toast.success(`User ${targetUser?.isBanned ? 'unbanned' : 'banned'} successfully!`);
  };

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * (100 - product.stock)), 0);
  const lowStockProducts = products.filter(p => p.stock < 10);
  const totalOrders = 847;
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  // Filter products for display
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const StatCard = ({ title, value, change, icon: Icon, color, bgColor, description }: any) => (
    <div className={`${bgColor} border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-500 shadow-2xl backdrop-blur-sm group cursor-pointer`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        {change && (
          <div className="flex items-center">
            {change > 0 ? (
              <ArrowUp className="w-5 h-5 text-green-400 mr-1" />
            ) : (
              <ArrowDown className="w-5 h-5 text-red-400 mr-1" />
            )}
            <span className={`text-sm font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-black text-white mb-2">{value}</p>
        {description && (
          <p className="text-white/40 text-xs">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
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

      {/* Enhanced Header */}
      <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl font-black text-white">VertixHub Admin</h1>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Legendary Control
                  </div>
                </div>
                <p className="text-white/70 text-lg">Manage your premium PC hardware empire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20">
                <Calendar className="w-6 h-6 text-white/70" />
                <div>
                  <div className="text-white/90 text-sm font-bold">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div className="text-white/60 text-xs">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-6 py-4 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
                <div>
                  <div className="text-white font-bold text-sm">Admin Access</div>
                  <div className="text-white/80 text-xs">Full Control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Navigation Tabs */}
        <div className="mb-12">
          <div className="flex space-x-2 bg-white/10 p-2 rounded-3xl backdrop-blur-sm border border-white/20">
            {[
              { id: 'dashboard', name: 'Command Center', icon: BarChart3, desc: 'Analytics & Overview' },
              { id: 'products', name: 'Inventory Control', icon: Package, desc: 'Manage Products' },
              { id: 'users', name: 'User Management', icon: Users, desc: 'Control Access' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 px-8 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'}`}>
                  <tab.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-lg">{tab.name}</div>
                  <div className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-white/50'}`}>
                    {tab.desc}
                  </div>
                </div>
                {activeTab === tab.id && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-bold mb-6">
                <Target className="w-5 h-5 mr-2" />
                Command Center
              </div>
              <h2 className="text-5xl font-black text-white mb-4">Welcome Back, Legend</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Monitor your PC hardware empire with legendary precision and control
              </p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                title="Total Revenue"
                value={`₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`}
                change={12.5}
                icon={DollarSign}
                color="bg-green-500/20"
                bgColor="bg-gradient-to-br from-green-500/10 to-emerald-600/10"
                description="This month's earnings"
              />
              <StatCard
                title="Total Orders"
                value={totalOrders.toLocaleString()}
                change={8.2}
                icon={ShoppingCart}
                color="bg-blue-500/20"
                bgColor="bg-gradient-to-br from-blue-500/10 to-cyan-600/10"
                description="Completed transactions"
              />
              <StatCard
                title="Products in Stock"
                value={products.length}
                change={-2.4}
                icon={Package}
                color="bg-purple-500/20"
                bgColor="bg-gradient-to-br from-purple-500/10 to-pink-600/10"
                description="Active inventory items"
              />
              <StatCard
                title="Customer Rating"
                value={`${avgRating.toFixed(1)} ⭐`}
                change={5.1}
                icon={Star}
                color="bg-yellow-500/20"
                bgColor="bg-gradient-to-br from-yellow-500/10 to-orange-600/10"
                description="Average product rating"
              />
            </div>

            {/* Enhanced Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Low Stock Alert */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-red-500/20 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Low Stock Alert</h3>
                    <p className="text-red-300">Products running low on inventory</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div>
                        <p className="text-white font-bold">{product.name}</p>
                        <p className="text-white/60 text-sm">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-black">{product.stock} left</p>
                        <p className="text-white/40 text-xs">Critical level</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-2xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                    <Package className="w-5 h-5 mr-2" />
                    Restock Items
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-2xl">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Recent Activity</h3>
                    <p className="text-blue-300">Latest system events</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'New order placed', detail: 'RTX 4090 Gaming X Trio', time: '5 minutes ago', icon: ShoppingCart },
                    { action: 'User registered', detail: 'Gaming enthusiast joined', time: '12 minutes ago', icon: Users },
                    { action: 'Product updated', detail: 'Intel i9-13900K pricing', time: '1 hour ago', icon: Package },
                    { action: 'Review submitted', detail: '5-star rating received', time: '2 hours ago', icon: Star }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <activity.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.detail}</p>
                      </div>
                      <p className="text-white/40 text-xs">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-purple-500/20 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Performance Overview</h3>
                    <p className="text-purple-300">Your store's legendary metrics</p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors duration-300 px-6 py-3 rounded-2xl text-white font-bold">
                  <Download className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Sales Growth', value: '+23.5%', desc: 'vs last month', color: 'text-green-400', icon: TrendingUp },
                  { title: 'Customer Retention', value: '94.2%', desc: 'repeat customers', color: 'text-blue-400', icon: Heart },
                  { title: 'Avg Order Value', value: '₱15,847', desc: 'per transaction', color: 'text-yellow-400', icon: DollarSign }
                ].map((metric, index) => (
                  <div key={index} className="text-center p-6 bg-white/5 rounded-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    </div>
                    <h4 className="text-white font-bold mb-2">{metric.title}</h4>
                    <p className={`text-3xl font-black mb-1 ${metric.color}`}>{metric.value}</p>
                    <p className="text-white/60 text-sm">{metric.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-bold mb-6">
                <Package className="w-5 h-5 mr-2" />
                Inventory Control
              </div>
              <h2 className="text-5xl font-black text-white mb-4">Product Management</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Manage your legendary inventory with precision and control
              </p>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search legendary products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-900 text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Enhanced Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.slice(0, 12).map((product) => (
                <div key={product.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:scale-105 transition-all duration-500 shadow-2xl group">
                  <div className="relative mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ {product.rating}
                    </div>
                    {product.stock < 10 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Low Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white font-black text-lg mb-2 leading-tight">{product.name}</h3>
                    <p className="text-white/60 text-sm mb-3">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-white">₱{product.price.toLocaleString('en-PH')}</p>
                      <p className="text-white/60 text-sm">{product.stock} in stock</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                      <Edit className="w-5 h-5 mr-2" />
                      Edit
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Product Button */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/25 group">
                <Plus className="w-6 h-6" />
                <span>Add New Legendary Product</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full text-green-300 text-sm font-bold mb-6">
                <Users className="w-5 h-5 mr-2" />
                User Management
              </div>
              <h2 className="text-5xl font-black text-white mb-4">Legend Community</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Manage your community of PC building legends
              </p>
            </div>

            {/* Users Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{users.length}</h3>
                <p className="text-blue-300 font-bold">Total Users</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{users.filter(u => !u.isBanned).length}</h3>
                <p className="text-green-300 font-bold">Active Users</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{users.filter(u => u.isBanned).length}</h3>
                <p className="text-red-300 font-bold">Banned Users</p>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-white/20">
                <h3 className="text-2xl font-black text-white">User Directory</h3>
                <p className="text-white/60">Manage your legendary community members</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-6 text-white font-bold">User</th>
                      <th className="text-left p-6 text-white font-bold">Username</th>
                      <th className="text-left p-6 text-white font-bold">Email</th>
                      <th className="text-left p-6 text-white font-bold">Status</th>
                      <th className="text-left p-6 text-white font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-300">
                        <td className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{user.name?.charAt(0) || user.username.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-white font-bold">{user.name || 'N/A'}</p>
                              <p className="text-white/60 text-sm">PC Enthusiast</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-white font-bold">{user.username}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-white">{user.email || 'N/A'}</p>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            user.isBanned 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => handleToggleBan(user.id)}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                              user.isBanned
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                : 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                            }`}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'} User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
} 