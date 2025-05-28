import React from 'react';
import { Mail } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

const staticQueries = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Inquiry about order #12345',
    message: 'I have a question regarding the shipping status of my order.',
    date: '2023-10-26',
    status: 'Open'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Issue with product XYZ',
    message: 'The product I received is damaged. How can I get a replacement?',
    date: '2023-10-25',
    status: 'Closed'
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.j@example.com',
    subject: 'Question about return policy',
    message: 'What is your return policy for items purchased online?',
    date: '2023-10-24',
    status: 'Open'
  },
];

const CustomerQueriesPage = () => {
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
        <h1 className="text-3xl font-heading mb-8">Customer Queries</h1>

        {staticQueries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customer queries found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {staticQueries.map(query => (
              <div key={query.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{query.subject}</h3>
                    <p className="text-sm text-gray-600">From: {query.name} ({query.email})</p>
                    <p className="text-sm text-gray-500">Date: {query.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    query.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                    query.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {query.status}
                  </span>
                </div>
                <p className="text-gray-700">{query.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerQueriesPage; 