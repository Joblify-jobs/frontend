"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface JobTableProps {
  jobs: any[];
  onViewDetails: (id: string) => void;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-3xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5 w-32">Posted</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Company</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Role</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Eligibility</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Context</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {jobs.map((job, idx) => {
              const date = new Date(job.posted_at);
              const isLocked = job.company_name === "Locked (Premium Only)";
              const isNew = date.getTime() > Date.now() - (48 * 60 * 60 * 1000);
              const jobId = job.id?.toString() || job._id?.toString() || `job-${idx}`;

              return (
                <motion.tr 
                  key={jobId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={cn(
                    "group transition-all hover:bg-gray-50/50",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/10"
                  )}
                >
                  <td className="px-4 py-6 text-center relative overflow-hidden group-hover:bg-white transition-colors">
                    {/* Floating Star Tag */}
                    {isNew && (
                      <div className="absolute top-0 right-0 p-1">
                        <Sparkles size={12} className="text-[#10B981] animate-pulse" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-black text-gray-900">{format(date, 'dd MMM')}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black text-[#10B981] bg-[#10B981]/5 px-2 py-0.5 rounded-full border border-[#10B981]/10 uppercase">
                          {format(date, 'hh:mm a')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                       "text-sm font-black",
                       isLocked ? "text-gray-300 italic" : "text-gray-900 group-hover:text-[#10B981] transition-colors"
                    )}>
                      {job.company_name}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">{job.role}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={cn(
                       "inline-block px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                       job.eligibility?.includes("Years") ? "bg-gray-900 text-white border-gray-900" : 
                       job.eligibility?.includes("Fresher") ? "bg-[#10B981] text-white border-[#10B981]" : 
                       "bg-blue-600 text-white border-blue-600"
                    )}>
                      {job.eligibility}
                    </span>
                  </td>
                  <td className="px-6 py-6 max-w-xs">
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed line-clamp-2">
                       {job.important_note || "Secure your future with this elite role."}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <Button 
                      onClick={() => onViewDetails(jobId)}
                      className={cn(
                        "h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                        isLocked 
                          ? "bg-gray-100 text-gray-400 hover:bg-gray-200" 
                          : "bg-[#10B981] text-white hover:bg-[#0D9668] shadow-lg shadow-[#10B981]/20"
                      )}
                    >
                      {isLocked ? (
                        <span className="flex items-center gap-2">Locked <Lock size={12} /></span>
                      ) : (
                        <span className="flex items-center gap-1">Apply <ArrowRight size={14} className="ml-1" /></span>
                      )}
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
