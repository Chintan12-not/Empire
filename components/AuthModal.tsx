'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
    });
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-charcoal-800 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30 mb-2">
            <Sparkles className="w-3 h-3" /> E’MPIRE Elite Circle
          </span>
          <h3 className="font-serif text-2xl font-bold text-white gold-text-gradient">
            {isSignUp ? 'Create Elite Account' : 'Sign In to Atelier'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Access private batch drops, order history, and exclusive rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ANTY07, AMRIT09"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-gold-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Register & Join' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-800 text-xs text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gold-400 font-bold hover:underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
