import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2,
  Check 
} from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice.js';
import ProductCard from '../components/shop/ProductCard.jsx';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import QuickViewModal from '../components/shop/QuickViewModal';
import { toast } from 'react-hot-toast';
import ReviewSection from '../components/shop/ReviewSection';

const API_URL = 'http://localhost/SoniJewels/server/products';

const ProductPage = () => {
  const { id } = useParams();
  console.log('Product ID from URL:', id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const isInWishlist = wishlistItems.some(item => item.id === product?.id);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_products.php`);
        if (response.data.status === 'success') {
          setProducts(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Fetch specific product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/get_product.php?id=${id}`);
        if (response.data.status === 'success') {
          setProduct(response.data.data);
        } else {
          setError(response.data.message);
          navigate('/not-found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);
  
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
    
    const productForCart = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ? `http://localhost${product.images[0]}` : '/placeholder.jpg',
      quantity: 1
    };
    
    dispatch(addToCart(productForCart));
    toast.success('Added to cart');
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };
  
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };
  
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.jpg';
    if (imageUrl.startsWith('blob:')) return imageUrl;
    return `http://localhost${imageUrl}`;
  };

  // Get related products based on category and material
  const getRelatedProducts = () => {
    if (!product || !products.length) return [];

    // Get products with same category or material
    const sameCategoryProducts = products.filter(p => 
      p.category === product.category && p.id !== product.id
    );
    
    const sameMaterialProducts = products.filter(p => 
      p.material === product.material && p.id !== product.id
    );

    // Combine and remove duplicates
    const combinedProducts = [...sameCategoryProducts, ...sameMaterialProducts];
    const uniqueProducts = Array.from(new Map(combinedProducts.map(item => [item.id, item])).values());

    // Randomly select up to 4 products
    const shuffled = uniqueProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };
  
  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
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

  if (!product) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
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
  
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative bg-white rounded-md overflow-hidden mb-4">
              <img 
                src={getImageUrl(product?.images[currentImageIndex])} 
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
            {product?.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`border-2 rounded overflow-hidden ${
                      currentImageIndex === index ? 'border-burgundy' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
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
            <h1 className="text-3xl font-heading font-semibold mb-2">{product?.name}</h1>            
            <p className="text-2xl font-semibold text-gold mb-6">₹{product?.price}</p>
            <div className="prose prose-sm text-gray-600 mb-8">
              <p>{product?.description}</p>
            </div>
            
            {/* Features */}
            {product?.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <div 
                onClick={handleAddToCart}
                className="btn btn-primary flex items-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </div>
              <button 
                onClick={handleWishlistToggle}
                className={`btn btn-outline flex items-center ${isInWishlist ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
              >
                <Heart size={18} className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button className="p-3 border border-gray-300 rounded-sm hover:bg-gray-100">
                <Share2 size={18} aria-label="Share product" />
              </button>
            </div>
            
            {/* Additional info */}
            <div className="border-t border-gray-200 pt-4 mt-8">
              <div className="text-sm text-gray-500 space-y-1">
                <p>Material: <span className="capitalize">{product?.material}</span></p>
                <p>SKU: JWLRY-{product?.id.toString().padStart(4, '0')}</p>
                <p>Categories: <span className="capitalize">{product?.category}</span></p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {getRelatedProducts().length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getRelatedProducts().map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && selectedProduct && (
          <QuickViewModal
            isOpen={showQuickView}
            product={selectedProduct}
            onClose={() => {
              setShowQuickView(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;