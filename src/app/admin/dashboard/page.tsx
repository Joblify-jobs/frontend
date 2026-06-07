"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, Search, Trash2, Edit2, Loader2, Sparkles, 
  Building2, Briefcase, Lock, CheckCircle2,
  Globe, GraduationCap, FileText, LayoutDashboard,
  XCircle, CreditCard, Clock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Pagination from '@/components/Pagination';
import ProtectedRoute from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

const AdminJobsDashboard = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'jobs' | 'subscriptions' | 'approvals'>('jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    eligibility: '',
    apply_link: '',
    important_note: '',
    is_active: true
  });

  // Fetch Jobs
  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', search, page],
    queryFn: async () => {
      const res = await api.get('/jobs/', {
        params: {
          search,
          page,
          limit: 10,
          sort: 'newest'
        }
      });
      return res.data;
    },
    enabled: activeTab === 'jobs'
  });

  // Fetch Subscriptions
  const { data: subscriptions, isLoading: isLoadingSubs } = useQuery({
    queryKey: ['admin-subscriptions', search],
    queryFn: async () => {
      const res = await api.get('/admin/subscriptions', {
        params: { search }
      });
      return res.data;
    },
    enabled: activeTab === 'subscriptions'
  });

  // Fetch Pending Payments
  const { data: pendingPayments, isLoading: isLoadingPending } = useQuery({
    queryKey: ['admin-pending-payments'],
    queryFn: async () => {
      const res = await api.get('/admin/pending-payments');
      return res.data;
    },
    enabled: activeTab === 'approvals'
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingJob) {
        return api.patch(`/jobs/${editingJob.id}`, data);
      }
      return api.post('/jobs/', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setIsModalOpen(false);
      setEditingJob(null);
      setFormData({ company_name: '', role: '', eligibility: '', apply_link: '', important_note: '', is_active: true });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/jobs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
  });

  const approvePaymentMutation = useMutation({
    mutationFn: async (userId: string) => api.post(`/admin/approve-payment/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      alert("Payment approved and user subscription activated for 3 months!");
    }
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: async (userId: string) => api.post(`/admin/reject-payment/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-payments'] });
      alert("Payment rejected.");
    }
  });

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      company_name: job.company_name,
      role: job.role,
      eligibility: job.eligibility,
      apply_link: job.apply_link || '',
      important_note: job.important_note || '',
      is_active: job.is_active ?? true
    });
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-8 pb-20 px-4 md:px-0">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-6">
          <div className="flex items-center gap-5">
            <div className="bg-[#10B981]/10 p-4 rounded-[1.5rem] border border-[#10B981]/20 shadow-sm">
               <LayoutDashboard className="text-[#10B981]" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">Admin Console</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Portal Control & Analytics</p>
            </div>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
            {[
              { id: 'jobs', label: 'Job Inventory' },
              { id: 'subscriptions', label: 'Subscriptions' },
              { id: 'approvals', label: 'Pending Approvals' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearch(""); }}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-white text-[#10B981] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === 'jobs' && (
            <Button onClick={() => { setEditingJob(null); setIsModalOpen(true); }} className="h-14 bg-[#10B981] hover:bg-[#0D9668] text-white rounded-2xl px-10 font-black uppercase tracking-widest text-xs flex gap-2 shadow-xl shadow-[#10B981]/10 transition-all active:scale-95">
              <Plus size={18} /> New Entry
            </Button>
          )}
        </div>

        {activeTab === 'jobs' && (
          <Card className="border-gray-100 shadow-3xl rounded-[2.5rem] overflow-hidden bg-white border">
            <CardHeader className="px-10 py-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50/30">
               <div className="relative flex-1 w-full group">
                  <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Filter by company, role or batch..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full bg-white border border-gray-100 h-16 pl-16 pr-8 rounded-2xl outline-none focus:ring-4 focus:ring-[#10B981]/5 focus:border-[#10B981]/20 font-bold text-sm transition-all shadow-sm"
                  />
               </div>
               <div className="flex shrink-0 items-center gap-4 text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] bg-white px-8 py-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                  <span>{data?.total || 0} TOTAL RECORDS</span>
               </div>
            </CardHeader>
            
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-32 flex flex-col items-center gap-6">
                   <Loader2 className="animate-spin text-[#10B981]" size={48} />
                   <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Database...</span>
                </div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-[#1F2937] text-white">
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5 w-40">Timestamp</th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Corporate Identity</th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Designation</th>
                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5 w-32">Eligibility</th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center border-r border-white/5">Contextual Note</th>
                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-center">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {data?.jobs?.map((job: any, idx: number) => {
                        const date = new Date(job.posted_at);
                        return (
                          <tr key={job.id} className={cn(
                            "transition-all border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer",
                            idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                          )}>
                            <td className="px-6 py-6 text-center">
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-gray-800">{format(date, 'dd MMM yyyy')}</span>
                                <span className="text-[11px] font-black text-blue-500 uppercase tracking-tighter">{format(date, 'hh:mm a')}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 font-black text-sm text-gray-900 text-center">{job.company_name}</td>
                            <td className="px-8 py-6 font-bold text-sm text-gray-600 text-center uppercase tracking-tight">{job.role}</td>
                            <td className="px-6 py-6 text-center">
                              <span className={cn(
                                "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                job.eligibility?.includes("Years") ? "bg-[#A0AEC0]/10 text-[#4A5568] border-[#A0AEC0]/20" : 
                                job.eligibility?.includes("Fresher") ? "bg-[#10B981]/10 text-[#285E61] border-[#10B981]/20" : 
                                "bg-blue-50 text-blue-600 border-blue-100"
                              )}>
                                {job.eligibility}
                              </span>
                            </td>
                            <td className="px-8 py-6 max-w-xs">
                              <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-2 italic">
                                 "{job.important_note || "Standard industry role entry."}"
                              </p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center gap-3">
                                <Button 
                                  onClick={() => handleEdit(job)}
                                  className="h-11 w-11 p-0 bg-white border border-gray-100 text-gray-400 hover:text-[#10B981] hover:border-[#10B981]/30 hover:bg-white shadow-sm rounded-xl transition-all hover:scale-110 active:scale-95"
                                >
                                  <Edit2 size={18} />
                                </Button>
                                <Button 
                                  onClick={() => deleteMutation.mutate(job.id)}
                                  className="h-11 w-11 p-0 bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-white shadow-sm rounded-xl transition-all hover:scale-110 active:scale-95"
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {data?.jobs?.length === 0 && (
                    <div className="py-32 text-center bg-white">
                      <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs">No entries found</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="bg-gray-50/30 py-4 border-t border-gray-50">
              <Pagination 
                current={page} 
                total={data?.pages || 0} 
                onPageChange={setPage} 
              />
            </div>
          </Card>
        )}

        {activeTab === 'subscriptions' && (
          <Card className="border-gray-100 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="px-10 py-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50/30">
               <div className="relative flex-1 w-full group">
                  <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10B981] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-100 h-16 pl-16 pr-8 rounded-2xl outline-none focus:ring-4 focus:ring-[#10B981]/5 focus:border-[#10B981]/20 font-bold text-sm transition-all shadow-sm"
                  />
               </div>
            </CardHeader>
            <div className="overflow-x-auto">
              {isLoadingSubs ? (
                <div className="p-32 flex flex-col items-center gap-6">
                   <Loader2 className="animate-spin text-[#10B981]" size={48} />
                   <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Fetching Subscriptions...</span>
                </div>
              ) : (
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#1F2937] text-white">
                      <th className="px-10 py-5 text-[11px] font-black uppercase tracking-widest">User Details</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Plan Status</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-center">Billing Period</th>
                      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Days Pending</th>
                      <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-center">Last Txn Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subscriptions?.map((sub: any) => (
                      <tr key={sub.user_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-[#10B981]">
                               {sub.name[0]}
                             </div>
                             <div>
                               <p className="font-black text-gray-900">{sub.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub.email}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={cn(
                            "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            sub.is_subscribed ? "bg-[#10B981]/10 text-[#285E61] border-[#10B981]/20" : "bg-red-50 text-red-600 border-red-100"
                          )}>
                            {sub.is_subscribed ? "ACTIVE" : "EXPIRED"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center text-xs font-bold text-gray-700">
                          {sub.start_date ? (
                            <div>
                              <span>{format(new Date(sub.start_date), 'dd MMM yyyy')}</span>
                              <span className="mx-2 text-gray-400">to</span>
                              <span>{format(new Date(sub.end_date), 'dd MMM yyyy')}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-normal">No Active Billing</span>
                          )}
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={cn(
                            "text-sm font-black flex items-center justify-center gap-1.5",
                            sub.days_left > 10 ? "text-green-600" : sub.days_left > 0 ? "text-yellow-600" : "text-gray-400"
                          )}>
                            <Clock size={16} /> {sub.days_left} Days
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="font-mono text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            {sub.manual_transaction_id || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!subscriptions || subscriptions.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'approvals' && (
          <Card className="border-gray-100 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="px-10 py-10 border-b border-gray-50">
              <CardTitle className="text-3xl font-black tracking-tighter">Manual Payment Approvals</CardTitle>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Verify payment details and activate access</p>
            </CardHeader>
            <div className="overflow-x-auto">
              {isLoadingPending ? (
                <div className="p-32 flex flex-col items-center gap-6">
                   <Loader2 className="animate-spin text-[#10B981]" size={48} />
                   <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Fetching Approvals...</span>
                </div>
              ) : (
                <table className="w-full text-left min-w-[1100px]">
                  <thead>
                    <tr className="bg-[#1F2937] text-white">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Paid By / Amount / Time</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Txn Ref ID</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Transaction Details</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingPayments?.map((u: any) => (
                      <tr key={u.id} className="hover:bg-gray-50/10 transition-colors group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center font-black text-orange-500">
                               {u.name[0]}
                             </div>
                             <div>
                               <p className="font-black text-gray-900">{u.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.email}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <p className="font-bold text-sm text-gray-900">{u.subscription.manual_payment_name || "N/A"}</p>
                          <p className="text-sm font-black text-[#10B981]">₹{u.subscription.manual_payment_amount || "0.00"}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.subscription.manual_payment_time || "N/A"}</p>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className="font-mono text-sm font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            {u.subscription.manual_transaction_id}
                          </span>
                        </td>
                        <td className="px-10 py-8 max-w-xs text-center text-xs font-bold text-gray-600 leading-relaxed italic">
                          "{u.subscription.manual_payment_details || "No comments"}"
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3">
                             <Button 
                              onClick={() => approvePaymentMutation.mutate(u.id)}
                              className="h-10 px-6 bg-[#10B981] hover:bg-[#0D9668] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/20 flex gap-2"
                            >
                              Approve <CheckCircle2 size={14} />
                            </Button>
                            <Button 
                              onClick={() => rejectPaymentMutation.mutate(u.id)}
                              variant="ghost" 
                              className="h-10 w-10 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <XCircle size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!pendingPayments || pendingPayments.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          No pending payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}

        {/* Professional Job Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-0 sm:max-w-[900px] w-[95vw] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col transition-all">
            <DialogHeader className="p-10 border-b border-gray-100 shrink-0 bg-white/50">
               <div className="flex items-center gap-6">
                  <div className="bg-[#10B981]/10 p-4 rounded-2xl shadow-inner">
                    {editingJob ? <Edit2 className="text-[#10B981]" size={24} /> : <Plus className="text-[#10B981]" size={28} />}
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black tracking-tight text-gray-900">
                      {editingJob ? "Refine Job Data" : "Initialize New Job"}
                    </DialogTitle>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">Global Inventory Synchronization</p>
                  </div>
               </div>
            </DialogHeader>

            <div className="p-10 space-y-8 overflow-y-auto flex-grow scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] ml-1">Designation / Role</label>
                  <Input 
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value})}
                     className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-4 focus:ring-[#10B981]/5 font-bold text-sm transition-all"
                     placeholder="e.g. Senior Fullstack Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] ml-1">Corporate Identity</label>
                  <Input 
                     value={formData.company_name}
                     onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                     className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-4 focus:ring-[#10B981]/5 font-bold text-sm transition-all"
                     placeholder="e.g. Microsoft India"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] ml-1">Eligibility Criteria</label>
                  <Input 
                     value={formData.eligibility}
                     onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                     className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-4 focus:ring-[#10B981]/5 font-bold text-sm transition-all"
                     placeholder="e.g. Fresher / 2024 - 2025 Batch"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] ml-1">Global Apply URL</label>
                  <Input 
                     value={formData.apply_link}
                     onChange={(e) => setFormData({...formData, apply_link: e.target.value})}
                     className="h-14 rounded-2xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-4 focus:ring-[#10B981]/5 font-bold text-sm transition-all"
                     placeholder="https://jobs.company.com/..."
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981] ml-1">Contextual Insight / Note</label>
                  <textarea 
                     value={formData.important_note}
                     onChange={(e) => setFormData({...formData, important_note: e.target.value})}
                     className="w-full bg-gray-50 border border-gray-100 h-48 rounded-2xl p-6 outline-none focus:border-[#10B981]/20 focus:ring-4 focus:ring-[#10B981]/5 font-bold text-sm transition-all resize-none shadow-inner"
                     placeholder="Provide essential details or referral guidance for candidates..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 border-t border-gray-100 shrink-0 bg-gray-50/50">
               <div className="flex w-full gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-14 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => upsertMutation.mutate(formData)}
                    disabled={upsertMutation.isPending}
                    className="flex-[2] h-14 bg-[#10B981] text-white hover:bg-[#0D9668] rounded-xl font-black uppercase tracking-widest text-xs flex gap-2 shadow-lg shadow-[#10B981]/10"
                  >
                    {upsertMutation.isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {editingJob ? "Update Job" : "Create Job"}
                  </Button>
               </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default AdminJobsDashboard;
