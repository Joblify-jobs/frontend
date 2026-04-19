"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const AdminJobsPage = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs', { params: { limit: 100 } });
      return res.data;
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/jobs/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/jobs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
  });

  const handleManualScrape = async () => {
    setIsRefreshing(true);
    try {
      await api.post('/super-admin/scrape');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Job Listings</h1>
          <p className="text-gray-400">Total {jobs?.length} active/inactive jobs</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-[#2D3748] flex gap-2"
            onClick={handleManualScrape}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} /> Trigger Scrape
          </Button>
          <Link href="/admin/jobs/new">
            <Button className="bg-[#10B981] hover:bg-[#0D9668] flex gap-2">
              <Plus size={18} /> Add Manual Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#2D3748] rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-[#2D3748] hover:bg-transparent">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Eligibility</TableHead>
              <TableHead className="text-gray-300">Source</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-right text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs?.map((job: any) => (
              <TableRow key={job.id} className="border-[#2D3748] hover:bg-slate-800/50">
                <TableCell className="font-medium">{job.company_name}</TableCell>
                <TableCell>{job.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{job.eligibility}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={job.source === 'scraped' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}>
                    {job.source === 'scraped' ? 'Auto' : 'Manual'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={job.is_active} 
                    onCheckedChange={() => toggleMutation.mutate(job.id)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => {
                      if(confirm("Are you sure?")) deleteMutation.mutate(job.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobsPage;
