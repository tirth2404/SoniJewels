import React, { useState, useEffect } from 'react';
import { ClipboardList, Star, ChevronLeft } from 'lucide-react';

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    total_feedback: 0,
    average_rating: 0,
    rating_distribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost/SoniJewels/server/feedback/get_feedback.php');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feedback');
      }

      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost/SoniJewels/server/feedback/get_feedback_stats.php');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to render stars with partial fills
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const partialFill = rating - fullStars;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={24}
          className="text-gold fill-gold"
        />
      );
    }

    // Add partial star if needed
    if (partialFill > 0) {
      stars.push(
        <div key="partial" className="relative">
          <Star
            size={24}
            className="text-gray-300"
          />
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialFill * 100}%` }}
          >
            <Star
              size={24}
              className="text-gold fill-gold"
            />
          </div>
        </div>
      );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={24}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };

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
        <h1 className="text-3xl font-heading mb-8">User Feedback</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Average Rating Display */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-heading mb-4">Average Rating</h2>
          <div className="flex items-center">
            <div className="flex mr-4">
              {renderStars(stats.average_rating)}
            </div>
            <span className="text-2xl font-semibold text-burgundy">
              {stats.average_rating.toFixed(1)} / 5
            </span>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total Feedback: {stats.total_feedback}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No feedback available</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Feedback</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedback.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="flex">
                          {renderStars(item.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.email || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.content}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage; 