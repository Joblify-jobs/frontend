import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';

interface SubscriptionPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({ isOpen, onClose, onSubscribe }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-0 sm:max-w-md rounded-[3rem] p-0 overflow-hidden shadow-3xl">
        <div className="bg-gradient-to-br from-[#10B981] to-[#3B82F6] p-10 text-white relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-white/20 animate-pulse" size={48} />
          <DialogHeader>
            <DialogTitle className="text-4xl font-black tracking-tighter text-left leading-none">Unlock <br />The Sphere.</DialogTitle>
            <DialogDescription className="text-white/80 font-bold mt-4 text-left uppercase tracking-widest text-[10px]">
              Access 100+ Verified Daily Roles
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-[#10B981]" size={20} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">Direct Apply Links</p>
                <p className="text-xs text-gray-400 font-medium">Bypass the bots. Get straight to the application portal.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">Verified Product Companies</p>
                <p className="text-xs text-gray-400 font-medium">100% scam-free guarantee on all our listings.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Zap className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">30-Day Elite Pass</p>
                <p className="text-xs text-gray-400 font-medium">Full access to the entire platform for a solid 30 days.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">₹99</span>
                <span className="text-gray-400 text-xs font-bold">/30 DAYS</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <Lock size={10} className="text-gray-400" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Powered by Instamojo</span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={onSubscribe}
              className="w-full bg-gray-900 hover:bg-black text-white font-black h-16 rounded-2xl shadow-xl shadow-gray-200 active:scale-95 transition-all text-lg"
            >
              Start 30-Day Access
            </Button>
          </DialogFooter>

          {/* <p className="text-[8px] text-center font-black text-gray-300 uppercase tracking-[0.2em]">
            Cancel anytime. No auto-renewal.
          </p> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPaywall;
