'use client';

import {  useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import FeedCard from '@/components/cards/FeedCard';
import WishCommentsModalContent from '@/components/cards/WishCommentsModal';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import { getBoardMemories, likeWish, unlikeWish, type BoardMemory } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { SkeletonFeedCard } from '@/components/skeletons';

interface BoardSlugMemoriesProps {
  boardId: string;
  boardTitle?: string;
  boardSlug?: string;
  refreshKey?: number | string;
}

interface MemoryWithDetails extends BoardMemory {
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

const BoardSlugMemories: React.FC<BoardSlugMemoriesProps> = ({
  boardId,
  boardTitle = '',
  boardSlug,
  refreshKey
}) => {
  const router = useRouter();
  const [memories, setMemories] = useState<MemoryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likingWishId, setLikingWishId] = useState<string | null>(null);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryWithDetails | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;

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

    fetchMemories();
  }, [boardId, refreshKey, currentUserId]);

  const fetchMemories = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setError(null);
        setOffset(0);
      }

      const currentOffset = loadMore ? offset : 0;
      const { data, error: fetchError } = await getBoardMemories(boardId, {
        limit,
        offset: currentOffset,
      });

      if (fetchError) {
        setError('Failed to load memories');
      } else if (data?.data) {
        const responseData = data.data;

        const wishIds = responseData.memories.map((m: BoardMemory) => m.wish_id);
        let userLikesSet: Set<string> = new Set();

        if (currentUserId && wishIds.length > 0) {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: likesData } = await supabase
            .from('wish_likes')
            .select('wish_id')
            .in('wish_id', wishIds)
            .eq('user_id', currentUserId);

          if (likesData) {
            likesData.forEach((like: any) => {
              userLikesSet.add(like.wish_id);
            });
          }
        }

        const memoriesWithDetails: MemoryWithDetails[] = responseData.memories.map((memory: BoardMemory) => ({
          ...memory,
          likesCount: memory.likes_count || 0,
          isLiked: userLikesSet.has(memory.wish_id),
          commentsCount: memory.comments_count || 0,
        }));

        if (loadMore) {
          setMemories(prev => [...prev, ...memoriesWithDetails]);
        } else {
          setMemories(memoriesWithDetails);
        }

        setHasMore(responseData.pagination.has_more);
        setOffset(currentOffset + memoriesWithDetails.length);
      }
    } catch (err) {
      setError('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

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

  const getFirstVideo = (media: BoardMemory['media']) => {
    return media.find(m => m.media_type === 'video');
  };

  const getFirstImage = (media: BoardMemory['media']) => {
    return media.find(m => m.media_type === 'image');
  };

  const handleUserClick = (userId: string) => {
    router.push(`/u/visitProfile/${userId}`);
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

      setMemories(prevMemories =>
        prevMemories.map(memory => {
          if (memory.wish_id === wishId) {
            return {
              ...memory,
              isLiked: !currentlyLiked,
              likesCount: currentlyLiked
                ? Math.max(0, memory.likesCount - 1)
                : memory.likesCount + 1,
            };
          }
          return memory;
        })
      );
    } catch (err) {
    } finally {
      setLikingWishId(null);
    }
  };

  const handleCommentClick = (memory: MemoryWithDetails) => {
    setSelectedWishId(memory.wish_id);
    setSelectedMemory(memory);
    setCommentsModalOpen(true);
  };

  const handleCommentsModalClose = () => {
    setCommentsModalOpen(false);
    setSelectedWishId(null);
    setSelectedMemory(null);

    if (boardId) {
      fetchMemories(false);
    }
  };

  if (loading && memories.length === 0) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonFeedCard key={i} />
        ))}
      </div>
    );
  }

  if (error && memories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No memories yet. Be the first to share a memory!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {memories.map((memory) => {
        const firstVideo = getFirstVideo(memory.media);
        const firstImage = getFirstImage(memory.media);
        const videoThumbnail = firstVideo?.thumbnails || firstVideo?.url || '';
        const videoUrl = firstVideo?.url || '';
        const hasMedia = memory.media.length > 0;

        const mediaItems = memory.media
          .filter(m => m.media_type === 'image' || m.media_type === 'video')
          .map(m => ({
            type: (m.media_type === 'image' ? 'image' : 'video') as 'image' | 'video',
            url: m.url,
            thumbnail: m.thumbnails || (m.media_type === 'video' ? m.url : undefined),
          }));

        return (
          <FeedCard
            key={memory.wish_id}
            userName={memory.wisher.name}
            userAvatar={memory.wisher.profile_pic_url || undefined}
            timestamp={formatTimeAgo(memory.created_at)}
            onUserClick={() => handleUserClick(memory.wisher.id)}
            layout={hasMedia && firstVideo ? 'horizontal' : 'carousel'}
            videoThumbnail={videoThumbnail}
            videoUrl={videoUrl}
            title=""
            description=""
            mediaItems={mediaItems}
            likes={memory.likesCount || 0}
            isLiked={memory.isLiked || false}
            onLikeClick={() => handleLikeClick(memory.wish_id, memory.isLiked || false)}
            comments={memory.commentsCount || 0}
            onCommentClick={() => handleCommentClick(memory)}
            shares={0}
            memories={0}
            showOnlyLikeAndComment={true}
            boardSlug={boardSlug}
            boardId={boardId}
          />
        );
      })}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => fetchMemories(true)}
            disabled={loading}
            className="text-pink-500 hover:text-pink-600 font-medium text-sm disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Memories'}
          </button>
        </div>
      )}

      {}
      <ModalOrBottomSlider
        isOpen={commentsModalOpen && !!selectedWishId && !!selectedMemory}
        onClose={handleCommentsModalClose}
        title="Comments"
        desktopClassName="max-w-2xl"
        contentClassName="!p-0 flex flex-col min-h-0"
      >
        {selectedWishId && selectedMemory ? (
          <WishCommentsModalContent
            key={selectedWishId}
            wishId={selectedWishId}
            wishContent={selectedMemory.content}
            wishAuthor={{
              id: selectedMemory.wisher.id,
              name: selectedMemory.wisher.name,
              avatar: selectedMemory.wisher.profile_pic_url || undefined,
            }}
          />
        ) : null}
      </ModalOrBottomSlider>
    </div>
  );
};

export default BoardSlugMemories;
