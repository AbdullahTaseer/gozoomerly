import { createClient } from './client';

export interface UserWishLikeRpcItem {
  wish_id?: string;
  id?: string;
  like_id?: string;
  wish_image_url?: string | null;
  image_url?: string | null;
  wish_media_url?: string | null;
  media_url?: string | null;
  cover_image_url?: string | null;
  wish_avatar_url?: string | null;
  profile_pic_url?: string | null;
  liker_avatar_url?: string | null;
  liker_profile_pic_url?: string | null;
  avatar_url?: string | null;
  liker_name?: string | null;
  full_name?: string | null;
  name?: string | null;
  liker_full_name?: string | null;
  liked_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  wish_message?: string | null;
  content?: string | null;
  message?: string | null;
  wish_content?: string | null;
  [key: string]: any;
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
  [key: string]: any;
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

  if (Array.isArray(data)) {
    return { data: data as UserWishLikeRpcItem[], error: null };
  }

  if (data && typeof data === 'object') {
    const nested =
      (data as any).data?.likes ||
      (data as any).data?.items ||
      (data as any).data ||
      (data as any).likes ||
      (data as any).items;
    if (Array.isArray(nested)) {
      return { data: nested as UserWishLikeRpcItem[], error: null };
    }
  }

  return { data: [], error: null };
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

  console.log('[getUserWishComments] raw RPC response:', data);

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (Array.isArray(data)) {
    return { data: data as UserWishCommentRpcItem[], error: null };
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    console.log('[getUserWishComments] response is object with keys:', keys);

    for (const key of keys) {
      const val = (data as any)[key];
      if (Array.isArray(val)) {
        console.log('[getUserWishComments] found array at key:', key, 'length:', val.length);
        return { data: val as UserWishCommentRpcItem[], error: null };
      }
    }

    const nested =
      (data as any).data?.comments ||
      (data as any).data?.items ||
      (data as any).data ||
      (data as any).comments ||
      (data as any).items;
    if (Array.isArray(nested)) {
      return { data: nested as UserWishCommentRpcItem[], error: null };
    }
  }

  return { data: [], error: null };
}
