import { createClient } from './client';

export type UserStatsDirection = 'sent' | 'received' | null;

export type UserBoardStats = {
  total: number;
  live: number;
  past: number;
  new: number;
  yours: number;
};

export type UserInvitationStats = {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
};

export type UserProfileStatsResponse = {
  boardStats: UserBoardStats;
  invitationStats: UserInvitationStats;
  invitations: unknown[];
  raw: Record<string, unknown>;
};

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function pickNumber(row: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    if (!(key in row)) continue;
    const parsed = toNumber(row[key]);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function normalizeStatsPayload(data: unknown): Record<string, unknown> {
  if (Array.isArray(data)) {
    const first = toRecord(data[0]);
    return first ?? {};
  }

  const asRecord = toRecord(data);
  if (!asRecord) return {};

  const nestedData = toRecord(asRecord.data);
  if (nestedData) return nestedData;

  return asRecord;
}

function normalizeBoardStats(payload: Record<string, unknown>): UserBoardStats {
  const boardStats =
    toRecord(payload.board_stats) ??
    toRecord(payload.boards_stats) ??
    toRecord(payload.boardCounts) ??
    toRecord(payload.counts) ??
    {};

  const total = pickNumber(boardStats, ['total', 'total_boards', 'boards_count']);
  const yours = pickNumber(boardStats, ['yours', 'yours_boards_count', 'your_boards', 'total']);

  return {
    total,
    live: pickNumber(boardStats, ['live', 'live_boards']),
    past: pickNumber(boardStats, ['past', 'past_boards']),
    new: pickNumber(boardStats, ['new', 'new_boards']),
    yours: yours || total,
  };
}

function normalizeInvitations(payload: Record<string, unknown>): unknown[] {
  const direct = payload.invitations;
  if (Array.isArray(direct)) return direct;

  const sent = Array.isArray(payload.sent_invitations) ? payload.sent_invitations : [];
  const received = Array.isArray(payload.received_invitations) ? payload.received_invitations : [];

  if (sent.length || received.length) {
    return [...sent, ...received];
  }

  return [];
}

function normalizeInvitationStats(
  payload: Record<string, unknown>,
  invitations: unknown[]
): UserInvitationStats {
  const invitationStats =
    toRecord(payload.invitation_stats) ??
    toRecord(payload.invitation_counts) ??
    toRecord(payload.invitations_count) ??
    {};

  const fallback = {
    total: invitations.length,
    pending: 0,
    accepted: 0,
    declined: 0,
  };

  for (const invitation of invitations) {
    const row = toRecord(invitation);
    if (!row) continue;
    const status = String(row.status ?? '').toLowerCase();
    if (status === 'pending') fallback.pending += 1;
    if (status === 'accepted') fallback.accepted += 1;
    if (status === 'declined') fallback.declined += 1;
  }

  return {
    total: pickNumber(invitationStats, ['total', 'total_invitations']) || fallback.total,
    pending: pickNumber(invitationStats, ['pending', 'pending_invitations']) || fallback.pending,
    accepted: pickNumber(invitationStats, ['accepted', 'accepted_invitations']) || fallback.accepted,
    declined: pickNumber(invitationStats, ['declined', 'declined_invitations']) || fallback.declined,
  };
}

export async function getUserStats(
  userId: string,
  direction: UserStatsDirection = null
): Promise<{ data: UserProfileStatsResponse | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_stats', {
    p_user_id: userId,
    p_direction: direction,
  });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const payload = normalizeStatsPayload(data);
  const invitations = normalizeInvitations(payload);

  return {
    data: {
      boardStats: normalizeBoardStats(payload),
      invitationStats: normalizeInvitationStats(payload, invitations),
      invitations,
      raw: payload,
    },
    error: null,
  };
}
