import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, MessageSquare } from 'lucide-react';

const AdminPage = () => {
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/products" className="group">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-burgundy mb-4">
                <Package size={32} />
              </div>
              <h2 className="text-xl font-medium mb-2">Product Management</h2>
              <p className="text-gray-600">
                Manage your product inventory, add new items, and update stock levels.
              </p>
            </div>
          </Link>
          
          <Link to="/admin/orders" className="group">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-burgundy mb-4">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-xl font-medium mb-2">Order Management</h2>
              <p className="text-gray-600">
                View and manage orders, update order status, and track deliveries.
              </p>
            </div>
          </Link>
          
          <Link to="/admin/reviews" className="group">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-burgundy mb-4">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-xl font-medium mb-2">Reviews & Queries</h2>
              <p className="text-gray-600">
                Moderate customer reviews and respond to customer inquiries.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage