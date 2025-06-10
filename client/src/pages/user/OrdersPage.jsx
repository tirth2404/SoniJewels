import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Package, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user || !user.id) {
        setLoading(false);
        setError('User not logged in or user ID not available.');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost/SoniJewels/server/orders/get_orders.php?user_id=${user.id}`);
        
        if (response.data.status === 'success') {
          setUserOrders(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError('An error occurred while fetching your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Package size={20} />;
      case 'shipped': return <Truck size={20} />;
      case 'delivered': return <CheckCircle size={20} />;
      case 'cancelled': return <XCircle size={20} />;
      default: return <Package size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <p className="text-gray-600">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">My Orders</h1>

        <div className="space-y-4">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status || 'Unknown'}</span>
                    </span>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-gray-500 hover:text-burgundy"
                      aria-label={selectedOrder === order.id ? "Hide details" : "Show details"}
                    >
                      {selectedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {selectedOrder === order.id && (
                <div className="p-4 bg-gray-50">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Items</h3>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm items-center mb-2">
                          <div className="flex items-center">
                            {item.product_image_url && (
                              <img 
                                src={`http://localhost${item.product_image_url.replace(/\\/g, '/')}`}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded mr-4"
                              />
                            )}
                            {console.log("Product Image URL from backend:", item.product_image_url)}
                            {console.log("Constructed Image SRC:", `http://localhost${item.product_image_url ? item.product_image_url.replace(/\\/g, '/') : ''}`)}
                            <span>{item.product_name} x {item.quantity}</span>
                          </div>
                          <span>₹{parseFloat(item.price_at_purchase).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No items found for this order.</p>
                    )}
                    <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total ? parseFloat(order.total).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Shipping Details</h3>
                    <p className="text-sm text-gray-600">
                      {`${order.Address || ''}${order.Address && (order.City || order.State || order.Zip_code || order.Country) ? ', ' : ''}${order.City || ''}${order.City && (order.State || order.Zip_code || order.Country) ? ', ' : ''}${order.State || ''}${order.State && (order.Zip_code || order.Country) ? ', ' : ''}${order.Zip_code || ''}${order.Zip_code && order.Country ? ', ' : ''}${order.Country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Method: {order.shipping_method || 'N/A'}</p>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Payment Details</h3>
                    <p className="text-sm text-gray-600">
                      {order.payment_method || 'Payment method: N/A'}{order.payment_last4 ? ` ending in ${order.payment_last4}` : ''}
                    </p>
                  </div>

                  {/* Order Timeline */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Order Timeline</h3>
                    <div className="space-y-2">
                      {order.timeline && order.timeline.length > 0 ? (
                        order.timeline.map((event, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`w-2 h-2 mt-2 rounded-full ${event.status_changed_to.toLowerCase() === 'cancelled' ? 'bg-red-500' : 'bg-burgundy'}`}></div>
                            <div className="ml-4">
                              <p className="text-sm font-medium">{event.status_changed_to}</p>
                              <p className="text-xs text-gray-500">
                                {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">No detailed timeline available.</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => alert('View Invoice functionality to be implemented.')}
                      className="btn btn-outline flex items-center text-sm">
                      <FileText size={16} className="mr-2" />
                      View Invoice
                    </button>
                    <button 
                      onClick={() => alert('Download Invoice functionality to be implemented.')}
                      className="btn btn-outline flex items-center text-sm">
                      <Download size={16} className="mr-2" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;