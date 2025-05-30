import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist } from '../../redux/slices/wishlistSlice';

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    onClose();
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
    onClose();
  };

  if (!product) return null;

  // Get the first image from the images array
  const getImageUrl = () => {
    if (!product.images || !product.images.length) return '/placeholder.jpg';
    const imageUrl = product.images[0];
    if (imageUrl.startsWith('blob:')) return imageUrl;
    return `http://localhost/SoniJewels/server/uploads/${imageUrl}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 flex items-center justify-center p-4">
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-heading font-semibold">{product.name}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="relative group">
                    <img
                      src={getImageUrl()}
                      alt={product.name}
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
                  </div>

                  {/* Product Details */}
                  <div>
                    <p className="text-2xl font-semibold text-gold mb-4">₹{product.price}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Product Specifications */}
                    <div className="space-y-2 mb-6">
                      <p><span className="font-semibold">Material:</span> {product.material}</p>
                      <p><span className="font-semibold">Category:</span> <span className="capitalize">{product.category}</span></p>
                      {product.features && (
                        <div>
                          <p className="font-semibold mb-2">Features:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {product.features.map((feature, index) => (
                              <li key={index} className="text-gray-600">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleAddToCart}
                        className="btn btn-primary flex items-center"
                      >
                        <ShoppingCart size={20} className="mr-2" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={handleAddToWishlist}
                        className="btn btn-outline flex items-center"
                      >
                        <Heart size={20} className="mr-2" />
                        Add to Wishlist
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-outline"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal; 