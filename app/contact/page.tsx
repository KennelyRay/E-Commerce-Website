'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone Support',
    content: '+1 (555) 123-4567',
    description: 'Mon-Fri 9AM-7PM PST',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Mail,
    title: 'Email Support',
    content: 'support@vertixhub.com',
    description: '24/7 Response Time',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    content: 'Available Now',
    description: 'Instant technical help',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: MapPin,
    title: 'Main Office',
    content: '123 Tech Valley Drive',
    description: 'San Francisco, CA 94105',
    color: 'from-red-500 to-rose-600'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in-delay">
            Have questions? Need technical support? We're here to help you build your dream PC
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={info.title}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`bg-gradient-to-r ${info.color} rounded-2xl p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-primary-600 font-medium mb-1">{info.content}</p>
                  <p className="text-gray-500 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-slide-left">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales Question</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none text-gray-900"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-primary text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center group"
                  >
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="animate-slide-right">
              <div className="space-y-8">
                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">What's your return policy?</h4>
                      <p className="text-gray-600 text-sm">We offer a 30-day return policy for all unopened items in original packaging.</p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Do you offer PC building services?</h4>
                      <p className="text-gray-600 text-sm">Yes! We provide professional PC assembly services with a 1-year warranty.</p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">How long is shipping?</h4>
                      <p className="text-gray-600 text-sm">Standard shipping takes 3-5 business days. Express options available.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Do you price match?</h4>
                      <p className="text-gray-600 text-sm">Yes, we match prices from authorized retailers on identical products.</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gradient-primary text-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <Clock className="w-6 h-6 mr-3" />
                    <h3 className="text-2xl font-bold">Business Hours</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>12:00 PM - 5:00 PM</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm opacity-90">
                        All times are Pacific Standard Time (PST)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Support */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <HeadphonesIcon className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-xl font-bold text-red-800">Emergency Support</h3>
                  </div>
                  <p className="text-red-700 text-sm mb-3">
                    For urgent technical issues affecting business operations:
                  </p>
                  <p className="text-red-800 font-semibold">+1 (555) 911-TECH</p>
                  <p className="text-red-600 text-xs mt-2">Available 24/7 for enterprise customers</p>
                </div>
              </div>
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