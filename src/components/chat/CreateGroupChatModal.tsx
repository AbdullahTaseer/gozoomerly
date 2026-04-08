'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { searchUsers } from '@/lib/supabase/chat';
import type { GroupInvitePolicy } from '@/lib/supabase/groupChat';

type CreateGroupChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onCreate: (name: string, participantIds: string[], policy: GroupInvitePolicy) => Promise<void>;
};

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [policy, setPolicy] = useState<GroupInvitePolicy>('admins_only');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ id: string; name: string; profile_pic_url?: string; email?: string }[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPolicy('admins_only');
      setQuery('');
      setResults([]);
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      const { users, error } = await searchUsers(query.trim(), currentUserId, 15);
      if (!error && users) {
        setResults(users.filter((u) => u.id !== currentUserId));
      }
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, currentUserId, isOpen]);

  const toggleUser = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 200) return;
    if (selectedIds.size === 0) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed, [...selectedIds], policy);
      onClose();
    } catch {
      /* toast handled in parent */
    } finally {
      setSubmitting(false);
    }
  }, [name, onClose, onCreate, policy, selectedIds]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleModalContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.slice(0, 200));
  }, []);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handlePolicyAdminsOnly = useCallback(() => {
    setPolicy('admins_only');
  }, []);

  const handlePolicyAllMembers = useCallback(() => {
    setPolicy('all_members');
  }, []);

  const handleResultClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const id = e.currentTarget.dataset.userId;
      if (!id) return;
      toggleUser(id);
    },
    [toggleUser]
  );

  const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = ProfileAvatar.src || ProfileAvatar;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/50"
        aria-label="Close"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-labelledby="create-group-title"
        className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-gray-100 p-5"
        onClick={handleModalContainerClick}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 id="create-group-title" className="text-lg font-bold text-gray-900">
            New group chat
          </h2>
          <button type="button" onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
        <GlobalInput
          placeholder="Up to 200 characters"
          height="44px"
          width="100%"
          borderRadius="12px"
          value={name}
          onChange={handleNameChange}
          inputClassName="border-gray-200"
        />

        <p className="text-sm font-medium text-gray-700 mt-4 mb-2">Who can add members?</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="invitePolicy"
              checked={policy === 'admins_only'}
              onChange={handlePolicyAdminsOnly}
            />
            Admins only
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="invitePolicy"
              checked={policy === 'all_members'}
              onChange={handlePolicyAllMembers}
            />
            All members
          </label>
        </div>

        <p className="text-sm font-medium text-gray-700 mt-4 mb-2">Add people</p>
        <GlobalInput
          placeholder="Search users by name or email"
          height="44px"
          width="100%"
          borderRadius="12px"
          value={query}
          onChange={handleQueryChange}
          inputClassName="border-gray-200"
        />

        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-100 rounded-xl">
          {searching ? (
            <p className="p-3 text-sm text-gray-500">Searching…</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-gray-400">{query.trim() ? 'No users found' : 'Type to search'}</p>
          ) : (
            results.map((u) => (
              <button
                key={u.id}
                type="button"
                data-user-id={u.id}
                onClick={handleResultClick}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
                  selectedIds.has(u.id) ? 'bg-pink-50' : ''
                }`}
              >
                <Image
                  src={u.profile_pic_url || ProfileAvatar}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                  onError={handleAvatarError}
                />
                <span className="text-sm font-medium text-gray-900 flex-1 truncate">{u.name}</span>
                {selectedIds.has(u.id) && <span className="text-xs text-pink-600 font-semibold">Added</span>}
              </button>
            ))
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-full border border-gray-200 bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !name.trim() || selectedIds.size === 0}
            onClick={handleSubmit}
            className="shrink-0 min-w-[140px] rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-opacity enabled:bg-gradient-to-r enabled:from-[#FF4E94] enabled:to-[#8B5CF6] enabled:text-white enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
          >
            {submitting ? 'Creating…' : 'Create group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
