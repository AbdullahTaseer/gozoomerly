'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpotLightCard from '@/components/cards/SpotLightCard';
import { useGetSpotlightBoards } from '@/hooks/useGetSpotlightBoards';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';
import { useGetUserInvitations } from '@/hooks/useGetUserInvitations';
import { useGetUserBoardsWishes } from '@/hooks/useGetUserBoardsWishes';
import { useGetFollowingBoards } from '@/hooks/useGetFollowingBoards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-3.svg";
import { authService } from '@/lib/supabase/auth';
import DashNavbar from '@/components/navbar/DashNavbar';
import { FollowingTabCards } from '@/components/boards/FollowingTabCards';
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';
import ExploreCard from '@/components/cards/ExploreCard';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import InviteDeclinedModalContent from '@/components/modals/InviteDeclinedModalContent';
import ExploreCardModal from '@/components/modals/ExploreCardModal';
import HomeExploreParticipantsContent from '@/components/modals/HomeExploreParticipantsContent';
import MobileHeader from '@/components/navbar/MobileHeader';
import GlobalInput from '@/components/inputs/GlobalInput';
import { Search } from 'lucide-react';
import { useGetPublicBoards, type PublicBoard } from '@/hooks/useGetPublicBoards';
import { useExploreColumnCount, splitIntoRoundRobinColumns } from '@/hooks/useExploreColumnCount';

