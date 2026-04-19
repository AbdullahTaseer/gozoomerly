'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserMinus } from 'lucide-react';
import GlobalInput from '../inputs/GlobalInput';
import FollowCard from '../cards/FollowCard';
import Avatar from "@/assets/svgs/boy-avatar.svg";
import { getFollowers, type UserConnection } from '@/lib/supabase/followUtils';
import ModalOrBottomSlider from './ModalOrBottomSlider';
import ConfirmationModalContent from './ConfirmationModalContent';
import { followUser, unfollowUser } from '@/lib/supabase/followUtils';
import { authService } from '@/lib/supabase/auth';

type Props = {
  userId?: string;
};

const FollowersModalContent = ({ userId }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [followers, setFollowers] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [unfollowConfirm, setUnfollowConfirm] = useState<{ name: string; userId: string } | null>(null);

  useEffect(() => {
    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await authService.getUser();
      if (!currentUser || !userId) return;

      const data = await getFollowers(userId);
      setFollowers(data);

      if (data.length > 0) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const followerIds = data.map((f: { user_id: string }) => f.user_id);
        const { data: followData } = await supabase
          .from('follows')
          .select('followee_id')
          .eq('follower_id', currentUser.id)
          .in('followee_id', followerIds);

        const statusMap: Record<string, boolean> = {};
        const followingIds = new Set(
          followData?.map((f: { followee_id: string }) => f.followee_id) || []
        );
        data.forEach((follower: { user_id: string }) => {
          statusMap[follower.user_id] = followingIds.has(follower.user_id);
        });
        setFollowingStatus(statusMap);
      }
    } catch (err: any) {
      console.error('Error fetching followers:', err);
      setError(err.message || 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = (followerUserId: string, name: string) => {
    const isFollowing = followingStatus[followerUserId];
    if (isFollowing) {
      setUnfollowConfirm({ name, userId: followerUserId });
    } else {
      doFollow(followerUserId);
    }
  };

  const doFollow = async (followerUserId: string) => {
    try {
      const currentUser = await authService.getUser();
      if (!currentUser) return;
      await followUser(currentUser.id, followerUserId);
      setFollowingStatus(prev => ({ ...prev, [followerUserId]: true }));
    } catch (err: any) {
      console.error('Error following:', err);
    }
  };

  const doUnfollow = async () => {
    if (!unfollowConfirm) return;
    try {
      const currentUser = await authService.getUser();
      if (!currentUser) return;
      await unfollowUser(currentUser.id, unfollowConfirm.userId);
      setFollowingStatus(prev => ({ ...prev, [unfollowConfirm.userId]: false }));
    } catch (err: any) {
      console.error('Error unfollowing:', err);
    } finally {
      setUnfollowConfirm(null);
    }
  };

  const filteredList = followers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className='relative w-full mb-4'>
        <Search size={18} className='absolute top-3 left-3 text-gray-500' />
        <GlobalInput
          placeholder='Search Followers...'
          height='42px'
          width='100%'
          borderRadius='100px'
          inputClassName="pl-10"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3 h-[65vh] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="text-center text-gray-500 mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-2">Loading followers...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : filteredList.length > 0 ? (
          filteredList.map((user) => (
            <FollowCard
              key={user.follow_id}
              name={user.name || 'Unknown'}
              data={user.notes || `Followed on ${new Date(user.followed_at).toLocaleDateString()}`}
              imgSrc={user.profile_pic || user.profile_pic_url || Avatar}
              btnTitle={followingStatus[user.user_id] ? "Following" : "Follow"}
              onClickBtn={() => handleToggleFollow(user.user_id, user.name || 'Unknown')}
              onNameClick={() => router.push(`/u/visitProfile/${user.user_id}`)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {search ? "No results found" : "No followers yet"}
          </p>
        )}
      </div>

      <ModalOrBottomSlider
        isOpen={!!unfollowConfirm}
        onClose={() => setUnfollowConfirm(null)}
        title="Unfollow"
        desktopClassName="max-w-sm"
        contentClassName="!p-6"
      >
        {unfollowConfirm ? (
          <ConfirmationModalContent
            onClose={() => setUnfollowConfirm(null)}
            icon={UserMinus}
            message={`Are you sure you want to unfollow ${unfollowConfirm.name}?`}
            primaryLabel="Yes, Unfollow"
            onPrimaryClick={doUnfollow}
          />
        ) : null}
      </ModalOrBottomSlider>
    </div>
  );
};

export default FollowersModalContent;
