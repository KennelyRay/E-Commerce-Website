'use client';

import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon, Globe,
  Sparkles, Crown, Star, ChevronDown, Target, Rocket, Activity,
  Package, Settings, Eye, ArrowRight, TrendingUp, BarChart3, Shield,
  Award, User, Heart, Zap, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone Support',
    content: '+63 998 427 6714',
    description: 'Mon-Fri 9AM-7PM PST',
    color: 'from-blue-500 to-indigo-600',
    highlight: 'Direct Line'
  },
  {
    icon: Mail,
    title: 'Email Support',
    content: 'support@vertixhub.com',
    description: '24/7 Response Time',
    color: 'from-green-500 to-emerald-600',
    highlight: 'Priority Support'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    content: 'Available Now',
    description: 'Instant technical help',
    color: 'from-purple-500 to-pink-600',
    highlight: 'Real-time'
  },
  {
    icon: MapPin,
    title: 'Main Office',
    content: '#5943 Purok 2 Irisan',
    description: 'Baguio City, Philippines',
    color: 'from-red-500 to-rose-600',
    highlight: 'Visit Us'
  }
];

const categories = [
  { value: 'general', label: 'General Inquiry', icon: Package },
  { value: 'support', label: 'Technical Support', icon: Settings },
  { value: 'sales', label: 'Sales Question', icon: TrendingUp },
  { value: 'warranty', label: 'Warranty Claim', icon: Shield },
  { value: 'partnership', label: 'Partnership', icon: Award }
];

const features = [
  {
    icon: CheckCircle,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your needs'
  },
  {
    icon: Rocket,
    title: 'Fast Response',
    description: 'Average response time under 2 hours'
  },
  {
    icon: Crown,
    title: 'Expert Team',
    description: 'Certified technicians and product specialists'
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'Dedicated account managers for premium customers'
  }
];

const faqs = [
  {
    question: "What's your return policy?",
    answer: "We offer a 30-day return policy for all unopened items in original packaging with full warranty coverage."
  },
  {
    question: "Do you offer PC building services?",
    answer: "Yes! We provide professional PC assembly services with a 1-year warranty and performance guarantee."
  },
  {
    question: "How long is shipping?",
    answer: "Standard shipping takes 3-5 business days nationwide. Express options available for urgent orders."
  },
  {
    question: "Do you price match?",
    answer: "Yes, we match prices from authorized retailers on identical products with our price guarantee."
  },
  {
    question: "What about international shipping?",
    answer: "We currently ship within the Philippines. International shipping coming soon for select regions."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

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
          {[...Array(15)].map((_, i) => (
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
              <MessageCircle className="w-5 h-5 mr-2" />
              24/7 Support
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6">
              <span className="block">Get In</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Touch
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
              Have questions? Need technical support? We're here to help you build your 
              <span className="text-yellow-400 font-semibold"> dream PC </span> 
              with our legendary customer service.
            </p>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { number: "<2hrs", label: "Avg Response", icon: Clock },
                { number: "24/7", label: "Support Available", icon: HeadphonesIcon },
                { number: "99.9%", label: "Satisfaction Rate", icon: Star },
                { number: "50K+", label: "Happy Customers", icon: Heart }
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
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

      {/* Enhanced Contact Info Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-8">
              <Phone className="w-5 h-5 mr-2" />
              Contact Channels
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your preferred communication method and get legendary support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={info.title}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 p-8 border border-gray-100 hover:border-purple-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {info.highlight}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">{info.title}</h3>
                  <p className="text-purple-600 font-bold mb-2">{info.content}</p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form */}
            <div className="animate-slide-in-left">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-600 text-sm font-bold mb-6">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-4">Let's Start a Conversation</h2>
                  <p className="text-gray-600">Tell us how we can help you build something legendary</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value} className="text-gray-900">
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none text-gray-900 bg-gray-50 focus:bg-white"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                  >
                    <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Legendary Message
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </form>
              </div>
            </div>

            {/* Enhanced Additional Info */}
            <div className="animate-slide-in-right space-y-8">
              {/* Enhanced FAQ Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-bold mb-6">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    FAQ
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">Quick Answers</h3>
                </div>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-gradient-to-r from-purple-50 to-transparent rounded-r-xl">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Business Hours */}
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mr-4">
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">Business Hours</h3>
                    <p className="text-purple-200">When our legends are available</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { days: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
                    { days: 'Saturday', hours: '10:00 AM - 6:00 PM' },
                    { days: 'Sunday', hours: '12:00 PM - 5:00 PM' }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <span className="font-bold">{schedule.days}</span>
                      <span className="text-yellow-400 font-bold">{schedule.hours}</span>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-purple-200 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      All times are Pacific Standard Time (PST)
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Emergency Support */}
              <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                    <HeadphonesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Priority Support</h3>
                    <p className="text-red-100">For enterprise customers</p>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed">
                  For urgent technical issues affecting business operations and enterprise clients:
                </p>
                <div className="bg-white/20 rounded-2xl p-4 mb-4">
                  <p className="text-2xl font-black">+63 998 427 6714</p>
                  <p className="text-sm text-red-100">Press 1 for Priority Support</p>
                </div>
                <p className="text-sm text-red-100">Available 24/7 for enterprise customers and critical issues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold mb-8">
            <Rocket className="w-5 h-5 mr-2" />
            Ready to Build?
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Let's Create Your
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Digital Legend
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Whether you're building your first PC or upgrading to legendary status, we're here to help every step of the way
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/25">
              <span className="relative z-10 flex items-center">
                <Package className="w-6 h-6 mr-3" />
                Explore Products
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            <button className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
              <span className="flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                PC Builder Tool
              </span>
            </button>
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