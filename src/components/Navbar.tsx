"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  LogOut, Menu, X, ChevronRight, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!mounted) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      scrolled 
        ? "bg-white/95 backdrop-blur-xl border-gray-100 py-3 shadow-sm" 
        : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#10B981] p-2 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-[#10B981]/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">Joblify</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/jobs" 
              className={cn(
                "transition-all font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full",
                isActive('/jobs') 
                  ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30" 
                  : "text-gray-500 hover:text-[#10B981]"
              )}
            >
              Browse
            </Link>
            <Link 
              href="/pricing" 
              className={cn(
                "transition-all font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full",
                isActive('/pricing') 
                  ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30" 
                  : "text-gray-500 hover:text-[#10B981]"
              )}
            >
              Pricing
            </Link>
            {user && (
              <Link 
                href="/bookmarks" 
                className={cn(
                  "transition-all font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full",
                  isActive('/bookmarks') 
                    ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30" 
                    : "text-gray-500 hover:text-[#10B981]"
                )}
              >
                Saved
              </Link>
            )}
            {user && (user.role === 'admin' || user.role === 'super_admin') && (
              <Link 
                href={user.role === 'super_admin' ? "/super-admin/dashboard" : "/admin/dashboard"} 
                className={cn(
                  "transition-all font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full",
                  isActive('/admin/dashboard') || isActive('/super-admin/dashboard')
                    ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30" 
                    : "text-[#10B981] border border-[#10B981] hover:bg-[#10B981] hover:text-white"
                )}
              >
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 bg-gray-50 pl-4 pr-1 py-1 rounded-full border border-gray-100">
                <span className="text-xs font-black uppercase text-gray-400">{user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 font-bold hover:text-[#10B981] transition-colors">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#10B981] hover:bg-[#0D9668] text-white font-black px-6 rounded-xl shadow-lg shadow-[#10B981]/20">Join Now</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-[#10B981] bg-gray-50 rounded-lg border border-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-3xl"
          >
            <div className="flex flex-col gap-6">
              {[
                { label: "Find Jobs", href: "/jobs" },
                { label: "Pricing", href: "/pricing" },
                { label: "Saved Roles", href: "/bookmarks" },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-between items-center text-xl font-black text-gray-900 hover:text-[#10B981] transition-colors"
                >
                  {item.label} <ChevronRight size={20} className="text-[#10B981]" />
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <Button onClick={handleLogout} variant="destructive" className="w-full h-14 rounded-2xl font-black text-lg">Sign Out</Button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 font-black">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-14 bg-[#10B981] rounded-2xl font-black text-white">Join</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
