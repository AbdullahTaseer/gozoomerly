'use client';

import { useEffect, useState, useRef, createContext, useContext, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface OnlineUser {
  user_id: string;
  user_name?: string;
  profile_pic_url?: string;
  online_at: string;
}

interface OnlineStatusContextType {
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  onlineUsers: [],
  isUserOnline: () => false,
});

export const useGlobalOnlineStatus = () => useContext(OnlineStatusContext);

async function updateLastSeen(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const supabase = createClient();
    const { error } = await supabase.rpc('update_last_seen', {
      p_user_id: userId,
    });
    if (error) {
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', userId);
    }
  } catch (err) {
    console.error('Error updating last seen:', err);
  }
}

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState<string | undefined>(undefined);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());
  const authService = useRef(new AuthService());

  useEffect(() => {
    async function fetchUser() {
      const user = await authService.current.getUser();
      if (user) {
        setCurrentUserId(user.id);

        try {
          const supabase = supabaseRef.current;
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, profile_pic_url')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCurrentUserName(profile.name || undefined);
            setCurrentUserProfilePic(profile.profile_pic_url || undefined);
          }
        } catch (err) {
        }
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

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
      const userIds: string[] = [];

      Object.values(state).forEach((presences: unknown) => {
        const list = presences as OnlineUser[];
        const presence = list[0] as OnlineUser | undefined;
        if (presence?.user_id) {
          userIds.push(presence.user_id);
        }
      });

      setOnlineUsers(userIds);
    });

    channel.on('presence', { event: 'join' }, ({ newPresences }: { newPresences: unknown[] }) => {
      const presence = newPresences[0] as unknown as OnlineUser | undefined;
      if (presence?.user_id) {
        setOnlineUsers((prev) => {
          if (!prev.includes(presence.user_id)) {
            return [...prev, presence.user_id];
          }
          return prev;
        });
      }
    });

    channel.on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: unknown[] }) => {
      const presence = leftPresences[0] as unknown as OnlineUser | undefined;
      if (presence?.user_id) {
        setOnlineUsers((prev) => prev.filter((id) => id !== presence.user_id));
      }
    });

    channel.subscribe(async (status: string) => {
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
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
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
    };
  }, [currentUserId, currentUserName, currentUserProfilePic]);

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.includes(userId),
    [onlineUsers]
  );

  return (
    <OnlineStatusContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}
