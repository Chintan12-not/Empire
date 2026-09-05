'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import AudioPlayer from './AudioPlayer';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const cartTotals = useCartStore((state) => state.getTotals());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/products' },
    { name: 'Custom Duo Box', href: '/custom-box', isSpecial: true },
    { name: 'Scent Quiz', href: '/scent-quiz' },
    { name: 'Our Story', href: '/our-story' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-charcoal-900/90 backdrop-blur-md border-b border-gold-500/10 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-charcoal-900/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger & Main Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-gold-500 transition-colors p-1"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wider transition-colors relative py-1 ${
                    isActive ? 'text-gold-500' : 'text-gray-300 hover:text-gold-400'
                  } ${link.isSpecial ? 'flex items-center gap-1.5 text-gold-400 font-semibold' : ''}`}
                >
                  {link.isSpecial && <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-500" />}
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-gradient rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Brand Logo & Title */}
        <Link href="/" className="flex flex-col items-center group">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="E'MPIRE Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            />
          </div>
          <span className="font-serif tracking-[0.25em] text-lg sm:text-xl font-bold gold-text-gradient mt-1">
            E’MPIRE
          </span>
        </Link>

        {/* Right: Actions (Audio, Wishlist, Cart, User) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Audio Player Toggle */}
          <AudioPlayer />

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative text-gray-300 hover:text-gold-500 transition-colors p-1"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-charcoal-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* User Profile / Auth Modal */}
          {user ? (
            <Link
              href="/my-orders"
              className="text-gray-300 hover:text-gold-500 transition-colors p-1"
              aria-label="My Orders"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500" />
            </Link>
          ) : (
            <button
              onClick={openAuthModal}
              className="hidden sm:inline-flex text-xs font-semibold tracking-widest uppercase px-3 py-1.5 border border-gold-500/30 text-gold-400 hover:border-gold-500 hover:bg-gold-500/10 rounded-full transition-all"
            >
              Login
            </button>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            className="relative bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal-900" />
            <span className="text-xs sm:text-sm font-bold">{cartTotals.totalItems}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-6 border-b border-gray-800">
            <span className="font-serif gold-text-gradient text-xl font-bold tracking-widest">E’MPIRE</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider text-gray-200 hover:text-gold-400 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                {link.isSpecial && <Sparkles className="w-4 h-4 text-gold-500" />}
              </Link>
            ))}
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif tracking-wider text-gray-200 hover:text-gold-400 transition-colors pt-4 border-t border-gray-800"
            >
              My Orders & Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
