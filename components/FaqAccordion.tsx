'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long do E’MPIRE Eau De Parfums last on skin & clothing?',
      a: 'All E’MPIRE creations are formulated as high-concentration Eau De Parfum (15-20% pure perfume oil). They typically provide 8–12+ hours of long-lasting projection on skin and remain detectable on clothing for up to 24 hours.',
    },
    {
      q: 'What is the "Custom Box of 2" combo deal?',
      a: 'Our Custom Box of 2 allows you to pair any two 50ml EDP bottles of your choice for a flat price of ₹4,999 (saving up to ₹4,600 compared to individual prices). Plus, it includes a luxury custom gift box and free express pan-India shipping.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD) and Free Shipping?',
      a: 'Yes! We offer pan-India Cash on Delivery (COD) as well as prepaid payments (UPI, Credit/Debit Cards, NetBanking). Shipping is 100% FREE on all orders over ₹2,000.',
    },
    {
      q: 'Are E’MPIRE fragrances skin-safe and cruelty-free?',
      a: 'Absolutley. Every formulation is meticulously batch-tested, IFRA compliant, cruelty-free, and crafted using high-grade essential oils and natural extracts.',
    },
    {
      q: 'What should I do if my package arrives damaged?',
      a: 'In the rare event of damage during transit, contact us via WhatsApp at +91 9911261347 or email empire.official2026@gmail.com with your unboxing video within 48 hours for an instant replacement.',
    },
  ];

  return (
    <section className="py-20 bg-charcoal-800/40 border-t border-gold-500/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Support & Inquiries
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 gold-text-gradient">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Everything you need to know about our formulations, shipping, and bespoke services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-charcoal-900 border border-gray-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-serif text-base sm:text-lg font-bold text-white flex items-center justify-between gap-4 hover:text-gold-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 font-light leading-relaxed border-t border-gray-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
