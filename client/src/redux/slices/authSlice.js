import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost/SoniJewels/server/profile/update_profile.php', profileData);
      if (response.data.status === 'success') {
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

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
    updateProfileData(state, action) {
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
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload.data };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, updateProfileData, logout } = authSlice.actions;
export default authSlice.reducer;