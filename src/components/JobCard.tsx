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
      <div className="bg-white p-8 rounded-[3rem] border border-gray-200 shadow-xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-4 items-center">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Building2 className={cn(isLocked ? "text-gray-400" : "text-[#10B981]")} size={24} />
            </div>
            {user && (
              <button 
                onClick={() => bookmarkMutation.mutate()}
                className={cn(
                  "p-3 rounded-xl border transition-all active:scale-90",
                  isBookmarked 
                    ? "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]" 
                    : "bg-gray-50 border-gray-100 text-gray-300 hover:text-gray-400 hover:bg-gray-100"
                )}
              >
                <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLocked && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full">
                <Lock size={12} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Locked</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating Star Tag */}
        {isNew && (
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pr-0 pt-0">
            <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-[#10B981] rotate-45 flex items-center justify-center pt-8 shadow-lg">
              <Sparkles size={14} className="text-white animate-pulse" />
              <span className="text-white text-[8px] font-black uppercase tracking-tighter ml-1">NEW</span>
            </div>
          </div>
        )}

        <div className="space-y-6 flex-grow">
          <div>
            <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight">
              {job.role}
            </h3>
            <p className={cn(
              "font-bold mt-2 text-sm uppercase tracking-[0.2em]",
              isLocked ? "text-gray-400 italic" : "text-gray-500"
            )}>
              {job.company_name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <Briefcase size={14} className="text-[#10B981]" /> {job.eligibility}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <MapPin size={14} className="text-blue-500" /> Remote
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-gray-50 border border-gray-100 group-hover:border-[#10B981]/20 transition-colors">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={12} className="text-[#10B981]" /> Insider Note
            </p>
            <p className="text-sm text-gray-600 font-bold leading-relaxed italic">
              "{job.important_note || "No specific notes provided for this role."}"
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted On</span>
            <div className="flex items-baseline gap-2">
               <span className="text-xs font-black text-gray-900">{format(date, 'dd MMM yyyy')}</span>
               <span className="text-[10px] font-black text-[#10B981]">{format(date, 'hh:mm a')}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onViewDetails(jobId)}
            className={cn(
               "h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
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
