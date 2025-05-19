import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { setFilters, clearFilters } from '../../redux/slices/productsSlice.js';
import { toggleFilter, closeFilter } from '../../redux/slices/uiSlice.js';
import { formatPrice } from '../../utils/formatters.js';

const ProductFilter = ({ onApply, onClear }) => {
  const dispatch = useDispatch();
  const { categories, products, filters } = useSelector((state) => state.products);
  const { isFilterOpen } = useSelector((state) => state.ui);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    if (onApply) onApply();
    setIsExpanded(false);
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({
      category: '',
      priceRange: [minPrice, maxPrice],
      materials: [],
    });
    if (onClear) onClear();
    setIsExpanded(false);
  };
  
  return (
    <>
      {/* Mobile filter menu (no dropdown, always open when button is clicked) */}
      <div className="md:hidden w-full bg-white shadow-sm rounded-md p-2 mb-3">
        {/* Only show the filter menu, not a dropdown */}
        <div className="mt-2 p-2 rounded-md bg-cream-light border border-burgundy text-xs">
          {/* Filter content */}
          <div className="space-y-4">
            {/* Categories */}
            <div>
              <h3 className="font-medium text-burgundy text-base mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-2 py-1 rounded transition text-burgundy text-xs font-medium ${
                      localFilters.category === category
                        ? 'bg-burgundy text-white'
                        : 'hover:bg-burgundy/10'
                    }`}
                  >
                    <span className="capitalize">{category}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Price range */}
            <div>
              <h3 className="font-medium text-burgundy text-base mb-2">Price Range</h3>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-burgundy">{formatPrice(localFilters.priceRange[0])}</span>
                <span className="text-xs text-burgundy">{formatPrice(localFilters.priceRange[1])}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                  <input
                    type="range"
                    id="min-price"
                    min={minPrice}
                    max={maxPrice}
                    value={localFilters.priceRange[0]}
                    onChange={(e) => handlePriceChange(e.target.value, false)}
                    className="w-full accent-burgundy"
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
                    className="w-full accent-burgundy"
                  />
                </div>
              </div>
            </div>
            {/* Materials */}
            <div>
              <h3 className="font-medium text-burgundy text-base mb-2">Material</h3>
              <div className="space-y-1">
                {materials.map(material => (
                  <label 
                    key={material} 
                    className="flex items-center cursor-pointer text-xs text-burgundy"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.materials.includes(material)}
                      onChange={() => handleMaterialToggle(material)}
                      className="form-checkbox h-4 w-4 text-burgundy rounded border-gray-300 focus:ring-burgundy"
                    />
                    <span className="ml-2 capitalize">{material}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Filter actions */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary flex-1 text-xs py-1"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="btn btn-outline flex-1 text-xs py-1"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop filter panel */}
      <div className="hidden md:block bg-white p-6 rounded-md shadow-sm">
        <h2 className="font-medium text-xl mb-6">Filters</h2>
        
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
              <label htmlFor="min-price-desktop" className="sr-only">Minimum Price</label>
              <input
                type="range"
                id="min-price-desktop"
                min={minPrice}
                max={maxPrice}
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(e.target.value, false)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="max-price-desktop" className="sr-only">Maximum Price</label>
              <input
                type="range"
                id="max-price-desktop"
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
        <div className="flex space-x-3">
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
    </>
  );
};

export default ProductFilter;