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
    <div className="w-full overflow-hidden rounded-[2rem] border border-gray-200 shadow-xl bg-white">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#2D3748] text-white">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-600">Posted</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-600">Company Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-600">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-600">Eligibility</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-600">Important Note</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Apply Link</th>
            </tr>
          </thead>
          <tbody className="">
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
                  transition={{ delay: idx * 0.01 }}
                  className={cn(
                    "group transition-all border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer",
                    idx % 2 === 0 ? "bg-white" : "bg-[#EDF2F7]"
                  )}
                >
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-800">{format(date, 'dd MMM yyyy')}</span>
                      <span className="text-[11px] font-bold text-blue-600">{format(date, 'hh:mm a')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-start gap-1">
                      <span className={cn(
                         "text-sm font-black",
                         isLocked ? "text-gray-400 italic" : "text-gray-900"
                      )}>
                        {job.company_name}
                      </span>
                      {isNew && (
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-[9px] font-black text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-sm border border-[#10B981]/20 uppercase"
                        >
                          NEW
                        </motion.span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{job.role}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                       "inline-block px-3 py-1 rounded-full text-[10px] font-bold border",
                       job.eligibility?.includes("2+ Years") ? "bg-[#B794F4]/20 text-[#6B46C1] border-[#B794F4]/30" : 
                       job.eligibility?.includes("1+ Years") ? "bg-[#A0AEC0]/20 text-[#4A5568] border-[#A0AEC0]/30" : 
                       job.eligibility?.includes("Fresher") ? "bg-[#319795]/20 text-[#285E61] border-[#319795]/30" : 
                       "bg-blue-100 text-blue-600 border-blue-200"
                    )}>
                      {job.eligibility}
                    </span>
                  </td>
                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-xs font-medium text-gray-600 leading-snug">
                       {job.important_note || "Standard industry requirements apply for this role."}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Button 
                      onClick={() => onViewDetails(jobId)}
                      className={cn(
                        "h-9 px-6 rounded-md font-bold text-xs transition-all hover:scale-105 active:scale-95",
                        isLocked 
                          ? "bg-gray-200 text-gray-500" 
                          : "bg-[#10B981] text-white hover:bg-[#0D9668]"
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
