'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import productsData from '@/data/products.json';
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
  Gamepad2,
  X,
  Star,
  Crown,
  Sparkles,
  Settings,
  Flame,
  Target,
  Award,
  Shield,
  Activity,
  TrendingUp,
  ArrowRight,
  Save,
  Upload,
  Trash2,
  ChevronDown,
  Eye,
  Rocket,
  Heart
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
    color: 'from-blue-500 to-indigo-600',
    description: 'The brain of your system'
  },
  { 
    key: 'motherboard' as keyof PCBuild, 
    name: 'Motherboard', 
    category: 'Motherboards', 
    icon: CircuitBoard, 
    required: true,
    color: 'from-purple-500 to-pink-600',
    description: 'Foundation that connects everything'
  },
  { 
    key: 'ram' as keyof PCBuild, 
    name: 'Memory (RAM)', 
    category: 'Memory (RAM)', 
    icon: Zap, 
    required: true,
    color: 'from-red-500 to-rose-600',
    description: 'High-speed system memory'
  },
  { 
    key: 'gpu' as keyof PCBuild, 
    name: 'Graphics Card', 
    category: 'Graphics Cards', 
    icon: Monitor, 
    required: true,
    color: 'from-green-500 to-emerald-600',
    description: 'Legendary gaming performance'
  },
  { 
    key: 'storage' as keyof PCBuild, 
    name: 'Storage', 
    category: 'Storage', 
    icon: HardDrive, 
    required: true,
    color: 'from-yellow-500 to-orange-600',
    description: 'Ultra-fast data storage'
  },
  { 
    key: 'psu' as keyof PCBuild, 
    name: 'Power Supply', 
    category: 'Power Supplies', 
    icon: Zap, 
    required: true,
    color: 'from-teal-500 to-cyan-600',
    description: 'Reliable power delivery'
  },
  { 
    key: 'case' as keyof PCBuild, 
    name: 'PC Case', 
    category: 'Cases', 
    icon: Box, 
    required: false,
    color: 'from-gray-500 to-slate-600',
    description: 'Premium housing for your build'
  },
  { 
    key: 'cooling' as keyof PCBuild, 
    name: 'Cooling', 
    category: 'Cooling', 
    icon: Fan, 
    required: false,
    color: 'from-cyan-500 to-blue-600',
    description: 'Keep temperatures optimal'
  },
  { 
    key: 'peripherals' as keyof PCBuild, 
    name: 'Peripherals', 
    category: 'Peripherals', 
    icon: Gamepad2, 
    required: false,
    color: 'from-orange-500 to-red-600',
    description: 'Gaming keyboards & mice'
  },
  { 
    key: 'monitor' as keyof PCBuild, 
    name: 'Monitor', 
    category: 'Monitors', 
    icon: Monitor, 
    required: false,
    color: 'from-indigo-500 to-purple-600',
    description: 'High-refresh gaming displays'
  }
];

