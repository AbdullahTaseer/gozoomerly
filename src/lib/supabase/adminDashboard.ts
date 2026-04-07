import { createClient } from './client';

export type AdminDashboardStats = {
  totalUsers: number | null;
  totalBoards: number | null;
  totalRevenue: number | null;
  totalGiftAmount: number | null;
  newUsers24h: number | null;
  newBoards24h: number | null;
  giftsPendingPayout: number | null;
  reportedOpen: number | null;
};

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

function normalizeRpcRow(data: unknown): Record<string, unknown> | null {
  if (data == null) return null;
  if (Array.isArray(data)) {
    const first = data[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      return first as Record<string, unknown>;
    }
    return null;
  }
  if (typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

export function mapRowToAdminDashboardStats(row: Record<string, unknown>): AdminDashboardStats {
  return {
    totalUsers: pickNumber(row, ['total_users', 'totalUsers', 'user_count', 'users_count']),
    totalBoards: pickNumber(row, ['total_boards', 'totalBoards', 'board_count', 'boards_count']),
    totalRevenue: pickNumber(row, ['total_revenue', 'totalRevenue', 'revenue']),
    totalGiftAmount: pickNumber(row, [
      'total_gift_amount',
      'total_gifts_amount',
      'totalGiftAmount',
      'all_time_gift_amount',
      'gifts_total',
    ]),
    newUsers24h: pickNumber(row, ['new_users_24h', 'newUsers24h', 'new_users_last_24h']),
    newBoards24h: pickNumber(row, ['new_boards_24h', 'newBoards24h', 'new_boards_last_24h']),
    giftsPendingPayout: pickNumber(row, [
      'gifts_pending_payout',
      'giftsPendingPayout',
      'pending_gift_payouts',
    ]),
    reportedOpen: pickNumber(row, [
      'reported_content_open',
      'reportedOpen',
      'open_reported_cases',
      'reported_open',
    ]),
  };
}

export async function fetchAdminDashboardStats(): Promise<{
  stats: AdminDashboardStats | null;
  error: Error | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('admin_get_dashboard_stats');

  if (error) {
    console.error(error.message);
    return { stats: null, error: new Error(error.message) };
  }

  const row = normalizeRpcRow(data);
  if (!row) {
    const err = new Error('Unexpected dashboard stats response');
    console.error(err.message);
    return { stats: null, error: err };
  }

  return { stats: mapRowToAdminDashboardStats(row), error: null };
}
