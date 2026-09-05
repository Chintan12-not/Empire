'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import ProductGrid from '@/components/ProductGrid';
import ComboBuilder from '@/components/ComboBuilder';
import NotesPyramid from '@/components/NotesPyramid';
import ReviewSection from '@/components/ReviewSection';
import InstagramGallery from '@/components/InstagramGallery';
import FaqAccordion from '@/components/FaqAccordion';
import ScentQuizModal from '@/components/ScentQuizModal';
import { PRODUCTS } from '@/lib/data/products';

export default function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <HeroSection onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* 2. Trust Badges Bar */}
      <TrustBadges />

      {/* 3. Bestseller Product Collection Grid */}
      <ProductGrid products={PRODUCTS} />

      {/* 4. Interactive "Custom Box of 2" Combo Offer */}
      <ComboBuilder />

      {/* 5. The Art of Fragrance - Notes Evolution Showcase */}
      <section className="py-20 bg-charcoal-900 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Haute Parfumerie Craft
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3 gold-text-gradient">
              The Art of Fragrance Evolution
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Every E’MPIRE creation is a living symphony of notes that unfolds gracefully over time on your skin.
            </p>
          </div>

          <NotesPyramid
            notes={{
              top: 'Vibrant Citrus, Pink Berries, Marine Accord & Green Pear (Instant 0-15 Min Impact)',
              heart: 'Charred Oak, Whiskeys, Tonka Beans, Rose Petals & Jasmine (15-60 Min Signature Bloom)',
              base: 'Rich Amber, Madagascar Vanilla, Royal Oud, Sandalwood & White Musk (8-12+ Hour Lingering Legacy)',
            }}
          />
        </div>
      </section>

      {/* 6. Reimagined Story Section */}
      <section className="py-20 bg-charcoal-800/50 border-t border-gold-500/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl">
            <Image
              src="/images/Smoked Whisky.jpg"
              alt="E'MPIRE Heritage"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-charcoal-900/80 backdrop-blur-md border border-gold-500/30 text-center">
              <span className="font-serif gold-text-gradient text-xl font-bold">E’MPIRE HERITAGE</span>
              <p className="text-xs text-gray-300 font-light mt-1">Handcrafted with intention in Faridabad, India</p>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-2">
              👑 OUR PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Redefining Luxury Fragrance for the Modern Era
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              Born from an unwavering passion for haute parfumerie, <strong className="text-gold-400 font-semibold">E’MPIRE</strong> was established with a singular vision — to redefine luxury fragrance by making masterfully crafted, captivating scents accessible, unforgettable, and deeply personal.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light mb-8">
              Driven by relentless innovation and an uncompromising commitment to quality, our house blends timeless artistry with modern sophistication. Each creation is meticulously formulated using fine essential oils to embody confidence, individuality, and effortless prestige.
            </p>

            <Link
              href="/our-story"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <ReviewSection />

      {/* 8. Instagram Gallery */}
      <InstagramGallery />

      {/* 9. FAQ Section */}
      <FaqAccordion />

      {/* Scent Quiz Modal */}
      {isQuizOpen && <ScentQuizModal onClose={() => setIsQuizOpen(false)} />}
    </>
  );
}
