"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import JobCard from '@/components/JobCard';
import { Bookmark, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { useState } from 'react';

const BookmarksPage = () => {
  const { user } = useAuthStore();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await api.get('/users/bookmarks');
      return res.data;
    }
  });

  const handleViewDetails = (id: string) => {
    const job = bookmarks?.find((j: any) => (j.id?.toString() || j._id?.toString()) === id);
    const isSubscribed = user?.subscription?.is_subscribed || user?.role === 'admin' || user?.role === 'super_admin';
    
    if (!user || (job?.is_locked && !isSubscribed)) {
      setIsPaywallOpen(true);
    } else {
      window.location.href = `/jobs/${id}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#10B981]" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Saved Jobs...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[8px] font-black tracking-widest uppercase mb-3">
               <Sparkles size={10} /> SAVED
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-gray-900">Your Bookmarks</h1>
          </div>
          
          <div className="flex items-baseline gap-2 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
            <span className="text-3xl font-black text-[#10B981]">{bookmarks?.length || 0}</span>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Jobs</span>
          </div>
        </div>

        {bookmarks?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-16 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
              <Bookmark size={40} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Empty List</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                Start bookmarking jobs to see them here.
              </p>
            </div>
            <Link href="/jobs">
              <Button className="bg-[#10B981] hover:bg-[#0D9668] text-white px-10 h-14 rounded-xl font-black uppercase tracking-widest text-xs">
                Browse Jobs <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks?.map((job: any) => (
              <JobCard 
                key={job.id?.toString() || job._id?.toString() || Math.random()} 
                job={job} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        <SubscriptionPaywall 
          isOpen={isPaywallOpen} 
          onClose={() => setIsPaywallOpen(false)} 
          onSubscribe={() => window.location.href = '/pricing'} 
        />
      </div>
    </ProtectedRoute>
  );
};

export default BookmarksPage;
