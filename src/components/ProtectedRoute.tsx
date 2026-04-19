"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'super_admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
    
    if (mounted && user && requiredRole) {
      // Role hierarchy
      const roles = ['user', 'admin', 'super_admin'];
      const userRank = roles.indexOf(user.role);
      const requiredRank = roles.indexOf(requiredRole);
      
      if (userRank < requiredRank) {
        router.push('/'); 
      }
    }
  }, [user, mounted, router, requiredRole]);

  if (!mounted || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <Loader2 className="animate-spin text-[#10B981]" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Verifying Security Access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
