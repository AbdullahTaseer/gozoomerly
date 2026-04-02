import { useState, useCallback, useRef } from 'react';
import { createClient } from '../lib/supabase/client';
import { type Board } from '../lib/supabase/boards';

interface UseGetFollowingBoardsReturn {
  boards: Board[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  fetchBoards: (viewerId: string, limit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetFollowingBoards = (): UseGetFollowingBoardsReturn => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const viewerIdRef = useRef<string | null>(null);
  const limitRef = useRef(10);

  const mapResponseToBoards = (data: any[]): Board[] => {
    return data.map((item: any) => {
      const honoree = item.honoree_details || {};
      const profilePhotoUrl =
        honoree.profile_photo_url ||
        item.honoree_profile_photo_url ||
        null;

      const honoreeDetails = {
        first_name: honoree.first_name || item.honoree_first_name || '',
        last_name: honoree.last_name || item.honoree_last_name || '',
        date_of_birth: honoree.date_of_birth || item.honoree_date_of_birth || '',
        hometown: honoree.hometown || item.honoree_hometown || '',
        phone: honoree.phone || '',
        email: honoree.email || '',
        profile_photo_url: profilePhotoUrl,
        theme_color: honoree.theme_color || '',
      };

      const media: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }> = [];

      if (Array.isArray(item.media)) {
        item.media.forEach((m: any) => {
          const mType = (m.media_type === 'video') ? 'video' : 'image';
          media.push({
            type: mType,
            url: m.cdn_url || m.url || '',
            thumbnail: m.thumbnail_url || m.thumbnails?.small || undefined,
          });
        });
      }
      if (Array.isArray(item.photos)) {
        item.photos.forEach((p: any) => {
          media.push({
            type: 'image',
            url: p.cdn_url || p.url || '',
            thumbnail: p.thumbnail_url || undefined,
          });
        });
      }
      if (Array.isArray(item.videos)) {
        item.videos.forEach((v: any) => {
          media.push({
            type: 'video',
            url: v.cdn_url || v.url || '',
            thumbnail: v.thumbnail_url || undefined,
          });
        });
      }
      if (Array.isArray(item.recent_media)) {
        item.recent_media.forEach((m: any) => {
          const mType = (m.media_type === 'video') ? 'video' : 'image';
          media.push({
            type: mType,
            url: m.cdn_url || m.url || '',
            thumbnail: m.thumbnail_url || m.thumbnails?.small || undefined,
          });
        });
      }

      return {
        id: item.id || item.board_id,
        creator_id: item.creator_id,
        board_type_id: item.board_type_id,
        title: item.title || '',
        slug: item.slug || '',
        description: item.description || '',
        honoree_details: honoreeDetails,
        cover_media_id: item.cover_media_id,
        cover_image: item.cover_image || null,
        cover_image_url: item.cover_image_url || item.cover_image?.url || profilePhotoUrl || null,
        goal_type: item.goal_type || 'nonmonetary',
        goal_amount: item.goal_amount || 0,
        currency: item.currency || 'USD',
        deadline_date: item.deadline_date,
        privacy: item.privacy || 'public',
        allow_invites: item.allow_invites ?? true,
        invites_can_invite: item.invites_can_invite ?? false,
        status: item.status || 'live',
        published_at: item.published_at,
        total_raised: item.total_raised || 0,
        contributors_count: item.contributors_count || 0,
        wishes_count: item.wishes_count || 0,
        participants_count: item.participants_count || 0,
        gifters_count: item.gifters_count || 0,
        media_count: item.media_count || item.memories_count || 0,
        views_count: item.views_count || 0,
        shares_count: item.shares_count || 0,
        last_activity_at: item.last_activity_at,
        meta_tags: item.meta_tags,
        created_at: item.created_at,
        updated_at: item.updated_at,
        deleted_at: item.deleted_at,
        profiles: item.creator
          ? {
              id: item.creator.id,
              name: item.creator.name,
              profile_pic_url: item.creator.profile_pic_url,
            }
          : item.profiles || null,
        board_types: item.board_type || item.board_types || null,
        creator: item.creator,
        board_media: media,
      };
    });
  };

  const fetchBoards = useCallback(async (viewerId: string, limit = 10) => {
    setIsLoading(true);
    setError(null);
    viewerIdRef.current = viewerId;
    limitRef.current = limit;
    offsetRef.current = 0;

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        'get_boards_from_followed_creators',
        {
          p_viewer_id: viewerId,
          p_limit: limit,
          p_offset: 0,
        }
      );

      if (rpcError) {
        setError(rpcError.message || 'Failed to fetch following boards');
        setBoards([]);
        return;
      }

      const boardsArray = Array.isArray(data)
        ? data
        : data?.data?.boards || data?.data || data?.boards || [];

      const mapped = mapResponseToBoards(boardsArray);
      setBoards(mapped);
      offsetRef.current = mapped.length;
      setHasMore(mapped.length >= limit);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch following boards';
      setError(message);
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!viewerIdRef.current || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        'get_boards_from_followed_creators',
        {
          p_viewer_id: viewerIdRef.current,
          p_limit: limitRef.current,
          p_offset: offsetRef.current,
        }
      );

      if (rpcError) {
        setError(rpcError.message || 'Failed to load more boards');
        return;
      }

      const boardsArray = Array.isArray(data)
        ? data
        : data?.data?.boards || data?.data || data?.boards || [];

      const mapped = mapResponseToBoards(boardsArray);
      setBoards((prev) => [...prev, ...mapped]);
      offsetRef.current += mapped.length;
      setHasMore(mapped.length >= limitRef.current);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load more boards';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  const refetch = useCallback(async () => {
    if (viewerIdRef.current) {
      await fetchBoards(viewerIdRef.current, limitRef.current);
    }
  }, [fetchBoards]);

  return {
    boards,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    fetchBoards,
    loadMore,
    refetch,
  };
};
