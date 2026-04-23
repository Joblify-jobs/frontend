"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';

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
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayFilter = currentFilter === "All" ? "All Experience" : currentFilter;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex flex-col md:flex-row flex-1 items-center gap-3 w-full">
        {/* Pill Search */}
        <div className="relative flex-1 group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
          <Input 
            type="text" 
            placeholder="Search company / role" 
            className="pl-12 bg-[#E5E7EB] border-none h-11 rounded-full text-sm font-bold text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-300 transition-all shadow-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {/* Custom Experience Dropdown */}
        <div className="relative w-full md:w-auto min-w-[200px]" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full bg-[#E5E7EB] h-11 px-6 rounded-full text-sm font-bold text-gray-900 transition-all hover:bg-gray-300 active:scale-95 shadow-sm"
          >
            <span>{displayFilter}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden py-2"
              >
                {ELIGIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onFilter(opt === "All Experience" ? "All" : opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-6 py-2.5 text-sm font-bold transition-colors",
                      displayFilter === opt 
                        ? "bg-[#10B981] text-white" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#10B981]"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid/Table Toggle */}
      <div className="flex p-1 bg-[#E5E7EB] rounded-xl">
        <button 
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
            viewMode === 'grid' 
                ? "bg-white text-gray-900 shadow-md" 
                : "text-gray-500 hover:text-gray-700"
          )}
        >
          <LayoutGrid size={16} /> Grid
        </button>
        <button 
          onClick={() => onViewModeChange('table')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
            viewMode === 'table' 
                ? "bg-white text-gray-900 shadow-md" 
                : "text-gray-500 hover:text-gray-700"
          )}
        >
          <List size={16} /> Table
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
