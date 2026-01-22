'use client';


interface ConnectionFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const connectionFilters = ['All', 'Family', 'Celebrity', 'Tour'];

const ConnectionFilter: React.FC<ConnectionFilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className='flex items-center justify-start max-[660px]:justify-center gap-3 max-[350px]:gap-1 w-full max-[430px]:justify-between overflow-x-auto scrollbar-hide pb-2'>
      {connectionFilters.map((item) => (
        <button
          key={item}
          onClick={() => onFilterChange(item)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap shrink-0
            ${
              selectedFilter === item
                ? 'bg-[#1B1D26] text-white'
                : 'bg-white text-[#1B1D26] hover:bg-gray-100'
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ConnectionFilter;

