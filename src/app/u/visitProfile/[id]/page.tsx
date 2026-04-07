'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { followUser, unfollowUser } from '@/lib/supabase/followUtils';
import { Camera, Video } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import {
  getProfileMemories,
  expandProfileMemoriesToGridItems,
  getProfileMemoryBoardId,
  type ProfileMemoryItem,
  type ProfileMemoryStatusFilter,
} from '@/lib/supabase/profileMemories';

const MEMORY_PAGE_SIZE = 30;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  work?: string;
  country?: string;
  state?: string;
  city?: string;
  birth_date?: string;
  profile_pic_url?: string;
  followers_count?: number;
  following_count?: number;
  boards_created_count?: number;
  yours_boards_count?: number;
}

const VisitProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const [memoryStatusFilter, setMemoryStatusFilter] = useState<ProfileMemoryStatusFilter>(null);
  const [memories, setMemories] = useState<ProfileMemoryItem[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);
  const [memoriesOffset, setMemoriesOffset] = useState(0);
  const [memoriesHasMore, setMemoriesHasMore] = useState(false);

  const gridItems = useMemo(() => expandProfileMemoriesToGridItems(memories), [memories]);
  const photoItems = useMemo(() => gridItems.filter((g) => !g.isVideo), [gridItems]);
  const videoItems = useMemo(() => gridItems.filter((g) => g.isVideo), [gridItems]);

  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
  }, [profileId]);

  useEffect(() => {
    if (loading || !profileId || !currentUserId) return;
    void (async () => {
      setMemoriesLoading(true);
      setMemoriesError(null);
      const { data, error: memErr } = await getProfileMemories({
        profileUserId: profileId,
        viewerId: currentUserId,
        status: memoryStatusFilter,
        limit: MEMORY_PAGE_SIZE,
        offset: 0,
      });
      if (memErr) {
        setMemoriesError(memErr.message);
        setMemories([]);
        setMemoriesOffset(0);
        setMemoriesHasMore(false);
        setMemoriesLoading(false);
        return;
      }
      setMemories(data);
      setMemoriesOffset(data.length);
      setMemoriesHasMore(data.length === MEMORY_PAGE_SIZE);
      setMemoriesLoading(false);
    })();
  }, [loading, profileId, currentUserId, memoryStatusFilter]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const currentUser = await authService.getUser();
      if (!currentUser) {
        router.push('/signin');
        return;
      }
      setCurrentUserId(currentUser.id);

      if (currentUser.id === profileId) {
        router.push('/u/profile');
        return;
      }

      const supabase = createClient();

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) {
        setError('Profile not found');
        return;
      }

      setProfile(profileData);

      const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('followee_id', profileId)
        .single();

      setIsFollowing(!!followData);

    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreMemories = async () => {
    if (!profileId || !currentUserId || memoriesLoading || !memoriesHasMore) return;
    setMemoriesLoading(true);
    setMemoriesError(null);
    const { data, error: memErr } = await getProfileMemories({
      profileUserId: profileId,
      viewerId: currentUserId,
      status: memoryStatusFilter,
      limit: MEMORY_PAGE_SIZE,
      offset: memoriesOffset,
    });
    if (memErr) {
      setMemoriesError(memErr.message);
      setMemoriesLoading(false);
      return;
    }
    setMemories((prev) => [...prev, ...data]);
    setMemoriesOffset((prev) => prev + data.length);
    setMemoriesHasMore(data.length === MEMORY_PAGE_SIZE);
    setMemoriesLoading(false);
  };

  const handleFollow = async () => {
    if (!currentUserId || !profile) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const result = await unfollowUser(currentUserId, profile.id);
        if (result.success) {
          setIsFollowing(false);
          setProfile(prev => prev ? {
            ...prev,
            followers_count: Math.max((prev.followers_count || 0) - 1, 0)
          } : null);
        }
      } else {
        const result = await followUser(currentUserId, profile.id);
        if (result.success) {
          setIsFollowing(true);
          setProfile(prev => prev ? {
            ...prev,
            followers_count: (prev.followers_count || 0) + 1
          } : null);
        }
      }
    } catch (err) {
    } finally {
      setFollowLoading(false);
    }
  };

  const openBoard = (boardId: string | null) => {
    if (boardId) router.push(`/u/boards/${boardId}`);
  };

  const RenderPosts = () => {
    const posts = activeTab === 'photos' ? photoItems : videoItems;

    if (memoriesLoading && memories.length === 0) {
      return (
        <div className="flex justify-center py-16 mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
        </div>
      );
    }
    if (memoriesError) {
      return <p className="text-red-500 mt-6 text-center">{memoriesError}</p>;
    }

    if (posts.length === 0) {
      return (
        <p className="text-center text-gray-500 py-12 mt-6">
          {activeTab === 'photos' ? 'No photos yet.' : 'No videos yet.'}
        </p>
      );
    }

    return (
      <>
        <div className="grid grid-cols-3 gap-1 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1 mt-6">
          {posts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openBoard(item.boardId)}
              className="relative aspect-square cursor-pointer overflow-hidden hover:opacity-90 bg-gray-100"
            >
              {activeTab === 'photos' ? (
                <img
                  src={item.url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <video
                  src={item.url}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
            </button>
          ))}
        </div>
        {memoriesHasMore && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => void handleLoadMoreMemories()}
              disabled={memoriesLoading}
              className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 disabled:opacity-50"
            >
              {memoriesLoading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[769px]:px-6 py-6">
        {loading ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading profile...</p>
            </div>
          </div>
        ) : error || !profile ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <p className='text-red-500 mb-4'>{error || 'Profile not found'}</p>
              <button
                onClick={() => router.back()}
                className='px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600'
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <>
      <div className="flex items-center gap-8 max-[768px]:flex-col max-[768px]:text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          {profile.profile_pic_url ? (
            <Image
              src={profile.profile_pic_url}
              alt={profile.name || 'Profile'}
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src={ProfileAvatar}
              alt="Default Avatar"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 max-[768px]:justify-center">
            <h2 className="text-xl font-semibold">{profile.name || profile.email?.split('@')[0] || 'User'}</h2>

            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-4 py-1 rounded-md text-sm font-medium cursor-pointer border transition-all ${
                isFollowing
                  ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  : "bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
              } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {followLoading ? 'Loading...' : (isFollowing ? "Following" : "Follow")}
            </button>

            <button className="border px-4 py-1 rounded-md text-sm cursor-pointer font-medium hover:bg-gray-100">
              Message
            </button>
          </div>

          <div className="flex gap-8 mt-3 max-[768px]:justify-center max-[768px]:gap-6">
            <p><span className="font-semibold">{profile.yours_boards_count || 0}</span> Campaigns</p>
            <p><span className="font-semibold">{profile.followers_count || 0}</span> followers</p>
            <p><span className="font-semibold">{profile.following_count || 0}</span> following</p>
          </div>

          {profile.bio && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-6 sm:gap-10 mt-10 border-t pt-4 text-sm font-medium flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'photos'
              ? 'border-pink-500 text-pink-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          <Camera className="w-4 h-4" /> Photos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'videos'
              ? 'border-pink-500 text-pink-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          <Video className="w-4 h-4" /> Videos
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
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
            onClick={() => setMemoryStatusFilter(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              memoryStatusFilter === value
                ? 'bg-[#1B1D26] text-white border-[#1B1D26]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

            <RenderPosts />
          </>
        )}
      </div>
    </div>
  );
};

export default VisitProfilePage;
