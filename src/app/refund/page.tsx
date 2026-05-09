"use client";
import React from 'react';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-8">Refund & Cancellation Policy</h1>
        
        <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">1. Refund Policy</h2>
            <p>Since Joblify provides non-tangible, irrevocable digital goods (Premium Subscriptions), we do not issue refunds once the order is confirmed and the product is sent.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">2. Cancellation</h2>
            <p>You can cancel your subscription at any time from your account settings. However, the current active month's fee is non-refundable.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">3. Exceptional Cases</h2>
            <p>In case of duplicate payments or technical errors, please contact us at support@joblify.in within 24 hours for a resolution.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
