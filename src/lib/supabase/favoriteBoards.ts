import type { SupabaseClient } from '@supabase/supabase-js';

const PAGE_SIZE_DEFAULT = 20;

export type FavoriteBoardItem = Record<string, unknown> & {
  id?: string;
  board_id?: string;
  title?: string;
  honoree_details?: Record<string, unknown>;
  cover_image_url?: string;
};

function unwrapFavoriteBoardRow(row: unknown): FavoriteBoardItem | null {
  if (row == null) return null;
  if (typeof row === 'string') {
    try {
      return unwrapFavoriteBoardRow(JSON.parse(row));
    } catch {
      return null;
    }
  }
  if (typeof row === 'object' && row !== null && 'board' in row) {
    const r = row as { board?: Record<string, unknown>; board_id?: string; id?: string };
    const b = r.board;
    if (b && typeof b === 'object') {
      return {
        ...b,
        id: (b.id as string) ?? r.board_id ?? r.id,
        board_id: r.board_id ?? (b.id as string),
      } as FavoriteBoardItem;
    }
  }
  return row as FavoriteBoardItem;
}

export function normalizeFavoriteBoardsPayload(data: unknown): FavoriteBoardItem[] {
  if (data == null) return [];
  if (typeof data === 'string') {
    try {
      return normalizeFavoriteBoardsPayload(JSON.parse(data));
    } catch {
      return [];
    }
  }
  if (Array.isArray(data)) {
    return data.map(unwrapFavoriteBoardRow).filter(Boolean) as FavoriteBoardItem[];
  }
  const d = data as Record<string, unknown>;
  const nested =
    d?.boards ??
    d?.favorite_boards ??
    d?.favorites ??
    d?.items ??
    d?.rows ??
    d?.result;
  if (Array.isArray(nested)) {
    return nested.map(unwrapFavoriteBoardRow).filter(Boolean) as FavoriteBoardItem[];
  }
  if (Array.isArray((d?.data as Record<string, unknown>)?.boards)) {
    return ((d.data as Record<string, unknown>).boards as unknown[])
      .map(unwrapFavoriteBoardRow)
      .filter(Boolean) as FavoriteBoardItem[];
  }
  if (Array.isArray(d?.data)) {
    return (d.data as unknown[]).map(unwrapFavoriteBoardRow).filter(Boolean) as FavoriteBoardItem[];
  }
  if (d?.data != null && typeof d.data === 'object' && d.data !== data) {
    const inner = normalizeFavoriteBoardsPayload(d.data);
    if (inner.length) return inner;
  }
  if (d?.id || d?.board_id || d?.title) {
    const one = unwrapFavoriteBoardRow(data);
    return one ? [one] : [];
  }
  return [];
}

export async function rpcGetFavoriteBoards(
  supabase: SupabaseClient,
  userId: string,
  limit: number,
  offset: number
) {
  return supabase.rpc('get_favorite_boards', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
  });
}

export async function rpcFavoriteBoard(
  supabase: SupabaseClient,
  userId: string,
  boardId: string
) {
  return supabase.rpc('favorite_board', {
    p_user_id: userId,
    p_board_id: boardId,
  });
}

export async function rpcUnfavoriteBoard(
  supabase: SupabaseClient,
  userId: string,
  boardId: string
) {
  return supabase.rpc('unfavorite_board', {
    p_user_id: userId,
    p_board_id: boardId,
  });
}

/** Same approach as mobile: scan favorites until found or list exhausted (max pages). */
export async function isBoardFavorited(
  supabase: SupabaseClient,
  userId: string,
  boardId: string,
  maxScan = 500
): Promise<boolean> {
  const { data, error } = await rpcGetFavoriteBoards(supabase, userId, maxScan, 0);
  if (error) return false;
  const boards = normalizeFavoriteBoardsPayload(data);
  return boards.some((b) => String(b?.id || b?.board_id) === String(boardId));
}

export async function fetchFavoriteBoardsPage(
  supabase: SupabaseClient,
  userId: string,
  offset: number,
  pageSize = PAGE_SIZE_DEFAULT
) {
  const { data, error } = await rpcGetFavoriteBoards(supabase, userId, pageSize, offset);
  if (error) {
    return {
      boards: [] as FavoriteBoardItem[],
      error: error.message || String(error),
      nextOffset: offset,
      hasMore: false,
    };
  }
  const page = normalizeFavoriteBoardsPayload(data);
  const hasMore = page.length === pageSize;
  return {
    boards: page,
    error: null as string | null,
    nextOffset: offset + page.length,
    hasMore,
  };
}
