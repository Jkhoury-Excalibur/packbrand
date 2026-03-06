'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

type Review = {
  id: number;
  author: string;
  company: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
};

const MOCK_REVIEWS: Record<string, Review[]> = {
  cups: [
    { id: 1, author: 'Maria L.', company: 'Go Picadera', rating: 5, date: '2026-02-15', text: 'Amazing quality! Our customers love seeing our logo on every cup. The colors came out perfect and delivery was fast.', helpful: 8 },
    { id: 2, author: 'Nina C.', company: 'Boba House', rating: 5, date: '2026-01-28', text: 'We ordered 1,000 cold cups and they look incredible. Great print quality and the minimum order was very reasonable.', helpful: 5 },
    { id: 3, author: 'Aisha J.', company: "Aisha's Kitchen", rating: 4, date: '2026-01-10', text: 'Good quality cups. Would have liked more size options but overall very happy with the branding.', helpful: 3 },
  ],
  bags: [
    { id: 1, author: 'James R.', company: 'Kimchi Smoke', rating: 5, date: '2026-02-10', text: 'Perfect bags for our takeout orders. Sturdy kraft paper and the logo print is sharp. Customers always comment on how nice they look.', helpful: 6 },
    { id: 2, author: 'Priya S.', company: 'Spice Route', rating: 4, date: '2026-01-20', text: 'Great quality bags at a fair price. The bilingual support made ordering so easy for our Spanish-speaking team.', helpful: 4 },
  ],
  boxes: [
    { id: 1, author: 'Carlos M.', company: 'Parriyas', rating: 5, date: '2026-02-01', text: 'Best pizza boxes we have used. Strong enough for delivery and our branding looks professional.', helpful: 7 },
    { id: 2, author: 'David O.', company: 'Slice & Dice', rating: 5, date: '2026-01-15', text: 'Excellent quality and the custom sizes were perfect for our menu. Will definitely reorder.', helpful: 4 },
  ],
  'food-containers': [
    { id: 1, author: 'Sofia P.', company: 'La Fortaleza', rating: 5, date: '2026-02-05', text: 'These food bowls are perfect for our rice and grain bowls. The branding makes our delivery orders look premium.', helpful: 5 },
    { id: 2, author: 'Luis T.', company: 'El Sabor Latino', rating: 4, date: '2026-01-18', text: 'Good containers, great price. The lids fit perfectly and nothing leaks. Our customers appreciate the branded packaging.', helpful: 3 },
  ],
  labels: [
    { id: 1, author: 'Ray N.', company: 'Pho Sure', rating: 5, date: '2026-01-25', text: 'These labels transformed our product packaging. The adhesive is strong and the print quality is excellent.', helpful: 6 },
    { id: 2, author: 'Marco E.', company: "Marco's Cafe", rating: 5, date: '2026-01-12', text: 'Great roll stickers! Easy to apply and the colors match our brand perfectly. Pantone matching was spot on.', helpful: 4 },
  ],
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(cls, star <= rating ? 'text-pbs-gold fill-pbs-gold' : 'text-pbs-gray-200 dark:text-pbs-gray-700')}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ category }: { category: string }) {
  const reviews = MOCK_REVIEWS[category] ?? MOCK_REVIEWS.cups;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={Math.round(avgRating)} size="md" />
            <span className="text-sm font-semibold text-pbs-gray-900 dark:text-white">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </div>

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Maria L."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Your Business"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
              Your Review
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell us about your experience with this product..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">Submit Review</Button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-pbs-gray-500 hover:text-pbs-gray-700 dark:hover:text-pbs-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            Thank you for your review! It will appear once approved.
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-pbs-gray-900 dark:text-white">
                    {review.author}
                  </span>
                  <span className="text-xs text-pbs-gray-400 dark:text-pbs-gray-500">
                    {review.company}
                  </span>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <span className="text-xs text-pbs-gray-400 dark:text-pbs-gray-500 shrink-0">
                {review.date}
              </span>
            </div>
            <p className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
              {review.text}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <button className="flex items-center gap-1.5 text-xs text-pbs-gray-400 hover:text-pbs-red transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
