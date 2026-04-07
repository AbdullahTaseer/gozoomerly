import { createClient } from './client';

export type AdminListProfilesSort = 'created_at_desc' | 'created_at_asc' | 'name_asc';

export type AdminListProfilesRpcParams = {
  p_search: string | null;
  p_account_status: string | null;
  p_include_deleted: boolean;
  p_phone_verified: boolean | null;
  p_is_verified: boolean | null;
  p_is_public_profile: boolean | null;
  p_country: string | null;
  p_created_after: string | null;
  p_created_before: string | null;
  p_sort: AdminListProfilesSort;
  p_limit: number;
  p_offset: number;
};

export type AdminProfileRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatusLabel: string;
  accountStatusKey: 'active' | 'suspended' | 'unknown';
  joinDateDisplay: string;
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
    const nested = o.profiles ?? o.items ?? o.data ?? o.rows;
    if (Array.isArray(nested)) {
      return nested.filter(
        (r): r is Record<string, unknown> => r !== null && typeof r === 'object' && !Array.isArray(r),
      );
    }
  }
  return [];
}

function formatJoinDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d);
}

function mapAccountStatus(row: Record<string, unknown>): {
  label: string;
  key: 'active' | 'suspended' | 'unknown';
} {
  const raw = pickString(row, ['account_status', 'accountStatus', 'status']).toLowerCase();
  if (raw === 'active') return { label: 'Active', key: 'active' };
  if (raw === 'suspended' || raw === 'suspend') return { label: 'Suspended', key: 'suspended' };
  const label = pickString(row, ['account_status', 'accountStatus', 'status'], '—');
  return { label: label || '—', key: 'unknown' };
}

export function mapRowToAdminProfile(row: Record<string, unknown>): AdminProfileRow {
  const id = pickString(row, ['id', 'user_id', 'profile_id'], '');
  const createdRaw = pickString(row, ['created_at', 'createdAt', 'join_date']);
  const { label, key } = mapAccountStatus(row);

  return {
    id: id || pickString(row, ['email']),
    name: pickString(row, ['name', 'full_name', 'display_name', 'username']),
    email: pickString(row, ['email']),
    phone: pickString(row, ['phone', 'phone_number', 'phone_e164', 'mobile']),
    accountStatusLabel: label,
    accountStatusKey: key,
    joinDateDisplay: createdRaw ? formatJoinDate(createdRaw) : '—',
  };
}

/** Maps multi-select filter tags from the admin UI into RPC parameters. */
export function buildAdminListProfilesParams(input: {
  search: string;
  selectedFilterTags: string[];
  country: string;
  createdAfter: string;
  createdBefore: string;
  sort: AdminListProfilesSort;
  limit: number;
  offset: number;
}): AdminListProfilesRpcParams {
  const s = new Set(input.selectedFilterTags);

  let p_account_status: string | null = null;
  const active = s.has('account_active');
  const suspended = s.has('account_suspended');
  if (active && !suspended) p_account_status = 'active';
  else if (suspended && !active) p_account_status = 'suspended';

  let p_phone_verified: boolean | null = null;
  const pv = s.has('phone_verified');
  const pnv = s.has('phone_unverified');
  if (pv && !pnv) p_phone_verified = true;
  else if (pnv && !pv) p_phone_verified = false;

  let p_is_verified: boolean | null = null;
  const iv = s.has('profile_verified');
  const iu = s.has('profile_unverified');
  if (iv && !iu) p_is_verified = true;
  else if (iu && !iv) p_is_verified = false;

  let p_is_public_profile: boolean | null = null;
  const pub = s.has('public_profile');
  const priv = s.has('private_profile');
  if (pub && !priv) p_is_public_profile = true;
  else if (priv && !pub) p_is_public_profile = false;

  return {
    p_search: input.search.trim() ? input.search.trim() : null,
    p_account_status,
    p_include_deleted: s.has('include_deleted'),
    p_phone_verified,
    p_is_verified,
    p_is_public_profile,
    p_country: input.country.trim() ? input.country.trim() : null,
    p_created_after: input.createdAfter.trim() ? input.createdAfter.trim() : null,
    p_created_before: input.createdBefore.trim() ? input.createdBefore.trim() : null,
    p_sort: input.sort,
    p_limit: input.limit,
    p_offset: input.offset,
  };
}

export async function fetchAdminListProfiles(
  params: AdminListProfilesRpcParams,
): Promise<{ rows: AdminProfileRow[]; error: Error | null }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('admin_list_profiles', {
    p_search: params.p_search,
    p_account_status: params.p_account_status,
    p_include_deleted: params.p_include_deleted,
    p_phone_verified: params.p_phone_verified,
    p_is_verified: params.p_is_verified,
    p_is_public_profile: params.p_is_public_profile,
    p_country: params.p_country,
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
      const m = mapRowToAdminProfile(r);
      return m.id ? m : { ...m, id: `row-${i}` };
    }),
    error: null,
  };
}
