'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-charcoal-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-1">
          LEGAL & POLICIES
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white gold-text-gradient mb-8">
          Terms & Conditions
        </h1>

        <div className="bg-charcoal-800 rounded-3xl border border-gray-800 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
          <section>
            <h3 className="font-serif text-lg font-bold text-white mb-2">1. Usage Guidelines</h3>
            <p>
              All perfumes sold by E’MPIRE PERFUMES are strictly for external cosmetic application. A skin patch test is strongly advised before regular use.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-white mb-2">2. Return & Hygiene Policy</h3>
            <p>
              Due to strict hygiene standards in personal fragrance care, unsealed or opened flacons are non-returnable. Refunds or replacements apply exclusively to items damaged during transit with verified unboxing video proof within 48 hours.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-white mb-2">3. Shipping & COD Terms</h3>
            <p>
              Free express shipping applies to all orders with net value exceeding ₹2,000 across India. Cash on Delivery (COD) orders are subject to address verification.
            </p>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-white mb-2">4. Intellectual Property</h3>
            <p>
              E’MPIRE, logo marks, flacon designs, and content are protected intellectual property of E’MPIRE Perfumes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
