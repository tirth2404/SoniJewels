import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Check } from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice.js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    profilePicture: '',
    id: ''
  });
  const [notification, setNotification] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost/SoniJewels/server/profile/get_profile.php?id=${user.id}`);
        
        if (response.data.status === 'success') {
          // Construct the full image URL if profilePicture exists
          const profileData = response.data.data;
          if (profileData.profilePicture) {
            profileData.profilePicture = `http://localhost${profileData.profilePicture}`;
          }
          
          // Handle date format
          if (profileData.dob === '0000-00-00' || !profileData.dob) {
            profileData.dob = ''; // Set empty string for invalid dates
          }
          
          setFormData(profileData);
          setPreviewImage(profileData.profilePicture);
        } else {
          toast.error(response.data.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPG, PNG, or GIF image.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Maximum size is 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await axios.post('http://localhost/SoniJewels/server/profile/upload_image.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.status === 'success') {
          // Use the correct base URL without port number
          const imageUrl = `http://localhost${response.data.imageUrl}`;
          console.log('Setting image URL:', imageUrl);
          setPreviewImage(imageUrl);
          setFormData(prev => ({
            ...prev,
            profilePicture: response.data.imageUrl
          }));
          toast.success('Profile picture updated successfully');
        } else {
          toast.error(response.data.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error(error.response?.data?.message || 'Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData to modify
      const submitData = { ...formData };
      
      // Handle empty date
      if (!submitData.dob) {
        submitData.dob = null;
      }
      
      await dispatch(updateProfile(submitData)).unwrap();
      setNotification('Profile updated successfully');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light">
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50 flex items-center animate-fade-in">
          <Check size={18} className="mr-2" />
          {notification}
        </div>
      )}

      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">Profile Settings</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative">
                <img
                  src={previewImage || (formData.profilePicture ? `http://localhost${formData.profilePicture}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNFNUU3RUIiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzk5OSIvPjxwYXRoIGQ9Ik0zNSAxMTBDMzUgOTQuNTM2IDUzLjUzNiA4MiA3NSA4MkM5Ni40NjQgODIgMTE1IDk0LjUzNiAxMTUgMTEwVjExNUgzNVYxMTBaIiBmaWxsPSIjOTk5Ii8+PC9zdmc+')}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNFNUU3RUIiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjUwIiByPSIyMCIgZmlsbD0iIzk5OSIvPjxwYXRoIGQ9Ik0zNSAxMTBDMzUgOTQuNTM2IDUzLjUzNiA4MiA3NSA4MkM5Ni40NjQgODIgMTE1IDk0LjUzNiAxMTUgMTEwVjExNUgzNVYxMTBaIiBmaWxsPSIjOTk5Ii8+PC9zdmc+';
                  }}
                />
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-burgundy text-white p-2 rounded-full cursor-pointer hover:bg-burgundy-dark transition-colors"
                >
                  <Camera size={20} />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Click the camera icon to update your profile picture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;