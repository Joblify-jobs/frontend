"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, Users, ShieldCheck, 
  ArrowRight, Zap, Target, Shield, Briefcase, Sparkles, Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';

const COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Netflix", "Razorpay", "Uber", "Airbnb", "Spotify"];

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-[#10B981]/10 selection:text-[#10B981]">
      {/* Refined Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-48 py-32 relative">
        {/* HERO SECTION */}
        <section className="text-center space-y-16 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#10B981]/5 border border-[#10B981]/10 text-[#10B981] text-[10px] font-black tracking-[0.4em] uppercase"
          >
            <Sparkles size={14} /> The Elite Hunter's Engine
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tighter text-gray-900"
          >
            Find your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
              Joblify.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Stop settling for generic portals. Access real-time verified jobs with direct recruiter notes and verified apply links.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-6 pt-10"
          >
            <Link href="/jobs">
              <Button size="lg" className="bg-[#10B981] hover:bg-[#0D9668] text-white px-10 h-18 text-xl font-black rounded-2xl shadow-xl shadow-[#10B981]/30 active:scale-95 transition-all group">
                Launch Career <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-gray-200 bg-gray-50/50 hover:bg-gray-100 px-10 h-18 text-xl font-black rounded-2xl border-2 text-gray-900 transition-all">
                Go Premium
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* MARQUEE SECTION */}
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-10">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-20 animate-marquee whitespace-nowrap items-center opacity-30">
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <span key={i} className="text-4xl font-black tracking-tighter uppercase text-gray-900">{name}</span>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900">The Joblify Workflow</h2>
            <p className="text-gray-400 font-black text-lg uppercase tracking-[0.3em] text-[10px]">Engineered for speed, built for results.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: <Target className="text-[#10B981]" size={36} />, 
                title: "Precision Scraping", 
                desc: "Our localized engine hunts every 6 hours deep inside product companies to find early access roles." 
              },
              { 
                icon: <Zap className="text-[#3B82F6]" size={36} />, 
                title: "Verified Links", 
                desc: "No more dead ends. Premium members get verified application links that take you straight to the recruiter." 
              },
              { 
                icon: <Shield className="text-[#10B981]" size={36} />, 
                title: "Curated Strategy", 
                desc: "We provide insider interview notes for every major company, so you never go into an interview blind." 
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#10B981]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-black mb-6 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-bold text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS DECK */}
        <section className="bg-gray-50 rounded-[4rem] p-12 md:p-20 border border-gray-100 relative shadow-inner group overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {[
              { icon: <Briefcase className="text-[#10B981]" />, label: "Fresh Jobs", value: "12k+" },
              { icon: <Users className="text-[#3B82F6]" />, label: "Talent Community", value: "48k+" },
              { icon: <Globe className="text-blue-600" />, label: "Global Partners", value: "150+" },
              { icon: <CheckCircle2 className="text-[#10B981]" />, label: "Offer Letters", value: "8.5k+" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-5xl font-black tracking-tighter text-gray-900">{stat.value}</div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="text-center space-y-10 py-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">Ready to dominate?</h2>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Link href="/register">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-black px-20 h-20 text-2xl font-black rounded-3xl shadow-xl active:scale-95 transition-all">
                Get Started Now — It's Free
              </Button>
            </Link>
          </motion.div>
          <p className="text-gray-400 font-bold flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-[10px]">
            <ShieldCheck size={18} className="text-[#10B981]" /> No credit card required.
          </p>
        </section>

        <footer className="pt-24 pb-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 group">
          <div className="flex items-center gap-3">
            <div className="bg-[#10B981] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-[#10B981]/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">Joblify</span>
          </div>
          <p className="text-gray-400 font-black text-[10px] tracking-[0.3em] uppercase">
            Professional Hiring Platform.
          </p>
          <div className="flex gap-8 text-gray-400 font-bold text-sm">
            <Link href="#" className="hover:text-[#10B981] transition-colors uppercase tracking-[0.2em] text-[10px]">Twitter</Link>
            <Link href="#" className="hover:text-[#10B981] transition-colors uppercase tracking-[0.2em] text-[10px]">LinkedIn</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
