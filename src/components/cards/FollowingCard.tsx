'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Heart, MessageCircle, Share, Bookmark, Play } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import ShareBoardModal from '@/components/modals/ShareBoardModal';
import InviteToBoardModal from '@/components/modals/InviteToBoardModal';
import WishModal from '@/components/modals/WishModal';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import {
  isBoardFavorited,
  rpcFavoriteBoard,
  rpcUnfavoriteBoard,
} from '@/lib/supabase/favoriteBoards';
import toast from 'react-hot-toast';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface FollowingCardProps {
  userName?: string;
  userAvatar?: string;
  onOptionsClick?: () => void;
  onUserClick?: () => void;

  title?: string;
  coverImage?: string;
  mediaItems?: MediaItem[];
  isVideo?: boolean;
  videoThumbnail?: string;
  onCardClick?: () => void;

  likes?: number;
  isLiked?: boolean;
  comments?: number;
  shares?: number;
  saves?: number;
  onLikeClick?: () => void;
  onCommentClick?: () => void;

  shareUrl?: string;
  boardSlug?: string;
  boardId?: string;
  /** Honoree name for the wish / “like” flow */
  honoreeName?: string;
  /** When false, heart opens a toast instead of the wish composer */
  supportsWishes?: boolean;
}

const FollowingCard: React.FC<FollowingCardProps> = ({
  userName = 'Samantha Carter',
  userAvatar,
  onOptionsClick,
  onUserClick,
  title = 'Board title',
  coverImage = '',
  mediaItems = [],
  isVideo = false,
  videoThumbnail,
  onCardClick,

  likes = 100,
  isLiked = false,
  comments = 80,
  shares = 23,
  saves: _unusedSaves = 12,
  onLikeClick,
  onCommentClick,

  shareUrl,
  boardSlug,
  boardId,
  honoreeName,
  supportsWishes = true,
}) => {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [favoriteUserId, setFavoriteUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(!!boardId);
  const [favoriteToggling, setFavoriteToggling] = useState(false);

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  useEffect(() => {
    if (!boardId) {
      setFavoriteLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const user = await authService.getUser();
      if (cancelled) return;
      if (!user?.id) {
        setFavoriteUserId(null);
        setIsFavorite(false);
        setFavoriteLoading(false);
        return;
      }
      setFavoriteUserId(user.id);
      const supabase = createClient();
      const fav = await isBoardFavorited(supabase, user.id, boardId);
      if (!cancelled) {
        setIsFavorite(fav);
        setFavoriteLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const toggleFavorite = useCallback(async () => {
    if (!favoriteUserId || !boardId || favoriteToggling || favoriteLoading) return;
    setFavoriteToggling(true);
    const supabase = createClient();
    const add = !isFavorite;
    try {
      if (add) {
        const { error } = await rpcFavoriteBoard(supabase, favoriteUserId, boardId);
        if (error) throw error;
        setIsFavorite(true);
        toast.success('Saved to favorites');
      } else {
        const { error } = await rpcUnfavoriteBoard(supabase, favoriteUserId, boardId);
        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      }
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: string }).message)
          : 'Could not update favorites';
      toast.error(msg);
    } finally {
      setFavoriteToggling(false);
    }
  }, [favoriteUserId, boardId, isFavorite, favoriteToggling, favoriteLoading]);

  const generatedShareUrl =
    shareUrl ||
    (typeof window !== 'undefined'
      ? boardSlug
        ? `${window.location.origin}/u/boards/${boardSlug}`
        : boardId
          ? `${window.location.origin}/u/boards/${boardId}`
          : ''
      : '');

  const currentMedia = mediaItems?.[carouselIndex];
  const hasCarousel = mediaItems.length > 1;
  const currentIsVideo = currentMedia?.type === 'video';
  const mediaSrc = currentIsVideo
    ? currentMedia?.thumbnail || currentMedia?.url || videoThumbnail || coverImage
    : currentMedia?.url || currentMedia?.thumbnail || coverImage;

  const goPrev = () => setCarouselIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () =>
    setCarouselIndex((prev) => Math.min(prev + 1, mediaItems.length - 1));

  const handleMediaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!hasCarousel) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else if (x > (2 * rect.width) / 3) goNext();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick();
      return;
    }
    if (!boardId) return;
    if (!supportsWishes) {
      toast.error('Wishes are not enabled for this board');
      return;
    }
    setWishModalOpen(true);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCommentClick) {
      onCommentClick();
    } else if (boardId) {
      router.push(`/u/boards/${boardId}`);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!boardId || !favoriteUserId || favoriteLoading) return;
    void toggleFavorite();
  };

  return (
    <>
    <div
      onClick={() => onCardClick?.()}
      className={`bg-[#F3F3F3] rounded-xl flex flex-col justify-between overflow-hidden shadow-md transition-shadow ${onCardClick ? 'cursor-pointer' : ''
        }`}
    >
      <div className="p-4 pb-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onUserClick?.();
            }}
            className={`relative w-10 h-10 shrink-0 rounded-full overflow-hidden ${onUserClick ? 'cursor-pointer' : ''
              }`}
          >
            <Image
              src={userAvatar || ProfileAvatar}
              alt={userName}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  typeof ProfileAvatar === 'string'
                    ? ProfileAvatar
                    : (ProfileAvatar as { src?: string }).src || '';
              }}
            />
          </div>
          <p className="font-medium text-sm text-[#1B1D26]">{userName}</p>
        </div>
        <h3 className="font-medium text-sm text-[#1B1D26]">{title}</h3>
      </div>

      <div
        className="relative aspect-[4/3] flex-1 mt-4 bg-gray-200"
        onClick={handleMediaClick}
      >
        {mediaSrc ? (
          <Image
            src={mediaSrc}
            alt={title || ''}
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : null}
        {currentIsVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={24} className="text-gray-800 ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        {hasCarousel && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === carouselIndex ? 'bg-pink-500' : 'bg-white/80 hover:bg-white'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className="px-4 py-3 flex items-center justify-between text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLikeClick}
            className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'
              }`}
          >
            <Heart
              size={18}
              strokeWidth={2}
              className={isLiked ? 'fill-pink-500 stroke-pink-500' : ''}
            />
            <span>{localLikes}</span>
          </button>
          <button
            type="button"
            onClick={handleCommentClick}
            className="flex items-center gap-1 text-sm hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} strokeWidth={2} />
            <span>{comments}</span>
          </button>
          <button
            type="button"
            onClick={handleBookmarkClick}
            disabled={!boardId || !favoriteUserId || favoriteLoading || favoriteToggling}
            className={`flex items-center gap-1 text-sm transition-colors disabled:opacity-40 ${
              isFavorite ? 'text-red-500' : 'hover:text-amber-600'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save board'}
            title={isFavorite ? 'Remove from saved' : 'Save board'}
          >
            <Bookmark
              size={18}
              strokeWidth={isFavorite ? 0 : 2}
              className={isFavorite ? 'fill-red-500 text-red-500' : ''}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1 text-sm hover:text-green-500 transition-colors"
          >
            <Share size={18} strokeWidth={2} />
            <span>{shares}</span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOptionsClick?.();
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={generatedShareUrl}
        title={title}
      />
      {boardId && (
        <InviteToBoardModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          boardId={boardId}
          boardTitle={title}
        />
      )}

      {boardId && (
        <WishModal
          isOpen={wishModalOpen}
          onClose={() => setWishModalOpen(false)}
          boardId={boardId}
          honoreeName={honoreeName || title}
          onSubmit={() => setLocalLikes((c) => c + 1)}
        />
      )}
    </>
  );
};

export default FollowingCard;
