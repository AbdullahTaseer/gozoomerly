'use client';

import {  useState, useEffect  } from 'react';
import { fetchActiveBoards } from '@/lib/supabase/boards';
import { spotlightCampaigns } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import BoardCategoryCard from '@/components/cards/BoardCategoryCard';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';
import { SkeletonBoardCategoryCard } from '@/components/skeletons';

const AllBoards = () => {
  const [counts, setCounts] = useState({
    new: 0,
    active: 0,
    your: 0,
    past: 0,
    post: 0,
    spotlight: 0,
  });
  const [loading, setLoading] = useState(true);

  const {
    counts: boardCounts,
    fetchUserBoards
  } = useGetUserBoards();

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    if (boardCounts) {
      setCounts(prev => ({
        ...prev,
        new: boardCounts.new || 0,
        active: boardCounts.live || 0,
        past: boardCounts.past || 0,
        your: boardCounts.total || 0,
      }));
    }
  }, [boardCounts]);

  const loadCounts = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      await fetchUserBoards({
        p_user_id: user.id,
        p_status: null,
        p_limit: 100,
        p_offset: 0
      });

      const { boards: allBoards } = await fetchActiveBoards({
        userId: user.id,
        showAll: true,
      });

      const postCount = (allBoards || []).filter((board: any) =>
        (board.media_count || 0) > 0
      ).length;

      const spotlightCount = spotlightCampaigns.length;

      setCounts(prev => ({
        ...prev,
        post: postCount,
        spotlight: spotlightCount,
      }));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-3 py-8'>
        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBoardCategoryCard key={i} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
            <BoardCategoryCard
              count={counts.new}
              label="New Boards"
              path="/u/allBoards/new"
            />
            <BoardCategoryCard
              count={counts.active}
              label="Active Boards"
              path="/u/allBoards/active"
            />
            <BoardCategoryCard
              count={counts.your}
              label="Your Boards"
              path="/u/allBoards/your"
            />
            <BoardCategoryCard
              count={counts.post}
              label="Post Boards"
              path="/u/allBoards/post"
            />
            <BoardCategoryCard
              count={counts.past}
              label="Past Boards"
              path="/u/allBoards/past"
            />
            <BoardCategoryCard
              count={counts.spotlight}
              label="Spotlight Campaigns"
              path="/u/allBoards/spotlight-compaign"
            />
          </div>
        )}
      </div>
  );
};

export default AllBoards;