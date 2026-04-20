'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { ChatMessage, ChatMessageMedia } from './use-realtime-chat';

/**
 * User-wide realtime inbox.
 *
 * Subscribes to every INSERT/UPDATE/DELETE on `public.messages` for the
 * current user — with NO `conversation_id` filter. Supabase Realtime honors
 * the authenticated user's RLS SELECT policy server-side, so we only receive
 * rows for conversations the user participates in. That gives us a single
 * long-lived channel (one per user, not one per open thread) that stays live
 * no matter which conversation is currently selected.
 *
 * Why this replaces the old polling:
 *   - 5s `loadConversations` poll existed because the old per-conversation
 *     channel only fired for the open thread. With a user-wide subscription
 *     every conversation's preview / unread badge / ordering updates live.
 *   - 3.5s `mergeLatestFromServer` poll existed as a safety net for missed
 *     inserts in the open thread. With the same stream covering the open
 *     thread too, that safety net only needs to run once on reconnect.
 */
export interface UseRealtimeInboxOptions {
  currentUserId: string | null;
  onMessageReceived?: (message: ChatMessage) => void;
  onMessageUpdated?: (message: ChatMessage) => void;
  /**
   * Fired for soft-delete (UPDATE with deleted_at) and hard-delete (DELETE).
   * `conversationId` may be null for hard-delete on databases that don't
   * stream the full old row (REPLICA IDENTITY != FULL).
   */
  onMessageDeleted?: (messageId: string, conversationId: string | null) => void;
  /**
   * Fired once per successful (re)subscribe. Use it to close gaps that may
   * have occurred while the socket was dropped — typically a single
   * `loadConversations` + `loadMessages(openConvId)` call.
   */
  onResume?: () => void;
  enabled?: boolean;
}

export function useRealtimeInbox(options: UseRealtimeInboxOptions) {
  const {
    currentUserId,
    onMessageReceived,
    onMessageUpdated,
    onMessageDeleted,
    onResume,
    enabled = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onResumeRef = useRef(onResume);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onMessageUpdatedRef.current = onMessageUpdated;
    onMessageDeletedRef.current = onMessageDeleted;
    onResumeRef.current = onResume;
  }, [onMessageReceived, onMessageUpdated, onMessageDeleted, onResume]);

  const supabaseRef = useRef(createClient());

  /** Bumped on visibility/online/focus events to force a re-subscribe cycle (mobile browsers drop WS on background). */
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

  /**
   * Hydrate a raw `messages` row into the shape the UI expects:
   *   - sender profile (name + avatar)
   *   - attached media (with public URLs)
   *
   * Kept here (not in chat.ts) to avoid a circular dep and because realtime
   * payloads are always single rows — we don't need the RPC batch semantics.
   */
  const hydrateMessage = useCallback(
    async (message: any): Promise<ChatMessage | null> => {
      if (!message || !message.id) return null;

      const supabase = supabaseRef.current;

      let senderName = 'Unknown User';
      let senderAvatar: string | undefined;

      try {
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, name, profile_pic_url')
          .eq('id', message.sender_id)
          .single();

        if (senderData) {
          senderName = senderData.name || senderData.id || 'Unknown User';
          senderAvatar = senderData.profile_pic_url || undefined;
        } else {
          senderName = `User ${String(message.sender_id || '').substring(0, 8)}`;
        }
      } catch {
        senderName = `User ${String(message.sender_id || '').substring(0, 8)}`;
      }

      let media: ChatMessageMedia[] | undefined;
      if (message.message_type && message.message_type !== 'text') {
        try {
          const { data: messageMediaData } = await supabase
            .from('message_media')
            .select(
              `
                order_index,
                media:media_id (
                  id,
                  media_type,
                  filename,
                  mime_type,
                  size_bytes,
                  bucket,
                  path
                )
              `
            )
            .eq('message_id', message.id)
            .order('order_index', { ascending: true });

          if (messageMediaData && messageMediaData.length > 0) {
            const { getMediaPublicUrl } = await import('@/lib/supabase/chat');
            media = messageMediaData
              .map((mm: any) => {
                if (!mm.media) return null;
                return {
                  id: mm.media.id,
                  mediaType: mm.media.media_type,
                  url: getMediaPublicUrl(mm.media.bucket, mm.media.path),
                  filename: mm.media.filename,
                  mimeType: mm.media.mime_type,
                  sizeBytes: mm.media.size_bytes,
                  orderIndex: mm.order_index,
                };
              })
              .filter((m: any) => m !== null) as ChatMessageMedia[];
          }
        } catch {
          /* fall back to legacy file_url below */
        }
      }

      const chatMessage: ChatMessage = {
        id: message.id,
        content: message.content || '',
        createdAt: message.created_at,
        user: {
          id: message.sender_id,
          name: senderName,
          avatar: senderAvatar,
        },
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        messageType: message.message_type || 'text',
        fileUrl: message.file_url,
        fileName: message.file_name,
        fileSize: message.file_size,
        fileType: message.file_type,
        media,
      };

      return chatMessage;
    },
    []
  );

  useEffect(() => {
    if (!enabled || !currentUserId) {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // One channel per user, not per conversation. RLS filters the stream to
    // only rows in conversations this user is a participant of.
    const channel = supabaseRef.current
      .channel(`inbox:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          try {
            const hydrated = await hydrateMessage(payload.new);
            if (hydrated) onMessageReceivedRef.current?.(hydrated);
          } catch (err) {
            setError(err as Error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          try {
            const row = payload.new as any;
            if (row?.deleted_at) {
              onMessageDeletedRef.current?.(row.id, row.conversation_id ?? null);
              return;
            }
            const hydrated = await hydrateMessage(row);
            if (hydrated) onMessageUpdatedRef.current?.(hydrated);
          } catch (err) {
            setError(err as Error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const old = payload.old as any;
          if (old && typeof old === 'object' && 'id' in old) {
            onMessageDeletedRef.current?.(
              old.id as string,
              (old.conversation_id as string) ?? null
            );
          }
        }
      )
      .subscribe((status: string, err?: Error) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
          setIsConnected(true);
          setError(null);
          onResumeRef.current?.();
        } else if (status === 'CHANNEL_ERROR') {
          channelRef.current = null;
          setIsConnected(false);
          setError(
            new Error(`Inbox channel error: ${err?.message || 'Unknown error'}`)
          );
        } else if (status === 'TIMED_OUT') {
          channelRef.current = null;
          setIsConnected(false);
          setError(new Error('Inbox channel subscription timed out'));
        } else if (status === 'CLOSED') {
          channelRef.current = null;
          setIsConnected(false);
        }
      });

    return () => {
      channelRef.current = null;
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [currentUserId, enabled, reconnectTick, hydrateMessage]);

  return {
    isConnected,
    error,
  };
}
