'use client';

import React from 'react';

interface HomeFeedFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const feedFilters = ['All', 'New (2)', 'Active (3)', 'Past (90)'];

const HomeFeedFilters: React.FC<HomeFeedFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <>
      <div className='flex items-center gap-6 max-[500px]:gap-3 overflow-x-scroll scrollbar-hide justify-center'>
        {feedFilters.map((item) => (
          <p
            key={item}
            onClick={() => onFilterChange(item)}
            className={`text-[16px] max-[768px]:text-[16px] border whitespace-nowrap rounded-full px-4 py-1.5 cursor-pointer font-medium transition-colors
              ${selectedFilter === item ? 'bg-black text-white' : 'text-black'}`}
          >
            {item}
          </p>
        ))}
      </div>
    </>
  );
};

export default HomeFeedFilters;

