'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Likes_1 from "@/assets/pngs/likes-1.svg";
import Likes_2 from "@/assets/pngs/Likes-2.svg";
import Likes_3 from "@/assets/pngs/Likes-3.svg";
import Likes_4 from "@/assets/pngs/Likes-4.svg";
import Likes_5 from "@/assets/pngs/Likes-5.svg";
import Likes_6 from "@/assets/pngs/Likes-6.svg";
import LikeAvatar from "@/assets/svgs/likes-ava-1.svg";
import LikeAvatar2 from "@/assets/svgs/avatar-list-icon-1.svg";
import { useRouter } from 'next/navigation';
import LikesCommentsGiftsCard from '@/components/cards/LikesCommentsGiftsCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import { createClient } from '@/lib/supabase/client';
import { unlikeWish } from '@/lib/supabase/boards';
import { getUserWishLikes, UserWishLikeRpcItem } from '@/lib/supabase/likes';
import { ArrowLeft } from 'lucide-react';
import MobileHeader from '@/components/navbar/MobileHeader';
import { SkeletonLikeCard } from '@/components/skeletons';

const PAGE_SIZE = 10;

type UiLikeItem = {
  id: string;
  wishId: string | null;
  /** Underlying board id so the card can navigate to the board detail page. */
  boardId: string | null;
  imgSrc: string | StaticImport;
  whoLikeAvatar: string | StaticImport;
  name: string;
  time: string;
  creator: any;
  wishMessage: string;
};

const fallbackWishImages = [Likes_1, Likes_2, Likes_3, Likes_4, Likes_5, Likes_6];
const fallbackAvatars = [LikeAvatar, LikeAvatar2];

const pickString = (obj: any, keys: string[]): string | null => {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
};

const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'now';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'now';

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return 'now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
  return `${Math.floor(diffSeconds / 86400)}d`;
};

const mapRpcItemToUi = (item: UserWishLikeRpcItem, index: number): UiLikeItem => {
  const board = item.board ?? {};
  const like = item.like ?? {};
  const wish = item.wish ?? {};
  const liker = like.user ?? like.liker ?? item.liker ?? item.creator ?? item.profiles ?? {};

  const wishId =
    pickString(wish, ['id']) ??
    pickString(item, ['wish_id']) ??
    null;

  const boardId =
    pickString(board, ['id', 'board_id']) ??
    pickString(wish, ['board_id']) ??
    pickString(item, ['board_id']) ??
    null;

  const id =
    wishId ??
    pickString(like, ['id']) ??
    pickString(item, ['id', 'like_id']) ??
    `wish-like-${index}`;

  const imgSrc =
    pickString(board, ['cover_image_url', 'image_url', 'cover_image']) ??
    pickString((board as any).honoree_details, ['profile_photo_url']) ??
    pickString(wish, ['image_url', 'media_url', 'cover_image_url']) ??
    pickString(item, ['wish_image_url', 'image_url', 'wish_media_url', 'media_url', 'cover_image_url']) ??
    fallbackWishImages[index % fallbackWishImages.length];

  const whoLikeAvatar =
    pickString(liker, ['profile_pic_url', 'avatar_url', 'profile_photo_url']) ??
    pickString(like, ['profile_pic_url', 'avatar_url']) ??
    pickString(item, ['liker_avatar_url', 'liker_profile_pic_url', 'avatar_url', 'profile_pic_url']) ??
    fallbackAvatars[index % fallbackAvatars.length];

  const boardCreator = (board as any).creator ?? (board as any).profiles ?? {};
  const boardHonoree = (board as any).honoree_details ?? {};

  const name =
    pickString(liker, ['name', 'full_name', 'display_name']) ??
    pickString(boardCreator, ['name', 'full_name']) ??
    pickString(like, ['name', 'liker_name']) ??
    pickString(item, ['liker_name', 'sender_name', 'creator_name', 'name', 'full_name']) ??
    'Unknown';

  const boardTitle =
    pickString(board, ['title']) ?? '';

  const wishMessage =
    pickString(wish, ['content', 'message', 'wish_message']) ??
    pickString(item, ['wish_message', 'wish_content', 'message', 'content']) ??
    pickString(board, ['description', 'title']) ??
    'No wish message available.';

  const time = formatRelativeTime(
    pickString(like, ['created_at', 'liked_at']) ??
    pickString(item, ['liked_at', 'created_at', 'updated_at'])
  );

  return {
    id,
    wishId,
    boardId,
    imgSrc,
    whoLikeAvatar,
    creator: {
      name,
      title: boardTitle,
      profile_pic_url: whoLikeAvatar,
      board,
      like,
      wish,
      honoree_details: boardHonoree,
      boardCreator,
    },
    name,
    time,
    wishMessage,
  };
};

