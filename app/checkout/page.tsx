'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle, MapPin, Mail, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

// InputField component moved outside to prevent remounting
const InputField = ({ 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  value, 
  onChange, 
  error 
}: {
  name: string;
  type?: string;
  placeholder: string;
  icon: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission when Enter is pressed in input fields
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
          }`}
        />
      </div>
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Update email when user loads
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email, formData.email]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // ZIP code validation (Philippine postal codes are 4 digits)
    const zipRegex = /^\d{4}$/;
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 4 digits';
    }

    // Card validation only for credit card payment method
    if (paymentMethod === 'credit-card') {
      // Card number validation (basic 16-digit validation)
      const cardRegex = /^\d{16}$/;
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      // Expiry date validation (MM/YY format)
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!expiryRegex.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Use MM/YY format';
      } else {
        // Check if card is expired
        const [month, year] = formData.expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          newErrors.expiryDate = 'Card has expired';
        }
      }

      // CVV validation
      const cvvRegex = /^\d{3,4}$/;
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!cvvRegex.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } 
    // Format expiry date
    else if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format CVV (numbers only)
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format ZIP code (numbers only, 4 digits)
    else if (name === 'zipCode') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 3000);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before checking out.
            </p>
                          <Link
                href="/products"
                prefetch={false}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase! Your order has been placed successfully.
              You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <p className="text-gray-600">Order #: VTX-{Date.now().toString().slice(-8)}</p>
              <p className="text-gray-600">Estimated delivery: 3-5 business days</p>
            </div>
            <div className="space-y-4">
              <Link
                href="/products"
                prefetch={false}
                className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/home"
                prefetch={false}
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2500 ? 0 : 150; // Free shipping over ₱2,500
  const tax = subtotal * 0.12; // 12% VAT in Philippines
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            prefetch={false}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order securely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <Mail className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                </div>
                <InputField
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <InputField
                    name="firstName"
                    placeholder="First name"
                    icon={User}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  <InputField
                    name="lastName"
                    placeholder="Last name"
                    icon={User}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />
                </div>
                
                <div className="mb-6">
                  <InputField
                    name="address"
                    placeholder="Street address, barangay, building, etc."
                    icon={MapPin}
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    name="city"
                    placeholder="City"
                    icon={MapPin}
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                  />
                  <InputField
                    name="zipCode"
                    placeholder="ZIP Code (4 digits)"
                    icon={MapPin}
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Credit Card */}
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'credit-card'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('credit-card')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                        </div>
                      </div>
                    </div>

                    {/* GCash */}
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'gcash'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('gcash')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          G₱
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">GCash</h3>
                          <p className="text-sm text-gray-600">Mobile wallet</p>
                        </div>
                      </div>
                    </div>

                    {/* Maya */}
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'maya'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('maya')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          M
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Maya</h3>
                          <p className="text-sm text-gray-600">Digital wallet</p>
                        </div>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          PP
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">PayPal</h3>
                          <p className="text-sm text-gray-600">Global payments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-6">
                    <div>
                      <InputField
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        icon={CreditCard}
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        error={errors.cardNumber}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <InputField
                        name="expiryDate"
                        placeholder="MM/YY"
                        icon={Calendar}
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        error={errors.expiryDate}
                      />
                      <InputField
                        name="cvv"
                        placeholder="CVV"
                        icon={Lock}
                        value={formData.cvv}
                        onChange={handleInputChange}
                        error={errors.cvv}
                      />
                    </div>
                  </div>
                )}

                {/* GCash Form */}
                {paymentMethod === 'gcash' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        G₱
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">GCash Payment</h3>
                        <p className="text-sm text-gray-600">You'll be redirected to GCash to complete payment</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Instructions:</strong>
                      </p>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. You'll be redirected to GCash app/website</li>
                        <li>2. Log in with your GCash credentials</li>
                        <li>3. Verify the payment amount and confirm</li>
                        <li>4. Return to complete your order</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Maya Form */}
                {paymentMethod === 'maya' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        M
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Maya Payment</h3>
                        <p className="text-sm text-gray-600">You'll be redirected to Maya to complete payment</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Instructions:</strong>
                      </p>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. You'll be redirected to Maya app/website</li>
                        <li>2. Enter your Maya PIN or use biometrics</li>
                        <li>3. Confirm the payment details</li>
                        <li>4. Complete payment to finish your order</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                        PP
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">PayPal Payment</h3>
                        <p className="text-sm text-gray-600">You'll be redirected to PayPal to complete payment</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Benefits:</strong>
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Buyer protection guaranteed</li>
                        <li>• Pay with PayPal balance, bank, or card</li>
                        <li>• Secure international payments</li>
                        <li>• No need to share card details</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      Your payment information is secure and encrypted with 256-bit SSL
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {paymentMethod === 'credit-card' && 'Processing Payment...'}
                      {paymentMethod === 'gcash' && 'Connecting to GCash...'}
                      {paymentMethod === 'maya' && 'Connecting to Maya...'}
                      {paymentMethod === 'paypal' && 'Connecting to PayPal...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>
                      {paymentMethod === 'credit-card' && `Complete Order - ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                      {paymentMethod === 'gcash' && `Pay with GCash - ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                      {paymentMethod === 'maya' && `Pay with Maya - ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                      {paymentMethod === 'paypal' && `Pay with PayPal - ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₱{(item.product.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `₱${shipping.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (12%)</span>
                <span>₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {subtotal < 2500 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 Add ₱{(2500 - subtotal).toLocaleString('en-PH', { minimumFractionDigits: 2 })} more for free shipping!
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>2-year manufacturer warranty</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 