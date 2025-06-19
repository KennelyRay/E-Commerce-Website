'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchGPUData, fetchCPUData, fetchAllPCPartsData } from '@/lib/pc-parts-api';
import { Product } from '@/types';
import { Download, Cpu, MonitorSpeaker, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function APITestPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<{
    gpu: { status: 'idle' | 'loading' | 'success' | 'error', data?: Product[], error?: string },
    cpu: { status: 'idle' | 'loading' | 'success' | 'error', data?: Product[], error?: string },
    all: { status: 'idle' | 'loading' | 'success' | 'error', data?: Product[], error?: string }
  }>({
    gpu: { status: 'idle' },
    cpu: { status: 'idle' },
    all: { status: 'idle' }
  });

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const testGPUAPI = async () => {
    setTestResults(prev => ({ ...prev, gpu: { status: 'loading' } }));
    try {
      const data = await fetchGPUData();
      setTestResults(prev => ({ ...prev, gpu: { status: 'success', data } }));
      toast.success(`GPU API: Loaded ${data.length} products`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({ ...prev, gpu: { status: 'error', error: errorMsg } }));
      toast.error('GPU API failed');
    }
  };

  const testCPUAPI = async () => {
    setTestResults(prev => ({ ...prev, cpu: { status: 'loading' } }));
    try {
      const data = await fetchCPUData();
      setTestResults(prev => ({ ...prev, cpu: { status: 'success', data } }));
      toast.success(`CPU API: Loaded ${data.length} products`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({ ...prev, cpu: { status: 'error', error: errorMsg } }));
      toast.error('CPU API failed');
    }
  };

  const testAllAPIs = async () => {
    setTestResults(prev => ({ ...prev, all: { status: 'loading' } }));
    try {
      const data = await fetchAllPCPartsData();
      setTestResults(prev => ({ ...prev, all: { status: 'success', data } }));
      toast.success(`All APIs: Loaded ${data.length} total products`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({ ...prev, all: { status: 'error', error: errorMsg } }));
      toast.error('API integration failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">API Testing</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Test PC parts API integrations and view real-time data
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Test Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Tests</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GPU API Test */}
            <div className="border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MonitorSpeaker className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">GPU API</h3>
                    <p className="text-sm text-gray-600">Graphics card data</p>
                  </div>
                </div>
                {getStatusIcon(testResults.gpu.status)}
              </div>
              
              <button
                onClick={testGPUAPI}
                disabled={testResults.gpu.status === 'loading'}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testResults.gpu.status === 'loading' ? 'Testing...' : 'Test GPU API'}
              </button>
              
              {testResults.gpu.status === 'success' && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ Loaded {testResults.gpu.data?.length} GPU products
                </p>
              )}
              
              {testResults.gpu.status === 'error' && (
                <p className="mt-2 text-sm text-red-600">
                  ❌ Error: {testResults.gpu.error}
                </p>
              )}
            </div>

            {/* CPU API Test */}
            <div className="border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">CPU API</h3>
                    <p className="text-sm text-gray-600">Processor data</p>
                  </div>
                </div>
                {getStatusIcon(testResults.cpu.status)}
              </div>
              
              <button
                onClick={testCPUAPI}
                disabled={testResults.cpu.status === 'loading'}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testResults.cpu.status === 'loading' ? 'Testing...' : 'Test CPU API'}
              </button>
              
              {testResults.cpu.status === 'success' && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ Loaded {testResults.cpu.data?.length} CPU products
                </p>
              )}
              
              {testResults.cpu.status === 'error' && (
                <p className="mt-2 text-sm text-red-600">
                  ❌ Error: {testResults.cpu.error}
                </p>
              )}
            </div>

            {/* All APIs Test */}
            <div className="border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Download className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">All APIs</h3>
                    <p className="text-sm text-gray-600">Complete dataset</p>
                  </div>
                </div>
                {getStatusIcon(testResults.all.status)}
              </div>
              
              <button
                onClick={testAllAPIs}
                disabled={testResults.all.status === 'loading'}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testResults.all.status === 'loading' ? 'Testing...' : 'Test All APIs'}
              </button>
              
              {testResults.all.status === 'success' && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ Loaded {testResults.all.data?.length} total products
                </p>
              )}
              
              {testResults.all.status === 'error' && (
                <p className="mt-2 text-sm text-red-600">
                  ❌ Error: {testResults.all.error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* API Data Preview */}
        {testResults.all.status === 'success' && testResults.all.data && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              API Data Preview ({testResults.all.data.length} products)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testResults.all.data.slice(0, 6).map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-primary-600">${product.price}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating.toFixed(1)} ({product.reviews})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {testResults.all.data.length > 6 && (
              <p className="text-center text-gray-600 mt-4">
                ...and {testResults.all.data.length - 6} more products
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 