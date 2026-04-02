'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, Heart, MessageCircle, Share, Bookmark, Play } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import ShareBoardModal from '@/components/modals/ShareBoardModal';
import InviteToBoardModal from '@/components/modals/InviteToBoardModal';

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
  saves = 12,
  onLikeClick,
  onCommentClick,

  shareUrl,
  boardSlug,
  boardId,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const generatedShareUrl =
    shareUrl ||
    (boardSlug
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/u/boards/${boardSlug}`
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
    if (hasCarousel) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 3) goPrev();
      else if (x > (2 * rect.width) / 3) goNext();
    }
  };

  return (
    <div
      onClick={() => onCardClick?.()}
      className={`bg-[#F3F3F3] rounded-xl overflow-hidden h-fit shadow-md transition-shadow ${onCardClick ? 'cursor-pointer' : ''
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
        className="relative aspect-[4/3] mt-4 bg-gray-200"
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
            onClick={onLikeClick}
            className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500'
              }`}
          >
            <Heart
              size={18}
              strokeWidth={2}
              className={isLiked ? 'fill-pink-500 stroke-pink-500' : ''}
            />
            <span>{likes}</span>
          </button>
          <button
            onClick={onCommentClick}
            className="flex items-center gap-1 text-sm hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} strokeWidth={2} />
            <span>{comments}</span>
          </button>
          <span className="flex items-center gap-1 text-sm">
            <Bookmark size={18} strokeWidth={2} />
            <span>{saves}</span>
          </span>
          <button
            onClick={() => setIsShareModalOpen(true)}
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
    </div>
  );
};

export default FollowingCard;
