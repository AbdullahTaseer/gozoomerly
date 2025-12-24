'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file';
  fileUrl?: string;
  fileName?: string;
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
    if (!enabled || !conversationId || !currentUserId) {
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

    const channelName = `chat:${conversationId}`;

    const channel = supabaseRef.current
      .channel(channelName)
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
              console.error('Invalid message payload:', payload);
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
              console.warn('Profile not found for user:', message.sender_id, profileError);
              senderName = `User ${message.sender_id.substring(0, 8)}`;
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
            };

            if (onMessageReceivedRef.current) {
              onMessageReceivedRef.current(chatMessage);
            } else {
              console.warn('⚠️ onMessageReceived callback is not set');
            }
          } catch (err) {
            console.error('Error processing new message:', err);
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
              console.warn('Profile not found for user:', message.sender_id, profileError);
              senderName = `User ${message.sender_id.substring(0, 8)}`;
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
            };

            onMessageUpdatedRef.current?.(chatMessage);
          } catch (err) {
            console.error('Error processing updated message:', err);
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
      .subscribe(async (status, err) => {
        console.log('📡 Real-time subscription status:', status, err ? `Error: ${err}` : '');
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
                            
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          const error = new Error(`Channel subscription error: ${err?.message || 'Unknown error'}`);
          setError(error);
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          const error = new Error('Channel subscription timed out');
          setError(error);
        } else if (status === 'CLOSED') {
          setIsConnected(false);
        } else {
          console.log('ℹ️ Subscription status:', status);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [conversationId, currentUserId, enabled]);

  return {
    isConnected,
    error,
    channel: channelRef.current,
  };
}

