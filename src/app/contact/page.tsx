"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase"
          >
            <Sparkles size={14} className="text-[#10B981]" /> SUPPORT
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">Contact Us</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">We're here to help you with your career</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#10B981]">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Support</p>
              <p className="text-lg font-black text-gray-900">support@joblify.in</p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-blue-500">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Us</p>
              <p className="text-lg font-black text-gray-900">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-purple-500">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
              <p className="text-lg font-black text-gray-900">Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
