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
      // Set admin status based on specific email
      state.isAdmin = action.payload?.email === 'admin@gmail.com';
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;