"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, CreditCard, BarChart3, TrendingUp, 
  AlertCircle, Search, Trash2, Edit2, 
  Plus, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';

const SuperAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'logs'>('overview');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Forms
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  // Fetch Stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/super-admin/stats');
      return res.data;
    }
  });

  // Fetch Users
  const { data: users } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      const res = await api.get(`/super-admin/users?search=${search}`);
      return res.data;
    }
  });

  // Fetch Logs
  const { data: logs } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      const res = await api.get('/super-admin/logs');
      return res.data;
    }
  });

  // Fetch Pending Payments
  const { data: pendingPayments } = useQuery({
    queryKey: ['admin-pending-payments'],
    queryFn: async () => {
      const res = await api.get('/super-admin/pending-payments');
      return res.data;
    },
    enabled: activeTab === 'payments'
  });

  // Mutations
  const createAdminMutation = useMutation({
    mutationFn: async (data: any) => api.post('/super-admin/admins', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      return api.patch(`/super-admin/users/${id}/role?role=${role}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const toggleSubMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: boolean }) => {
      return api.patch(`/super-admin/users/${id}/subscription?is_active=${status}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/super-admin/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const updateDetailsMutation = useMutation({
    mutationFn: async ({ id, name, email }: { id: string, name: string, email: string }) => {
      return api.patch(`/super-admin/users/${id}?name=${name}&email=${email}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsEditModalOpen(false);
    }
  });

  const approvePaymentMutation = useMutation({
    mutationFn: async (userId: string) => api.post(`/super-admin/approve-payment/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      alert("Payment approved and user notified!");
    }
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: async (userId: string) => api.post(`/super-admin/reject-payment/${userId}?reason=Invalid`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-payments'] });
      alert("Payment rejected.");
    }
  });

  const statCards = [
    { title: "Total Users", value: stats?.total_users || "...", icon: <Users className="text-blue-500" /> },
    { title: "Subscribed", value: stats?.subscribed_users || "...", icon: <CreditCard className="text-[#10B981]" /> },
    { title: "Active Jobs", value: stats?.active_jobs || "...", icon: <BarChart3 className="text-purple-500" /> },
    { title: "Total Revenue", value: stats?.revenue || "...", icon: <TrendingUp className="text-yellow-600" /> },
  ];

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">Platform Control</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Welcome back to the Command Center.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            {['overview', 'users', 'payments', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-white text-[#10B981] shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => (
                <Card key={i} className="border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black text-gray-900 mb-2">{stat.value}</div>
                    <div className="w-8 h-1 bg-gray-50 rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-gray-100 shadow-xl rounded-[3rem]">
                <CardHeader className="border-b border-gray-50 flex flex-row justify-between items-center px-10 py-8">
                  <CardTitle className="text-xl font-black">Scrape History</CardTitle>
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><BarChart3 size={18} /></div>
                </CardHeader>
                <CardContent className="p-10 divide-y divide-gray-50">
                  {logs?.map((log: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <AlertCircle size={18} />
                        </div>
                        <div>
                          <p className="font-black text-sm">System Sync Completed</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">+ {log.jobs_added} NEW OPPORTUNITIES</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {format(new Date(log.scraped_at), 'hh:mm a, dd MMM')}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border-gray-100 shadow-xl rounded-[3rem] bg-gray-900 text-white">
                <CardHeader className="p-10">
                  <CardTitle className="text-2xl font-black tracking-tighter">Growth Insights</CardTitle>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Platform performance index</p>
                </CardHeader>
                <CardContent className="px-10 pb-10 space-y-8">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                     <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Conversion</p>
                     <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black">24.8%</span>
                       <TrendingUp size={16} className="text-[#10B981]" />
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('users')} className="w-full h-14 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest">
                     Manage Audience <ChevronRight size={16} className="ml-2" />
                   </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <Card className="border-gray-100 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="px-6 md:px-10 py-8 md:py-10 border-b border-gray-50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter">User Management</CardTitle>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Control access and roles</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                  <div className="relative flex-1 lg:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#10B981] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search directory..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#10B981]/10 outline-none transition-all"
                    />
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)} className="h-14 bg-[#10B981] hover:bg-[#0D9668] rounded-2xl px-6 flex items-center justify-center">
                    <Plus size={20} className="mr-2" /> <span className="font-black uppercase tracking-widest text-[10px]">Add Admin</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                    <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Permissions</th>
                    <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Subscription Status</th>
                    <th className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50/10 transition-colors group">
                      <td className="px-6 md:px-10 py-6 md:py-8">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[#10B981] group-hover:scale-105 transition-transform">
                             {u.name[0]}
                           </div>
                           <div>
                             <p className="font-black text-gray-900 group-hover:text-[#10B981] transition-colors">{u.name}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest break-all md:break-normal">{u.email}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-6 md:px-10 py-6 md:py-8">
                          <div className="flex justify-center">
                            <select 
                              value={u.role}
                              disabled={u.role === 'super_admin'}
                              onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value })}
                              className="bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 outline-none focus:ring-4 focus:ring-[#10B981]/10 disabled:opacity-50"
                            >
                              <option value="user">USER</option>
                              <option value="admin">ADMIN</option>
                              <option value="super_admin">SUPER ADMIN</option>
                            </select>
                          </div>
                      </td>
                      <td className="px-6 md:px-10 py-6 md:py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Button 
                            onClick={() => toggleSubMutation.mutate({ id: u.id, status: !u.subscription.is_subscribed })}
                            variant={u.subscription.is_subscribed ? "default" : "outline"}
                            className={cn(
                              "h-10 px-6 md:px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              u.subscription.is_subscribed ? "bg-[#10B981] hover:bg-[#0D9668]" : "border-gray-200 text-gray-400 hover:text-[#10B981] hover:border-[#10B981]"
                            )}
                          >
                            {u.subscription.is_subscribed ? "Deactivate" : "Activate"}
                          </Button>
                          {u.subscription.is_subscribed && u.subscription.end_date && (
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                              Ends: {format(new Date(u.subscription.end_date), 'dd MMM yyyy')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-2 md:gap-3">
                           <Button 
                            disabled={u.role === 'super_admin'}
                            onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }}
                            variant="ghost" 
                            className="h-9 w-9 md:h-10 md:w-10 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button 
                            disabled={u.role === 'super_admin'}
                            onClick={() => deleteUserMutation.mutate(u.id)}
                            variant="ghost" 
                            className="h-9 w-9 md:h-10 md:w-10 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card className="border-gray-100 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="px-10 py-10 border-b border-gray-50">
              <CardTitle className="text-3xl font-black tracking-tighter">Manual Approvals</CardTitle>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Verify and activate elite status</p>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Transaction ID</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Date Submitted</th>
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
                        <span className="font-mono text-sm font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                          {u.subscription.manual_transaction_id}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {u.subscription.manual_payment_date ? format(new Date(u.subscription.manual_payment_date), 'dd MMM yyyy, hh:mm a') : 'N/A'}
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
                      <td colSpan={4} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        No pending payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add Admin Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="bg-white rounded-[3rem] border-0 p-10 max-w-lg shadow-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tighter">Create New Admin</DialogTitle>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Access control for Joblify</p>
            </DialogHeader>
            <div className="space-y-6 py-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <Input 
                  placeholder="Ex: John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <Input 
                  placeholder="admin@joblify.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Password</label>
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => createAdminMutation.mutate(formData)}
                className="w-full h-16 bg-gray-900 text-white hover:bg-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
              >
                Initialize Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-white rounded-[3rem] border-0 p-10 max-w-lg shadow-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tighter">Update Account Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Name</label>
                <Input 
                  value={selectedUser?.name || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Reference</label>
                <Input 
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => updateDetailsMutation.mutate({ 
                  id: selectedUser.id, 
                  name: selectedUser.name, 
                  email: selectedUser.email 
                })}
                className="w-full h-16 bg-[#10B981] text-white hover:bg-[#0D9668] rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
              >
                Commit Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default SuperAdminDashboard;
