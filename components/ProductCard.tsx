'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group relative bg-charcoal-800/80 rounded-2xl border border-gray-800/80 hover:border-gold-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]">
      {/* Top Badges & Actions */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {product.isBestseller && (
            <span className="bg-gold-500 text-charcoal-900 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-500 text-charcoal-900 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              New Batch
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto ${
            inWishlist
              ? 'bg-rose-500/20 border-rose-500 text-rose-500'
              : 'bg-charcoal-900/60 border-gray-700/60 text-gray-300 hover:text-white hover:border-gold-500'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-charcoal-900 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Glow & Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Quick View Floating Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-charcoal-900/90 border border-gold-500/50 text-gold-400 text-xs font-semibold tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-md"
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-gold-400">{product.genderLabel}</span>
            <div className="flex items-center gap-1 text-gold-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              <span>{product.rating}</span>
              <span className="text-gray-500">({product.totalReviews})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-1 mb-4 italic">{product.tagline}</p>
        </div>

        {/* Footer Price & Add to Cart */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</div>
            <div className="text-base font-bold text-white gold-text-gradient">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-500 text-charcoal-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-gold-500 hover:bg-gold-600 text-charcoal-900 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:scale-105'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
