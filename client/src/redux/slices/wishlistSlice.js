import { createSlice } from '@reduxjs/toolkit';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder.jpg';
  if (imageUrl.startsWith('blob:')) return imageUrl;
  return `http://localhost${imageUrl}`;
};

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const newItem = action.payload;
      if (!state.items.find(item => item.id === newItem.id)) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: getImageUrl(newItem.images?.[0]), // Get first image from images array
          category: newItem.category,
          material: newItem.material
        });
      }
    },
    removeFromWishlist(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },
    clearWishlist(state) {
      state.items = [];
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 