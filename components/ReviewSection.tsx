'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Plus, X, Camera, Sparkles } from 'lucide-react';
import { Review } from '@/types/product';

export default function ReviewSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: 'r1',
      name: 'Urvi Khandwala',
      stars: 5,
      date: '2026-02-12',
      text: 'Amazing fragrance! Smoked Whisky lasts for 10+ hours on clothes. Packaging feels so regal.',
      verified: true,
    },
    {
      id: 'r2',
      name: 'Karthikeyan Nagappan',
      stars: 5,
      date: '2026-02-14',
      text: 'Crown of Dunes is pure luxury in a bottle. Rich, warm amber and oud notes. Worth every rupee.',
      verified: true,
    },
    {
      id: 'r3',
      name: 'Ananya Verma',
      stars: 5,
      date: '2026-02-01',
      text: 'Pear Forest is my new signature everyday scent. Fruity green pear with crisp musk dry down.',
      verified: true,
    },
    {
      id: 'r4',
      name: 'Vikramaditya S.',
      stars: 5,
      date: '2026-01-20',
      text: 'Supermale has incredible projection. Got complimented twice at an evening event.',
      verified: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    const newRev: Review = {
      id: `r-${Date.now()}`,
      name: newName,
      stars: newRating,
      date: new Date().toISOString().split('T')[0],
      text: newText,
      verified: true,
      userPhoto: selectedPhoto || undefined,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsModalOpen(false);
    setNewName('');
    setNewText('');
    setSelectedPhoto(null);
  };

  return (
    <section className="py-20 bg-charcoal-900 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-gold-400 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="font-bold text-lg text-white">4.8 / 5.0</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white gold-text-gradient">
              Voices of E’MPIRE Connoisseurs
            </h2>
            <p className="text-gray-400 text-sm mt-1">Based on 500+ verified customer impressions across India</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-charcoal-800 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Write a Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsList.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-charcoal-800/60 border border-gray-800 flex flex-col justify-between hover:border-gold-500/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-gold-400">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{review.date}</span>
                </div>

                <p className="text-xs text-gray-300 font-light leading-relaxed italic mb-4">
                  “{review.text}”
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-white">{review.name}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-charcoal-800 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-charcoal-900 border border-gray-700 text-gray-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-white mb-2 gold-text-gradient">
              Share Your Fragrance Impression
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Your feedback inspires our master perfumers.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-gray-600 hover:text-gold-400 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= newRating ? 'fill-gold-400 text-gold-400' : 'text-gray-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya S."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your impression of the scent, longevity, and flacon elegance..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-charcoal-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              {/* Photo Upload Simulation */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Attach Photo (Optional)</label>
                <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-gold-500 transition-colors">
                  <Camera className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                  <span className="text-[11px] text-gray-400">Click to upload bottle image (JPG, PNG)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform"
              >
                Submit Impression
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
