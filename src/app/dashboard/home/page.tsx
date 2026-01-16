'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import SpotLightCard from '@/components/cards/SpotLightCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import { spotlightCampaigns, boardInvitations, feedCardData } from '@/lib/MockData';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import { fetchActiveBoards, fetchUserBoards, type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { authService } from '@/lib/supabase/auth';
import HomeFeedFilters from '@/components/filters/HomeFeedFilters';
import FeedCard from '@/components/cards/FeedCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import { Search, Layers, Grid2x2, ChevronRight } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import { BoardsList } from '@/components/boards/BoardsList';
import { createClient } from '@/lib/supabase/client';
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';

const Home = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'layers'>('grid');
  const [activeBoards, setActiveBoards] = useState<Board[]>([]);
  const [activeProBoards, setActiveProBoards] = useState<Board[]>([]);
  const [followingBoards, setFollowingBoards] = useState<Board[]>([]);
  const [yourBoards, setYourBoards] = useState<Board[]>([]);
  const [pastBoards, setPastBoards] = useState<Board[]>([]);
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

      const supabase = createClient();

      // Fetch active boards
      const { boards: activeBoardsData } = await fetchActiveBoards({
        userId: user.id,
        includeStatus: ['published'],
      });

      // Fetch user boards (boards created by the user)
      const { boards: userBoardsData } = await fetchUserBoards(user.id);

      // Fetch all boards for past boards
      const { boards: allBoards } = await fetchActiveBoards({
        userId: user.id,
        showAll: true,
      });

      // Filter past boards
      const pastBoardsData = (allBoards || []).filter((board: Board) => {
        if (board.status === 'completed' || board.status === 'cancelled') return true;
        if (board.deadline_date) {
          return new Date(board.deadline_date) < new Date();
        }
        return false;
      }).slice(0, 5);

      // Fetch contributors for each board
      const fetchContributors = async (boards: Board[]) => {
        return Promise.all(
          boards.map(async (board) => {
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
              return {
                ...board,
                topContributors: [],
              };
            }
          })
        );
      };

      const [activeWithContributors, yourWithContributors, pastWithContributors] = await Promise.all([
        fetchContributors(activeBoardsData || []),
        fetchContributors(userBoardsData || []),
        fetchContributors(pastBoardsData),
      ]);

      setActiveBoards(activeWithContributors.slice(0, 5));
      setActiveProBoards(activeWithContributors.slice(0, 5));
      setFollowingBoards(activeWithContributors.slice(0, 5));
      setYourBoards(yourWithContributors.slice(0, 5));
      setPastBoards(pastWithContributors);
    } catch (err) {
      console.error('Error loading boards:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashNavbar hide={false} />
      <div className='px-[7%] py-5 max-[769px]:px-3'>
        <div>
          <div className='flex items-center gap-3 mb-6 flex-shrink-0 max-w-[400px] mx-auto'>
            <div className="relative flex-1 min-w-0">
              <Search size={18} className='absolute top-1/2 left-3 -translate-y-1/2 text-black pointer-events-none' />
              <GlobalInput
                placeholder="Search boards..."
                height='42px'
                width='100%'
                borderRadius='100px'
                inputClassName="pl-10"
              />
            </div>

            <button
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300 shadow-sm flex items-center justify-center transition-all ${viewMode === 'grid'
                ? 'bg-black'
                : 'bg-white hover:opacity-80'
                }`}
            >
              <Grid2x2 size={18} className={viewMode === 'grid' ? 'text-white' : 'text-black'} />
            </button>
            <button
              onClick={() => setViewMode('layers')}
              className={`w-10 h-10 flex-shrink-0 cursor-pointer rounded-full border border-gray-300 shadow-sm flex items-center justify-center transition-all ${viewMode === 'layers'
                ? 'bg-black'
                : 'bg-white hover:opacity-80'
                }`}
            >
              <Layers size={18} className={viewMode === 'layers' ? 'text-white' : 'text-black'} />
            </button>
          </div>

          {viewMode === 'grid' ? (
            <div className='space-y-8'>
              {/* New Boards Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>New Invites</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/new')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
                  {boardInvitations.length > 0 ? (
                    boardInvitations.slice(0, 5).map((invitation) => (
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
              </div>

              {/* Active Boards Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Active Social</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/active')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <BoardsList boards={activeBoards} loading={loading} />
              </div>

              {/* Active Pro Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Active Pro</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/active')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <BoardsList boards={activeProBoards} loading={loading} />
              </div>

              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Spotlight</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/spotlight-compaign')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className='flex mt-6 gap-6 max-[500px]:gap-4 overflow-x-auto scrollbar-hide h-full'>
                  {spotlightCampaigns.slice(0, 5).map((campaign) => (
                    <SpotLightCard
                      key={campaign.id}
                      name={campaign.name}
                      description={campaign.description}
                      spotLightImg={campaign.spotLightImg}
                      participants={campaign.participants}
                      wished={campaign.wished}
                      supports={campaign.supports}
                      memories={campaign.memories}
                      chats={campaign.chats}
                      raised={campaign.raised}
                      target={campaign.target}
                      organizerName={campaign.organizerName}
                      organizerAvatar={campaign.organizerAvatar}
                      organizerHometown={campaign.organizerHometown}
                      topContributors={campaign.topContributors}
                    />
                  ))}
                </div>
              </div>

              {/* Following Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Following</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/active')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <BoardsList boards={yourBoards} loading={loading} />
              </div>

              {/* Your Boards Section */}
              {/* <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Your Boards</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/your')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <BoardsList boards={yourBoards} loading={loading} />
              </div> */}

              {/* Past Boards Section */}
              {/* <div>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl md:text-3xl font-bold text-black'>Past Boards</h3>
                  <button
                    onClick={() => router.push('/dashboard/allBoards/past')}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors'
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <BoardsList boards={pastBoards} loading={loading} />
              </div> */}
            </div>
          ) : (
            <div>
              <div className='flex max-w-[745px] mx-auto items-center justify-between gap-4 mt-4'>
                <HomeFeedFilters
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>

              <div className='max-w-[745px] mx-auto py-4 space-y-6'>
                <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
                <PostsVideoCard goToProfile={() => router.push("/dashboard/visitProfile")} />
                <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
                {feedCardData.map((feed) => (
                  <FeedCard
                    key={feed.id}
                    userName={feed.userName}
                    userAvatar={feed.userAvatar}
                    timestamp={feed.timestamp}
                    layout={feed.layout}
                    title={feed.title}
                    description={feed.description}
                    actionTag={feed.actionTag}
                    videoThumbnail={feed.videoThumbnail}
                    videoUrl={feed.videoUrl}
                    thumbnailImage={feed.thumbnailImage}
                    mediaItems={feed.mediaItems}
                    likes={feed.likes}
                    comments={feed.comments}
                    shares={feed.shares}
                    memories={feed.memories}
                    onUserClick={() => router.push("/dashboard/visitProfile")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default Home;