function exploreCardImageHeightPx(colIdx: number, rowIdx: number): 160 | 210 {
  const isEvenNumberedColumn = colIdx % 2 === 1;
  return rowIdx === 0 && isEvenNumberedColumn ? 160 : 210;
}

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [declineModal, setDeclineModal] = useState<{ invitationId: string; onConfirm: () => Promise<void> } | null>(null);
  const [exploreModalCard, setExploreModalCard] = useState<PublicBoard | null>(null);
  const [participantsModalCard, setParticipantsModalCard] = useState<PublicBoard | null>(null);

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

  const {
    spotlightBoards,
    isLoading: spotlightLoading,
    fetchSpotlightBoards
  } = useGetSpotlightBoards();

  const {
    boards: followingBoards,
    isLoading: followingLoading,
    isLoadingMore: followingLoadingMore,
    hasMore: followingHasMore,
    fetchBoards: fetchFollowingBoards,
    loadMore: loadMoreFollowing,
  } = useGetFollowingBoards();

  const {
    boards: exploreBoards,
    isLoading: exploreLoading,
    isLoadingMore: exploreLoadingMore,
    hasMore: exploreHasMore,
    fetchBoards: fetchPublicBoards,
    loadMore: loadMoreExplore,
  } = useGetPublicBoards();

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

      setCurrentUserId(user.id);

      await Promise.all([
        fetchUserBoardsRPC({
          p_user_id: user.id,
          p_status: null,
          p_limit: 10,
          p_offset: 0,
        }),
        fetchUserInvitations({
          p_user_id: user.id,
          p_limit: 10,
          p_offset: 0,
        }),
        fetchWishes({
          p_board_ids: null,
          p_limit: 10,
        }),
        fetchSpotlightBoards({
          p_limit: 10,
          p_offset: 0,
        }),
        fetchFollowingBoards(user.id, 10),
        fetchPublicBoards(10, 4),
      ]);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'explore', label: 'Explore' },
    { key: 'following', label: 'Following' },
    { key: 'spotlight', label: 'Spotlight Boards' },
    { key: 'newInvites', label: 'New Invites' },
  ] as const;

  type TabKey = (typeof tabs)[number]['key'];
  const [activeTab, setActiveTab] = useState<TabKey>('explore');
  const [exploreSearch, setExploreSearch] = useState('');

  const filteredExploreBoards = exploreSearch.trim()
    ? exploreBoards.filter(b => b.title.toLowerCase().includes(exploreSearch.toLowerCase()))
    : exploreBoards;

  const exploreColumnCount = useExploreColumnCount();
  const exploreColumns = splitIntoRoundRobinColumns(filteredExploreBoards, exploreColumnCount);
  const exploreSkeletonColumns = splitIntoRoundRobinColumns(
    Array.from({ length: 8 }, (_, i) => i),
    exploreColumnCount
  );

  return (
    <div>
      <DashNavbar />
      <MobileHeader homeRight={true} titleColor='bg-clip-text text-transparent bg-linear-to-r from-[#E5408A] to-[#845CBA]' />
      <div className='py-5'>
        <div className='md:px-[5%] md:flex justify-between items-center'>
          <p className='text-[36px] hidden md:block font-semibold'>Home</p>
          <div className='flex px-4 items-center sm:justify-center gap-2 overflow-x-auto scrollbar-hide'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 px-5 py-2.5 cursor-pointer rounded-full text-sm font-medium transition-colors ${activeTab === tab.key
                  ? 'bg-[#18171f] text-white'
                  : 'bg-white text-[#18171f] border border-[#DCDCDC] hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className='px-[5%] max-[769px]:px-4 mt-6'>

          {activeTab === 'newInvites' && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {loading || invitationsLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className='h-[200px] bg-gray-100 rounded-2xl animate-pulse' />
                ))
              ) : invitations.length > 0 ? (
                invitations.map((invitation: any) => (
                  <InvitationBoardCard
                    key={invitation.id}
                    title={invitation.board?.title || 'Board Invitation'}
                    backgroundImage={invitation.board?.cover_image}
                    profileImage={invitation.inviter?.profile_pic_url || invitation.invited_by?.Profile_Picture || ProfileAvatar}
                    inviterName={invitation.inviter?.name || invitation.invited_by?.name || 'Unknown'}
                    gradientClass='bg-gradient-to-b from-[#cf6c71]/80 to-[#BEA250]/80'
                    onAccept={async () => {
                      await acceptInvitation(invitation.id);
                    }}
                    onDecline={() => {
                      setDeclineModal({
                        invitationId: invitation.id,
                        onConfirm: async () => {
                          await declineInvitation(invitation.id);
                          if (currentUserId) {
                            fetchUserInvitations({ p_user_id: currentUserId, p_limit: 10, p_offset: 0 });
                          }
                        }
                      });
                    }}
                  />
                ))
              ) : (
                <div className='col-span-full text-center py-16'>
                  <p className='text-gray-500'>No invitations found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'spotlight' && (
            <div className='grid max-[550px]:grid-cols-1 max-[900px]:grid-cols-2 grid-cols-3'>
              {spotlightLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className='min-w-[370px] h-[350px] bg-gray-100 rounded-[12px] animate-pulse' />
                ))
              ) : spotlightBoards.length > 0 ? (
                spotlightBoards.map((board, index) => (
                  <SpotLightCard
                    key={board.id}
                    priority={index === 0}
                    name={board.name}
                    description={board.description}
                    spotLightImg={board.spotlight_img || ProfileAvatar}
                    participants={board.participants}
                    organizerName={board.organizer_name}
                    organizerAvatar={board.organizer_avatar || ProfileAvatar}
                    topContributors={board.top_contributors.length > 0 ? board.top_contributors : []}
                  />
                ))
              ) : (
                <div className='w-full text-center py-12'>
                  <p className='text-gray-500'>No spotlight boards found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div>
              <FollowingTabCards boards={followingBoards} loading={followingLoading} />
              {followingHasMore && !followingLoading && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreFollowing}
                    disabled={followingLoadingMore}
                    className="px-6 py-2.5 rounded-full bg-[#18171f] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {followingLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'explore' && (
            <div>
              <div className="relative max-w-[470px] mx-auto mb-6">
                <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-black pointer-events-none" />
                <GlobalInput
                  placeholder="Search here..."
                  height="44px"
                  width="100%"
                  borderRadius="100px"
                  inputClassName="pl-11 border-[#EAEAEA]"
                  value={exploreSearch}
                  onChange={(e) => setExploreSearch(e.target.value)}
                />
              </div>
              {loading || exploreLoading ? (
                <div className="flex gap-2">
                  {exploreSkeletonColumns.map((col, colIdx) => (
                    <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-2">
                      {col.map((slot, rowIdx) => (
                        <div
                          key={slot}
                          className="shrink-0 rounded-lg bg-gray-100 animate-pulse"
                          style={{ height: exploreCardImageHeightPx(colIdx, rowIdx) }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    {exploreColumns.map((colBoards, colIdx) => (
                      <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-2">
                        {colBoards.map((board, rowIdx) => {
                          const avatarUrls = board.member_previews
                            .map((m) => m.profile_pic_url)
                            .filter(Boolean) as string[];
                          const remaining = Math.max(0, board.total_members - board.member_previews.length);

                          return (
                            <ExploreCard
                              key={board.id}
                              title={board.title}
                              image={board.cover_image_url || board.honoree_details?.profile_photo_url || ''}
                              avatars={avatarUrls}
                              extraCount={remaining}
                              imageHeightPx={exploreCardImageHeightPx(colIdx, rowIdx)}
                              onClick={() => setExploreModalCard(board)}
                              onAvatarsClick={() => setParticipantsModalCard(board)}
                              priority={colIdx === 0 && rowIdx === 0}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {filteredExploreBoards.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No boards found</p>
                    </div>
                  )}
                  {exploreHasMore && !exploreSearch.trim() && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={loadMoreExplore}
                        disabled={exploreLoadingMore}
                        className="px-6 py-2.5 rounded-full bg-[#18171f] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {exploreLoadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

      </div>
      <ModalOrBottomSlider
        title="Decline board"
        isOpen={!!declineModal}
        onClose={() => setDeclineModal(null)}
        desktopClassName="max-w-sm"
      >
        {declineModal ? (
          <InviteDeclinedModalContent
            onClose={() => setDeclineModal(null)}
            onConfirm={declineModal.onConfirm}
          />
        ) : null}
      </ModalOrBottomSlider>

      <ModalOrBottomSlider
        isOpen={!!exploreModalCard}
        onClose={() => setExploreModalCard(null)}
        modalHeader={false}
        desktopClassName="!w-[650px] !max-h-[650px]"
        contentClassName="!p-4"
      >
        {exploreModalCard ? (
          <ExploreCardModal
            isOpen={!!exploreModalCard}
            onClose={() => setExploreModalCard(null)}
            boardId={exploreModalCard.id}
            honoreeName={(() => {
              const h = exploreModalCard.honoree_details;
              if (!h) return exploreModalCard.title ?? '';
              const full = `${h.first_name || ''} ${h.last_name || ''}`.trim();
              return full || exploreModalCard.title || '';
            })()}
            title={exploreModalCard.title ?? ''}
            image={exploreModalCard.cover_image_url || exploreModalCard.honoree_details?.profile_photo_url || ''}
            avatars={
              exploreModalCard.member_previews
                ?.map((m) => m.profile_pic_url)
                .filter(Boolean) as string[] ?? []
            }
            participants={exploreModalCard.member_previews ?? []}
            extraCount={Math.max(0, (exploreModalCard.total_members ?? 0) - (exploreModalCard.member_previews?.length ?? 0))}
            creatorId={exploreModalCard.creator?.id ?? exploreModalCard.creator_id ?? null}
            creatorName={exploreModalCard.creator?.name || ''}
            creatorAvatar={exploreModalCard.creator?.profile_pic_url || undefined}
            likesCount={exploreModalCard.wishes_count ?? 0}
            commentsCount={exploreModalCard.contributors_count ?? 0}
            sharesCount={exploreModalCard.shares_count ?? 0}
          />
        ) : null}
      </ModalOrBottomSlider>

      <ModalOrBottomSlider
        title="Participants"
        isOpen={!!participantsModalCard}
        onClose={() => setParticipantsModalCard(null)}
        desktopClassName="sm:max-w-md"
        contentClassName="pb-0"
      >
        {participantsModalCard ? (
          <HomeExploreParticipantsContent
            participants={participantsModalCard.member_previews ?? []}
            totalMembers={participantsModalCard.total_members ?? 0}
            onClose={() => setParticipantsModalCard(null)}
          />
        ) : null}
      </ModalOrBottomSlider>
    </div>
  );
};

export default Home;