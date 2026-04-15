'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import InviteModal from '@/components/modals/InviteModal';
import {
  Board,
  getUserBoardsYours,
  getUserInvitationsForList,
} from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import DefaultAvatar from '@/assets/svgs/boy-avatar.svg';
import DynamicBoardCard from '@/components/cards/DynamicBoardCard';
import CoverCard from '@/components/cards/CoverCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import GlobalInput from '@/components/inputs/GlobalInput';

type BoardsListTab = 'birthday' | 'inviteSent' | 'decline';

const TAB_META: { id: BoardsListTab; label: string }[] = [
  { id: 'birthday', label: 'Birthday boards' },
  { id: 'inviteSent', label: 'Invite sent' },
  { id: 'decline', label: 'Decline Boards' },
];

const placeholderCoverImage =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';

function invitationCoverUrl(inv: Record<string, unknown>): string {
  const board = inv?.board as Record<string, unknown> | undefined;
  if (!board) return placeholderCoverImage;
  const cover = board.cover_image as { url?: string } | undefined;
  return (
    cover?.url ||
    (board.cover_image_url as string | undefined) ||
    (board.honoree_details as { profile_photo_url?: string } | undefined)
      ?.profile_photo_url ||
    placeholderCoverImage
  );
}

function invitationBoardTitle(inv: Record<string, unknown>): string {
  const board = inv?.board as { title?: string } | undefined;
  return board?.title || (inv.title as string | undefined) || 'Board';
}

function invitationInviteeRow(inv: Record<string, unknown>): {
  name: string;
  avatar: typeof DefaultAvatar;
} {
  const invitee = inv.invitee as
    | { name?: string; profile_pic_url?: string }
    | undefined;
  const email = inv.invitee_email as string | undefined;
  const phone = inv.invitee_phone as string | undefined;
  const name =
    invitee?.name ||
    (email ? email.split('@')[0] : null) ||
    phone ||
    'Invitee';
  const avatar = invitee?.profile_pic_url || DefaultAvatar;
  return { name, avatar };
}

