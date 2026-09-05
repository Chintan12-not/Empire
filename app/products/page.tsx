'use client';

import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { PRODUCTS } from '@/lib/data/products';

export default function ProductsPage() {
  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-2">
          👑 E’MPIRE ATELIER
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white gold-text-gradient mb-4">
          All Eau De Parfums
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
          Explore our complete collection of 50ml Eau De Parfums, formulated with high oil concentrations for extraordinary longevity and presence.
        </p>
      </div>

      <ProductGrid products={PRODUCTS} title="" subtitle="" />
    </div>
  );
}
