import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-heading mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Product Information</h2>
            <p className="mb-4">
              We strive to provide accurate product descriptions and images. However, we do not warrant 
              that product descriptions or other content is accurate, complete, reliable, current, or 
              error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Pricing and Payment</h2>
            <p className="mb-4">
              All prices are in Indian Rupees (INR) and are subject to change without notice. We accept 
              various payment methods and ensure secure transaction processing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Order Acceptance</h2>
            <p className="mb-4">
              Your receipt of an electronic or other form of order confirmation does not signify our 
              acceptance of your order, nor does it constitute confirmation of our offer to sell.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at{' '}
              <a href="mailto:terms@sonijewellers.com" className="text-burgundy hover:underline">
                terms@sonijewellers.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;