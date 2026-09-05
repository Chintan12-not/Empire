'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title = 'The Fragrance Collection', subtitle = 'Handcrafted 50ml Eau De Parfums' }: ProductGridProps) {
  const [activeGender, setActiveGender] = useState<'all' | 'him' | 'her' | 'unisex' | 'bestsellers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'low-high' | 'high-low'>('popular');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Gender filter
        if (activeGender === 'him' && product.gender !== 'him') return false;
        if (activeGender === 'her' && product.gender !== 'her') return false;
        if (activeGender === 'unisex' && product.gender !== 'unisex') return false;
        if (activeGender === 'bestsellers' && !product.isBestseller) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchTagline = product.tagline.toLowerCase().includes(q);
          const matchNotes = `${product.notes.top} ${product.notes.heart} ${product.notes.base}`.toLowerCase().includes(q);
          return matchName || matchTagline || matchNotes;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return a.price - b.price;
        if (sortBy === 'high-low') return b.price - a.price;
        return b.totalReviews - a.totalReviews;
      });
  }, [products, activeGender, searchQuery, sortBy]);

  return (
    <section id="featured" className="py-20 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3 gold-text-gradient">
            {title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-light">{subtitle}</p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Fragrances' },
              { id: 'him', label: 'For Him' },
              { id: 'her', label: 'For Her' },
              { id: 'unisex', label: 'Unisex' },
              { id: 'bestsellers', label: '👑 Bestsellers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGender(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  activeGender === tab.id
                    ? 'bg-gold-500 text-charcoal-900 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-charcoal-800 text-gray-300 hover:text-white hover:bg-charcoal-700 border border-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes or scents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-800 border border-gray-800 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-charcoal-800 border border-gray-800 text-xs text-gray-300 rounded-full px-3 py-2 focus:outline-none focus:border-gold-500 cursor-pointer appearance-none pr-8"
              >
                <option value="popular">Sort: Popularity</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-charcoal-800/40 rounded-2xl border border-gray-800">
            <p className="text-gray-400 font-serif text-lg">No fragrances match your search criteria.</p>
            <button
              onClick={() => {
                setActiveGender('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-gold-400 hover:text-gold-300 underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
