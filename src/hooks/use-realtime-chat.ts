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
  const supabase = createClient();

  useEffect(() => {
    if (!enabled || !conversationId || !currentUserId) {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const channelName = `chat:${conversationId}`;
    console.log('Setting up real-time subscription for conversation:', conversationId);

    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
        },
      })
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
            console.log('Real-time message received:', payload.new);
            const message = payload.new;
            
            // Fetch sender info - try profiles table first
            let senderName = 'Unknown User';
            let senderAvatar: string | undefined;
            
            const { data: senderData, error: profileError } = await supabase
              .from('profiles')
              .select('id, name, profile_pic_url')
              .eq('id', message.sender_id)
              .single();

            if (senderData) {
              senderName = senderData.name || senderData.id || 'Unknown User';
              senderAvatar = senderData.profile_pic_url || undefined;
              console.log('Fetched profile for sender:', senderName, senderAvatar);
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

            console.log('Calling onMessageReceived with:', chatMessage);
            onMessageReceived?.(chatMessage);
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
              onMessageDeleted?.(message.id);
              return;
            }

            // Fetch sender info - try profiles table first
            let senderName = 'Unknown User';
            let senderAvatar: string | undefined;
            
            const { data: senderData, error: profileError } = await supabase
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

            onMessageUpdated?.(chatMessage);
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
          onMessageDeleted?.(payload.old.id);
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          const error = new Error('Channel subscription error');
          setError(error);
          console.error('Channel subscription error');
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          const error = new Error('Channel subscription timed out');
          setError(error);
          console.error('Channel subscription timed out');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          console.log('Channel closed');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up real-time subscription');
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

