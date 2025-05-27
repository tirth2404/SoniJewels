import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Diamond, Clock } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { icon: <Clock size={32} />, value: '1965', label: 'Years of Excellence' },
    { icon: <Users size={32} />, value: '10,000+', label: 'Happy Customers' },
    { icon: <Diamond size={32} />, value: '50,000+', label: 'Pieces Created' },
    { icon: <Award size={32} />, value: '100+', label: 'Awards Won' }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] bg-center bg-cover flex items-center"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">Our Story</h1>
            <p className="text-xl text-gray-200">
              A legacy of craftsmanship and excellence since 1965
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-gold mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-heading font-semibold mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading mb-6">Our Heritage of Excellence</h2>
              <p className="text-gray-700 mb-4">
                Soni Rameshbhai & Sons has been a trusted name in fine jewellery since 1965. Founded with a passion for craftsmanship and a commitment to excellence, our family business has grown from a small workshop to one of the most respected jewellers in the region.
              </p>
              <p className="text-gray-700 mb-6">
                Today, the third generation of the Soni family continues the tradition of creating exquisite pieces that blend traditional techniques with contemporary design. Each creation is a testament to our dedication to quality and our love for the art of jewellery making.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Visit Our Showroom
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Jewellery workshop" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gold font-semibold">Family Owned & Operated</p>
                <p className="text-gray-600">Since 1965</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-cream-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in creating not just jewellery, but lasting relationships with our customers through trust, quality, and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description: "We use only the finest materials and maintain the highest standards of craftsmanship."
              },
              {
                title: "Integrity",
                description: "We believe in transparent pricing and honest communication with our customers."
              },
              {
                title: "Innovation",
                description: "We blend traditional techniques with modern design to create unique pieces."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-burgundy text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-4">Experience Our Craftsmanship</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Visit our showroom to explore our collection and meet our expert craftsmen.
            </p>
            <Link to="/contact" className="btn bg-white text-burgundy hover:bg-cream hover:text-burgundy-dark">
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 