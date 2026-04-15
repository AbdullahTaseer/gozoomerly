'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import {
  getBoardInvitations,
  inviteUserToBoard,
  type BoardInvitation,
} from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';

interface BoardSlugInvitedProps {
  boardId: string;
  creatorId: string;
}

function inviteeSubtitle(invitee: BoardInvitation['invitee']) {
  if (!invitee) return '';
  if (invitee.email) {
    const local = invitee.email.split('@')[0];
    return `@${local}`;
  }
  return invitee.phone || '';
}

const BoardSlugInvited: React.FC<BoardSlugInvitedProps> = ({
  boardId,
  creatorId,
}) => {
  const router = useRouter();
  const [invites, setInvites] = useState<BoardInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const isOwner = Boolean(
    currentUserId && creatorId && currentUserId === creatorId,
  );

  const fetchInvitations = useCallback(async () => {
    if (!boardId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { invitations, error } = await getBoardInvitations(boardId);
    setLoading(false);
    if (error) {
      console.error('Invites error:', error);
      toast.error('Could not load invitations');
      setInvites([]);
      return;
    }
    setInvites(invitations);
  }, [boardId]);

  useEffect(() => {
    void (async () => {
      try {
        const user = await authService.getUser();
        setCurrentUserId(user?.id ?? null);
      } catch {
        setCurrentUserId(null);
      }
    })();
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleResend = async (invitationId: string, inviteeUserId: string) => {
    try {
      setResendingId(invitationId);
      const { success, error } = await inviteUserToBoard({
        boardId,
        inviteeUserId,
        role: 'contributor',
      });
      if (success) {
        toast.success('Invite resent');
        return;
      }
      const errorMessage = (error || '').toLowerCase();
      if (errorMessage.includes('already a participant')) {
        toast('This user is already a participant of this board');
        return;
      }
      if (errorMessage.includes('already invited')) {
        toast('This user has already been invited');
        return;
      }
      toast.error(error || 'Failed to resend invite');
    } catch {
      toast.error('Failed to resend invite. Please try again.');
    } finally {
      setResendingId(null);
    }
  };

  const goToProfile = (userId: string) => {
    router.push(`/u/visitProfile/${userId}`);
  };

  if (loading && invites.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No invitations found.</p>
        <button
          type="button"
          onClick={() => fetchInvitations()}
          className="mt-3 text-pink-500 hover:text-pink-600 text-sm font-medium"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-gray-600">
          {invites.length} invitation{invites.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => fetchInvitations()}
          disabled={loading}
          className="text-sm text-pink-500 hover:text-pink-600 font-medium disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {invites.map((item) => {
        const user = item.invitee;
        const uid = user?.id;
        const subtitle = inviteeSubtitle(user);

        return (
          <div
            key={item.id}
            className="bg-[#F4F4F4] flex-wrap gap-3 rounded-[12px] px-4 py-3 flex justify-between items-center"
          >
            <div
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => uid && goToProfile(uid)}
              role={uid ? 'button' : undefined}
            >
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src={user?.profile_pic_url || ProfileAvatar}
                  className="h-12 w-12 rounded-full object-cover"
                  alt={user?.name || 'User'}
                  fill
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = ProfileAvatar.src || String(ProfileAvatar);
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-black max-[450px]:text-[16px] text-[18px] font-semibold truncate">
                  {user?.name || 'Unknown'}
                </p>
                {subtitle ? (
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
              {item.status === 'accepted' ? (
                <span className="text-xs font-medium text-white bg-[#00A63E] rounded-full px-3 py-1.5">
                  Joined
                </span>
              ) : null}
              {item.status === 'pending' ? (
                <>
                  <span className="text-xs font-medium text-white bg-[#F8A629] rounded-full px-3 py-1.5">
                    Pending
                  </span>
                  {isOwner && uid ? (
                    <button
                      type="button"
                      disabled={resendingId === item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResend(item.id, uid);
                      }}
                      className="text-xs font-medium text-white bg-[#1B1D26] rounded-full px-3 py-1.5 hover:opacity-90 disabled:opacity-60"
                    >
                      {resendingId === item.id ? 'Sending…' : 'Resend invite'}
                    </button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardSlugInvited;
