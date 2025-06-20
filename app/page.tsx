'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Monitor, Cpu, HardDrive, User, Lock, Mail, Sparkles, Crown, 
  Star, Shield, Award, Rocket, Heart, Package, Eye, EyeOff,
  ArrowRight, CheckCircle, TrendingUp, Activity, Zap
} from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { user, login, register } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      const success = await login(formData.username, formData.password);
      if (success) {
        // Redirect will be handled by the useEffect above
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setIsLoading(false);
        return;
      }
      const success = await register(formData.name, formData.username, formData.email, formData.password);
      if (success) {
        // Redirect will be handled by the useEffect above
      }
    }
    setIsLoading(false);
  };

  const features = [
    {
      icon: Monitor,
      title: 'High-Performance Graphics',
      description: 'Latest RTX 4090 and Radeon RX 7900 XTX cards for legendary gaming'
    },
    {
      icon: Cpu,
      title: 'Cutting-Edge Processors',
      description: 'Intel 13th Gen and AMD Ryzen 7000 series for ultimate performance'
    },
    {
      icon: HardDrive,
      title: 'Ultra-Fast Storage',
      description: 'NVMe Gen4 SSDs with speeds up to 7,000 MB/s'
    },
    {
      icon: Zap,
      title: 'Premium Memory',
      description: 'DDR5 RAM with RGB lighting and legendary speeds'
    }
  ];

  const stats = [
    { number: "50K+", label: "Builds Created", icon: Crown },
    { number: "99.9%", label: "Customer Satisfaction", icon: Star },
    { number: "24/7", label: "Expert Support", icon: Shield },
    { number: "500+", label: "Premium Components", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden relative">
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

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Branding Side */}
          <div className="text-white lg:pr-8 animate-slide-in-left">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-3xl">V</span>
              </div>
              <div>
                <h1 className="text-5xl font-black">VertixHub</h1>
                <p className="text-purple-300">Legendary PC Components</p>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                Build Your
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Dream PC
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Premium PC components and gaming hardware for enthusiasts and professionals. 
                Join thousands who trust VertixHub for their legendary builds.
              </p>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Login/Register Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-6">
                  <User className="w-5 h-5 mr-2" />
                  {isLogin ? 'Member Access' : 'Join the Legend'}
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back, Legend' : 'Become a Legend'}
                </h3>
                <p className="text-gray-600">
                  {isLogin ? 'Access your legendary PC building journey' : 'Start your journey to legendary PC builds'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-3">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        placeholder="Enter your legendary name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-gray-900 mb-3">
                    Username *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                      placeholder={isLogin ? 'Enter username or "Admin"' : 'Choose your legendary username'}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-3">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                      placeholder="Enter your secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 mb-3">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Shield className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">Admin Access Available</p>
                        <p className="text-xs text-blue-700">
                          Use <span className="font-bold">"Admin"</span> as username and <span className="font-bold">"12345"</span> as password for admin panel
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-black text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isLogin ? <CheckCircle className="w-6 h-6 mr-3" /> : <Rocket className="w-6 h-6 mr-3" />}
                      {isLogin ? 'Access Legendary Hub' : 'Start Legend Journey'}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  {isLogin ? "New to VertixHub? " : "Already a legend? "}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 group"
                >
                  {isLogin ? 'Create New Account' : 'Sign In Instead'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Shield, label: "Secure" },
                    { icon: Heart, label: "Trusted" },
                    { icon: Award, label: "Premium" }
                  ].map((indicator, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-2">
                        <indicator.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{indicator.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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