'use client';

import React, { useState, useEffect } from 'react';
import { fetchActiveBoards } from '@/lib/supabase/boards';
import { spotlightCampaigns } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import BoardCategoryCard from '@/components/cards/BoardCategoryCard';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';

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

  // Update counts when boardCounts changes
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
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      // Fetch board counts using the RPC function
      await fetchUserBoards({
        p_user_id: user.id,
        p_status: null,
        p_limit: 100,
        p_offset: 0
      });

      // Fetch boards to calculate post count (boards with media)
      const { boards: allBoards } = await fetchActiveBoards({
        userId: user.id,
        showAll: true,
      });

      // Count boards with media (post boards)
      const postCount = (allBoards || []).filter((board: any) =>
        (board.media_count || 0) > 0
      ).length;

      // Count spotlight campaigns
      const spotlightCount = spotlightCampaigns.length;

      setCounts(prev => ({
        ...prev,
        post: postCount,
        spotlight: spotlightCount,
      }));
    } catch (err) {
      console.error('Error loading board counts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-3 py-8'>
        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='h-48 bg-gray-100 rounded-2xl animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
            <BoardCategoryCard
              count={counts.new}
              label="New Boards"
              path="/dashboard/allBoards/new"
            />
            <BoardCategoryCard
              count={counts.active}
              label="Active Boards"
              path="/dashboard/allBoards/active"
            />
            <BoardCategoryCard
              count={counts.your}
              label="Your Boards"
              path="/dashboard/allBoards/your"
            />
            <BoardCategoryCard
              count={counts.post}
              label="Post Boards"
              path="/dashboard/allBoards/post"
            />
            <BoardCategoryCard
              count={counts.past}
              label="Past Boards"
              path="/dashboard/allBoards/past"
            />
            <BoardCategoryCard
              count={counts.spotlight}
              label="Spotlight Campaigns"
              path="/dashboard/allBoards/spotlight-compaign"
            />
          </div>
        )}
      </div>
  );
};

export default AllBoards;