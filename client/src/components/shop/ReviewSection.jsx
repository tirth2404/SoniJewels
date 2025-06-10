import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReviewSection = ({ productId }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost/SoniJewels/server/reviews/get_reviews.php?product_id=${productId}`);
      setReviews(response.data.reviews);
      setStats(response.data.stats);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost/SoniJewels/server/reviews/add_review.php', {
        user_id: user.id,
        product_id: productId,
        rating: rating,
        comment: comment.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'success') {
        toast.success('Review submitted successfully');
        setShowReviewForm(false);
        setRating(0);
        setComment('');
        fetchReviews();
      } else {
        throw new Error(response.data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(i + 1) : undefined}
            className={`${interactive ? 'cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            <Star
              size={20}
              className={i < rating ? 'text-gold fill-gold' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading">Customer Reviews</h2>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="btn btn-outline"
        >
          Write a Review
        </button>
      </div>

      {/* Review Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center">
          <div className="flex mr-4">
            {renderStars(Math.round(stats?.average_rating || 0))}
          </div>
          <div>
            <span className="text-2xl font-semibold text-burgundy">
              {(stats?.average_rating || 0).toFixed(1)} / 5
            </span>
            <p className="text-sm text-gray-500">
              Based on {stats?.total_reviews || 0} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(rating, true)}
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                placeholder="Write your review here..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn btn-outline mr-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {!reviews || reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {review.profilePicture ? (
                    <img
                      src={`http://localhost${review.profilePicture}`}
                      alt={review.Username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{review.Username}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 