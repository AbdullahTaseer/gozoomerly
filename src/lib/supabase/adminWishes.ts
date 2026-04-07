import { createClient } from './client';

export type AdminListWishesSort =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'likes_count_desc'
  | 'likes_count_asc';

export type AdminListWishesRpcParams = {
  p_search: string | null;
  p_board_id: string | null;
  p_sender_id: string | null;
  p_is_pinned: boolean | null;
  p_is_featured: boolean | null;
  p_include_deleted: boolean;
  p_created_after: string | null;
  p_created_before: string | null;
  p_sort: AdminListWishesSort;
  p_limit: number;
  p_offset: number;
};

export type AdminWishRow = {
  id: string;
  wishId: string;
  boardId: string;
  user: string;
  messagePreview: string;
  mediaFiles: number;
  giftAmount: string;
  dateDisplay: string;
  accountStatusLabel: string;
  accountStatusKey: 'active' | 'reported' | 'unknown';
};

function pickString(row: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const v = row[key];
    if (v == null) continue;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  }
  return fallback;
}

function pickNumber(row: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const v = row[key];
    if (v == null) continue;
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

function normalizeRpcRows(data: unknown): Record<string, unknown>[] {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data.filter(
      (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r),
    );
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>;
    const nested = o.wishes ?? o.items ?? o.data ?? o.rows;
    if (Array.isArray(nested)) {
      return nested.filter(
        (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r),
      );
    }
  }
  return [];
}

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

function mapAccountStatus(row: Record<string, unknown>): {
  label: string;
  key: AdminWishRow['accountStatusKey'];
} {
  const reported = pickString(row, ['is_reported', 'reported', 'has_reports']).toLowerCase();
  if (reported === 'true' || reported === '1') {
    return { label: 'Reported', key: 'reported' };
  }
  const status = pickString(row, ['account_status', 'wish_status', 'moderation_status', 'status']).toLowerCase();
  if (status === 'reported') return { label: 'Reported', key: 'reported' };
  if (status === 'active' || status === 'live' || status === '') {
    return { label: 'Active', key: 'active' };
  }
  const label = pickString(row, ['account_status', 'wish_status', 'moderation_status'], '');
  if (label) return { label, key: 'unknown' };
  return { label: 'Active', key: 'active' };
}

export function mapRowToAdminWish(row: Record<string, unknown>): AdminWishRow {
  const id = pickString(row, ['id', 'wish_id'], '');
  const wishId = pickString(row, ['wish_id', 'wishId', 'id', 'public_id']);
  const giftNum = pickNumber(row, ['gift_amount', 'giftAmount', 'amount', 'total_gift']);
  const giftStr = pickString(row, ['gift_amount_display', 'giftAmount', 'gift_display']);
  let giftAmount = giftStr;
  if (!giftAmount && giftNum != null) {
    giftAmount = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(giftNum);
  }
  if (!giftAmount) giftAmount = '—';

  const createdRaw = pickString(row, ['created_at', 'createdAt', 'date']);
  const mediaFiles =
    pickNumber(row, ['media_count', 'media_files', 'mediaFiles', 'attachments_count']) ?? 0;
  const { label, key } = mapAccountStatus(row);

  return {
    id: id || wishId,
    wishId: wishId || id || '—',
    boardId: pickString(row, ['board_id', 'boardId']),
    user: pickString(row, ['user_name', 'sender_name', 'user', 'sender_display_name', 'wisher_name']),
    messagePreview: pickString(row, [
      'message_preview',
      'messagePreview',
      'message',
      'body',
      'content',
      'text',
    ]),
    mediaFiles,
    giftAmount,
    dateDisplay: createdRaw ? formatDateTime(createdRaw) : '—',
    accountStatusLabel: label,
    accountStatusKey: key,
  };
}

export function buildAdminListWishesParams(input: {
  search: string;
  selectedFilterTags: string[];
  boardId: string;
  senderId: string;
  createdAfter: string;
  createdBefore: string;
  sort: AdminListWishesSort;
  limit: number;
  offset: number;
}): AdminListWishesRpcParams {
  const s = new Set(input.selectedFilterTags);

  let p_is_pinned: boolean | null = null;
  const py = s.has('wish_pinned_yes');
  const pn = s.has('wish_pinned_no');
  if (py && !pn) p_is_pinned = true;
  else if (pn && !py) p_is_pinned = false;

  let p_is_featured: boolean | null = null;
  const fy = s.has('wish_featured_yes');
  const fn = s.has('wish_featured_no');
  if (fy && !fn) p_is_featured = true;
  else if (fn && !fy) p_is_featured = false;

  return {
    p_search: input.search.trim() ? input.search.trim() : null,
    p_board_id: input.boardId.trim() ? input.boardId.trim() : null,
    p_sender_id: input.senderId.trim() ? input.senderId.trim() : null,
    p_is_pinned,
    p_is_featured,
    p_include_deleted: s.has('include_deleted'),
    p_created_after: input.createdAfter.trim() ? input.createdAfter.trim() : null,
    p_created_before: input.createdBefore.trim() ? input.createdBefore.trim() : null,
    p_sort: input.sort,
    p_limit: input.limit,
    p_offset: input.offset,
  };
}

export async function fetchAdminListWishes(
  params: AdminListWishesRpcParams,
): Promise<{ rows: AdminWishRow[]; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('admin_list_wishes', {
    p_search: params.p_search,
    p_board_id: params.p_board_id,
    p_sender_id: params.p_sender_id,
    p_is_pinned: params.p_is_pinned,
    p_is_featured: params.p_is_featured,
    p_include_deleted: params.p_include_deleted,
    p_created_after: params.p_created_after,
    p_created_before: params.p_created_before,
    p_sort: params.p_sort,
    p_limit: params.p_limit,
    p_offset: params.p_offset,
  });

  if (error) {
    console.error(error.message);
    return { rows: [], error: new Error(error.message) };
  }

  const rawRows = normalizeRpcRows(data);
  return {
    rows: rawRows.map((r, i) => {
      const m = mapRowToAdminWish(r);
      return m.id ? m : { ...m, id: `row-${i}` };
    }),
    error: null,
  };
}
