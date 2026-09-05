'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode,
    getTotals,
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  const totals = getTotals();

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-charcoal-900 border-l border-gold-500/20 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gold-500" />
              <h2 className="font-serif text-lg font-bold text-white gold-text-gradient">
                Your Selection ({totals.totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-charcoal-800 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-charcoal-800/80 px-6 py-3 border-b border-gray-800">
            {totals.isFreeShipping ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <Truck className="w-4 h-4" />
                🎉 Congratulations! You unlocked Free Express Shipping.
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
                  <span>Add <strong>₹{totals.amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Shipping</span>
                  <span className="text-gold-400 font-mono">₹{totals.freeShippingThreshold}</span>
                </div>
                <div className="w-full h-1.5 bg-charcoal-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((totals.freeShippingThreshold - totals.amountNeededForFreeShipping) /
                          totals.freeShippingThreshold) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="flex gap-4 p-3.5 rounded-xl bg-charcoal-800/60 border border-gray-800/80 hover:border-gold-500/20 transition-all relative"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                    <Image
                      src={item.product.img}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="pr-6">
                      <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-gold-400 font-mono">{item.product.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-700 rounded-lg bg-charcoal-900">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold gold-text-gradient">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-rose-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4 stroke-1" />
                <p className="font-serif text-lg text-gray-300 mb-2">Your selection is empty</p>
                <p className="text-xs text-gray-500 mb-6">Discover our luxury collection to add scents.</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-gold-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider inline-block shadow-md"
                >
                  Explore Fragrances
                </Link>
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-charcoal-800/90 border-t border-gray-800 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. EMPIRE10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full bg-charcoal-900 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-charcoal-700 hover:bg-gold-500 hover:text-charcoal-900 text-xs font-bold text-gray-200 transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between text-xs bg-gold-500/10 border border-gold-500/30 px-3 py-1.5 rounded-lg text-gold-400">
                  <span>Applied Promo: <strong>{promoCode}</strong> ({discountPercent}% OFF)</span>
                  <button onClick={removePromoCode} className="text-gray-400 hover:text-white font-bold">✕</button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono">-₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-white font-mono">
                    {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-700">
                  <span>Grand Total</span>
                  <span className="gold-text-gradient text-base font-mono">
                    ₹{totals.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
