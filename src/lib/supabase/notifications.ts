import { createClient } from './client';
import type {
  NotificationRow,
  NotificationWithActor,
  SendNotificationInput,
} from '@/types/notification';

const NOTIFICATIONS_TABLE = 'notifications';

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
    .select(
      `*, actor:profiles!notifications_actor_id_fkey(id, name, profile_pic_url)`
    )
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
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return {
      data: (fallback.data as NotificationWithActor[]) || [],
      error: fallback.error as Error | null,
    };
  }
  return { data: (data as NotificationWithActor[]) || [], error: null };
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
    .select('*')
    .single();

  return {
    data: (data as NotificationRow) || null,
    error: error as Error | null,
  };
}
