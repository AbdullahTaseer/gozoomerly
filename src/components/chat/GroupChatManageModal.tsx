'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, UserPlus } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { searchUsers } from '@/lib/supabase/chat';
import {
  rpcGetGroupConversationDetails,
  rpcAddConversationParticipant,
  rpcLeaveConversation,
  type GroupMemberRole,
  type GroupInvitePolicy,
} from '@/lib/supabase/groupChat';
import toast from 'react-hot-toast';

type GroupChatManageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
  currentUserId: string;
  onAfterLeave?: () => void;
  onUpdated?: () => void;
};

const GroupChatManageModal: React.FC<GroupChatManageModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  currentUserId,
  onAfterLeave,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [yourRole, setYourRole] = useState<GroupMemberRole | undefined>();
  const [policy, setPolicy] = useState<GroupInvitePolicy | ''>('');
  const [memberCountActive, setMemberCountActive] = useState<number>(0);
  const [members, setMembers] = useState<{ user_id: string; name?: string; role?: GroupMemberRole; is_active?: boolean }[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; name: string; profile_pic_url?: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !conversationId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await rpcGetGroupConversationDetails({
        userId: currentUserId,
        conversationId,
      });
      if (cancelled) return;
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (data) {
        setName(data.name || 'Group');
        setYourRole(data.your_role);
        setPolicy(data.group_invite_policy ?? '');
        setMemberCountActive(data.member_count_active);
        setMembers(data.members || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, conversationId, currentUserId]);

  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      const { users, error } = await searchUsers(query.trim(), currentUserId, 12);
      if (!error && users) {
        const memberIds = new Set(members.map((m) => m.user_id));
        setResults(users.filter((u) => u.id !== currentUserId && !memberIds.has(u.id)));
      }
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, currentUserId, isOpen, members]);

  const canAdd =
    yourRole === 'owner' ||
    yourRole === 'admin' ||
    policy === 'all_members';

  const roleBadgeClass = (role?: GroupMemberRole) => {
    if (role === 'owner') return 'bg-violet-100 text-violet-800';
    if (role === 'admin') return 'bg-sky-100 text-sky-800';
    return 'bg-gray-100 text-gray-700';
  };

  const handleAdd = async (userId: string) => {
    if (!conversationId) return;
    setAdding(true);
    const { success, error } = await rpcAddConversationParticipant({
      adderId: currentUserId,
      conversationId,
      newUserId: userId,
    });
    setAdding(false);
    if (!success || error) {
      toast.error(error?.message || 'Could not add member');
      return;
    }
    toast.success('Member added');
    setQuery('');
    setResults([]);
    const { data: refreshed } = await rpcGetGroupConversationDetails({
      userId: currentUserId,
      conversationId,
    });
    if (refreshed) {
      setName(refreshed.name);
      setYourRole(refreshed.your_role);
      setPolicy(refreshed.group_invite_policy ?? '');
      setMemberCountActive(refreshed.member_count_active);
      setMembers(refreshed.members);
    }
    onUpdated?.();
  };

  const handleLeave = async () => {
    if (!conversationId) return;
    if (!window.confirm('Leave this group?')) return;
    setLeaving(true);
    const { error, ownershipTransferredTo } = await rpcLeaveConversation({
      userId: currentUserId,
      conversationId,
    });
    setLeaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (ownershipTransferredTo) {
      toast.success('You left the group. Ownership was transferred.');
    } else {
      toast.success('You left the group');
    }
    onAfterLeave?.();
    onClose();
  };

  if (!isOpen || !conversationId) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-gray-100 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-lg font-bold text-gray-900 truncate pr-2">{name || 'Group'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 shrink-0" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-gray-500">Your role</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${roleBadgeClass(yourRole)}`}
              >
                {yourRole || 'member'}
              </span>
              {policy ? (
                <span className="text-xs text-gray-500">
                  · Invites: <span className="font-medium text-gray-700">{policy.replace(/_/g, ' ')}</span>
                </span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Active members:{' '}
              <span className="font-semibold text-gray-900">{memberCountActive}</span>
              {members.length !== memberCountActive ? (
                <span className="text-gray-400"> ({members.length} listed)</span>
              ) : null}
            </p>

            <p className="text-sm font-semibold text-gray-800 mb-2">Members</p>
            <ul className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50 mb-4">
              {members.length === 0 ? (
                <li className="px-3 py-4 text-sm text-gray-500 text-center">No members in response</li>
              ) : (
                members.map((m) => (
                  <li key={m.user_id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image src={ProfileAvatar} alt="" width={32} height={32} className="object-cover" />
                    </div>
                    <span className="flex-1 truncate">{m.name || m.user_id.slice(0, 8)}</span>
                    {m.is_active === false ? (
                      <span className="text-[10px] uppercase text-amber-600 font-medium">Inactive</span>
                    ) : null}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${roleBadgeClass(m.role)}`}
                    >
                      {m.role || 'member'}
                    </span>
                  </li>
                ))
              )}
            </ul>

            {canAdd && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <UserPlus size={16} /> Add member
                </p>
                <GlobalInput
                  placeholder="Search users"
                  height="40px"
                  width="100%"
                  borderRadius="12px"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  inputClassName="border-gray-200"
                />
                <div className="mt-1 max-h-32 overflow-y-auto border border-gray-100 rounded-xl">
                  {searching ? (
                    <p className="p-2 text-xs text-gray-500">Searching…</p>
                  ) : results.length === 0 ? (
                    <p className="p-2 text-xs text-gray-400">{query.trim() ? 'No users' : 'Type to search'}</p>
                  ) : (
                    results.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        disabled={adding}
                        onClick={() => handleAdd(u.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Image
                          src={u.profile_pic_url || ProfileAvatar}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = ProfileAvatar.src || ProfileAvatar;
                          }}
                        />
                        <span className="truncate">{u.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <GlobalButton
              title={leaving ? 'Leaving…' : 'Leave group'}
              onClick={(e) => {
                e.preventDefault();
                handleLeave();
              }}
              disabled={leaving}
              className="!bg-red-50 !text-red-700 border border-red-200 w-full"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GroupChatManageModal;
