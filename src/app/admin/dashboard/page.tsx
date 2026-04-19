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
import ProtectedRoute from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

const AdminJobsDashboard = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
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
    queryKey: ['admin-jobs', search],
    queryFn: async () => {
      const res = await api.get(`/jobs?search=${search}&limit=100&sort=newest`);
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
      <div className="space-y-6 pb-20">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#10B981]/10 p-3 rounded-2xl border border-[#10B981]/20">
               <LayoutDashboard className="text-[#10B981]" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-none">Job Management</h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage platform job inventory</p>
            </div>
          </div>
          
          <Button onClick={() => { setEditingJob(null); setIsModalOpen(true); }} className="h-14 bg-[#10B981] hover:bg-[#0D9668] text-white rounded-xl px-8 font-black uppercase tracking-widest text-xs flex gap-2 shadow-lg shadow-[#10B981]/10 transition-all active:scale-95">
            <Plus size={18} /> Add New Job
          </Button>
        </div>

        <Card className="border-gray-200 shadow-xl rounded-xl overflow-hidden bg-white">
          <CardHeader className="px-8 py-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 h-14 pl-14 pr-6 rounded-xl outline-none focus:ring-2 focus:ring-[#10B981]/10 font-bold text-sm transition-all"
                />
             </div>
             <div className="flex shrink-0 items-center gap-3 text-gray-400 font-black uppercase tracking-widest text-[10px] bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                <Sparkles size={14} className="text-[#10B981]" /> {data?.total || 0} TOTAL JOBS
             </div>
          </CardHeader>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-24 flex flex-col items-center gap-4">
                 <Loader2 className="animate-spin text-[#10B981]" size={32} />
                 <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Jobs...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#2D3748] text-white">
                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/10 w-32">Posted</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/10">Company Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/10">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/10 w-24">Eligibility</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/10">Important Note</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.jobs?.map((job: any, idx: number) => {
                    const date = new Date(job.posted_at);
                    return (
                      <tr key={job.id} className={cn(
                        "hover:bg-gray-50/80 transition-colors",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      )}>
                        <td className="px-4 py-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[11px] font-black text-gray-700">{format(date, 'dd MMM yyyy')}</span>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                              {format(date, 'hh:mm a')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-black text-sm text-gray-900 text-center">{job.company_name}</td>
                        <td className="px-6 py-6 font-bold text-sm text-gray-600 text-center">{job.role}</td>
                        <td className="px-4 py-6 text-center">
                          <span className={cn(
                            "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                            job.eligibility?.includes("Years") ? "bg-gray-500 text-white border-gray-600" : 
                            job.eligibility?.includes("Fresher") ? "bg-[#10B981] text-white border-[#0D9668]" : 
                            "bg-blue-400 text-white border-blue-500"
                          )}>
                            {job.eligibility}
                          </span>
                        </td>
                        <td className="px-6 py-6 max-w-xs">
                          <p className="text-[11px] font-bold text-gray-500 leading-relaxed line-clamp-2">
                             {job.important_note || "No specific notes provided."}
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center gap-2">
                            <Button 
                              onClick={() => handleEdit(job)}
                              className="h-10 w-10 p-0 bg-white border border-gray-200 text-gray-400 hover:text-[#10B981] hover:border-[#10B981] hover:bg-gray-50 rounded-lg shadow-sm"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button 
                              onClick={() => deleteMutation.mutate(job.id)}
                              className="h-10 w-10 p-0 bg-white border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-lg shadow-sm"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Professional Job Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white rounded-2xl border-0 p-0 max-w-5xl shadow-3xl overflow-hidden max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 border-b border-gray-100 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="bg-[#10B981]/10 p-2.5 rounded-xl">
                    {editingJob ? <Edit2 className="text-[#10B981]" size={20} /> : <Plus className="text-[#10B981]" size={24} />}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">
                      {editingJob ? "Update Job Details" : "Create New Job"}
                    </DialogTitle>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Enter job information precisely</p>
                  </div>
               </div>
            </DialogHeader>

            <div className="p-8 space-y-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Job Role</label>
                  <Input 
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value})}
                     className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-2 focus:ring-[#10B981]/5 font-bold text-sm"
                     placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</label>
                  <Input 
                     value={formData.company_name}
                     onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                     className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-2 focus:ring-[#10B981]/5 font-bold text-sm"
                     placeholder="Example Corp"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Eligibility</label>
                  <Input 
                     value={formData.eligibility}
                     onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                     className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-2 focus:ring-[#10B981]/5 font-bold text-sm"
                     placeholder="Fresher / 2024 Batch"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Apply Link</label>
                  <Input 
                     value={formData.apply_link}
                     onChange={(e) => setFormData({...formData, apply_link: e.target.value})}
                     className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:border-[#10B981]/20 focus:ring-2 focus:ring-[#10B981]/5 font-bold text-sm"
                     placeholder="https://career.example.com/..."
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Important Note</label>
                  <textarea 
                     value={formData.important_note}
                     onChange={(e) => setFormData({...formData, important_note: e.target.value})}
                     className="w-full bg-gray-50 border border-gray-100 h-40 rounded-xl p-4 outline-none focus:border-[#10B981]/20 focus:ring-2 focus:ring-[#10B981]/5 font-bold text-sm transition-all resize-none"
                     placeholder="Enter any specific requirements or referral info..."
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
