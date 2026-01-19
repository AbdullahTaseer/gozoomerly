'use client';

import React from 'react';

interface BoardCounts {
  total: number;
  live: number;
  past: number;
  new: number;
}

interface HomeFeedFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  counts?: BoardCounts;
}

const HomeFeedFilters: React.FC<HomeFeedFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  counts = { total: 0, live: 0, past: 0, new: 0 },
}) => {
  const feedFilters = [
    { key: 'All', label: 'All' },
    { key: 'New', label: `New (${counts.new})` },
    { key: 'Active', label: `Active (${counts.live})` },
    { key: 'Past', label: `Past (${counts.past})` },
  ];

  return (
    <>
      <div className='flex items-center gap-6 max-[500px]:gap-3 overflow-x-scroll scrollbar-hide justify-center'>
        {feedFilters.map((item) => (
          <p
            key={item.key}
            onClick={() => onFilterChange(item.key)}
            className={`text-[16px] max-[768px]:text-[16px] border whitespace-nowrap rounded-full px-4 py-1.5 cursor-pointer font-medium transition-colors
              ${selectedFilter === item.key ? 'bg-black text-white' : 'text-black'}`}
          >
            {item.label}
          </p>
        ))}
      </div>
    </>
  );
};

export default HomeFeedFilters;

