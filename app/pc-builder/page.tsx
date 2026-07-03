'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getBuildSnapshot, getCatalogProducts, saveBuildSnapshot } from '@/lib/shop';
import { Product } from '@/types';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  Box,
  Calculator,
  Check,
  ChevronDown,
  CircuitBoard,
  Cpu,
  Crown,
  Eye,
  Fan,
  Flame,
  Gamepad2,
  HardDrive,
  Heart,
  Monitor,
  Plus,
  Rocket,
  Save,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  Trash2,
  Upload,
  X,
  Zap,
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

type PCBuildKey = keyof PCBuild;
type PresetId = 'gaming-beast' | 'content-creator' | 'budget-warrior' | 'office-elite';
type ProductSort = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

type SavedBuildSnapshot = {
  name: string;
  componentIds: Partial<Record<PCBuildKey, string>>;
  timestamp: string;
};

const componentCategories = [
  {
    key: 'cpu' as PCBuildKey,
    name: 'Processor (CPU)',
    category: 'Processors',
    icon: Cpu,
    required: true,
    color: 'from-blue-500 to-indigo-600',
    description: 'The brain of your system',
  },
  {
    key: 'motherboard' as PCBuildKey,
    name: 'Motherboard',
    category: 'Motherboards',
    icon: CircuitBoard,
    required: true,
    color: 'from-purple-500 to-pink-600',
    description: 'Foundation that connects everything',
  },
  {
    key: 'ram' as PCBuildKey,
    name: 'Memory (RAM)',
    category: 'Memory (RAM)',
    icon: Zap,
    required: true,
    color: 'from-red-500 to-rose-600',
    description: 'High-speed system memory',
  },
  {
    key: 'gpu' as PCBuildKey,
    name: 'Graphics Card',
    category: 'Graphics Cards',
    icon: Monitor,
    required: true,
    color: 'from-green-500 to-emerald-600',
    description: 'Legendary gaming performance',
  },
  {
    key: 'storage' as PCBuildKey,
    name: 'Storage',
    category: 'Storage',
    icon: HardDrive,
    required: true,
    color: 'from-yellow-500 to-orange-600',
    description: 'Ultra-fast data storage',
  },
  {
    key: 'psu' as PCBuildKey,
    name: 'Power Supply',
    category: 'Power Supplies',
    icon: Zap,
    required: true,
    color: 'from-teal-500 to-cyan-600',
    description: 'Reliable power delivery',
  },
  {
    key: 'case' as PCBuildKey,
    name: 'PC Case',
    category: 'Cases',
    icon: Box,
    required: false,
    color: 'from-gray-500 to-slate-600',
    description: 'Premium housing for your build',
  },
  {
    key: 'cooling' as PCBuildKey,
    name: 'Cooling',
    category: 'Cooling',
    icon: Fan,
    required: false,
    color: 'from-cyan-500 to-blue-600',
    description: 'Keep temperatures optimal',
  },
  {
    key: 'peripherals' as PCBuildKey,
    name: 'Peripherals',
    category: 'Peripherals',
    icon: Gamepad2,
    required: false,
    color: 'from-orange-500 to-red-600',
    description: 'Gaming keyboards & mice',
  },
  {
    key: 'monitor' as PCBuildKey,
    name: 'Monitor',
    category: 'Monitors',
    icon: Monitor,
    required: false,
    color: 'from-indigo-500 to-purple-600',
    description: 'High-refresh gaming displays',
  },
] as const;

const presetBuilds: Array<{
  id: PresetId;
  name: string;
  budget: string;
  performance: string;
  icon: typeof Rocket;
  description: string;
}> = [
  {
    id: 'gaming-beast',
    name: 'Gaming Beast',
    budget: '₱150,000+',
    performance: 'Ultra High',
    icon: Rocket,
    description: 'Prioritizes top-tier GPU horsepower and elite gaming parts.',
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    budget: '₱100,000+',
    performance: 'High',
    icon: Award,
    description: 'Balances CPU, RAM, and storage for editing and streaming.',
  },
  {
    id: 'budget-warrior',
    name: 'Budget Warrior',
    budget: '₱50,000+',
    performance: 'Medium',
    icon: Shield,
    description: 'Targets value-first parts while keeping the build complete.',
  },
  {
    id: 'office-elite',
    name: 'Office Elite',
    budget: '₱30,000+',
    performance: 'Basic',
    icon: Target,
    description: 'Focuses on practical everyday performance and efficiency.',
  },
];

