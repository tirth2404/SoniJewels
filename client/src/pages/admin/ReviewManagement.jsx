import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, X, ChevronLeft, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReviewManagement = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/SoniJewels/server/reviews/get_all_reviews.php');
      setReviews(response.data.reviews);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      const response = await axios.post('http://localhost/SoniJewels/server/reviews/update_review_status.php', {
        review_id: reviewId,
        status: newStatus
      });
      
      if (response.data.message) {
        toast.success('Review status updated successfully');
        fetchReviews(); // Refresh the list
      } else {
        throw new Error('Failed to update review status');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update review status');
      console.error('Error updating review status:', err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost/SoniJewels/server/reviews/delete_review.php?id=${reviewId}`);
      toast.success('Review deleted successfully');
      fetchReviews(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

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
        <button
          onClick={() => window.history.back()}
          className="rounded-full mb-4 w-10 h-10 flex items-center justify-center border-2 border-burgundy bg-white group hover:bg-burgundy transition-colors shadow"
          aria-label="Back to Admin Dashboard"
          type="button"
        >
          <ChevronLeft size={28} strokeWidth={3} className="text-burgundy group-hover:text-gold transition-colors" />
        </button>
        <h1 className="text-3xl font-heading mb-8">Product Reviews Management</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <nav className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-burgundy text-burgundy'
                    : 'text-gray-500 hover:text-burgundy'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                <div className="flex items-center">
                  <Star size={18} className="mr-2" />
                  Reviews
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'reviews' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Comment</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {review.profilePicture ? (
                              <img
                                src={`http://localhost${review.profilePicture}`}
                                alt={review.Username}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">{review.Username?.[0]}</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{review.Username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{review.product_name || `Product #${review.product_id}`}</td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{review.comment}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getStatusBadge(review.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {review.status === 'approved' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              className="text-red-500 hover:text-red-700"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'pending')}
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Make Pending"
                            >
                              <Clock size={18} />
                            </button>
                          </>
                        )}
                        {review.status === 'rejected' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'approved')}
                              className="text-green-500 hover:text-green-700"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'pending')}
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Make Pending"
                            >
                              <Clock size={18} />
                            </button>
                          </>
                        )}
                        {review.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'approved')}
                              className="text-green-500 hover:text-green-700"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              className="text-red-500 hover:text-red-700"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;