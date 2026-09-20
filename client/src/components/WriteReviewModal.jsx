import React, { useState, useEffect, useRef } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createReview, updateReview } from '../redux/reviewSlice';
import Button from './ui/Button';

export default function WriteReviewModal({ isOpen, onClose, agentId, existingReview = null }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Focus management, scroll lock & escape listener
  useEffect(() => {
    if (!isOpen) return;

    // 1. Scroll Lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 2. Escape Key Listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Initial Focus
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (existingReview) {
      await dispatch(updateReview({ id: existingReview._id, data: { rating, comment } }));
    } else {
      await dispatch(createReview({ agent: agentId, rating, comment }));
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-150"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-review-modal-title"
          className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-lg max-w-md w-full overflow-hidden text-left animate-in zoom-in-95 fade-in-0 duration-200 ease-out z-10 p-6"
        >
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review modal"
            className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 id="write-review-modal-title" className="text-xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 mb-1 pr-8">
            {existingReview ? 'Edit Your Review' : 'Write an Agent Review'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
            Share your experience working with this agent to help others in the marketplace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Star Rating Select with h-10 w-10 Touch Targets */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star 
                      className={`w-6 h-6 transition-transform ${
                        star <= (hoverRating || rating) 
                          ? 'text-amber-400 fill-amber-400 scale-105' 
                          : 'text-gray-300 dark:text-zinc-700'
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 ml-3">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Your Review</label>
              <textarea
                ref={textareaRef}
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about the agent's responsiveness, local knowledge, and professionalism..."
                className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-zinc-100/10 focus:border-gray-900 dark:focus:border-zinc-100 transition-all duration-200 resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !comment.trim()}
                variant="primary"
                className="h-10 px-5 flex items-center space-x-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
              </Button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
