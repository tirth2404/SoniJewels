import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost/SoniJewels/server/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get_products.php`);
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
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