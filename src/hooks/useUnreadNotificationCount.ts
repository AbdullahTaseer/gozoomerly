'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import { getUnreadNotificationCount } from '@/lib/supabase/notifications';
import type { NotificationRow } from '@/types/notification';
import type { RealtimeChannel } from '@supabase/supabase-js';


export function useUnreadNotificationCount(): {
  userId: string | null;
  count: number;
  refresh: () => Promise<void>;
} {
  const [userId, setUserId] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const supabaseRef = useRef(createClient());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const authRef = useRef(new AuthService());

  const refresh = useCallback(async () => {
    if (!userId) {
      setCount(0);
      return;
    }
    const { count: c } = await getUnreadNotificationCount(userId);
    setCount(c);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await authRef.current.getUser();
      if (mounted) setUserId(user?.id ?? null);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;

    const supabase = supabaseRef.current;
    // Unique topic per mount so StrictMode double-invocation can't reuse a
    // channel that Supabase already considers subscribed.
    const topic = `notifications-unread:${userId}:${
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
    }`;
    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as NotificationRow;
          if (!row.is_read) setCount((c) => c + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const oldRow = payload.old as Partial<NotificationRow>;
          const newRow = payload.new as NotificationRow;
          const wasUnread = !oldRow.is_read;
          const isUnread = !newRow.is_read;
          if (wasUnread && !isUnread) setCount((c) => Math.max(0, c - 1));
          else if (!wasUnread && isUnread) setCount((c) => c + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const oldRow = payload.old as Partial<NotificationRow>;
          if (!oldRow.is_read) setCount((c) => Math.max(0, c - 1));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId]);

  return { userId, count, refresh };
}
