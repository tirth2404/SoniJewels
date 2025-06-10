import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, CheckCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters.js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    First_name: '',
    Last_name: '',
    phone: '',
    Address: '',
    City: '',
    State: '',
    Zip_code: '',
    Country: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'credit-card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty.');
    }
  }, [items, navigate]);

  const handleShippingInputChange = (e) => {
    const { id, value } = e.target;
    setShippingDetails({ ...shippingDetails, [id]: value });
  };

  const handleSubmitShipping = (e) => {
    console.log('handleSubmitShipping triggered');
    e.preventDefault();
    setStep(2);
    console.log('Step set to 2');
    window.scrollTo(0, 0);
  };

  const handleSubmitPayment = async (e) => {
    console.log('handleSubmitPayment triggered');
    e.preventDefault();

    if (!user?.id) {
      console.log('User ID not found, stopping order submission');
      toast.error('User is not logged in. Please log in to place an order.');
      // Optionally redirect to login page
      // navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      user_id: user.id, // Use user.id now that we've checked it exists
      ...shippingDetails,
      total: totalAmount,
      items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })), // Include cart items data
    };

    try {
      const response = await axios.post('http://localhost/SoniJewels/server/add_order.php', orderData);

      if (response.data.success) {
        setStep(3);
        setOrderPlaced(true);
        // Clear cart after successful order (optional - uncomment if you have clearCart in cartSlice)
        // dispatch(clearCart());
        toast.success('Order placed successfully!');
      } else {
        // Handle API error
        setError(response.data.error || 'Failed to place order.');
        toast.error(response.data.error || 'Failed to place order.');
      }
    } catch (err) {
      // Handle network or other errors
      console.error('Error placing order:', err);
      setError('An error occurred while placing your order.');
      // Check if it's a network error (e.g., backend is down)
      if (axios.isAxiosError(err) && !err.response) {
           toast.error('Network Error: Could not connect to the server.');
      } else {
           toast.error(error || 'An error occurred.'); // Use the state error or a generic one
      }

    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-md shadow-sm text-center">
            <div className="mb-6 text-green-500 flex justify-center">
              <CheckCircle size={64} />
            </div>
            <h1 className="text-3xl font-heading mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. We've sent a confirmation to your email.
            </p>
            <div className="bg-cream-light p-4 rounded-md mb-6">
              <p className="font-medium mb-2">Order Reference: #SR238951</p>
              <p className="text-gray-600">
                Please keep this reference for tracking your order.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
              <Link to="/shop" className="btn btn-outline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8 text-center">
          <h1 className="text-3xl font-heading mb-4">Your cart is empty</h1>
          <p className="mb-6">Add some products to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="btn btn-primary">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">Checkout</h1>
        
        <div className="flex justify-between items-center mb-8 max-w-2xl">
          <div 
            className={`flex flex-col items-center ${
              step >= 1 ? 'text-burgundy' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 1 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-sm">Shipping</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 ${
            step >= 2 ? 'bg-burgundy' : 'bg-gray-200'
          }`}></div>
          
          <div 
            className={`flex flex-col items-center ${
              step >= 2 ? 'text-burgundy' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 2 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-sm">Payment</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 ${
            step >= 3 ? 'bg-burgundy' : 'bg-gray-200'
          }`}></div>
          
          <div 
            className={`flex flex-col items-center ${
              step >= 3 ? 'text-burgundy' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 3 ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-sm">Confirmation</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-md shadow-sm">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                  <form onSubmit={handleSubmitShipping}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="First_name" className="form-label">First Name</label>
                        <input 
                          type="text" 
                          id="First_name" 
                          className="form-input" 
                          value={shippingDetails.First_name}
                          onChange={handleShippingInputChange}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="Last_name" className="form-label">Last Name</label>
                        <input 
                          type="text" 
                          id="Last_name" 
                          className="form-input" 
                          value={shippingDetails.Last_name}
                          onChange={handleShippingInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="form-input" 
                        value={shippingDetails.phone}
                        onChange={handleShippingInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="Address" className="form-label">Address</label>
                      <input 
                        type="text" 
                        id="Address" 
                        className="form-input" 
                        value={shippingDetails.Address}
                        onChange={handleShippingInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label htmlFor="City" className="form-label">City</label>
                        <input 
                          type="text" 
                          id="City" 
                          className="form-input" 
                          value={shippingDetails.City}
                          onChange={handleShippingInputChange}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="State" className="form-label">State</label>
                        <input 
                          type="text" 
                          id="State" 
                          className="form-input" 
                          value={shippingDetails.State}
                          onChange={handleShippingInputChange}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="Zip_code" className="form-label">ZIP Code</label>
                        <input 
                          type="text" 
                          id="Zip_code" 
                          className="form-input" 
                          value={shippingDetails.Zip_code}
                          onChange={handleShippingInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="Country" className="form-label">Country</label>
                      <select 
                        id="Country" 
                        className="form-input" 
                        value={shippingDetails.Country}
                        onChange={handleShippingInputChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary flex items-center">
                      Continue to Payment <ChevronRight size={16} className="ml-1" />
                    </button>
                  </form>
                </>
              )}
              
              {step === 2 && (
                <>
                  {console.log('Rendering Step 2 (Payment Information)')}
                  <h2 className="text-xl font-medium mb-4">Payment Information</h2>
                  <form onSubmit={handleSubmitPayment}>
                    <div className="mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="credit-card" 
                            name="payment-method" 
                            className="h-4 w-4 text-burgundy border-gray-300 focus:ring-burgundy" 
                            defaultChecked
                            onChange={() => setPaymentDetails({ ...paymentDetails, paymentMethod: 'credit-card' })}
                          />
                          <label htmlFor="credit-card" className="ml-2 text-sm font-medium">
                            Credit Card
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="paypal" 
                            name="payment-method" 
                            className="h-4 w-4 text-burgundy border-gray-300 focus:ring-burgundy" 
                            onChange={() => setPaymentDetails({ ...paymentDetails, paymentMethod: 'paypal' })}
                          />
                          <label htmlFor="paypal" className="ml-2 text-sm font-medium">
                            PayPal
                          </label>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 p-4 rounded-md">
                        <div className="flex items-center mb-4">
                          <CreditCard size={24} className="text-gray-500 mr-2" />
                          <span className="font-medium">Credit Card Information</span>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="card-name" className="form-label">Cardholder Name</label>
                          <input 
                            type="text" 
                            id="card-name" 
                            className="form-input" 
                            required 
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="card-number" className="form-label">Card Number</label>
                          <input 
                            type="text" 
                            id="card-number" 
                            className="form-input" 
                            placeholder="XXXX XXXX XXXX XXXX" 
                            required 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="form-label">Expiration Date</label>
                            <input 
                              type="text" 
                              id="expiry" 
                              className="form-input" 
                              placeholder="MM/YY" 
                              required 
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="form-label">CVV</label>
                            <input 
                              type="text" 
                              id="cvv" 
                              className="form-input" 
                              placeholder="XXX" 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-start">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 mt-1 text-burgundy border-gray-300 focus:ring-burgundy rounded" 
                          required 
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I agree to the <Link to="/" className="text-burgundy hover:underline">Terms and Conditions</Link> and <Link to="/" className="text-burgundy hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="btn btn-outline"
                      >
                        Back to Shipping
                      </button>
                      <button
                          type="submit"
                          className="btn btn-primary flex items-center"
                          disabled={loading}
                          onClick={() => console.log('Place Order button clicked')}
                      >
                           {loading ? 'Processing...' : <>Place Order <ChevronRight size={16} className="ml-1" /></>}
                        </button>
                    </div>
                  </form>
                </>
              )}
              
              {step === 3 && !orderPlaced && (
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-4">Confirming Order...</h2>
                  {error && (
                    <p className="text-red-500 mt-4">{error}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-md shadow-sm sticky top-24">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2 pb-2 border-b border-gray-100">
                    <div className="flex">
                      <div className="w-10 h-10 flex-shrink-0 mr-2">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(totalAmount * 0)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-burgundy">{formatPrice(totalAmount)}</span>
                </div>
              </div>
              
              {step === 1 && (
                <div className="bg-cream-light p-4 rounded-md text-sm text-gray-600">
                  <p className="mb-2 font-medium">Secure Checkout</p>
                  <p>Your information is protected by 256-bit SSL encryption.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;