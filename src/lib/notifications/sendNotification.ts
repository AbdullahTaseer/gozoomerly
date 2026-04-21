import { createClient } from '@/lib/supabase/client';
import { insertNotification } from '@/lib/supabase/notifications';
import type { NotificationRow, SendNotificationInput } from '@/types/notification';


export async function sendNotification(
  input: SendNotificationInput
): Promise<{ data: NotificationRow | null; error: Error | null }> {
  const supabase = createClient();

 
  let authUid: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    authUid = data.user?.id ?? null;
  } catch {
    authUid = null;
  }

  const actorId = input.actor_id ?? authUid;

  if (process.env.NODE_ENV !== 'production') {
    if (authUid && actorId && authUid !== actorId) {
      console.warn(
        '[sendNotification] actor_id does not match authenticated user. ' +
          'RLS will reject this insert. ' +
          `actor_id=${actorId} auth.uid()=${authUid}`
      );
    }
    if (!authUid) {
      console.warn(
        '[sendNotification] no authenticated user. RLS will reject this insert.'
      );
    }
  }

  // Don't notify yourself.
  if (actorId && actorId === input.recipient_id) {
    return { data: null, error: null };
  }

  const { data: row, error } = await insertNotification({ ...input, actor_id: actorId });
  if (error || !row) {
    console.warn('[sendNotification] insert failed:', {
      message: (error as { message?: string } | null)?.message,
      recipient_id: input.recipient_id,
      actor_id: actorId,
      authUid,
      type: input.type,
    });
    return { data: null, error };
  }

  if (input.push !== false) {
    // Fire and forget; a failed push shouldn't roll back the in-app row.
    void fetch('/api/notifications/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notification_id: row.id,
        recipient_id: input.recipient_id,
        title: input.title,
        body: input.body ?? '',
        url: input.url,
        data: input.data,
      }),
    }).catch((err) => {
      console.warn('[sendNotification] push failed:', err);
    });
  }

  return { data: row, error: null };
}
