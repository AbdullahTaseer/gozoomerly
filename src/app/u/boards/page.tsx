'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import InviteModal from '@/components/modals/InviteModal';
import { Board, getUserBoards } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import DefaultAvatar from '@/assets/svgs/boy-avatar.svg';
import DynamicBoardCard from '@/components/cards/DynamicBoardCard';
import CoverCard from '@/components/cards/CoverCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';

type FilterTab = 'birthday' | 'inviteSent' | 'newYear' | 'decline';

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'birthday', label: 'Birthday boards' },
  { id: 'inviteSent', label: 'Invite sent' },
  { id: 'newYear', label: 'New year boards' },
  { id: 'decline', label: 'Decline Boards' },
];

const placeholderCoverImage = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';
const inviteSentPlaceholders = [
  { name: 'Jordan Mitchell', avatar: DefaultAvatar },
  { name: 'Alex Thompson', avatar: DefaultAvatar },
];

const Boards = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{ slug: string; title: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('birthday');

  useEffect(() => {
    fetchUserBoards();
  }, []);

  const fetchUserBoards = async () => {
    try {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const { data, error: fetchError } = await getUserBoards(user.id);
      if (fetchError) {
        setError('Failed to load boards');
        return;
      }

      setBoards(data || []);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const filterBoards = (filter: FilterTab) => {
    const typeName = (board: any) =>
      (board.board_types?.name || '').toLowerCase();
    const title = (board: any) => (board.title || '').toLowerCase();

    switch (filter) {
      case 'birthday':
        return boards.filter(
          (b) =>
            typeName(b).includes('birthday') ||
            title(b).includes('birthday')
        );
      case 'inviteSent':
        return boards.slice(0, Math.min(boards.length, 5));
      case 'newYear':
        return boards.filter(
          (b) =>
            title(b).includes('christmas') ||
            title(b).includes('new year') ||
            title(b).includes('newyear')
        );
      case 'decline':
        return boards;
      default:
        return boards;
    }
  };

  const filteredBoards = filterBoards(activeFilter);
  const counts = filterTabs.map((t) => ({ ...t, count: filterBoards(t.id).length }));

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
      board.cover_image_url || board.honoree_details?.cover_url || placeholderCoverImage;

    return {
      honoreeName,
      honoreeProfilePhoto,
      coverImage,
      honoreeDetails: board.honoree_details,
      boardTypes: board.board_types,
    };
  };

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
            {counts.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${activeFilter === tab.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading boards...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredBoards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No boards in this category</p>
          </div>
        ) : activeFilter === 'inviteSent' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board, idx) => {
              const data = getBoardCardData(board);
              const inviteTo =
                inviteSentPlaceholders[idx % inviteSentPlaceholders.length];
              return (
                <CoverCard
                  key={board.id}
                  coverImage={data.coverImage}
                  title={board.title}
                  variant="inviteSent"
                  inviteSentTo={{
                    name: inviteTo.name,
                    avatar: inviteTo.avatar,
                  }}
                  onClick={() => handleViewBoard(board)}
                />
              );
            })}
          </div>
        ) : (
          /* Full board cards: grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board) => {
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
