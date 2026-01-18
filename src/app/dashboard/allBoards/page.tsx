'use client';

import React, { useState, useEffect } from 'react';
import { fetchActiveBoards, type Board } from '@/lib/supabase/boards';
import { spotlightCampaigns } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import BoardCategoryCard from '@/components/cards/BoardCategoryCard';

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

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      const { boards: allBoards } = await fetchActiveBoards({
        userId: user.id,
        showAll: true,
      });

      // Count boards with status 'published' for active boards
      const activeCount = (allBoards || []).filter((board: Board) => board.status === 'published').length;

      // Count boards created by the logged in user
      const yourCount = (allBoards || []).filter((board: Board) => board.creator_id === user.id).length;

      // Count boards created in the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newCount = (allBoards || []).filter((board: Board) => {
        if (board.created_at) {
          return new Date(board.created_at) > twentyFourHoursAgo;
        }
        return false;
      }).length;

      const pastCount = (allBoards || []).filter((board: Board) => {
        if (board.status === 'completed' || board.status === 'cancelled') return true;
        if (board.deadline_date) {
          return new Date(board.deadline_date) < new Date();
        }
        return false;
      }).length;

      // Count boards with media (post boards) - fetchActiveBoards already includes media_count
      const postCount = (allBoards || []).filter((board: any) =>
        (board.media_count || 0) > 0
      ).length;

      // Count spotlight campaigns
      const spotlightCount = spotlightCampaigns.length;

      setCounts({
        new: newCount,
        active: activeCount,
        your: yourCount,
        past: pastCount,
        post: postCount,
        spotlight: spotlightCount,
      });
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