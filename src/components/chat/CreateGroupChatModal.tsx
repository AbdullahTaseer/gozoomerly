'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
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

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="create-group-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl border border-gray-100 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 id="create-group-title" className="text-lg font-bold text-gray-900">
            New group chat
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
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
          onChange={(e) => setName(e.target.value.slice(0, 200))}
          inputClassName="border-gray-200"
        />

        <p className="text-sm font-medium text-gray-700 mt-4 mb-2">Who can add members?</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="invitePolicy"
              checked={policy === 'admins_only'}
              onChange={() => setPolicy('admins_only')}
            />
            Admins only
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="invitePolicy"
              checked={policy === 'all_members'}
              onChange={() => setPolicy('all_members')}
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
          onChange={(e) => setQuery(e.target.value)}
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
                onClick={() => toggleUser(u.id)}
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
                  onError={(e) => {
                    e.currentTarget.src = ProfileAvatar.src || ProfileAvatar;
                  }}
                />
                <span className="text-sm font-medium text-gray-900 flex-1 truncate">{u.name}</span>
                {selectedIds.has(u.id) && <span className="text-xs text-pink-600 font-semibold">Added</span>}
              </button>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <GlobalButton
            title="Cancel"
            onClick={onClose}
            className="!bg-gray-100 !text-gray-900 border border-gray-200"
          />
          <GlobalButton
            title={submitting ? 'Creating…' : 'Create group'}
            disabled={submitting || !name.trim() || selectedIds.size === 0}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
