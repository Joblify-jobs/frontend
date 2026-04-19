"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 py-12">
      <Button
        variant="outline"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="h-12 w-12 rounded-2xl border-gray-100 bg-white group hover:border-[#10B981] transition-colors"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 px-4 py-2 rounded-xl">
          Page {current}
        </span>
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          of {total}
        </span>
      </div>
      <Button
        variant="outline"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
        className="h-12 w-12 rounded-2xl border-gray-100 bg-white group hover:border-[#10B981] transition-colors"
      >
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default Pagination;
