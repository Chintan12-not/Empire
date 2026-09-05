'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 border-t border-gold-500/10 text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/images/logo.png" alt="E'MPIRE Logo" fill className="object-contain" />
              </div>
              <span className="font-serif gold-text-gradient text-xl font-bold tracking-widest">
                E’MPIRE
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Experience India’s finest luxury Eau De Parfums. Meticulously handcrafted for elegance, presence, and unforgettable memories.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/empireperfumes.official?igsh=MTRrZTNyMWVicGM3Mg=="
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-700 hover:bg-gold-500 hover:text-charcoal-900 border border-gray-800 flex items-center justify-center transition-all text-gray-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919911261347"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-700 hover:bg-emerald-500 hover:text-white border border-gray-800 flex items-center justify-center transition-all text-gray-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold tracking-wider mb-6 gold-text-gradient">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-400 transition-colors">
                  Fragrance Collection
                </Link>
              </li>
              <li>
                <Link href="/custom-box" className="hover:text-gold-400 transition-colors">
                  Custom Duo Box (Buy 2)
                </Link>
              </li>
              <li>
                <Link href="/scent-quiz" className="hover:text-gold-400 transition-colors">
                  Find Your Scent Quiz
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-gold-400 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold tracking-wider mb-6 gold-text-gradient">
              Contact Atelier
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                <a href="mailto:empire.official2026@gmail.com" className="hover:text-gold-400 transition-colors">
                  empire.official2026@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="https://wa.me/919911261347" className="hover:text-gold-400 transition-colors">
                  +91 9911261347
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-1" />
                <span>Sector 31, Faridabad – 121003, Haryana, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold tracking-wider mb-4 gold-text-gradient">
              Join the Circle
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              Subscribe to receive private invitations for limited-edition batch drops and 10% off your first order.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
              <input
                type="email"
                placeholder="Enter email address..."
                className="w-full bg-charcoal-800 border border-gray-800 rounded-l-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-charcoal-900 px-4 py-2 rounded-r-lg font-bold transition-colors text-xs flex items-center justify-center"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 E’MPIRE PERFUMES. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-gold-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/faq" className="hover:text-gold-400 transition-colors">
              Shipping & Returns
            </Link>
            <Link href="/coming-soon" className="hover:text-gold-400 transition-colors">
              Upcoming Drops
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
