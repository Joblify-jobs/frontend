"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Info, Bookmark, Sparkles, Building2, Lock } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const JobDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return res.data;
    }
  });

  const isBookmarked = user?.bookmarks?.includes(id as string);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return api.delete(`/users/bookmarks/${id}`);
      }
      return api.post(`/users/bookmarks/${id}`);
    },
    onSuccess: () => {
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <Loader2 className="animate-spin text-[#10B981]" size={56} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm shadow-red-100">
           <Info size={40} />
         </div>
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Subscription Required</h2>
        <p className="text-gray-500 font-medium mb-8">You need a Pro subscription to view this listing details.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/jobs')} variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-[10px]">Return to Jobs</Button>
          <Button onClick={() => router.push('/pricing')} className="h-14 px-8 bg-[#10B981] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#10B981]/20">Go Pro Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
      {/* Header Section */}
      <div className="relative mt-8 mb-8 overflow-hidden rounded-3xl bg-[#1F2937] p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#10B981]/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/jobs')} 
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg font-bold uppercase tracking-widest text-[10px] mb-8"
          >
            <ArrowLeft size={14} className="mr-2" /> Back to jobs
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white flex items-center justify-center text-[#10B981] font-black text-4xl border-2 border-white/20 shadow-lg">
                {job.company_name[0]}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#10B981] text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                    ACTIVE
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  {job.role}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 font-bold text-lg md:text-xl">
                   <Building2 size={20} className="text-[#10B981]" />
                   <span>{job.company_name}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
               <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                  <Button className="h-14 px-10 bg-[#10B981] hover:bg-[#0D9668] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-[#10B981]/20 w-full transition-all">
                    Apply Now <ExternalLink size={16} className="ml-2" />
                  </Button>
               </a>
               <Button 
                onClick={() => bookmarkMutation.mutate()}
                className={cn(
                  "h-12 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all border cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
                  isBookmarked 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                    : "bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                 <Bookmark size={14} className="mr-2" fill={isBookmarked ? "currentColor" : "none"} /> 
                 {isBookmarked ? "Saved" : "Save Job"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-white border-gray-100 shadow-xl rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Info size={20} className="text-[#10B981]" />
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Job Details</h3>
                </div>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 italic">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    "{job.important_note || "Standard industry requirements apply for this role."}"
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6">
                 <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center gap-4">
                    <Calendar className="text-gray-400" size={20} />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Posted On</span>
                      <span className="text-sm font-black text-gray-700">{format(new Date(job.posted_at), 'dd MMM, yyyy')}</span>
                    </div>
                 </div>
              </section>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-[#F8FAFC] border-gray-100 shadow-lg rounded-3xl p-8 space-y-8">
              <div className="space-y-4">
                 <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Quick Info</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Eligibility</span>
                       <span className="font-black text-gray-900 text-sm">{job.eligibility}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                       <span className="font-black text-[#10B981] text-sm">Active</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Source</span>
                       <span className="font-black text-gray-900 text-sm">Verified</span>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
              <Lock size={18} className="text-blue-500" />
              <p className="text-[10px] font-bold text-blue-600 uppercase">Official Portal Application</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
