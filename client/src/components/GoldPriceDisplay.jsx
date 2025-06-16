import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const GoldPriceDisplay = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchGoldPrice = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/server/gold_price.php');
      const data = await response.json();
      if (data.success) {
        setGoldPrice(data.price);
        setLastUpdated(data.timestamp);
        setMessage('Gold price updated successfully');
        toast.success('Gold price updated successfully!');
      } else {
        setMessage(data.message || 'Failed to fetch gold price');
        toast.error(data.message || 'Failed to fetch gold price!');
      }
    } catch (error) {
      console.error('Error fetching gold price:', error);
      setMessage('Error fetching gold price');
      toast.error('Error fetching gold price!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Today's Gold Price</h2>
      {goldPrice ? (
        <>
          <p className="text-3xl font-bold text-yellow-700 mb-2">₹ {goldPrice} INR</p>
          <p className="text-sm text-gray-500 mb-4">
            <i className="far fa-clock mr-1"></i> Last Updated: {lastUpdated}
          </p>
          <button
            onClick={fetchGoldPrice}
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Gold Price'}
          </button>
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        </>
      ) : (
        <p>{loading ? 'Loading gold price...' : 'No gold price available.'}</p>
      )}
    </div>
  );
};

export default GoldPriceDisplay; 