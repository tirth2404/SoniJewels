import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { products } from '../../data/products.js';

// In a real app, you would fetch products from an API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return products;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    category: '',
    priceRange: [0, 100000],
    materials: [],
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      
      // Apply filters
      state.filteredProducts = state.products.filter(product => {
        // Filter by category
        if (state.filters.category && product.category !== state.filters.category) {
          return false;
        }
        
        // Filter by price range
        if (
          product.price < state.filters.priceRange[0] ||
          product.price > state.filters.priceRange[1]
        ) {
          return false;
        }
        
        // Filter by materials
        if (
          state.filters.materials.length > 0 &&
          !state.filters.materials.includes(product.material)
        ) {
          return false;
        }
        
        return true;
      });
    },
    
    clearFilters(state) {
      state.filters = {
        category: '',
        priceRange: [0, 100000],
        materials: [],
      };
      state.filteredProducts = state.products;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload;
        
        // Extract unique categories
        const categorySet = new Set();
        action.payload.forEach(product => categorySet.add(product.category));
        state.categories = Array.from(categorySet);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;

export default productsSlice.reducer;