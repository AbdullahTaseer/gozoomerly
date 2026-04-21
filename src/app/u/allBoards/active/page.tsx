'use client';

import {  useState, useEffect  } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { getUserBoards, type Board } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { BoardsList } from '@/components/boards/BoardsList';

const ActiveBoards = () => {
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
        setLoading(false);
        return;
      }

      const { data: userBoards, error: boardsError } = await getUserBoards(user.id);

      if (boardsError) {
        setBoards([]);
        return;
      }

      const liveBoards = (userBoards || []).filter(
        (board: Board) => board.status === 'live'
      );

      const supabase = createClient();
      const boardsWithContributors = await Promise.all(
        liveBoards.map(async (board: Board) => {
          try {
            const { data: participants } = await supabase
              .from('board_participants')
              .select('user_id')
              .eq('board_id', board.id)
              .limit(10);

            const contributorAvatars: (string | typeof ProfileAvatar)[] = [];

            if (participants && participants.length > 0) {
              const userIds = participants.map((p: { user_id: string }) => p.user_id);
              const { data: profiles } = await supabase
                .from('profiles')
                .select('profile_pic_url')
                .in('id', userIds);

              if (profiles) {
                profiles.forEach((profile: { profile_pic_url: string | null }) => {
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
            return {
              ...board,
              topContributors: [],
            };
          }
        })
      );

      setBoards(boardsWithContributors);
    } catch (err) {
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <div className='py-4'>
        <div className='flex justify-between max-[870px]:flex-col gap-6'>
          <TitleCard title='Active Boards' className='text-left' />
          <div className='flex gap-4 items-center max-[870px]:mx-auto max-[870px]:hidden'>
            <div className='relative w-[260px]'>
              <Search size={18} className='absolute top-3 left-3' />
              <GlobalInput placeholder='Search...' height='42px' width='100%' inputClassName="pl-10 rounded-full!" />
            </div>
            <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          </div>
        </div>

        <BoardsList boards={boards} loading={loading} />
      </div>
    </div>
  );
};

export default ActiveBoards;

