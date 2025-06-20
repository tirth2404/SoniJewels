import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  User,
  ChevronDown,
  Package,
  Heart,
  Star,
  Settings,
  LogOut
} from 'lucide-react';
import { toggleNav, closeNav, toggleCart } from '../../redux/slices/uiSlice.js';
import { logout } from '../../redux/slices/authSlice.js';
import { clearCart } from '../../redux/slices/cartSlice.js';
import MiniCart from '../cart/MiniCart.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isNavOpen, isCartOpen } = useSelector((state) => state.ui);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { user, isAdmin } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    dispatch(closeNav());
    setIsDropdownOpen(false);
  }, [location, dispatch]);
  
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-burgundy font-heading text-2xl font-semibold">
            Soni
            <span className="text-gold"> Jewellers</span>
          </span>
        </Link>
        {isAdmin && isAdminRoute ? (
          <button
            onClick={handleLogout}
            className="btn btn-outline text-burgundy ml-auto"
          >
            Logout
          </button>
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium hover:text-burgundy transition-colors ${
                  location.pathname === '/' ? 'text-burgundy' : 'text-charcoal'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className={`font-medium hover:text-burgundy transition-colors ${
                  location.pathname.includes('/shop') ? 'text-burgundy' : 'text-charcoal'
                }`}
              >
                Shop
              </Link>
              <Link 
                to="/gold-price" 
                className={`font-medium hover:text-burgundy transition-colors ${
                  location.pathname === '/gold-price' ? 'text-burgundy' : 'text-charcoal'
                }`}
              >
                Gold Price
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium hover:text-burgundy transition-colors ${
                  location.pathname === '/contact' ? 'text-burgundy' : 'text-charcoal'
                }`}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`font-medium hover:text-burgundy transition-colors ${
                    location.pathname === '/admin' ? 'text-burgundy' : 'text-charcoal'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
            
            <div className="flex items-center">
              <Link
                to="/wishlist"
                className="p-2 hover:text-burgundy transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
              
              <button 
                className="p-2 hover:text-burgundy transition-colors relative"
                onClick={() => dispatch(toggleCart())}
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </button>
              
              {user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 hover:text-burgundy transition-colors flex items-center"
                  >
                    <User size={20} className="mr-2" />
                    <span className="hidden md:inline mr-1">{user.email}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package size={16} className="mr-2" />
                        Orders
                      </Link>
                      <Link
                        to="/reviews"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Star size={16} className="mr-2" />
                        Reviews
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 hover:text-burgundy transition-colors flex items-center"
                >
                  <User size={20} className="mr-2" />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
              
              <button 
                className="p-2 ml-2 md:hidden hover:text-burgundy transition-colors"
                onClick={() => dispatch(toggleNav())}
                aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
              >
                {isNavOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </>
        )}
      </div>
      
      {isNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in">
          <nav className="container-custom py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`font-medium py-2 hover:text-burgundy transition-colors ${
                location.pathname === '/' ? 'text-burgundy' : 'text-charcoal'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`font-medium py-2 hover:text-burgundy transition-colors ${
                location.pathname.includes('/shop') ? 'text-burgundy' : 'text-charcoal'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/gold-price" 
              className={`font-medium py-2 hover:text-burgundy transition-colors ${
                location.pathname === '/gold-price' ? 'text-burgundy' : 'text-charcoal'
              }`}
            >
              Gold Price
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium py-2 hover:text-burgundy transition-colors ${
                location.pathname === '/contact' ? 'text-burgundy' : 'text-charcoal'
              }`}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`font-medium py-2 hover:text-burgundy transition-colors ${
                  location.pathname === '/admin' ? 'text-burgundy' : 'text-charcoal'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
      
      {isCartOpen && <MiniCart />}
    </header>
  );
};

export default Navbar;