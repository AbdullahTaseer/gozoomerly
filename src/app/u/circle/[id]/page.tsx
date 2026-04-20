"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TitleCard from "@/components/cards/TitleCard";
import GlobalButton from "@/components/buttons/GlobalButton";
import AddCircleCard from "@/components/cards/AddCircleCard";
import GlobalModal from "@/components/modals/GlobalModal";
import AddCircleMemberModal from "@/components/modals/AddCircleMemberModal";
import { getCircleById, getCircleMembers, removeCircleMember, Circle } from "@/lib/supabase/circles";
import DashNavbar from "@/components/navbar/DashNavbar";
import MobileHeader from "@/components/navbar/MobileHeader";
import { Plus } from "lucide-react";
import DefaultAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import { Skeleton, SkeletonConnectionCard } from "@/components/skeletons";

interface CircleMember {
  id: string;
  circle_id: string;
  user_id?: string;
  member_user_id?: string;
  role: string;
  created_at: string;
  name?: string;
  profile_pic_url?: string;
  email?: string;

  profiles?: {
    id: string;
    name: string;
    profile_pic_url: string;
    email: string;
  };
}

interface CircleByIdProps {
  params: Promise<{
    id: string;
  }>;
}

const CircleById = ({ params }: CircleByIdProps) => {
  const router = useRouter();
  const [memberModalOpen, setIsMemberModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingMember, setDeletingMember] = useState(false);
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: circleId } = use(params);

  useEffect(() => {
    fetchCircleData();
  }, [circleId]);

  const fetchCircleData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: circleData, error: circleError } = await getCircleById(circleId);
      if (circleError) {
        setError(`Failed to load circle: ${circleError.message}`);
        setLoading(false);
        return;
      }

      const { data: membersData, error: membersError } = await getCircleMembers(circleId);
      if (membersError) {
        setError(`Failed to load members: ${membersError.message}`);
        setLoading(false);
        return;
      }

      setCircle(circleData);
      setMembers(membersData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    setMemberToDelete({ id: memberId, name: memberName });
    setDeleteModalOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      setDeletingMember(true);
      const { error: deleteError } = await removeCircleMember(circleId, memberToDelete.id);

      if (deleteError) {
        alert(`Failed to remove member: ${deleteError.message}`);
        return;
      }

      await fetchCircleData();

      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(`Error removing member: ${errorMessage}`);
    } finally {
      setDeletingMember(false);
    }
  };

  return (
    <>
      <DashNavbar />
      <MobileHeader title="Family" RightIcon={Plus} rightIconClick={() => setIsMemberModalOpen(true)} />
      <div className="px-[7%] max-[769px]:px-4 py-3">
        {loading ? (
          <div className="space-y-6 py-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonConnectionCard key={i} />
              ))}
            </div>
          </div>
        ) : error || !circle ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-semibold mb-2">Error Loading Circle</p>
              <p className="text-red-500 text-sm">{error || 'Circle not found'}</p>
              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={fetchCircleData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/u/circles')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Back to Circles
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>

        <div className="flex justify-between items-center flex-wrap gap-2 max-[769px]:hidden">
          <TitleCard title={circle.name} />
          <GlobalButton
            title="Add Member"
            bgColor="black"
            width="140px"
            hover={{ bgColor: "black" }}
            onClick={() => setIsMemberModalOpen(true)}
          />
        </div>

        {}
        {circle.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{circle.description}</p>
          </div>
        )}

        {}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </div>

        {}
        <div className="mt-2">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-xl font-semibold text-gray-700 mb-2">No Members Yet</p>
                <p className="text-gray-500 mb-6">This circle doesn't have any members yet. Add some members to get started!</p>
                <GlobalButton
                  title="Add First Member"
                  onClick={() => setIsMemberModalOpen(true)}
                />
              </div>
            </div>
          ) : (
            members.map((member) => {
              // Handle both nested profiles and flat structure
              const profilePic = member.profiles?.profile_pic_url || member.profile_pic_url || DefaultAvatar;
              const memberName = member.profiles?.name || member.name || member.profiles?.email || member.email || 'Unknown';
              const memberEmail = member.profiles?.email || member.email || '';
              // Try different possible field names for user ID
              const memberId = member.user_id || member.member_user_id || member.id;

              return (
                <AddCircleCard
                  key={member.id}
                  avatar={profilePic}
                  name={memberName}
                  time={member.role || 'Member'}
                  message={memberEmail}
                  onDelete={() => handleDeleteMember(memberId, memberName)}
                />
              );
            })
          )}
        </div>

        <GlobalModal
          title="Add Member"
          isOpen={memberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
          className="w-[500px] max-[550px]:w-[95vw]"
        >
          <AddCircleMemberModal
            circleId={circleId}
            onMemberAdded={() => {
              fetchCircleData();
              setIsMemberModalOpen(false);
            }}
          />
        </GlobalModal>

        <GlobalModal
          title="Remove Member"
          isOpen={deleteModalOpen}
          onClose={() => {
            if (!deletingMember) {
              setDeleteModalOpen(false);
              setMemberToDelete(null);
            }
          }}
          className="w-[450px] max-[500px]:w-[95vw]"
        >
          <div className="space-y-6">
            <p className="text-gray-700">
              Are you sure you want to remove <span className="font-semibold">{memberToDelete?.name}</span> from this circle?
            </p>
            <div className="flex gap-3 justify-end">
              <GlobalButton
                title="Cancel"
                bgColor="#E5E7EB"
                width="100px"
                hover={{ bgColor: "#D1D5DB" }}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMemberToDelete(null);
                }}
                disabled={deletingMember}
              />
              <GlobalButton
                title={deletingMember ? "Removing..." : "Remove"}
                bgColor="#EF4444"
                width="120px"
                hover={{ bgColor: "#DC2626" }}
                onClick={confirmDeleteMember}
                disabled={deletingMember}
              />
            </div>
          </div>
        </GlobalModal>
          </>
        )}
      </div>
    </>
  );
};

export default CircleById;