export default function PCBuilderPage() {
  const { user, isLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products] = useState<Product[]>(productsData.products as unknown as Product[]);
  const [build, setBuild] = useState<PCBuild>({});
  const [selectedCategory, setSelectedCategory] = useState<keyof PCBuild>('cpu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildName, setBuildName] = useState('My Dream Build');
  const [presetBuilds] = useState([
    { name: 'Gaming Beast', budget: '₱150,000+', performance: 'Ultra High' },
    { name: 'Content Creator', budget: '₱100,000+', performance: 'High' },
    { name: 'Budget Warrior', budget: '₱50,000+', performance: 'Medium' },
    { name: 'Office Elite', budget: '₱30,000+', performance: 'Basic' }
  ]);

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
          <p className="text-white text-xl font-medium">Initializing PC Builder...</p>
          <p className="text-purple-300 text-sm mt-2">Preparing legendary components</p>
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
      name: buildName,
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
      setBuildName(buildData.name || 'Loaded Build');
      delete buildData.name;
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
      setBuildName('My Dream Build');
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

  const getPerformanceLevel = () => {
    const total = calculateTotal();
    if (total >= 150000) return { level: 'Legendary', color: 'from-yellow-500 to-orange-500', icon: Crown };
    if (total >= 100000) return { level: 'Elite', color: 'from-purple-500 to-pink-500', icon: Award };
    if (total >= 50000) return { level: 'Advanced', color: 'from-blue-500 to-indigo-500', icon: Shield };
    return { level: 'Budget', color: 'from-green-500 to-emerald-500', icon: Target };
  };

  const requiredComponents = componentCategories.filter(cat => cat.required).length;
  const completedRequired = componentCategories.filter(cat => cat.required && build[cat.key]).length;
  const performanceLevel = getPerformanceLevel();
  const PerformanceIcon = performanceLevel.icon;

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
              <Settings className="w-5 h-5 mr-2" />
              PC Master Forge
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6">
              <span className="block">Craft Your</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Legend
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Build the ultimate gaming machine with our 
              <span className="text-yellow-400 font-semibold"> intelligent component selector</span>. 
              Every part optimized for 
              <span className="text-pink-400 font-semibold"> legendary performance</span>.
            </p>

            {/* Build Progress Overview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{completedRequired}/{requiredComponents}</div>
                  <div className="text-sm text-gray-400 font-medium">Core Components</div>
                </div>
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${performanceLevel.color}/20 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <PerformanceIcon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{performanceLevel.level}</div>
                  <div className="text-sm text-gray-400 font-medium">Performance Tier</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">₱{calculateTotal().toLocaleString('en-PH', { minimumFractionDigits: 0 })}</div>
                  <div className="text-sm text-gray-400 font-medium">Total Investment</div>
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

      {/* Build Controls Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Build Name & Actions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Build Name */}
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-3">Build Name</label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-black border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                  placeholder="Name your legendary build..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveBuild}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Build</span>
                </button>
                <button
                  onClick={loadBuild}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Load Build</span>
                </button>
                <button
                  onClick={clearBuild}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear Build</span>
                </button>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Build Progress</h3>
                  <p className="text-gray-600">
                    {isMinimumViable() ? '🎉 Your legendary build is complete!' : `${requiredComponents - completedRequired} core components remaining`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-600">{getCompletionPercentage()}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              <div className="relative w-full bg-gray-200 rounded-2xl h-6 overflow-hidden">
                <div 
                  className={`h-full rounded-2xl transition-all duration-1000 ease-out ${
                    isMinimumViable() 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                  style={{ width: `${getCompletionPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Builds Quick Start */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Quick Start Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {presetBuilds.map((preset, index) => (
                <div key={preset.name} className="group bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2 text-lg">{preset.name}</h3>
                    <p className="text-purple-600 font-bold mb-1">{preset.budget}</p>
                    <p className="text-gray-600 text-sm">{preset.performance} Performance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Component Selection & Build Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Component Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-gray-900">Select Components</h2>
                  <div className="text-sm text-gray-500">
                    <span className="font-bold text-purple-600">{Object.keys(build).length}</span> / {componentCategories.length} selected
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {componentCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    const selectedComponent = build[category.key];
                    
                    return (
                      <div
                        key={category.key}
                        className={`group relative overflow-hidden border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedComponent 
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                            : category.required 
                              ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 hover:border-orange-400 shadow-md hover:shadow-lg' 
                              : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-purple-300 hover:shadow-lg'
                        }`}
                        onClick={() => openComponentSelector(category.key)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-black text-gray-900 text-lg">{category.name}</h3>
                                {category.required && (
                                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                    Required
                                  </span>
                                )}
                                {selectedComponent?.featured && (
                                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                              
                              {selectedComponent ? (
                                <div className="space-y-2">
                                  <p className="font-bold text-gray-900 text-base">
                                    {selectedComponent.name}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-green-600">
                                      ₱{selectedComponent.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-bold text-gray-600">{selectedComponent.rating}</span>
                                      </div>
                                      <span className="text-sm text-gray-500">({selectedComponent.reviews})</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 font-medium">
                                  Click to select {category.name.toLowerCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 ml-4">
                            {selectedComponent ? (
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Enhanced Build Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl p-8 text-white sticky top-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2">Build Summary</h2>
                  <p className="text-purple-200">{buildName}</p>
                </div>
                
                {/* Total Price */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 font-medium">Total Investment</p>
                      <p className="text-4xl font-black text-white">₱{calculateTotal().toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${performanceLevel.color}`}>
                      <PerformanceIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-200">Performance Tier</span>
                      <span className="font-bold text-yellow-400">{performanceLevel.level}</span>
                    </div>
                  </div>
                </div>

                {/* Compatibility Status */}
                <div className={`p-6 rounded-2xl mb-8 border-2 ${
                  isMinimumViable() 
                    ? 'bg-green-500/20 border-green-400/50' 
                    : 'bg-orange-500/20 border-orange-400/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    {isMinimumViable() ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <p className={`font-bold ${isMinimumViable() ? 'text-green-400' : 'text-orange-400'}`}>
                        {isMinimumViable() ? '🎉 Build Complete!' : '⚠️ Missing Components'}
                      </p>
                      <p className="text-sm text-gray-300">
                        {isMinimumViable() 
                          ? 'Ready for legendary performance' 
                          : `${requiredComponents - completedRequired} core components needed`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Build Specs */}
                {getBuildSpecs().length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-bold text-white mb-4 text-lg">Build Specifications</h3>
                    <div className="space-y-3">
                      {getBuildSpecs().map((spec, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                          <p className="text-sm text-gray-300 font-medium">{spec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={addBuildToCart}
                    disabled={Object.keys(build).length === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-4 rounded-2xl font-black text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>Add Build to Cart</span>
                  </button>
                  
                  {isMinimumViable() && (
                    <button
                      onClick={() => router.push('/checkout')}
                      className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Rocket className="w-6 h-6" />
                      <span>Proceed to Checkout</span>
                    </button>
                  )}
                </div>

                {/* Build Stats */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <p className="text-3xl font-black text-yellow-400">{Object.keys(build).length}</p>
                      <p className="text-sm text-purple-200 font-medium">Components</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-pink-400">{getCompletionPercentage()}%</p>
                      <p className="text-sm text-purple-200 font-medium">Complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black mb-2">
                    Select {componentCategories.find(cat => cat.key === selectedCategory)?.name}
                  </h3>
                  <p className="text-purple-100">
                    Choose the perfect component for your legendary build
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProductsForCategory(
                  componentCategories.find(cat => cat.key === selectedCategory)?.category || ''
                ).map((product) => (
                  <div
                    key={product.id}
                    className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => selectComponent(product)}
                  >
                    <div className="relative mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      {product.featured && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-black text-gray-900 mb-3 text-lg line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {product.name}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-purple-600">
                        ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold text-gray-600">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        Select Component
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {getProductsForCategory(
                componentCategories.find(cat => cat.key === selectedCategory)?.category || ''
              ).length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Components Available</h3>
                  <p className="text-gray-600">No products available in this category at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          from { opacity: 0; }
          to { opacity: 1; }
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
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 