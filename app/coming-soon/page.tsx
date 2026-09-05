'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Bell } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center bg-charcoal-800 border border-gold-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image src="/images/logo.png" alt="E'MPIRE Logo" fill className="object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" /> PRIVATE BATCH DROP
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white gold-text-gradient mb-4">
          New Scents Brewing
        </h1>
        <p className="text-gray-300 text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
          Our master perfumers are currently aging an upcoming limited-edition elixir. Join our VIP list to be notified 24 hours before the public drop.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mx-auto mb-8">
          <input
            type="email"
            placeholder="Enter your VIP email address..."
            className="flex-1 bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
          >
            <Bell className="w-4 h-4" /> Notify Me
          </button>
        </form>

        <Link href="/products" className="text-xs text-gold-400 underline hover:text-gold-300">
          Back to Current Fragrance Collection
        </Link>
      </div>
    </div>
  );
}
