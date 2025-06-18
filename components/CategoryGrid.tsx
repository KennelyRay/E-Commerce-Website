'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  {
    name: 'Graphics Cards',
    image: 'https://image.pollinations.ai/prompt/modern-rtx-graphics-card-rgb-lighting-gaming-setup-4k-realistic?width=300&height=200',
    href: '/products?category=Graphics+Cards',
    description: 'High-performance GPUs for gaming'
  },
  {
    name: 'Processors',
    image: 'https://image.pollinations.ai/prompt/modern-cpu-processor-chip-intel-amd-technology-closeup-4k?width=300&height=200',
    href: '/products?category=Processors',
    description: 'Powerful CPUs for every build'
  },
  {
    name: 'Memory (RAM)',
    image: 'https://image.pollinations.ai/prompt/ddr5-ram-memory-modules-rgb-lighting-gaming-performance-4k?width=300&height=200',
    href: '/products?category=Memory+(RAM)',
    description: 'Fast DDR4 & DDR5 memory kits'
  },
  {
    name: 'Motherboards',
    image: 'https://image.pollinations.ai/prompt/gaming-motherboard-circuit-board-rgb-connectors-modern-tech-4k?width=300&height=200',
    href: '/products?category=Motherboards',
    description: 'Premium gaming motherboards'
  },
  {
    name: 'Storage',
    image: 'https://image.pollinations.ai/prompt/nvme-ssd-drive-m2-storage-modern-technology-4k-realistic?width=300&height=200',
    href: '/products?category=Storage',
    description: 'SSDs and NVMe drives'
  },
  {
    name: 'Power Supplies',
    image: 'https://image.pollinations.ai/prompt/modular-power-supply-psu-80plus-cables-modern-design-4k?width=300&height=200',
    href: '/products?category=Power+Supplies',
    description: 'Reliable and efficient PSUs'
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