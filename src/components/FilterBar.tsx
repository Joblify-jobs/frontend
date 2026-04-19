"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ELIGIBILITY_OPTIONS = ["All Experience", "Fresher's", "Intern", "1+ Years", "2+ Years", "3+ Years"];

interface FilterBarProps {
  onSearch: (val: string) => void;
  onFilter: (val: string) => void;
  currentFilter: string;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
    onSearch, 
    onFilter, 
    currentFilter,
    viewMode,
    onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
      <div className="flex flex-col sm:flex-row flex-1 items-center gap-4 w-full">
        {/* Pill Search */}
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#10B981] group-focus-within:text-[#10B981] transition-all duration-300" size={18} />
          <Input 
            type="text" 
            placeholder="Search company / role" 
            className="pl-12 bg-white border-gray-100 h-14 rounded-2xl focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all text-sm font-bold shadow-xl shadow-gray-100/30 placeholder:text-gray-200"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {/* Experience Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select 
            value={currentFilter === "All" ? "All Experience" : currentFilter}
            onChange={(e) => onFilter(e.target.value === "All Experience" ? "All" : e.target.value)}
            className="w-full sm:w-auto bg-white border-gray-100 h-14 pl-8 pr-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] appearance-none shadow-xl shadow-gray-100/30 cursor-pointer transition-all hover:bg-gray-50"
          >
            {ELIGIBILITY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#10B981]">
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Grid/Table Toggle */}
      <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
        <button 
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            viewMode === 'grid' 
                ? "bg-white text-[#10B981] shadow-md shadow-[#10B981]/5" 
                : "text-gray-400 hover:text-gray-900"
          )}
        >
          <LayoutGrid size={14} /> Grid
        </button>
        <button 
          onClick={() => onViewModeChange('table')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            viewMode === 'table' 
                ? "bg-white text-[#10B981] shadow-md shadow-[#10B981]/5" 
                : "text-gray-400 hover:text-gray-900"
          )}
        >
          <List size={14} /> Table
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
