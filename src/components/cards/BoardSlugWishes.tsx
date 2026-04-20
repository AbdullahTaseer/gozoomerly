'use client';

import {  useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import FeedCard from '@/components/cards/FeedCard';
import WishCommentsModalContent from '@/components/cards/WishCommentsModal';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import { getBoardWishes, likeWish, unlikeWish, getWishComments } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { SkeletonFeedCard } from '@/components/skeletons';

interface BoardSlugWishesProps {
  boardId: string;
  boardTitle?: string;
  boardSlug?: string;
  refreshKey?: number | string;
}

interface WishWithDetails {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    profile_pic_url?: string | null;
  };
  media: Array<{
    id: string;
    media_type: string;
    cdn_url: string;
    thumbnail_url?: string;
  }>;
  giftAmount: number;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

const BoardSlugWishes: React.FC<BoardSlugWishesProps> = ({
  boardId,
  boardTitle = '',
  boardSlug,
  refreshKey
}) => {
  const router = useRouter();
  const [wishes, setWishes] = useState<WishWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likingWishId, setLikingWishId] = useState<string | null>(null);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
  const [selectedWish, setSelectedWish] = useState<WishWithDetails | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await authService.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    const fetchWishes = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getBoardWishes(boardId, currentUserId || undefined);

        if (fetchError) {
          setError('Failed to load wishes');
        } else {

          setWishes(data || []);
        }
      } catch (err) {
        setError('Failed to load wishes');
      } finally {
        setLoading(false);
      }
    };

    fetchWishes();
  }, [boardId, refreshKey, currentUserId]);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} Minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} Hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} Day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFirstVideo = (media: WishWithDetails['media']) => {
    return media.find(m => m.media_type === 'video');
  };

  const getFirstImage = (media: WishWithDetails['media']) => {
    return media.find(m => m.media_type === 'image');
  };

  const handleUserClick = (userId: string) => {
    router.push(`/u/visitProfile/${userId}`);
  };

  const handleCommentClick = (wish: WishWithDetails) => {
    setSelectedWishId(wish.id);
    setSelectedWish(wish);
    setCommentsModalOpen(true);
  };

  const handleCommentsModalClose = () => {
    setCommentsModalOpen(false);
    setSelectedWishId(null);
    setSelectedWish(null);

    if (boardId) {
      const fetchWishes = async () => {
        try {
          const { data } = await getBoardWishes(boardId, currentUserId || undefined);
          if (data) {
            setWishes(data);
          }
        } catch (err) {
        }
      };
      fetchWishes();
    }
  };

  const handleLikeClick = async (wishId: string, currentlyLiked: boolean) => {
    if (!currentUserId) {
      router.push('/signin');
      return;
    }

    if (likingWishId === wishId) return;

    setLikingWishId(wishId);

    try {
      let result;
      if (currentlyLiked) {
        result = await unlikeWish(wishId);
      } else {
        result = await likeWish(wishId);
      }

      if (result.error) {
        return;
      }

      setWishes(prevWishes =>
        prevWishes.map(wish => {
          if (wish.id === wishId) {
            return {
              ...wish,
              isLiked: !currentlyLiked,
              likesCount: currentlyLiked
                ? Math.max(0, wish.likesCount - 1)
                : wish.likesCount + 1,
            };
          }
          return wish;
        })
      );
    } catch (err) {
    } finally {
      setLikingWishId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonFeedCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No wishes yet. Be the first to wish!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {wishes.map((wish) => {
        const firstVideo = getFirstVideo(wish.media);
        const firstImage = getFirstImage(wish.media);
        const videoThumbnail = firstVideo?.thumbnail_url || firstVideo?.cdn_url || '';
        const videoUrl = firstVideo?.cdn_url || '';
        const hasMedia = wish.media.length > 0;
        const mediaItems = wish.media.map(m => ({
          type: m.media_type as 'image' | 'video',
          url: m.cdn_url,
          thumbnail: m.thumbnail_url || (m.media_type === 'video' ? m.cdn_url : undefined),
        }));

        const contentLines = wish.content.split('\n').filter(line => line.trim());
        const firstLine = contentLines[0] || '';
        const title = firstLine.length > 50
          ? firstLine.substring(0, 50) + '...'
          : (firstLine || boardTitle || 'Birthday Wish');
        const description = contentLines.length > 1
          ? contentLines.slice(1).join(' ').trim()
          : (firstLine.length > 50 ? firstLine.substring(50).trim() : '');

        return (
          <FeedCard
            key={wish.id}
            userName={wish.sender.name}
            userAvatar={wish.sender.profile_pic_url || undefined}
            timestamp={formatTimeAgo(wish.created_at)}
            onUserClick={() => handleUserClick(wish.sender.id)}
            layout={hasMedia && firstVideo ? 'horizontal' : 'carousel'}
            videoThumbnail={videoThumbnail}
            videoUrl={videoUrl}
            title={title}
            description={description || wish.content}
            actionTag={wish.giftAmount > 0 ? `Gifted : $${wish.giftAmount}` : undefined}
            mediaItems={mediaItems}
            thumbnailImage={firstImage?.cdn_url}
            likes={wish.likesCount || 0}
            isLiked={wish.isLiked || false}
            onLikeClick={() => handleLikeClick(wish.id, wish.isLiked || false)}
            comments={wish.commentsCount || 0}
            onCommentClick={() => handleCommentClick(wish)}
            shares={0}
            memories={0}
            boardSlug={boardSlug}
            boardId={boardId}
          />
        );
      })}

      {}
      <ModalOrBottomSlider
        isOpen={commentsModalOpen && !!selectedWishId && !!selectedWish}
        onClose={handleCommentsModalClose}
        title="Comments"
        desktopClassName="max-w-2xl"
        contentClassName="!p-0 flex flex-col min-h-0"
      >
        {selectedWishId && selectedWish ? (
          <WishCommentsModalContent
            key={selectedWishId}
            wishId={selectedWishId}
            wishContent={selectedWish.content}
            wishAuthor={{
              id: selectedWish.sender.id,
              name: selectedWish.sender.name,
              avatar: selectedWish.sender.profile_pic_url || undefined,
            }}
          />
        ) : null}
      </ModalOrBottomSlider>
    </div>
  );
};

export default BoardSlugWishes;
