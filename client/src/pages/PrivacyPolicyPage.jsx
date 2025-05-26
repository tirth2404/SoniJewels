import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-24 bg-cream-light">
      <div className="container-custom py-12">
        <h1 className="text-4xl font-heading mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Name and contact information</li>
              <li>Payment information</li>
              <li>Delivery address</li>
              <li>Account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Process your orders and payments</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your shopping experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-heading mb-4">Information Sharing</h2>
            <p className="mb-4">
              We do not sell or share your personal information with third parties except as necessary to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Process your orders</li>
              <li>Comply with legal obligations</li>
              <li>Protect our rights and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@sonijewellers.com" className="text-burgundy hover:underline">
                privacy@sonijewellers.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;