"use client";
import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">1. Acceptance of Terms</h2>
            <p>By accessing and using Joblify, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">3. Premium Subscriptions</h2>
            <p>Joblify offers "Elite" subscriptions. Payments are processed via Instamojo. Access to premium features is granted immediately upon successful payment verification.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">4. Limitation of Liability</h2>
            <p>Joblify provides job listings for informational purposes. We do not guarantee employment and are not liable for any disputes between employers and candidates.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
