'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpotLightCard from '@/components/cards/SpotLightCard';
import { spotlightCampaigns } from '@/lib/MockData';
import { fetchUserBoards, getUserBoards, type Board } from '@/lib/supabase/boards';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';
import { useGetUserInvitations } from '@/hooks/useGetUserInvitations';
import { useGetUserBoardsWishes } from '@/hooks/useGetUserBoardsWishes';
import { createClient } from '@/lib/supabase/client';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { authService } from '@/lib/supabase/auth';
import HomeFeedFilters from '@/components/filters/HomeFeedFilters';
import FeedCard from '@/components/cards/FeedCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import { Search, Layers, Grid2x2, ChevronRight } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import { BoardsList } from '@/components/boards/BoardsList';
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';
import MobileHeader from '@/components/navbar/MobileHeader';

const Home = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'layers'>('grid');
  const [followingBoards, setFollowingBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    boards: userBoards,
    counts: boardCounts,
    isLoading: userBoardsLoading,
    fetchUserBoards: fetchUserBoardsRPC
  } = useGetUserBoards();

  const {
    invitations,
    isLoading: invitationsLoading,
    fetchUserInvitations,
    acceptInvitation,
    declineInvitation
  } = useGetUserInvitations();

  const {
    wishes,
    isLoading: wishesLoading,
    fetchWishes
  } = useGetUserBoardsWishes();

  useEffect(() => {
    loadBoards();
  }, []);

  // Handle filter change - fetch boards with appropriate status
  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);

    if (!currentUserId) return;

    // Map filter to API status parameter
    const statusMap: Record<string, string | null> = {
      'All': null,
      'New': 'new',
      'Active': 'live',
      'Past': 'past'
    };

    await fetchUserBoardsRPC({
      p_user_id: currentUserId,
      p_status: statusMap[filter] as any,
      p_limit: 10,
      p_offset: 0
    });
  };

  const loadBoards = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);
      const supabase = createClient();

      // Fetch all boards first to get counts, then filter for live
      await fetchUserBoardsRPC({
        p_user_id: user.id,
        p_status: null,
        p_limit: 10,
        p_offset: 0
      });

      // Fetch user invitations
      await fetchUserInvitations({
        p_user_id: user.id,
        p_limit: 10,
        p_offset: 0
      });

      // Fetch wishes for user's boards
      await fetchWishes({
        p_board_ids: null, // Fetch wishes from all user's boards
        p_limit: 10
      });

      const { boards: userBoardsData } = await fetchUserBoards(user.id);

      const fetchContributors = async (boards: Board[]) => {
        if (!boards || boards.length === 0) return [];

        const boardIds = boards.map(b => b.id);

        const { data: allParticipants } = await supabase
          .from('board_participants')
          .select('board_id, user_id')
          .in('board_id', boardIds);

        if (!allParticipants || allParticipants.length === 0) {
          return boards.map(board => ({ ...board, topContributors: [] }));
        }

        const allUserIds = [...new Set(allParticipants.map(p => p.user_id))];

        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, profile_pic_url')
          .in('id', allUserIds);

        const profileMap = (allProfiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile.profile_pic_url || ProfileAvatar;
          return acc;
        }, {} as Record<string, string | typeof ProfileAvatar>);

        const participantsByBoard = allParticipants.reduce((acc, p) => {
          if (!acc[p.board_id]) acc[p.board_id] = [];
          acc[p.board_id].push(p.user_id);
          return acc;
        }, {} as Record<string, string[]>);

        return boards.map(board => {
          const boardParticipants = participantsByBoard[board.id] || [];
          const contributorAvatars = boardParticipants
            .slice(0, 10)
            .map(userId => profileMap[userId] || ProfileAvatar);

          return {
            ...board,
            topContributors: contributorAvatars,
            // Preserve count fields from board table
            participants_count: (board as any).participants_count ?? 0,
            wishes_count: (board as any).wishes_count ?? 0,
            gifters_count: (board as any).gifters_count ?? 0,
            contributors_count: (board as any).contributors_count ?? 0,
            media_count: (board as any).media_count ?? 0,
          };
        });
      };

      // Fetch user's boards using the same API as boards page
      const { data: userOwnBoards, error: userOwnBoardsError } = await getUserBoards(user.id);
      if (!userOwnBoardsError && userOwnBoards) {
        const followingWithContributors = await fetchContributors(userOwnBoards);
        setFollowingBoards(followingWithContributors);
      } else {
        const followingWithContributors = await fetchContributors(userBoardsData || []);
        setFollowingBoards(followingWithContributors.slice(0, 5));
      }

    } catch (err) {
      console.error('Error loading boards:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashNavbar />
      <MobileHeader title={'Boards'} complexRightHref="/dashboard/connections" complexRightTitle="Connections" />
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
                  {invitationsLoading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className='min-w-[350px] h-[220px] bg-gray-100 rounded-[13px] animate-pulse' />
                    ))
                  ) : invitations.length > 0 ? (
                    invitations.slice(0, 5).map((invitation: any) => (
                      <InvitationBoardCard
                        key={invitation.id}
                        title={invitation.board?.title || 'Board Invitation'}
                        backgroundImage={invitation.board?.cover_image || ProfileAvatar}
                        profileImage={invitation.invited_by?.Profile_Picture || ProfileAvatar}
                        inviterName={invitation.invited_by?.name || 'Unknown'}
                        gradientClass='bg-gradient-to-br from-[#cf6c71]/80 to-[#d9777c]/80'
                        onAccept={async () => {
                          await acceptInvitation(invitation.id);
                        }}
                        onDecline={async () => {
                          await declineInvitation(invitation.id);
                        }}
                      />
                    ))
                  ) : (
                    <div className='text-center py-12 w-full'>
                      <p className='text-gray-500'>No invitations found</p>
                    </div>
                  )}
                </div>
              </div>

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
                <BoardsList boards={[]} loading={false} />
              </div>

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
                <BoardsList boards={[]} loading={loading} />
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
                <BoardsList boards={followingBoards} loading={loading} />
              </div>


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
                  onFilterChange={handleFilterChange}
                  counts={boardCounts}
                />
              </div>

              <div className='max-w-[745px] mx-auto py-4 space-y-6'>
                {wishesLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className='h-64 bg-gray-100 rounded-[24px] animate-pulse' />
                    ))}
                  </>
                ) : wishes.length > 0 ? (
                  wishes.map((wish: any) => {
                    // Get sender (wisher) details - try multiple possible field names
                    const senderName = wish.wisher?.name || wish.sender?.name || wish.sender_name || wish.user?.name || 'Unknown';
                    const senderAvatar = wish.wisher?.profile_pic_url || wish.sender?.profile_pic_url || wish.sender_profile_pic_url || wish.user?.profile_pic_url || undefined;

                    // Map media to FeedCard format - try multiple possible field names
                    const mediaArray = wish.media || wish.photos || wish.videos || [];
                    const hasMedia = mediaArray.length > 0;

                    const mediaItems = hasMedia ? mediaArray.map((m: any) => ({
                      type: (m.media_type === 'video' ? 'video' : 'image') as 'image' | 'video',
                      url: m.url || m.cdn_url,
                      thumbnail: m.thumbnail_url || m.thumbnails?.small
                    })) : [];

                    // Get first video and image
                    const firstVideo = mediaArray.find((m: any) => m.media_type === 'video');
                    const firstImage = mediaArray.find((m: any) => m.media_type === 'image');

                    const videoThumbnail = firstVideo?.thumbnail_url || firstVideo?.cdn_url || firstVideo?.url || '';
                    const videoUrl = firstVideo?.cdn_url || firstVideo?.url || '';

                    const timestamp = wish.created_at
                      ? new Date(wish.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '';

                    // Extract title from content (first line or first 50 chars)
                    const contentLines = (wish.content || '').split('\n').filter((line: string) => line.trim());
                    const firstLine = contentLines[0] || '';
                    const title = firstLine.length > 50
                      ? firstLine.substring(0, 50) + '...'
                      : (firstLine || wish.board_title || 'Wish');

                    // Only show description if there's additional content beyond the title
                    let description = '';
                    if (contentLines.length > 1) {
                      // Multiple lines - show lines after the first
                      description = contentLines.slice(1).join(' ').trim();
                    } else if (firstLine.length > 50) {
                      // Single long line - show remainder after title
                      description = firstLine.substring(50).trim();
                    }
                    // If single short line, don't show description (it's already the title)

                    // Use carousel layout if there are multiple media items, horizontal if there's video
                    const layout = hasMedia && firstVideo ? 'horizontal' : 'carousel';

                    return (
                      <FeedCard
                        key={wish.wish_id || wish.id}
                        userName={senderName}
                        userAvatar={senderAvatar}
                        timestamp={timestamp}
                        layout={layout}
                        title={title}
                        description={description}
                        actionTag={wish.gift_amount ? `Gifted : $${wish.gift_amount}` : undefined}
                        videoThumbnail={hasMedia ? videoThumbnail : undefined}
                        videoUrl={hasMedia ? videoUrl : undefined}
                        mediaItems={mediaItems}
                        thumbnailImage={firstImage?.cdn_url || firstImage?.url}
                        likes={wish.likes_count || 0}
                        comments={wish.comments_count || 0}
                        shares={0}
                        memories={mediaArray.length || 0}
                        onUserClick={() => router.push(`/dashboard/boards/${wish.board_id}`)}
                        onVideoClick={() => router.push(`/dashboard/boards/${wish.board_id}`)}
                        boardSlug={wish.board_slug}
                        boardId={wish.board_id}
                        showOnlyLikeAndComment={true}
                      />
                    );
                  })
                ) : (
                  <div className='text-center py-12'>
                    <p className='text-gray-500'>No wishes found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default Home;