import React, { useState } from 'react';
import { MessageSquare, Star, Check, X } from 'lucide-react';

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

  const queries = [
    {
      id: 1,
      customer: 'Mike Johnson',
      subject: 'Custom Order Inquiry',
      message: 'I am interested in getting a custom engagement ring made. What is the process?',
      date: '2024-02-20',
      status: 'open'
    },
    // Add more sample queries
  ];

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">Reviews & Queries Management</h1>

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
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'queries'
                    ? 'border-b-2 border-burgundy text-burgundy'
                    : 'text-gray-500 hover:text-burgundy'
                }`}
                onClick={() => setActiveTab('queries')}
              >
                <div className="flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  Customer Queries
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Message</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {queries.map((query) => (
                    <tr key={query.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{query.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{query.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{query.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(query.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          query.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-burgundy hover:text-burgundy-dark">
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement