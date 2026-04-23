"use client";
import React from 'react';
import { motion } from 'framer-motion';

const LiveTicker = () => {
  const companies = [
    "TCS", "Microsoft", "Adobe", "Amazon", "Google", "Infosys", "Deloitte", 
    "+50 more companies"
  ];

  // Combine rocket info with companies for a single ticker line
  const tickerItems = [
    { text: "New jobs added daily", icon: "🚀" },
    ...companies.map(c => ({ text: c }))
  ];

  return (
    <div className="w-full bg-[#10B981] py-2.5 overflow-hidden border-b border-[#0D9668] flex items-center">
      <div className="flex items-center px-6 bg-[#10B981] z-10 border-r border-[#0D9668]/30">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] mr-2" />
        <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden flex items-center">
        <motion.div 
          className="flex items-center gap-8 whitespace-nowrap px-4"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          whileHover={{ transition: { duration: 100 } }} // Slow down significantly on hover
        >
          {/* First Set */}
          {tickerItems.map((item, idx) => (
            <div key={`set1-${idx}`} className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-white text-[11px] font-bold uppercase tracking-tight">
                {item.icon && <span className="text-sm">{item.icon}</span>}
                {item.text}
              </span>
              <span className="text-white/30 font-black">•</span>
            </div>
          ))}
          {/* Duplicate Set for Seamless Loop */}
          {tickerItems.map((item, idx) => (
            <div key={`set2-${idx}`} className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-white text-[11px] font-bold uppercase tracking-tight">
                {item.icon && <span className="text-sm">{item.icon}</span>}
                {item.text}
              </span>
              <span className="text-white/30 font-black">•</span>
            </div>
          ))}
          {/* Third Set for extra safety on wide screens */}
          {tickerItems.map((item, idx) => (
            <div key={`set3-${idx}`} className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-white text-[11px] font-bold uppercase tracking-tight">
                {item.icon && <span className="text-sm">{item.icon}</span>}
                {item.text}
              </span>
              <span className="text-white/30 font-black">•</span>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};


export default LiveTicker;
