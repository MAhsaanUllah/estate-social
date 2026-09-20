import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentReviews } from '../redux/reviewSlice';
import ReviewCard from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';
import { Star, MessageSquarePlus, Loader2 } from 'lucide-react';

export default function ReviewList({ agentId }) {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (agentId) {
      dispatch(fetchAgentReviews(agentId));
    }
  }, [dispatch, agentId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const userHasReviewed = user && reviews.some(r => r.reviewer?._id === user._id || r.reviewer === user._id);

  const handleOpenWrite = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
      
      {/* Header with Average Rating & Write Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Client Reviews ({reviews.length})</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-yellow-400">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-2xl font-black text-gray-900 ml-2">{avgRating}</span>
            </div>
            <span className="text-gray-400 font-medium">•</span>
            <span className="text-gray-500 font-medium text-sm">{reviews.length} verified reviews</span>
          </div>
        </div>

        {isAuthenticated && user?._id !== agentId && (
          <button
            onClick={userHasReviewed ? () => handleEditReview(reviews.find(r => r.reviewer?._id === user._id || r.reviewer === user._id)) : handleOpenWrite}
            className="inline-flex items-center space-x-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-md text-sm"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span>{userHasReviewed ? 'Edit Your Review' : 'Write a Review'}</span>
          </button>
        )}
      </div>

      {/* Reviews List */}
      {loading && reviews.length === 0 ? (
        <div className="py-12 text-center text-gray-400 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium mb-1">No reviews yet for this agent.</p>
          <p className="text-xs text-gray-400">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} onEdit={handleEditReview} />
          ))}
        </div>
      )}

      {/* Write / Edit Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agentId={agentId}
        existingReview={editingReview}
      />

    </div>
  );
}

