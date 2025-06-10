import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, X, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost/SoniJewels/server/reviews';

const ReviewsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching reviews for user:', user.id);
      const response = await axios.get(`${API_URL}/get_user_reviews.php?user_id=${user.id}`);
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        console.log('Reviews data:', response.data.reviews);
        setReviews(response.data.reviews);
      } else {
        console.error('API Error:', response.data.message);
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleUpdateReview = async () => {
    if (editRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!editComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      const response = await axios.post('http://localhost/SoniJewels/server/reviews/update_review.php', {
        review_id: editingReview.id,
        rating: editRating,
        comment: editComment.trim()
      });

      if (response.data.status === 'success') {
        toast.success('Review updated successfully');
        setEditingReview(null);
        setEditRating(0);
        setEditComment('');
        fetchUserReviews();
      } else {
        throw new Error(response.data.message || 'Failed to update review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update review');
      console.error('Error updating review:', err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost/SoniJewels/server/reviews/delete_review.php?id=${reviewId}`);
      
      if (response.data.status === 'success') {
        toast.success('Review deleted successfully');
        fetchUserReviews();
      } else {
        throw new Error(response.data.message || 'Failed to delete review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  const renderStars = (rating, interactive = false, onChange) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(i + 1) : undefined}
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

  if (!user) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl font-heading mb-4">My Reviews</h1>
            <p className="text-gray-500">Please login to view your reviews.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">My Reviews</h1>

        <div className="space-y-4">
          {!reviews || reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">You haven't written any reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                {editingReview?.id === review.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      {renderStars(editRating, true, setEditRating)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={4}
                        className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50"
                        placeholder="Write your review here..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateReview}
                        className="btn btn-primary"
                      >
                        Update Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    {console.log("Review data:", review)}
                    {console.log("Product image:", review.product_image)}
                    <img
                      src={review.product_image ? `http://localhost${review.product_image.replace(/\\/g, '/')}` : 'https://via.placeholder.com/80'}
                      alt={review.product_name}
                      className="w-20 h-20 object-cover rounded-md"
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1">{review.product_name}</h3>
                          <div className="flex mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="p-1 text-gray-400 hover:text-burgundy"
                            aria-label="Edit review"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-1 text-gray-400 hover:text-burgundy"
                            aria-label="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          review.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : review.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;