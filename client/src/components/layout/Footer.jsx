import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4 text-gold">Soni Jewellers</h4>
            <p className="text-gray-300 mb-4">
              Crafting elegant jewellery since 1965. Family owned and operated for three generations, offering the finest selection of diamonds, gold, and precious gemstones.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com" className="text-gray-300 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-300 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Bestsellers</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4 text-gold">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/rings" className="text-gray-300 hover:text-white transition-colors">Rings</Link>
              </li>
              <li>
                <Link to="/shop/necklaces" className="text-gray-300 hover:text-white transition-colors">Necklaces</Link>
              </li>
              <li>
                <Link to="/shop/earrings" className="text-gray-300 hover:text-white transition-colors">Earrings</Link>
              </li>
              <li>
                <Link to="/shop/bracelets" className="text-gray-300 hover:text-white transition-colors">Bracelets</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">All Jewellery</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-heading font-semibold mb-4 text-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-gold" />
                <span className="text-gray-300">123 Jewellery Lane, Diamond District, Mumbai, 400001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gold" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gold" />
                <a href="mailto:info@sonijewellers.com" className="text-gray-300 hover:text-white transition-colors">info@sonijewellers.com</a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-300">Opening Hours:</p>
              <p className="text-gray-300">Mon-Sat: 10:00 AM - 8:00 PM</p>
              <p className="text-gray-300">Sun: 11:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Soni Rameshbhai & Sons. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;