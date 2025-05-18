import { Link } from 'react-router-dom';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-24 bg-cream-light flex items-center">
      <div className="container-custom text-center py-16">
        <h1 className="text-9xl font-heading font-bold text-burgundy mb-4">404</h1>
        <h2 className="text-3xl mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;