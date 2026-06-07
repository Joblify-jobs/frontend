"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, ShieldCheck, Crown, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const PricingPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(99);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await api.get('/subscriptions/amount');
        setAmount(res.data.subscription_amount);
      } catch (err) {
        console.error("Failed to fetch subscription amount", err);
      }
    };
    fetchAmount();
  }, []);
  
  const handlePayment = async () => {
    router.push('/pay');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white selection:bg-[#10B981]/10 selection:text-[#10B981]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute top-[15%] -right-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative pt-10 md:pt-16 pb-12 space-y-8 flex flex-col items-center">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase shadow-xl"
          >
            <Sparkles size={14} className="text-[#10B981]" /> PRICING
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-tight"
          >
            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#10B981] to-blue-600">Potential.</span>
          </motion.h1>
        </div>

        <div className="w-full max-w-lg mx-auto">
          {/* Elite Plan Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-8 right-8 bg-[#10B981] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Crown size={14} /> ELITE
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-black text-[#10B981] uppercase tracking-widest">Full Access</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">₹{amount}</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">/ 3 months</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  "100+ New Jobs Daily",
                  "Direct Apply Links",
                  "Verified MNC Roles",
                  "Elite Filters",
                  "Strategy Guides",
                  "Priority Support"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-gray-700 font-bold text-[10px] uppercase tracking-wider">
                    <Check size={14} className="text-[#10B981]" />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex gap-2"
              >
                Go Elite <Rocket size={18} />
              </Button>

              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-[#10B981]" />
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Secure Manual Verification</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8">
          {[
            { icon: <Zap size={16} />, text: "Instant Unlock" },
            { icon: <ShieldCheck size={16} />, text: "Secure Data" },
            { icon: <Crown size={16} />, text: "Premium Content" }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest text-[9px]">
              <div className="text-[#10B981]">{badge.icon}</div> {badge.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

