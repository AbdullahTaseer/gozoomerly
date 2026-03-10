'use client';

import { useRouter } from 'next/navigation';
import { type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import DynamicBoardCard from '@/components/cards/DynamicBoardCard';

interface BoardsListProps {
  boards: Board[];
  loading?: boolean;
}

export const BoardsList: React.FC<BoardsListProps> = ({ boards, loading = false }) => {
  const router = useRouter();

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
    router.push(`/u/boards/${board.id}`);
  };

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/u/visitProfile/${creatorId}`);
  };

  if (loading) {
    return (
      <div className='grid grid-cols-3 mt-6 gap-6 h-full'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='min-w-[340px] h-[400px] bg-gray-100 rounded-lg animate-pulse' />
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className='text-center py-12 w-full'>
        <p className='text-gray-500'>No boards found for this category</p>
      </div>
    );
  }

  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-6 h-full'>
      {boards.map((board) => {
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
            participants={board.participants_count || 0}
            wishes={board.wishes_count || 0}
            gifters={board.gifters_count ?? 0}
            memories={board.media_count || 0}
            chats={board.views_count || 0}
            topContributors={(board as any).topContributors || []}
            primaryColor={board.honoree_details?.theme_color}
            gradient={board.board_types?.color_scheme?.gradient}
            onNameClick={() => handleViewBoard(board)}
            onCreatorClick={() => handleCreatorClick(board.creator_id)}
            className='w-full h-full'
          />
        );
      })}
    </div>
  );
};

