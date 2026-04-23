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
  Globe, GraduationCap, FileText, LayoutDashboard
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
    }
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
              <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">Job Console</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Inventory Management & Control</p>
            </div>
          </div>
          
          <Button onClick={() => { setEditingJob(null); setIsModalOpen(true); }} className="h-14 bg-[#10B981] hover:bg-[#0D9668] text-white rounded-2xl px-10 font-black uppercase tracking-widest text-xs flex gap-2 shadow-xl shadow-[#10B981]/10 transition-all active:scale-95">
            <Plus size={18} /> New Entry
          </Button>
        </div>

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
