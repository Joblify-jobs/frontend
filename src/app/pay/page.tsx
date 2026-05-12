"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Sparkles, Copy, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const ManualPaymentPage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/subscriptions/status');
        setStatus(res.data);
        if (res.data.payment_status === 'pending') {
          setSubmitted(true);
        } else if (res.data.is_subscribed) {
          router.push('/jobs');
        }
      } catch (err) {
        console.error("Failed to fetch status", err);
      }
    };
    checkStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('transaction_id', transactionId);
      await api.post('/subscriptions/submit-manual-payment', formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-10 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <Clock className="text-[#10B981] animate-pulse" size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Verification Pending</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
              Owner will give access within 12hr. It's a safe transaction.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="text-sm font-mono font-bold text-gray-900 break-all">{transactionId || status?.manual_transaction_id}</p>
          </div>
          <Button 
            onClick={() => router.push('/jobs')}
            className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all"
          >
            Back to Jobs
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white selection:bg-[#10B981]/10 selection:text-[#10B981]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: QR Code */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase shadow-xl">
                <Sparkles size={14} className="text-[#10B981]" /> SECURE SCAN
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-tight">
                Scan & <span className="text-[#10B981]">Pay</span>
              </h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Upgrade to Elite by scanning the QR code below.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#10B981]/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col items-center gap-6">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-gray-50">
                  <Image 
                    src="/qr.jpeg" 
                    alt="Payment QR Code" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Pay</p>
                  <p className="text-4xl font-black text-gray-900">₹99.00</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">
              <ShieldCheck size={18} className="text-[#10B981]" /> Safe & Secure Transaction
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Confirm Payment</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enter transaction ID after payment</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-1">Transaction Ref / ID</label>
                <Input 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="h-14 bg-gray-50 border-gray-100 rounded-xl px-6 font-mono text-sm focus:ring-[#10B981] focus:border-[#10B981]"
                  required
                />
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-4">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-blue-700/80 uppercase tracking-widest leading-relaxed">
                  Important: Owner will give access within 12hr after verifying your transaction.
                </p>
              </div>

              <Button 
                type="submit"
                disabled={loading || !transactionId}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white h-14 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#10B981]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex gap-2"
              >
                {loading ? "Submitting..." : "Submit Payment"} <CheckCircle2 size={18} />
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Need help? contact@joblify.in</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ManualPaymentPage;
