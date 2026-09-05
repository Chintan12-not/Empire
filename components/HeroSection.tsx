'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, Gift } from 'lucide-react';

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-900 pt-20">
      {/* Video Background with Parallax Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/Smoked Whisky.jpg"
          className="w-full h-full object-cover scale-105 opacity-40 filter contrast-125"
        >
          <source src="/video/Hero.mp4" type="video/mp4" />
        </video>
        {/* Dark Vignette & Gold Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-charcoal-900/80" />
        <div className="absolute inset-0 bg-gold-glow opacity-60 pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Crown Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 backdrop-blur-md mb-6"
        >
          <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
            👑 E’MPIRE HAUTE PARFUMERIE
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
        >
          Experience India’s Finest{' '}
          <span className="gold-text-gradient block mt-2">Luxury Eau De Parfums</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed mb-10"
        >
          Artisanal fragrances crafted with master essential oils, capturing presence, confidence, and modern sophistication in every flacon.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full max-w-md"
        >
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-gradient text-charcoal-900 font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Explore Collection
          </Link>

          <Link
            href="/custom-box"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-charcoal-800/90 border border-gold-500/40 text-gold-400 hover:text-gold-300 hover:border-gold-500 font-semibold text-sm tracking-wider uppercase transition-all backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-gold-500" />
            Custom Duo (Save ₹4,600)
          </Link>
        </motion.div>

        {/* Quiz Prompt Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8"
        >
          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gold-400 transition-colors py-2 px-4 rounded-full bg-charcoal-900/60 border border-gray-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
            Unsure which scent fits you? <span className="underline text-gold-400">Take 30s Scent Quiz</span>
          </button>
        </motion.div>
      </div>

      {/* Down Arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <ArrowDown className="w-5 h-5 text-gold-500/70" />
      </div>
    </section>
  );
}
