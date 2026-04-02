export type AdminListSupportTicketsParams = {
  p_status?: string;
  p_limit: number;
  p_offset: number;
};

export type SupportTicketRow = {
  id: string;
  ticket_id: string;
  user_name: string;
  message_preview: string;
  category: string;
  created_at: string;
  status: string;
  [key: string]: unknown;
};

export async function adminListSupportTickets(
  params: AdminListSupportTicketsParams
): Promise<{ data: SupportTicketRow[] | null; error: Error | null }> {
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

  const body: Record<string, unknown> = {
    p_limit: params.p_limit,
    p_offset: params.p_offset,
  };

  if (params.p_status !== undefined && params.p_status !== '') {
    body.p_status = params.p_status;
  }

  const response = await fetch(`${url}/rest/v1/rpc/admin_list_support_tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    const message = err?.message || err?.error || `Request failed (${response.status})`;
    return { data: null, error: new Error(message) };
  }

  const data = await response.json().catch(() => null);

  console.log('[admin_list_support_tickets] raw response:', JSON.stringify(data, null, 2));

  if (data !== null && data !== undefined && !Array.isArray(data)) {
    return { data: null, error: new Error('admin_list_support_tickets returned unexpected data shape') };
  }

  return { data: (data as SupportTicketRow[]) ?? [], error: null };
}
