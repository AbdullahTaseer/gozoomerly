import { useState, useCallback, useRef } from 'react';
import { createClient } from '../lib/supabase/client';

export interface PublicBoardMemberPreview {
  id: string;
  name: string;
  profile_pic_url: string | null;
}

export interface PublicBoard {
  id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  honoree_details: any;
  creator_id: string;
  creator: {
    id: string;
    name: string;
    profile_pic_url: string | null;
  } | null;
  status: string;
  privacy: string;
  deadline_date: string | null;
  wishes_count: number;
  contributors_count: number;
  views_count: number;
  shares_count: number;
  participants_count: number;
  total_members: number;
  member_previews: PublicBoardMemberPreview[];
  created_at: string;
  heightVariant?: 'tall' | 'medium' | 'short';
}

interface UseGetPublicBoardsReturn {
  boards: PublicBoard[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  fetchBoards: (limit?: number, memberPreviewLimit?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

function coerceToArray(value: unknown): any[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.startsWith('[') || t.startsWith('{')) {
      try {
        const parsed = JSON.parse(t);
        return Array.isArray(parsed) ? parsed : coerceToArray(parsed);
      } catch {
        return [];
      }
    }
    return [];
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as any[];
    if (Array.isArray(o.items)) return o.items as any[];
    if (Array.isArray(o.members)) return o.members as any[];
    if (Array.isArray(o.member_preview)) return o.member_preview as any[];
    if (Array.isArray(o.member_previews)) return o.member_previews as any[];
  }
  return [];
}

function extractRawMemberPreviewRows(item: any): any[] {
  const sources = [
    item.member_preview,
    item.member_previews,
    item.memberPreview,
    item.memberPreviews,
    item.members_preview,
    item.members,
    item.board_members,
    item.contributor_previews,
    item.contributors_preview,
    item.contributors,
    item.board?.member_preview,
    item.board?.member_previews,
    item.board?.members,
  ];

  for (const src of sources) {
    const arr = coerceToArray(src);
    if (arr.length > 0) return arr;
  }
  return [];
}

function firstString(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function mapMemberPreviewRow(m: any): PublicBoardMemberPreview {
  if (typeof m === 'string' && m.trim()) {
    return { id: '', name: '', profile_pic_url: m.trim() };
  }
  if (!m || typeof m !== 'object') {
    return { id: '', name: '', profile_pic_url: null };
  }

  const nested =
    m.user ||
    m.member ||
    m.profiles ||
    m.profile ||
    m.account ||
    {};

  const id =
    firstString(m.id, m.user_id, m.member_id, nested.id) || '';

  const name =
    firstString(
      m.name,
      m.full_name,
      m.display_name,
      m.username,
      nested.name,
      nested.full_name,
      nested.display_name
    ) || '';

  const profile_pic_url = firstString(
    m.profile_pic_url,
    m.profile_photo_url,
    m.avatar_url,
    m.Profile_Picture,
    m.photo_url,
    m.image_url,
    m.picture,
    m.thumbnail_url,
    m.cdn_url,
    m.url,
    nested.profile_pic_url,
    nested.profile_photo_url,
    nested.avatar_url,
    nested.Profile_Picture,
    nested.photo_url,
    nested.image_url
  );

  return { id, name, profile_pic_url };
}

function flattenBoardRpcRow(raw: any): any {
  if (!raw || typeof raw !== 'object') return raw;
  const b = raw.board;
  if (b && typeof b === 'object') {
    return { ...b, ...raw };
  }
  return raw;
}

function parseRpcJsonIfNeeded(data: unknown): unknown {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

function extractBoardsArrayFromRpc(data: unknown): any[] {
  data = parseRpcJsonIfNeeded(data);
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  const d = data as Record<string, unknown>;

  const candidates: unknown[] = [
    d.boards,
    (d.data as any)?.boards,
    (d.data as any)?.items,
    d.data,
    d.items,
    (d.result as any)?.boards,
    (d.payload as any)?.boards,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c as any[];
    if (c && typeof c === 'object' && Array.isArray((c as any).boards)) {
      return (c as any).boards;
    }
  }

  for (const v of Object.values(d)) {
    if (!Array.isArray(v) || v.length === 0) continue;
    const first = v[0] as Record<string, unknown>;
    if (first && typeof first === 'object') {
      if (
        'board' in first ||
        'board_id' in first ||
        'title' in first ||
        'member_preview' in first ||
        'member_previews' in first
      ) {
        return v as any[];
      }
    }
  }

  return [];
}

function mapResponseToBoards(data: any[]): PublicBoard[] {
  return data.map((raw: any) => {
    const item = flattenBoardRpcRow(raw);
    const honoree = item.honoree_details || {};
    const profilePhotoUrl =
      honoree.profile_photo_url ||
      item.honoree_profile_photo_url ||
      null;

    const creator = item.creator || item.profiles || null;

    const rawRows = extractRawMemberPreviewRows(item);
    const memberPreviews = rawRows.map(mapMemberPreviewRow);

    const previewCount = memberPreviews.length;
    const remainingFromApi =
      typeof item.remaining_members === 'number'
        ? item.remaining_members
        : typeof item.extra_members_count === 'number'
          ? item.extra_members_count
          : typeof item.members_remaining === 'number'
            ? item.members_remaining
            : null;

    const totalMembers =
      typeof item.total_members === 'number'
        ? item.total_members
        : typeof item.members_count === 'number'
          ? item.members_count
          : typeof item.participant_count === 'number'
            ? item.participant_count
            : remainingFromApi != null
              ? previewCount + remainingFromApi
              : typeof item.participants_count === 'number'
                ? item.participants_count
                : previewCount;

    return {
      id: item.id || item.board_id,
      title: item.title || '',
      description: item.description || '',
      cover_image_url:
        item.cover_image_url ||
        item.cover_image?.url ||
        item.cover_image ||
        profilePhotoUrl ||
        null,
      honoree_details: {
        ...honoree,
        profile_photo_url: profilePhotoUrl,
      },
      creator_id: item.creator_id || creator?.id || '',
      creator: creator
        ? {
            id: creator.id || '',
            name: creator.name || creator.full_name || '',
            profile_pic_url:
              creator.profile_pic_url || creator.avatar_url || null,
          }
        : null,
      status: item.status || 'live',
      privacy: item.privacy || 'public',
      deadline_date: item.deadline_date || null,
      wishes_count: item.wishes_count || 0,
      contributors_count: item.contributors_count || 0,
      views_count: item.views_count || 0,
      shares_count: item.shares_count || 0,
      participants_count: item.participants_count || 0,
      total_members: totalMembers,
      member_previews: memberPreviews,
      created_at: item.created_at || '',
    };
  });
}

export const useGetPublicBoards = (): UseGetPublicBoardsReturn => {
  const [boards, setBoards] = useState<PublicBoard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const limitRef = useRef(10);
  const memberPreviewLimitRef = useRef(4);

  const fetchBoards = useCallback(
    async (limit = 10, memberPreviewLimit = 4) => {
      setIsLoading(true);
      setError(null);
      limitRef.current = limit;
      memberPreviewLimitRef.current = memberPreviewLimit;
      offsetRef.current = 0;

      try {
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc(
          'get_public_boards',
          {
            p_limit: limit,
            p_offset: 0,
            p_member_preview_limit: memberPreviewLimit,
          }
        );

        if (rpcError) {
          setError(rpcError.message || 'Failed to fetch public boards');
          setBoards([]);
          return;
        }

        const boardsArray = extractBoardsArrayFromRpc(data);

        const mapped = mapResponseToBoards(boardsArray);
        setBoards(mapped);
        offsetRef.current = mapped.length;
        setHasMore(mapped.length >= limit);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch public boards';
        setError(message);
        setBoards([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        'get_public_boards',
        {
          p_limit: limitRef.current,
          p_offset: offsetRef.current,
          p_member_preview_limit: memberPreviewLimitRef.current,
        }
      );

      if (rpcError) {
        setError(rpcError.message || 'Failed to load more boards');
        return;
      }

      const boardsArray = extractBoardsArrayFromRpc(data);

      const mapped = mapResponseToBoards(boardsArray);
      setBoards((prev) => [...prev, ...mapped]);
      offsetRef.current += mapped.length;
      setHasMore(mapped.length >= limitRef.current);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load more boards';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  const refetch = useCallback(async () => {
    await fetchBoards(limitRef.current, memberPreviewLimitRef.current);
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
