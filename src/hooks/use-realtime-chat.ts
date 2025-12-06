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
  
  // Use refs to store callbacks so they're always up-to-date
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  
  // Update refs when callbacks change
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onMessageUpdatedRef.current = onMessageUpdated;
    onMessageDeletedRef.current = onMessageDeleted;
  }, [onMessageReceived, onMessageUpdated, onMessageDeleted]);
  
  // Create supabase client once
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    if (!enabled || !conversationId || !currentUserId) {
      if (channelRef.current) {
        console.log('Unsubscribing from channel:', channelRef.current.topic);
        channelRef.current.unsubscribe();
        channelRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Clean up any existing subscription first
    if (channelRef.current) {
      console.log('Cleaning up existing subscription before creating new one');
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channelName = `chat:${conversationId}`;
    console.log('🔧 Setting up real-time subscription for conversation:', conversationId, 'Channel:', channelName);

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
            console.log('🔔 Real-time INSERT event received:', payload);
            console.log('Message data:', payload.new);
            const message = payload.new;
            
            // Validate message data
            if (!message || !message.id) {
              console.error('Invalid message payload:', payload);
              return;
            }
            
            // Fetch sender info - try profiles table first
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

            console.log('✅ Calling onMessageReceived with:', chatMessage);
            if (onMessageReceivedRef.current) {
              onMessageReceivedRef.current(chatMessage);
              console.log('✅ onMessageReceived callback executed');
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

            // Fetch sender info - try profiles table first
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
          onMessageDeletedRef.current?.(payload.old.id);
        }
      )
      .subscribe(async (status, err) => {
        console.log('📡 Real-time subscription status:', status, err ? `Error: ${err}` : '');
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
          console.log('✅ Successfully subscribed to real-time updates for conversation:', conversationId);
          
          // Verify subscription by checking channel state
          const channelState = channel.state;
          console.log('📊 Channel state:', channelState);
          
          // Test if we can receive events by checking the channel
          if (channel.topic) {
            console.log('📢 Channel topic:', channel.topic);
          }
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          const error = new Error(`Channel subscription error: ${err?.message || 'Unknown error'}`);
          setError(error);
          console.error('❌ Channel subscription error:', err);
          console.error('💡 Make sure the "messages" table has replication enabled in Supabase Dashboard → Database → Replication');
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          const error = new Error('Channel subscription timed out');
          setError(error);
          console.error('⏱️ Channel subscription timed out');
          console.error('💡 This usually means real-time is not enabled for the messages table');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          console.log('🔒 Channel closed');
        } else {
          console.log('ℹ️ Subscription status:', status);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up real-time subscription for conversation:', conversationId);
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

