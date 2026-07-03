'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Mail,
  User,
  Calendar,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CheckoutFormData, Order, PaymentMethod } from '@/types';
import { placeOrder } from '@/lib/shop';

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

const InputField = ({
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
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
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors bg-white ${
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

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[1.75rem] shadow-sm p-6 lg:p-8 border border-gray-100">
    <div className="flex items-start gap-4 mb-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
      </div>
    </div>
    {children}
  </div>
);

const PaymentOption = ({
  active,
  title,
  description,
  accent,
  badge,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  accent: React.ReactNode;
  badge?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
      active ? 'border-purple-500 bg-purple-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 bg-white'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {accent}
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {badge ? (
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {badge}
        </span>
      ) : null}
    </div>
  </button>
);

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const [formData, setFormData] = useState<CheckoutFormData>({
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    const zipRegex = /^\d{4}$/;
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 4 digits';
    }

    if (paymentMethod === 'credit-card') {
      const cardRegex = /^\d{16}$/;
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!expiryRegex.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Use MM/YY format';
      } else {
        const [month, year] = formData.expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          newErrors.expiryDate = 'Card has expired';
        }
      }

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

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else if (name === 'zipCode') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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

    setTimeout(() => {
      try {
        if (!user) {
          throw new Error('You must be logged in to place an order.');
        }

        const order = placeOrder({
          user,
          items,
          shippingAddress: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            zipCode: formData.zipCode.trim(),
            country: 'Philippines',
          },
          paymentMethod,
          subtotal,
          shipping,
          tax,
          total,
        });

        setCompletedOrder(order);
        clearCart();
        toast.success('Order placed successfully!');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to place order.';
        toast.error(message);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (items.length === 0 && !completedOrder) {
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

  if (completedOrder) {
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
              <p className="text-gray-600">Order #: {completedOrder.orderNumber}</p>
              <p className="text-gray-600">
                Estimated delivery:{' '}
                {new Date(completedOrder.estimatedDelivery).toLocaleDateString('en-PH', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-gray-600">
                Payment method: {completedOrder.paymentMethod.replace('-', ' ')}
              </p>
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
                href="/account"
                prefetch={false}
                className="block text-gray-600 hover:text-gray-900 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2500 ? 0 : 150;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;
  const freeShippingGap = Math.max(0, 2500 - subtotal);
  const paymentButtonLabel =
    paymentMethod === 'credit-card'
      ? 'Complete Order'
      : paymentMethod === 'gcash'
        ? 'Pay with GCash'
        : paymentMethod === 'maya'
          ? 'Pay with Maya'
          : 'Pay with PayPal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-10">
          <Link
            href="/cart"
            prefetch={false}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </Link>
          <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-purple-900 to-fuchsia-900 text-white p-8 lg:p-10 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)] pointer-events-none"></div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Secure checkout
              </div>
              <h1 className="text-4xl lg:text-5xl font-black mb-3">Checkout</h1>
              <p className="text-white/80 text-lg max-w-2xl">
                Finalize your order with protected payment options, delivery details, and a clear order summary.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-sm text-white/65 mb-1">Items in order</p>
                  <p className="text-2xl font-black">{getTotalItems()}</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-sm text-white/65 mb-1">Payment protection</p>
                  <p className="text-2xl font-black">256-bit SSL</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-sm text-white/65 mb-1">Delivery estimate</p>
                  <p className="text-2xl font-black">3-5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <SectionCard
                icon={Mail}
                title="Contact Information"
                subtitle="Use an active email so you receive order updates and payment confirmations."
              >
                <InputField
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </SectionCard>

              <SectionCard
                icon={MapPin}
                title="Shipping Address"
                subtitle="We currently ship across the Philippines with secure packaging and tracking support."
              >
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
              </SectionCard>

              <SectionCard
                icon={CreditCard}
                title="Payment Method"
                subtitle="Choose the checkout method that works best for you."
              >
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PaymentOption
                      active={paymentMethod === 'credit-card'}
                      title="Credit/Debit Card"
                      description="Visa, Mastercard, JCB"
                      badge="Fastest"
                      onClick={() => setPaymentMethod('credit-card')}
                      accent={
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                      }
                    />
                    <PaymentOption
                      active={paymentMethod === 'gcash'}
                      title="GCash"
                      description="Mobile wallet"
                      badge="Popular"
                      onClick={() => setPaymentMethod('gcash')}
                      accent={
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          G₱
                        </div>
                      }
                    />
                    <PaymentOption
                      active={paymentMethod === 'maya'}
                      title="Maya"
                      description="Digital wallet"
                      onClick={() => setPaymentMethod('maya')}
                      accent={
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          M
                        </div>
                      }
                    />
                    <PaymentOption
                      active={paymentMethod === 'paypal'}
                      title="PayPal"
                      description="Global payments"
                      onClick={() => setPaymentMethod('paypal')}
                      accent={
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          PP
                        </div>
                      }
                    />
                  </div>
                </div>

                {paymentMethod === 'credit-card' && (
                  <div className="space-y-6 rounded-[1.5rem] bg-slate-50 p-5 border border-slate-100">
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

                {paymentMethod === 'gcash' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-[1.5rem] p-6">
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

                {paymentMethod === 'maya' && (
                  <div className="bg-green-50 border border-green-200 rounded-[1.5rem] p-6">
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

                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-[1.5rem] p-6">
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

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      Your payment information is secure and encrypted with 256-bit SSL
                    </p>
                  </div>
                </div>
              </SectionCard>

              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white py-5 px-6 rounded-2xl font-bold text-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
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
                    <span>{paymentButtonLabel} - ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:sticky lg:top-8 space-y-6 h-fit">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-purple-900 to-fuchsia-900 text-white p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">Order Summary</h2>
                  <p className="text-white/70 text-sm">Review your items before payment</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55 mb-1">Total</p>
                  <p className="text-2xl font-black">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{item.product.name}</h3>
                      <p className="text-sm text-white/65">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-white">
                      ₱{(item.product.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between text-white/75">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-white/75">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-300 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₱${shipping.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="flex justify-between text-white/75">
                  <span>VAT (12%)</span>
                  <span>₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {subtotal < 2500 && (
              <div className="rounded-[1.5rem] bg-blue-50 border border-blue-200 p-5">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Unlock free shipping</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Add ₱{freeShippingGap.toLocaleString('en-PH', { minimumFractionDigits: 2 })} more to qualify for free delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[1.5rem] bg-white border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-4">Why customers feel safe here</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>2-year manufacturer warranty</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <span>Secure payment processing and order protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
