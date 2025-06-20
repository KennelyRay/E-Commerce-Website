'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, Edit, Trash2, Users, Package, DollarSign, TrendingUp, Eye, EyeOff, 
  BarChart3, ShoppingCart, AlertTriangle, Search, Filter, Download,
  Calendar, ArrowUp, ArrowDown, Star, Zap, Shield, Activity
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading admin panel...</p>
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
  const totalOrders = 847; // Mock data
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;

  // Filter products for display
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const StatCard = ({ title, value, change, icon: Icon, color, bgColor }: any) => (
    <div className={`${bgColor} border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">VertixHub Admin</h1>
              <p className="text-white/70 mt-1">Manage your premium PC hardware store</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-white/70" />
                <span className="text-white/90 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-primary rounded-lg px-4 py-2">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'users', name: 'Users', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                change={12.5}
                icon={DollarSign}
                color="bg-green-500/20"
                bgColor="bg-gradient-to-br from-green-500/20 to-emerald-600/20"
              />
              <StatCard
                title="Total Orders"
                value={totalOrders.toLocaleString()}
                change={8.2}
                icon={ShoppingCart}
                color="bg-blue-500/20"
                bgColor="bg-gradient-to-br from-blue-500/20 to-cyan-600/20"
              />
              <StatCard
                title="Products"
                value={products.length}
                change={-2.4}
                icon={Package}
                color="bg-purple-500/20"
                bgColor="bg-gradient-to-br from-purple-500/20 to-pink-600/20"
              />
              <StatCard
                title="Active Users"
                value={users.filter(u => !u.isBanned).length}
                change={15.8}
                icon={Users}
                color="bg-orange-500/20"
                bgColor="bg-gradient-to-br from-orange-500/20 to-red-600/20"
              />
            </div>

            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Low Stock Alert */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
                    Low Stock Alert
                  </h3>
                  <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                    {lowStockProducts.length} items
                  </span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{product.name}</p>
                          <p className="text-white/60 text-xs">{product.category}</p>
                        </div>
                      </div>
                      <span className="text-red-300 font-bold">{product.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Activity className="w-6 h-6 text-purple-400 mr-2" />
                  Quick Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Featured Products</span>
                    <span className="text-white font-semibold">
                      {products.filter(p => p.featured).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Categories</span>
                    <span className="text-white font-semibold">{categories.length - 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Banned Users</span>
                    <span className="text-red-300 font-semibold">
                      {users.filter(u => u.isBanned).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm w-80"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </button>
                <div className="text-white/60 text-sm bg-white/5 px-4 py-3 rounded-xl">
                  Static Data (Read Only)
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium z-10">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-gradient-primary text-white px-2 py-1 rounded-lg text-xs font-medium z-10">
                        Featured
                      </div>
                    )}
                    {product.stock < 10 && (
                      <div className="absolute top-2 left-2 bg-orange-500/90 text-white px-2 py-1 rounded-lg text-xs font-medium z-10" style={{ top: product.originalPrice ? '2.5rem' : '0.5rem' }}>
                        Low Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-white/60 text-xs">{product.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-lg">₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        {product.originalPrice && (
                          <span className="text-white/50 text-sm line-through ml-2">
                            ₱{product.originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white/80 text-sm">{product.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Stock: {product.stock}</span>
                      <span className="text-white/70 text-sm">{product.reviews} reviews</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="bg-white/5 text-white/60 text-xs px-3 py-2 rounded-lg text-center">
                        Static Product Data
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-white/70 mt-1">Manage registered users and their permissions</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm">
                  {users.filter(u => !u.isBanned).length} Active
                </span>
                <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm">
                  {users.filter(u => u.isBanned).length} Banned
                </span>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">User</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">Joined</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData, index) => (
                      <tr key={userData.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {userData.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{userData.name}</p>
                              <p className="text-white/60 text-sm">@{userData.username}</p>
                              <p className="text-white/60 text-xs">
                                {userData.isAdmin ? 'Administrator' : 'Customer'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-white/80">{userData.email}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userData.isBanned 
                              ? 'bg-red-500/20 text-red-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {userData.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-white/80">
                            {new Date(userData.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleBan(userData.id)}
                            disabled={userData.isAdmin}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                              userData.isAdmin
                                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                : userData.isBanned
                                  ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                  : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {userData.isBanned ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            <span>{userData.isBanned ? 'Unban' : 'Ban'}</span>
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
    </div>
  );
} 