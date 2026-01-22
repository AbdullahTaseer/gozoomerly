'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { authService } from '@/lib/supabase/auth';
import { BoardsList } from '@/components/boards/BoardsList';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';
import { BoardStatus } from '@/types/userBoards';
import { getStatusLabel } from '@/lib/userBoardsHelpers';
import { Board } from '@/lib/supabase/boards';
import toast from 'react-hot-toast';

const YourBoards = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<BoardStatus>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 12;

  const {
    boards,
    counts,
    pagination,
    filterApplied,
    isLoading,
    error,
    fetchUserBoards,
    refetch
  } = useGetUserBoards();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      loadBoards();
    }
  }, [userId, selectedFilter, currentPage]);

  const checkAuth = async () => {
    try {
      const user = await authService.getUser();
      if (!user) {
        toast.error('Please sign in to view your boards');
        router.push('/signin');
        return;
      }
      setUserId(user.id);
    } catch (err) {
      toast.error('Authentication failed');
      router.push('/signin');
    }
  };

  const loadBoards = async () => {
    if (!userId) return;

    try {
      await fetchUserBoards({
        p_user_id: userId,
        p_status: selectedFilter,
        p_limit: ITEMS_PER_PAGE,
        p_offset: (currentPage - 1) * ITEMS_PER_PAGE
      });
    } catch (err) {
      toast.error('Failed to load boards');
    }
  };

  const handleFilterChange = (filter: BoardStatus) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);

  };

  const filteredBoards = searchQuery
    ? boards.filter(board =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : boards;

  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <div className='py-4'>
        {}
        <div className='flex justify-between max-[870px]:flex-col gap-6 mb-6'>
          <TitleCard title='Your Boards' className='text-left' />
          <div className='flex gap-4 items-center max-[870px]:mx-auto'>
            <div className='relative w-[260px] max-[870px]:hidden'>
              <Search size={18} className='absolute top-3 left-3' />
              <GlobalInput
                placeholder='Search...'
                height='42px'
                width='100%'
                borderRadius='100px'
                inputClassName="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Image
              src={FilterSliderIcon}
              alt='Filter'
              height={45}
              width={45}
              className='cursor-pointer max-[870px]:hidden'
            />
          </div>
        </div>

        {}
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
          <FilterTab
            label="All"
            count={counts.total}
            active={selectedFilter === null}
            onClick={() => handleFilterChange(null)}
          />
          <FilterTab
            label="Live"
            count={counts.live}
            active={selectedFilter === 'live'}
            onClick={() => handleFilterChange('live')}
          />
          <FilterTab
            label="New"
            count={counts.new}
            active={selectedFilter === 'new'}
            onClick={() => handleFilterChange('new')}
          />
          <FilterTab
            label="Past"
            count={counts.past}
            active={selectedFilter === 'past'}
            onClick={() => handleFilterChange('past')}
          />
        </div>

        {}
        {error && !isLoading && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-600 text-sm'>
              {error}
            </p>
            <button
              onClick={refetch}
              className='mt-2 text-red-600 hover:text-red-700 underline text-sm'
            >
              Try again
            </button>
          </div>
        )}

        {}
        <BoardsList boards={filteredBoards as any as Board[]} loading={isLoading} />

        {}
        {!isLoading && filteredBoards.length === 0 && (
          <div className='text-center py-12 bg-gray-50 rounded-xl'>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              {searchQuery
                ? 'No boards found'
                : selectedFilter === 'live'
                ? 'No active boards yet'
                : selectedFilter === 'past'
                ? 'No past boards'
                : selectedFilter === 'new'
                ? 'No new boards'
                : 'No boards created yet'}
            </h3>
            <p className='text-gray-600 mb-4'>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first board to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/createBirthdayBoard')}
                className='bg-[#F43C83] text-white px-6 py-2 rounded-lg hover:bg-[#d13178] transition'
              >
                Create Board
              </button>
            )}
          </div>
        )}

        {}
        {!isLoading && filteredBoards.length > 0 && pagination.total_pages > 1 && (
          <div className='flex justify-center items-center gap-4 mt-8'>
            <button
              disabled={!pagination.has_prev}
              onClick={() => handlePageChange(currentPage - 1)}
              className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition'
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <span className='text-xs text-gray-500'>
                ({pagination.total_records} total)
              </span>
            </div>

            <button
              disabled={!pagination.has_next}
              onClick={() => handlePageChange(currentPage + 1)}
              className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition'
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {}
        {!isLoading && filteredBoards.length > 0 && (
          <div className='text-center text-xs text-gray-500 mt-4'>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total_records)} of {pagination.total_records} boards
            {filterApplied && ` (${getStatusLabel(filterApplied)})`}
          </div>
        )}
      </div>
    </div>
  );
};

function FilterTab({
  label,
  count,
  active,
  onClick
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
        active
          ? 'bg-[#F43C83] text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} ({count})
    </button>
  );
}

export default YourBoards;
