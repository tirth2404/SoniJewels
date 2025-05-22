import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { formatPrice } from '../../utils/formatters.js';

const WishlistPage = () => {
  const dispatch = useDispatch();

  // Sample wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: 'Diamond Solitaire Ring',
      price: 29999,
      image: 'https://images.pexels.com/photos/9946153/pexels-photo-9946153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      inStock: true
    },
    {
      id: 2,
      name: 'Ruby Pendant Necklace',
      price: 15999,
      image: 'https://images.pexels.com/photos/12934506/pexels-photo-12934506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      inStock: false
    }
  ];

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }));
  };

  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-heading mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">
              Add items to your wishlist to keep track of products you love.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <p className="text-burgundy font-medium mb-4">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-primary flex items-center"
                      disabled={!item.inStock}
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-burgundy"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;