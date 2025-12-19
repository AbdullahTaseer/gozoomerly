'use client';

import React, { useState, useEffect } from 'react';
import { fetchActiveBoards, fetchUserBoards, type Board } from '@/lib/supabase/boards';
import { boardInvitations } from '@/lib/MockData';
import { authService } from '@/lib/supabase/auth';
import BoardCategoryCard from '@/components/cards/BoardCategoryCard';

const AllBoards = () => {
  const [counts, setCounts] = useState({
    new: 0,
    active: 0,
    your: 0,
    past: 0,
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

      const [
        { boards: activeBoards },
        { boards: userBoards },
        { boards: allBoards },
      ] = await Promise.all([
        fetchActiveBoards({
          userId: user.id,
          includeStatus: ['published'],
        }),
        fetchUserBoards(user.id),
        fetchActiveBoards({
          userId: user.id,
          showAll: true,
        }),
      ]);

      const activeCount = activeBoards?.length || 0;
      const yourCount = userBoards?.length || 0;
      const newCount = boardInvitations.length;

      const pastCount = (allBoards || []).filter((board: Board) => {
        if (board.status === 'completed' || board.status === 'cancelled') return true;
        if (board.deadline_date) {
          return new Date(board.deadline_date) < new Date();
        }
        return false;
      }).length;

      setCounts({
        new: newCount,
        active: activeCount,
        your: yourCount,
        past: pastCount,
      });
    } catch (err) {
      console.error('Error loading board counts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='px-[7%] max-[769px]:px-3 py-8'>
        <div className='grid grid-cols-2 gap-6 max-w-4xl mx-auto'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-48 bg-gray-100 rounded-2xl animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='px-[7%] max-[769px]:px-3 py-8'>
      <div className='grid grid-cols-4 gap-6'>
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
          count={counts.past}
          label="Past Boards"
          path="/dashboard/allBoards/past"
        />
      </div>
    </div>
  );
};

export default AllBoards;