const LikesPage = () => {
  const [likes, setLikes] = useState<UiLikeItem[]>([]);
  // `isLoading` starts as `true` because we kick off auth + fetchLikes as soon
  // as the component mounts. Starting at `false` caused the empty state ("No
  // likes found yet.") to flash briefly on first paint before the loader ran.
  const [isLoading, setIsLoading] = useState(true);
  /**
   * Guards the empty state so "No likes found yet." only appears after we've
   * actually completed a fetch. Without this, any transient `isLoading=false`
   * window between effects (auth resolve → fetchLikes start) shows the empty
   * message with no data yet.
   */
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [unlikingWishId, setUnlikingWishId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchLikes = useCallback(async (nextOffset: number, append: boolean) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    const { data, error: likesError } = await getUserWishLikes(userId, PAGE_SIZE, nextOffset);

    if (likesError) {
      setError(likesError.message || 'Failed to fetch likes.');
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    const mappedLikes = (data ?? []).map((item, index) => mapRpcItemToUi(item, nextOffset + index));
    setLikes((prev) => (append ? [...prev, ...mappedLikes] : mappedLikes));
    setHasMore(mappedLikes.length === PAGE_SIZE);
    setOffset(nextOffset + mappedLikes.length);
    setIsLoading(false);
    setHasLoaded(true);
  }, [userId]);

  useEffect(() => {
    const initializeLikes = async () => {
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError || !data?.user?.id) {
        setError('Unable to identify current user.');
        setIsLoading(false);
        setHasLoaded(true);
        return;
      }

      // Keep `isLoading` true here — the `userId`-dependent effect below will
      // immediately call `fetchLikes`, which keeps the skeleton on screen
      // continuously from first paint through the initial data load.
      setUserId(data.user.id);
    };

    void initializeLikes();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    void fetchLikes(0, false);
  }, [userId, fetchLikes]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    await fetchLikes(offset, true);
  };

  const handleUnlike = useCallback(async (wishId: string) => {
    if (unlikingWishId) return;
    setUnlikingWishId(wishId);
    setError(null);
    const { error: unlikeErr } = await unlikeWish(wishId);
    if (unlikeErr) {
      const msg =
        typeof unlikeErr === 'object' && unlikeErr !== null && 'message' in unlikeErr
          ? String((unlikeErr as { message?: string }).message)
          : 'Could not remove like.';
      setError(msg);
      setUnlikingWishId(null);
      return;
    }
    setLikes((prev) => prev.filter((l) => l.wishId !== wishId));
    setUnlikingWishId(null);
  }, [unlikingWishId]);

  const router = useRouter();

  return (
    <>
      <DashNavbar />
      <MobileHeader
        title="Likes"
        showBack
        onBackClick={() => router.push('/u/profile')}
      />
      <div className="px-[7%] max-[769px]:px-6 py-4">
        <div className="max-[769px]:hidden flex justify-between items-center">
          <button onClick={() => router.push('/u/profile')} className="flex items-center gap-2 text-black">
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Likes</span>
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {!error && hasLoaded && !isLoading && likes.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No likes found yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {likes.map((like) => (
            <LikesCommentsGiftsCard
              key={like.id}
              imgSrc={like.imgSrc}
              whoLikeAvatar={like.whoLikeAvatar}
              name={like.creator?.name || like.name}
              time={like.time}
              wishMessage={like.wishMessage}
              onUnlike={
                like.wishId ? () => void handleUnlike(like.wishId as string) : undefined
              }
              isUnliking={like.wishId != null && unlikingWishId === like.wishId}
              onCardClick={
                like.boardId ? () => router.push(`/u/boards/${like.boardId}`) : undefined
              }
            />
          ))}
          {isLoading &&
            Array.from({ length: likes.length === 0 ? 6 : 3 }).map((_, i) => (
              <SkeletonLikeCard key={`skeleton-${i}`} />
            ))}
        </div>

        <div className='flex justify-center'>
          {!isLoading && hasMore && likes.length > 0 && (
            <button
              type="button"
              onClick={handleLoadMore}
              className="mt-6 px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LikesPage;