import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Diamond, Award, Gem } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productsSlice.js';
import ProductCard from '../components/shop/ProductCard.jsx';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);
  
  // Featured products
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-center bg-cover flex items-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/14363183/pexels-photo-14363183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl fade-in">
            <h1 className="text-5xl md:text-6xl font-heading font-semibold mb-4">
              Exquisite Jewellery for Timeless Elegance
            </h1>
            <p className="text-xl mb-8 text-cream-light">
              Discover our collection of handcrafted fine jewellery, created with passion and precision since 1965.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn btn-primary">
                Explore Collection
              </Link>
              <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-charcoal">
                Visit Showroom
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-cream py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-md shadow-sm">
              <Diamond size={48} className="text-gold mb-4" />
              <h3 className="text-xl font-medium mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Every piece is crafted with the finest materials and attention to detail, ensuring exceptional quality.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-md shadow-sm">
              <Award size={48} className="text-gold mb-4" />
              <h3 className="text-xl font-medium mb-3">Certified Authenticity</h3>
              <p className="text-gray-600">
                All our jewellery comes with certification of authenticity and ethically sourced materials.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-md shadow-sm">
              <Gem size={48} className="text-gold mb-4" />
              <h3 className="text-xl font-medium mb-3">Custom Designs</h3>
              <p className="text-gray-600">
                Create your dream jewellery with our bespoke design service, tailored to your preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 bg-white">
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
              <Link to="/contact" className="btn btn-primary">
                Our Story
              </Link>
            </div>
            
            <div className="order-1 lg:order-2">
              <img 
                src="https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Jewellery workshop" 
                className="rounded-md shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Collection */}
      <section className="py-20 bg-cream-light">
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
                <ProductCard key={product.id} product={product} />
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
      </section>
      
      {/* Promotion Banner */}
      <section className="py-20 bg-burgundy text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">Special Offer</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Enjoy 10% off on all wedding collections. Book an appointment for a personalized consultation.
          </p>
          <Link to="/contact" className="btn bg-white text-burgundy hover:bg-cream hover:text-burgundy-dark">
            Book Appointment
          </Link>
        </div>
      </section>
      
      {/* Instagram Gallery */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading mb-2">Follow Our Journey</h2>
            <p className="text-gray-600">@sonijewellers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984854/pexels-photo-10984854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984818/pexels-photo-10984818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984797/pexels-photo-10984797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
            <a href="#" className="block overflow-hidden group">
              <img 
                src="https://images.pexels.com/photos/10984792/pexels-photo-10984792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Instagram post" 
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-20 bg-cream">
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
      </section>
    </div>
  );
};

export default HomePage;