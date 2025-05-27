import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Diamond, Award, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '../redux/slices/productsSlice.js';
import ProductCard from '../components/shop/ProductCard.jsx';
import QuickViewModal from '../components/shop/QuickViewModal';

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, status } = useSelector((state) => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/14363183/pexels-photo-14363183.jpeg',
      title: 'Exquisite Jewellery for Timeless Elegance',
      subtitle: 'Discover our collection of handcrafted fine jewellery, created with passion and precision since 1965.'
    },
    {
      image: 'https://images.pexels.com/photos/10984854/pexels-photo-10984854.jpeg',
      title: 'Bridal Collection 2024',
      subtitle: 'Explore our stunning bridal collection, perfect for your special day.'
    },
    {
      image: 'https://images.pexels.com/photos/10984797/pexels-photo-10984797.jpeg',
      title: 'Diamond Collection',
      subtitle: 'Timeless pieces that capture the brilliance of nature\'s most precious gem.'
    }
  ];

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Small delay to ensure the page has loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // Featured products
  const featuredProducts = products.filter(product => product.featured);
  // New Arrivals (last 4 products)
  const newArrivals = products.slice(-4);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </motion.div>
        </AnimatePresence>

        <div className="container-custom relative z-10 text-white h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-semibold mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl mb-8 text-cream-light">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/shop" className="btn btn-primary">
                  Explore Collection
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-charcoal">
                  Visit Showroom
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </section>
      
      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-cream py-16"
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Diamond size={48} className="text-gold mb-4" />,
                title: "Premium Quality",
                description: "Every piece is crafted with the finest materials and attention to detail, ensuring exceptional quality."
              },
              {
                icon: <Award size={48} className="text-gold mb-4" />,
                title: "Certified Authenticity",
                description: "All our jewellery comes with certification of authenticity and ethically sourced materials."
              },
              {
                icon: <Gem size={48} className="text-gold mb-4" />,
                title: "Custom Designs",
                description: "Create your dream jewellery with our bespoke design service, tailored to your preferences."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-md shadow-sm"
              >
                {feature.icon}
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-heading mb-6">Our Heritage of Excellence</h2>
              <p className="text-gray-700 mb-4">
                Soni Rameshbhai & Sons has been a trusted name in fine jewellery since 1965. Founded with a passion for craftsmanship and a commitment to excellence, our family business has grown from a small workshop to one of the most respected jewellers in the region.
              </p>
              <p className="text-gray-700 mb-6">
                Today, the third generation of the Soni family continues the tradition of creating exquisite pieces that blend traditional techniques with contemporary design. Each creation is a testament to our dedication to quality and our love for the art of jewellery making.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn btn-primary">
                  Shop Now
                </Link>
                <Link to="/about" className="btn btn-outline">
                  Our Story
                </Link>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <img 
                src="https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg" 
                alt="Jewellery workshop" 
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* New Arrivals Section */}
      <motion.section
        id="new-arrivals"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading mb-2">New Arrivals</h2>
              <p className="text-gray-600">Discover our latest additions</p>
            </div>
            <Link 
              to="/shop" 
              className="hidden md:flex items-center text-burgundy hover:text-burgundy-dark transition-colors"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {status === 'loading' ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/4"></div>
                  </div>
                </div>
              ))
            ) : newArrivals.length > 0 ? (
              newArrivals.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <ProductCard 
                    product={product} 
                    onQuickView={() => setSelectedProduct(product)}
                  />
                </motion.div>
              ))
            ) : (
              <p>No new arrivals found</p>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Collection */}
      <motion.section
        id="featured-collection"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-cream-light"
      >
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading mb-2">Featured Collection</h2>
              <p className="text-gray-600">Discover our most exceptional pieces</p>
            </div>
            <Link 
              to="/shop" 
              className="hidden md:flex items-center text-burgundy hover:text-burgundy-dark transition-colors"
            >
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {status === 'loading' ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/4"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <ProductCard 
                    product={product} 
                    onQuickView={() => setSelectedProduct(product)}
                  />
                </motion.div>
              ))
            ) : (
              <p>No featured products found</p>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </motion.section>
      
      {/* Promotion Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-burgundy text-white"
      >
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">Special Offer</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Enjoy 10% off on all wedding collections. Book an appointment for a personalized consultation.
          </p>
          <Link to="/contact" className="btn bg-white text-burgundy hover:bg-cream hover:text-burgundy-dark">
            Book Appointment
          </Link>
        </div>
      </motion.section>
      
      {/* Instagram Gallery */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading mb-2">Follow Our Journey</h2>
            <p className="text-gray-600">@sonijewellers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984854/pexels-photo-10984854.jpeg" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984818/pexels-photo-10984818.jpeg" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984797/pexels-photo-10984797.jpeg" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984792/pexels-photo-10984792.jpeg" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
          </div>
        </div>
      </motion.section>
      
      {/* Newsletter */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-cream"
      >
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600">
              Stay updated with our latest collections and exclusive offers
            </p>
          </div>
          
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="form-input flex-grow"
              required
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </motion.section>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
};

export default HomePage;