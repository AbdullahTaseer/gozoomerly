'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import { authService } from '@/lib/supabase/auth';
import { getBoardMedia, getBoardMemories, type BoardMediaItem } from '@/lib/supabase/boards';
import { getProfileMemories } from '@/lib/supabase/profileMemories';
import { useExploreColumnCount, splitIntoRoundRobinColumns } from '@/hooks/useExploreColumnCount';
import MemoryDetailsCardModal from '@/components/modals/MemoryDetailsCardModal';

type MemoryMedia = {
  id: string;
  url: string;
  isVideo: boolean;
};

function memoryCardImageHeightPx(colIdx: number, rowIdx: number): 160 | 210 {
  const isEvenNumberedColumn = colIdx % 2 === 1;
  return rowIdx === 0 && isEvenNumberedColumn ? 160 : 210;
}

function parseMedia(row: BoardMediaItem, index: number): MemoryMedia | null {
  const item = row as Record<string, unknown>;
  const urlRaw = item.cdn_url ?? item.url ?? item.thumbnail_url;
  const url = typeof urlRaw === 'string' ? urlRaw.trim() : '';
  if (!url) return null;

  const rawType = String(item.media_type ?? item.mime_type ?? '').toLowerCase();
  const isVideo = rawType
    ? rawType.includes('video')
    : /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);

  return {
    id: String(item.id ?? `media-${index}`),
    url,
    isVideo,
  };
}

function parseMemoryLikeMedia(memory: unknown): MemoryMedia[] {
  const row = memory as Record<string, unknown>;
  const media = Array.isArray(row.media) ? row.media : [];
  const photos = Array.isArray(row.photos) ? row.photos : [];
  const videos = Array.isArray(row.videos) ? row.videos : [];
  const out: MemoryMedia[] = [];

  const pushAny = (m: unknown, idx: number, forcedType?: 'image' | 'video') => {
    const item = m as Record<string, unknown>;
    const urlRaw = item.cdn_url ?? item.url ?? item.thumbnail_url ?? item.path;
    const url = typeof urlRaw === 'string' ? urlRaw.trim() : '';
    if (!url) return;
    const typeRaw = String(item.media_type ?? item.type ?? item.mime_type ?? '').toLowerCase();
    const isVideo =
      forcedType === 'video' ||
      (forcedType !== 'image' &&
        (typeRaw ? typeRaw.includes('video') : /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url)));
    out.push({
      id: String(item.id ?? item.media_id ?? `memory-media-${idx}`),
      url,
      isVideo,
    });
  };

  media.forEach((m, idx) => pushAny(m, idx));
  photos.forEach((m, idx) => pushAny(m, idx, 'image'));
  videos.forEach((m, idx) => pushAny(m, idx, 'video'));
  return out;
}

const MemoriesViewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('boardId') || '';
  const memoryId = searchParams.get('memoryId') || '';
  const wishId = searchParams.get('wishId') || '';
  const inlineMediaRaw = searchParams.get('inlineMedia') || '';
  const title = searchParams.get('title') || 'Memories';
  const mediaFilter = (searchParams.get('mediaFilter') || 'image') as 'image' | 'video';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MemoryMedia[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MemoryMedia | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const columnCount = useExploreColumnCount();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      if (inlineMediaRaw) {
        try {
          const decoded = decodeURIComponent(inlineMediaRaw);
          const parsed = JSON.parse(decoded) as MemoryMedia[];
          const safe = Array.isArray(parsed)
            ? parsed.filter((m) => m && typeof m.url === 'string' && typeof m.isVideo === 'boolean')
            : [];
          const filtered = safe.filter((m) => (mediaFilter === 'video' ? m.isVideo : !m.isVideo));
          if (filtered.length > 0) {
            setItems(filtered);
            setLoading(false);
            return;
          }
        } catch {
          // Fall through to network fetch.
        }
      }

      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      if (!boardId && !memoryId && !wishId) {
        setError('Missing memory reference.');
        setLoading(false);
        return;
      }

      const candidateIds = Array.from(
        new Set([boardId, memoryId, wishId].map((v) => String(v || '').trim()).filter(Boolean))
      );

      let data: BoardMediaItem[] = [];
      let mediaError: Error | null = null;

      // First attempt: direct board media endpoint.
      for (const id of candidateIds) {
        const res = await getBoardMedia({
          boardId: id,
          viewerId: user.id,
          limit: 120,
          offset: 0,
        });
        if (res.error) {
          mediaError = res.error;
          continue;
        }
        if (res.data.length > 0) {
          data = res.data;
          mediaError = null;
          break;
        }
      }

      // Mobile parity fallback: resolve via get_board_memories and flatten nested media.
      if (data.length === 0) {
        for (const id of candidateIds) {
          const res = await getBoardMemories(id, { limit: 60, offset: 0 });
          if (res.error || !res.data?.data?.memories) continue;
          const flattened: BoardMediaItem[] = [];
          const memories = res.data.data.memories;
          memories.forEach((m) => {
            if (Array.isArray(m.media)) flattened.push(...(m.media as unknown as BoardMediaItem[]));
          });
          if (flattened.length > 0) {
            data = flattened;
            mediaError = null;
            break;
          }
        }
      }

      // Final fallback: load profile memories again and match exact row by memoryId/wishId.
      if (data.length === 0) {
        const { data: profileRows } = await getProfileMemories({
          profileUserId: user.id,
          viewerId: user.id,
          status: null,
          limit: 100,
          offset: 0,
        });
        const matched = profileRows.find((r) => {
          const rid = typeof r.id === 'string' ? r.id : '';
          const rwid = typeof r.wish_id === 'string' ? r.wish_id : '';
          return (memoryId && rid === memoryId) || (wishId && rwid === wishId);
        });
        if (matched) {
          const rebuilt = parseMemoryLikeMedia(matched) as unknown as BoardMediaItem[];
          if (rebuilt.length > 0) {
            data = rebuilt;
            mediaError = null;
          }
        }
      }

      if (mediaError && data.length === 0) {
        setError(mediaError.message);
        setItems([]);
        setLoading(false);
        return;
      }

      const parsed = data
        .map((row, idx) => parseMedia(row, idx))
        .filter((m): m is MemoryMedia => m != null)
        .filter((m) => (mediaFilter === 'video' ? m.isVideo : !m.isVideo));

      setItems(parsed);
      setLoading(false);
    };

    void load();
  }, [boardId, memoryId, wishId, inlineMediaRaw, mediaFilter, router]);

  const columns = useMemo(
    () => splitIntoRoundRobinColumns(items, Math.max(1, columnCount)),
    [items, columnCount]
  );

  const headerTitle = mediaFilter === 'video' ? 'Videos' : 'Photos';

  return (
    <div className="text-black min-h-screen">
      <DashNavbar />
      <MobileHeader
        title={headerTitle}
        showBack
        onBackClick={() => router.push('/u/memories')}
        RightIcon={Share2}
        rightIconClick={async () => {
          const shareUrl = activeItem?.url || window.location.href;
          if (navigator.share) {
            try {
              await navigator.share({ title, url: shareUrl });
            } catch {
              // ignored
            }
            return;
          }
          await navigator.clipboard.writeText(shareUrl);
        }}
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="max-[769px]:hidden flex justify-between items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/u/memories')}
            className="flex items-center gap-2 text-black shrink-0"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">{headerTitle}</span>
          </button>
          <button type="button" className="p-2 hover:bg-gray-50">
            <Share2 size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            {mediaFilter === 'video' ? 'No videos found for this memory.' : 'No images found for this memory.'}
          </p>
        ) : (
          <div className="flex gap-2">
            {columns.map((column, colIdx) => (
              <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-2">
                {column.map((item, rowIdx) => {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const idx = items.findIndex((m) => m.id === item.id);
                        setActiveItem(item);
                        setActiveIndex(idx >= 0 ? idx : 0);
                        setViewerOpen(true);
                      }}
                      className="relative w-full overflow-hidden rounded-lg bg-gray-100"
                      style={{ height: memoryCardImageHeightPx(colIdx, rowIdx) }}
                    >
                      {item.isVideo ? (
                        <video src={item.url} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
                      ) : (
                        <img src={item.url} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <MemoryDetailsCardModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={title || 'Memories'}
        items={items}
        initialIndex={activeItem ? activeIndex : 0}
      />
    </div>
  );
};

export default MemoriesViewPage;
