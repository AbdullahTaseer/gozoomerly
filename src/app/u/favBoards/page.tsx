'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import DashNavbar from '@/components/navbar/DashNavbar';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import {
  fetchFavoriteBoardsPage,
  rpcUnfavoriteBoard,
  type FavoriteBoardItem,
} from '@/lib/supabase/favoriteBoards';
import FavoriteBoardRow from '@/components/boards/FavoriteBoardRow';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

const PAGE_SIZE = 20;

export default function FavBoardsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [boards, setBoards] = useState<FavoriteBoardItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unfavoriteModalOpen, setUnfavoriteModalOpen] = useState(false);
  const [pendingUnfavoriteId, setPendingUnfavoriteId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const loadPage = useCallback(
    async (nextOffset: number, reset: boolean) => {
      if (!userId) return;
      if (!reset) {
        setLoadingMore(true);
      }
      const { boards: page, error, nextOffset: newOffset, hasMore: more } =
        await fetchFavoriteBoardsPage(supabase, userId, nextOffset, PAGE_SIZE);
      if (error) {
        toast.error(error);
        if (reset) setBoards([]);
      } else if (reset) {
        setBoards(page);
        setOffset(newOffset);
        setHasMore(more);
      } else {
        setBoards((prev) => {
          const seen = new Set(prev.map((b) => String(b?.id || b?.board_id)));
          const merged = [...prev];
          page.forEach((b) => {
            const id = String(b?.id || b?.board_id);
            if (!id || id === 'undefined') return;
            if (!seen.has(id)) {
              seen.add(id);
              merged.push(b);
            }
          });
          return merged;
        });
        setOffset(newOffset);
        setHasMore(more);
      }
      setLoading(false);
      setLoadingMore(false);
    },
    [userId, supabase]
  );

  useEffect(() => {
    (async () => {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUserId(user.id);
    })();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    loadPage(0, true);
  }, [userId, loadPage]);

  const onLoadMore = () => {
    if (!userId || !hasMore || loadingMore || boards.length === 0) return;
    loadPage(offset, false);
  };

  const openUnfavorite = (item: FavoriteBoardItem) => {
    const id = item?.id || item?.board_id;
    if (!id) return;
    setPendingUnfavoriteId(String(id));
    setUnfavoriteModalOpen(true);
  };

  const confirmUnfavorite = async () => {
    const boardId = pendingUnfavoriteId;
    setUnfavoriteModalOpen(false);
    setPendingUnfavoriteId(null);
    if (!userId || !boardId) return;
    const { error } = await rpcUnfavoriteBoard(supabase, userId, boardId);
    if (error) {
      toast.error(error.message || 'Could not update favorites');
      return;
    }
    setBoards((prev) =>
      prev.filter((b) => String(b?.id || b?.board_id) !== String(boardId))
    );
    toast.success('Removed from favorites');
  };

  const navigateToBoard = (item: FavoriteBoardItem) => {
    const id = item?.id || item?.board_id;
    if (!id) return;
    router.push(`/u/boards/${id}`);
  };

  return (
    <>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[769px]:px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={() => router.push('/u/profile')}
            className="flex items-center gap-2 text-black"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Favorites</span>
          </button>
        </div>

        {loading && !boards.length ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : boards.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No favorite boards yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {boards.map((item, index) => {
              const key = String(item?.id || item?.board_id || index);
              return (
                <li key={key}>
                  <FavoriteBoardRow
                    item={item}
                    onOpen={() => navigateToBoard(item)}
                    onUnfavorite={() => openUnfavorite(item)}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {boards.length > 0 && hasMore ? (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={loadingMore}
              className="px-6 py-2 rounded-full border border-black text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmationModal
        isOpen={unfavoriteModalOpen}
        onClose={() => {
          setUnfavoriteModalOpen(false);
          setPendingUnfavoriteId(null);
        }}
        title="Remove from favorites?"
        icon={Bookmark}
        message="This board will be removed from your saved list."
        primaryLabel="Remove"
        onPrimaryClick={confirmUnfavorite}
      />
    </>
  );
}
