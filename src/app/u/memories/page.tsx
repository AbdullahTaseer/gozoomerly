'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import GlobalInput from '@/components/inputs/GlobalInput';
import CoverCard from '@/components/cards/CoverCard';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import {
  getProfileMemories,
  getProfileMemoryBoardId,
  getProfileMemoryCoverUrl,
  getProfileMemoryTitle,
  type ProfileMemoryItem,
  type ProfileMemoryStatusFilter,
} from '@/lib/supabase/profileMemories';

function formatMemoryTimestamp(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const PAGE_SIZE = 20;

const Memories = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [memories, setMemories] = useState<ProfileMemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePic, setProfilePic] = useState<string | typeof ProfileAvatar>(ProfileAvatar);
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

      const supabase = createClient();
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, profile_pic_url')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfileName(profileData.name || '');
        if (profileData.profile_pic_url) setProfilePic(profileData.profile_pic_url);
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

  const filteredMemories = memories.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const title = getProfileMemoryTitle(m).toLowerCase();
    const creator = (m.wisher?.name || profileName || '').toLowerCase();
    return title.includes(q) || creator.includes(q);
  });

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
          <div className="relative w-[260px] shrink-0">
            <Search size={18} className="absolute top-3 left-3 text-gray-500" />
            <GlobalInput
              placeholder="Search friends & family..."
              height="42px"
              width="100%"
              borderRadius="100px"
              inputClassName="pl-10"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-[769px]:block hidden mb-4">
          <div className="relative w-full max-w-[300px]">
            <Search size={18} className="absolute top-3 left-3 text-gray-500" />
            <GlobalInput
              placeholder="Search friends & family..."
              height="42px"
              width="100%"
              borderRadius="100px"
              inputClassName="pl-10"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
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
              {filteredMemories.map((memory, idx) => {
                const boardId = getProfileMemoryBoardId(memory);
                return (
                  <CoverCard
                    key={String(memory.wish_id ?? memory.id ?? idx)}
                    coverImage={getProfileMemoryCoverUrl(memory)}
                    title={getProfileMemoryTitle(memory)}
                    creatorName={memory.wisher?.name || profileName || 'You'}
                    creatorAvatar={memory.wisher?.profile_pic_url || profilePic}
                    timestamp={formatMemoryTimestamp(memory.created_at)}
                    photosCount={memory.media_count ?? memory.photos_count ?? 0}
                    viewsCount={memory.views_count ?? 0}
                    onClick={() => {
                      if (boardId) router.push(`/u/boards/${boardId}`);
                    }}
                  />
                );
              })}
            </div>

            {hasMore && !search.trim() && (
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

        {!loading && !error && filteredMemories.length === 0 && (
          <p className="text-center text-gray-500 py-12">No memories found</p>
        )}
      </div>
    </div>
  );
};

export default Memories;
