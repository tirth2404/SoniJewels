import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage if available
const getInitialState = () => {
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
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
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload?.isAdmin;
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    updateProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.isAdmin = false;
      // Clear from localStorage
      localStorage.removeItem('authState');
    },
  },
});

export const { setUser, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;