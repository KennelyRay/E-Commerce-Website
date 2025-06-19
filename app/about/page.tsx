'use client';

import React from 'react';
import { Shield, Award, Users, Clock, Cpu, Heart, Globe, Truck, User } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentic Products',
    description: 'All our products are 100% authentic with manufacturer warranties'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Curated selection of the highest quality PC components'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and customer service'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $100 with express delivery options'
  }
];

const team = [
  {
    name: 'Josh Rabino',
    role: 'Founder & CEO',
    description: 'Visionary leader driving innovation in PC hardware industry',
    gender: 'male'
  },
  {
    name: 'Roland Gumabay Morzo Ampalo',
    role: 'Chief Operating Officer',
    description: 'Expert in operations management and business strategy',
    gender: 'male'
  },
  {
    name: 'Patrick Herbolario',
    role: 'Technical/Network Director',
    description: 'Leading technical infrastructure and network solutions',
    gender: 'male'
  },
  {
    name: 'Jan Michael Villanueva',
    role: 'Chief of Cybersecurity',
    description: 'Protecting our systems and customer data with expertise',
    gender: 'male'
  },
  {
    name: 'Jermin Odcheo',
    role: 'Head Hardware Engineer/Builder',
    description: 'Master PC builder and hardware optimization specialist',
    gender: 'male'
  },
  {
    name: 'Lan Emilano',
    role: 'Hardware Engineer/Builder',
    description: 'Expert in PC assembly and hardware compatibility',
    gender: 'male'
  },
  {
    name: 'Trisha Antonio',
    role: 'Lead Marketing/CS Director',
    description: 'Driving customer success and marketing excellence',
    gender: 'female'
  },
  {
    name: 'Daniel Chuyat',
    role: 'Head of Security',
    description: 'Ensuring comprehensive security across all operations',
    gender: 'male'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              About VertixHub
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in-delay">
              Your trusted partner in building the ultimate PC experience
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 2020 by passionate PC enthusiasts, VertixHub began as a small startup with a big vision: 
                  to make high-performance PC components accessible to everyone, from first-time builders to seasoned professionals.
                </p>
                <p>
                  What started as a garage operation has grown into a trusted name in the PC hardware industry, 
                  serving thousands of customers worldwide with premium components from the most respected brands.
                </p>
                <p>
                  Our commitment to quality, authenticity, and customer satisfaction has been the driving force 
                  behind our growth, and we continue to evolve with the rapidly changing technology landscape.
                </p>
              </div>
            </div>
            <div className="animate-slide-right">
              <div className="relative">
                <img
                  src="https://imgs.search.brave.com/Ktbqk9txGX7JwXhVNns46-NRiNXUZMz0CxgURnJoP4E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eGlkYXguY29tL21v/ZHVsZXMvcGFnZXMv/dmlld3MvdGVtcGxh/dGVzL2Zyb250L3hp/ZGF4L2ltZy9wb3J0/Zm9saW8vcGMxMi53/ZWJw"
                  alt="PC Building"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Why Choose VertixHub?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
              We're more than just a hardware store - we're your partners in building something amazing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-primary rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
              Passionate experts dedicated to helping you build your dream PC
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-lg p-8 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-6">
                  <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    member.gender === 'female' 
                      ? 'bg-gradient-to-br from-pink-400 to-purple-500' 
                      : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 rounded-full p-6">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Our Mission</h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed animate-fade-in-delay">
              To empower creators, gamers, and professionals with the highest quality PC components, 
              expert guidance, and exceptional service that transforms their vision into reality.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center animate-fade-in-delay">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="text-center animate-fade-in-delay-2">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Partner Brands</div>
            </div>
            <div className="text-center animate-fade-in-delay-3">
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }
      `}</style>
    </div>
  );
} 