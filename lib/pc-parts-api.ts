// PC Parts API Service
import { Product } from '@/types';

// API Configuration
const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Helper function to generate unique IDs
const generateId = (category: string, index: number): string => {
  return `${category.toLowerCase().replace(/\s+/g, '-')}-${index}`;
};

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeout: number = API_CONFIG.timeout): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// GPU Data from GPU-Info API
export const fetchGPUData = async (): Promise<Product[]> => {
  try {
    console.log('Fetching GPU data from API...');
    const response = await fetchWithTimeout('https://raw.githubusercontent.com/InstantWindy/GPU-Z-JSON-Database/main/GPU_Database.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const gpuProducts: Product[] = [];
    
    // Process GPU data (take first 20 GPUs)
    const gpuArray = Array.isArray(data) ? data : Object.values(data);
    const limitedGPUs = gpuArray.slice(0, 20);
    
    limitedGPUs.forEach((gpu: any, index: number) => {
      if (gpu.productName || gpu.name || gpu.model) {
        const name = gpu.productName || gpu.name || gpu.model || `Graphics Card ${index + 1}`;
        const memory = gpu.memorySize || gpu.vram || '8';
        const price = 300 + Math.floor(Math.random() * 1200); // Random price between $300-$1500
        
        const product: Product = {
          id: generateId('gpu', index),
          name: name,
          description: `${gpu.manufacturerName || 'NVIDIA'} Graphics Card - ${memory}GB VRAM${gpu.memoryType ? `, ${gpu.memoryType}` : ''}`,
          price: price,
          originalPrice: price + Math.floor(Math.random() * 200),
          image: 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
          category: 'Graphics Cards',
          stock: Math.floor(Math.random() * 50) + 5,
          rating: 4.0 + Math.random() * 1.0,
          reviews: Math.floor(Math.random() * 500) + 50,
          featured: Math.random() > 0.7,
          tags: ['GPU', 'Gaming', gpu.manufacturerName || 'NVIDIA'],
          specifications: {
            'Memory Size': `${memory}GB`,
            'Memory Type': gpu.memoryType || 'GDDR6',
            'Manufacturer': gpu.manufacturerName || 'NVIDIA',
            'Architecture': gpu.architecture || 'Modern'
          }
        };
        
        gpuProducts.push(product);
      }
    });
    
    console.log(`Fetched ${gpuProducts.length} GPU products`);
    return gpuProducts;
  } catch (error) {
    console.error('Failed to fetch GPU data:', error);
    return generateFallbackGPUs();
  }
};

// CPU Data from Processor API
export const fetchCPUData = async (): Promise<Product[]> => {
  try {
    console.log('Fetching CPU data from API...');
    const response = await fetchWithTimeout('https://raw.githubusercontent.com/filipamiralopes/tech-specs-dataset/main/cpu_data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const cpuProducts: Product[] = [];
    
    // Process CPU data (take first 15 CPUs)
    const cpuArray = Array.isArray(data) ? data : Object.values(data);
    const limitedCPUs = cpuArray.slice(0, 15);
    
    limitedCPUs.forEach((cpu: any, index: number) => {
      if (cpu.name || cpu.model || cpu.processor_name) {
        const name = cpu.name || cpu.model || cpu.processor_name || `Processor ${index + 1}`;
        const cores = cpu.cores || cpu.core_count || Math.floor(Math.random() * 8) + 4;
        const price = 150 + Math.floor(Math.random() * 800); // Random price between $150-$950
        
        const product: Product = {
          id: generateId('cpu', index),
          name: name,
          description: `${cpu.brand || 'Intel'} Processor - ${cores} Cores${cpu.base_clock ? `, ${cpu.base_clock} Base Clock` : ''}`,
          price: price,
          originalPrice: price + Math.floor(Math.random() * 100),
          image: 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
          category: 'Processors',
          stock: Math.floor(Math.random() * 30) + 5,
          rating: 4.2 + Math.random() * 0.8,
          reviews: Math.floor(Math.random() * 300) + 30,
          featured: Math.random() > 0.8,
          tags: ['CPU', 'Processor', cpu.brand || 'Intel'],
          specifications: {
            'Cores': cores.toString(),
            'Threads': cpu.threads || (cores * 2).toString(),
            'Base Clock': cpu.base_clock || '3.0 GHz',
            'Brand': cpu.brand || 'Intel',
            'Socket': cpu.socket || 'LGA1700'
          }
        };
        
        cpuProducts.push(product);
      }
    });
    
    console.log(`Fetched ${cpuProducts.length} CPU products`);
    return cpuProducts;
  } catch (error) {
    console.error('Failed to fetch CPU data:', error);
    return generateFallbackCPUs();
  }
};

// Fallback GPU data
const generateFallbackGPUs = (): Product[] => {
  const gpuModels = [
    'NVIDIA GeForce RTX 4090', 'NVIDIA GeForce RTX 4080', 'NVIDIA GeForce RTX 4070 Ti',
    'NVIDIA GeForce RTX 4070', 'NVIDIA GeForce RTX 4060 Ti', 'AMD Radeon RX 7900 XTX',
    'AMD Radeon RX 7900 XT', 'AMD Radeon RX 7800 XT', 'AMD Radeon RX 7700 XT'
  ];
  
  return gpuModels.map((name, index) => ({
    id: generateId('gpu-fallback', index),
    name,
    description: `High-performance graphics card for gaming and content creation`,
    price: 400 + Math.floor(Math.random() * 1200),
    originalPrice: 500 + Math.floor(Math.random() * 1300),
    image: 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
    category: 'Graphics Cards',
    stock: Math.floor(Math.random() * 20) + 5,
    rating: 4.0 + Math.random() * 1.0,
    reviews: Math.floor(Math.random() * 500) + 50,
    featured: Math.random() > 0.7,
    tags: ['GPU', 'Gaming', name.includes('NVIDIA') ? 'NVIDIA' : 'AMD'],
    specifications: {
      'Memory Size': `${8 + Math.floor(Math.random() * 16)}GB`,
      'Memory Type': 'GDDR6X',
      'Brand': name.includes('NVIDIA') ? 'NVIDIA' : 'AMD'
    }
  }));
};

// Fallback CPU data
const generateFallbackCPUs = (): Product[] => {
  const cpuModels = [
    'Intel Core i9-13900K', 'Intel Core i7-13700K', 'Intel Core i5-13600K',
    'AMD Ryzen 9 7900X', 'AMD Ryzen 7 7700X', 'AMD Ryzen 5 7600X',
    'Intel Core i9-12900K', 'AMD Ryzen 9 5900X'
  ];
  
  return cpuModels.map((name, index) => ({
    id: generateId('cpu-fallback', index),
    name,
    description: `High-performance processor for gaming and productivity`,
    price: 200 + Math.floor(Math.random() * 600),
    originalPrice: 250 + Math.floor(Math.random() * 650),
    image: 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
    category: 'Processors',
    stock: Math.floor(Math.random() * 25) + 5,
    rating: 4.3 + Math.random() * 0.7,
    reviews: Math.floor(Math.random() * 400) + 40,
    featured: Math.random() > 0.8,
    tags: ['CPU', 'Processor', name.includes('Intel') ? 'Intel' : 'AMD'],
    specifications: {
      'Cores': `${6 + Math.floor(Math.random() * 10)}`,
      'Base Clock': `${3.0 + Math.random() * 2.0}GHz`,
      'Brand': name.includes('Intel') ? 'Intel' : 'AMD'
    }
  }));
};

// Generate other component categories
const generateOtherComponents = (): Product[] => {
  const components = [
    // RAM
    ...['Corsair Vengeance LPX 16GB DDR4', 'G.Skill Trident Z RGB 32GB DDR4', 'Kingston Fury Beast 16GB DDR5'].map((name, index) => ({
      id: generateId('ram', index),
      name,
      description: 'High-speed memory for gaming and productivity',
      price: 80 + Math.floor(Math.random() * 200),
      originalPrice: 100 + Math.floor(Math.random() * 220),
      image: 'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
      category: 'Memory (RAM)',
      stock: Math.floor(Math.random() * 40) + 10,
      rating: 4.4 + Math.random() * 0.6,
      reviews: Math.floor(Math.random() * 200) + 50,
      featured: Math.random() > 0.8,
      tags: ['RAM', 'Memory', 'DDR4'],
      specifications: {
        'Capacity': name.includes('32GB') ? '32GB' : '16GB',
        'Type': name.includes('DDR5') ? 'DDR5' : 'DDR4',
        'Speed': name.includes('DDR5') ? '5600MHz' : '3200MHz'
      }
    })),
    
    // Motherboards
    ...['ASUS ROG Strix Z790-E', 'MSI MPG X670E Carbon', 'Gigabyte Z690 Aorus Master'].map((name, index) => ({
      id: generateId('motherboard', index),
      name,
      description: 'High-end motherboard with advanced features',
      price: 200 + Math.floor(Math.random() * 400),
      originalPrice: 250 + Math.floor(Math.random() * 450),
      image: 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
      category: 'Motherboards',
      stock: Math.floor(Math.random() * 20) + 5,
      rating: 4.2 + Math.random() * 0.8,
      reviews: Math.floor(Math.random() * 150) + 30,
      featured: Math.random() > 0.7,
      tags: ['Motherboard', 'Gaming', name.split(' ')[0]],
      specifications: {
        'Socket': name.includes('Z790') || name.includes('Z690') ? 'LGA1700' : 'AM5',
        'Form Factor': 'ATX',
        'Memory Support': 'DDR5'
      }
    })),
    
    // Storage
    ...['Samsung 980 PRO 1TB NVMe', 'WD Black SN850X 2TB', 'Crucial MX4 1TB SATA SSD'].map((name, index) => ({
      id: generateId('storage', index),
      name,
      description: 'High-speed storage solution',
      price: 80 + Math.floor(Math.random() * 250),
      originalPrice: 100 + Math.floor(Math.random() * 280),
      image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
      category: 'Storage',
      stock: Math.floor(Math.random() * 50) + 10,
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 300) + 100,
      featured: Math.random() > 0.8,
      tags: ['SSD', 'Storage', name.includes('NVMe') ? 'NVMe' : 'SATA'],
      specifications: {
        'Capacity': name.includes('2TB') ? '2TB' : '1TB',
        'Interface': name.includes('NVMe') ? 'PCIe 4.0' : 'SATA III',
        'Form Factor': name.includes('NVMe') ? 'M.2 2280' : '2.5"'
      }
    })),
    
    // Power Supplies
    ...['Corsair RM850x 850W 80+ Gold', 'EVGA SuperNOVA 750W 80+ Platinum', 'Seasonic Focus GX-650 650W'].map((name, index) => ({
      id: generateId('psu', index),
      name,
      description: 'Reliable power supply with high efficiency',
      price: 100 + Math.floor(Math.random() * 200),
      originalPrice: 120 + Math.floor(Math.random() * 220),
      image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
      category: 'Power Supplies',
      stock: Math.floor(Math.random() * 30) + 8,
      rating: 4.6 + Math.random() * 0.4,
      reviews: Math.floor(Math.random() * 250) + 75,
      featured: Math.random() > 0.8,
      tags: ['PSU', 'Power Supply', 'Modular'],
      specifications: {
        'Wattage': name.includes('850W') ? '850W' : name.includes('750W') ? '750W' : '650W',
        'Efficiency': name.includes('Platinum') ? '80+ Platinum' : '80+ Gold',
        'Modular': 'Full Modular'
      }
    })),
    
    // Peripherals
    ...['Razer DeathAdder V3 Gaming Mouse', 'Corsair K95 RGB Platinum Keyboard', 'SteelSeries Arctis 7 Headset'].map((name, index) => ({
      id: generateId('peripherals', index),
      name,
      description: 'Premium gaming peripheral',
      price: 50 + Math.floor(Math.random() * 200),
      originalPrice: 70 + Math.floor(Math.random() * 220),
      image: 'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
      category: 'Peripherals',
      stock: Math.floor(Math.random() * 60) + 15,
      rating: 4.3 + Math.random() * 0.7,
      reviews: Math.floor(Math.random() * 400) + 100,
      featured: Math.random() > 0.8,
      tags: ['Gaming', 'Peripheral', name.includes('Mouse') ? 'Mouse' : name.includes('Keyboard') ? 'Keyboard' : 'Headset'],
      specifications: {
        'Brand': name.split(' ')[0],
        'Type': name.includes('Mouse') ? 'Gaming Mouse' : name.includes('Keyboard') ? 'Mechanical Keyboard' : 'Gaming Headset'
      }
    })),
    
    // Monitors
    ...['ASUS ROG Swift PG279QM 27"', 'LG UltraGear 34GN850-B 34"', 'Samsung Odyssey G7 32"'].map((name, index) => ({
      id: generateId('monitors', index),
      name,
      description: 'High-performance gaming monitor',
      price: 250 + Math.floor(Math.random() * 800),
      originalPrice: 300 + Math.floor(Math.random() * 900),
      image: 'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
      category: 'Monitors',
      stock: Math.floor(Math.random() * 25) + 5,
      rating: 4.4 + Math.random() * 0.6,
      reviews: Math.floor(Math.random() * 300) + 75,
      featured: Math.random() > 0.7,
      tags: ['Monitor', 'Gaming', 'Display'],
      specifications: {
        'Size': name.includes('27"') ? '27"' : name.includes('34"') ? '34"' : '32"',
        'Resolution': name.includes('34"') ? '3440x1440' : '2560x1440',
        'Refresh Rate': '144Hz',
        'Panel Type': 'IPS'
      }
    }))
  ];
  
  return components;
};

// Main function to fetch all PC parts
export const fetchAllPCPartsData = async (): Promise<Product[]> => {
  console.log('Starting to fetch PC parts data from APIs...');
  
  try {
    // Fetch data from APIs with timeout
    const [gpuData, cpuData] = await Promise.allSettled([
      fetchGPUData(),
      fetchCPUData()
    ]);
    
    const allProducts: Product[] = [];
    
    // Add GPU data
    if (gpuData.status === 'fulfilled') {
      allProducts.push(...gpuData.value);
    }
    
    // Add CPU data
    if (cpuData.status === 'fulfilled') {
      allProducts.push(...cpuData.value);
    }
    
    // Add other components
    allProducts.push(...generateOtherComponents());
    
    console.log(`Successfully loaded ${allProducts.length} total products from APIs`);
    return allProducts;
    
  } catch (error) {
    console.error('Failed to fetch data from APIs, using fallback data:', error);
    
    // Return fallback data
    return [
      ...generateFallbackGPUs(),
      ...generateFallbackCPUs(),
      ...generateOtherComponents()
    ];
  }
};
