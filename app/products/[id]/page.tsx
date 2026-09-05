'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Star, ShoppingBag, Heart, Check, Gift, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import NotesPyramid from '@/components/NotesPyramid';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return (
      <div className="pt-36 pb-20 text-center bg-charcoal-900 min-h-screen">
        <h1 className="font-serif text-3xl font-bold text-white mb-4">Fragrance Not Found</h1>
        <Link href="/products" className="text-gold-400 underline text-sm">
          Return to Collection
        </Link>
      </div>
    );
  }

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

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-serif">
          <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold-400 transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-gold-400 font-semibold">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left Gallery (Cols 6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-gold-500/30 bg-charcoal-800 shadow-2xl">
              <Image src={selectedImg} alt={product.name} fill className="object-cover" priority />
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border transition-all shrink-0 ${
                      selectedImg === img ? 'border-gold-500 ring-2 ring-gold-500/40' : 'border-gray-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details (Cols 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">
                <span>{product.genderLabel} • {product.size}</span>
                <div className="flex items-center gap-1 text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-500">({product.totalReviews} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-400 italic mb-6">{product.tagline}</p>

              {/* Price Banner */}
              <div className="flex items-baseline gap-4 p-4 rounded-2xl bg-charcoal-800/80 border border-gray-800 mb-8">
                <span className="text-3xl font-bold gold-text-gradient font-serif">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  SAVE ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Full Description */}
              <div className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line mb-8">
                {product.description}
              </div>

              {/* Fragrance Notes Breakdown */}
              <div className="mb-8">
                <h3 className="font-serif text-lg font-bold text-white mb-4 gold-text-gradient">
                  Fragrance Notes Pyramid
                </h3>
                <NotesPyramid notes={product.notes} />
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-500 text-charcoal-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-gold-gradient text-charcoal-900 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Selection
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Cart — ₹{product.price.toLocaleString('en-IN')}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-full border transition-all ${
                    inWishlist
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                      : 'bg-charcoal-800 border-gray-700 text-gray-300 hover:text-white hover:border-gold-500'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Custom Duo Box Upsell Banner */}
              <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-gold-500" />
                  <div>
                    <div className="text-xs font-bold text-white">Custom Box of 2 Offer</div>
                    <div className="text-[11px] text-gray-300">Pair this bottle with any other scent for ₹4,999 flat</div>
                  </div>
                </div>
                <Link
                  href="/custom-box"
                  className="px-4 py-1.5 rounded-full bg-gold-500 text-charcoal-900 text-xs font-bold hover:bg-gold-600 transition-colors"
                >
                  Build Combo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="pt-16 border-t border-gray-800">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-8 text-center gold-text-gradient">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} onQuickView={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