const particleStyles = [
  { left: '6%', top: '18%', delay: '0s', duration: '5s' },
  { left: '14%', top: '68%', delay: '0.5s', duration: '4s' },
  { left: '22%', top: '40%', delay: '1.2s', duration: '6s' },
  { left: '33%', top: '16%', delay: '0.8s', duration: '5.6s' },
  { left: '41%', top: '74%', delay: '1.7s', duration: '4.2s' },
  { left: '52%', top: '28%', delay: '2.3s', duration: '5.4s' },
  { left: '61%', top: '60%', delay: '0.9s', duration: '4.8s' },
  { left: '72%', top: '22%', delay: '1.8s', duration: '6.4s' },
  { left: '80%', top: '58%', delay: '2.6s', duration: '5.3s' },
  { left: '90%', top: '14%', delay: '1.4s', duration: '4.6s' },
];

function getSpecification(product: Product | undefined, key: string) {
  return product?.specifications?.[key];
}

function getFirstNumber(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const match = value.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function normalizeText(value: string | undefined) {
  return value?.toLowerCase().replace(/\s+/g, '') ?? '';
}

function includesNormalized(haystack: string | undefined, needle: string | undefined) {
  const normalizedNeedle = normalizeText(needle);
  if (!normalizedNeedle) {
    return false;
  }

  return normalizeText(haystack).includes(normalizedNeedle);
}

function estimateBuildWattage(build: PCBuild) {
  const cpuTdp = Math.max(
    getFirstNumber(getSpecification(build.cpu, 'TDP')),
    getFirstNumber(getSpecification(build.cpu, 'Max Turbo Power')),
  );
  const gpuTdp = getFirstNumber(getSpecification(build.gpu, 'Power Consumption'));
  const coolerDraw = build.cooling ? 15 : 0;
  const storageDraw = build.storage ? 10 : 0;
  const memoryDraw = build.ram ? 12 : 0;
  const motherboardDraw = build.motherboard ? 50 : 0;

  return cpuTdp + gpuTdp + coolerDraw + storageDraw + memoryDraw + motherboardDraw + 60;
}

function getCompatibilityIssues(build: PCBuild, wattage: number) {
  const issues: string[] = [];
  const notes: string[] = [];

  const cpuSocket = getSpecification(build.cpu, 'Socket');
  const motherboardSocket = getSpecification(build.motherboard, 'Socket');
  const ramType = getSpecification(build.ram, 'Type');
  const boardMemory = getSpecification(build.motherboard, 'Memory');
  const coolerSockets = getSpecification(build.cooling, 'Socket');
  const psuWattage = getFirstNumber(getSpecification(build.psu, 'Wattage'));
  const gpuPsuRecommendation = getFirstNumber(getSpecification(build.gpu, 'Recommended PSU'));

  if (build.cpu && build.motherboard && cpuSocket && motherboardSocket && normalizeText(cpuSocket) !== normalizeText(motherboardSocket)) {
    issues.push(`CPU socket ${cpuSocket} does not match motherboard socket ${motherboardSocket}.`);
  }

  if (build.ram && build.motherboard && ramType && boardMemory && !includesNormalized(boardMemory, ramType)) {
    issues.push(`Selected RAM type ${ramType} is not listed in motherboard memory support.`);
  }

  if (build.cooling && build.cpu && cpuSocket && coolerSockets && !includesNormalized(coolerSockets, cpuSocket)) {
    issues.push(`Cooler socket support does not include the CPU socket ${cpuSocket}.`);
  }

  if (build.psu && psuWattage > 0) {
    const recommendedWattage = Math.max(Math.ceil(wattage * 1.25), gpuPsuRecommendation);
    if (recommendedWattage > 0 && psuWattage < recommendedWattage) {
      issues.push(`Power supply may be undersized. Estimated recommendation is ${recommendedWattage}W or higher.`);
    } else {
      notes.push(`Power headroom looks healthy with a ${psuWattage}W PSU.`);
    }
  }

  if (build.cpu && build.motherboard && cpuSocket && motherboardSocket && normalizeText(cpuSocket) === normalizeText(motherboardSocket)) {
    notes.push(`CPU and motherboard sockets are aligned (${cpuSocket}).`);
  }

  if (build.ram && build.motherboard && ramType && boardMemory && includesNormalized(boardMemory, ramType)) {
    notes.push(`Motherboard memory support matches the selected ${ramType} kit.`);
  }

  if (issues.length === 0 && notes.length === 0 && Object.keys(build).length > 0) {
    notes.push('No obvious compatibility issues detected from the available specs.');
  }

  return { issues, notes };
}

function getPerformanceLevel(total: number) {
  if (total >= 150000) {
    return { level: 'Legendary', color: 'from-yellow-500 to-orange-500', icon: Crown };
  }
  if (total >= 100000) {
    return { level: 'Elite', color: 'from-purple-500 to-pink-500', icon: Award };
  }
  if (total >= 50000) {
    return { level: 'Advanced', color: 'from-blue-500 to-indigo-500', icon: Shield };
  }
  return { level: 'Budget', color: 'from-green-500 to-emerald-500', icon: Target };
}

function getProductsForCategory(products: Product[], category: string) {
  return products.filter((product) => product.category === category);
}

export default function PCBuilderPage() {
  const { user, isLoading } = useAuth();
  const { addManyToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [build, setBuild] = useState<PCBuild>({});
  const [selectedCategory, setSelectedCategory] = useState<PCBuildKey>('cpu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildName, setBuildName] = useState('My Dream Build');
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState<ProductSort>('recommended');
  const [isClearBuildModalOpen, setIsClearBuildModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const refreshCatalog = () => {
      setProducts(getCatalogProducts());
    };

    refreshCatalog();
    window.addEventListener('vertixhub:storefront-updated', refreshCatalog);

    return () => {
      window.removeEventListener('vertixhub:storefront-updated', refreshCatalog);
    };
  }, []);

  const total = useMemo(
    () => Object.values(build).reduce((sum, component) => sum + (component?.price ?? 0), 0),
    [build],
  );
  const requiredCategories = useMemo(
    () => componentCategories.filter((category) => category.required),
    [],
  );
  const requiredComponents = requiredCategories.length;
  const completedRequired = requiredCategories.filter((category) => build[category.key]).length;
  const completionPercentage = Math.round((completedRequired / requiredComponents) * 100);
  const isMinimumViable = requiredCategories.every((category) => build[category.key]);
  const buildComponentCount = Object.keys(build).length;
  const estimatedWattage = useMemo(() => estimateBuildWattage(build), [build]);
  const recommendedPsu = Math.max(Math.ceil(estimatedWattage * 1.25), getFirstNumber(getSpecification(build.gpu, 'Recommended PSU')));
  const compatibility = useMemo(() => getCompatibilityIssues(build, estimatedWattage), [build, estimatedWattage]);
  const missingRequired = requiredCategories.filter((category) => !build[category.key]);
  const performanceLevel = getPerformanceLevel(total);
  const PerformanceIcon = performanceLevel.icon;
  const activeCategory = componentCategories.find((category) => category.key === selectedCategory) ?? componentCategories[0];

  const modalProducts = useMemo(() => {
    const items = getProductsForCategory(products, activeCategory.category).filter((product) => {
      if (!productSearch.trim()) {
        return true;
      }

      const query = productSearch.trim().toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return items.sort((left, right) => {
      switch (productSort) {
        case 'price-asc':
          return left.price - right.price;
        case 'price-desc':
          return right.price - left.price;
        case 'rating':
          return right.rating - left.rating;
        case 'recommended':
        default:
          return Number(right.featured ?? false) - Number(left.featured ?? false) || right.rating - left.rating || right.stock - left.stock;
      }
    });
  }, [activeCategory.category, productSearch, productSort, products]);

  const buildSpecs = useMemo(() => {
    const specs: string[] = [];
    if (build.cpu) specs.push(`CPU: ${build.cpu.name}`);
    if (build.gpu) specs.push(`GPU: ${build.gpu.name}`);
    if (build.ram) specs.push(`RAM: ${build.ram.name}`);
    if (build.storage) specs.push(`Storage: ${build.storage.name}`);
    if (build.motherboard) specs.push(`Motherboard: ${build.motherboard.name}`);
    if (build.psu) specs.push(`PSU: ${build.psu.name}`);
    return specs;
  }, [build]);

  const selectComponent = (component: Product) => {
    if (component.stock <= 0) {
      toast.error(`${component.name} is out of stock.`);
      return;
    }

    setBuild((currentBuild) => ({
      ...currentBuild,
      [selectedCategory]: component,
    }));
    setIsModalOpen(false);
    setProductSearch('');
    toast.success(`${component.name} added to your build!`);
  };

  const removeComponent = (componentKey: PCBuildKey) => {
    setBuild((currentBuild) => {
      const nextBuild = { ...currentBuild };
      delete nextBuild[componentKey];
      return nextBuild;
    });
    toast.success('Component removed from build.');
  };

  const openComponentSelector = (categoryKey: PCBuildKey) => {
    setSelectedCategory(categoryKey);
    setProductSearch('');
    setProductSort('recommended');
    setIsModalOpen(true);
  };

  const addBuildToCart = () => {
    const components = Object.values(build).filter((component): component is Product => Boolean(component) && component.stock > 0);

    if (components.length === 0) {
      toast.error('Select at least one in-stock component first.');
      return false;
    }

    const result = addManyToCart(components.map((component) => ({ product: component, quantity: 1 })));
    return result.addedUnits > 0;
  };

  const saveBuild = () => {
    const componentIds = Object.entries(build).reduce<Partial<Record<PCBuildKey, string>>>((accumulator, [key, component]) => {
      if (component?.id) {
        accumulator[key as PCBuildKey] = component.id;
      }
      return accumulator;
    }, {});

    saveBuildSnapshot({
      name: buildName.trim() || 'My Dream Build',
      componentIds,
      timestamp: new Date().toISOString(),
    });
    toast.success('Build saved successfully.');
  };

  const loadBuild = () => {
    const snapshot = getBuildSnapshot<SavedBuildSnapshot>();

    if (!snapshot?.componentIds) {
      toast.error('No saved build found.');
      return;
    }

    const catalog = new Map(products.map((product) => [product.id, product]));
    const restoredBuild = Object.entries(snapshot.componentIds).reduce<PCBuild>((accumulator, [key, productId]) => {
      const product = productId ? catalog.get(productId) : undefined;
      if (product) {
        accumulator[key as PCBuildKey] = product;
      }
      return accumulator;
    }, {});

    setBuild(restoredBuild);
    setBuildName(snapshot.name || 'Loaded Build');
    toast.success('Build loaded successfully.');
  };

  const clearBuild = () => {
    setBuild({});
    setBuildName('My Dream Build');
    toast.success('Build cleared.');
  };

  const applyPreset = (presetId: PresetId) => {
    const selectByPriority = (
      key: PCBuildKey,
      options: {
        budget?: number;
        preferFeatured?: boolean;
        preferAffordable?: boolean;
      } = {},
    ) => {
      const category = componentCategories.find((entry) => entry.key === key);
      if (!category) {
        return undefined;
      }

      const candidates = getProductsForCategory(products, category.category)
        .filter((product) => product.stock > 0)
        .sort((left, right) => {
          if (options.preferFeatured) {
            const featuredDelta = Number(right.featured ?? false) - Number(left.featured ?? false);
            if (featuredDelta !== 0) {
              return featuredDelta;
            }
          }

          if (options.preferAffordable) {
            return left.price - right.price || right.rating - left.rating;
          }

          return right.rating - left.rating || right.price - left.price;
        });

      if (!options.budget) {
        return candidates[0];
      }

      return candidates.find((product) => product.price <= options.budget!) ?? candidates[candidates.length - 1];
    };

    let nextBuild: PCBuild = {};
    let nextName = buildName;

    switch (presetId) {
      case 'gaming-beast':
        nextBuild = {
          cpu: selectByPriority('cpu', { budget: 70000, preferFeatured: true }),
          motherboard: selectByPriority('motherboard', { budget: 50000, preferFeatured: true }),
          ram: selectByPriority('ram', { budget: 40000, preferFeatured: true }),
          gpu: selectByPriority('gpu', { budget: 120000, preferFeatured: true }),
          storage: selectByPriority('storage', { budget: 30000, preferFeatured: true }),
          psu: selectByPriority('psu', { budget: 30000 }),
          case: selectByPriority('case'),
          cooling: selectByPriority('cooling'),
        };
        nextName = 'Gaming Beast';
        break;
      case 'content-creator':
        nextBuild = {
          cpu: selectByPriority('cpu', { budget: 80000, preferFeatured: true }),
          motherboard: selectByPriority('motherboard', { budget: 45000 }),
          ram: selectByPriority('ram', { budget: 70000, preferFeatured: true }),
          gpu: selectByPriority('gpu', { budget: 80000 }),
          storage: selectByPriority('storage', { budget: 35000, preferFeatured: true }),
          psu: selectByPriority('psu', { budget: 25000 }),
          case: selectByPriority('case'),
          cooling: selectByPriority('cooling'),
        };
        nextName = 'Content Creator';
        break;
      case 'budget-warrior':
        nextBuild = {
          cpu: selectByPriority('cpu', { preferAffordable: true, budget: 40000 }),
          motherboard: selectByPriority('motherboard', { preferAffordable: true, budget: 30000 }),
          ram: selectByPriority('ram', { preferAffordable: true, budget: 25000 }),
          gpu: selectByPriority('gpu', { preferAffordable: true, budget: 50000 }),
          storage: selectByPriority('storage', { preferAffordable: true, budget: 20000 }),
          psu: selectByPriority('psu', { preferAffordable: true, budget: 18000 }),
          case: selectByPriority('case', { preferAffordable: true }),
        };
        nextName = 'Budget Warrior';
        break;
      case 'office-elite':
        nextBuild = {
          cpu: selectByPriority('cpu', { preferAffordable: true, budget: 35000 }),
          motherboard: selectByPriority('motherboard', { preferAffordable: true, budget: 25000 }),
          ram: selectByPriority('ram', { preferAffordable: true, budget: 25000 }),
          gpu: selectByPriority('gpu', { preferAffordable: true, budget: 45000 }),
          storage: selectByPriority('storage', { preferAffordable: true, budget: 18000 }),
          psu: selectByPriority('psu', { preferAffordable: true, budget: 15000 }),
          case: selectByPriority('case', { preferAffordable: true }),
        };
        nextName = 'Office Elite';
        break;
      default:
        break;
    }

    setBuild(nextBuild);
    setBuildName(nextName);
    toast.success(`${nextName} preset applied.`);
  };

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

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {particleStyles.map((particle, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
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

            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] mb-6">
              <span className="block">Craft Your</span>
              <span className="block pb-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Powerhouse
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Build the ultimate gaming machine with our
              <span className="text-yellow-400 font-semibold"> live component selector</span>,
              compatibility checks, and
              <span className="text-pink-400 font-semibold"> instant power and budget guidance</span>.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  <div className="text-3xl font-black text-white mb-1">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</div>
                  <div className="text-sm text-gray-400 font-medium">Total Investment</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Flame className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{estimatedWattage}W</div>
                  <div className="text-sm text-gray-400 font-medium">Estimated Draw</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-3">Build Name</label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(event) => setBuildName(event.target.value)}
                  className="w-full px-6 py-4 text-2xl font-black border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                  placeholder="Name your legendary build..."
                />
              </div>

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
                  onClick={() => setIsClearBuildModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear Build</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Build Progress</h3>
                  <p className="text-gray-600">
                    {isMinimumViable
                      ? compatibility.issues.length === 0
                        ? 'Your legendary build is complete and passes basic checks.'
                        : 'Your build is complete, but a few compatibility checks need attention.'
                      : `${requiredComponents - completedRequired} core components remaining`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-600">{completionPercentage}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              <div className="relative w-full bg-gray-200 rounded-2xl h-6 overflow-hidden">
                <div
                  className={`h-full rounded-2xl transition-all duration-1000 ease-out ${
                    isMinimumViable && compatibility.issues.length === 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Quick Start Templates</h2>
                <p className="text-gray-600">Apply a preset, then fine-tune each component.</p>
              </div>
              <div className="text-sm text-gray-500">Built from your live catalog and current stock</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {presetBuilds.map((preset) => {
                const PresetIcon = preset.icon;

                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="text-left group bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <PresetIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2 text-lg">{preset.name}</h3>
                    <p className="text-purple-600 font-bold mb-1">{preset.budget}</p>
                    <p className="text-gray-600 text-sm mb-3">{preset.performance} Performance</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Select Components</h2>
                    <p className="text-gray-600">Mix and match parts, then review live compatibility feedback.</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-bold text-purple-600">{buildComponentCount}</span> / {componentCategories.length} selected
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {componentCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    const selectedComponent = build[category.key];

                    return (
                      <button
                        key={category.key}
                        type="button"
                        className={`group relative overflow-hidden border-2 rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-[1.01] ${
                          selectedComponent
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                            : category.required
                              ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 hover:border-orange-400 shadow-md hover:shadow-lg'
                              : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-purple-300 hover:shadow-lg'
                        }`}
                        onClick={() => openComponentSelector(category.key)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
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
                                  <p className="font-bold text-gray-900 text-base">{selectedComponent.name}</p>
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-2xl font-black text-green-600">
                                      ₱{selectedComponent.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="font-bold text-gray-600">{selectedComponent.rating}</span>
                                      </div>
                                      <span className="text-gray-500">({selectedComponent.reviews})</span>
                                      <span className={selectedComponent.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                        {selectedComponent.stock > 0 ? `${selectedComponent.stock} in stock` : 'Out of stock'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 font-medium">Click to select {category.name.toLowerCase()}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            {selectedComponent ? (
                              <>
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Check className="w-6 h-6 text-white" />
                                </div>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    removeComponent(category.key);
                                  }}
                                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50"
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl pointer-events-none"></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl p-8 text-white sticky top-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2">Build Summary</h2>
                  <p className="text-purple-200">{buildName}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 font-medium">Total Investment</p>
                      <p className="text-4xl font-black text-white">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</p>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${performanceLevel.color}`}>
                      <PerformanceIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Performance Tier</span>
                      <span className="font-bold text-yellow-400">{performanceLevel.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Estimated Wattage</span>
                      <span className="font-bold text-white">{estimatedWattage}W</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Recommended PSU</span>
                      <span className="font-bold text-white">{recommendedPsu > 0 ? `${recommendedPsu}W+` : 'Add CPU/GPU'}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl mb-6 border-2 ${
                  isMinimumViable && compatibility.issues.length === 0
                    ? 'bg-green-500/20 border-green-400/50'
                    : 'bg-orange-500/20 border-orange-400/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    {isMinimumViable && compatibility.issues.length === 0 ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                    <div>
                      <p className={`font-bold ${isMinimumViable && compatibility.issues.length === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                        {isMinimumViable && compatibility.issues.length === 0 ? 'Build Looks Ready' : 'Review Build Health'}
                      </p>
                      <p className="text-sm text-gray-300">
                        {isMinimumViable
                          ? compatibility.issues.length === 0
                            ? 'Core components selected and no obvious spec conflicts found.'
                            : `${compatibility.issues.length} warning(s) need attention.`
                          : `${missingRequired.length} core component slot(s) still missing.`}
                      </p>
                    </div>
                  </div>
                </div>

                {missingRequired.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-white mb-3 text-lg">Missing Core Parts</h3>
                    <div className="flex flex-wrap gap-2">
                      {missingRequired.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => openComponentSelector(item.key)}
                          className="px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-sm text-white hover:bg-white/20"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {compatibility.issues.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-white mb-3 text-lg">Compatibility Warnings</h3>
                    <div className="space-y-3">
                      {compatibility.issues.map((issue, index) => (
                        <div key={index} className="bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm text-red-100">
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {compatibility.notes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-white mb-3 text-lg">Builder Notes</h3>
                    <div className="space-y-3">
                      {compatibility.notes.map((note, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                          <p className="text-sm text-gray-200 font-medium">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {buildSpecs.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-bold text-white mb-4 text-lg">Build Specifications</h3>
                    <div className="space-y-3">
                      {buildSpecs.map((spec, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                          <p className="text-sm text-gray-300 font-medium">{spec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={addBuildToCart}
                    disabled={buildComponentCount === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-4 rounded-2xl font-black text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>Add Build to Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isMinimumViable) {
                        toast.error('Complete the required components first.');
                        return;
                      }
                      if (compatibility.issues.length > 0) {
                        toast.error('Resolve the compatibility warnings before checkout.');
                        return;
                      }

                      let addedSuccessfully = false;
                      flushSync(() => {
                        addedSuccessfully = addBuildToCart();
                      });

                      if (!addedSuccessfully) {
                        return;
                      }

                      router.push('/checkout');
                    }}
                    disabled={!isMinimumViable}
                    className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Rocket className="w-6 h-6" />
                    <span>Proceed to Checkout</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-black text-yellow-400">{buildComponentCount}</p>
                      <p className="text-sm text-purple-200 font-medium">Components</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-pink-400">{completionPercentage}%</p>
                      <p className="text-sm text-purple-200 font-medium">Complete</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-emerald-400">{products.filter((product) => product.stock > 0).length}</p>
                      <p className="text-sm text-purple-200 font-medium">Live Parts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black mb-2">Select {activeCategory.name}</h3>
                  <p className="text-purple-100">Choose the perfect component for your legendary build.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder={`Search ${activeCategory.name.toLowerCase()}...`}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none"
                  />
                </div>
                <select
                  value={productSort}
                  onChange={(event) => setProductSort(event.target.value as ProductSort)}
                  className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none bg-white"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {modalProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modalProducts.map((product) => {
                    const isSelected = build[selectedCategory]?.id === product.id;

                    return (
                      <button
                        type="button"
                        key={product.id}
                        className={`group text-left border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] ${
                          product.stock <= 0
                            ? 'border-gray-200 opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'border-green-500 shadow-xl bg-green-50'
                              : 'border-gray-200 hover:border-purple-500 hover:shadow-xl'
                        }`}
                        onClick={() => selectComponent(product)}
                        disabled={product.stock <= 0}
                      >
                        <div className="relative mb-4">
                          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
                          {product.featured && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute left-3 top-3 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
                              Selected
                            </div>
                          )}
                        </div>

                        <h4 className="font-black text-gray-900 mb-3 text-lg line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                          {product.name}
                        </h4>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>

                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-2xl font-black text-purple-600">
                            ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-bold text-gray-600">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 text-sm">
                          <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                          <span className="text-gray-500">{product.category}</span>
                        </div>

                        <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300 text-center">
                          {isSelected ? 'Keep Selected' : 'Select Component'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Components Available</h3>
                  <p className="text-gray-600">No products matched your current search for this category.</p>
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

      <Modal
        isOpen={isClearBuildModalOpen}
        title="Clear Current Build?"
        description="This will remove all selected components from your current PC build and reset the builder name to the default."
        confirmText="Clear Build"
        cancelText="Keep Build"
        variant="danger"
        onConfirm={() => {
          clearBuild();
          setIsClearBuildModalOpen(false);
        }}
        onClose={() => setIsClearBuildModalOpen(false)}
      />
    </div>
  );
}
