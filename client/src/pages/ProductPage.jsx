import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2,
  Check 
} from 'lucide-react';
import { fetchProducts } from '../redux/slices/productsSlice.js';
import { addToCart } from '../redux/slices/cartSlice.js';
import { formatPrice } from '../utils/formatters.js';
import ProductCard from '../components/shop/ProductCard.jsx';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { products, status } = useSelector((state) => state.products);
  
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  
  // Fetch products if not already loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  
  // Find product from the store
  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(p => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/not-found');
      }
    }
  }, [id, products, navigate]);
  
  if (!product && status !== 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Product Not Found</h2>
          <p className="mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="btn btn-primary"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }
  
  const handleImageNav = (direction) => {
    if (!product) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })
    );
    
    // Show notification
    setNotification('Product added to cart');
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Related products - same category
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-gray-200 h-96 rounded-md"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-burgundy text-white px-4 py-2 rounded-md shadow-md z-50 flex items-center animate-fade-in">
          <Check size={18} className="mr-2" />
          {notification}
        </div>
      )}
      
      <div className="container-custom py-8">
        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative bg-white rounded-md overflow-hidden mb-4">
              <img 
                src={product?.images[currentImageIndex]} 
                alt={product?.name} 
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
              />
              
              {/* Image navigation */}
              <button
                onClick={() => handleImageNav('prev')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleImageNav('next')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Thumbnail navigation */}
            {product?.images.length > 1 && (
              <div className="flex space-x-2">
                {product?.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`border-2 rounded overflow-hidden ${
                      currentImageIndex === index ? 'border-burgundy' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div>
            <div className="mb-2 text-sm capitalize text-gray-500">
              {product?.category}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading mb-2">
              {product?.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product?.rating) ? 'text-gold fill-gold' : 'text-gray-300'} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product?.rating} ({product?.reviewCount} reviews)
              </span>
            </div>
            
            <p className="text-2xl font-medium text-burgundy mb-6">
              {formatPrice(product?.price)}
            </p>
            
            <p className="text-gray-700 mb-6">
              {product?.description}
            </p>
            
            {/* Features list */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Features:</h3>
              <ul className="space-y-1">
                {product?.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-burgundy mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Add to cart */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex border border-gray-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 border-r border-gray-300"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-2 border-l border-gray-300"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {product?.inStock ? (
                    <span className="text-green-600">In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex items-center"
                  disabled={!product?.inStock}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Add to Cart
                </button>
                <button className="btn btn-outline flex items-center">
                  <Heart size={18} className="mr-2" />
                  Wishlist
                </button>
                <button className="p-3 border border-gray-300 rounded-sm hover:bg-gray-100">
                  <Share2 size={18} aria-label="Share product" />
                </button>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-500 space-y-1">
                <p>Material: <span className="capitalize">{product?.material}</span></p>
                <p>SKU: JWLRY-{product?.id.toString().padStart(4, '0')}</p>
                <p>Categories: <span className="capitalize">{product?.category}</span></p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;