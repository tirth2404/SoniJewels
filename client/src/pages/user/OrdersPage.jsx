import React, { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample order data
  const orders = [
    {
      id: 'ORD001',
      date: '2024-02-20',
      total: 29999,
      status: 'pending',
      items: [
        { name: 'Diamond Ring', quantity: 1, price: 29999 }
      ],
      shipping: {
        address: '123 Main St, Mumbai, Maharashtra',
        method: 'Express Delivery'
      },
      payment: {
        method: 'Credit Card',
        last4: '4242'
      },
      timeline: [
        { date: '2024-02-20', status: 'Order Placed' },
        { date: '2024-02-21', status: 'Processing' }
      ]
    },
    {
      id: 'ORD002',
      date: '2024-02-15',
      total: 15999,
      status: 'delivered',
      items: [
        { name: 'Gold Necklace', quantity: 1, price: 15999 }
      ],
      shipping: {
        address: '456 Park Ave, Delhi, Delhi',
        method: 'Standard Delivery'
      },
      payment: {
        method: 'UPI',
        last4: '9876'
      },
      timeline: [
        { date: '2024-02-15', status: 'Order Placed' },
        { date: '2024-02-16', status: 'Processing' },
        { date: '2024-02-17', status: 'Shipped' },
        { date: '2024-02-19', status: 'Delivered' }
      ]
    }
  ];

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

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
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
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Shipping Details</h3>
                    <p className="text-sm text-gray-600">{order.shipping.address}</p>
                    <p className="text-sm text-gray-600">Method: {order.shipping.method}</p>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Payment Details</h3>
                    <p className="text-sm text-gray-600">
                      {order.payment.method} ending in {order.payment.last4}
                    </p>
                  </div>

                  {/* Order Timeline */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Order Timeline</h3>
                    <div className="space-y-2">
                      {order.timeline.map((event, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-burgundy"></div>
                          <div className="ml-4">
                            <p className="text-sm font-medium">{event.status}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button className="btn btn-outline flex items-center text-sm">
                      <FileText size={16} className="mr-2" />
                      View Invoice
                    </button>
                    <button className="btn btn-outline flex items-center text-sm">
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