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
  const { user, fetchUser } = useAuthStore();
  const queryClient = useQueryClient();
  const date = new Date(job.posted_at);
  const isNew = date.getTime() > Date.now() - (48 * 60 * 60 * 1000);
  const isLocked = job.company_name === "Locked (Premium Only)";
  const jobId = job.id?.toString() || job._id?.toString();
  
  const isBookmarked = user?.bookmarks?.includes(jobId);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (isBookmarked) {
        return api.delete(`/users/bookmarks/${jobId}`);
      }
      return api.post(`/users/bookmarks/${jobId}`);
    },
    onSuccess: () => {
      // Optimistically update local state
      if (user) {
        const newBookmarks = isBookmarked 
          ? user.bookmarks.filter(id => id !== jobId)
          : [...user.bookmarks, jobId];
        
        useAuthStore.setState({ 
          user: { ...user, bookmarks: newBookmarks } 
        });
      }
      
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-[#10B981]/20 flex flex-col h-full relative overflow-hidden">
        {/* New Badge - Perfectly Aligned */}
        {isNew && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-[#10B981] text-white text-[7px] font-black px-2 py-0.5 rounded-md shadow-lg shadow-[#10B981]/20 flex items-center gap-1 uppercase tracking-tighter">
              <Sparkles size={8} /> New Role
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100 group-hover:scale-110 transition-transform duration-500">
            <Building2 className={cn(isLocked ? "text-gray-300" : "text-[#10B981]")} size={24} />
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              bookmarkMutation.mutate();
            }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border cursor-pointer",
              isBookmarked 
                ? "bg-[#10B981] border-[#10B981] text-white shadow-lg shadow-[#10B981]/20" 
                : "bg-white border-gray-100 text-gray-300 hover:text-[#10B981] hover:border-[#10B981]/30"
            )}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="space-y-4 flex-grow">
          <div>
            <h3 className="text-xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors leading-tight line-clamp-1">
              {job.role}
            </h3>
            <p className={cn(
              "font-bold mt-1 text-[10px] uppercase tracking-widest",
              isLocked ? "text-gray-300 italic" : "text-gray-400"
            )}>
              {job.company_name}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-gray-500 text-[9px] font-black uppercase tracking-widest bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-gray-100">
              <Briefcase size={12} className="text-[#10B981]" /> {job.eligibility}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-[9px] font-black uppercase tracking-widest bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-gray-100">
              <MapPin size={12} className="text-blue-500" /> Remote
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC]/50 border border-gray-50">
            <p className="text-xs text-gray-500 font-bold leading-relaxed line-clamp-2">
              {job.important_note || "No specific instructions provided for this role."}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Posted</span>
            <span className="text-[11px] font-black text-gray-900">{format(date, 'dd MMM yyyy')}</span>
          </div>
          
          <Button 
            onClick={() => onViewDetails(jobId)}
            className={cn(
               "h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
               isLocked 
                ? "bg-gray-100 text-gray-400 hover:bg-gray-200" 
                : "bg-gray-900 text-white hover:bg-black shadow-xl active:scale-95"
            )}
          >
            {isLocked ? "Unlock" : "View Details"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
