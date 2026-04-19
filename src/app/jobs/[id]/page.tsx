"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Info, Bookmark, Sparkles, Building2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const JobDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
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
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/jobs')} 
        className="text-gray-400 hover:text-[#10B981] hover:bg-[#10B981]/5 rounded-xl font-black uppercase tracking-widest text-[10px] mt-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Return
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[3.5rem] overflow-hidden">
            <CardHeader className="p-10 md:p-14 border-b border-gray-50">
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-[#10B981] font-black text-4xl shadow-inner">
                    {job.company_name[0]}
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 leading-none">{job.role}</h1>
                    <div className="flex items-center gap-2">
                       <Building2 size={16} className="text-[#10B981]" />
                       <p className="text-lg font-bold text-gray-400">{job.company_name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                   <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-600">
                      <Calendar size={14} className="text-[#10B981]" /> {format(new Date(job.posted_at), 'MMMM d, yyyy')}
                   </div>
                   <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-600">
                      <MapPin size={14} className="text-blue-500" /> Remote / Global
                   </div>
                   <div className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981]/5 rounded-2xl border border-[#10B981]/10 text-[11px] font-black uppercase tracking-widest text-[#10B981]">
                      <Sparkles size={14} /> Verified Source
                   </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 md:p-14 space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Info size={24} className="text-[#10B981]" /> Important Note
                </h3>
                <div className="p-10 bg-gray-50/50 rounded-[3rem] border border-gray-100 text-gray-600 leading-relaxed font-medium italic relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Info size={100} />
                  </div>
                  <p className="relative z-10">{job.important_note || "No specific details provided by the recruiter."}</p>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                 <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                   Public ID: {job.id} • Secure Recruitment Path Active
                 </p>
                 <Link href="#" className="text-[#10B981] font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-4">Report an issue</Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="bg-white border-gray-100 shadow-xl rounded-[3rem] p-10 space-y-8 sticky top-32">
              <div className="space-y-4">
                 <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] text-center">Ready to advance?</p>
                 <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full h-20 bg-[#10B981] hover:bg-[#0D9668] text-white font-black uppercase tracking-widest text-sm rounded-3xl shadow-2xl shadow-[#10B981]/20 group transition-all">
                       Apply Now <ExternalLink size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                 </a>
              </div>
              
              <div className="space-y-6 pt-4">
                 <div className="flex justify-between items-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Eligibility</p>
                    <p className="font-black text-gray-900">{job.eligibility}</p>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Status</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                       <p className="font-black text-[#10B981]">Active Now</p>
                    </div>
                 </div>
              </div>

              <Button 
                onClick={() => bookmarkMutation.mutate()}
                variant={isBookmarked ? "default" : "outline"}
                className={cn(
                  "w-full h-16 rounded-2xl border-gray-100 font-black uppercase tracking-widest text-[10px] transition-all",
                  isBookmarked 
                    ? "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/20" 
                    : "text-gray-400 hover:text-[#10B981] hover:border-[#10B981] hover:bg-gray-50"
                )}
              >
                 <Bookmark size={18} className="mr-2" fill={isBookmarked ? "currentColor" : "none"} /> 
                 {isBookmarked ? "Job Saved" : "Save Job"}
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
