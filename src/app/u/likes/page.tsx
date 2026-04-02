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
import TitleCard from '@/components/cards/TitleCard';
import LikesCommentsGiftsCard from '@/components/cards/LikesCommentsGiftsCard';
import DashNavbar from '@/components/navbar/DashNavbar';
import { createClient } from '@/lib/supabase/client';
import { getUserWishLikes, UserWishLikeRpcItem } from '@/lib/supabase/likes';

const PAGE_SIZE = 10;

type UiLikeItem = {
  id: string;
  imgSrc: string | StaticImport;
  whoLikeAvatar: string | StaticImport;
  name: string;
  time: string;
  creator:any;
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

  const id =
    pickString(like, ['id']) ??
    pickString(item, ['wish_id', 'id', 'like_id']) ??
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchLikes = useCallback(async (nextOffset: number, append: boolean) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    const { data, error: likesError } = await getUserWishLikes(userId, PAGE_SIZE, nextOffset);
    console.log("🚀 ~ LikesPage ~ data:", data)

    if (likesError) {
      setError(likesError.message || 'Failed to fetch likes.');
      setIsLoading(false);
      return;
    }

    const mappedLikes = (data ?? []).map((item, index) => mapRpcItemToUi(item, nextOffset + index));
    setLikes((prev) => (append ? [...prev, ...mappedLikes] : mappedLikes));
    setHasMore(mappedLikes.length === PAGE_SIZE);
    setOffset(nextOffset + mappedLikes.length);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    const initializeLikes = async () => {
      setIsLoading(true);
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError || !data?.user?.id) {
        setError('Unable to identify current user.');
        setIsLoading(false);
        return;
      }

      setUserId(data.user.id);
      setIsLoading(false);
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

  return (
    <>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[768px]:px-6 pb-4">
        <TitleCard title="Likes" className="text-left" />

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {!error && !isLoading && likes.length === 0 && (
          <p className="text-gray-500 mt-4">No likes found yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {likes.map((like) => (
            <LikesCommentsGiftsCard
              key={like.id}
              imgSrc={like.imgSrc}
              whoLikeAvatar={like.whoLikeAvatar}
              name={like.creator?.name || like.name}
              time={like.time}
              wishMessage={like.wishMessage}
            />
          ))}
        </div>

        {isLoading && (
          <p className="text-gray-500 mt-4">Loading likes...</p>
        )}

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
    </>
  );
};

export default LikesPage;