import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductCard = ({ product, onQuickView }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => onQuickView(product)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gold hover:text-white transition-colors"
              aria-label="Quick View"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 bg-white rounded-full shadow-md transition-colors ${
                isInWishlist 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'hover:bg-gold hover:text-white'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gold hover:text-white transition-colors"
              aria-label="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gold">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;