'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Award, Shield } from 'lucide-react';

export const Hero: React.FC = () => {
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
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/products"
                className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-center flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Shop Components
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/categories"
                className="group border-2 border-white/30 backdrop-blur-sm bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 text-center flex items-center justify-center"
              >
                Browse Categories
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          <div className="animate-slide-right">
            <div className="relative">
              {/* Main PC Setup Image */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=700&h=500&fit=crop"
                  alt="High-end Gaming PC Setup"
                  className="rounded-2xl shadow-3xl transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm text-purple-800 px-6 py-4 rounded-xl font-bold shadow-2xl animate-float">
                <div className="text-2xl font-bold">50%</div>
                <div className="text-sm">OFF RTX Series</div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-2xl animate-float-delay">
                <div className="text-sm">✓ Free Shipping</div>
                <div className="text-sm">✓ 24h Support</div>
              </div>
              
              <div className="absolute top-1/2 -right-8 bg-yellow-400 text-purple-900 px-4 py-3 rounded-full font-bold shadow-xl animate-pulse">
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