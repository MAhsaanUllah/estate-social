import React from 'react';
import { Star, CheckCircle, Trash2, Edit } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview } from '../redux/reviewSlice';

export default function ReviewCard({ review, onEdit }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isOwner = user && (user._id === review.reviewer?._id || user._id === review.reviewer);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      dispatch(deleteReview(review._id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {review.reviewer?.avatar ? (
            <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
              {review.reviewer?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h4 className="font-bold text-gray-900 flex items-center space-x-1.5">
              <span>{review.reviewer?.name || 'Anonymous'}</span>
              {review.isVerifiedClient && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified Client
                </span>
              )}
            </h4>
            <span className="text-xs text-gray-400 font-medium">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
              />
            ))}
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center space-x-1 ml-3 border-l border-gray-100 pl-2">
              {onEdit && (
                <button onClick={() => onEdit(review)} className="p-1 text-gray-400 hover:text-gray-900 transition-colors" title="Edit Review">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete Review">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
    </div>
  );
}

