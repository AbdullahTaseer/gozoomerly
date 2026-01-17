'use client';

import React, { useState } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterOption = {
  value: string;
  label: string;
};

type MoreFiltersProps = {
  options?: FilterOption[];
  selectedFilters?: string[];
  onFiltersChange?: (filters: string[]) => void;
};

const MoreFilters = ({ 
  options = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ],
  selectedFilters: externalSelectedFilters,
  onFiltersChange
}: MoreFiltersProps) => {
  const [internalSelectedFilters, setInternalSelectedFilters] = useState<string[]>([]);
  
  // Use external state if provided, otherwise use internal state
  const selectedFilters = externalSelectedFilters !== undefined 
    ? externalSelectedFilters 
    : internalSelectedFilters;
  
  const setSelectedFilters = (filters: string[]) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    } else {
      setInternalSelectedFilters(filters);
    }
  };

  const handleFilterToggle = (value: string) => {
    // Compute the new filters array
    let newFilters: string[];
    
    if (value === 'all') {
      // If "All" is selected, clear all other selections
      newFilters = selectedFilters.includes('all') ? [] : ['all'];
    } else {
      // Remove "All" if any specific filter is selected
      const withoutAll = selectedFilters.filter((f: string) => f !== 'all');
      if (withoutAll.includes(value)) {
        // If already selected, remove it
        newFilters = withoutAll.filter((f: string) => f !== value);
      } else {
        // Add the new filter
        newFilters = [...withoutAll, value];
      }
    }
    
    setSelectedFilters(newFilters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center outline-0 gap-2 px-4 py-2 border border-gray-900 rounded-[5px] text-sm text-gray-900 bg-white hover:bg-gray-50 transition-colors">
          <ListFilter size={16} className="text-gray-900" />
          <span className='whitespace-nowrap'>More Filters</span>
          <ChevronDown size={16} className="text-gray-900" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedFilters.includes(option.value)}
            onCheckedChange={() => handleFilterToggle(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreFilters;
