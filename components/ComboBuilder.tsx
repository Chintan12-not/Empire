'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gift, Check, Sparkles, Plus } from 'lucide-react';
import { PRODUCTS, COMBO_OFFER } from '@/lib/data/products';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

export default function ComboBuilder() {
  const [slot1, setSlot1] = useState<Product>(PRODUCTS[0]); // Smoked Whisky
  const [slot2, setSlot2] = useState<Product>(PRODUCTS[1]); // Ocean Aura
  const [isAdded, setIsAdded] = useState(false);

  const addCombo = useCartStore((state) => state.addCombo);

  const originalTotal = slot1.price + slot2.price;
  const savings = Math.max(0, originalTotal - COMBO_OFFER.comboPrice);

  const handleAddCombo = () => {
    addCombo(slot1, slot2);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="py-20 bg-charcoal-800/40 border-y border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {COMBO_OFFER.badgeText}
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3 gold-text-gradient">
            {COMBO_OFFER.title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-light">{COMBO_OFFER.subtitle}</p>
        </div>

        {/* Builder Container */}
        <div className="bg-charcoal-900 border border-gold-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Slot Selectors (Cols 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slot 1 Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                1st Perfume (50ml EDP)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRODUCTS.map((product) => (
                  <button
                    key={`slot1-${product.id}`}
                    onClick={() => setSlot1(product)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      slot1.id === product.id
                        ? 'border-gold-500 bg-gold-500/10 ring-1 ring-gold-500'
                        : 'border-gray-800 bg-charcoal-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-1.5">
                      <Image src={product.img} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="text-[11px] font-bold text-white truncate">{product.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">₹{product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot 2 Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                2nd Perfume (50ml EDP)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRODUCTS.map((product) => (
                  <button
                    key={`slot2-${product.id}`}
                    onClick={() => setSlot2(product)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      slot2.id === product.id
                        ? 'border-gold-500 bg-gold-500/10 ring-1 ring-gold-500'
                        : 'border-gray-800 bg-charcoal-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-1.5">
                      <Image src={product.img} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="text-[11px] font-bold text-white truncate">{product.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">₹{product.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual Box Preview & Price (Cols 5) */}
          <div className="lg:col-span-5 bg-charcoal-800 border border-gray-800 rounded-2xl p-6 text-center flex flex-col items-center justify-between h-full">
            <h3 className="font-serif text-lg font-bold text-white mb-4">Your Custom Duo Box</h3>

            {/* Bottle Visual Duo */}
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <Image src={slot1.img} alt={slot1.name} fill className="object-cover" />
                <span className="absolute bottom-1 left-1 bg-charcoal-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {slot1.name}
                </span>
              </div>
              <Plus className="w-5 h-5 text-gold-500" />
              <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <Image src={slot2.img} alt={slot2.name} fill className="object-cover" />
                <span className="absolute bottom-1 left-1 bg-charcoal-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {slot2.name}
                </span>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="w-full my-4 pt-4 border-t border-gray-700/80">
              <div className="text-xs text-gray-400 flex justify-between px-4 mb-1">
                <span>Individual Total:</span>
                <span className="line-through font-mono">₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold flex justify-between px-4 mb-3">
                <span>Your Combo Savings:</span>
                <span>-₹{savings.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-3xl font-bold gold-text-gradient font-serif">
                ₹{COMBO_OFFER.comboPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-gray-400">Includes 2x 50ml EDP bottles + Free Express Shipping</span>
            </div>

            {/* Add Combo to Cart Button */}
            <button
              onClick={handleAddCombo}
              disabled={isAdded}
              className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-500 text-charcoal-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gold-gradient text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" /> Combo Added to Cart!
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" /> Claim Custom Duo — ₹{COMBO_OFFER.comboPrice.toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
