"use client";
import React from 'react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-8">Shipping & Delivery Policy</h1>
        
        <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">1. Delivery Method</h2>
            <p>Joblify provides digital services. There is no physical shipping involved.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">2. Delivery Timeline</h2>
            <p>Upon successful payment via Instamojo, your "Elite" membership features will be activated instantly on your account. You will also receive a confirmation email.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">3. Service Area</h2>
            <p>Our digital services are accessible globally, wherever an internet connection is available.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
