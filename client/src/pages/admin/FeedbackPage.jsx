import React from 'react';
import { ClipboardList } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

const staticFeedback = [
  {
    id: 1,
    name: 'Alice Wonderland',
    email: 'alice.w@example.com',
    feedback: 'The website design is beautiful and easy to navigate. Great job!',
    date: '2023-10-26',
  },
  {
    id: 2,
    name: 'Bob The Builder',
    email: 'bob.b@example.com',
    feedback: 'The loading time on the shop page is a bit slow. Could be improved.',
    date: '2023-10-25',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    feedback: 'Love the product range! Keep adding more unique pieces.',
    date: '2023-10-24',
  },
];

const FeedbackPage = () => {
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

        {staticFeedback.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {staticFeedback.map(feedbackItem => (
              <div key={feedbackItem.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">From: {feedbackItem.name} ({feedbackItem.email})</p>
                    <p className="text-sm text-gray-500">Date: {feedbackItem.date}</p>
                  </div>
                </div>
                <p className="text-gray-700">{feedbackItem.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage; 