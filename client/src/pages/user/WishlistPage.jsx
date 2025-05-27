import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-12">
          <div className="text-center">
            <h1 className="text-3xl font-heading mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add items to your wishlist to keep track of your favorite products.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-12">
        <h1 className="text-3xl font-heading mb-8">Your Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              
              <div className="p-4">
                <Link to={`/product/${item.id}`} className="block">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2 capitalize">{item.category}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gold">₹{item.price}</span>
                  <span className="text-sm text-gray-500 capitalize">{item.material}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 btn btn-primary flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;