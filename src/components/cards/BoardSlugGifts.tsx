'use client';

import React, { useCallback, useEffect, useState } from 'react';
import staticProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import ImageWithFallback from '@/components/images/ImageWithFallback';
import { Skeleton, SkeletonRepeat } from '@/components/skeletons';
import {
  getBoardGifts,
  type BoardGift,
  type GiftStatus,
} from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';

const PAGE_SIZE = 10;

type StatusTab = 'completed' | 'pending' | 'all';

const STATUS_TABS: Array<{ id: StatusTab; label: string }> = [
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending' },
  { id: 'all', label: 'All' },
];

interface BoardSlugGiftsProps {
  boardId: string;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

function formatAmount(amount: number, currency?: string | null): string {
  const code = (currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

const BoardSlugGifts: React.FC<BoardSlugGiftsProps> = ({ boardId }) => {
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [gifts, setGifts] = useState<BoardGift[]>([]);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>('completed');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await authService.getUser();
      if (!cancelled) setViewerId(user?.id ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchGifts = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (!boardId || !viewerId) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const status: GiftStatus | null = statusTab === 'all' ? null : statusTab;

      const { data, error: rpcError } = await getBoardGifts(boardId, viewerId, {
        limit: PAGE_SIZE,
        offset: nextOffset,
        status,
      });

      if (rpcError || !data) {
        const msg =
          (rpcError as { message?: string } | null)?.message ||
          'Failed to load gifts';
        setError(msg);
        if (append) setLoadingMore(false);
        else setLoading(false);
        return;
      }

      setGifts((prev) => (append ? [...prev, ...data.gifts] : data.gifts));
      setTotal(data.total);
      // Server-authoritative total is only returned for page 1 consistently.
      if (!append) setTotalAmount(data.total_amount);

      const paginationHasMore = data.pagination?.has_more;
      const computedHasMore =
        typeof paginationHasMore === 'boolean'
          ? paginationHasMore
          : nextOffset + data.gifts.length < data.total;
      setHasMore(computedHasMore);
      setOffset(nextOffset + data.gifts.length);

      if (append) setLoadingMore(false);
      else setLoading(false);
    },
    [boardId, viewerId, statusTab]
  );

  useEffect(() => {
    if (!viewerId || !boardId) return;
    setOffset(0);
    setGifts([]);
    fetchGifts(0, false);
  }, [viewerId, boardId, statusTab, fetchGifts]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchGifts(offset, true);
  };

  if (!viewerId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-[12px]" />
        <SkeletonRepeat count={3}>
          {(i) => <Skeleton key={i} className="h-[72px] rounded-[12px]" />}
        </SkeletonRepeat>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4 py-3 bg-linear-to-r from-[#18171F] to-[#2a263d] rounded-[12px] text-white">
        <div>
          <p className="text-lg font-semibold">Total Gifts</p>
          <p className="text-sm">{total} contributors</p>
        </div>
        <p className="text-lg font-bold">{formatAmount(totalAmount)}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const active = tab.id === statusTab;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                active
                  ? 'bg-black text-white'
                  : 'bg-[#F4F4F4] text-black hover:bg-[#E9E9E9]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <SkeletonRepeat count={4}>
          {(i) => <Skeleton key={i} className="h-[72px] rounded-[12px]" />}
        </SkeletonRepeat>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-[12px] px-4 py-3 text-sm">
          {error}
        </div>
      ) : gifts.length === 0 ? (
        <div className="bg-[#F4F4F4] rounded-[12px] px-4 py-8 text-center text-gray-500 text-sm">
          No gifts yet.
        </div>
      ) : (
        <>
          {gifts.map((gift, index) => {
            const giftRow = gift as BoardGift & {
              gift_id?: string;
              payment_intent_id?: string;
            };
            const rowKey =
              (typeof giftRow.id === 'string' && giftRow.id) ||
              (typeof giftRow.gift_id === 'string' && giftRow.gift_id) ||
              (typeof giftRow.payment_intent_id === 'string' &&
                giftRow.payment_intent_id) ||
              `gift-${index}`;
            const gifterName = gift.gifter?.name || 'Anonymous';
            const avatarSrc = gift.gifter?.profile_pic_url || staticProfileAvatar;
            const status = (gift.status || '').toString();
            const statusColor =
              status === 'completed'
                ? 'bg-black text-white'
                : status === 'pending'
                ? 'bg-yellow-500 text-black'
                : status === 'failed'
                ? 'bg-red-500 text-white'
                : 'bg-gray-400 text-white';

            return (
              <div
                key={rowKey}
                className="bg-[#F4F4F4] flex-wrap gap-3 rounded-[12px] px-4 py-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={avatarSrc}
                    alt={gifterName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full shrink-0 object-cover"
                    fallbackSrc={staticProfileAvatar}
                  />
                  <div>
                    <p className="text-black max-[450px]:text-[16px] text-[18px] font-semibold">
                      {gifterName}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-gray-500">
                        {formatDate(gift.created_at)}
                      </p>
                      {statusTab === 'all' && status && (
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 capitalize ${statusColor}`}
                        >
                          {status}
                        </span>
                      )}
                      {(gift.gift_message || gift.message) && (
                        <span className="text-sm text-gray-600 italic">
                          "{gift.gift_message || gift.message}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="bg-black text-sm text-white rounded-full py-1 px-3">
                  Gifted : {formatAmount(Number(gift.amount) || 0, gift.currency)}
                </p>
              </div>
            );
          })}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-full text-sm font-medium bg-[#F4F4F4] hover:bg-[#E9E9E9] disabled:opacity-60 transition"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardSlugGifts;