const Boards = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [inviteSentItems, setInviteSentItems] = useState<any[]>([]);
  const [declineItems, setDeclineItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthdayRefreshing, setBirthdayRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<BoardsListTab>('birthday');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const lastBirthdaySearchKey = useRef<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authService.getUser();
        if (!user) {
          router.push('/signin');
          return;
        }
        setUserId(user.id);
        setLoading(true);
        setError(null);

        const [yours, sent, declined] = await Promise.all([
          getUserBoardsYours(user.id, { search: null }),
          getUserInvitationsForList({
            p_direction: 'sent',
            p_status: null,
          }),
          getUserInvitationsForList({
            p_status: 'declined',
            p_direction: null,
          }),
        ]);

        if (yours.error) {
          setError(yours.error.message || 'Failed to load boards');
        }
        setBoards(yours.boards);
        lastBirthdaySearchKey.current = '';

        if (!sent.error) {
          setInviteSentItems(sent.invitations);
        }
        if (!declined.error) {
          setDeclineItems(declined.invitations);
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    if (lastBirthdaySearchKey.current === null) return;
    if (debouncedSearch === lastBirthdaySearchKey.current) return;

    const t = setTimeout(() => {
      void (async () => {
        try {
          setBirthdayRefreshing(true);
          const { boards: next, error: fetchError } = await getUserBoardsYours(
            userId,
            { search: debouncedSearch || null }
          );
          if (fetchError) {
            setError(fetchError.message || 'Failed to load boards');
            return;
          }
          setBoards(next);
          lastBirthdaySearchKey.current = debouncedSearch;
        } finally {
          setBirthdayRefreshing(false);
        }
      })();
    }, 400);

    return () => clearTimeout(t);
  }, [userId, debouncedSearch]);

  const handleInviteClick = (board: any) => {
    setSelectedBoard({ slug: board.slug, title: board.title });
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setSelectedBoard(null);
  };

  const handleViewBoard = (board: Board) => {
    router.push(`/u/boards/${board.id}`);
  };

  const handleViewBoardById = (id: string) => {
    router.push(`/u/boards/${id}`);
  };

  const getBoardCardData = (board: any) => {
    const honoreeFirstName = board.honoree_details?.first_name || '';
    const honoreeLastName = board.honoree_details?.last_name || '';
    const honoreeName =
      honoreeFirstName && honoreeLastName
        ? `${honoreeFirstName} ${honoreeLastName}`.trim()
        : honoreeFirstName || honoreeLastName || 'Unknown';
    const honoreeProfilePhoto =
      board.honoree_details?.profile_photo_url || DefaultAvatar;
    const coverImage =
      board.cover_image_url ||
      board.honoree_details?.cover_url ||
      placeholderCoverImage;

    return {
      honoreeName,
      honoreeProfilePhoto,
      coverImage,
      honoreeDetails: board.honoree_details,
      boardTypes: board.board_types,
    };
  };

  const birthdayTotal =
    (boards as { total?: number }).total ??
    boards.length;
  const tabCounts: Record<BoardsListTab, number> = {
    birthday: birthdayTotal,
    inviteSent: inviteSentItems.length,
    decline: declineItems.length,
  };

  const renderInviteCards = (
    items: any[],
    personLabel: string
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((inv) => {
        const row = invitationInviteeRow(inv);
        const bid =
          (inv.board_id as string) ||
          (inv.board as { id?: string } | undefined)?.id;
        return (
          <CoverCard
            key={inv.id}
            coverImage={invitationCoverUrl(inv)}
            title={invitationBoardTitle(inv)}
            variant="inviteSent"
            inviteSentTo={{ name: row.name, avatar: row.avatar }}
            personLabel={personLabel}
            onClick={() => bid && handleViewBoardById(bid)}
          />
        );
      })}
    </div>
  );

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Boards"
        showBack
        onBackClick={() => router.push('/u/profile')}
        profileRight
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="flex items-center justify-between gap-4 mb-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => router.push('/u/profile')}
            className="max-[769px]:hidden flex items-center gap-2 text-black shrink-0"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Boards</span>
          </button>
          <div className="flex gap-2 min-w-max">
            {TAB_META.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {tab.label} ({tabCounts[tab.id]})
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'birthday' && (
          <div className="relative max-w-sm mx-auto mb-6">
            <Search size={18} className='absolute top-3.5 left-3' />
            <GlobalInput
              placeholder="Search"
              height='46px'
              type='search'
              width='100%'
              borderRadius='100px'
              inputClassName="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {birthdayRefreshing ? (
              <p className="text-xs text-center text-gray-500 mt-1">Searching…</p>
            ) : null}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading boards...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : activeTab === 'birthday' && boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No boards in this category</p>
          </div>
        ) : activeTab === 'inviteSent' && inviteSentItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No invitations in this category</p>
          </div>
        ) : activeTab === 'decline' && declineItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No declined invitations</p>
          </div>
        ) : activeTab === 'birthday' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => {
              const data = getBoardCardData(board);
              return (
                <DynamicBoardCard
                  key={board.id}
                  title={board.title}
                  avatar={data.honoreeProfilePhoto}
                  name={data.honoreeName}
                  location={data.honoreeDetails?.hometown || ''}
                  date={
                    data.honoreeDetails?.date_of_birth
                      ? new Date(
                        data.honoreeDetails.date_of_birth
                      ).toLocaleDateString()
                      : new Date(board.created_at).toLocaleDateString()
                  }
                  description={board.description || ''}
                  fundTitle={
                    board.goal_type === 'monetary'
                      ? `$${board.goal_amount || 0} Goal`
                      : 'Nonmonetary goal'
                  }
                  raised={board.total_raised || 0}
                  target={board.goal_amount || 0}
                  participants={board.participants_count || 0}
                  wishes={board.wishes_count || 0}
                  gifters={board.gifters_count ?? 0}
                  media={board.media_count || 0}
                  memories={board.media_count || 0}
                  topContributors={(board as any).topContributors || []}
                  gradient={data.boardTypes?.color_scheme?.gradient}
                  primaryColor={data.honoreeDetails?.theme_color}
                  onInviteClick={() => handleInviteClick(board)}
                  onNameClick={() => handleViewBoard(board)}
                  slug={board.slug}
                />
              );
            })}
          </div>
        ) : activeTab === 'inviteSent' ? (
          renderInviteCards(inviteSentItems, 'Invite sent to')
        ) : (
          renderInviteCards(declineItems, 'Declined invite')
        )}
      </div>

      {selectedBoard && (
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={handleCloseInviteModal}
          boardSlug={selectedBoard.slug}
          boardTitle={selectedBoard.title}
        />
      )}
    </div>
  );
};

export default Boards;
