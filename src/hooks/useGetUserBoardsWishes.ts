import { useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';

export interface WishMedia {
  id: string;
  url: string;
  media_type: 'image' | 'video' | 'audio';
  thumbnail_url?: string;
}

export interface WishUser {
  id: string;
  name: string;
  profile_pic_url?: string;
  is_verified?: boolean;
}

export interface BoardWish {
  wish_id: string;
  board_id: string;
  board_title: string;
  board_slug: string;
  content: string;
  tag?: string;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  likes_count: number;
  comments_count: number;
  gift_amount?: number;
  media: WishMedia[];
  wisher: WishUser;
  honoree_details?: {
    first_name?: string;
    last_name?: string;
    profile_photo_url?: string;
  };
}

export interface GetUserBoardsWishesInput {
  p_board_ids?: string[] | null;
  p_media_type?: 'image' | 'video' | 'audio' | null;
  p_tag?: string | null;
  p_search?: string | null;
  p_date_from?: string | null;
  p_date_to?: string | null;
  p_only_featured?: boolean;
  p_only_pinned?: boolean;
  p_min_likes?: number;
  p_min_comments?: number;
  p_cursor_created_at?: string | null;
  p_cursor_id?: string | null;
  p_limit?: number;
}

interface UseGetUserBoardsWishesReturn {
  wishes: BoardWish[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchWishes: (params: GetUserBoardsWishesInput) => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetUserBoardsWishes = (): UseGetUserBoardsWishesReturn => {
  const [wishes, setWishes] = useState<BoardWish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastParams, setLastParams] = useState<GetUserBoardsWishesInput | null>(null);
  const [lastCursor, setLastCursor] = useState<{ created_at: string; id: string } | null>(null);

  const fetchWishes = useCallback(async (params: GetUserBoardsWishesInput) => {
    setIsLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const supabase = createClient();

      const rpcParams = {
        p_board_ids: params.p_board_ids || null,
        p_media_type: params.p_media_type || null,
        p_tag: params.p_tag || null,
        p_search: params.p_search || null,
        p_date_from: params.p_date_from || null,
        p_date_to: params.p_date_to || null,
        p_only_featured: params.p_only_featured || false,
        p_only_pinned: params.p_only_pinned || false,
        p_min_likes: params.p_min_likes || 0,
        p_min_comments: params.p_min_comments || 0,
        p_cursor_created_at: params.p_cursor_created_at || null,
        p_cursor_id: params.p_cursor_id || null,
        p_limit: params.p_limit || 10,
      };

      const { data, error: rpcError } = await supabase.rpc('get_user_boards_wishes', rpcParams);

      if (rpcError) {
        const errorMessage = rpcError.message || 'Failed to fetch wishes';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (data) {
        const wishesData = data.data?.wishes || data.wishes || data.data || data || [];
        const wishesArray = Array.isArray(wishesData) ? wishesData : [];

        if (!params.p_cursor_created_at && !params.p_cursor_id) {
          setWishes(wishesArray);
        } else {
          setWishes(prev => [...prev, ...wishesArray]);
        }

        if (wishesArray.length > 0) {
          const lastWish = wishesArray[wishesArray.length - 1];
          setLastCursor({
            created_at: lastWish.created_at,
            id: lastWish.wish_id
          });
          setHasMore(wishesArray.length >= (params.p_limit || 10));
        } else {
          setHasMore(false);
        }
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wishes';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastParams || !lastCursor || isLoading) return;

    await fetchWishes({
      ...lastParams,
      p_cursor_created_at: lastCursor.created_at,
      p_cursor_id: lastCursor.id
    });
  }, [lastParams, lastCursor, isLoading, fetchWishes]);

  const refetch = useCallback(async () => {
    if (lastParams) {
      setLastCursor(null);
      await fetchWishes({
        ...lastParams,
        p_cursor_created_at: null,
        p_cursor_id: null
      });
    }
  }, [lastParams, fetchWishes]);

  return {
    wishes,
    isLoading,
    error,
    hasMore,
    fetchWishes,
    loadMore,
    refetch
  };
};
