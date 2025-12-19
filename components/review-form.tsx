'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (formData.comment.length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setFormData({ rating: 5, title: '', comment: '' });
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">Please sign in to write a review</p>
        <Button onClick={() => router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.pathname))}>
          Sign In
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl"></span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
        <p className="text-gray-600">Thank you for your feedback on {productName}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFormData({ ...formData, rating: i + 1 })}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-4xl transition-colors focus:outline-none"
            >
              <span
                className={
                  i < (hoveredRating || formData.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
              >
                
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title (Optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Summarize your experience"
          className="input"
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="review-comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your thoughts about this product (minimum 10 characters)"
          className="input min-h-[120px] resize-y"
          required
          minLength={10}
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.comment.length}/1000 characters
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
