'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    name: 'Graphics Cards',
    image: 'https://c1.neweggimages.com/productimage/nb1280/14-930-136-01.jpg',
    href: '/products?category=Graphics+Cards',
    description: 'High-performance GPUs for gaming'
  },
  {
    name: 'Processors',
    image: 'https://c1.neweggimages.com/productimage/nb1280/19-113-877-01.png',
    href: '/products?category=Processors',
    description: 'Powerful CPUs for every build'
  },
  {
    name: 'Memory (RAM)',
    image: 'https://c1.neweggimages.com/productimage/nb1280/20-236-828-V01.jpg',
    href: '/products?category=Memory+(RAM)',
    description: 'Fast DDR4 & DDR5 memory kits'
  },
  {
    name: 'Motherboards',
    image: 'https://c1.neweggimages.com/productimage/nb1280/13-145-517-03.jpg',
    href: '/products?category=Motherboards',
    description: 'Premium gaming motherboards'
  },
  {
    name: 'Storage',
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/20-140-054-02.png',
    href: '/products?category=Storage',
    description: 'SSDs and NVMe drives'
  },
  {
    name: 'Power Supplies',
    image: 'https://c1.neweggimages.com/ProductImageCompressAll1280/17-139-320-07.jpg',
    href: '/products?category=Power+Supplies',
    description: 'Reliable and efficient PSUs'
  },
  {
    name: 'Peripherals',
    image: 'https://c1.neweggimages.com/productimage/nb1280/26-197-658-01.png',
    href: '/products?category=Peripherals',
    description: 'Gaming keyboards, mice & accessories'
  },
  {
    name: 'Monitors',
    image: 'https://c1.neweggimages.com/productimage/nb1280/24-281-243-19.png',
    href: '/products?category=Monitors',
    description: 'High-refresh gaming monitors'
  }
];

export const CategoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}; 