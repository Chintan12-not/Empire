'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';

export default function WishlistPage() {
  const { items, toggleWishlist, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-800">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
              👑 SAVED SELECTIONS
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white gold-text-gradient">
              Your Wishlist ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-gray-400 hover:text-rose-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-charcoal-800 rounded-2xl border border-gray-800 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 border border-gray-700">
                    <Image src={item.product.img} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">{item.product.genderLabel}</span>
                  <h3 className="font-serif text-lg font-bold text-white mb-1">{item.product.name}</h3>
                  <div className="text-sm font-bold gold-text-gradient mb-4">₹{item.product.price.toLocaleString('en-IN')}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addItem(item.product)}
                    className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(item.product)}
                    className="p-2.5 rounded-xl bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-charcoal-800/40 rounded-3xl border border-gray-800">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4 stroke-1" />
            <h3 className="font-serif text-xl text-white mb-2">Your wishlist is currently empty</h3>
            <p className="text-xs text-gray-400 mb-6">Explore our collection and click the heart icon to save your favorite flacons.</p>
            <Link
              href="/products"
              className="px-8 py-3 rounded-full bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider inline-block shadow-lg"
            >
              Discover Fragrances
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
