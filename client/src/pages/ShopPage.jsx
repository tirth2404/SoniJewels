import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/shop/ProductCard';
import ProductFilter from '../components/shop/ProductFilter';
import MiniCart from '../components/cart/MiniCart';
import QuickViewModal from '../components/shop/QuickViewModal';
import { SlidersHorizontal, X, Search } from 'lucide-react';

const API_URL = 'http://localhost/SoniJewels/server/products';

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { filteredProducts: reduxFilteredProducts } = useSelector((state) => state.products);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/get_products.php`);
      if (response.data.status === 'success') {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update filtered products when Redux state changes
  useEffect(() => {
    if (reduxFilteredProducts.length > 0) {
      setFilteredProducts(reduxFilteredProducts);
    }
  }, [reduxFilteredProducts]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(reduxFilteredProducts);
    } else {
      const searchResults = reduxFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }
  }, [searchQuery, reduxFilteredProducts]);

  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        {/* Mobile filter button */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden flex items-center gap-2 mb-6 text-gray-600 hover:text-burgundy"
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>

        <div className="flex gap-8">
          {/* Filter sidebar */}
          <div className={`fixed lg:static top-0 left-0 h-full w-80 bg-white shadow-lg z-50 lg:shadow-none lg:w-64 overflow-y-auto transform transition-transform duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              <ProductFilter />
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <div className="w-full md:w-96 relative mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={handleQuickView}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Mini Cart */}
      {isCartOpen && <MiniCart />}

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ShopPage;