import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Filter as FilterIcon } from 'lucide-react';
import { setFilters, clearFilters } from '../../redux/slices/productsSlice.js';
import { toggleFilter, closeFilter } from '../../redux/slices/uiSlice.js';
import { formatPrice } from '../../utils/formatters.js';

const ProductFilter = () => {
  const dispatch = useDispatch();
  const { categories, products, filters } = useSelector((state) => state.products);
  const { isFilterOpen } = useSelector((state) => state.ui);
  
  const [localFilters, setLocalFilters] = useState({
    category: '',
    priceRange: [0, 100000],
    materials: [],
  });
  
  const materials = [...new Set(products.map(product => product.material))];
  const minPrice = Math.min(...products.map(product => product.price), 0);
  const maxPrice = Math.max(...products.map(product => product.price), 100000);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleCategoryChange = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };
  
  const handlePriceChange = (value, end) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: end 
        ? [prev.priceRange[0], parseInt(value)] 
        : [parseInt(value), prev.priceRange[1]],
    }));
  };
  
  const handleMaterialToggle = (material) => {
    setLocalFilters(prev => {
      const materials = prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material];
      return { ...prev, materials };
    });
  };
  
  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(closeFilter());
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({
      category: '',
      priceRange: [minPrice, maxPrice],
      materials: [],
    });
  };
  
  return (
    <>
      {/* Mobile filter button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-40 bg-burgundy text-white rounded-full p-4 shadow-lg"
        onClick={() => dispatch(toggleFilter())}
      >
        <FilterIcon size={24} />
      </button>
      
      {/* Filter panel */}
      <div className={`bg-white md:bg-transparent ${isFilterOpen ? 'fixed inset-0 z-50 md:relative' : ''}`}>
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0">
          <h2 className="font-medium text-xl">Filters</h2>
          <button
            onClick={() => dispatch(closeFilter())}
            className="text-gray-500 hover:text-burgundy"
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 md:p-0 overflow-y-auto max-h-screen md:max-h-none">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`block w-full text-left px-2 py-1.5 rounded transition ${
                    localFilters.category === category
                      ? 'bg-burgundy text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Price range */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Price Range</h3>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{formatPrice(localFilters.priceRange[0])}</span>
              <span className="text-sm">{formatPrice(localFilters.priceRange[1])}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                <input
                  type="range"
                  id="min-price"
                  min={minPrice}
                  max={maxPrice}
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, false)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                <input
                  type="range"
                  id="max-price"
                  min={minPrice}
                  max={maxPrice}
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, true)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Materials */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Material</h3>
            <div className="space-y-2">
              {materials.map(material => (
                <label 
                  key={material} 
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.materials.includes(material)}
                    onChange={() => handleMaterialToggle(material)}
                    className="form-checkbox h-5 w-5 text-burgundy rounded border-gray-300 focus:ring-burgundy"
                  />
                  <span className="ml-2 capitalize">{material}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Filter actions */}
          <div className="flex space-x-3 sticky bottom-0 bg-white p-4 border-t md:border-0 md:p-0">
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary flex-1"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn btn-outline flex-1"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;