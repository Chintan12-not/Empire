'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Tag, Sparkles, Copy, Check } from 'lucide-react';

export default function DiscountPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenEmpireDiscount');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000); // 4 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenEmpireDiscount', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('EMPIRE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-charcoal-800 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image src="/images/logo.png" alt="E'MPIRE Logo" fill className="object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3 h-3 text-gold-400" /> Welcome Privilege
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Unlock <span className="gold-text-gradient">10% OFF</span> Your First Order
        </h3>

        <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
          Use exclusive code <strong className="text-white">EMPIRE10</strong> at checkout to claim your first-order privilege discount on any flacon or custom box.
        </p>

        {/* Promo Code Copy Box */}
        <div className="flex items-center justify-between bg-charcoal-900 border border-gold-500/40 rounded-2xl p-3 mb-6">
          <div className="flex items-center gap-2 text-gold-400 font-mono text-sm font-bold pl-2">
            <Tag className="w-4 h-4 text-gold-500" />
            <span>EMPIRE10</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-gold-500 text-charcoal-900 text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-gold-600"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform"
        >
          Claim Privilege & Shop Now
        </button>
      </div>
    </div>
  );
}
