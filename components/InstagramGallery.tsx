'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export default function InstagramGallery() {
  const images = [
    { src: '/images/Smoked Whisky.jpg', handle: '@empireperfumes.official' },
    { src: '/images/Ocean Aura.jpg', handle: '@empireperfumes.official' },
    { src: '/images/Blush ELIXIR.jpg', handle: '@empireperfumes.official' },
    { src: '/images/Crown of Dunes 1.jpg', handle: '@empireperfumes.official' },
    { src: '/images/Supermale 1.jpg', handle: '@empireperfumes.official' },
    { src: '/images/Berry Flora 1.jpg', handle: '@empireperfumes.official' },
  ];

  return (
    <section className="py-20 bg-charcoal-900 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Instagram className="w-3.5 h-3.5" /> #EMPIREPERFUMES
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 gold-text-gradient">
            Follow Our Fragrance Journey
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light">
            Tag <span className="text-gold-400">@empireperfumes.official</span> on Instagram to be featured in our luxury circle.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((item, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/empireperfumes.official?igsh=MTRrZTNyMWVicGM3Mg=="
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-800 hover:border-gold-500/50 transition-all shadow-md"
            >
              <Image src={item.src} alt={`Instagram ${idx}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-charcoal-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-2">
                <Instagram className="w-6 h-6 text-gold-400 mb-1" />
                <span className="text-[10px] font-bold text-white tracking-wider">{item.handle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
