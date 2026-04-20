'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * User-wide realtime inbox.
 *
 * Fires `onRealtimeEvent` the instant any signal we can pick up tells us
 * the user's conversation list may have changed. Caller re-runs
 * `get_user_conversations` and the RPC is the source of truth.
 *
 * We open THREE independent channels, each with a single simple
 * subscription. Independent channels — not bindings on one channel —
 * because Supabase Realtime drops events on channels that carry many
 * bindings (hitting the per-channel binding ceiling silently). Three
 * separate channels each with 1–2 bindings stays well under any limit.
 *
 *   Channel A — `inbox-messages:<me>`
 *     `postgres_changes` INSERT on `public.messages` (no filter).
 *     Supabase Realtime evaluates row-level security per user, so this
 *     only streams messages the user is allowed to SELECT.
 *
 *   Channel B — `inbox-participants:<me>`
 *     `postgres_changes` UPDATE + INSERT on `public.conversation_participants`
 *     where `user_id = <me>`. The existing `update_conversation_unread_count`
 *     trigger writes to this row on every message insert, so UPDATE fires
 *     deterministically; INSERT fires when the user is added to a new
 *     conversation.
 *
 *   Channel C — `inbox-conversations:<me>`
 *     `postgres_changes` UPDATE on `public.conversations` (no filter).
 *     Many apps have a trigger that bumps `last_message_at` / `last_message`
 *     on the conversations row when a new message arrives. If yours does,
 *     this fires; if not, it stays silent and doesn't hurt.
 *
 * Any one delivering is enough. If your Supabase publication only has one
 * of these tables enabled, the inbox still works.
 *
 * Prerequisite: at least ONE of these tables must be in the
 * `supabase_realtime` publication. Enable via Supabase dashboard →
 * Database → Replication. No SQL or function edits required.
 */
export interface UseRealtimeInboxOptions {
  currentUserId: string | null;
  /** Fired immediately on any inbox-affecting realtime event. */
  onRealtimeEvent?: (reason: string) => void;
  /** Fired once per successful (re)subscribe on any of the three channels. */
  onResume?: () => void;
  enabled?: boolean;
}

export function useRealtimeInbox(options: UseRealtimeInboxOptions) {
  const { currentUserId, onRealtimeEvent, onResume, enabled = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const onRealtimeEventRef = useRef(onRealtimeEvent);
  const onResumeRef = useRef(onResume);

  useEffect(() => {
    onRealtimeEventRef.current = onRealtimeEvent;
    onResumeRef.current = onResume;
  }, [onRealtimeEvent, onResume]);

  const supabaseRef = useRef(createClient());

  /** Bumped on visibility/online/focus so mobile browsers re-subscribe on wake. */
  const [reconnectTick, setReconnectTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bump = () => setReconnectTick((t) => t + 1);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') bump();
    };

    window.addEventListener('online', bump);
    window.addEventListener('focus', bump);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('online', bump);
      window.removeEventListener('focus', bump);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const fireEvent = useCallback((reason: string) => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(`[inbox] realtime event → ${reason}`);
    }
    onRealtimeEventRef.current?.(reason);
  }, []);

  const teardown = useCallback(() => {
    for (const ch of channelsRef.current) {
      try {
        ch.unsubscribe();
      } catch {
        /* ignore */
      }
    }
    channelsRef.current = [];
  }, []);

  useEffect(() => {
    if (!enabled || !currentUserId) {
      teardown();
      setIsConnected(false);
      return;
    }

    teardown();

    const supabase = supabaseRef.current;
    let anySubscribed = false;

    // ── Channel A: messages INSERT (RLS-gated, no filter) ──
    const channelA = supabase
      .channel(`inbox-messages:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const row = payload.new as any;
          fireEvent(
            `A:messages INSERT (conv=${String(row?.conversation_id || '').slice(0, 8)}, sender=${String(row?.sender_id || '').slice(0, 8)})`
          );
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.log(`[inbox] A:messages ${status}`, err || '');
        }
        if (status === 'SUBSCRIBED') {
          if (!anySubscribed) {
            anySubscribed = true;
            setIsConnected(true);
            setError(null);
            onResumeRef.current?.();
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError(new Error(`A:messages ${status}: ${err?.message || ''}`));
        }
      });

    // ── Channel B: conversation_participants UPDATE + INSERT (filter user_id=me) ──
    const channelB = supabase
      .channel(`inbox-participants:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const row = payload.new as any;
          fireEvent(
            `B:participant UPDATE (conv=${String(row?.conversation_id || '').slice(0, 8)}, unread=${row?.unread_count})`
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const row = payload.new as any;
          fireEvent(
            `B:participant INSERT (conv=${String(row?.conversation_id || '').slice(0, 8)})`
          );
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.log(`[inbox] B:participants ${status}`, err || '');
        }
        if (status === 'SUBSCRIBED') {
          if (!anySubscribed) {
            anySubscribed = true;
            setIsConnected(true);
            setError(null);
            onResumeRef.current?.();
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError(new Error(`B:participants ${status}: ${err?.message || ''}`));
        }
      });

    // ── Channel C: conversations UPDATE (no filter, optional) ──
    const channelC = supabase
      .channel(`inbox-conversations:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const row = payload.new as any;
          fireEvent(
            `C:conversation UPDATE (id=${String(row?.id || '').slice(0, 8)})`
          );
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.log(`[inbox] C:conversations ${status}`, err || '');
        }
        if (status === 'SUBSCRIBED') {
          if (!anySubscribed) {
            anySubscribed = true;
            setIsConnected(true);
            setError(null);
            onResumeRef.current?.();
          }
        }
      });

    channelsRef.current = [channelA, channelB, channelC];

    return () => {
      teardown();
      setIsConnected(false);
    };
  }, [currentUserId, enabled, reconnectTick, fireEvent, teardown]);

  return {
    isConnected,
    error,
  };
}
