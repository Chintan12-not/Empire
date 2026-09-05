'use client';

import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919911261347?text=Hello%20E%27MPIRE%20Perfumes%2C%20I%20would%20like%20to%20inquire%20about%20your%20fragrance%20collection."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:scale-110 group"
      title="Chat with E'MPIRE Concierge on WhatsApp"
      aria-label="WhatsApp Concierge"
    >
      <Phone className="w-6 h-6 fill-white" />
      <span className="absolute right-14 bg-charcoal-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        Chat Concierge
      </span>
    </a>
  );
}
