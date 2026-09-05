'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowLeft, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
  const { items, getTotals, clearCart, promoCode, discountPercent } = useCartStore();
  const totals = getTotals();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'cod'>('razorpay');
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Haryana',
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const generatedId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedId);
    setIsCompleted(true);
    clearCart();
  };

  if (isCompleted) {
    return (
      <div className="pt-32 pb-20 bg-charcoal-900 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-charcoal-800 border border-gold-500/40 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Thank You for Your Order</h1>
          <p className="text-xs text-gray-400 mb-6">
            Your Order ID is <strong className="text-gold-400 font-mono">{orderId}</strong>. We have sent a confirmation email to <span className="text-gray-200">{formData.email}</span>.
          </p>

          <div className="p-4 rounded-2xl bg-charcoal-900 border border-gray-800 text-left text-xs text-gray-300 space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Shipping Address:</span>
              <span className="font-semibold text-white">{formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold uppercase text-gold-400">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-800 font-bold text-white">
              <span>Amount Paid:</span>
              <span className="gold-text-gradient">₹{totals.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link
            href="/my-orders"
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider block shadow-lg"
          >
            Track Order Status
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-20 text-center bg-charcoal-900 min-h-screen">
        <h1 className="font-serif text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-gold-400 underline text-sm">
          Browse Collection to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-serif">
          <Link href="/" className="hover:text-gold-400 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Store
          </Link>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white gold-text-gradient mb-8">
          Secure Express Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form (Cols 7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Info */}
            <div className="bg-charcoal-800 rounded-3xl border border-gray-800 p-6 sm:p-8">
              <h3 className="font-serif text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gold-500" />
                Shipping & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Amrit Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="amrit@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="121003"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building Name, Street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Faridabad / Delhi / Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateway Selectors */}
            <div className="bg-charcoal-800 rounded-3xl border border-gray-800 p-6 sm:p-8">
              <h3 className="font-serif text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-500" />
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-gray-800 bg-charcoal-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="text-sm font-bold text-white">Razorpay (UPI / Google Pay / Cards / NetBanking)</div>
                      <div className="text-xs text-gray-400">Instant 256-bit encrypted gateway</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">RECOMMENDED</span>
                </label>

                {/* Stripe Option */}
                <label
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-gray-800 bg-charcoal-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="text-sm font-bold text-white">Credit / Debit Card (Stripe Gateway)</div>
                      <div className="text-xs text-gray-400">Visa, MasterCard, Amex</div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-gray-800 bg-charcoal-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="text-sm font-bold text-white">Cash on Delivery (COD)</div>
                      <div className="text-xs text-gray-400">Pay cash upon express courier delivery</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary (Cols 5) */}
          <div className="lg:col-span-5 bg-charcoal-800 rounded-3xl border border-gold-500/30 p-6 sm:p-8 flex flex-col justify-between h-fit">
            <div>
              <h3 className="font-serif text-xl font-bold text-white mb-6 gold-text-gradient">
                Order Summary
              </h3>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                      <Image src={item.product.img} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400">Qty: {item.quantity} • {item.product.size}</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-gray-400 pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-white font-mono">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Applied Coupon ({discountPercent}%)</span>
                    <span className="font-mono">-₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-white font-mono">{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-gray-700">
                  <span>Total Payable</span>
                  <span className="gold-text-gradient text-lg font-mono">₹{totals.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-4 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Complete Order — ₹{totals.total.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
