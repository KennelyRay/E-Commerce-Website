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
  const imageMap: { [key: string]: string[] } = {
    'Graphics Cards': [
      'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/14-126-544-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/14-932-505-V01.jpg'
    ],
    'Processors': [
      'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
      'https://c1.neweggimages.com/productimage/nb1280/19-118-343-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/19-113-663-V01.jpg'
    ],
    'Motherboards': [
      'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/13-157-1114-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/13-119-504-V01.jpg'
    ],
    'Memory (RAM)': [
      'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-232-899-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-331-058-V01.jpg'
    ],
    'Storage': [
      'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
      'https://c1.neweggimages.com/productimage/nb1280/20-250-088-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/20-147-804-V01.jpg'
    ],
    'Power Supplies': [
      'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/17-438-030-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/17-139-287-V01.jpg'
    ],
    'Peripherals': [
      'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
      'https://c1.neweggimages.com/productimage/nb1280/23-816-196-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/26-197-487-V01.jpg'
    ],
    'Monitors': [
      'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
      'https://c1.neweggimages.com/productimage/nb1280/24-012-042-V01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/24-025-970-V01.jpg'
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