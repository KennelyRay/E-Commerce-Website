'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, Edit, Trash2, Users, Package, DollarSign, TrendingUp, Eye, EyeOff, 
  BarChart3, ShoppingCart, AlertTriangle, Search, Filter, Download,
  Calendar, ArrowUp, ArrowDown, Star, Zap, Shield, Activity, RefreshCw
} from 'lucide-react';
import { Product, User } from '@/types';
import productsData from '@/data/products.json';
import toast from 'react-hot-toast';
import { db, ensureDbInitialized } from '@/lib/database';
import { DatabaseAdmin } from '@/components/DatabaseAdmin';

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    images: [''], // Array for multiple images
    category: 'Graphics Cards',
    stock: '',
    rating: '4.5',
    reviews: '0',
    featured: false,
    tags: ''
  });

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await ensureDbInitialized();
        
        // Load users from database
        const dbUsers = await db.getAllUsers();
        setUsers(dbUsers);

        // Load products from database
        const dbProducts = await db.getAllProducts();
        setProducts(dbProducts);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data from database');
      }
    };

    loadData();
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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const validImages = newProduct.images.filter(img => img.trim() !== '');
      const mainImage = validImages[0] || newProduct.image || 'https://images.unsplash.com/photo-1591238831416-e7e36a3c9a4c?w=500&h=500&fit=crop';

      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        image: mainImage,
        images: validImages.length > 1 ? validImages : undefined,
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        rating: parseFloat(newProduct.rating),
        reviews: parseInt(newProduct.reviews),
        featured: newProduct.featured,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await db.insertProduct(product);
      const updatedProducts = await db.getAllProducts();
      setProducts(updatedProducts);
      
      setNewProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        images: [''],
        category: 'Graphics Cards',
        stock: '',
        rating: '4.5',
        reviews: '0',
        featured: false,
        tags: ''
      });
      setIsAddingProduct(false);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const imageArray = [...allImages];
    // Ensure we have at least one empty slot for adding new images
    if (imageArray[imageArray.length - 1] !== '') {
      imageArray.push('');
    }
    
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      images: imageArray,
      category: product.category,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      featured: product.featured || false,
      tags: product.tags.join(', ')
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const validImages = newProduct.images.filter(img => img.trim() !== '');
      const mainImage = validImages[0] || newProduct.image || editingProduct.image;

      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        image: mainImage,
        images: validImages.length > 1 ? validImages : undefined,
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        rating: parseFloat(newProduct.rating),
        reviews: parseInt(newProduct.reviews),
        featured: newProduct.featured,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await db.updateProduct(updatedProduct);
      const updatedProducts = await db.getAllProducts();
      setProducts(updatedProducts);
      
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        images: [''],
        category: 'Graphics Cards',
        stock: '',
        rating: '4.5',
        reviews: '0',
        featured: false,
        tags: ''
      });
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await db.deleteProduct(id);
        const updatedProducts = await db.getAllProducts();
        setProducts(updatedProducts);
        toast.success('Product deleted successfully!');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) return;

      const updatedUser = { ...targetUser, isBanned: !targetUser.isBanned };
      await db.updateUser(updatedUser);
      
      const updatedUsers = await db.getAllUsers();
      setUsers(updatedUsers);
      
      toast.success(`User ${targetUser.isBanned ? 'unbanned' : 'banned'} successfully!`);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    }
  };

  // Helper functions for managing multiple images
  const addImageField = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, '']
    });
  };

  const removeImageField = (index: number) => {
    const newImages = newProduct.images.filter((_, i) => i !== index);
    // Ensure we always have at least one empty field
    if (newImages.length === 0 || newImages[newImages.length - 1] !== '') {
      newImages.push('');
    }
    setNewProduct({
      ...newProduct,
      images: newImages
    });
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...newProduct.images];
    newImages[index] = value;
    
    // If the last field is filled and it's not empty, add a new empty field
    if (index === newImages.length - 1 && value.trim() !== '') {
      newImages.push('');
    }
    
    setNewProduct({
      ...newProduct,
      images: newImages
    });
  };

  const resetToDefaultProducts = async () => {
    if (confirm('Are you sure you want to reset all products to default? This will delete all your custom products.')) {
      try {
        await db.resetDatabase();
        const updatedProducts = await db.getAllProducts();
        const updatedUsers = await db.getAllUsers();
        setProducts(updatedProducts);
        setUsers(updatedUsers);
        toast.success('Database reset to default successfully!');
      } catch (error) {
        console.error('Failed to reset database:', error);
        toast.error('Failed to reset database');
      }
    }
  };

  const loadProductsFromAPI = async () => {
    if (confirm('This will load fresh products from external APIs. This may take a few moments. Continue?')) {
      try {
        toast.success('Loading products from APIs... Please wait.');
        await db.loadProductsFromAPI();
        const updatedProducts = await db.getAllProducts();
        setProducts(updatedProducts);
        toast.success('Products loaded from APIs successfully!');
      } catch (error) {
        console.error('Failed to load products from API:', error);
        toast.error('Failed to load products from APIs');
      }
    }
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
              { id: 'database', name: 'Database', icon: Shield },
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
                  <span>Export</span>
                </button>
                <button
                  onClick={loadProductsFromAPI}
                  className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-3 rounded-xl hover:bg-blue-500/30 transition-colors backdrop-blur-sm"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Load from API</span>
                </button>
                <button
                  onClick={resetToDefaultProducts}
                  className="flex items-center space-x-2 bg-red-500/20 text-red-300 px-4 py-3 rounded-xl hover:bg-red-500/30 transition-colors backdrop-blur-sm"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
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
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center justify-center w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center justify-center w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Database Management</h2>
              <p className="text-white/70 mb-8">Manage your SQLite database with backup, restore, and reset capabilities</p>
            </div>

            <DatabaseAdmin 
              onDataChange={async () => {
                try {
                  const updatedProducts = await db.getAllProducts();
                  const updatedUsers = await db.getAllUsers();
                  setProducts(updatedProducts);
                  setUsers(updatedUsers);
                } catch (error) {
                  console.error('Failed to refresh data:', error);
                }
              }}
            />
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category} className="bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Original Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white/80 text-sm font-medium">Product Images</label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {newProduct.images.map((imageUrl, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => updateImageField(index, e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder={index === 0 ? "https://example.com/main-image.jpg (Main Image)" : "https://example.com/additional-image.jpg"}
                        />
                      </div>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-12 h-12 object-cover rounded-lg border border-white/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      {newProduct.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-2">
                  First image will be used as the main product image. Add multiple images for product gallery.
                </p>
              </div>
              
              <div className="mt-6">
                <label className="block text-white/80 text-sm font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newProduct.tags}
                  onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="gaming, rgb, high-performance"
                />
              </div>
              
              <div className="mt-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-white/80">Featured Product</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: '',
                      originalPrice: '',
                      image: '',
                      images: [''],
                      category: 'Graphics Cards',
                      stock: '',
                      rating: '4.5',
                      reviews: '0',
                      featured: false,
                      tags: ''
                    });
                  }}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 