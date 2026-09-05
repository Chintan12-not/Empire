'use client';

import React, { useState } from 'react';
import ScentQuizModal from '@/components/ScentQuizModal';
import Link from 'next/link';

export default function ScentQuizPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen flex items-center justify-center">
      {isOpen ? (
        <ScentQuizModal onClose={() => setIsOpen(false)} />
      ) : (
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Quiz Closed</h2>
          <Link href="/products" className="px-6 py-3 rounded-full bg-gold-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider inline-block">
            Browse Fragrances
          </Link>
        </div>
      )}
    </div>
  );
}
