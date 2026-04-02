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
import { getUserWishComments, UserWishCommentRpcItem } from '@/lib/supabase/likes';

const PAGE_SIZE = 10;

type UiCommentItem = {
  id: string;
  imgSrc: string | StaticImport;
  whoLikeAvatar: string | StaticImport;
  name: string;
  time: string;
  wishMessage: string;
  whoCommentsAvatar: string | StaticImport;
  whoCommentsName: string;
  comment: string;
  creator: any;
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

const mapRpcItemToUi = (item: UserWishCommentRpcItem, index: number): UiCommentItem => {
  const board = item.board ?? {};
  const commentObj = (typeof item.comment === 'object' && item.comment !== null) ? item.comment : {};
  const wish = item.wish ?? {};
  const commentAuthor = (commentObj as any).author ?? {};
  const commentProfiles = (commentObj as any).profiles ?? {};
  const commentUser = (commentObj as any).user ?? {};
  const commenter = commentAuthor ?? (commentObj as any).commenter ?? commentProfiles ?? commentUser ?? item.commenter ?? item.creator ?? item.user ?? item.profiles ?? {};
  const boardCreator = (board as any).creator ?? (board as any).profiles ?? {};
  const boardHonoree = (board as any).honoree_details ?? {};
  const wishProfiles = (wish as any).profiles ?? (wish as any).user ?? {};

  const id =
    pickString(commentObj, ['id']) ??
    pickString(item, ['comment_id', 'wish_id', 'id']) ??
    `wish-comment-${index}`;

  const imgSrc =
    pickString(board, ['cover_image_url', 'image_url', 'cover_image']) ??
    pickString(boardHonoree, ['profile_photo_url']) ??
    pickString(wish, ['image_url', 'media_url', 'cover_image_url']) ??
    pickString(item, ['wish_image_url', 'image_url', 'wish_media_url', 'media_url', 'cover_image_url']) ??
    fallbackWishImages[index % fallbackWishImages.length];

  const wishAvatar =
    pickString(boardHonoree, ['profile_photo_url']) ??
    pickString(boardCreator, ['profile_pic_url', 'avatar_url']) ??
    pickString(item, ['wish_avatar_url', 'profile_pic_url']) ??
    fallbackAvatars[index % fallbackAvatars.length];

  const commentAvatar =
    pickString(commentAuthor, ['profile_pic_url', 'avatar_url', 'profile_photo_url']) ??
    pickString(commenter, ['profile_pic_url', 'avatar_url', 'profile_photo_url']) ??
    pickString(commentProfiles, ['profile_pic_url', 'avatar_url', 'profile_photo_url']) ??
    pickString(commentObj, ['profile_pic_url', 'avatar_url', 'commenter_avatar_url']) ??
    pickString(item, ['commenter_avatar_url', 'profile_pic_url']) ??
    fallbackAvatars[(index + 1) % fallbackAvatars.length];

  const name =
    pickString(boardCreator, ['name', 'full_name']) ??
    pickString(boardHonoree, ['full_name', 'name']) ??
    pickString(wishProfiles, ['full_name', 'name']) ??
    pickString(board, ['title']) ??
    pickString(item, ['commenter_name', 'commenter_full_name', 'full_name', 'name']) ??
    'Unknown';

  const whoCommentsName =
    pickString(commentAuthor, ['name', 'full_name', 'display_name']) ??
    pickString(commenter, ['name', 'full_name', 'display_name']) ??
    pickString(commentProfiles, ['full_name', 'name', 'display_name']) ??
    pickString(commentObj, ['commenter_name', 'user_name', 'full_name', 'name', 'author_name']) ??
    pickString(item, ['commenter_name', 'commenter_full_name', 'full_name']) ??
    'Unknown';

  const wishMessage =
    pickString(wish, ['content', 'message', 'wish_message']) ??
    pickString(item, ['wish_message', 'wish_content']) ??
    pickString(board, ['description', 'title']) ??
    'No wish message available.';

  const comment =
    pickString(commentObj, ['content', 'text', 'comment', 'comment_text', 'message']) ??
    (typeof item.comment === 'string' ? item.comment : null) ??
    pickString(item, ['comment_text']) ??
    '';

  const time = formatRelativeTime(
    pickString(commentObj, ['created_at', 'commented_at']) ??
    pickString(item, ['commented_at', 'created_at'])
  );

  return {
    id,
    imgSrc,
    whoLikeAvatar: wishAvatar,
    name,
    time,
    wishMessage,
    whoCommentsAvatar: commentAvatar,
    whoCommentsName,
    comment,
    creator: {
      name,
      title: pickString(board, ['title']) ?? '',
      profile_pic_url: wishAvatar,
      board,
      wish,
      comment: commentObj,
      commenter,
      honoree_details: boardHonoree,
      boardCreator,
    },
  };
};

const CommentsPage = () => {
  const [comments, setComments] = useState<UiCommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchComments = useCallback(async (nextOffset: number, append: boolean) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    const { data, error: commentsError } = await getUserWishComments(userId, PAGE_SIZE, nextOffset);

    console.log('[Comments] raw data length:', data?.length, 'data:', data);
    if (data && data.length > 0) {
      const first = data[0];
      console.log('[Comments] first item keys:', Object.keys(first));
      console.log('[Comments] first item.comment (full):', JSON.stringify(first.comment, null, 2));
      console.log('[Comments] first item.board (full):', JSON.stringify(first.board, null, 2));
      console.log('[Comments] first item.wish (full):', JSON.stringify(first.wish, null, 2));
    }

    if (commentsError) {
      setError(commentsError.message || 'Failed to fetch comments.');
      setIsLoading(false);
      return;
    }

    const mappedComments = (data ?? []).map((item, index) => mapRpcItemToUi(item, nextOffset + index));
    console.log('[Comments] mapped comments count:', mappedComments.length);
    if (mappedComments.length > 0) {
      console.log('[Comments] first mapped item:', mappedComments[0]);
    }
    setComments((prev) => (append ? [...prev, ...mappedComments] : mappedComments));
    setHasMore(mappedComments.length === PAGE_SIZE);
    setOffset(nextOffset + mappedComments.length);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    const initializeComments = async () => {
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

    void initializeComments();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    void fetchComments(0, false);
  }, [userId, fetchComments]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    await fetchComments(offset, true);
  };

  return (
    <>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[768px]:px-6 pb-4">
        <TitleCard title="Comments" className="text-left" />

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {!error && !isLoading && comments.length === 0 && (
          <p className="text-gray-500 mt-4">No comments found yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {comments.map((commentItem) => (
            <LikesCommentsGiftsCard
              key={commentItem.id}
              imgSrc={commentItem.imgSrc}
              whoLikeAvatar={commentItem.whoLikeAvatar}
              name={commentItem.creator?.name || commentItem.name}
              time={commentItem.time}
              wishMessage={commentItem.wishMessage}
              whoCommentsAvatar={commentItem.whoCommentsAvatar}
              whoCommentsName={commentItem.whoCommentsName}
              comment={commentItem.comment}
            />
          ))}
        </div>

        {isLoading && (
          <p className="text-gray-500 mt-4">Loading comments...</p>
        )}

        {!isLoading && hasMore && comments.length > 0 && (
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

export default CommentsPage;