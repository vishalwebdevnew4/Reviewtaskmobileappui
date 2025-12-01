import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Star, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { reviewQueries, taskQueries, userQueries } from '../db/queries';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { emailService } from '../config/email';

interface ReviewManagementScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  taskId?: number;
}

export function ReviewManagementScreen({ onNavigate, onBack, taskId }: ReviewManagementScreenProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (taskId) {
      loadReviews();
      const taskData = taskQueries.getTaskById(taskId);
      setTask(taskData);
    } else {
      setLoading(false);
    }
  }, [taskId, filter]);

  const loadReviews = () => {
    if (!taskId) return;
    
    setLoading(true);
    try {
      const allReviews = reviewQueries.getReviewsByTask(taskId);
      const filtered = filter === 'all' 
        ? allReviews 
        : allReviews.filter(r => r.status === filter);
      setReviews(filtered);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    if (!taskId) return;
    
    setProcessingId(reviewId);
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        const taskData = taskQueries.getTaskById(taskId);
        reviewQueries.updateReviewStatus(reviewId, 'approved');
        
        // Send email notification
        const reviewer = userQueries.getUserById(review.user_id);
        if (reviewer?.email && taskData) {
          emailService.sendReviewApprovalEmail(reviewer.email, taskData.title, taskData.reward).catch(err => {
            console.error('Failed to send approval email:', err);
          });
        }
        
        loadReviews();
      }
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reviewId: number) => {
    if (!taskId) return;
    
    // Show feedback form if not already shown
    if (showFeedback !== reviewId) {
      setShowFeedback(reviewId);
      setFeedbackText('');
      setFeedbackRating(0);
      return;
    }
    
    setProcessingId(reviewId);
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        const taskData = taskQueries.getTaskById(taskId);
        reviewQueries.updateReviewStatus(
          reviewId, 
          'rejected', 
          feedbackText || undefined, 
          feedbackRating > 0 ? feedbackRating : undefined
        );
        
        // Send email notification
        const reviewer = userQueries.getUserById(review.user_id);
        if (reviewer?.email && taskData) {
          emailService.sendReviewRejectionEmail(
            reviewer.email, 
            taskData.title, 
            feedbackText || 'Review did not meet requirements'
          ).catch(err => {
            console.error('Failed to send rejection email:', err);
          });
        }
        
        setShowFeedback(null);
        setFeedbackText('');
        setFeedbackRating(0);
        loadReviews();
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Clock className="w-5 h-5 text-[#FFB93F]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#22C55E]/10 text-[#22C55E]';
      case 'rejected':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      default:
        return 'bg-[#FFB93F]/10 text-[#FFB93F]';
    }
  };

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Review Management</h1>
        {task && (
          <p className="text-[#666666] text-sm">{task.title}</p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-[12px] whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-[#6B4BFF] text-white'
                  : 'bg-[#F6F6F9] text-[#666666]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({reviews.filter(r => f === 'all' || r.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[#666666]" />
            </div>
            <h3 className="text-[#111111] mb-2">No reviews found</h3>
            <p className="text-[#666666]">
              {filter === 'all' 
                ? 'No reviews have been submitted yet for this task.'
                : `No ${filter} reviews found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-[20px] p-6 shadow-md">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#6B4BFF] font-semibold">
                        {review.user_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[#111111]">{review.user_name || 'Anonymous'}</h3>
                      <p className="text-sm text-[#666666]">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(review.status)}`}>
                    {getStatusIcon(review.status)}
                    <span className="text-xs font-medium capitalize">{review.status}</span>
                  </div>
                </div>

                {/* Rating */}
                {review.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-[#FFB93F] text-[#FFB93F]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#666666]">{review.rating}/5</span>
                  </div>
                )}

                {/* Review Text */}
                {review.review_text && (
                  <p className="text-[#111111] mb-4">{review.review_text}</p>
                )}

                {/* Review Images */}
                {review.images && (() => {
                  try {
                    const images = JSON.parse(review.images);
                    const imageArray = Array.isArray(images) ? images : [images];
                    return imageArray.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {imageArray.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-[12px] overflow-hidden bg-[#F6F6F9]">
                            <ImageWithFallback
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}

                {/* Actions */}
                {review.status === 'pending' && (
                  <div className="pt-4 border-t border-gray-100">
                    {showFeedback === review.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#666666] mb-2">Feedback (Optional)</label>
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="e.g., Review too short, photos unclear, etc."
                            className="w-full p-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#666666] mb-2">Rate Reviewer (Optional)</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${
                                  star <= feedbackRating ? 'fill-[#FFB93F] text-[#FFB93F]' : 'text-gray-300'
                                }`}
                                onClick={() => setFeedbackRating(star === feedbackRating ? 0 : star)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            fullWidth
                            onClick={() => {
                              setShowFeedback(null);
                              setFeedbackText('');
                              setFeedbackRating(0);
                            }}
                            disabled={processingId === review.id}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            fullWidth
                            onClick={() => handleReject(review.id)}
                            disabled={processingId === review.id}
                          >
                            {processingId === review.id ? 'Rejecting...' : 'Confirm Reject'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          fullWidth
                          onClick={() => handleReject(review.id)}
                          disabled={processingId === review.id}
                          className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() => handleApprove(review.id)}
                          disabled={processingId === review.id}
                        >
                          {processingId === review.id ? 'Approving...' : 'Approve'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {review.status === 'approved' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-[#22C55E]">
                      ✓ Approved - Reward of ₹{task?.reward || 0} credited to reviewer
                    </p>
                  </div>
                )}

                {review.status === 'rejected' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-[#EF4444]">
                      ✗ Rejected - Review did not meet requirements
                    </p>
                    {review.feedback_text && (
                      <div className="bg-[#F6F6F9] rounded-[12px] p-3">
                        <p className="text-sm text-[#666666] mb-1">Feedback:</p>
                        <p className="text-sm text-[#111111]">{review.feedback_text}</p>
                      </div>
                    )}
                    {review.reviewer_rating && review.reviewer_rating > 0 && (
                      <div className="bg-[#F6F6F9] rounded-[12px] p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#666666]">Reviewer Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.reviewer_rating
                                    ? 'fill-[#FFB93F] text-[#FFB93F]'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#666666]">({review.reviewer_rating}/5)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

