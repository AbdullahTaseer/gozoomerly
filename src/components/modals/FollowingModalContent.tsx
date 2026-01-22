'use client';

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import GlobalInput from "../inputs/GlobalInput";
import FollowCard from "../cards/FollowCard";
import Avatar from "@/assets/svgs/boy-avatar.svg";
import { getFollowing, type UserConnection } from '@/lib/supabase/followUtils';
import { unfollowUser } from '@/lib/supabase/followUtils';
import { authService } from '@/lib/supabase/auth';

type Props = {
  userId?: string;
};

const FollowingModalContent = ({ userId }: Props) => {
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleToggleFollow = async (followingUserId: string) => {
    try {
      const currentUser = await authService.getUser();
      if (!currentUser || !userId) return;

      await unfollowUser(userId, followingUserId);

      setFollowing(prev => prev.filter(user => user.user_id !== followingUserId));
    } catch (err: any) {
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
          <div className="text-center text-gray-500 mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-2">Loading following...</p>
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
              onClickBtn={() => handleToggleFollow(user.user_id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {search ? "No results found" : "Not following anyone yet"}
          </p>
        )}
      </div>

    </div>
  );
};

export default FollowingModalContent;
