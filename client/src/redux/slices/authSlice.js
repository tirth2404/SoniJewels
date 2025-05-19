import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      // For demo purposes, if email contains 'admin', set as admin
      state.isAdmin = action.payload?.email?.includes('admin') || false;
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;