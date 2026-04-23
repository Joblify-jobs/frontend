"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, Users, ShieldCheck,
  Zap, Target, Shield, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Netflix", "Razorpay", "Uber", "Airbnb", "Spotify"];

const LandingPage = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/jobs');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white selection:bg-[#10B981]/10 selection:text-[#10B981]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute top-[15%] -right-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] -left-24 w-96 h-96 bg-[#10B981]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* HERO SECTION */}
        <section className="pt-16 md:pt-24 pb-12 text-center space-y-8 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase shadow-xl"
          >
            <Sparkles size={14} className="text-[#10B981]" /> 500+ New Jobs Added Today
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 leading-tight"
            >
              Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#10B981] to-blue-600">Faster.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed font-bold"
            >
              Get verified job openings from top tech companies. Simple, fast, and 100% real.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto"
          >
            <Button
              onClick={handleGetStarted}
              size="lg" className="bg-[#10B981] hover:bg-[#0D9668] text-white px-12 h-16 text-lg font-black rounded-2xl shadow-xl shadow-[#10B981]/20 w-full transition-all hover:scale-105 active:scale-95"
            >
              Browse Jobs
            </Button>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-gray-200 bg-white hover:bg-gray-50 px-12 h-16 text-lg font-black rounded-2xl border-2 text-gray-900 w-full transition-all">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* LOGO STRIP */}
        <section className="py-12 border-y border-gray-100/50">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-30 grayscale">
            {COMPANIES.slice(0, 6).map((name) => (
              <span key={name} className="text-xl font-black tracking-tighter uppercase text-gray-900">{name}</span>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-32 space-y-20">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 uppercase">How it works</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Simple steps to your next role</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="text-[#10B981]" size={28} />,
                title: "Daily Hunt",
                desc: "We scan job boards every hour to find fresh roles before they go viral."
              },
              {
                icon: <Zap className="text-blue-500" size={28} />,
                title: "Direct Links",
                desc: "Get links that take you straight to the official application page."
              },
              {
                icon: <Shield className="text-[#10B981]" size={28} />,
                title: "Verified",
                desc: "Every job is manually checked by our team to ensure it is real."
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#F8FAFC] p-10 rounded-[2.5rem] border border-gray-100 group transition-all hover:bg-white hover:shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-gray-900 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-32">
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />

            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white relative z-10 leading-tight">Start applying today.</h2>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <Button
                onClick={handleGetStarted}
                size="lg" className="bg-[#10B981] text-white hover:bg-[#0D9668] px-16 h-18 text-xl font-black rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                Get Started Free
              </Button>
              <p className="text-gray-500 font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <ShieldCheck size={16} className="text-[#10B981]" /> Join 48,000+ users finding work.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981] p-2 rounded-xl text-white shadow-lg shadow-[#10B981]/20">
              <Sparkles size={18} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">Joblify</span>
          </div>
          <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">
            Built for modern talent.
          </p>
          <div className="flex gap-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <Link href="#" className="hover:text-[#10B981] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#10B981] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Twitter</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
