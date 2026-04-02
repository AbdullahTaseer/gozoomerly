import { createClient } from './client';
import type { FaqItem } from '@/lib/faqsStore';

export type AdminUpsertFaqParams = {
  /** Omit or null when creating a new FAQ */
  p_id?: string | null;
  p_question: string;
  p_answer: string;
  p_display_order: number;
  p_is_active: boolean;
};

type FaqRow = Record<string, unknown>;

function rowSortKey(row: FaqRow): number {
  if (typeof row.sort_order === 'number' && Number.isFinite(row.sort_order)) {
    return row.sort_order;
  }
  if (typeof row.display_order === 'number' && Number.isFinite(row.display_order)) {
    return row.display_order;
  }
  const created = row.created_at;
  if (typeof created === 'string') {
    const t = Date.parse(created);
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}

function mapRowToFaq(row: FaqRow, index: number): FaqItem | null {
  const rawId = row.id ?? row.faq_id;
  if (rawId === null || rawId === undefined) return null;
  const id = typeof rawId === 'string' ? rawId : String(rawId);
  const question = row.question;
  const answer = row.answer;
  if (typeof question !== 'string' || typeof answer !== 'string') return null;

  const isActive =
    typeof row.is_active === 'boolean'
      ? row.is_active
      : row.is_active === null || row.is_active === undefined
        ? true
        : Boolean(row.is_active);

  let sortOrder = index + 1;
  if (typeof row.sort_order === 'number' && Number.isFinite(row.sort_order)) {
    sortOrder = row.sort_order;
  } else if (typeof row.display_order === 'number' && Number.isFinite(row.display_order)) {
    sortOrder = row.display_order;
  }

  return { id, question, answer, isActive, sortOrder };
}

/**
 * Loads FAQs via `get_faqs` RPC (no parameters).
 * Rows are sorted by `sort_order` / `display_order` when present, otherwise by `created_at`.
 */
export async function listFaqs(options?: {
  /** When true (admin), include rows with is_active = false */
  includeInactive?: boolean;
}): Promise<{ data: FaqItem[] | null; error: Error | null }> {
  let supabase;
  try {
    supabase = createClient();
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error('Missing Supabase configuration'),
    };
  }

  const { data, error } = await supabase.rpc('get_faqs', {});

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (data !== null && data !== undefined && !Array.isArray(data)) {
    return { data: null, error: new Error('get_faqs returned unexpected data shape') };
  }

  let rows = (Array.isArray(data) ? data : []) as FaqRow[];
  if (!options?.includeInactive) {
    rows = rows.filter((r) => r.is_active !== false);
  }

  rows.sort((a, b) => {
    const ka = rowSortKey(a);
    const kb = rowSortKey(b);
    if (ka !== kb) return ka - kb;
    return String(a.id).localeCompare(String(b.id));
  });

  const mapped = rows
    .map((row, i) => mapRowToFaq(row, i))
    .filter((x): x is FaqItem => x !== null);

  return { data: mapped, error: null };
}

export async function adminUpsertFaq(
  params: AdminUpsertFaqParams
): Promise<{ data: unknown; error: Error | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { data: null, error: new Error('Missing Supabase configuration') };
  }

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (!token) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const response = await fetch(`${url}/rest/v1/rpc/admin_upsert_faq`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      p_id: params.p_id ?? null,
      p_question: params.p_question,
      p_answer: params.p_answer,
      p_display_order: params.p_display_order,
      p_is_active: params.p_is_active,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const message = err?.message || err?.error || `Request failed (${response.status})`;
    return { data: null, error: new Error(message) };
  }

  const data = await response.json().catch(() => null);
  return { data, error: null };
}
