import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, CheckCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters.js';

const CheckoutPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const handleSubmitShipping = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      setOrderPlaced(true);
      window.scrollTo(0, 0);
    }, 1500);
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
  
  // If cart is empty, redirect to cart page
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
        
        {/* Checkout Steps */}
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
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-md shadow-sm">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                  <form onSubmit={handleSubmitShipping}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          className="form-input" 
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          className="form-input" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input 
                        type="text" 
                        id="address" 
                        className="form-input" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label htmlFor="city" className="form-label">City</label>
                        <input 
                          type="text" 
                          id="city" 
                          className="form-input" 
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="form-label">State</label>
                        <input 
                          type="text" 
                          id="state" 
                          className="form-input" 
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="form-label">ZIP Code</label>
                        <input 
                          type="text" 
                          id="zip" 
                          className="form-input" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="country" className="form-label">Country</label>
                      <select id="country" className="form-input" required>
                        <option value="">Select Country</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary flex items-center">
                      Continue to Payment <ChevronRight size={16} className="ml-1" />
                    </button>
                  </form>
                </>
              )}
              
              {/* Step 2: Payment Information */}
              {step === 2 && (
                <>
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
                          />
                          <label htmlFor="credit-card" className="ml-2 text-sm font-medium">
                            Credit Card
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="net-banking" 
                            name="payment-method" 
                            className="h-4 w-4 text-burgundy border-gray-300 focus:ring-burgundy" 
                          />
                          <label htmlFor="net-banking" className="ml-2 text-sm font-medium">
                            Net Banking
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="upi" 
                            name="payment-method" 
                            className="h-4 w-4 text-burgundy border-gray-300 focus:ring-burgundy" 
                          />
                          <label htmlFor="upi" className="ml-2 text-sm font-medium">
                            UPI
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
                      <button type="submit" className="btn btn-primary">
                        Place Order
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {/* Step 3: Processing Order */}
              {step === 3 && (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin mb-6">
                    <svg className="w-12 h-12 text-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium mb-2">Processing Your Order</h2>
                  <p className="text-gray-600">Please wait while we process your payment...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
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
                  <span>{formatPrice(totalAmount * 0.05)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-burgundy">{formatPrice(totalAmount * 1.05)}</span>
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