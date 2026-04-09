'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Images, Video } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import { authService } from '@/lib/supabase/auth';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { getProfileMemories, getProfileMemoryBoardId, getProfileMemoryCoverUrl, getProfileMemoryTitle, type ProfileMemoryItem, type ProfileMemoryStatusFilter } from '@/lib/supabase/profileMemories';

const PAGE_SIZE = 20;

function formatMemoryTimestamp(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMemoryImageCount(memory: ProfileMemoryItem): number {
  const item = memory as Record<string, unknown>;
  if (typeof item.image_count === 'number') return item.image_count;
  if (typeof item.photos_count === 'number') return item.photos_count;
  if (Array.isArray(item.media)) {
    return item.media.filter((m) => {
      const row = m as Record<string, unknown>;
      const t = String(row.media_type ?? row.type ?? row.mime_type ?? '').toLowerCase();
      if (t) return t.includes('image');
      const url = String(row.cdn_url ?? row.url ?? '');
      return !/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
    }).length;
  }
  // `media_count` can be mixed media and is not guaranteed to be image-only.
  // Prefer explicit image counts only to avoid false image badges.
  return 0;
}

function getMemoryVideoCount(memory: ProfileMemoryItem): number {
  const item = memory as Record<string, unknown>;
  if (typeof item.video_count === 'number') return item.video_count;
  if (Array.isArray(item.media)) {
    return item.media.filter((m) => {
      const row = m as Record<string, unknown>;
      const t = String(row.media_type ?? row.type ?? row.mime_type ?? '').toLowerCase();
      if (t) return t.includes('video');
      const url = String(row.cdn_url ?? row.url ?? '');
      return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
    }).length;
  }
  return 0;
}

function buildInlineMedia(memory: ProfileMemoryItem): Array<{ id: string; url: string; isVideo: boolean }> {
  const item = memory as Record<string, unknown>;
  const media = Array.isArray(item.media) ? item.media : [];
  const photos = Array.isArray(item.photos) ? item.photos : [];
  const videos = Array.isArray(item.videos) ? item.videos : [];
  const out: Array<{ id: string; url: string; isVideo: boolean }> = [];

  const pushAny = (m: unknown, idx: number, forcedType?: 'image' | 'video') => {
    const row = m as Record<string, unknown>;
    const urlRaw = row.cdn_url ?? row.url ?? row.thumbnail_url ?? row.path;
    const url = typeof urlRaw === 'string' ? urlRaw.trim() : '';
    if (!url) return;
    const typeRaw = String(row.media_type ?? row.type ?? row.mime_type ?? '').toLowerCase();
    const isVideo =
      forcedType === 'video' ||
      (forcedType !== 'image' &&
        (typeRaw ? typeRaw.includes('video') : /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url)));
    out.push({
      id: String(row.id ?? row.media_id ?? `${memory.wish_id ?? memory.id ?? 'm'}-${idx}`),
      url,
      isVideo,
    });
  };

  media.forEach((m, idx) => pushAny(m, idx));
  photos.forEach((m, idx) => pushAny(m, idx, 'image'));
  videos.forEach((m, idx) => pushAny(m, idx, 'video'));

  return out;
}

const Memories = () => {
  const router = useRouter();
  const [memories, setMemories] = useState<ProfileMemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProfileMemoryStatusFilter>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const { data, error: rpcError } = await getProfileMemories({
        profileUserId: user.id,
        viewerId: user.id,
        status: statusFilter,
        limit: PAGE_SIZE,
        offset: 0,
      });

      if (rpcError) {
        setError(rpcError.message);
        setMemories([]);
      } else {
        setMemories(data);
        setOffset(data.length);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
    };
    void load();
  }, [router, statusFilter]);

  const handleLoadMore = async () => {
    const user = await authService.getUser();
    if (!user || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const { data, error: rpcError } = await getProfileMemories({
      profileUserId: user.id,
      viewerId: user.id,
      status: statusFilter,
      limit: PAGE_SIZE,
      offset: offset,
    });
    if (rpcError) {
      setError(rpcError.message);
      setLoadingMore(false);
      return;
    }
    setMemories((prev) => [...prev, ...data]);
    setOffset((o) => o + data.length);
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
  };

  const openMemoryView = (memory: ProfileMemoryItem, mediaFilter: 'image' | 'video') => {
    const boardId = getProfileMemoryBoardId(memory) || '';
    const memoryId = (typeof memory.id === 'string' && memory.id.trim() ? memory.id : '') || '';
    const wishId = (typeof memory.wish_id === 'string' && memory.wish_id.trim() ? memory.wish_id : '') || '';
    if (!boardId && !memoryId && !wishId) return;
    const title = getProfileMemoryTitle(memory);
    const inlineMedia = buildInlineMedia(memory);
    const params = new URLSearchParams({
      boardId,
      memoryId,
      wishId,
      title,
      mediaFilter,
      inlineMedia: inlineMedia.length > 0 ? encodeURIComponent(JSON.stringify(inlineMedia)) : '',
    });
    router.push(`/u/memories/view?${params.toString()}`);
  };

  const renderMemoryCard = (memory: ProfileMemoryItem, idx: number) => {
    const ownerName = memory.wisher?.name || memory.creator?.name || 'You';
    const ownerAvatar = memory.wisher?.profile_pic_url || memory.creator?.profile_pic_url || ProfileAvatar;
    const imageCount = getMemoryImageCount(memory);
    const videoCount = getMemoryVideoCount(memory);

    return (
      <div
        key={String(memory.wish_id ?? memory.id ?? idx)}
        className="rounded-xl border border-[#E8E8E8] bg-[#F4F4F4] p-1.5"
      >
        <div className="relative h-[90px] md:h-[148px] rounded-lg overflow-hidden">
          <Image
            src={getProfileMemoryCoverUrl(memory)}
            alt={getProfileMemoryTitle(memory)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <p className="absolute bottom-3 left-4 right-4 text-white font-semibold text-lg sm:text-xl leading-snug line-clamp-2 drop-shadow-sm">
            {getProfileMemoryTitle(memory)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
              <Image src={ownerAvatar} alt={ownerName} fill className="object-cover" sizes="40px" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-black truncate">{ownerName}</p>
              <p className="text-xs text-gray-600 truncate">{formatMemoryTimestamp(memory.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => openMemoryView(memory, 'image')}
                className="flex items-center cursor-pointer gap-1.5 text-sm font-medium text-gray-800"
              >
                <Images size={18} />
                {imageCount}
              </button>
         
              <button
                type="button"
                onClick={() => openMemoryView(memory, 'video')}
                className="flex items-center cursor-pointer gap-1.5 text-sm font-medium text-gray-800"
              >
                <Video size={18} />
                {videoCount}
              </button>
            
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Memories"
        showBack
        onBackClick={() => router.push('/u/profile')}
        profileRight
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="max-[769px]:hidden flex justify-between items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/u/profile')}
            className="flex items-center gap-2 text-black shrink-0"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Memories</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              { key: 'all' as const, label: 'All', value: null as ProfileMemoryStatusFilter },
              { key: 'live' as const, label: 'Live', value: 'live' as const },
              { key: 'past' as const, label: 'Past', value: 'past' as const },
            ] as const
          ).map(({ key, label, value }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === value
                  ? 'bg-[#1B1D26] text-white border-[#1B1D26]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory, idx) => renderMemoryCard(memory, idx))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => void handleLoadMore()}
                  disabled={loadingMore}
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && memories.length === 0 && (
          <p className="text-center text-gray-500 py-12">No memories to show yet.</p>
        )}
      </div>
    </div>
  );
};

export default Memories;
