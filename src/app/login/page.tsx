"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2, ShieldCheck, Lock, Mail, ChevronRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await (login as any)(email.trim(), password.trim());
      router.push('/jobs');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Invalid credentials";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] px-4 bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-100 text-gray-900 shadow-2xl p-4 rounded-[3rem] bg-white">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20">
              <Sparkles size={28} className="text-[#10B981]" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black tracking-tighter">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px]">
                Continue your hunt for elite roles.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-center text-[10px] font-black uppercase tracking-widest">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email</Label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    className="bg-gray-50 border-gray-100 h-12 pl-12 rounded-xl focus:ring-1 focus:ring-[#10B981] text-sm font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</Label>
                  <Link href="#" className="text-[8px] text-[#10B981] font-black hover:underline uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="bg-gray-50 border-gray-100 h-12 pl-12 pr-12 rounded-xl focus:ring-1 focus:ring-[#10B981] text-sm font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[8px] text-gray-300 font-black uppercase tracking-widest px-2">
                <ShieldCheck size={12} className="text-[#10B981]" />
                AES-256 Bit Secure Encryption
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#10B981] hover:bg-[#0D9668] h-14 rounded-2xl font-black text-sm shadow-xl shadow-[#10B981]/10 text-white mt-2 group"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <span className="flex items-center gap-2">
                    Unlock Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              No account?{" "}
              <Link href="/register" className="text-[#10B981] font-black hover:underline tracking-tighter ml-1">
                Join the Hunt
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
