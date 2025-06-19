// PC Parts API Service
import { Product } from '@/types';

// Interface for external PC parts APIs
interface PCPartsAPIResponse {
  products?: any[];
  data?: any[];
}

// GPU Info API - Free API for GPU data
export const fetchGPUData = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json');
    const data = await response.json();
    
    const gpuProducts: Product[] = [];
    
    Object.entries(data).forEach(([key, gpu]: [string, any]) => {
      if (gpu.Model && gpu['Release Price (USD)']) {
        const product: Product = {
          id: key,
          name: gpu.Model,
          description: `${gpu.Vendor || 'NVIDIA'} GPU - ${gpu['Memory Size (GB)'] || 'N/A'}GB VRAM, ${gpu.Process || 'N/A'} process`,
          price: parseFloat(gpu['Release Price (USD)'].toString().replace(/[^\d.]/g, '')) || 999,
          originalPrice: gpu['Release Price (USD)'] ? parseFloat(gpu['Release Price (USD)'].toString().replace(/[^\d.]/g, '')) * 1.2 : undefined,
          image: getProductImage('Graphics Cards', gpu.Model),
          category: 'Graphics Cards',
          stock: Math.floor(Math.random() * 50) + 5,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 500) + 50,
          featured: gpu['TDP (Watts)'] && gpu['TDP (Watts)'] > 200,
          tags: [
            gpu.Vendor?.toLowerCase() || 'nvidia',
            'gaming',
            'high-performance',
            gpu['Memory Bus type']?.toLowerCase() || 'gddr6'
          ].filter(Boolean)
        };
        gpuProducts.push(product);
      }
    });
    
    return gpuProducts.slice(0, 20); // Limit to 20 products
  } catch (error) {
    console.error('Error fetching GPU data:', error);
    return [];
  }
};

// Computer Parts API - Free API for various PC components
export const fetchComputerPartsData = async (category: string): Promise<Product[]> => {
  try {
    const categoryMap: { [key: string]: string } = {
      'Processors': 'cpu',
      'Motherboards': 'motherboard',
      'Memory (RAM)': 'memory',
      'Storage': 'storage',
      'Power Supplies': 'powersupply',
      'Cases': 'cases',
      'Peripherals': 'peripherals'
    };
    
    const apiCategory = categoryMap[category];
    if (!apiCategory) return [];
    
    const response = await fetch(`https://comppartsapi.herokuapp.com/computerparts/${apiCategory}`);
    const data = await response.json();
    
    if (!Array.isArray(data)) return [];
    
    const products: Product[] = data.map((item: any, index: number) => ({
      id: `${apiCategory}-${index}`,
      name: item.name || item.title || `${category} Component`,
      description: item.description || item.specifications || `High-quality ${category.toLowerCase()} component`,
      price: item.price ? parseFloat(item.price.toString().replace(/[^\d.]/g, '')) : Math.floor(Math.random() * 500) + 100,
      originalPrice: item.originalPrice ? parseFloat(item.originalPrice.toString().replace(/[^\d.]/g, '')) : undefined,
      image: item.image || getProductImage(category, item.name),
      category,
      stock: item.stock || Math.floor(Math.random() * 30) + 10,
      rating: item.rating || (4 + Math.random()),
      reviews: item.reviews || Math.floor(Math.random() * 300) + 25,
      featured: Math.random() > 0.8,
      tags: [
        item.brand?.toLowerCase(),
        'pc-component',
        category.toLowerCase().replace(/[^a-z]/g, '-')
      ].filter(Boolean)
    }));
    
    return products.slice(0, 15); // Limit results
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
    return [];
  }
};

// PCPartPicker Dataset API - Static dataset from GitHub
export const fetchPCPartPickerData = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json/cpu.json');
    const cpuData = await response.json();
    
    const products: Product[] = cpuData.slice(0, 10).map((cpu: any, index: number) => ({
      id: `pcpp-cpu-${index}`,
      name: cpu.name || `${cpu.manufacturer} ${cpu.model}` || 'CPU',
      description: `${cpu.core_count || 'Multi'}-core processor, ${cpu.base_clock || 'High'} base clock`,
      price: cpu.price ? parseFloat(cpu.price.toString().replace(/[^\d.]/g, '')) : Math.floor(Math.random() * 400) + 150,
      image: getProductImage('Processors', cpu.name),
      category: 'Processors',
      stock: Math.floor(Math.random() * 25) + 5,
      rating: 4.3 + Math.random() * 0.7,
      reviews: Math.floor(Math.random() * 400) + 100,
      featured: cpu.core_count && cpu.core_count >= 8,
      tags: [
        cpu.manufacturer?.toLowerCase() || 'intel',
        'processor',
        'gaming',
        cpu.socket?.toLowerCase()
      ].filter(Boolean)
    }));
    
    return products;
  } catch (error) {
    console.error('Error fetching PCPartPicker data:', error);
    return [];
  }
};

