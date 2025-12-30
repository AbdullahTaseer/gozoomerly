'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import TitleCard from '@/components/cards/TitleCard';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { followUser, unfollowUser } from '@/lib/supabase/followUtils';
import { Camera, Video } from "lucide-react";
import DashNavbar from '@/components/navbar/DashNavbar';

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
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  // Placeholder data for photos and videos - in a real app, these would come from the database
  const [photos] = useState([
    "https://images.unsplash.com/photo-1605460375648-278bcbd579a6?w=400&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&q=80",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    "https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=400&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  ]);

  const [videos] = useState([
    "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
    "https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4",
  ]);

  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
  }, [profileId]);

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
        router.push('/dashboard/profile');
        return;
      }

      const supabase = createClient();
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
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
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
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
      console.error('Error following/unfollowing:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const RenderPosts = () => {
    const posts = activeTab === "photos" ? photos : videos;

    return (
      <div className="grid grid-cols-3 gap-1 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1 mt-6">
        {posts.map((item, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden hover:opacity-90"
          >
            {activeTab === "photos" ? (
              <Image
                src={item}
                alt={`Post ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={item}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
            )}
          </div>
        ))}
      </div>
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
            <p><span className="font-semibold">{profile.boards_created_count || 0}</span> posts</p>
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

      <div className="flex justify-center gap-10 mt-10 border-t pt-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab("photos")}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "photos"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <Camera className="w-4 h-4" /> Photos
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`border-b-2 pb-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "videos"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <Video className="w-4 h-4" /> Videos
        </button>
      </div>

            <RenderPosts />
          </>
        )}
      </div>
    </div>
  );
};

export default VisitProfilePage;