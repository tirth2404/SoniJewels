import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Heart } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { formatPrice } from '../../utils/formatters.js';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }));
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-burgundy text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium mb-1 hover:text-burgundy transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500 capitalize">{product.material}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium text-burgundy">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="p-2 text-burgundy hover:bg-burgundy hover:text-white rounded-sm transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
            <button
              className="p-2 text-burgundy hover:bg-burgundy hover:text-white rounded-sm transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;