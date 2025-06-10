import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [shippedOrdersCount, setShippedOrdersCount] = useState(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post('http://localhost/SoniJewels/server/orders/update_order_status.php', {
        orderId: orderId,
        newStatus: newStatus
      });

      if (response.data.status === 'success') {
        // Update the status in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status:', response.data.message);
        setError('Failed to update order status: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Error updating order status.');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost/SoniJewels/server/orders/get_orders.php');
        console.log("API Response:", response.data);
        if (response.data.status === 'success') {
          setOrders(response.data.data);
          console.log("Orders data:", response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let pending = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;

    orders.forEach(order => {
      switch (order.status ? order.status.toLowerCase() : 'unknown') {
        case 'pending':
          pending++;
          break;
        case 'shipped':
          shipped++;
          break;
        case 'delivered':
          delivered++;
          break;
        case 'cancelled':
          cancelled++;
          break;
        default:
          break;
      }
    });

    setPendingOrdersCount(pending);
    setShippedOrdersCount(shipped);
    setDeliveredOrdersCount(delivered);
    setCancelledOrdersCount(cancelled);
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-3xl font-heading mb-8">Order Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="text-burgundy" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-xl font-medium">{pendingOrdersCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Truck className="text-burgundy" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Shipped</p>
                <p className="text-xl font-medium">{shippedOrdersCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="text-burgundy" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-xl font-medium">{deliveredOrdersCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="text-burgundy" size={24} />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-xl font-medium">{cancelledOrdersCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Products</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {`${order.First_name} ${order.Last_name}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.total ? `₹${parseFloat(order.total).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status ? order.status.toLowerCase() : 'unknown')}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.Username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {`${order.Address || ''}, ${order.City || ''}, ${order.State || ''}, ${order.Zip_code || ''}, ${order.Country || ''}`.replace(/, \s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items && order.items.length > 0 ? (
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>{item.product_name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <select
                        className="form-input py-1 px-2 text-sm"
                        value={order.status ? order.status.toLowerCase() : 'unknown'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;