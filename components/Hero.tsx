'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Award, Shield, ChevronLeft } from 'lucide-react';

const carouselImages = [
  'https://promotions.newegg.com/samsung/25-0299/1150x320.jpg',
  'https://promotions.newegg.com/nvidia/25-0452/1150x320.jpg',
  'https://promotions.newegg.com/samsung/25-0580/1150x320.jpg',
  'https://promotions.newegg.com/server/25-0542/1150x320.jpg',
  'https://promotions.newegg.com/ASRock/24-1088/banner/1920x660_sm.jpg'
];

export const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % carouselImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-violet-800 to-pink-800 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-left">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-purple-200">Rated #1 PC Hardware Store</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Build Your
              <span className="block bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Dream PC
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-purple-100 leading-relaxed">
              Premium PC components from trusted brands. Experience next-generation performance with cutting-edge hardware.
            </p>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-sm text-purple-200">2-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-sm text-purple-200">Expert Support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pc-builder"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <span>Build Your PC</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="animate-slide-right">
            <div className="relative">
              {/* Carousel Container */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-3xl">
                <div className="relative h-80 lg:h-96">
                  {/* Carousel Images */}
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`PC Hardware Promotion ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                    </div>
                  ))}
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 z-30 bg-white/95 backdrop-blur-sm text-purple-800 px-6 py-4 rounded-xl font-bold shadow-2xl animate-float">
                <div className="text-2xl font-bold">50%</div>
                <div className="text-sm">OFF RTX Series</div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 z-30 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-2xl animate-float-delay">
                <div className="text-sm">✓ Free Shipping</div>
                <div className="text-sm">✓ 24h Support</div>
              </div>
              
              <div className="absolute top-1/2 -right-8 z-30 bg-yellow-400 text-purple-900 px-4 py-3 rounded-full font-bold shadow-xl animate-pulse">
                <div className="text-xs">NEW</div>
                <div className="text-sm">RTX 4090</div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl -z-10 scale-110"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-purple-200 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-purple-200 text-sm">PC Components</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-purple-200 text-sm">Top Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-purple-200 text-sm">Expert Support</div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.8s both;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 3s ease-in-out infinite 1.5s;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}; 