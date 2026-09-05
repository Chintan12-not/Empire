'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ScentQuizModalProps {
  onClose: () => void;
}

export default function ScentQuizModal({ onClose }: ScentQuizModalProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    vibe: '',
    occasion: '',
    intensity: '',
    gender: '',
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const questions = [
    {
      step: 1,
      title: 'What fragrance vibe describes your personality best?',
      key: 'vibe',
      options: [
        { label: 'Smoky, Boozy & Intoxicating', value: 'smoky' },
        { label: 'Fresh, Crisp & Aquatic', value: 'fresh' },
        { label: 'Soft, Romantic & Floral', value: 'floral' },
        { label: 'Warm Amber, Spices & Oud', value: 'amber' },
      ],
    },
    {
      step: 2,
      title: 'When will you wear this fragrance most often?',
      key: 'occasion',
      options: [
        { label: 'Evening Parties & Power Moments', value: 'evening' },
        { label: 'Daily Wear, Office & Fresh Mornings', value: 'daily' },
        { label: 'Romantic Dates & Intimate Nights', value: 'date' },
        { label: 'Royal Occasions & Special Events', value: 'royal' },
      ],
    },
    {
      step: 3,
      title: 'Which gender preference fits your style?',
      key: 'gender',
      options: [
        { label: 'For Him (Masculine)', value: 'him' },
        { label: 'For Her (Feminine)', value: 'her' },
        { label: 'Unisex (Versatile & Universal)', value: 'unisex' },
      ],
    },
  ];

  const handleSelectOption = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Calculate recommendation
      calculateRecommendation(newAnswers);
    }
  };

  const calculateRecommendation = (finalAnswers: typeof answers) => {
    // Match logic
    if (finalAnswers.gender === 'him' && finalAnswers.vibe === 'smoky') {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'whisky') || PRODUCTS[0]);
    } else if (finalAnswers.vibe === 'fresh') {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'ocean') || PRODUCTS[1]);
    } else if (finalAnswers.gender === 'her' && finalAnswers.vibe === 'floral') {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'blush') || PRODUCTS[2]);
    } else if (finalAnswers.vibe === 'amber' || finalAnswers.occasion === 'royal') {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'crown') || PRODUCTS[4]);
    } else if (finalAnswers.gender === 'him') {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'supermale') || PRODUCTS[5]);
    } else {
      setRecommendedProduct(PRODUCTS.find((p) => p.id === 'pearforest') || PRODUCTS[3]);
    }
    setStep(4); // Show result step
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ vibe: '', occasion: '', intensity: '', gender: '' });
    setRecommendedProduct(null);
  };

  const currentQ = questions[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-charcoal-800 border border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step <= questions.length ? (
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-gold-400 font-mono mb-2">
              <span>STEP {step} OF {questions.length}</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Scent Finder
              </span>
            </div>
            <div className="w-full h-1 bg-charcoal-900 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-gold-gradient transition-all duration-300"
                style={{ width: `${(step / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
              {currentQ.title}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.key, opt.value)}
                  className="w-full text-left p-4 rounded-2xl bg-charcoal-900 border border-gray-800 hover:border-gold-500 hover:bg-gold-500/10 transition-all font-serif text-sm sm:text-base text-gray-200 hover:text-gold-300 flex items-center justify-between group"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gold-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Result Step */
          recommendedProduct && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Perfect Match Found
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                We Recommend: <span className="gold-text-gradient">{recommendedProduct.name}</span>
              </h3>
              <p className="text-xs text-gray-400 italic mb-6">{recommendedProduct.tagline}</p>

              {/* Product Card Highlight */}
              <div className="bg-charcoal-900 border border-gold-500/30 rounded-2xl p-4 flex items-center gap-4 text-left mb-8">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-800 shrink-0">
                  <Image src={recommendedProduct.img} alt={recommendedProduct.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                    {recommendedProduct.genderLabel} • 50ml EDP
                  </span>
                  <h4 className="font-serif text-base font-bold text-white">{recommendedProduct.name}</h4>
                  <div className="text-sm font-bold gold-text-gradient mt-1">
                    ₹{recommendedProduct.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addItem(recommendedProduct);
                    setIsAdded(true);
                    setTimeout(() => {
                      setIsAdded(false);
                      onClose();
                    }, 1200);
                  }}
                  disabled={isAdded}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-500 text-charcoal-900'
                      : 'bg-gold-gradient text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add Match to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-xl bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
