import React from 'react';

const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-heading mb-8">Shipping Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Processing Time</h2>
            <p className="mb-4">
              All orders are processed within 2-3 business days. Orders placed during weekends or 
              holidays will be processed on the next business day.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Shipping Methods</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Standard Shipping</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Delivery within 5-7 business days</li>
                <li>Free shipping on orders above ₹25,000</li>
                <li>Tracking information provided via email</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Express Shipping</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Delivery within 2-3 business days</li>
                <li>Additional charges apply</li>
                <li>Available for select locations</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">International Shipping</h2>
            <p className="mb-4">
              We currently ship to selected international destinations. Shipping times and costs vary 
              by location. Import duties and taxes may apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">Contact Us</h2>
            <p>
              For any shipping-related queries, please contact us at{' '}
              <a href="mailto:shipping@sonijewellers.com" className="text-burgundy hover:underline">
                shipping@sonijewellers.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;