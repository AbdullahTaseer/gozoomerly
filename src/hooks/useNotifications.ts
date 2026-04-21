'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/supabase/notifications';
import type {
  NotificationRow,
  NotificationWithActor,
} from '@/types/notification';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UseNotificationsResult {
  userId: string | null;
  notifications: NotificationWithActor[];
  loading: boolean;
  error: Error | null;
  unreadCount: number;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export function useNotifications(limit = 50): UseNotificationsResult {
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationWithActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabaseRef = useRef(createClient());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const authRef = useRef(new AuthService());

  const refresh = useCallback(async () => {
    if (!userId) return;
    setError(null);
    const { data, error: err } = await listNotifications(userId, { limit });
    if (err) setError(err);
    setNotifications(data);
  }, [userId, limit]);

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
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error: err } = await listNotifications(userId, { limit });
      if (cancelled) return;
      if (err) setError(err);
      setNotifications(data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, limit]);

  useEffect(() => {
    if (!userId) return;

    const supabase = supabaseRef.current;
    const topic = `notifications:${userId}:${
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
          setNotifications((prev) => {
            if (prev.some((n) => n.id === row.id)) return prev;
            return [row as NotificationWithActor, ...prev].slice(0, limit);
          });
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
          const row = payload.new as NotificationRow;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === row.id ? ({ ...n, ...row } as NotificationWithActor) : n
            )
          );
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
          const oldRow = payload.old as { id?: string };
          if (!oldRow?.id) return;
          setNotifications((prev) => prev.filter((n) => n.id !== oldRow.id));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId, limit]);

  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      )
    );
    const { error: err } = await markNotificationRead(id);
    if (err) setError(err);
  }, []);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.is_read ? n : { ...n, is_read: true, read_at: now }))
    );
    const { error: err } = await markAllNotificationsRead(userId);
    if (err) setError(err);
  }, [userId]);

  const unreadCount = notifications.reduce(
    (acc, n) => acc + (n.is_read ? 0 : 1),
    0
  );

  return {
    userId,
    notifications,
    loading,
    error,
    unreadCount,
    refresh,
    markRead,
    markAllRead,
  };
}
