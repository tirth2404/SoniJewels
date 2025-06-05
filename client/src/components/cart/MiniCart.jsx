import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { closeCart, toggleCart } from '../../redux/slices/uiSlice.js';
import { removeFromCart, deleteFromCart, addToCart } from '../../redux/slices/cartSlice.js';
import { formatPrice } from '../../utils/formatters.js';

const MiniCart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  
  const handleCloseCart = () => {
    dispatch(closeCart());
  };
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleDeleteItem = (id) => {
    dispatch(deleteFromCart(id));
  };
  
  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform animate-slide-in">
      <div className="flex flex-col h-full">
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading text-xl flex items-center">
            <ShoppingBag size={20} className="mr-2" />
            Your Cart ({totalQuantity})
          </h2>
          <button
            onClick={handleCloseCart}
            className="text-gray-500 hover:text-burgundy transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto py-4 px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button
                onClick={handleCloseCart}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex border-b border-gray-100 pb-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-burgundy"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-gold font-medium">{formatPrice(item.price)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-sm"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(addToCart({
                          ...item,
                          quantity: 1
                        }))}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-medium">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">Shipping & taxes calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={handleCloseCart}
              className="btn btn-primary w-full mb-2"
            >
              Checkout
            </Link>
            <button
              onClick={handleCloseCart}
              className="btn btn-outline w-full"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;