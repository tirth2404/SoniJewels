import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productsSlice';
import ProductCard from '../components/shop/ProductCard';
import QuickViewModal from '../components/shop/QuickViewModal';
import ProductFilter from '../components/shop/ProductFilter';

const ShopPage = () => {
  const dispatch = useDispatch();
  const { products, filteredProducts: reduxFilteredProducts, status } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  // Further filter the Redux-filtered products based on the local search query
  const finalFilteredProducts = reduxFilteredProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading') {
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
            {finalFilteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {finalFilteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}

      {/* Mobile filter overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default ShopPage;