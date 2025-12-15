'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { homeBoardsSwiper, boardInvitations } from '@/lib/MockData';
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { fetchActiveBoards, fetchUserBoards, type Board } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import DynamicBoardCard from '@/components/cards/DynamicBoardCard';

const TABS = [
  { id: 'active', label: 'Active Boards' },
  { id: 'your', label: 'Your Boards' },
  { id: 'new', label: 'New Boards' },
  { id: 'post', label: 'Post Boards' },
];

const AllBoards = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, [activeTab]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      let fetchedBoards: Board[] = [];

      switch (activeTab) {
        case 'active':
          const { boards: activeBoards, error: activeError } = await fetchActiveBoards({
            userId: user.id,
            includeStatus: ['published'],
          });
          if (activeError) {
            console.error('Error fetching active boards:', activeError);
          }
          fetchedBoards = activeBoards || [];
          break;

        case 'your':
          const { boards: userBoards, error: userError } = await fetchUserBoards(user.id);
          if (userError) {
            console.error('Error fetching user boards:', userError);
          }
          fetchedBoards = userBoards || [];
          break;

        case 'new':
          // New boards - could be recently created or invitation boards
          const { boards: newBoards, error: newError } = await fetchActiveBoards({
            userId: user.id,
            showAll: true,
          });
          if (newError) {
            console.error('Error fetching new boards:', newError);
          }
          // Filter for recently created (last 7 days) or sort by created_at
          fetchedBoards = (newBoards || []).sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 10);
          break;

        case 'post':
          // Post boards - boards with media/posts
          const { boards: postBoards, error: postError } = await fetchActiveBoards({
            userId: user.id,
            showAll: true,
          });
          if (postError) {
            console.error('Error fetching post boards:', postError);
          }
          // Filter boards that have media
          fetchedBoards = (postBoards || []).filter((board: any) =>
            (board.media_count || 0) > 0
          );
          break;

        default:
          fetchedBoards = [];
      }

      // Fetch top contributors for each board
      const supabase = createClient();
      const boardsWithContributors = await Promise.all(
        fetchedBoards.map(async (board) => {
          try {
            // Fetch board participants (top 10)
            const { data: participants } = await supabase
              .from('board_participants')
              .select('user_id')
              .eq('board_id', board.id)
              .limit(10);

            const contributorAvatars: (string | typeof ProfileAvatar)[] = [];

            if (participants && participants.length > 0) {
              // Fetch profile pictures for each participant
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
                // If no profiles found, add default avatars
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatBirthdayDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewBoard = (board: Board) => {
    router.push(`/dashboard/boards/${board.slug}`);
  };

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/dashboard/visitProfile/${creatorId}`);
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

        {/* Tabs */}
        <div className='mt-6 border-b border-gray-200 overflow-x-auto scrollbar-hide'>
          <div className='flex items-center max-[769px]:justify-between gap-8 max-[768px]:gap-4 min-w-max'>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-[20px] max-[769px]:text-[15px] whitespace-nowrap font-semibold transition-all relative
                  ${activeTab === tab.id
                    ? "text-black border-b-2 border-black"
                    : "text-black"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Boards Content */}
        {loading ? (
          <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='min-w-[340px] h-[400px] bg-gray-100 rounded-lg animate-pulse' />
            ))}
          </div>
        ) : activeTab === 'new' ? (
          <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
            {boardInvitations.length > 0 ? (
              boardInvitations.map((invitation) => (
                <InvitationBoardCard
                  key={invitation.id}
                  title={invitation.title}
                  backgroundImage={invitation.backgroundImage}
                  profileImage={invitation.profileImage}
                  inviterName={invitation.inviterName}
                  onAccept={() => console.log('Accept invitation', invitation.id)}
                  onDecline={() => console.log('Decline invitation', invitation.id)}
                />
              ))
            ) : (
              <div className='text-center py-12 w-full'>
                <p className='text-gray-500'>No invitations found</p>
              </div>
            )}
          </div>
        ) : (
          <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
            {boards.length > 0 ? (
              boards.map((board) => {
                const honoreeFirstName = board.honoree_details?.first_name || '';
                const honoreeLastName = board.honoree_details?.last_name || '';
                const honoreeName = honoreeFirstName && honoreeLastName
                  ? `${honoreeFirstName} ${honoreeLastName}`.trim()
                  : honoreeFirstName || honoreeLastName || 'Unknown';

                const honoreeProfilePhoto = board.honoree_details?.profile_photo_url || ProfileAvatar;


                return (
                  <DynamicBoardCard
                    key={board.id}
                    title={board.title}
                    avatar={honoreeProfilePhoto}
                    name={honoreeName}
                    creatorId={board.creator_id}
                    location={board.honoree_details?.hometown || 'No location'}
                    date={board.honoree_details?.date_of_birth
                      ? formatBirthdayDate(board.honoree_details.date_of_birth)
                      : formatDate(board.deadline_date || board.created_at)}
                    description={board.description}
                    raised={board.total_raised || 0}
                    target={board.goal_amount || 0}
                    participants={board.shares_count || 0}
                    wishes={board.wishes_count || 0}
                    gifters={board.contributors_count || 0}
                    memories={(board as any).media_count || 0}
                    chats={board.views_count || 0}
                    topContributors={(board as any).topContributors || []}
                    primaryColor={board.honoree_details.theme_color}
                    gradient={board.board_types?.color_scheme.gradient}
                    onNameClick={() => handleViewBoard(board)}
                    onCreatorClick={() => handleCreatorClick(board.creator_id)}
                    className='w-[340px] h-full'
                  />
                );
              })
            ) : (
              <div className='text-center py-12 w-full'>
                <p className='text-gray-500'>No boards found for this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBoards;