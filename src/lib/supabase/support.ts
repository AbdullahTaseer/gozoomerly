import { createClient } from './client';

/**
 * Same contract as mobile `supportSlice` / `create_support_ticket` RPC.
 */
export async function createSupportTicket(params: {
  name: string;
  phone: string;
  message: string;
}): Promise<{ data: unknown; error: Error | null }> {
  let supabase;
  try {
    supabase = createClient();
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error('Missing Supabase configuration'),
    };
  }

  const { data, error } = await supabase.rpc('create_support_ticket', {
    p_name: params.name.trim(),
    p_phone: params.phone.trim(),
    p_message: params.message.trim() || '—',
  });

  if (error) {
    return {
      data: null,
      error: new Error(typeof error.message === 'string' ? error.message : String(error)),
    };
  }

  return { data, error: null };
}

export type SupportTicketRow = Record<string, unknown>;

/**
 * Admin dashboard: list support tickets (authenticated `access_token` in localStorage).
 */
export async function adminListSupportTickets(params: {
  p_status?: string;
  p_limit: number;
  p_offset: number;
}): Promise<{ data: SupportTicketRow[] | null; error: Error | null }> {
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

  const status =
    params.p_status && String(params.p_status).trim().length > 0
      ? String(params.p_status).trim()
      : null;

  const response = await fetch(`${url}/rest/v1/rpc/admin_list_support_tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      p_status: status,
      p_limit: params.p_limit,
      p_offset: params.p_offset,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const message = err?.message || err?.error || `Request failed (${response.status})`;
    return { data: null, error: new Error(message) };
  }

  const data = await response.json().catch(() => null);
  const rows = Array.isArray(data) ? (data as SupportTicketRow[]) : [];
  return { data: rows, error: null };
}
