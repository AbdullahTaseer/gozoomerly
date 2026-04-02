'use client';

import { useRouter } from 'next/navigation';
import { type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import FollowingCard, { type MediaItem } from '@/components/cards/FollowingCard';

const placeholderCoverImage = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';

interface FollowingTabCardsProps {
  boards: Board[];
  loading?: boolean;
}

function getHonoreeName(details: any): string | null {
  if (!details) return null;
  const first = details.first_name || '';
  const last = details.last_name || '';
  const full = `${first} ${last}`.trim();
  return full || null;
}

export const FollowingTabCards: React.FC<FollowingTabCardsProps> = ({ boards, loading = false }) => {
  const router = useRouter();

  const getCoverImage = (board: Board) => {
    const b = board as any;
    return (
      b.cover_image?.url ||
      b.cover_image_url ||
      placeholderCoverImage
    );
  };

  const getCreatorName = (board: Board) => {
    const b = board as any;
    return (
      b.profiles?.name ||
      b.creator?.name ||
      getHonoreeName(board.honoree_details) ||
      'Organizer'
    );
  };

  const getCreatorAvatar = (board: Board) => {
    const b = board as any;
    return (
      board.honoree_details?.profile_photo_url ||
      b.profiles?.profile_pic_url ||
      b.creator?.profile_pic_url ||
      ProfileAvatar
    );
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

  const getMediaItems = (board: Board): MediaItem[] => {
    const b = board as any;
    const items: MediaItem[] = [];

    if (Array.isArray(b.board_media) && b.board_media.length > 0) {
      b.board_media.forEach((m: any) => {
        if (m.url) {
          items.push({
            type: m.type === 'video' ? 'video' : 'image',
            url: m.url,
            thumbnail: m.thumbnail,
          });
        }
      });
    }

    if (items.length === 0) {
      const cover = getCoverImage(board);
      items.push({ type: 'image', url: cover });
    }

    return items;
  };

  const hasVideo = (board: Board): boolean => {
    const b = board as any;
    if (!Array.isArray(b.board_media)) return false;
    return b.board_media.some((m: any) => m.type === 'video');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {boards.map((board) => {
        const honoreeName = getHonoreeName(board.honoree_details);
        const displayTitle = board.title || honoreeName || 'Untitled Board';
        const mediaItems = getMediaItems(board);

        return (
          <FollowingCard
            key={board.id}
            userName={getCreatorName(board)}
            userAvatar={getCreatorAvatar(board)}
            title={displayTitle}
            coverImage={getCoverImage(board)}
            mediaItems={mediaItems}
            isVideo={hasVideo(board)}
            likes={board.wishes_count || 0}
            comments={board.contributors_count || 0}
            shares={board.shares_count || 0}
            saves={board.views_count || 0}
            boardId={board.id}
            boardSlug={board.slug}
            onUserClick={() => router.push(`/u/visitProfile/${board.creator_id}`)}
            onCardClick={() => router.push(`/u/boards/${board.id}`)}
          />
        );
      })}
    </div>
  );
};
