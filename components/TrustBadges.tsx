'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, CreditCard } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <Sparkles className="w-6 h-6 text-gold-500" />,
      title: '100% Pure Eau De Parfum',
      subtitle: 'High oil concentration for 8-12+ hr longevity',
    },
    {
      icon: <Truck className="w-6 h-6 text-gold-500" />,
      title: 'Free Express Shipping',
      subtitle: 'Free pan-India delivery on orders above ₹2,000',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold-500" />,
      title: 'Authenticity Guaranteed',
      subtitle: 'Handcrafted luxury flacons & verified formulas',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gold-500" />,
      title: 'Secure Checkout & COD',
      subtitle: 'Razorpay, UPI, Cards, & Cash on Delivery',
    },
  ];

  return (
    <section className="bg-charcoal-800/60 border-y border-gold-500/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-charcoal-900/50 border border-gray-800/80 hover:border-gold-500/30 transition-all group"
            >
              <div className="p-3 rounded-lg bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-serif tracking-wide group-hover:text-gold-400 transition-colors">
                  {badge.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
