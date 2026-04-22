import { createClient } from './client';
import type {
  NotificationRow,
  NotificationWithActor,
  SendNotificationInput,
} from '@/types/notification';

const NOTIFICATIONS_TABLE = 'notifications';

/** Explicit columns — avoid `*` + embed joins that can make `board_id` ambiguous in PostgREST. */
const NOTIFICATION_LIST_COLUMNS = `
  id,
  user_id,
  type,
  title,
  body,
  data,
  actor_id,
  board_id,
  wish_id,
  is_read,
  is_pushed,
  pushed_at,
  created_at,
  read_at
`;

const NOTIFICATION_LIST_SELECT = `
  ${NOTIFICATION_LIST_COLUMNS.trim()},
  actor:profiles!notifications_actor_id_fkey (
    id,
    name,
    profile_pic_url
  )
`;

export interface ListNotificationsOptions {
  limit?: number;
  unreadOnly?: boolean;
  before?: string;
}

export async function listNotifications(
  userId: string,
  { limit = 30, unreadOnly = false, before }: ListNotificationsOptions = {}
): Promise<{ data: NotificationWithActor[]; error: Error | null }> {
  const supabase = createClient();

  let query = supabase
    .from(NOTIFICATIONS_TABLE)
    .select(NOTIFICATION_LIST_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) query = query.or('is_read.is.null,is_read.eq.false');
  if (before) query = query.lt('created_at', before);

  const { data, error } = await query;
  if (error) {
    // Fallback without the joined profile (in case FK name differs).
    const fallback = await supabase
      .from(NOTIFICATIONS_TABLE)
      .select(NOTIFICATION_LIST_COLUMNS.trim())
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return {
      data: ((fallback.data ?? []) as unknown) as NotificationWithActor[],
      error: fallback.error as Error | null,
    };
  }
  return {
    data: ((data ?? []) as unknown) as NotificationWithActor[],
    error: null,
  };
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<{ count: number; error: Error | null }> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .or('is_read.is.null,is_read.eq.false');
  return { count: count || 0, error: error as Error | null };
}

export async function markNotificationRead(
  id: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error as Error | null };
}

export async function markAllNotificationsRead(
  userId: string
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .or('is_read.is.null,is_read.eq.false');
  return { error: error as Error | null };
}


export async function insertNotification(
  input: SendNotificationInput & { actor_id?: string | null }
): Promise<{ data: NotificationRow | null; error: Error | null }> {
  const supabase = createClient();

  const payload = {
    user_id: input.recipient_id,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    actor_id: input.actor_id ?? null,
    board_id: input.board_id ?? null,
    wish_id: input.wish_id ?? null,
    data: input.data ?? null,
    is_read: false,
    is_pushed: false,
  };

  const { data, error } = await supabase
    .from(NOTIFICATIONS_TABLE)
    .insert(payload)
    .select('id')
    .single();

  if (error || !data?.id) {
    return { data: null, error: error as Error | null };
  }

  const row = {
    id: data.id,
    user_id: payload.user_id,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    data: (payload.data as Record<string, unknown> | null) ?? null,
    actor_id: payload.actor_id,
    board_id: payload.board_id,
    wish_id: payload.wish_id,
    is_read: payload.is_read ?? false,
    is_pushed: payload.is_pushed ?? false,
    pushed_at: null,
    created_at: new Date().toISOString(),
    read_at: null,
  } satisfies NotificationRow;

  return { data: row, error: null };
}
