'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TypingUser {
  user_id: string;
  user_name?: string;
  timestamp: number;
}

interface UseTypingIndicatorOptions {
  conversationId: string | null;
  currentUserId: string | null;
  currentUserName?: string;
  enabled?: boolean;
}

interface UseTypingIndicatorReturn {
  typingUsers: TypingUser[];
  sendTyping: () => void;
  isTyping: boolean;
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useTypingIndicator({
  conversationId,
  currentUserId,
  currentUserName,
  enabled = true,
}: UseTypingIndicatorOptions): UseTypingIndicatorReturn {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) =>
        prev.filter((user) => now - user.timestamp < 3000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!conversationId || !currentUserId || !enabled) {
      return;
    }

    const supabase = supabaseRef.current;
    const channelName = `typing:${conversationId}`;
    const channel = supabase.channel(channelName);

    channel.on('broadcast', { event: 'typing' }, (payload) => {
      const data = payload.payload as { user_id: string; user_name?: string };

      if (data.user_id !== currentUserId) {
        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.user_id !== data.user_id);
          return [
            ...filtered,
            {
              user_id: data.user_id,
              user_name: data.user_name,
              timestamp: Date.now(),
            },
          ];
        });
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channelRef.current = channel;
      }
    });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
      setTypingUsers([]);
    };
  }, [conversationId, currentUserId, enabled]);

  const sendTypingRaw = useCallback(() => {
    if (channelRef.current && currentUserId) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: currentUserId,
          user_name: currentUserName,
          conversation_id: conversationId,
        },
      });
    }
  }, [conversationId, currentUserId, currentUserName]);

  const sendTyping = useMemo(
    () => debounce(sendTypingRaw, 500),
    [sendTypingRaw]
  );

  const isTyping = typingUsers.length > 0;

  return {
    typingUsers,
    sendTyping,
    isTyping,
  };
}

export type { TypingUser, UseTypingIndicatorOptions, UseTypingIndicatorReturn };
