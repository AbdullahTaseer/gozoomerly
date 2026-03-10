'use client';

import { useRouter } from 'next/navigation';
import { type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import FollowingCard from '@/components/cards/FollowingCard';

const placeholderCoverImage = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';

interface FollowingTabCardsProps {
  boards: Board[];
  loading?: boolean;
}

export const FollowingTabCards: React.FC<FollowingTabCardsProps> = ({ boards, loading = false }) => {
  const router = useRouter();

  const getCoverImage = (board: Board) => {
    const b = board as any;
    return b.cover_image?.url || b.cover_image_url || board.honoree_details?.profile_photo_url || placeholderCoverImage;
  };

  const getCreatorName = (board: Board) => {
    const b = board as any;
    return b.profiles?.name || b.creator?.name || 'Organizer';
  };

  const getCreatorAvatar = (board: Board) => {
    const b = board as any;
    return b.profiles?.profile_pic_url || b.creator?.profile_pic_url || board.honoree_details?.profile_photo_url || ProfileAvatar;
  };

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[380px] bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="text-center py-12 w-full">
        <p className="text-gray-500">No boards found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {boards.map((board) => (
        <FollowingCard
          key={board.id}
          userName={getCreatorName(board)}
          userAvatar={getCreatorAvatar(board)}
          title={board.title}
          coverImage={getCoverImage(board)}
          mediaItems={[{ type: 'image' as const, url: getCoverImage(board) }]}
          likes={100}
          comments={80}
          shares={board.shares_count || 23}
          saves={12}
          boardId={board.id}
          boardSlug={board.slug}
          onUserClick={() => router.push(`/u/visitProfile/${board.creator_id}`)}
          onCardClick={() => router.push(`/u/boards/${board.id}`)}
        />
      ))}
    </div>
  );
};
