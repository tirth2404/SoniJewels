import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart, deleteFromCart, clearCart } from '../redux/slices/cartSlice.js';
import { formatPrice } from '../utils/formatters.js';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleAddItem = (item) => {
    dispatch(addToCart(item));
  };
  
  const handleDeleteItem = (id) => {
    dispatch(deleteFromCart(id));
  };
  
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-md shadow-sm text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Quantity</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Price</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 mr-4">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="mx-3 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(addToCart({
                                ...item,
                                quantity: 1
                              }))}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-gray-400 hover:text-burgundy"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between mt-6">
                <Link to="/shop" className="btn btn-outline">
                  Continue Shopping
                </Link>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="btn btn-outline text-burgundy"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalQuantity} items)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(totalAmount * 0.05)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-burgundy">₹{formatPrice(totalAmount * 1.05)}</span>
                  </div>
                </div>
                
                <Link to="/checkout" className="btn btn-primary w-full mb-4">
                  Proceed to Checkout
                </Link>
              </div>
              
              {/* Coupon Code */}
              <div className="bg-white p-6 rounded-md shadow-sm mt-6">
                <h3 className="font-medium mb-3">Apply Coupon Code</h3>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    className="form-input rounded-r-none" 
                  />
                  <button className="btn btn-primary rounded-l-none">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;