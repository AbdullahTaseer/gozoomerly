'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HomeFeedFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const feedFilters = ['All', 'Friends', 'Family', 'Public', 'Private'];

const HomeFeedFilters: React.FC<HomeFeedFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <>
      <div className='max-[769px]:hidden flex items-center gap-6 max-[500px]:gap-3 justify-center'>
        {feedFilters.map((item) => (
          <p
            key={item}
            onClick={() => onFilterChange(item)}
            className={`text-[20px] max-[768px]:text-[16px] cursor-pointer font-bold transition-colors
              ${selectedFilter === item ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'}`}
          >
            {item}
          </p>
        ))}
      </div>
      <div className='max-[769px]:block hidden'>
        <Select value={selectedFilter} onValueChange={onFilterChange}>
          <SelectTrigger className='w-full min-w-[120px] border-0 font-bold shadow-none'>
            <SelectValue placeholder='Select filter' />
          </SelectTrigger>
          <SelectContent>
            {feedFilters.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default HomeFeedFilters;

