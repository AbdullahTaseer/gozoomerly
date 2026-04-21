import { createClient } from './client';
import { STORAGE_BUCKETS } from './storageBuckets';

export interface BoardType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color_scheme?: any;
  is_active: boolean;
  display_order: number;
  default_currency: string;
  supports_fundraising: boolean;
  supports_wishes: boolean;
  supports_media: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Board {
  profiles: any;
  id: string;
  creator_id: string;
  board_type_id?: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details?: any;
  cover_media_id?: string;
  goal_type: 'monetary' | 'nonmonetary';
  goal_amount?: number;
  currency: string;
  deadline_date?: string;
  privacy: 'public' | 'private' | 'circle_only';
  allow_invites: boolean;
  invites_can_invite: boolean;
  status: 'draft' | 'live' | 'published' | 'completed' | 'cancelled';
  published_at?: string;
  total_raised: number;
  contributors_count: number;
  wishes_count: number;
  participants_count?: number;
  gifters_count?: number;
  media_count?: number;
  views_count: number;
  shares_count: number;
  last_activity_at?: string;
  meta_tags?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  creator?: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
  board_types?: BoardType;
}

export interface CreateBoardInput {
  title: string;
  description?: string;
  board_type_id?: string;
  honoree_details?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    hometown?: string;
    phone?: string;
    email?: string;
    profile_photo_url?: string;
    theme_color?: string;
  };
  goal_type?: 'monetary' | 'nonmonetary';
  goal_amount?: number;
  currency?: string;
  deadline_date?: string;
  privacy?: 'public' | 'private' | 'circle_only';
  allow_invites?: boolean;
  invites_can_invite?: boolean;
}

export async function getBoardTypes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('board_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export interface BoardTypeField {
  id: string;
  board_type_id: string;
  field_key: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'boolean' | 'email' | 'phone' | 'url' | 'file';
  validation_rules?: any;
  options?: any;
  placeholder?: string;
  help_text?: string;
  display_order: number;
  is_required: boolean;
  is_visible: boolean;
}

export async function getBoardTypeFields(boardTypeId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('board_type_fields')
    .select('*')
    .eq('board_type_id', boardTypeId)
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createBoard(userId: string, input: CreateBoardInput) {
  const supabase = createClient();

  if (!userId) {
    return { data: null, error: { message: 'User ID is required to create a board' } };
  }

  if (!input.title || input.title.trim() === '') {
    return { data: null, error: { message: 'Board title is required' } };
  }

  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const slug = `${baseSlug}-${Date.now()}`;

  const boardData: any = {
    creator_id: userId,
    title: input.title,
    slug,
    description: input.description || '',
    honoree_details: input.honoree_details || {},
    goal_type: input.goal_type || 'monetary',
    goal_amount: input.goal_amount || null,
    currency: input.currency || 'USD',
    deadline_date: input.deadline_date || null,
    privacy: input.privacy || 'public',
    allow_invites: input.allow_invites ?? true,
    invites_can_invite: input.invites_can_invite ?? false,
    status: 'draft'
  };

  if (input.board_type_id) {
    boardData.board_type_id = input.board_type_id;
  }

  const { data, error } = await supabase
    .from('boards')
    .insert([boardData])
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        ...error,
        message: `Failed to create board: ${error.message}${error.hint ? ` (Hint: ${error.hint})` : ''}`
      }
    };
  }

  if (data) {
    await supabase
      .from('board_participants')
      .insert([{
        board_id: data.id,
        user_id: userId,
        role: 'admin',
        joined_via: 'created'
      }]);
  }

  return { data, error: null };
}

export async function getUserBoards(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      wishes_count,
      participants_count,
      contributors_count,
      gifters_count,
      media_count,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      board_participants!inner (
        user_id,
        role
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('board_participants.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  if (data) {

    const boardsWithCounts = data.map((board: Board) => {

      const wishesCount = (board as any).wishes_count ?? 0;
      const participantsCount = (board as any).participants_count ?? 0;
      const contributorsCount = (board as any).contributors_count ?? 0;
      const giftersCount = (board as any).gifters_count ?? 0;
      const mediaCount = (board as any).media_count ?? 0;

      return {
        ...board,
        wishes_count: wishesCount,
        participants_count: participantsCount,
        gifters_count: giftersCount,
        contributors_count: contributorsCount,
        media_count: mediaCount
      };
    });

    return { data: boardsWithCounts, error: null };
  }

  return { data, error: null };
}

export async function getBoardByIdRPC(boardId: string) {
  const supabase = createClient();

  const rpcParams = {
    p_board_id: boardId,
  };

  const { data, error } = await supabase.rpc('get_board_by_id', rpcParams);

  if (error) {
    return { data: null, error };
  }

  if (data && data.success && data.data) {
    const rpcBoard = data.data;

    const normalizedBoard = {
      ...rpcBoard,

      profiles: rpcBoard.creator ? {
        id: rpcBoard.creator.id,
        name: rpcBoard.creator.name,
        profile_pic_url: rpcBoard.creator.profile_pic_url,
      } : null,

      board_types: rpcBoard.board_type ? {
        name: rpcBoard.board_type.name,
        slug: rpcBoard.board_type.slug,
        icon: rpcBoard.board_type.icon,
        color_scheme: rpcBoard.board_type.color_scheme,
      } : null,

      contributors_count: rpcBoard.contributors_count ?? 0,
      wishes_count: rpcBoard.wishes_count ?? 0,
      participants_count: rpcBoard.participants_count ?? 0,
      gifters_count: rpcBoard.gifters_count ?? 0,
      media_count: rpcBoard.media_count ?? 0,
      views_count: rpcBoard.views_count ?? 0,
      shares_count: rpcBoard.shares_count ?? 0,
      total_raised: rpcBoard.total_raised ?? 0,
    };

    return { data: normalizedBoard, error: null };
  }

  return { data: null, error: new Error('Invalid RPC response') };
}

/** Normalized row from `search_boards_global` for list UIs */
export type GlobalBoardSearchResult = {
  id: string;
  title: string;
  cover_image_url?: string | null;
};

function normalizeGlobalBoardSearchRow(row: Record<string, unknown>): GlobalBoardSearchResult | null {
  const id = String(row.id ?? row.board_id ?? '').trim();
  if (!id) return null;
  const title = String(row.title ?? row.name ?? 'Untitled board');
  const cover_image_url =
    (typeof row.cover_image_url === 'string' && row.cover_image_url) ||
    (typeof row.cover_media_url === 'string' && row.cover_media_url) ||
    (typeof row.thumbnail_url === 'string' && row.thumbnail_url) ||
    (typeof row.cover_url === 'string' && row.cover_url) ||
    undefined;
  return { id, title, cover_image_url };
}

function unwrapSearchBoardsPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    if (o.success === true && o.data != null) {
      const inner = o.data;
      if (Array.isArray(inner)) return inner;
      if (inner && typeof inner === 'object' && Array.isArray((inner as { boards?: unknown[] }).boards)) {
        return (inner as { boards: unknown[] }).boards;
      }
      if (inner && typeof inner === 'object' && Array.isArray((inner as { data?: unknown[] }).data)) {
        return (inner as { data: unknown[] }).data;
      }
    }
    if (Array.isArray(o.data)) return o.data as unknown[];
    if (Array.isArray(o.boards)) return o.boards as unknown[];
  }
  return [];
}

