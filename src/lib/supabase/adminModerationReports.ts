import { createClient } from './client';

export type AdminListModerationReportsSort = 'created_at_desc' | 'created_at_asc';

export type AdminListModerationReportsRpcParams = {
  p_search: string | null;
  p_status: string | null;
  p_content_type: string | null;
  p_reason: string | null;
  p_reporter_id: string | null;
  p_created_after: string | null;
  p_created_before: string | null;
  p_resolved_after: string | null;
  p_resolved_before: string | null;
  p_sort: AdminListModerationReportsSort;
  p_limit: number;
  p_offset: number;
};

export type AdminModerationReportRow = {
  id: string;
  reportId: string;
  reportedBy: string;
  contentType: string;
  reason: string;
  timestampDisplay: string;
  statusLabel: string;
  statusKey: 'pending' | 'resolved' | 'other';
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

function normalizeRpcRows(data: unknown): Record<string, unknown>[] {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data.filter(
      (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r),
    );
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>;
    const nested = o.reports ?? o.items ?? o.data ?? o.rows;
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

function mapStatus(raw: string): { label: string; key: AdminModerationReportRow['statusKey'] } {
  const s = raw.trim().toLowerCase();
  if (s === 'pending') return { label: 'Pending', key: 'pending' };
  if (s === 'resolved') return { label: 'Resolved', key: 'resolved' };
  if (s === 'under review' || s === 'under_review') return { label: 'Under Review', key: 'other' };
  const label = raw.trim() || '—';
  return { label: label || '—', key: 'other' };
}

export function mapRowToAdminModerationReport(row: Record<string, unknown>): AdminModerationReportRow {
  const id = pickString(row, ['id', 'report_id'], '');
  const reportId = pickString(row, ['report_id', 'reportId', 'id', 'public_id']);
  const createdRaw = pickString(row, ['created_at', 'createdAt', 'submitted_at', 'timestamp']);
  const statusRaw = pickString(row, ['status', 'report_status', 'moderation_status']);
  const { label, key } = mapStatus(statusRaw);

  return {
    id: id || reportId,
    reportId: reportId || id || '—',
    reportedBy: pickString(row, [
      'reporter_name',
      'reported_by_name',
      'reported_by',
      'reporter_email',
      'user_name',
      'reporter_id',
    ]),
    contentType: pickString(row, ['content_type', 'contentType', 'target_type']),
    reason: pickString(row, ['reason', 'report_reason', 'category']),
    timestampDisplay: createdRaw ? formatDateTime(createdRaw) : '—',
    statusLabel: label,
    statusKey: key,
  };
}

export function buildAdminListModerationReportsParams(input: {
  search: string;
  status: string;
  contentType: string;
  reason: string;
  reporterId: string;
  createdAfter: string;
  createdBefore: string;
  resolvedAfter: string;
  resolvedBefore: string;
  sort: AdminListModerationReportsSort;
  limit: number;
  offset: number;
}): AdminListModerationReportsRpcParams {
  return {
    p_search: input.search.trim() ? input.search.trim() : null,
    p_status: input.status.trim() ? input.status.trim() : null,
    p_content_type: input.contentType.trim() ? input.contentType.trim() : null,
    p_reason: input.reason.trim() ? input.reason.trim() : null,
    p_reporter_id: input.reporterId.trim() ? input.reporterId.trim() : null,
    p_created_after: input.createdAfter.trim() ? input.createdAfter.trim() : null,
    p_created_before: input.createdBefore.trim() ? input.createdBefore.trim() : null,
    p_resolved_after: input.resolvedAfter.trim() ? input.resolvedAfter.trim() : null,
    p_resolved_before: input.resolvedBefore.trim() ? input.resolvedBefore.trim() : null,
    p_sort: input.sort,
    p_limit: input.limit,
    p_offset: input.offset,
  };
}

export async function fetchAdminListModerationReports(
  params: AdminListModerationReportsRpcParams,
): Promise<{ rows: AdminModerationReportRow[]; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('admin_list_moderation_reports', {
    p_search: params.p_search,
    p_status: params.p_status,
    p_content_type: params.p_content_type,
    p_reason: params.p_reason,
    p_reporter_id: params.p_reporter_id,
    p_created_after: params.p_created_after,
    p_created_before: params.p_created_before,
    p_resolved_after: params.p_resolved_after,
    p_resolved_before: params.p_resolved_before,
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
      const m = mapRowToAdminModerationReport(r);
      return m.id ? m : { ...m, id: `row-${i}` };
    }),
    error: null,
  };
}
