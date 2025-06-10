import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    // Optionally, you might want to send a request to the backend to validate the token
    // as soon as the page loads. For simplicity, we'll rely on the reset endpoint
    // to validate it when the user submits the new password.
    if (!token) {
      setTokenValid(false);
      setMessage('No reset token found.');
      toast.error('No reset token found in the URL.');
    }
    setInitialCheckComplete(true);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!token) {
      setMessage('Reset token is missing.');
      toast.error('Reset token is missing from the URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost/SoniJewels/server/auth/reset_password.php', {
        token,
        password
      });

      if (response.data && response.data.message) {
        toast.success(response.data.message);
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful reset
        }, 3000);
      } else {
        toast.error('An unexpected error occurred.');
        setMessage('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      setMessage(errorMessage);
      setTokenValid(false); // Token might be invalid or expired if reset fails
    } finally {
      setLoading(false);
    }
  };

  if (!initialCheckComplete) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <p className="text-gray-600">Checking token...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-heading mb-4">Invalid or Missing Token</h2>
          <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn btn-primary">
            Request a New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-cream-light flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-heading text-center mb-6">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter your new password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <div className={`mt-6 p-3 rounded-md text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 