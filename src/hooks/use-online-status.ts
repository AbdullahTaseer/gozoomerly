'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { updateLastSeen } from '@/hooks/use-last-seen';

interface OnlineUser {
  user_id: string;
  user_name?: string;
  profile_pic_url?: string;
  online_at: string;
}

interface UseOnlineStatusOptions {
  currentUserId: string | null;
  currentUserName?: string;
  currentUserProfilePic?: string;
  enabled?: boolean;
}

interface UseOnlineStatusReturn {
  onlineUsers: string[];
  onlineUsersData: Map<string, OnlineUser>;
  isUserOnline: (userId: string) => boolean;
}

export function useOnlineStatus({
  currentUserId,
  currentUserName,
  currentUserProfilePic,
  enabled = true,
}: UseOnlineStatusOptions): UseOnlineStatusReturn {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlineUsersData, setOnlineUsersData] = useState<Map<string, OnlineUser>>(
    new Map()
  );
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    if (!currentUserId || !enabled) {
      return;
    }

    const supabase = supabaseRef.current;
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const usersMap = new Map<string, OnlineUser>();
      const userIds: string[] = [];

      Object.values(state).forEach((presences) => {
        const presence = presences[0] as unknown as OnlineUser | undefined;
        if (presence?.user_id) {
          userIds.push(presence.user_id);
          usersMap.set(presence.user_id, presence);
        }
      });

      setOnlineUsers(userIds);
      setOnlineUsersData(usersMap);
    });

    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      const presence = newPresences[0] as unknown as OnlineUser | undefined;
      if (presence?.user_id) {
        setOnlineUsers((prev) => {
          if (!prev.includes(presence.user_id)) {
            return [...prev, presence.user_id];
          }
          return prev;
        });
        setOnlineUsersData((prev) => {
          const newMap = new Map(prev);
          newMap.set(presence.user_id, presence);
          return newMap;
        });
      }
    });

    channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const presence = leftPresences[0] as unknown as OnlineUser | undefined;
      if (presence?.user_id) {
        setOnlineUsers((prev) => prev.filter((id) => id !== presence.user_id));
        setOnlineUsersData((prev) => {
          const newMap = new Map(prev);
          newMap.delete(presence.user_id);
          return newMap;
        });
      }
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        channelRef.current = channel;
        await channel.track({
          user_id: currentUserId,
          user_name: currentUserName,
          profile_pic_url: currentUserProfilePic,
          online_at: new Date().toISOString(),
        });
      }
    });

    const handleBeforeUnload = () => {
      channel.untrack();
      if (currentUserId && navigator.sendBeacon) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
        if (supabaseUrl && supabaseKey) {
          navigator.sendBeacon(
            `${supabaseUrl}/rest/v1/rpc/update_last_seen`,
            JSON.stringify({ p_user_id: currentUserId })
          );
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentUserId) {
        updateLastSeen(currentUserId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      channel.untrack();
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
      if (currentUserId) {
        updateLastSeen(currentUserId);
      }
      setOnlineUsers([]);
      setOnlineUsersData(new Map());
    };
  }, [currentUserId, currentUserName, currentUserProfilePic, enabled]);

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.includes(userId),
    [onlineUsers]
  );

  return {
    onlineUsers,
    onlineUsersData,
    isUserOnline,
  };
}

export type { OnlineUser, UseOnlineStatusOptions, UseOnlineStatusReturn };
