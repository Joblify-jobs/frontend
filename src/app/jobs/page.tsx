"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import JobCard from '@/components/JobCard';
import JobTable from '@/components/JobTable';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { useAuthStore } from '@/store/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, Sparkles, TrendingUp } from 'lucide-react';
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
    if (!user || (job?.is_locked && !user.subscription.is_subscribed)) {
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
    <div className="space-y-12 pb-24">
      {/* Dynamic Header */}
      <section className="text-center space-y-8 pt-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#10B981]/5 border border-[#10B981]/10 text-[#10B981] text-[10px] font-black tracking-[0.4em] uppercase">
          <TrendingUp size={14} /> LIVE OPPORTUNITIES
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
            Find your <span className="text-[#10B981]">Dream Career.</span>
          </h1>
          <p className="text-gray-500 font-bold max-w-xl mx-auto uppercase tracking-widest text-[10px]">
            Verified roles from elite tech brands. Refreshing every 6 hours.
          </p>
        </div>
      </section>

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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing database...</span>
          </motion.div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#10B981]">
              <Sparkles size={32} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Access Restricted</h3>
              <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">
                Discover 1,000+ elite roles by upgrading to a Pro subscription.
              </p>
            </div>
            <Button 
              onClick={() => setIsPaywallOpen(true)}
              className="bg-gray-900 text-white rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] hover:bg-black"
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
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-gray-100">
                <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs font-sans">NO ROLES FOUND IN THIS SECTOR</p>
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

      <SubscriptionPaywall 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
        onSubscribe={() => window.location.href = '/pricing'} 
      />
    </div>
  );
};

export default JobsPage;
