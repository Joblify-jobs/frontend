"use client";
import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">1. Data Collection</h2>
            <p>We collect basic information like your name, email, and resume data to help you find jobs. Payment data is handled securely by Instamojo.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">2. Use of Data</h2>
            <p>Your data is used solely to improve your job search experience. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">3. Security</h2>
            <p>We use industry-standard encryption to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
