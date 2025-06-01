import { createSlice } from '@reduxjs/toolkit';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder.jpg';
  if (imageUrl.startsWith('blob:')) return imageUrl;
  return `http://localhost${imageUrl}`;
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      const addQuantity = newItem.quantity || 1;
      
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: getImageUrl(newItem.images?.[0]),
          quantity: addQuantity,
          totalPrice: newItem.price * addQuantity,
        });
      } else {
        existingItem.quantity += addQuantity;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price * addQuantity;
      }
      
      state.totalQuantity += addQuantity;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
      
      state.totalQuantity--;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    deleteFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      state.totalQuantity = state.totalQuantity - existingItem.quantity;
      state.items = state.items.filter(item => item.id !== id);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, deleteFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;