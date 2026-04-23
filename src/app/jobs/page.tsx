"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import JobCard from '@/components/JobCard';
import JobTable from '@/components/JobTable';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import LiveTicker from '@/components/LiveTicker';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const JobsPage = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const debouncedSearch = useDebounce(search, 300);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', debouncedSearch, filter, page, user?.id],
    queryFn: async () => {
      const res = await api.get('/jobs/', {
        params: {
          search: debouncedSearch,
          eligibility: filter,
          page,
          limit: 10
        }
      });
      return res.data;
    }
  });

  const handleViewDetails = (id: string) => {
    const job = data?.jobs?.find((j: any) => j.id === id);
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    
    if (!user || (job?.is_locked && !user.subscription.is_subscribed && !isAdmin)) {
      setIsPaywallOpen(true);
    } else {
      window.location.href = `/jobs/${id}`;
    }
  };

  const handlePageChange = (newPage: number) => {
    const isSubscribed = user?.subscription?.is_subscribed || user?.role === 'admin' || user?.role === 'super_admin';
    if (newPage > 1 && !isSubscribed) {
      setIsPaywallOpen(true);
    } else {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LiveTicker />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <FilterBar 
          onSearch={(val) => { setSearch(val); setPage(1); }} 
          onFilter={(val) => { setFilter(val); setPage(1); }} 
          currentFilter={filter} 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center h-96 gap-4"
            >
              <Loader2 className="animate-spin text-[#10B981]" size={48} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Syncing database...</span>
            </motion.div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#10B981]">
                <Sparkles size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Access Restricted</h3>
                <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">
                  Discover 1,000+ elite roles by upgrading to a Pro subscription.
                </p>
              </div>
              <Button 
                onClick={() => setIsPaywallOpen(true)}
                className="bg-gray-900 text-white rounded-xl px-10 h-12 font-bold uppercase tracking-widest text-xs hover:bg-black"
              >
                Unlock All Pages
              </Button>
            </div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.jobs?.map((job: any) => (
                    <JobCard 
                      key={job.id?.toString() || job._id?.toString() || Math.random()} 
                      job={job} 
                      onViewDetails={handleViewDetails} 
                    />
                  ))}
                </div>
              ) : (
                <JobTable 
                  jobs={data?.jobs || []} 
                  onViewDetails={handleViewDetails} 
                />
              )}

              {(data?.jobs?.length === 0) && (
                <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">NO ROLES FOUND IN THIS SECTOR</p>
                </div>
              )}

              <Pagination 
                 current={page} 
                 total={data?.pages || 0} 
                 onPageChange={handlePageChange} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SubscriptionPaywall 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onSubscribe={() => window.location.href = '/pricing'} 
      />
    </div>
  );
};

export default JobsPage;
