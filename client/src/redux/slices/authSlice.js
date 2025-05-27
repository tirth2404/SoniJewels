import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: false,
  profile: {
    fullName: 'abc def',
    email: 'user@gmail.com',
    phone: '+91 1234567890',
    gender: 'Male',
    dob: '1990-01-01',
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload?.isAdmin;
    },
    updateProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;