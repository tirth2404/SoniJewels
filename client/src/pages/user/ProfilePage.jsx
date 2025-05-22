import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Check } from 'lucide-react';
import { updateProfile } from '../../redux/slices/authSlice.js';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(profile);
  const [notification, setNotification] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({
      ...formData,
      profilePicture: previewImage || formData.profilePicture
    }));
    
    setNotification('Profile updated successfully');
    setTimeout(() => setNotification(null), 3000);
  };

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
                  src={previewImage || formData.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
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
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
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