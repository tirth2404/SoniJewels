import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const CustomerQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost/SoniJewels/server/queries.php')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setQueries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load queries.');
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customer queries found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map(query => (
              <div key={query.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{query.subject}</h3>
                    <p className="text-sm text-gray-600">From: {query.name} ({query.email})</p>
                    <p className="text-sm text-gray-600">Phone: {query.phone}</p>
                    <p className="text-sm text-gray-500">Date: {query.submitted_at ? query.submitted_at.substring(0, 10) : ''}</p>
                  </div>
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