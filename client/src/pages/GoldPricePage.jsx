import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, RefreshCw } from 'lucide-react';

const GoldPricePage = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchGoldPrice = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/SoniJewels/server/gold_price.php');
      if (response.data.success) {
        setGoldPrice(response.data.price);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } else {
        setError('Failed to fetch gold price');
      }
    } catch (err) {
      setError('Error fetching gold price');
      console.error('Error fetching gold price:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchGoldPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading mb-8 text-center">Live Gold Price</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-burgundy">Current Gold Price</h2>
              <button
                onClick={fetchGoldPrice}
                className="p-2 hover:text-burgundy transition-colors"
                disabled={loading}
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {loading && !goldPrice ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading gold price...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>{error}</p>
                <button
                  onClick={fetchGoldPrice}
                  className="mt-4 text-burgundy hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp size={32} className="text-gold mr-3" />
                  <span className="text-4xl font-bold text-burgundy">
                    ₹{goldPrice?.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600">
                  Last updated: {lastUpdated}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Price per troy ounce (31.1035 grams)
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-burgundy mb-4">About Gold Prices</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                Gold prices are updated every 5 minutes to provide you with the most current market rates.
                The price shown is the current market price per troy ounce of gold in Indian Rupees (INR).
              </p>
              <p className="text-gray-600 mt-4">
                A troy ounce is the standard unit of measurement for precious metals, equivalent to 31.1035 grams.
                This is different from the regular ounce used for everyday items (28.35 grams).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldPricePage; 