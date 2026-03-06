'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { submitReviewAction, markHelpfulAction } from '@/lib/actions/reviews';

type Review = {
  id: string;
  author: string;
  company: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
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

function InteractiveStarRating({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            className={cn('h-5 w-5 transition-colors', star <= rating ? 'text-pbs-gold fill-pbs-gold' : 'text-pbs-gray-300 dark:text-pbs-gray-600 hover:text-pbs-gold')}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    await submitReviewAction({
      productId,
      author: formData.get('author') as string,
      company: (formData.get('company') as string) || '',
      rating: formRating,
      text: formData.get('text') as string,
    });

    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    form.reset();
    setFormRating(5);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleHelpful = async (reviewId: string) => {
    if (helpedIds.has(reviewId)) return;
    setHelpedIds((prev) => new Set(prev).add(reviewId));
    await markHelpfulAction(reviewId);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm font-semibold text-pbs-gray-900 dark:text-white">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
                ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
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
                name="author"
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
                name="company"
                placeholder="Your Business"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
              Rating
            </label>
            <InteractiveStarRating rating={formRating} onChange={setFormRating} />
          </div>
          <div>
            <label className="block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2">
              Your Review
            </label>
            <textarea
              name="text"
              required
              rows={3}
              placeholder="Tell us about your experience with this product..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </Button>
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
      {reviews.length === 0 && !submitted ? (
        <p className="text-sm text-pbs-gray-400 dark:text-pbs-gray-500">No reviews yet. Be the first to leave a review!</p>
      ) : (
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
                    {review.company && (
                      <span className="text-xs text-pbs-gray-400 dark:text-pbs-gray-500">
                        {review.company}
                      </span>
                    )}
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
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpedIds.has(review.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs transition-colors',
                    helpedIds.has(review.id)
                      ? 'text-pbs-red cursor-default'
                      : 'text-pbs-gray-400 hover:text-pbs-red',
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful ({helpedIds.has(review.id) ? review.helpful + 1 : review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
