'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, CheckCircle2, Clock, MapPin, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function MyOrdersPage() {
  const { user, orders, openAuthModal, logout } = useAuthStore();

  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
              👑 ELITE CIRCLE DASHBOARD
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white gold-text-gradient">
              My Orders & Tracking
            </h1>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-charcoal-800 border border-gray-800 rounded-full px-4 py-2 text-xs">
              <User className="w-4 h-4 text-gold-400" />
              <span className="text-white font-semibold">{user.name || user.email}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-rose-400 transition-colors ml-2"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-6 py-2.5 rounded-full bg-gold-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-gold-600 transition-colors"
            >
              Sign In to View All Orders
            </button>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-charcoal-800 rounded-3xl border border-gray-800/90 overflow-hidden shadow-xl"
            >
              {/* Order Top Bar */}
              <div className="p-6 bg-charcoal-800/80 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-400 block">Order ID</span>
                    <span className="font-serif font-bold text-white text-sm">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Date Placed</span>
                    <span className="text-gray-200">{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-gray-400 block">Total Amount</span>
                    <span className="font-mono font-bold text-gold-400 text-sm">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {order.status === 'Delivered' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 animate-pulse" />
                    )}
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-700 shrink-0">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                        <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-xs font-mono font-bold text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Details Footer */}
                {order.trackingNumber && (
                  <div className="p-4 rounded-2xl bg-charcoal-900 border border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span>Delivery Address: {order.shippingAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Tracking AWB:</span>
                      <span className="font-mono text-gold-400 font-bold">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
