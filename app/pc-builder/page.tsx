'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { db, ensureDbInitialized } from '@/lib/database';
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  Zap, 
  CircuitBoard, 
  Fan, 
  Box, 
  ShoppingCart,
  Plus,
  Check,
  AlertTriangle,
  Calculator,
  Gamepad2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PCBuild {
  cpu?: Product;
  motherboard?: Product;
  ram?: Product;
  gpu?: Product;
  storage?: Product;
  psu?: Product;
  case?: Product;
  cooling?: Product;
  peripherals?: Product;
  monitor?: Product;
}

const componentCategories = [
  { 
    key: 'cpu' as keyof PCBuild, 
    name: 'Processor (CPU)', 
    category: 'Processors', 
    icon: Cpu, 
    required: true,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    key: 'motherboard' as keyof PCBuild, 
    name: 'Motherboard', 
    category: 'Motherboards', 
    icon: CircuitBoard, 
    required: true,
    color: 'from-purple-500 to-pink-600'
  },
  { 
    key: 'ram' as keyof PCBuild, 
    name: 'Memory (RAM)', 
    category: 'Memory (RAM)', 
    icon: Zap, 
    required: true,
    color: 'from-red-500 to-rose-600'
  },
  { 
    key: 'gpu' as keyof PCBuild, 
    name: 'Graphics Card', 
    category: 'Graphics Cards', 
    icon: Monitor, 
    required: true,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    key: 'storage' as keyof PCBuild, 
    name: 'Storage', 
    category: 'Storage', 
    icon: HardDrive, 
    required: true,
    color: 'from-yellow-500 to-orange-600'
  },
  { 
    key: 'psu' as keyof PCBuild, 
    name: 'Power Supply', 
    category: 'Power Supplies', 
    icon: Zap, 
    required: true,
    color: 'from-teal-500 to-cyan-600'
  },
  { 
    key: 'case' as keyof PCBuild, 
    name: 'PC Case', 
    category: 'Cases', 
    icon: Box, 
    required: false,
    color: 'from-gray-500 to-slate-600'
  },
  { 
    key: 'cooling' as keyof PCBuild, 
    name: 'Cooling', 
    category: 'Cooling', 
    icon: Fan, 
    required: false,
    color: 'from-cyan-500 to-blue-600'
  },
  { 
    key: 'peripherals' as keyof PCBuild, 
    name: 'Peripherals', 
    category: 'Peripherals', 
    icon: Gamepad2, 
    required: false,
    color: 'from-orange-500 to-red-600'
  },
  { 
    key: 'monitor' as keyof PCBuild, 
    name: 'Monitor', 
    category: 'Monitors', 
    icon: Monitor, 
    required: false,
    color: 'from-indigo-500 to-purple-600'
  }
];

