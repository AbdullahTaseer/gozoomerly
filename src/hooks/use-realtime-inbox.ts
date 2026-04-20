'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface UseRealtimeInboxOptions {
  currentUserId: string | null;
  onRealtimeEvent?: (reason: string) => void;
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

    const markSubscribed = () => {
      if (!anySubscribed) {
        anySubscribed = true;
        setIsConnected(true);
        setError(null);
        onResumeRef.current?.();
      }
    };

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
            `A:messages INSERT (conv=${String(row?.conversation_id || '').slice(0, 8)})`
          );
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (status === 'SUBSCRIBED') {
          markSubscribed();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError(new Error(`A:messages ${status}: ${err?.message || ''}`));
        }
      });

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
            `B:participant UPDATE (conv=${String(row?.conversation_id || '').slice(0, 8)})`
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
        if (status === 'SUBSCRIBED') {
          markSubscribed();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError(new Error(`B:participants ${status}: ${err?.message || ''}`));
        }
      });

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
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') markSubscribed();
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
