import React, { useState } from 'react';
import { MessageSquare, Star, Check, X, ChevronLeft } from 'lucide-react';

const ReviewManagement = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  
  const reviews = [
    {
      id: 1,
      product: 'Diamond Solitaire Ring',
      customer: 'Jane Smith',
      rating: 5,
      comment: 'Absolutely beautiful ring! The craftsmanship is exceptional.',
      date: '2024-02-19',
      status: 'pending'
    },
    // Add more sample reviews
  ];

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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Comment</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{review.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{review.customer}</td>
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
                        {new Date(review.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="text-green-500 hover:text-green-700">
                          <Check size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <X size={18} />
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

export default ReviewManagement