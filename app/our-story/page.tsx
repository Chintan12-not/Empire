'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Award } from 'lucide-react';
import TrustBadges from '@/components/TrustBadges';

export default function OurStoryPage() {
  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-2">
          👑 THE HERITAGE OF E’MPIRE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white gold-text-gradient mb-6">
          Crafting Sophistication & Distinction
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed">
          Born from an unwavering passion for haute parfumerie, E’MPIRE was established to redefine luxury fragrance by making masterfully crafted, long-lasting scents accessible, unforgettable, and deeply personal.
        </p>
      </div>

      {/* Story Chapter 1 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl">
            <Image src="/images/Smoked Whisky.jpg" alt="E'MPIRE Atelier" fill className="object-cover" />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase">
              <Gem className="w-3.5 h-3.5" /> Chapter I — The Genesis
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              An Uncompromising Pursuit of Fine Fragrance
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              At **E’MPIRE**, fragrance is not merely an accessory — it is an invisible signature. Our founders set out with a clear mission: to challenge generic mass-market perfumes by introducing artisanal Eau De Parfums formulated with master essential oils, rich resins, and rare accords.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              Every blend in our collection undergoes months of rigorous formulation and maceration to achieve superior sillage, projection, and skin harmony.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Quote Banner */}
      <section className="py-20 bg-charcoal-800/60 border-y border-gold-500/10 my-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-6" />
          <blockquote className="font-serif text-2xl sm:text-3xl italic text-white leading-relaxed mb-6">
            “Every fragrance is an invisible signature — designed to leave a lasting impression, rooted in luxury, authenticity, and refined distinction.”
          </blockquote>
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            — E’MPIRE ATELIER
          </span>
        </div>
      </section>

      {/* Chapter 2: The Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-white gold-text-gradient">
            Our Quality Promise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-charcoal-800 border border-gray-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">15-20% EDP Oil Strength</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              We never compromise on oil concentration. Our high ratio guarantees 8-12+ hours of intense projection.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-charcoal-800 border border-gray-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto">
              <Gem className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Ethically Sourced Essences</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Sourced from renowned perfumery houses across Grasse and India, ensuring IFRA compliance and safety.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-charcoal-800 border border-gray-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Artisanal Glass Flacons</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Every bottle is hand-assembled, capped, and inspected to provide a luxurious sensory unboxing experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