export default function PCBuilderPage() {
  const { user, isLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [build, setBuild] = useState<PCBuild>({});
  const [selectedCategory, setSelectedCategory] = useState<keyof PCBuild>('cpu');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await ensureDbInitialized();
        const dbProducts = await db.getAllProducts();
        
        // If no products in database, try loading from APIs
        if (dbProducts.length === 0) {
          console.log('No products found in database, trying to load from APIs...');
          await db.loadProductsFromAPI();
          const apiProducts = await db.getAllProducts();
          setProducts(apiProducts);
        } else {
          setProducts(dbProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Failed to load products');
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PC Builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getProductsForCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const selectComponent = (component: Product) => {
    setBuild(prev => ({
      ...prev,
      [selectedCategory]: component
    }));
    setIsModalOpen(false);
    toast.success(`${component.name} added to your build!`);
  };

  const removeComponent = (componentKey: keyof PCBuild) => {
    setBuild(prev => {
      const newBuild = { ...prev };
      delete newBuild[componentKey];
      return newBuild;
    });
    toast.success('Component removed from build');
  };

  const calculateTotal = () => {
    return Object.values(build).reduce((total, component) => 
      total + (component?.price || 0), 0
    );
  };

  const getCompletionPercentage = () => {
    const requiredComponents = componentCategories.filter(cat => cat.required);
    const completedRequired = requiredComponents.filter(cat => build[cat.key]);
    return Math.round((completedRequired.length / requiredComponents.length) * 100);
  };

  const isMinimumViable = () => {
    const requiredComponents = componentCategories.filter(cat => cat.required);
    return requiredComponents.every(cat => build[cat.key]);
  };

  const addBuildToCart = () => {
    const components = Object.values(build).filter(Boolean) as Product[];
    components.forEach(component => addToCart(component));
    toast.success(`${components.length} components added to cart!`);
  };

  const saveBuild = () => {
    const buildData = {
      ...build,
      total: calculateTotal(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pc_build', JSON.stringify(buildData));
    toast.success('Build saved successfully!');
  };

  const loadBuild = () => {
    const savedBuild = localStorage.getItem('pc_build');
    if (savedBuild) {
      const buildData = JSON.parse(savedBuild);
      delete buildData.total;
      delete buildData.timestamp;
      setBuild(buildData);
      toast.success('Build loaded successfully!');
    } else {
      toast.error('No saved build found');
    }
  };

  const clearBuild = () => {
    if (confirm('Are you sure you want to clear your current build?')) {
      setBuild({});
      toast.success('Build cleared');
    }
  };

  const openComponentSelector = (categoryKey: keyof PCBuild) => {
    setSelectedCategory(categoryKey);
    setIsModalOpen(true);
  };

  const getBuildSpecs = () => {
    const specs = [];
    if (build.cpu) specs.push(`CPU: ${build.cpu.name}`);
    if (build.gpu) specs.push(`GPU: ${build.gpu.name}`);
    if (build.ram) specs.push(`RAM: ${build.ram.name}`);
    if (build.storage) specs.push(`Storage: ${build.storage.name}`);
    if (build.motherboard) specs.push(`Motherboard: ${build.motherboard.name}`);
    if (build.psu) specs.push(`PSU: ${build.psu.name}`);
    return specs;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">PC Builder</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Build your dream PC with our interactive component selector
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress & Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Build Progress</span>
                <span className="text-sm font-medium text-primary-600">{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isMinimumViable() ? 'Your build is ready!' : 'Select required components to complete your build'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={saveBuild}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Build
              </button>
              <button
                onClick={loadBuild}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Load Build
              </button>
              <button
                onClick={clearBuild}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Build
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Components</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {componentCategories.map((category) => {
                  const IconComponent = category.icon;
                  const selectedComponent = build[category.key];
                  
                  return (
                    <div
                      key={category.key}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                        selectedComponent 
                          ? 'border-green-500 bg-green-50' 
                          : category.required 
                            ? 'border-red-200 bg-red-50 hover:border-red-300' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      onClick={() => openComponentSelector(category.key)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            {category.required && (
                              <span className="text-xs text-red-600">Required</span>
                            )}
                          </div>
                        </div>
                        {selectedComponent ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <Plus className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      
                      {selectedComponent ? (
                        <div>
                          <p className="font-medium text-gray-900 text-sm mb-1">
                            {selectedComponent.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                              ₱{selectedComponent.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeComponent(category.key);
                              }}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          Click to select {category.name.toLowerCase()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Build Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Build Summary</h2>
              
              {/* Total Price */}
              <div className="bg-gradient-primary text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Cost</p>
                    <p className="text-3xl font-bold">₱{calculateTotal().toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              {/* Compatibility Check */}
              <div className={`p-4 rounded-xl mb-6 ${
                isMinimumViable() 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {isMinimumViable() ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className={`font-medium ${
                    isMinimumViable() ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {isMinimumViable() ? 'Build Complete' : 'Missing Required Components'}
                  </span>
                </div>
              </div>

              {/* Build Specs */}
              {getBuildSpecs().length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Build Specifications</h3>
                  <div className="space-y-2">
                    {getBuildSpecs().map((spec, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={addBuildToCart}
                  disabled={Object.keys(build).length === 0}
                  className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add Build to Cart</span>
                </button>
                
                {isMinimumViable() && (
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>

              {/* Build Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{Object.keys(build).length}</p>
                    <p className="text-sm text-gray-600">Components</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{getCompletionPercentage()}%</p>
                    <p className="text-sm text-gray-600">Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Select {componentCategories.find(cat => cat.key === selectedCategory)?.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getProductsForCategory(
                componentCategories.find(cat => cat.key === selectedCategory)?.category || ''
              ).map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => selectComponent(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {getProductsForCategory(
              componentCategories.find(cat => cat.key === selectedCategory)?.category || ''
            ).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products available in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 