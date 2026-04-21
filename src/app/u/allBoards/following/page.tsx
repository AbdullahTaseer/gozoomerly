'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { authService } from '@/lib/supabase/auth';
import { BoardsList } from '@/components/boards/BoardsList';
import MobileHeader from '@/components/navbar/MobileHeader';
import { useGetFollowingBoards } from '@/hooks/useGetFollowingBoards';

const PAGE_SIZE = 12;

const FollowingBoards = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    boards,
    isLoading,
    isLoadingMore,
    hasMore,
    fetchBoards,
    loadMore,
  } = useGetFollowingBoards();

  useEffect(() => {
    const init = async () => {
      const user = await authService.getUser();
      if (user) {
        setUserId(user.id);
        await fetchBoards(user.id, PAGE_SIZE);
      }
    };
    init();
  }, [fetchBoards]);

  const sentinelCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
      sentinelRef.current = node;
    },
    [hasMore, isLoadingMore, loadMore]
  );

  return (
    <>
      <MobileHeader title='Following' />
      <div className='px-[7%] max-[769px]:px-3'>
        <div className='py-4'>
          <div className='flex justify-between max-[870px]:flex-col gap-6'>
            <TitleCard title='Following' className='text-left' />
            <div className='flex gap-4 items-center max-[870px]:mx-auto max-[870px]:hidden'>
              <div className='relative w-[260px]'>
                <Search size={18} className='absolute top-3 left-3' />
                <GlobalInput placeholder='Search...' height='42px' width='100%' inputClassName="pl-10 rounded-full!" />
              </div>
              <Image src={FilterSliderIcon} alt='' height={45} width={45} />
            </div>
          </div>

          <BoardsList boards={boards} loading={isLoading} />

          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#18171f]" />
            </div>
          )}

          {hasMore && !isLoading && (
            <div ref={sentinelCallback} className="h-1" />
          )}

          {!hasMore && boards.length > 0 && !isLoading && (
            <p className="text-center text-gray-400 text-sm py-6">
              You&apos;ve reached the end
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default FollowingBoards;
