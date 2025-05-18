import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNavOpen: false,
  isCartOpen: false,
  isFilterOpen: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNav(state) {
      state.isNavOpen = !state.isNavOpen;
    },
    closeNav(state) {
      state.isNavOpen = false;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    toggleFilter(state) {
      state.isFilterOpen = !state.isFilterOpen;
    },
    closeFilter(state) {
      state.isFilterOpen = false;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  toggleNav,
  closeNav,
  toggleCart,
  closeCart,
  toggleFilter,
  closeFilter,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;