import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import ProductManagement from './pages/admin/ProductManagement.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import ReviewManagement from './pages/admin/ReviewManagement.jsx';
import ProfilePage from './pages/user/ProfilePage.jsx';
import OrdersPage from './pages/user/OrdersPage.jsx';
import WishlistPage from './pages/user/WishlistPage.jsx';
import ReviewsPage from './pages/user/ReviewsPage.jsx';
import SettingsPage from './pages/user/SettingsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import AboutPage from './pages/AboutPage';
import { Toaster } from 'react-hot-toast';
import AdminFeedbackPage from './pages/admin/FeedbackPage.jsx';
import AdminCustomerQueriesPage from './pages/admin/CustomerQueriesPage.jsx';

const ProtectedRoute = ({ children, requiresAuth, requiresAdmin }) => {
  const { user, isAdmin } = useSelector((state) => state.auth);

  console.log('ProtectedRoute state:', { user, isAdmin, requiresAuth, requiresAdmin });

  if (requiresAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-light text-charcoal">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute requiresAuth>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          
          {/* User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiresAuth>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiresAuth>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute requiresAuth>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute requiresAuth>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiresAuth>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiresAuth requiresAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiresAuth requiresAdmin>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiresAuth requiresAdmin>
                <OrderManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute requiresAuth requiresAdmin>
                <ReviewManagement />
              </ProtectedRoute>
            }
          />
          
          {/* New Admin Routes */}
          <Route
             path="/admin/queries"
             element={
               <ProtectedRoute requiresAuth requiresAdmin>
                 <AdminCustomerQueriesPage />
               </ProtectedRoute>
             }
           />
           <Route
             path="/admin/feedback"
             element={
               <ProtectedRoute requiresAuth requiresAdmin>
                 <AdminFeedbackPage />
               </ProtectedRoute>
             }
           />
          
          {/* Policy Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/shipping" element={<ShippingPolicyPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;