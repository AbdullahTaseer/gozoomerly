'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ChatMessageMedia {
  id: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes?: number;
  orderIndex?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  conversationId: string;
  senderId: string;
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'mixed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  media?: ChatMessageMedia[];
}

export interface UseRealtimeChatOptions {
  conversationId: string | null;
  currentUserId: string | null;
  onMessageReceived?: (message: ChatMessage) => void;
  onMessageUpdated?: (message: ChatMessage) => void;
  onMessageDeleted?: (messageId: string) => void;
  enabled?: boolean;
}

export function useRealtimeChat(options: UseRealtimeChatOptions) {
  const {
    conversationId,
    currentUserId,
    onMessageReceived,
    onMessageUpdated,
    onMessageDeleted,
    enabled = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const channelReadyRef = useRef(false);
  /** Bumped on visibility/online/focus events to force a re-subscribe cycle (mobile browsers drop WS on background). */
  const [reconnectTick, setReconnectTick] = useState(0);

  const onMessageReceivedRef = useRef(onMessageReceived);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onMessageUpdatedRef.current = onMessageUpdated;
    onMessageDeletedRef.current = onMessageDeleted;
  }, [onMessageReceived, onMessageUpdated, onMessageDeleted]);

  const supabaseRef = useRef(createClient());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bump = () => {
      setReconnectTick((t) => t + 1);
    };

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

  useEffect(() => {
    if (!enabled || !conversationId || !currentUserId) {
      channelReadyRef.current = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    channelReadyRef.current = false;
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channelName = `chat:${conversationId}`;

    const channel = supabaseRef.current
      .channel(channelName)
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload: { payload: unknown }) => {
          const raw = payload.payload;
          if (!raw || typeof raw !== 'object') return;
          const msg = raw as ChatMessage;
          if (!msg.id || !msg.conversationId) return;
          if (msg.conversationId !== conversationId) return;
          onMessageReceivedRef.current?.(msg);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          try {
            const message = payload.new;

            if (!message || !message.id) {
              return;
            }

            let senderName = 'Unknown User';
            let senderAvatar: string | undefined;

            const { data: senderData, error: profileError } = await supabaseRef.current
              .from('profiles')
              .select('id, name, profile_pic_url')
              .eq('id', message.sender_id)
              .single();

            if (senderData) {
              senderName = senderData.name || senderData.id || 'Unknown User';
              senderAvatar = senderData.profile_pic_url || undefined;
            } else {
              senderName = `User ${message.sender_id.substring(0, 8)}`;
            }

            let media: ChatMessageMedia[] | undefined;
            if (message.message_type && message.message_type !== 'text') {
              try {
                const { data: messageMediaData } = await supabaseRef.current
                  .from('message_media')
                  .select(`
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
                  `)
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
              } catch (mediaErr) {
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
              media,
            };

            if (onMessageReceivedRef.current) {
              onMessageReceivedRef.current(chatMessage);
            }
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
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          try {
            const message = payload.new;

            if (message.deleted_at) {
              onMessageDeletedRef.current?.(message.id);
              return;
            }

            let senderName = 'Unknown User';
            let senderAvatar: string | undefined;

            const { data: senderData, error: profileError } = await supabaseRef.current
              .from('profiles')
              .select('id, name, profile_pic_url')
              .eq('id', message.sender_id)
              .single();

            if (senderData) {
              senderName = senderData.name || senderData.id || 'Unknown User';
              senderAvatar = senderData.profile_pic_url;
            } else {
              senderName = `User ${message.sender_id.substring(0, 8)}`;
            }

            let media: ChatMessageMedia[] | undefined;
            if (message.message_type && message.message_type !== 'text') {
              try {
                const { data: messageMediaData } = await supabaseRef.current
                  .from('message_media')
                  .select(`
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
                  `)
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
              } catch (mediaErr) {
                // If media fetch fails, fall back to legacy file_url
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

            onMessageUpdatedRef.current?.(chatMessage);
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
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
            onMessageDeletedRef.current?.(payload.old.id as string);
          }
        }
      )
      .subscribe(async (status: string, err?: Error) => {
        if (status === 'SUBSCRIBED') {
          channelReadyRef.current = true;
          channelRef.current = channel;
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          channelReadyRef.current = false;
          channelRef.current = null;
          setIsConnected(false);
          const error = new Error(`Channel subscription error: ${err?.message || 'Unknown error'}`);
          setError(error);
        } else if (status === 'TIMED_OUT') {
          channelReadyRef.current = false;
          channelRef.current = null;
          setIsConnected(false);
          const error = new Error('Channel subscription timed out');
          setError(error);
        } else if (status === 'CLOSED') {
          channelReadyRef.current = false;
          channelRef.current = null;
          setIsConnected(false);
        }
      });

    return () => {
      channelReadyRef.current = false;
      channelRef.current = null;
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [conversationId, currentUserId, enabled, reconnectTick]);

  const broadcastNewMessage = useCallback((message: ChatMessage) => {
    if (!message?.id || !message.conversationId) return;

    const send = () => {
      const ch = channelRef.current;
      if (!ch || !channelReadyRef.current) return false;
      ch.send({
        type: 'broadcast',
        event: 'new_message',
        payload: message,
      });
      return true;
    };

    if (send()) return;

    let attempts = 0;
    const maxAttempts = 30;
    const t = window.setInterval(() => {
      attempts += 1;
      if (send() || attempts >= maxAttempts) {
        window.clearInterval(t);
      }
    }, 150);
  }, []);

  return {
    isConnected,
    error,
    channel: channelRef.current,
    broadcastNewMessage,
  };
}

