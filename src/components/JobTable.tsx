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
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#2D3748] text-white">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-white/10 w-32">Posted</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-white/10">Company Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-white/10">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-white/10">Eligibility</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-white/10">Important Note</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Apply Link</th>
            </tr>
          </thead>
          <tbody>
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
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    "group border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  <td className="px-4 py-4 text-center relative overflow-hidden">
                    {/* Floating Star Tag */}
                    {isNew && (
                      <div className="absolute top-0 right-0 p-1">
                        <Sparkles size={12} className="text-[#10B981] animate-pulse" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-black text-gray-700">{format(date, 'dd MMM yyyy')}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                          {format(date, 'hh:mm a')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                       "text-sm font-black",
                       isLocked ? "text-gray-400 italic" : "text-gray-900"
                    )}>
                      {job.company_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-600">{job.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                       "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                       job.eligibility?.includes("Years") ? "bg-gray-500 text-white border-gray-600" : 
                       job.eligibility?.includes("Fresher") ? "bg-[#10B981] text-white border-[#0D9668]" : 
                       "bg-blue-400 text-white border-blue-500"
                    )}>
                      {job.eligibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[11px] font-bold text-gray-500 leading-relaxed line-clamp-3">
                      {job.important_note || "Secure your future with this elite role."}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      onClick={() => onViewDetails(jobId)}
                      className={cn(
                        "h-10 px-6 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105",
                        isLocked 
                          ? "bg-gray-200 text-gray-500 hover:bg-gray-300" 
                          : "bg-[#10B981] text-white hover:bg-[#0D9668] shadow-lg shadow-[#10B981]/20"
                      )}
                    >
                      {isLocked ? (
                        <span className="flex items-center gap-2">Locked <Lock size={12} /></span>
                      ) : (
                        <span className="flex items-center gap-1">Apply Now <ArrowRight size={14} className="ml-1" /></span>
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