export async function searchBoardsGlobal(
  query: string,
  options?: { limit?: number; offset?: number }
): Promise<{ boards: GlobalBoardSearchResult[]; error: unknown }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { boards: [], error: null };
  }

  const supabase = createClient();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  const { data, error } = await supabase.rpc('search_boards_global', {
    p_query: trimmed,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { boards: [], error };
  }

  const rows = unwrapSearchBoardsPayload(data);
  const boards = rows
    .map((r) => (r && typeof r === 'object' ? normalizeGlobalBoardSearchRow(r as Record<string, unknown>) : null))
    .filter((b): b is GlobalBoardSearchResult => b != null);

  return { boards, error: null };
}

export async function getBoardBySlug(slug: string) {
  const supabase = createClient();

  const { data: boardData, error: slugError } = await supabase
    .from('boards')
    .select('id')
    .eq('slug', slug)
    .single();

  if (slugError || !boardData) {

    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        board_types (
          name,
          slug,
          icon,
          color_scheme
        ),
        profiles:creator_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  }

  return await getBoardByIdRPC(boardData.id);
}

export async function getBoardById(boardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('id', boardId)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export type UpdateBoardDetailsInput = {
  boardId: string;
  /** Publish: set board status to live */
  status?: 'live';
  /** Media table row id — sent as `p_cover_media_id` */
  coverMediaId?: string | null;
  /** With cover: set `p_apply_cover_media` (default true when `coverMediaId` is set) */
  applyCoverMedia?: boolean;
};

/**
 * Calls `update_board_details` RPC — publish-only, cover-only (draft), or both.
 * When `coverMediaId` is set, it is sent as `p_cover_media_id`.
 */
export async function updateBoardDetails(input: UpdateBoardDetailsInput) {
  const supabase = createClient();
  const payload: Record<string, unknown> = {
    p_board_id: input.boardId,
  };
  if (input.status !== undefined) {
    payload.p_status = input.status;
  }

  const coverId =
    input.coverMediaId != null && String(input.coverMediaId).trim() !== ''
      ? String(input.coverMediaId).trim()
      : null;
  if (coverId) {
    payload.p_cover_media_id = coverId;
    payload.p_apply_cover_media = input.applyCoverMedia !== false;
  }

  const { data, error } = await supabase.rpc('update_board_details', payload);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export type UpdateBoardOptions = {
  /**
   * Media row id from `media.id` — passed to `update_board_details` as `p_cover_media_id`
   * whenever you update the board (e.g. after upload).
   */
  coverMediaId?: string | null;
};

export async function updateBoard(
  boardId: string,
  updates: Partial<Board>,
  options?: UpdateBoardOptions,
) {
  const supabase = createClient();

  const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  let data: Board | null = null;

  if (Object.keys(cleanedUpdates).length > 0) {
    const { data: updated, error } = await supabase
      .from('boards')
      .update(cleanedUpdates)
      .eq('id', boardId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }
    data = updated as Board;
  }

  const coverId =
    options?.coverMediaId != null && String(options.coverMediaId).trim() !== ''
      ? String(options.coverMediaId).trim()
      : null;

  if (coverId) {
    const { error: rpcError } = await updateBoardDetails({
      boardId,
      coverMediaId: coverId,
      applyCoverMedia: true,
    });
    if (rpcError) {
      return { data: null, error: rpcError };
    }
  }

  if (!data) {
    const { data: board, error: fetchError } = await getBoardById(boardId);
    if (fetchError) {
      return { data: null, error: fetchError };
    }
    return { data: board, error: null };
  }

  return { data, error: null };
}

export async function publishBoard(
  boardId: string,
  options?: { coverMediaId?: string | null },
) {
  const supabase = createClient();

  const { data: existingBoard, error: fetchError } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single();

  if (fetchError) {
    return {
      data: null,
      error: {
        ...fetchError,
        message: `Failed to find board: ${fetchError.message}`,
      },
    };
  }

  if (!existingBoard) {
    return {
      data: null,
      error: { message: 'Board not found. Please try creating the board again.' },
    };
  }

  if (existingBoard.status === 'live' || existingBoard.status === 'published') {
    return { data: existingBoard, error: null };
  }

  const detailInput: UpdateBoardDetailsInput = {
    boardId,
    status: 'live',
  };
  if (options?.coverMediaId) {
    detailInput.applyCoverMedia = true;
    detailInput.coverMediaId = options.coverMediaId;
  }

  const { error: rpcError } = await updateBoardDetails(detailInput);

  if (rpcError) {
    return {
      data: null,
      error: {
        ...rpcError,
        message: `Failed to publish board: ${rpcError.message}${rpcError.hint ? ` (Hint: ${rpcError.hint})` : ''}`,
      },
    };
  }

  const { data, error } = await supabase.from('boards').select('*').eq('id', boardId).single();

  if (error) {
    return {
      data: null,
      error: {
        ...error,
        message: `Failed to load board after publish: ${error.message}`,
      },
    };
  }

  return { data, error: null };
}

export async function publishMultipleBoards(boardIds: string[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .update({
      status: 'live',
      published_at: new Date().toISOString()
    })
    .in('id', boardIds)
    .select();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function addBoardGiftOptions(boardId: string, giftOptions: Array<{
  amount: number;
  label?: string;
  description?: string;
  is_custom?: boolean;
}>) {
  const supabase = createClient();

  const optionsWithBoardId = giftOptions.map((option, index) => ({
    ...option,
    board_id: boardId,
    display_order: index
  }));

  const { data, error } = await supabase
    .from('board_gift_options')
    .insert(optionsWithBoardId)
    .select();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getBoardGiftOptions(boardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('board_gift_options')
    .select('*')
    .eq('board_id', boardId)
    .order('display_order', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export type GiftPaymentProvider = 'stripe' | 'paypal' | 'apple_pay' | 'google_pay';

export interface CreateGiftPaymentIntentInput {
  boardId: string;
  userId: string;
  amount: number;
  currency?: string;
  /** FK → board_gift_options.id (optional for custom amounts) */
  boardGiftOptionId?: string | null;
  giftMessage?: string | null;
  provider?: GiftPaymentProvider;
  /**
   * Unique per attempt key used server-side to prevent duplicate charges
   * when the same request is retried. Auto-generated when omitted.
   */
  idempotencyKey?: string;
  providerMetadata?: Record<string, unknown>;
}

/** Raw RPC response — keep loose; fields depend on provider. */
export interface CreateGiftPaymentIntentResponse {
  success?: boolean;
  payment_intent_id?: string;
  client_secret?: string;
  status?: string;
  provider?: GiftPaymentProvider;
  amount?: number;
  currency?: string;
  idempotency_key?: string;
  [key: string]: unknown;
}

/**
 * Calls `create_gift_payment_intent` RPC to open a payment intent for a gift
 * contribution. Returns the intent payload (e.g. `client_secret`) which the
 * caller then hands to the payment provider (Stripe Elements, etc.) to
 * complete the charge.
 *
 * Always generates a fresh idempotency key if one isn't passed — this is what
 * guards the server against duplicate inserts on retry.
 */
export async function createGiftPaymentIntent(input: CreateGiftPaymentIntentInput) {
  const supabase = createClient();

  if (!input.boardId) {
    return {
      data: null,
      error: { message: 'boardId is required to create a gift payment intent' },
    };
  }
  if (!input.userId) {
    return {
      data: null,
      error: { message: 'userId is required to create a gift payment intent' },
    };
  }
  if (!(typeof input.amount === 'number' && input.amount > 0)) {
    return {
      data: null,
      error: { message: 'A positive amount is required to create a gift payment intent' },
    };
  }

  const idempotencyKey =
    input.idempotencyKey ??
    (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `gift_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const rpcParams: Record<string, unknown> = {
    p_board_id: input.boardId,
    p_user_id: input.userId,
    p_amount: input.amount,
    p_currency: input.currency ?? 'USD',
    p_board_gift_option_id: input.boardGiftOptionId ?? null,
    p_gift_message: input.giftMessage ?? null,
    p_provider: input.provider ?? 'stripe',
    p_idempotency_key: idempotencyKey,
    p_provider_metadata: input.providerMetadata ?? {},
  };

  const { data, error } = await supabase.rpc('create_gift_payment_intent', rpcParams);

  if (error) {
    return { data: null, error, idempotencyKey };
  }

  return {
    data: data as CreateGiftPaymentIntentResponse,
    error: null,
    idempotencyKey,
  };
}

export type GiftStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface BoardGift {
  id: string;
  board_id: string;
  amount: number;
  currency: string;
  status: GiftStatus | string;
  message?: string | null;
  gift_message?: string | null;
  created_at: string;
  updated_at?: string | null;
  board_gift_option_id?: string | null;
  /** When available, the option label (e.g. "Cake Treat"). */
  gift_option_label?: string | null;
  provider?: string | null;
  payment_intent_id?: string | null;
  gifter?: {
    id: string;
    name?: string | null;
    profile_pic_url?: string | null;
    is_verified?: boolean | null;
  } | null;
  /** Allow passthrough of unexpected RPC fields. */
  [key: string]: unknown;
}

export interface GetBoardGiftsPagination {
  total?: number;
  limit?: number;
  offset?: number;
  has_more?: boolean;
}

export interface GetBoardGiftsResult {
  gifts: BoardGift[];
  total: number;
  total_amount: number;
  pagination: GetBoardGiftsPagination | null;
}

export interface GetBoardGiftsOptions {
  limit?: number;
  offset?: number;
  /** null → all statuses; default 'completed' to match server behavior. */
  status?: GiftStatus | null;
}

function unwrapBoardGiftsPayload(data: unknown): {
  gifts: BoardGift[];
  total: number;
  total_amount: number;
  pagination: GetBoardGiftsPagination | null;
} {
  const empty = { gifts: [] as BoardGift[], total: 0, total_amount: 0, pagination: null };
  if (data == null) return empty;

  if (Array.isArray(data)) {
    const gifts = data.filter((r) => r && typeof r === 'object') as BoardGift[];
    return {
      gifts,
      total: gifts.length,
      total_amount: gifts.reduce((sum, g) => sum + (Number(g.amount) || 0), 0),
      pagination: null,
    };
  }

  if (typeof data !== 'object') return empty;
  const o = data as Record<string, unknown>;

  const inner =
    (o.success === true && o.data != null ? o.data : undefined) ?? o.data ?? o;
  const innerObj = (inner && typeof inner === 'object' ? inner : {}) as Record<
    string,
    unknown
  >;

  const rawGifts =
    (Array.isArray(innerObj.gifts) && innerObj.gifts) ||
    (Array.isArray(innerObj.items) && innerObj.items) ||
    (Array.isArray(innerObj.rows) && innerObj.rows) ||
    (Array.isArray(innerObj.results) && innerObj.results) ||
    [];

  const gifts = (rawGifts as unknown[]).filter(
    (r) => r && typeof r === 'object'
  ) as BoardGift[];

  const pagination =
    innerObj.pagination && typeof innerObj.pagination === 'object'
      ? (innerObj.pagination as GetBoardGiftsPagination)
      : null;

  const total =
    typeof innerObj.total === 'number'
      ? innerObj.total
      : pagination?.total ?? gifts.length;

  const total_amount =
    typeof innerObj.total_amount === 'number'
      ? innerObj.total_amount
      : gifts.reduce((sum, g) => sum + (Number(g.amount) || 0), 0);

  return { gifts, total, total_amount, pagination };
}

/**
 * Calls `get_board_gifts` RPC. `viewerId` is required because the server
 * uses it to decide what metadata the current user is allowed to see.
 * `status` defaults to `'completed'`; pass `null` to include all statuses.
 */
export async function getBoardGifts(
  boardId: string,
  viewerId: string,
  options?: GetBoardGiftsOptions
): Promise<{ data: GetBoardGiftsResult | null; error: unknown }> {
  const supabase = createClient();

  if (!boardId) {
    return { data: null, error: { message: 'boardId is required' } };
  }
  if (!viewerId) {
    return { data: null, error: { message: 'viewerId is required' } };
  }

  const status = options?.status === undefined ? 'completed' : options.status;

  const rpcParams: Record<string, unknown> = {
    p_board_id: boardId,
    p_viewer_id: viewerId,
    p_limit: options?.limit ?? 10,
    p_offset: options?.offset ?? 0,
    p_status: status,
  };

  const { data, error } = await supabase.rpc('get_board_gifts', rpcParams);

  if (error) {
    return { data: null, error };
  }

  return { data: unwrapBoardGiftsPayload(data), error: null };
}

export async function addGiftContribution(
  boardId: string,
  contributorId: string,
  giftData: {
    amount: number;
    gift_option_id?: string;
    message?: string;
    is_custom: boolean;
  }
) {
  const supabase = createClient();

  const { data: currentBoard, error: boardError } = await supabase
    .from('boards')
    .select('total_raised, contributors_count')
    .eq('id', boardId)
    .single();

  if (boardError || !currentBoard) {
    return { data: null, error: boardError || new Error('Board not found') };
  }

  const giftOptionData: any = {
    board_id: boardId,
    amount: giftData.amount,
    label: giftData.gift_option_id || `Custom Gift - $${giftData.amount}`,
    description: giftData.message || undefined,
    is_custom: giftData.is_custom,
    display_order: 0
  };

  try {
    giftOptionData.contributor_id = contributorId;
  } catch (e) {
  }

  const { data, error } = await supabase
    .from('board_gift_options')
    .insert([giftOptionData])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  if (data) {
    const { data: currentBoard, error: fetchError } = await supabase
      .from('boards')
      .select('total_raised, contributors_count')
      .eq('id', boardId)
      .single();

    if (!fetchError && currentBoard) {
      const newTotalRaised = (currentBoard.total_raised || 0) + giftData.amount;
      const newContributorsCount = (currentBoard.contributors_count || 0) + 1;

      await supabase
        .from('boards')
        .update({
          total_raised: newTotalRaised,
          contributors_count: newContributorsCount,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', boardId);
    }
  }

  return { data, error: null };
}

export async function setBoardCircleVisibility(boardId: string, circleIds: string[]) {
  const supabase = createClient();

  const visibilityRecords = circleIds.map(circleId => ({
    board_id: boardId,
    circle_id: circleId
  }));

  const { data, error } = await supabase
    .from('board_circle_visibility')
    .insert(visibilityRecords)
    .select();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export interface CreateWishInput {
  content: string;
  media_ids?: string[];
}

export async function addWishToBoard(boardId: string, senderId: string, wish: CreateWishInput) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('wishes')
    .insert([{
      board_id: boardId,
      sender_id: senderId,
      content: wish.content,
      media_ids: wish.media_ids || []
    }])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  await supabase
    .from('boards')
    .update({ wishes_count: data ? 1 : 0 })
    .eq('id', boardId);

  return { data, error: null };
}

export async function likeWish(wishId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('like_wish', {
      p_wish_id: wishId,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function unlikeWish(wishId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('unlike_wish', {
      p_wish_id: wishId,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export interface BoardParticipant {
  id: string;
  board_id: string;
  user_id: string;
  role: 'creator' | 'admin' | 'moderator' | 'contributor' | 'viewer';
  joined_via: string;
  contribution_count: number;
  joined_at: string;
  last_activity_at: string;
  invited_by: string | null;
  user: {
    id: string;
    name: string;
    profile_pic_url: string | null;
    is_verified?: boolean;
    city?: string;
    country?: string;
  };
  inviter: any | null;
}

export interface GetBoardParticipantsResponse {
  success: boolean;
  data: {
    participants: BoardParticipant[];
    total_participants: number;
    counts_by_role: {
      creator: number;
      admin: number;
      moderator: number;
      contributor: number;
      viewer: number;
    };
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
    filter_applied: string | null;
  };
}

export async function getBoardParticipants(
  boardId: string,
  options?: {
    limit?: number;
    offset?: number;
    role?: string;
    filter?: string;
  }
): Promise<{ data: GetBoardParticipantsResponse | null; error: any }> {
  const supabase = createClient();

  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }
    if (options?.role) {
      rpcParams.p_role = options.role;
    }
    if (options?.filter) {
      rpcParams.p_filter = options.filter;
    }

    const { data, error } = await supabase.rpc('get_board_participants', rpcParams);

    if (error) {
      return { data: null, error };
    }

    return { data: data as GetBoardParticipantsResponse, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export interface WishComment {
  comment_id: string;
  wish_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    profile_pic_url?: string | null;
  };
  replies?: WishComment[];
}

export async function addWishComment(
  wishId: string,
  content: string,
  parentCommentId?: string | null
): Promise<{ data: { comment_id: string } | null; error: any }> {
  const supabase = createClient();

  try {
    const rpcParams: any = {
      p_wish_id: wishId,
      p_content: content,
      p_parent_comment_id: parentCommentId || null,
    };

    const { data, error } = await supabase.rpc('add_wish_comment', rpcParams);

    if (error) {
      return { data: null, error };
    }

    return { data: data as { comment_id: string }, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export interface GetWishCommentsResponse {
  total: number;
  items: Array<{
    id: string;
    wish_id: string;
    user_id: string;
    content: string;
    parent_comment_id: string | null;
    created_at: string;
    updated_at: string;
    user: {
      id: string;
      name: string;
      profile_pic_url?: string | null;
    };
  }>;
}

export async function getWishComments(
  wishId: string,
  options?: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  }
): Promise<{ data: WishComment[]; total?: number; error: any }> {
  const supabase = createClient();

  try {

    const rootParams: any = {
      p_wish_id: wishId,
      p_parent_comment_id: null,
      p_limit: options?.limit || 50,
      p_offset: options?.offset || 0,
      p_include_deleted: options?.includeDeleted || false,
    };

    const { data: rootData, error: rootError } = await supabase.rpc(
      'get_wish_comments',
      rootParams
    );

    if (rootError) {
      return { data: [], error: rootError };
    }

    if (!rootData || !rootData.items || rootData.items.length === 0) {
      return { data: [], total: rootData?.total || 0, error: null };
    }

    const rootComments: WishComment[] = await Promise.all(
      rootData.items.map(async (comment: any) => {
        const commentObj: WishComment = {
          comment_id: comment.id || comment.comment_id,
          wish_id: comment.wish_id || wishId,
          user_id: comment.user_id || comment.user?.id,
          content: comment.content,
          parent_comment_id: null,
          created_at: comment.created_at,
          updated_at: comment.updated_at || comment.created_at,
          user: comment.user || {
            id: comment.user_id || comment.user?.id,
            name: comment.user?.name || 'Unknown User',
            profile_pic_url: comment.user?.profile_pic_url || null,
          },
          replies: [],
        };

        const replyParams: any = {
          p_wish_id: wishId,
          p_parent_comment_id: commentObj.comment_id,
          p_limit: 100,
          p_offset: 0,
          p_include_deleted: options?.includeDeleted || false,
        };

        const { data: replyData, error: replyError } = await supabase.rpc(
          'get_wish_comments',
          replyParams
        );

        if (!replyError && replyData && replyData.items) {
          commentObj.replies = replyData.items.map((reply: any) => ({
            comment_id: reply.id || reply.comment_id,
            wish_id: reply.wish_id || wishId,
            user_id: reply.user_id || reply.user?.id,
            content: reply.content,
            parent_comment_id: commentObj.comment_id,
            created_at: reply.created_at,
            updated_at: reply.updated_at || reply.created_at,
            user: reply.user || {
              id: reply.user_id || reply.user?.id,
              name: reply.user?.name || 'Unknown User',
              profile_pic_url: reply.user?.profile_pic_url || null,
            },
            replies: [],
          }));
        }

        return commentObj;
      })
    );

    return { data: rootComments, total: rootData.total, error: null };
  } catch (err) {
    return { data: [], error: err };
  }
}

export async function getWishCommentCount(wishId: string): Promise<{ count: number; error: any }> {
  const supabase = createClient();

  try {

    const { data: rootData, error: rootError } = await supabase.rpc('get_wish_comments', {
      p_wish_id: wishId,
      p_parent_comment_id: null,
      p_limit: 100,
      p_offset: 0,
      p_include_deleted: false,
    });

    if (rootError) {
      return { count: 0, error: rootError };
    }

    if (!rootData || !rootData.items || rootData.items.length === 0) {
      return { count: 0, error: null };
    }

    let totalCount = rootData.items.length;

    const replyCounts = await Promise.all(
      rootData.items.map(async (comment: any) => {
        const { data: replyData } = await supabase.rpc('get_wish_comments', {
          p_wish_id: wishId,
          p_parent_comment_id: comment.id,
          p_limit: 1,
          p_offset: 0,
          p_include_deleted: false,
        });
        return replyData?.total || 0;
      })
    );

    const totalReplies = replyCounts.reduce((sum: number, count: number) => sum + count, 0);
    return { count: totalCount + totalReplies, error: null };
  } catch (err) {
    return { count: 0, error: err };
  }
}

export interface BoardMemory {
  wish_id: string;
  board_id: string;
  content: string;
  tag: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  likes_count: number;
  media_count: number;
  comments_count: number;
  media: Array<{
    id: string;
    url: string;
    filename: string;
    mime_type: string;
    created_at: string;
    dimensions: any;
    media_type: 'image' | 'video' | 'audio' | 'document';
    size_bytes: number;
    thumbnails: any;
    duration_seconds: number | null;
    processing_status: string;
  }>;
  wisher: {
    id: string;
    name: string;
    is_verified: boolean;
    profile_pic_url: string | null;
  };
}

export interface GetBoardMemoriesResponse {
  success: boolean;
  data: {
    memories: BoardMemory[];
    pagination: {
      limit: number;
      total: number;
      offset: number;
      has_more: boolean;
    };
    total_media: number;
    total_wishes: number;
    media_counts_by_type: {
      audio: number;
      image: number;
      video: number;
      document: number;
    };
  };
}

export type BoardMediaScope = 'all' | 'board_direct' | 'wish_attached';
export type BoardMediaOrderDir = 'asc' | 'desc';
export type BoardMediaType = 'image' | 'video' | 'audio' | 'document';

export interface GetBoardMediaParams {
  boardId: string;
  viewerId: string;
  limit?: number;
  offset?: number;
  scope?: BoardMediaScope;
  orderBy?: string;
  orderDir?: BoardMediaOrderDir;
  mediaType?: BoardMediaType;
  processingStatus?: string;
  minSizeBytes?: number;
}

export type BoardMediaItem = Record<string, unknown>;

function normalizeBoardMediaPayload(data: unknown): BoardMediaItem[] {
  if (data == null) return [];
  if (typeof data === 'string') {
    try {
      return normalizeBoardMediaPayload(JSON.parse(data));
    } catch {
      return [];
    }
  }
  if (Array.isArray(data)) {
    return data.filter((row) => row != null && typeof row === 'object') as BoardMediaItem[];
  }
  if (typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const directNested = d.media ?? d.items ?? d.rows ?? d.results;
    if (Array.isArray(directNested)) {
      return directNested.filter((row) => row != null && typeof row === 'object') as BoardMediaItem[];
    }

    if (d.data !== undefined) {
      const fromData = normalizeBoardMediaPayload(d.data);
      if (fromData.length > 0) return fromData;
    }

    return [d];
  }
  return [];
}

export async function getBoardMedia(
  params: GetBoardMediaParams
): Promise<{ data: BoardMediaItem[]; error: Error | null }> {
  const supabase = createClient();
  const {
    boardId,
    viewerId,
    limit = 20,
    offset = 0,
    scope = 'all',
    orderBy = 'created_at',
    orderDir = 'desc',
    mediaType,
    processingStatus,
    minSizeBytes,
  } = params;

  const rpcParams: Record<string, unknown> = {
    p_board_id: boardId,
    p_viewer_id: viewerId,
    p_limit: limit,
    p_offset: offset,
    p_scope: scope,
    p_order_by: orderBy,
    p_order_dir: orderDir,
  };

  if (mediaType) rpcParams.p_media_type = mediaType;
  if (processingStatus) rpcParams.p_processing_status = processingStatus;
  if (typeof minSizeBytes === 'number') rpcParams.p_min_size_bytes = minSizeBytes;

  const { data, error } = await supabase.rpc('get_board_media', rpcParams);

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return { data: normalizeBoardMediaPayload(data), error: null };
}

export async function getBoardMemories(
  boardId: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<{ data: GetBoardMemoriesResponse | null; error: any }> {
  const supabase = createClient();

  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }

    const { data, error } = await supabase.rpc('get_board_memories', rpcParams);

    if (error) {
      return { data: null, error };
    }

    return { data: data as GetBoardMemoriesResponse, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getBoardWishes(
  boardId: string,
  currentUserId?: string,
  options?: {
    limit?: number;
    offset?: number;
  }
) {
  const supabase = createClient();

  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }

    const { data: wishesData, error: wishesError } = await supabase.rpc(
      'get_board_wishes',
      rpcParams
    );

    if (wishesError) {
      return { data: [], error: wishesError };
    }

    if (!wishesData || wishesData.length === 0) {
      return { data: [], error: null };
    }

    const wishIds = wishesData.map((w: any) => w.wish_id);
    let userLikesSet: Set<string> = new Set();

    if (currentUserId && wishIds.length > 0) {
      const { data: likesData } = await supabase
        .from('wish_likes')
        .select('wish_id')
        .in('wish_id', wishIds)
        .eq('user_id', currentUserId);

      if (likesData) {
        likesData.forEach((like: any) => {
          userLikesSet.add(like.wish_id);
        });
      }
    }

    const wishesWithDetails = wishesData.map((wish: any) => {

      const media: Array<{
        id: string;
        media_type: string;
        cdn_url: string;
        thumbnail_url?: string;
      }> = [];

      if (wish.photos && Array.isArray(wish.photos)) {
        wish.photos.forEach((photo: any) => {
          media.push({
            id: photo.id || photo.media_id,
            media_type: 'image',
            cdn_url: photo.cdn_url || photo.url,
            thumbnail_url: photo.thumbnail_url,
          });
        });
      }

      if (wish.videos && Array.isArray(wish.videos)) {
        wish.videos.forEach((video: any) => {
          media.push({
            id: video.id || video.media_id,
            media_type: 'video',
            cdn_url: video.cdn_url || video.url,
            thumbnail_url: video.thumbnail_url,
          });
        });
      }

      return {
        id: wish.wish_id,
        content: wish.content,
        created_at: wish.created_at,
        sender: {
          id: wish.sender_id,
          name: wish.sender_name || 'Unknown User',
          profile_pic_url: wish.sender_profile_pic_url || null,
        },
        media,
        giftAmount: wish.gift_amount || 0,
        likesCount: wish.likes_count || 0,
        isLiked: userLikesSet.has(wish.wish_id),
        commentsCount: wish.comments_count || 0,
        tag: wish.tag,
        is_pinned: wish.is_pinned || false,
        is_featured: wish.is_featured || false,
        music: wish.music || [],
      };
    });

    return { data: wishesWithDetails, error: null };
  } catch (err) {
    return { data: [], error: err };
  }
}

/**
 * Parse wish id from `create_wish` RPC payload. Handles composite/SETOF rows as arrays,
 * nested `{ data }` / `{ wish }` wrappers, and common key names from Postgres/PostgREST.
 */
export function wishIdFromCreateWishResponse(data: unknown): string | null {
  const tryRecord = (o: Record<string, unknown>): string | null => {
    for (const key of [
      'wish_id',
      'id',
      'wishId',
      'public_id',
      'p_wish_id',
      'out_wish_id',
      'new_wish_id',
    ] as const) {
      const v = o[key];
      if (typeof v === 'string' && v.length > 0) return v;
    }
    return null;
  };

  if (data == null) return null;
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return wishIdFromCreateWishResponse(JSON.parse(trimmed));
      } catch {
        return null;
      }
    }
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(data) && data.length > 0) {
    return wishIdFromCreateWishResponse(data[0]);
  }
  if (typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  const direct = tryRecord(o);
  if (direct) return direct;
  for (const wrap of ['data', 'wish', 'result', 'create_wish', 'row']) {
    const inner = o[wrap];
    if (inner != null && typeof inner === 'object') {
      const id = wishIdFromCreateWishResponse(inner);
      if (id) return id;
    }
  }
  return null;
}

/** When the RPC succeeds but returns no parseable id, load the row we just created. */
export async function resolveWishIdAfterCreate(
  supabase: ReturnType<typeof createClient>,
  boardId: string,
  senderId: string
): Promise<string | null> {
  const tryOrder = async (orderCol?: 'created_at' | 'id') => {
    let q = supabase
      .from('wishes')
      .select('id, wish_id')
      .eq('board_id', boardId)
      .eq('sender_id', senderId)
      .limit(1);
    if (orderCol) {
      q = q.order(orderCol, { ascending: false });
    }
    return q.maybeSingle();
  };

  const pickId = (data: { id?: string; wish_id?: string } | null) => {
    if (!data) return null;
    if (typeof data.id === 'string' && data.id.length > 0) return data.id;
    if (typeof data.wish_id === 'string' && data.wish_id.length > 0) return data.wish_id;
    return null;
  };

  for (const col of ['created_at', 'id'] as const) {
    const { data, error } = await tryOrder(col);
    if (!error && data) {
      const id = pickId(data as { id?: string; wish_id?: string });
      if (id) return id;
    }
  }

  return null;
}

export async function uploadBoardMedia(
  boardId: string,
  userId: string,
  file: File,
  mediaType: 'image' | 'video' | 'audio',
  wishId: string
) {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${boardId}/${wishId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const bucketName = STORAGE_BUCKETS.WISH_MEDIA;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('media')
    .insert([{
      uploader_id: userId,
      board_id: boardId,
      bucket: bucketName,
      path: fileName,
      filename: file.name,
      media_type: mediaType,
      mime_type: file.type,
      size_bytes: file.size,
      cdn_url: publicUrl
    }])
    .select()
    .single();

  if (error) {
    await supabase.storage.from(bucketName).remove([fileName]);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function uploadMultipleBoardMedia(
  boardId: string,
  userId: string,
  files: File[],
  wishId: string
) {
  const supabase = createClient();
  const bucketName = STORAGE_BUCKETS.WISH_MEDIA;
  const results: { success: string[], failed: string[] } = { success: [], failed: [] };

  for (const file of files) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${boardId}/${wishId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        results.failed.push(file.name);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const mediaType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'audio';

      const { data, error } = await supabase
        .from('media')
        .insert([{
          uploader_id: userId,
          board_id: boardId,
          bucket: bucketName,
          path: fileName,
          filename: file.name,
          media_type: mediaType,
          mime_type: file.type,
          size_bytes: file.size,
          cdn_url: publicUrl
        }])
        .select()
        .single();

      if (error) {
        await supabase.storage.from(bucketName).remove([fileName]);
        results.failed.push(file.name);
      } else if (data) {
        results.success.push(data.id);
      }
    } catch (err) {
      results.failed.push(file.name);
    }
  }

  return { data: results, error: null };
}

export async function createBoardInvitation(
  boardId: string,
  inviterId: string,
  inviteeEmail?: string,
  inviteePhone?: string
) {
  const supabase = createClient();

  const invitationCode = `${boardId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const { data, error } = await supabase
    .from('board_invitations')
    .insert([{
      board_id: boardId,
      inviter_id: inviterId,
      invitee_email: inviteeEmail,
      invitee_phone: inviteePhone,
      invitation_code: invitationCode,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createOrUpdateBoard(
  userId: string,
  boardId: string | null,
  updates: Partial<CreateBoardInput>
) {
  if (boardId) {
    return updateBoard(boardId, updates as Partial<Board>);
  } else {
    return createBoard(userId, {
      title: updates.title || 'Untitled Board',
      ...updates
    });
  }
}

export async function fetchLiveBoards(options?: {
  limit?: number;
  offset?: number;
  includePrivacy?: string[];
}) {
  const supabase = createClient();

  let query = supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (options?.includePrivacy) {
    query = query.in('privacy', options.includePrivacy);
  } else {
    query = query.eq('privacy', 'public');
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  try {
    const { data, error } = await query;

    if (error) {
      return { boards: [], error };
    }

    if (data) {

      const boardIds = data.map((board: { id: string }) => board.id);

      const { data: allParticipants } = await supabase
        .from('board_participants')
        .select('board_id')
        .in('board_id', boardIds);

      const { data: allWishes } = await supabase
        .from('wishes')
        .select('board_id')
        .in('board_id', boardIds);

      const { data: allMedia } = await supabase
        .from('media')
        .select('board_id')
        .in('board_id', boardIds);

      const participantCounts = (allParticipants || []).reduce(
        (acc: Record<string, number>, p: { board_id: string }) => {
        acc[p.board_id] = (acc[p.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const wishesCounts = (allWishes || []).reduce(
        (acc: Record<string, number>, w: { board_id: string }) => {
        acc[w.board_id] = (acc[w.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mediaCounts = (allMedia || []).reduce(
        (acc: Record<string, number>, m: { board_id: string }) => {
        acc[m.board_id] = (acc[m.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const boardsWithCounts = data.map((board: Board) => ({
        ...board,
        participants_count: participantCounts[board.id] || 0,
        wishes_count: wishesCounts[board.id] || 0,
        media_count: mediaCounts[board.id] || 0
      }));

      return { boards: boardsWithCounts, error: null };
    }

    return { boards: [], error: null };
  } catch (err) {
    return { boards: [], error: err };
  }
}

export async function fetchActiveBoards(options?: {
  userId?: string;
  includeStatus?: string[];
  includePrivacy?: string[];
  showAll?: boolean;
}) {
  const supabase = createClient();

  let query = supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      board_participants!inner (
        user_id,
        role
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `);

  if (options?.userId) {
    query = query.eq('board_participants.user_id', options.userId);
  }

  if (!options?.showAll) {
    if (options?.includeStatus) {
      query = query.in('status', options.includeStatus);
    } else {
      query = query.in('status', ['published', 'draft']);
    }

    if (options?.includePrivacy) {
      query = query.in('privacy', options.includePrivacy);
    }
  }

  try {
    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      return { boards: [], error };
    }

    if (data) {

      const boardIds = data.map((board: { id: string }) => board.id);

      const { data: allInvitations } = await supabase
        .from('board_invitations')
        .select('board_id')
        .in('board_id', boardIds);

      const { data: allMedia } = await supabase
        .from('media')
        .select('board_id')
        .in('board_id', boardIds);

      const invitationCounts = (allInvitations || []).reduce(
        (acc: Record<string, number>, inv: { board_id: string }) => {
        acc[inv.board_id] = (acc[inv.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mediaCounts = (allMedia || []).reduce(
        (acc: Record<string, number>, media: { board_id: string }) => {
        acc[media.board_id] = (acc[media.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const boardsWithCounts = data.map((board: Board) => ({
        ...board,
        invited_count: invitationCounts[board.id] || 0,
        media_count: mediaCounts[board.id] || 0
      }));

      return { boards: boardsWithCounts || [], error: null };
    }

    return { boards: [], error: null };
  } catch (err) {
    return { boards: [], error: err };
  }
}

export async function fetchUserBoards(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      )
    `)
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { boards: [], error };
  }

  return { boards: data || [], error: null };
}

export async function searchBoards(query: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('status', 'published')
    .eq('privacy', 'public')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    return { boards: [], error };
  }

  return { boards: data || [], error: null };
}

export async function getBoardStats(boardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('boards')
    .select('total_raised, contributors_count, wishes_count, views_count, shares_count')
    .eq('id', boardId)
    .single();

  if (error) {
    return { stats: null, error };
  }

  return { stats: data, error: null };
}

export async function incrementBoardView(boardId: string) {
  const supabase = createClient();

  await supabase.rpc('increment_board_views', {
    board_id: boardId
  });
}

export interface InviteUserToBoardParams {
  boardId: string;
  inviteeUserId?: string | null;
  inviteeEmail?: string | null;
  inviteePhone?: string | null;
  role?: 'contributor' | 'viewer' | 'admin';
  expiresAt?: string | null;
}

export async function inviteUserToBoard({
  boardId,
  inviteeUserId = null,
  inviteeEmail = null,
  inviteePhone = null,
  role = 'contributor',
  expiresAt = null,
}: InviteUserToBoardParams) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('invite_user_to_board', {
    p_board_id: boardId,
    p_invitee_user_id: inviteeUserId,
    p_invitee_email: inviteeEmail,
    p_invitee_phone: inviteePhone,
    p_role: role,
    p_expires_at: expiresAt,
  });

  if (error) {
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data, error: null };
}

export interface BoardInvitationInvitee {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  profile_pic_url?: string | null;
}

export interface BoardInvitation {
  id: string;
  status: string;
  invitee?: BoardInvitationInvitee | null;
}

export async function getBoardInvitations(boardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_board_invitations', {
    p_board_id: boardId,
  });

  if (error) {
    return { invitations: [] as BoardInvitation[], error };
  }

  const raw = data as { data?: { invitations?: BoardInvitation[] } } | null;
  const list = raw?.data?.invitations ?? [];

  return { invitations: list, error: null };
}

/** Profile → Boards → "Birthday boards" tab (mobile: get_user_boards, p_status: yours). */
export async function getUserBoardsYours(
  userId: string,
  opts?: { limit?: number; offset?: number; search?: string | null }
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_boards', {
    p_user_id: userId,
    p_status: 'yours',
    p_limit: opts?.limit ?? 50,
    p_offset: opts?.offset ?? 0,
    p_search: opts?.search ?? null,
  });

  if (error) {
    return { boards: [] as any[], pagination: null as Record<string, unknown> | null, error };
  }

  const responseData = (data as { data?: { boards?: unknown[]; pagination?: Record<string, unknown> } })?.data ?? data;
  const boards = (responseData as { boards?: unknown[] })?.boards ?? [];
  const pagination = (responseData as { pagination?: Record<string, unknown> | null })?.pagination ?? null;

  return { boards, pagination, error: null };
}

/** Profile → Boards → "Invite sent" / "Decline Boards" (mobile: get_user_invitations). */
export async function getUserInvitationsForList(params: {
  p_status?: string | null;
  p_direction?: string | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_invitations', {
    p_status: params.p_status ?? null,
    p_direction: params.p_direction ?? null,
  });

  if (error) {
    return { invitations: [] as any[], error };
  }

  if (Array.isArray(data)) {
    return { invitations: data, error: null };
  }

  const wrapped = data as { invitations?: unknown[]; data?: unknown[] } | null;
  const list = wrapped?.invitations ?? wrapped?.data ?? [];
  return { invitations: Array.isArray(list) ? list : [], error: null };
}
