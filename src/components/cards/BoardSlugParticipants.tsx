'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { getBoardParticipants, type BoardParticipant } from "@/lib/supabase/boards";

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
  const limit = 20;

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    fetchParticipants();
  }, [boardId]);

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
        console.error('Error fetching participants:', fetchError);
      } else if (data?.data) {
        const responseData = data.data;
        if (loadMore) {
          setParticipants(prev => [...prev, ...responseData.participants]);
        } else {
          setParticipants(responseData.participants);
        }
        setTotalParticipants(responseData.total_participants);
        setHasMore(responseData.pagination.has_more);
        setOffset(currentOffset + responseData.participants.length);
      }
    } catch (err) {
      setError('Failed to load participants');
      console.error('Error in fetchParticipants:', err);
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
    router.push(`/dashboard/visitProfile/${userId}`);
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserClick(participant.user.id);
            }}
            className="bg-white text-md text-black rounded-full py-1 px-5 hover:bg-gray-100 transition-colors shrink-0"
          >
            View Profile
          </button>
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
