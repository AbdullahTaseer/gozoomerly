import { createClient } from './client';

export interface UserWishLikeRpcItem {
  wish_id?: string;
  id?: string;
  wish_image_url?: string | null;
  image_url?: string | null;
  wish_media_url?: string | null;
  wish_avatar_url?: string | null;
  profile_pic_url?: string | null;
  liker_avatar_url?: string | null;
  liker_name?: string | null;
  full_name?: string | null;
  liked_at?: string | null;
  created_at?: string | null;
  wish_message?: string | null;
  content?: string | null;
}

export interface UserWishCommentRpcItem {
  wish_id?: string;
  id?: string;
  comment_id?: string;
  wish_image_url?: string | null;
  image_url?: string | null;
  wish_media_url?: string | null;
  wish_avatar_url?: string | null;
  profile_pic_url?: string | null;
  commenter_avatar_url?: string | null;
  commenter_name?: string | null;
  full_name?: string | null;
  commenter_full_name?: string | null;
  commented_at?: string | null;
  created_at?: string | null;
  wish_message?: string | null;
  content?: string | null;
  comment?: string | null;
  comment_text?: string | null;
}

export async function getUserWishLikes(
  userId: string,
  limit: number,
  offset: number
): Promise<{ data: UserWishLikeRpcItem[] | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_wish_likes', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!Array.isArray(data)) {
    return { data: [], error: null };
  }

  return { data: data as UserWishLikeRpcItem[], error: null };
}

export async function getUserWishComments(
  userId: string,
  limit: number,
  offset: number
): Promise<{ data: UserWishCommentRpcItem[] | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_wish_comments', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!Array.isArray(data)) {
    return { data: [], error: null };
  }

  return { data: data as UserWishCommentRpcItem[], error: null };
}