// Helper function to generate product images based on category and name
function getProductImage(category: string, name?: string): string {
  const productName = (name || '').toLowerCase();
  
  // Brand and model-specific image mapping
  if (category === 'Graphics Cards') {
    // NVIDIA RTX Series
    if (productName.includes('rtx 4090') || productName.includes('4090')) {
      return 'https://assets.nvidia.com/en-us/geforce/news/geforce-rtx-40-series/geforce-rtx-4090-product-photo-001.jpg';
    }
    if (productName.includes('rtx 4080') || productName.includes('4080')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4080/geforce-rtx-4080-product-photo-001.jpg';
    }
    if (productName.includes('rtx 4070') || productName.includes('4070')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070/geforce-rtx-4070-product-photo-001.jpg';
    }
    if (productName.includes('rtx 3090') || productName.includes('3090')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-product-photo-001.jpg';
    }
    if (productName.includes('rtx 3080') || productName.includes('3080')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3080/geforce-rtx-3080-product-photo-001.jpg';
    }
    if (productName.includes('rtx 3070') || productName.includes('3070')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3070/geforce-rtx-3070-product-photo-001.jpg';
    }
    if (productName.includes('rtx 3060') || productName.includes('3060')) {
      return 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3060/geforce-rtx-3060-product-photo-001.jpg';
    }
    
    // AMD Radeon Series
    if (productName.includes('rx 7900') || productName.includes('7900')) {
      return 'https://www.amd.com/content/dam/amd/en/products/graphics/radeon/rx-7000/rx-7900-xtx/amd-radeon-rx-7900-xtx-product-photo.jpg';
    }
    if (productName.includes('rx 6800') || productName.includes('6800')) {
      return 'https://www.amd.com/content/dam/amd/en/products/graphics/radeon/rx-6000/amd-radeon-rx-6800-xt-product-photo.jpg';
    }
    if (productName.includes('rx 6700') || productName.includes('6700')) {
      return 'https://www.amd.com/content/dam/amd/en/products/graphics/radeon/rx-6000/amd-radeon-rx-6700-xt-product-photo.jpg';
    }
    
    // Generic GPU images by brand
    if (productName.includes('nvidia') || productName.includes('geforce')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg';
    }
    if (productName.includes('amd') || productName.includes('radeon')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/14-126-544-V01.jpg';
    }
  }
  
  if (category === 'Processors') {
    // Intel CPUs
    if (productName.includes('i9-13900') || productName.includes('13900')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-413-V01.jpg';
    }
    if (productName.includes('i7-13700') || productName.includes('13700')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-414-V01.jpg';
    }
    if (productName.includes('i5-13600') || productName.includes('13600')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-415-V01.jpg';
    }
    if (productName.includes('i9-12900') || productName.includes('12900')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-343-V01.jpg';
    }
    if (productName.includes('i7-12700') || productName.includes('12700')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-357-V01.jpg';
    }
    if (productName.includes('i5-12600') || productName.includes('12600')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-118-358-V01.jpg';
    }
    
    // AMD Ryzen CPUs
    if (productName.includes('ryzen 9 7950') || productName.includes('7950x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-773-V01.jpg';
    }
    if (productName.includes('ryzen 9 7900') || productName.includes('7900x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-774-V01.jpg';
    }
    if (productName.includes('ryzen 7 7700') || productName.includes('7700x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-775-V01.jpg';
    }
    if (productName.includes('ryzen 5 7600') || productName.includes('7600x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-776-V01.jpg';
    }
    if (productName.includes('ryzen 9 5950') || productName.includes('5950x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-663-V01.jpg';
    }
    if (productName.includes('ryzen 7 5800') || productName.includes('5800x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-665-V01.jpg';
    }
    if (productName.includes('ryzen 5 5600') || productName.includes('5600x')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-666-V01.jpg';
    }
    
    // Generic CPU images by brand
    if (productName.includes('intel') || productName.includes('core')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png';
    }
    if (productName.includes('amd') || productName.includes('ryzen')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/19-113-663-V01.jpg';
    }
  }
  
  if (category === 'Motherboards') {
    // Intel motherboards
    if (productName.includes('z790') || productName.includes('lga 1700')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg';
    }
    if (productName.includes('b760') || productName.includes('b660')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-157-1114-V01.jpg';
    }
    
    // AMD motherboards
    if (productName.includes('x670') || productName.includes('am5')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-119-504-V01.jpg';
    }
    if (productName.includes('b650') || productName.includes('x570')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-145-220-V01.jpg';
    }
    
    // Brand-specific fallbacks
    if (productName.includes('asus') || productName.includes('rog')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-119-504-V01.jpg';
    }
    if (productName.includes('msi')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-144-595-V01.jpg';
    }
    if (productName.includes('gigabyte')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg';
    }
  }
  
  if (category === 'Memory (RAM)' || category === 'Memory') {
    // DDR5 RAM
    if (productName.includes('ddr5')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg';
    }
    
    // Brand-specific RAM
    if (productName.includes('corsair')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-233-852-V01.jpg';
    }
    if (productName.includes('g.skill') || productName.includes('trident')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-232-899-V01.jpg';
    }
    if (productName.includes('kingston') || productName.includes('fury')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-104-110-V01.jpg';
    }
    if (productName.includes('crucial')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-156-276-V01.jpg';
    }
  }
  
  if (category === 'Storage') {
    // NVMe SSDs
    if (productName.includes('nvme') || productName.includes('m.2')) {
      return 'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png';
    }
    
    // Brand-specific storage
    if (productName.includes('samsung') || productName.includes('980') || productName.includes('990')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-147-804-V01.jpg';
    }
    if (productName.includes('wd') || productName.includes('western digital')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-250-088-V01.jpg';
    }
    if (productName.includes('crucial') || productName.includes('micron')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/20-156-253-V01.jpg';
    }
    if (productName.includes('seagate')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/22-178-993-V01.jpg';
    }
  }
  
  if (category === 'Power Supplies') {
    // Wattage-based PSUs
    if (productName.includes('1000w') || productName.includes('1200w')) {
      return 'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg';
    }
    if (productName.includes('850w') || productName.includes('750w')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/17-438-030-V01.jpg';
    }
    
    // Brand-specific PSUs
    if (productName.includes('corsair')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/17-139-287-V01.jpg';
    }
    if (productName.includes('evga')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/17-438-030-V01.jpg';
    }
    if (productName.includes('seasonic')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/17-151-233-V01.jpg';
    }
  }
  
  if (category === 'Peripherals') {
    // Gaming peripherals
    if (productName.includes('mouse') || productName.includes('gaming mouse')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png';
    }
    if (productName.includes('keyboard') || productName.includes('mechanical')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/23-816-196-V01.jpg';
    }
    if (productName.includes('headset') || productName.includes('headphones')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/26-138-477-V01.jpg';
    }
    if (productName.includes('webcam') || productName.includes('camera')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/26-197-487-V01.jpg';
    }
  }
  
  if (category === 'Monitors') {
    // Gaming monitors
    if (productName.includes('27') || productName.includes('27"')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png';
    }
    if (productName.includes('32') || productName.includes('32"')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/24-012-042-V01.jpg';
    }
    if (productName.includes('ultrawide') || productName.includes('34"')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/24-025-970-V01.jpg';
    }
    if (productName.includes('4k') || productName.includes('28"')) {
      return 'https://c1.neweggimages.com/productimage/nb1280/24-160-441-V01.jpg';
    }
  }
  
  // Fallback to category-specific default images
  const imageMap: { [key: string]: string[] } = {
    'Graphics Cards': [
      'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/14-126-544-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/14-932-505-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/14-137-677-V01.jpg'
    ],
    'Processors': [
      'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
      'https://c1.neweggimages.com/productimage/nb1280/19-118-343-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/19-113-663-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/19-113-666-V01.jpg'
    ],
    'Motherboards': [
      'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/13-157-1114-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/13-119-504-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/13-144-595-V01.jpg'
    ],
    'Memory (RAM)': [
      'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-232-899-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-331-058-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-233-852-V01.jpg'
    ],
    'Memory': [
      'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-232-899-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-331-058-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-233-852-V01.jpg'
    ],
    'Storage': [
      'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
      'https://c1.neweggimages.com/productimage/nb1280/20-250-088-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-147-804-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-156-253-V01.jpg'
    ],
    'Power Supplies': [
      'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/17-438-030-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/17-139-287-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/17-151-233-V01.jpg'
    ],
    'Peripherals': [
      'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
      'https://c1.neweggimages.com/productimage/nb1280/23-816-196-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/26-197-487-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/26-138-477-V01.jpg'
    ],
    'Monitors': [
      'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
      'https://c1.neweggimages.com/productimage/nb1280/24-012-042-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/24-025-970-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/24-160-441-V01.jpg'
    ]
  };
  
  const images = imageMap[category] || imageMap['Graphics Cards'];
  return images[Math.floor(Math.random() * images.length)];
}

// Main function to fetch all PC parts data
export const fetchAllPCPartsData = async (): Promise<Product[]> => {
  try {
    const [gpuData, cpuData] = await Promise.all([
      fetchGPUData(),
      fetchPCPartPickerData()
    ]);
    
    // Fetch data for other categories
    const categories = ['Motherboards', 'Memory (RAM)', 'Storage', 'Power Supplies', 'Peripherals'];
    const categoryPromises = categories.map(category => fetchComputerPartsData(category));
    const categoryData = await Promise.all(categoryPromises);
    
    // Combine all data
    const allProducts = [
      ...gpuData,
      ...cpuData,
      ...categoryData.flat()
    ];
    
    return allProducts;
  } catch (error) {
    console.error('Error fetching PC parts data:', error);
    return [];
  }
};

// Function to fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  switch (category) {
    case 'Graphics Cards':
      return fetchGPUData();
    case 'Processors':
      return fetchPCPartPickerData();
    default:
      return fetchComputerPartsData(category);
  }
}; 