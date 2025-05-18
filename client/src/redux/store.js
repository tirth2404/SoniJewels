import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import productsReducer from './slices/productsSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
  },
});