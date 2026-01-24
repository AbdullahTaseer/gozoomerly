'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { getBoardParticipants, type BoardParticipant } from "@/lib/supabase/boards";
import { followUser, unfollowUser } from "@/lib/supabase/followUtils";
import { authService } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";

interface BoardSlugParticipantsProps {
  boardId: string;
}

const BoardSlugParticipants: React.FC<BoardSlugParticipantsProps> = ({ boardId }) => {
  const router = useRouter();
  const [participants, setParticipants] = useState<BoardParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  const limit = 20;

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    getCurrentUser();
    fetchParticipants();
  }, [boardId]);

  // Check following status when both user and participants are available
  useEffect(() => {
    if (currentUserId && participants.length > 0) {
      checkFollowingStatus(currentUserId, participants);
    }
  }, [currentUserId, participants.length]);

  useEffect(() => {
    if (currentUserId && participants.length > 0) {
      checkFollowingStatus(currentUserId, participants);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, participants.length]);

  const getCurrentUser = async () => {
    try {
      const user = await authService.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (err) {
      // User not logged in
    }
  };

  const checkFollowingStatus = async (userId: string, participantList: BoardParticipant[]) => {
    if (participantList.length === 0 || !userId) return;
    
    try {
      const supabase = createClient();
      const participantIds = participantList.map(p => p.user.id).filter(Boolean);
      
      if (participantIds.length === 0) return;
      
      const { data: follows, error } = await supabase
        .from('follows')
        .select('followee_id')
        .eq('follower_id', userId)
        .in('followee_id', participantIds);
      
      if (error) {
        console.error('Error checking follow status:', error);
        return;
      }
      
      if (follows) {
        const followingMap: Record<string, boolean> = {};
        follows.forEach(follow => {
          if (follow.followee_id) {
            followingMap[follow.followee_id] = true;
          }
        });
        setFollowingStatus(prev => ({ ...prev, ...followingMap }));
      }
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const fetchParticipants = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setError(null);
      }

      const currentOffset = loadMore ? offset : 0;
      const { data, error: fetchError } = await getBoardParticipants(boardId, {
        limit,
        offset: currentOffset,
      });

      if (fetchError) {
        setError('Failed to load participants');
      } else if (data?.data) {
        const responseData = data.data;
        const newParticipants = loadMore 
          ? [...participants, ...responseData.participants]
          : responseData.participants;
        
        if (loadMore) {
          setParticipants(newParticipants);
        } else {
          setParticipants(newParticipants);
        }
        setTotalParticipants(responseData.total_participants);
        setHasMore(responseData.pagination.has_more);
        setOffset(currentOffset + responseData.participants.length);
        
        // Check following status after loading participants
        if (currentUserId) {
          checkFollowingStatus(currentUserId, newParticipants);
        }
      }
    } catch (err) {
      setError('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffDays < 1) return 'Joined today';
      if (diffDays === 1) return 'Joined yesterday';
      if (diffDays < 7) return `Joined ${diffDays} days ago`;
      if (diffDays < 30) return `Joined ${Math.floor(diffDays / 7)} weeks ago`;
      if (diffMonths < 12) return `Joined ${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Joined recently';
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      creator: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700',
      moderator: 'bg-blue-100 text-blue-700',
      contributor: 'bg-green-100 text-green-700',
      viewer: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[role] || roleColors.viewer}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleUserClick = (userId: string) => {
    router.push(`/u/visitProfile/${userId}`);
  };

  const handleFollowToggle = async (participantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUserId || currentUserId === participantId) {
      return;
    }

    setFollowLoading(prev => ({ ...prev, [participantId]: true }));

    try {
      const isFollowing = followingStatus[participantId];
      
      if (isFollowing) {
        const result = await unfollowUser(currentUserId, participantId);
        if (result.success) {
          setFollowingStatus(prev => ({ ...prev, [participantId]: false }));
        }
      } else {
        const result = await followUser(currentUserId, participantId);
        if (result.success) {
          setFollowingStatus(prev => ({ ...prev, [participantId]: true }));
        }
      }
    } catch (err) {
      // Handle error
    } finally {
      setFollowLoading(prev => ({ ...prev, [participantId]: false }));
    }
  };

  if (loading && participants.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error && participants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No participants yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {totalParticipants > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
        </div>
      )}

      {participants.map((participant) => (
        <div
          key={participant.id}
          className="bg-[#F4F4F4] flex-wrap gap-3 rounded-[12px] px-4 py-3 flex justify-between items-center"
        >
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleUserClick(participant.user.id)}
          >
            <div className="relative h-12 w-12 shrink-0">
            <Image
                src={participant.user.profile_pic_url || ProfileAvatar}
                className="h-12 w-12 rounded-full shrink-0 object-cover"
                alt={participant.user.name}
                fill
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = ProfileAvatar.src || ProfileAvatar;
                }}
            />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-black max-[450px]:text-[16px] text-[18px] font-semibold truncate">
                  {participant.user.name}
              </p>
                {participant.user.is_verified && (
                  <span className="text-blue-500" title="Verified">✓</span>
                )}
                {getRoleBadge(participant.role)}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <p className="text-sm text-gray-500">
                  {formatDate(participant.joined_at)}
                </p>
                {participant.contribution_count > 0 && (
                  <span className="text-xs text-gray-400">
                    • {participant.contribution_count} contribution{participant.contribution_count !== 1 ? 's' : ''}
                  </span>
                )}
                {participant.user.city && (
                  <span className="text-xs text-gray-400">
                    • {participant.user.city}{participant.user.country ? `, ${participant.user.country}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {currentUserId && currentUserId !== participant.user.id ? (
            <button
              onClick={(e) => handleFollowToggle(participant.user.id, e)}
              disabled={followLoading[participant.user.id]}
              className={`text-md rounded-full py-1 px-5 transition-colors shrink-0 border ${
                followingStatus[participant.user.id]
                  ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  : 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
              } ${followLoading[participant.user.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {followLoading[participant.user.id] 
                ? 'Loading...' 
                : followingStatus[participant.user.id] 
                  ? 'Following' 
                  : 'Follow'}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUserClick(participant.user.id);
              }}
              className="bg-white text-md text-black rounded-full py-1 px-5 hover:bg-gray-100 transition-colors shrink-0"
            >
              View Profile
            </button>
          )}
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => fetchParticipants(true)}
            disabled={loading}
            className="text-pink-500 hover:text-pink-600 font-medium text-sm disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardSlugParticipants;
