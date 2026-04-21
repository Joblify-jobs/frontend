"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Briefcase, Lock, Sparkles, ChevronRight, Bookmark 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface JobCardProps {
  job: any;
  onViewDetails: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const date = new Date(job.posted_at);
  const isNew = date.getTime() > Date.now() - (48 * 60 * 60 * 1000);
  const isLocked = job.company_name === "Locked (Premium Only)";
  const jobId = job.id?.toString() || job._id?.toString() || Math.random().toString();
  
  const isBookmarked = user?.bookmarks?.includes(jobId);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return api.delete(`/users/bookmarks/${jobId}`);
      }
      return api.post(`/users/bookmarks/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-xl transition-all duration-500 relative overflow-hidden h-full flex flex-col hover:border-[#10B981]/30">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <div className="flex gap-3 md:gap-4 items-center">
            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Building2 className={cn(isLocked ? "text-gray-300" : "text-[#10B981]")} size={20} />
            </div>
            {user && (
              <button 
                onClick={() => bookmarkMutation.mutate()}
                className={cn(
                  "p-2.5 md:p-3 rounded-xl border transition-all active:scale-90",
                  isBookmarked 
                    ? "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]" 
                    : "bg-gray-50 border-gray-100 text-gray-300 hover:text-gray-400 hover:bg-gray-100"
                )}
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLocked && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                <Lock size={10} className="text-gray-400" />
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Locked</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Star Tag */}
        {isNew && (
          <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pr-0 pt-0">
            <div className="absolute top-[-8px] right-[-8px] w-16 h-16 bg-[#10B981] rotate-45 flex items-center justify-center pt-6 shadow-lg">
              <Sparkles size={12} className="text-white animate-pulse" />
              <span className="text-white text-[7px] font-black uppercase tracking-tighter ml-1">NEW</span>
            </div>
          </div>
        )}

        <div className="space-y-4 md:space-y-6 flex-grow">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight">
              {job.role}
            </h3>
            <p className={cn(
              "font-bold mt-1 md:mt-2 text-[11px] md:text-sm uppercase tracking-[0.2em]",
              isLocked ? "text-gray-300 italic" : "text-gray-400"
            )}>
              {job.company_name}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Briefcase size={12} className="text-[#10B981]" /> {job.eligibility}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <MapPin size={12} className="text-blue-500" /> Remote
            </div>
          </div>

          <div className="p-4 md:p-5 rounded-2xl md:rounded-[2rem] bg-gray-50/50 border border-gray-100 group-hover:border-[#10B981]/10 transition-colors">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
              <Sparkles size={10} className="text-[#10B981]" /> Insider Note
            </p>
            <p className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed italic line-clamp-2">
              "{job.important_note || "No specific notes provided for this role."}"
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 w-full sm:w-auto">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Posted On</span>
            <div className="flex items-baseline gap-2">
               <span className="text-xs font-black text-gray-900">{format(date, 'dd MMM yyyy')}</span>
               <span className="text-[9px] font-black text-[#10B981]">{format(date, 'hh:mm a')}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onViewDetails(jobId)}
            className={cn(
               "h-12 md:h-14 w-full sm:w-auto px-8 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
               isLocked 
                ? "bg-gray-100 text-gray-400 hover:bg-gray-200" 
                : "bg-[#10B981] text-white hover:bg-[#0D9668] shadow-lg shadow-[#10B981]/20 active:scale-95"
            )}
          >
            {isLocked ? (
              <span className="flex items-center gap-2">Unlock <Lock size={12} /></span>
            ) : (
              <span className="flex items-center gap-2">Apply Now <ChevronRight size={14} /></span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
