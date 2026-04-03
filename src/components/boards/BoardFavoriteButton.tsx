'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import {
  isBoardFavorited,
  rpcFavoriteBoard,
  rpcUnfavoriteBoard,
} from '@/lib/supabase/favoriteBoards';
import toast from 'react-hot-toast';

type Props = {
  boardId: string;
  className?: string;
};

export default function BoardFavoriteButton({ boardId, className = '' }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await authService.getUser();
      if (cancelled) return;
      if (!user?.id || !boardId) {
        setUserId(null);
        setIsFavorite(false);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      const supabase = createClient();
      const fav = await isBoardFavorited(supabase, user.id, boardId);
      if (!cancelled) {
        setIsFavorite(fav);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const toggleFavorite = useCallback(async () => {
    if (!userId || !boardId || toggling) return;
    setToggling(true);
    const supabase = createClient();
    const add = !isFavorite;
    try {
      if (add) {
        const { error } = await rpcFavoriteBoard(supabase, userId, boardId);
        if (error) throw error;
        setIsFavorite(true);
        toast.success('Saved to favorites');
      } else {
        const { error } = await rpcUnfavoriteBoard(supabase, userId, boardId);
        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      }
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: string }).message)
          : 'Could not update favorites';
      toast.error(msg);
    } finally {
      setToggling(false);
    }
  }, [userId, boardId, isFavorite, toggling]);

  if (!boardId || loading || !userId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={toggling}
      className={`p-2 rounded-full hover:bg-black/5 transition-colors disabled:opacity-50 ${className}`}
      aria-label={isFavorite ? 'Remove from saved boards' : 'Save board'}
      title={isFavorite ? 'Remove from saved' : 'Save board'}
    >
      <Bookmark
        size={22}
        className={isFavorite ? 'fill-red-500 text-red-500' : 'text-black'}
        strokeWidth={isFavorite ? 0 : 2}
      />
    </button>
  );
}
