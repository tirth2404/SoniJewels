import React, { useEffect } from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';

const ContactPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState(null);
  
  useEffect(() => {
    if (user) {
      console.log('User state in ContactPage:', user); // Debug log
      setFormData((prev) => ({
        ...prev,
        name: user.Username || user.username || '',
        email: user.Email || user.email || '',
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('error');
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      console.log('Sending form data:', formData); // Debug log
      
      const response = await fetch('http://localhost/SoniJewels/server/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim() // Ensure email is trimmed
        })
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
      if (data.status === 'success') {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setFormStatus('error');
        console.error('Error:', data.message);
        alert('Error submitting form: ' + data.message);
      }
    } catch (error) {
      setFormStatus('error');
      console.error('Error details:', error);
      alert('Error submitting form: ' + error.message);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      {/* Hero Section */}
      <div className="bg-burgundy text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Contact Us</h1>
          <p className="text-xl text-cream-light max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with our team for inquiries, appointments, or custom jewellery requests.
          </p>
        </div>
      </div>
      
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-heading mb-6">Get in Touch</h2>
            
            <div className="bg-white p-6 rounded-md shadow-sm mb-8">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-cream rounded-full mr-4">
                  <MapPin size={20} className="text-burgundy" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Visit Our Store</h3>
                  <p className="text-gray-600">
                    JAMNA CHEMBERS SHOP NO.A-7 GROUND FLOOR<br />
                    KANAIYA WADI, OLD SHAKTI VIJAY VARACHHA ROAD<br />
                    Gujarat, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="p-3 bg-cream rounded-full mr-4">
                  <Phone size={20} className="text-burgundy" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <p className="text-gray-600">
                    <a href="tel:+919427171850" className="hover:text-burgundy">+91 94271 71850</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="p-3 bg-cream rounded-full mr-4">
                  <Mail size={20} className="text-burgundy" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <p className="text-gray-600">
                    <a href="mailto:vipul478langaliya@gmail.com" className="hover:text-burgundy">vipul478langaliya@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 bg-cream rounded-full mr-4">
                  <Clock size={20} className="text-burgundy" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Opening Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 10:00 AM - 8:00 PM<br />
                    Sunday: 11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="aspect-video bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.1234567890123!2d72.81400082535551!3d21.058983936088466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123f8d51f%3A0xb9f815648d8236f4!2sVarachha%20Road%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1684124283880!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store location"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-heading mb-6">Send Us a Message</h2>
            
            <div className="bg-white p-6 rounded-md shadow-sm">
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-green-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-6">
                    Your message has been sent successfully. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setFormStatus(null)}
                    className="btn btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {!user && (
                      <>
                        <div>
                          <label htmlFor="name" className="form-label">Your Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input" 
                            placeholder="John Doe"
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input" 
                            placeholder="john@example.com"
                            required 
                          />
                        </div>
                      </>
                    )}
                    {user && (
                      <>
                        <input type="hidden" name="name" value={formData.name} />
                        <input type="hidden" name="email" value={formData.email} />
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="Product Inquiry"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-input min-h-[150px]" 
                      placeholder="How can we help you?"
                      required 
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-heading text-center mb-10">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">Do you offer custom jewellery design services?</summary>
              <p className="mt-2 text-gray-600">
                Yes, we specialize in custom jewellery design. Our expert artisans can bring your vision to life, whether it's a unique engagement ring, a special anniversary gift, or a personalized piece for any occasion.
              </p>
            </details>
            
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, debit cards, net banking, UPI payments, and cash for in-store purchases. For custom orders, we may require a deposit before starting the work.
              </p>
            </details>
            
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">Do you provide jewellery valuation services?</summary>
              <p className="mt-2 text-gray-600">
                Yes, we offer professional jewellery valuation services for insurance, estate planning, or resale purposes. Our certified gemologists provide accurate assessments based on current market values.
              </p>
            </details>
            
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">What is your return and exchange policy?</summary>
              <p className="mt-2 text-gray-600">
                We offer a 14-day return policy for most items. Products must be returned in their original condition with all documentation. Custom-made pieces are non-returnable unless there's a manufacturing defect.
              </p>
            </details>
            
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">Do you offer jewellery repair services?</summary>
              <p className="mt-2 text-gray-600">
                Yes, we provide comprehensive jewellery repair services including ring resizing, stone replacement, chain repair, polishing, and more. We can repair most types of jewellery, regardless of where it was purchased.
              </p>
            </details>
            
            <details className="mb-4 border-b pb-4">
              <summary className="font-medium cursor-pointer">Can I book an appointment for a consultation?</summary>
              <p className="mt-2 text-gray-600">
                Absolutely! We encourage appointments for custom design consultations and bridal jewellery selections. You can book an appointment through our contact form, by phone, or by email.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;