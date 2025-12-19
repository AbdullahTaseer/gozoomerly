'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { fetchActiveBoards, type Board } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { BoardsList } from '@/components/boards/BoardsList';

const PostBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      const { boards: postBoards, error: postError } = await fetchActiveBoards({
        userId: user.id,
        showAll: true,
      });

      if (postError) {
        console.error('Error fetching post boards:', postError);
      }

      // Filter boards that have media
      let fetchedBoards = (postBoards || []).filter((board: any) =>
        (board.media_count || 0) > 0
      );

      // Fetch top contributors for each board
      const supabase = createClient();
      const boardsWithContributors = await Promise.all(
        fetchedBoards.map(async (board) => {
          try {
            const { data: participants } = await supabase
              .from('board_participants')
              .select('user_id')
              .eq('board_id', board.id)
              .limit(10);

            const contributorAvatars: (string | typeof ProfileAvatar)[] = [];

            if (participants && participants.length > 0) {
              const userIds = participants.map(p => p.user_id);
              const { data: profiles } = await supabase
                .from('profiles')
                .select('profile_pic_url')
                .in('id', userIds);

              if (profiles) {
                profiles.forEach((profile) => {
                  if (profile.profile_pic_url) {
                    contributorAvatars.push(profile.profile_pic_url);
                  } else {
                    contributorAvatars.push(ProfileAvatar);
                  }
                });
              } else {
                participants.forEach(() => {
                  contributorAvatars.push(ProfileAvatar);
                });
              }
            }

            return {
              ...board,
              topContributors: contributorAvatars,
            };
          } catch (err) {
            console.error('Error fetching contributors for board:', board.id, err);
            return {
              ...board,
              topContributors: [],
            };
          }
        })
      );

      setBoards(boardsWithContributors);
    } catch (err) {
      console.error('Error loading boards:', err);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <div className='py-4'>
        <div className='flex justify-between max-[870px]:flex-col gap-6'>
          <TitleCard title='Boards' className='text-left' />
          <div className='flex gap-4 items-center max-[870px]:mx-auto max-[870px]:hidden'>
            <div className='relative w-[260px]'>
              <Search size={18} className='absolute top-3 left-3' />
              <GlobalInput placeholder='Search...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
            </div>
            <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          </div>
        </div>

        <BoardsList boards={boards} loading={loading} />
      </div>
    </div>
  );
};

export default PostBoards;

