import { createClient } from './client';

export type AdminListBoardsSort = 'created_at_desc' | 'total_raised_desc' | 'name_asc';

export type AdminListBoardsRpcParams = {
  p_search: string | null;
  p_status: string | null;
  p_privacy: string | null;
  p_goal_type: string | null;
  p_creator_id: string | null;
  p_board_type_id: string | null;
  p_is_spotlight: boolean | null;
  p_spotlight_status: string | null;
  p_currency: string | null;
  p_include_deleted: boolean;
  p_created_after: string | null;
  p_created_before: string | null;
  p_sort: AdminListBoardsSort;
  p_limit: number;
  p_offset: number;
};

export type AdminBoardRow = {
  id: string;
  title: string;
  boardType: string;
  createdBy: string;
  createdDateDisplay: string;
  participantsCount: string;
  totalGiftsDisplay: string;
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
    const nested = o.boards ?? o.items ?? o.data ?? o.rows;
    if (Array.isArray(nested)) {
      return nested.filter(
        (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r),
      );
    }
  }
  return [];
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d);
}

function formatMoney(amount: number | null, currencyHint: string | undefined): string {
  if (amount == null) return '—';
  const cur = (currencyHint || 'USD').trim() || 'USD';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(amount);
  } catch {
    return `${amount} ${cur}`;
  }
}

export function mapRowToAdminBoard(row: Record<string, unknown>): AdminBoardRow {
  const id = pickString(row, ['id', 'board_id'], '');
  const title = pickString(row, ['title', 'board_title', 'name']);
  const boardType = pickString(row, [
    'board_type_name',
    'board_type',
    'type_name',
    'goal_type',
    'boardType',
  ]);
  const createdBy = pickString(row, [
    'creator_name',
    'created_by_name',
    'user_name',
    'creator_display_name',
    'created_by',
    'creator_id',
  ]);
  const createdRaw = pickString(row, ['created_at', 'createdAt', 'created_date']);
  const participants = pickNumber(row, [
    'participants_count',
    'participant_count',
    'participantsCount',
    'members_count',
  ]);
  const totalNum = pickNumber(row, [
    'total_gifts',
    'total_raised',
    'gift_total',
    'totalGiftAmount',
    'raised_amount',
  ]);
  const currency = pickString(row, ['currency', 'gift_currency'], 'USD');
  const totalGiftsStr = pickString(row, ['total_gifts_display', 'totalGifts', 'gifts_display']);

  let totalGiftsDisplay: string;
  if (totalGiftsStr) {
    totalGiftsDisplay = totalGiftsStr;
  } else if (totalNum != null) {
    totalGiftsDisplay = formatMoney(totalNum, currency);
  } else {
    totalGiftsDisplay = '—';
  }

  return {
    id: id || title,
    title: title || '—',
    boardType: boardType || '—',
    createdBy: createdBy || '—',
    createdDateDisplay: createdRaw ? formatDate(createdRaw) : '—',
    participantsCount:
      participants != null
        ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(participants)
        : '—',
    totalGiftsDisplay,
  };
}

export function buildAdminListBoardsParams(input: {
  search: string;
  selectedFilterTags: string[];
  status: string;
  privacy: string;
  goalType: string;
  creatorId: string;
  boardTypeId: string;
  spotlightStatus: string;
  currency: string;
  createdAfter: string;
  createdBefore: string;
  sort: AdminListBoardsSort;
  limit: number;
  offset: number;
}): AdminListBoardsRpcParams {
  const s = new Set(input.selectedFilterTags);

  let p_is_spotlight: boolean | null = null;
  const sy = s.has('spotlight_yes');
  const sn = s.has('spotlight_no');
  if (sy && !sn) p_is_spotlight = true;
  else if (sn && !sy) p_is_spotlight = false;

  return {
    p_search: input.search.trim() ? input.search.trim() : null,
    p_status: input.status.trim() ? input.status.trim() : null,
    p_privacy: input.privacy.trim() ? input.privacy.trim() : null,
    p_goal_type: input.goalType.trim() ? input.goalType.trim() : null,
    p_creator_id: input.creatorId.trim() ? input.creatorId.trim() : null,
    p_board_type_id: input.boardTypeId.trim() ? input.boardTypeId.trim() : null,
    p_is_spotlight,
    p_spotlight_status: input.spotlightStatus.trim() ? input.spotlightStatus.trim() : null,
    p_currency: input.currency.trim() ? input.currency.trim().toUpperCase() : null,
    p_include_deleted: s.has('include_deleted'),
    p_created_after: input.createdAfter.trim() ? input.createdAfter.trim() : null,
    p_created_before: input.createdBefore.trim() ? input.createdBefore.trim() : null,
    p_sort: input.sort,
    p_limit: input.limit,
    p_offset: input.offset,
  };
}

export async function fetchAdminListBoards(
  params: AdminListBoardsRpcParams,
): Promise<{ rows: AdminBoardRow[]; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('admin_list_boards', {
    p_search: params.p_search,
    p_status: params.p_status,
    p_privacy: params.p_privacy,
    p_goal_type: params.p_goal_type,
    p_creator_id: params.p_creator_id,
    p_board_type_id: params.p_board_type_id,
    p_is_spotlight: params.p_is_spotlight,
    p_spotlight_status: params.p_spotlight_status,
    p_currency: params.p_currency,
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
      const m = mapRowToAdminBoard(r);
      return m.id ? m : { ...m, id: `row-${i}` };
    }),
    error: null,
  };
}
