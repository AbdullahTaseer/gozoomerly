"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalInput from "../inputs/GlobalInput";
import GlobalButton from "../buttons/GlobalButton";
import { getAllUserConnections, UserConnection } from "@/lib/supabase/connections";
import { getCircleMembers, addCircleMember } from "@/lib/supabase/circles";
import { authService } from "@/lib/supabase/auth";
import defaultAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import { SkeletonListItem } from "@/components/skeletons";

interface AddCircleMemberModalProps {
  circleId?: string;
  onMemberAdded?: () => void;
}

const AddCircleMemberModal = ({ circleId, onMemberAdded }: AddCircleMemberModalProps) => {
  const router = useRouter();
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<UserConnection[]>([]);
  const [existingMemberIds, setExistingMemberIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserConnections();
  }, []);

  useEffect(() => {
    let filtered = connections.filter((connection) => {
      const userId = connection.connected_user_id || connection.user_id;
      return !existingMemberIds.has(userId);
    });

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((connection) =>
        connection.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredConnections(filtered);
  }, [searchQuery, connections, existingMemberIds]);

  const fetchUserConnections = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }

      const { data, error: connectionError } = await getAllUserConnections(user.id);
      if (connectionError) {
        setError(`Failed to load connections: ${connectionError.message}`);
        setLoading(false);
        return;
      }

      if (circleId) {
        const { data: membersData, error: membersError } = await getCircleMembers(circleId);
        if (!membersError && membersData) {
          const memberIds = new Set<string>(
            membersData
              .map((member: any) => member.user_id || member.member_user_id)
              .filter((id: any): id is string => Boolean(id))
          );
          setExistingMemberIds(memberIds);
        }
      }

      setConnections(data || []);
      setFilteredConnections(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!circleId) {
      return;
    }

    try {
      setAddingMemberId(userId);

      const { error: addError } = await addCircleMember(circleId, userId, false);

      if (addError) {
        alert(`Failed to add member: ${addError.message}`);
        return;
      }

      setExistingMemberIds(prev => new Set([...prev, userId]));

      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(`Error adding member: ${errorMessage}`);
    } finally {
      setAddingMemberId(null);
    }
  };
  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold mb-2">Error Loading Connections</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchUserConnections}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="relative">
        <Search size={18} className="absolute top-3 left-3 text-gray-500" />
        <GlobalInput
          placeholder="Search connections..."
          height="42px"
          width="100%"
          inputClassName="pl-10 rounded-full!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {filteredConnections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-600 font-medium mb-2">
              {searchQuery ? 'No connections found' : 'No Connections Yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'Try searching with a different name or email'
                : 'Connect with friends to add them to circles!'}
            </p>
          </div>
        ) : (
          filteredConnections.map((connection) => {
            const userId = connection.connected_user_id || connection.user_id;

            return (
              <div
                key={`${connection.id}-${userId}`}
                className="flex items-center justify-between bg-[#F4F4F4] rounded-[12px] py-3 px-4"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={connection.profile_pic_url || defaultAvatar}
                    width={40}
                    height={40}
                    alt={connection.name || 'User'}
                    className="rounded-full shrink-0 object-cover"
                  />

                  <div>
                    <p className="font-medium text-[15px]">{connection.name || connection.email || 'Unknown'}</p>
                    {connection.name && connection.email && (
                      <p className="text-xs text-gray-500">{connection.email}</p>
                    )}
                  </div>
                </div>

                <GlobalButton
                  title={addingMemberId === userId ? "Adding..." : "Add"}
                  bgColor="black"
                  width="80px"
                  hover={{ bgColor: "black" }}
                  onClick={() => handleAddMember(userId)}
                  disabled={addingMemberId === userId}
                />
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default AddCircleMemberModal;
