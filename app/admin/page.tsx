'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Users, Package, DollarSign, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Product, User } from '@/types';
import productsData from '@/data/products.json';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
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
    // Load users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('vertixhub_users') || '[]');
    setUsers(savedUsers);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  const categories = [
    'Graphics Cards',
    'Processors',
    'Motherboards',
    'Memory (RAM)',
    'Storage',
    'Power Supplies',
    'Cases',
    'Cooling'
  ];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      image: newProduct.image || 'https://images.unsplash.com/photo-1591238831416-e7e36a3c9a4c?w=500&h=500&fit=crop',
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
      reviews: parseInt(newProduct.reviews),
      featured: newProduct.featured,
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'Graphics Cards',
      stock: '',
      rating: '4.5',
      reviews: '0',
      featured: false,
      tags: ''
    });
    setIsAddingProduct(false);
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      featured: product.featured || false,
      tags: product.tags.join(', ')
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      image: newProduct.image,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
      reviews: parseInt(newProduct.reviews),
      featured: newProduct.featured,
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'Graphics Cards',
      stock: '',
      rating: '4.5',
      reviews: '0',
      featured: false,
      tags: ''
    });
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage your VertixHub store</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'users', name: 'Users', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Estimated Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Package className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Low Stock Alert</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-red-600">Only {product.stock} left</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Products Management</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {(isAddingProduct || editingProduct) && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Original Price (Optional)"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
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
                        category: 'Graphics Cards',
                        stock: '',
                        rating: '4.5',
                        reviews: '0',
                        featured: false,
                        tags: ''
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded object-cover" src={product.image} alt={product.name} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.featured && (
                                <div className="text-xs text-yellow-600">Featured</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              {user.isAdmin && (
                                <div className="text-xs text-blue-600">Admin</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!user.isAdmin && (
                            <button
                              onClick={() => handleToggleBan(user.id)}
                              className={`flex items-center ${
                                user.isBanned ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'
                              }`}
                            >
                              {user.isBanned ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              <span className="ml-1">{user.isBanned ? 'Unban' : 'Ban'}</span>
                            </button>
                          )}
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