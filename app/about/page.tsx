'use client';

import React from 'react';
import { 
  Shield, Award, Users, Clock, Cpu, Heart, Globe, Truck, User, 
  Sparkles, Crown, Star, ChevronDown, Target, Rocket, Activity,
  Package, Settings, Eye, ArrowRight, TrendingUp, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentic Products',
    description: 'All our products are 100% authentic with manufacturer warranties and legendary quality assurance',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Curated selection of the highest quality PC components from trusted industry leaders',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and customer service from our legendary team',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over ₱2,500 with express delivery options nationwide',
    color: 'from-orange-500 to-red-600'
  }
];

const team = [
  {
    name: 'Josh Rabino',
    role: 'Founder & CEO',
    description: 'Visionary leader driving innovation in PC hardware industry with legendary expertise',
    gender: 'male',
    expertise: 'Strategy & Innovation'
  },
  {
    name: 'Roland Gumabay Morzo Ampalo',
    role: 'Chief Operating Officer',
    description: 'Expert in operations management and business strategy with unmatched efficiency',
    gender: 'male',
    expertise: 'Operations & Management'
  },
  {
    name: 'Patrick Herbolario',
    role: 'Technical/Network Director',
    description: 'Leading technical infrastructure and network solutions for legendary performance',
    gender: 'male',
    expertise: 'Network & Infrastructure'
  },
  {
    name: 'Jan Michael Villanueva',
    role: 'Chief of Cybersecurity',
    description: 'Protecting our systems and customer data with cutting-edge security expertise',
    gender: 'male',
    expertise: 'Security & Protection'
  },
  {
    name: 'Jermin Odcheo',
    role: 'Head Hardware Engineer/Builder',
    description: 'Master PC builder and hardware optimization specialist creating legendary builds',
    gender: 'male',
    expertise: 'Hardware Engineering'
  },
  {
    name: 'Lan Emilano',
    role: 'Hardware Engineer/Builder',
    description: 'Expert in PC assembly and hardware compatibility with precision craftsmanship',
    gender: 'male',
    expertise: 'Assembly & Testing'
  },
  {
    name: 'Trisha Antonio',
    role: 'Lead Marketing/CS Director',
    description: 'Driving customer success and marketing excellence with legendary dedication',
    gender: 'female',
    expertise: 'Marketing & Customer Success'
  },
  {
    name: 'Daniel Chuyat',
    role: 'Head of Security',
    description: 'Ensuring comprehensive security across all operations with advanced protocols',
    gender: 'male',
    expertise: 'Security Operations'
  }
];

const achievements = [
  { number: "50,000+", label: "Legends Built", icon: Crown },
  { number: "99.9%", label: "Customer Satisfaction", icon: Star },
  { number: "24/7", label: "Premium Support", icon: Shield },
  { number: "500+", label: "Elite Products", icon: Award }
];

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We pursue perfection in every component and service we provide',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Our love for technology drives us to deliver legendary experiences',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Building lasting relationships through reliability and transparency',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'Constantly evolving to bring you the latest and greatest technology',
    color: 'from-purple-500 to-pink-600'
  }
];

export default function AboutPage() {
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
              <Users className="w-5 h-5 mr-2" />
              Our Legend
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6">
              <span className="block">About</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                VertixHub
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Your trusted partner in building 
              <span className="text-yellow-400 font-semibold"> legendary PC experiences</span>. 
              Founded by passionate enthusiasts, crafted for 
              <span className="text-pink-400 font-semibold"> ultimate performance</span>.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{achievement.number}</div>
                  <div className="text-sm text-gray-400 font-medium">{achievement.label}</div>
                </div>
              ))}
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

      {/* Enhanced Story Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-8">
                <Rocket className="w-5 h-5 mr-2" />
                Our Journey
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
                Building Legends
                <span className="block text-purple-600">Since 2020</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020 by passionate PC enthusiasts, <span className="font-bold text-purple-600">VertixHub</span> began as a small startup with a big vision: 
                  to make high-performance PC components accessible to everyone, from first-time builders to seasoned professionals.
                </p>
                <p>
                  What started as a garage operation has grown into a <span className="font-bold text-purple-600">trusted name</span> in the PC hardware industry, 
                  serving thousands of customers worldwide with premium components from the most respected brands.
                </p>
                <p>
                  Our commitment to <span className="font-bold text-purple-600">quality, authenticity, and customer satisfaction</span> has been the driving force 
                  behind our growth, and we continue to evolve with the rapidly changing technology landscape.
                </p>
              </div>

              <div className="mt-8 flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">4+</div>
                  <div className="text-sm text-gray-500 font-medium">Years Strong</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">50K+</div>
                  <div className="text-sm text-gray-500 font-medium">Builds Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">500+</div>
                  <div className="text-sm text-gray-500 font-medium">Products</div>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25"></div>
                <img
                  src="https://imgs.search.brave.com/Ktbqk9txGX7JwXhVNns46-NRiNXUZMz0CxgURnJoP4E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/eGlkYXguY29tL21v/ZHVsZXMvcGFnZXMv/dmlld3MvdGVtcGxh/dGVzL2Zyb250L3hp/ZGF4L2ltZy9wb3J0/Zm9saW8vcGMxMi53/ZWJw"
                  alt="PC Building Excellence"
                  className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-3xl"></div>
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Premium Quality</div>
                      <div className="text-sm text-gray-500">Certified Excellence</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">4.9★ Rating</div>
                      <div className="text-sm text-gray-500">Customer Loved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-8">
              <Target className="w-5 h-5 mr-2" />
              Our Values
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The core principles that guide our mission to deliver legendary PC building experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 p-8 border border-gray-100 hover:border-purple-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-8">
              <Shield className="w-5 h-5 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">Legendary Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're more than just a hardware store - we're your partners in building something amazing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 p-8 border border-gray-100 hover:border-purple-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-8">
              <Users className="w-5 h-5 mr-2" />
              Our Legends
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">Meet the Masters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Passionate experts dedicated to helping you build your dream PC with legendary expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 p-8 border border-gray-100 hover:border-purple-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    member.gender === 'female' 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">{member.name}</h3>
                <p className="text-purple-600 font-bold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-purple-700">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
            <Heart className="w-5 h-5 mr-2" />
            Our Mission
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Empowering
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Digital Legends
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            To empower creators, gamers, and professionals with the highest quality PC components, 
            expert guidance, and exceptional service that transforms their vision into reality.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Target, title: "Precision", desc: "Every component carefully selected" },
              { icon: Heart, title: "Passion", desc: "Driven by love for technology" },
              { icon: Crown, title: "Excellence", desc: "Delivering legendary experiences" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to Build Your Legend?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust VertixHub for their PC building journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Package className="w-6 h-6 mr-2" />
                Explore Products
                <ArrowRight className="w-6 h-6 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
                <Users className="w-6 h-6 mr-2" />
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

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
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
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
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
      `}</style>
    </div>
  );
} 