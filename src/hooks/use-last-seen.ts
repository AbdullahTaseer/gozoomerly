'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface LastSeenData {
  user_id: string;
  last_seen_at: string | null;
}

interface UseLastSeenOptions {
  userIds: string[];
  enabled?: boolean;
  refreshInterval?: number; 
}

interface UseLastSeenReturn {
  lastSeen: Map<string, string | null>;
  getLastSeenText: (userId: string) => string;
  refreshLastSeen: () => void;
  isLoading: boolean;
}

function formatLastSeen(lastSeenAt: string | null): string {
  if (!lastSeenAt) return 'Never';

  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return lastSeen.toLocaleDateString();
  }
}

export function useLastSeen({
  userIds,
  enabled = true,
  refreshInterval = 60000,
}: UseLastSeenOptions): UseLastSeenReturn {
  const [lastSeen, setLastSeen] = useState<Map<string, string | null>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const supabaseRef = useRef(createClient());
  const previousUserIdsRef = useRef<string[]>([]);

  const fetchLastSeen = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    setIsLoading(true);
    try {
      const supabase = supabaseRef.current;

      const { data, error } = await supabase.rpc('get_users_last_seen', {
        p_user_ids: ids,
      });

      if (error) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, last_seen_at')
          .in('id', ids);

        if (!profilesError && profilesData) {
          const newLastSeen = new Map<string, string | null>();
          profilesData.forEach((profile: { id: string; last_seen_at: string | null }) => {
            newLastSeen.set(profile.id, profile.last_seen_at);
          });
          setLastSeen(newLastSeen);
        }
      } else if (data) {
        const newLastSeen = new Map<string, string | null>();
        data.forEach((item: LastSeenData) => {
          newLastSeen.set(item.user_id, item.last_seen_at);
        });
        setLastSeen(newLastSeen);
      }
    } catch (err) {
      console.error('Error fetching last seen:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || userIds.length === 0) return;

    const sortedCurrent = [...userIds].sort().join(',');
    const sortedPrevious = [...previousUserIdsRef.current].sort().join(',');

    if (sortedCurrent !== sortedPrevious) {
      previousUserIdsRef.current = userIds;
      fetchLastSeen(userIds);
    }
  }, [userIds, enabled, fetchLastSeen]);

  useEffect(() => {
    if (!enabled || userIds.length === 0 || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchLastSeen(userIds);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [userIds, enabled, refreshInterval, fetchLastSeen]);

  const getLastSeenText = useCallback(
    (userId: string): string => {
      const lastSeenAt = lastSeen.get(userId) ?? null;
      return `Last seen ${formatLastSeen(lastSeenAt)}`;
    },
    [lastSeen]
  );

  const refreshLastSeen = useCallback(() => {
    if (userIds.length > 0) {
      fetchLastSeen(userIds);
    }
  }, [userIds, fetchLastSeen]);

  return {
    lastSeen,
    getLastSeenText,
    refreshLastSeen,
    isLoading,
  };
}

export async function updateLastSeen(userId: string): Promise<void> {
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

export type { LastSeenData, UseLastSeenOptions, UseLastSeenReturn };
