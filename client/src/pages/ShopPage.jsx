import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { fetchProducts, setFilters, clearFilters } from '../redux/slices/productsSlice.js';
import ProductCard from '../components/shop/ProductCard.jsx';
import ProductFilter from '../components/shop/ProductFilter.jsx';

const ShopPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { 
    filteredProducts, 
    status, 
    error 
  } = useSelector((state) => state.products);
  const { isFilterOpen } = useSelector((state) => state.ui);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  useEffect(() => {
    if (category) {
      dispatch(setFilters({ category }));
    }
  }, [category, dispatch]);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  
  // Close filter when overlay is clicked
  const handleMobileFilterClose = () => setMobileFilterOpen(false);

  return (
    <div className="min-h-screen bg-cream-light pt-24">
      {/* Shop Header */}
      <div className="bg-burgundy text-white py-10">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-heading mb-2">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Shop All Jewellery'}
          </h1>
          <p className="text-cream-light">
            Discover our exquisite collection of fine jewellery
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-burgundy focus:border-burgundy"
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            className="w-full flex items-center justify-between bg-white shadow-sm rounded-md p-4 font-medium text-burgundy border border-burgundy"
            onClick={() => setMobileFilterOpen(true)}
          >
            <span className="flex items-center">
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
            </span>
            <span>
              {/* Chevron icon */}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </button>
        </div>

        {/* Mobile Filter Dropdown Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={handleMobileFilterClose}></div>
            {/* Filter Panel */}
            <div className="relative bg-white w-full max-w-md mx-auto mt-20 rounded-md shadow-lg z-10 p-4 animate-slide-down">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-lg">Filters</span>
                <button onClick={handleMobileFilterClose} aria-label="Close filter">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <ProductFilter onApply={handleMobileFilterClose} onClear={handleMobileFilterClose} />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className={`md:w-1/4 hidden md:block`}>
            <ProductFilter />
          </aside>
          
          {/* Products */}
          <div className="md:w-3/4">
            {/* Product controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">
                Showing {filteredProducts.length} products
              </p>
              
              {/* Layout toggle */}
              <div className="hidden md:flex border rounded-md">
                <button
                  className="p-2 bg-burgundy text-white"
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  className="p-2 border-l border-gray-300"
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            
            {/* Product listing */}
            {status === 'loading' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-md shadow-sm animate-pulse">
                    <div className="w-full h-64 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : status === 'failed' ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error || 'Failed to load products'}</p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-md shadow-sm">
                <SlidersHorizontal size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;