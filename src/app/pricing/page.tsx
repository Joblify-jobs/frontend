"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, ShieldCheck, Crown, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const PricingPage = () => {
  const handlePayment = async () => {
    try {
      const res = await api.post('/subscriptions/create-payment', { plan: 'elite' });
      if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("System busy. Please try again in a few moments.");
    }
  };

  return (
    <div className="py-12 space-y-12 relative overflow-hidden flex flex-col items-center bg-white min-h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden">
      {/* Background Decor - Refined */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#10B981]/5 blur-[100px] rounded-full -z-10" />
      
      <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[8px] font-black tracking-[0.3em] uppercase"
        >
          <Sparkles size={12} /> Full Access Pass
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-gray-900"
        >
          Unlock <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#10B981] bg-[length:200%_auto] animate-gradient">
            Potential.
          </span>
        </motion.h1>
      </div>

      <div className="w-full max-w-xl mx-auto px-6">
        {/* Pro Plan Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group p-1 pr-1 pb-1 rounded-[3rem] bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20 shadow-2xl"
        >
          <div className="bg-white p-10 md:p-14 rounded-[2.8rem] space-y-8 relative overflow-hidden">
            <div className="absolute top-12 right-12 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Crown size={14} className="text-[#10B981]" /> Best Value
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#10B981] uppercase tracking-[0.2em]">Joblify Elite</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-gray-900 tracking-tighter">₹499</span>
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">/30days</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "100+ Daily Roles",
                "Direct Portals",
                "Verified MNCs",
                "Elite Filtering",
                "Strategy Guides",
                "Scam Protection",
                "Priority Support",
                "Saved Roles"
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-gray-700 font-bold text-[10px] uppercase tracking-wider">
                  <div className="bg-[#10B981]/10 p-1 rounded-md flex-shrink-0">
                    <Check size={12} className="text-[#10B981]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full bg-gray-900 hover:bg-black text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-gray-200 active:scale-[0.98] transition-all flex gap-3 group"
            >
              Get Started <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-2">
               <ShieldCheck size={12} className="text-gray-300" />
               <p className="text-center text-gray-400 text-[6px] font-black uppercase tracking-[0.2em]">Payments Secured by Instamojo</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-10 pb-8 pt-4">
        {[
          { icon: <Zap size={16} />, text: "Instant Unlock", color: "#10B981" },
          { icon: <ShieldCheck size={16} />, text: "Data Privacy", color: "#3B82F6" },
          { icon: <Crown size={16} />, text: "Premium Grade", color: "purple-500" }
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-300 font-black uppercase tracking-[0.2em] text-[8px]">
            <div style={{ color: badge.color }} className={i === 2 ? "text-purple-500" : ""}>{badge.icon}</div> {badge.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
