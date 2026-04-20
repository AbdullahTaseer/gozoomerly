'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, UserMinus } from "lucide-react";
import GlobalInput from "../inputs/GlobalInput";
import FollowCard from "../cards/FollowCard";
import Avatar from "@/assets/svgs/boy-avatar.svg";
import { getFollowing, type UserConnection } from '@/lib/supabase/followUtils';
import ModalOrBottomSlider from './ModalOrBottomSlider';
import ConfirmationModalContent from './ConfirmationModalContent';
import { unfollowUser } from '@/lib/supabase/followUtils';
import { SkeletonListItem } from '@/components/skeletons';

type Props = {
  userId?: string;
};

const FollowingModalContent = ({ userId }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unfollowConfirm, setUnfollowConfirm] = useState<{ name: string; userId: string } | null>(null);

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) return;

      const data = await getFollowing(userId);
      setFollowing(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load following');
    } finally {
      setLoading(false);
    }
  };

  const doUnfollow = async (followingUserId: string) => {
    try {
      if (!userId) return;
      await unfollowUser(userId, followingUserId);
      setFollowing(prev => prev.filter(user => user.user_id !== followingUserId));
    } catch (err: any) {
    } finally {
      setUnfollowConfirm(null);
    }
  };

  const filteredList = following.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative w-full mb-4">
        <Search size={18} className="absolute top-3 left-3 text-gray-500" />
        <GlobalInput
          placeholder="Search Following..."
          height="42px"
          width="100%"
          borderRadius="100px"
          inputClassName="pl-10"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3 h-[65vh] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="space-y-3 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : filteredList.length > 0 ? (
          filteredList.map(user => (
            <FollowCard
              key={user.follow_id}
              name={user.name || 'Unknown'}
              data={user.notes || `Followed on ${new Date(user.followed_at).toLocaleDateString()}`}
              imgSrc={user.profile_pic || user.profile_pic_url || Avatar}
              btnTitle="Following"
              onClickBtn={() => setUnfollowConfirm({ name: user.name || 'Unknown', userId: user.user_id })}
              onNameClick={() => router.push(`/u/visitProfile/${user.user_id}`)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {search ? "No results found" : "Not following anyone yet"}
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
            onPrimaryClick={() => doUnfollow(unfollowConfirm.userId)}
          />
        ) : null}
      </ModalOrBottomSlider>
    </div>
  );
};

export default FollowingModalContent;
