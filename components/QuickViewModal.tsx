'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, Heart, ExternalLink } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import NotesPyramid from './NotesPyramid';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedImg, setSelectedImg] = useState(product.img);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-charcoal-800 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-charcoal-900/80 border border-gray-700 text-gray-300 hover:text-white hover:border-gold-500 flex items-center justify-center transition-all"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image Gallery */}
        <div className="w-full md:w-1/2 p-6 bg-charcoal-900 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-gray-800 mb-4">
            <Image
              src={selectedImg}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    selectedImg === img ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Info */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Header Info */}
            <div className="flex items-center justify-between text-xs text-gold-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">{product.genderLabel} • 50ml EDP</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-gold-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-500">({product.totalReviews})</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
              {product.name}
            </h2>
            <p className="text-xs text-gray-400 italic mb-4">{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-800">
              <span className="text-2xl font-bold gold-text-gradient">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SAVE ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Fragrance Notes Breakdown */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Fragrance Notes</h4>
              <NotesPyramid notes={product.notes} isCompact />
            </div>

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {product.vibeTags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-semibold text-gray-400 bg-charcoal-700 border border-gray-800 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-500 text-charcoal-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gold-500 hover:bg-gold-600 text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" /> Added to Selection
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart — ₹{product.price.toLocaleString('en-IN')}
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border transition-all ${
                inWishlist
                  ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                  : 'bg-charcoal-900 border-gray-700 text-gray-300 hover:text-white hover:border-gold-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>

            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="p-3 rounded-xl bg-charcoal-900 border border-gray-700 text-gold-400 hover:border-gold-500 transition-colors"
              title="View full product page"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
