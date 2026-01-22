'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Search, Check, Loader2 } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { getFollowers, getFollowing, UserConnection } from '@/lib/supabase/followUtils';
import { inviteUserToBoard } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';

interface InviteToBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardTitle?: string;
}

const InviteToBoardModal: React.FC<InviteToBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  boardTitle
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [users, setUsers] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();
      if (!user) return;

      const data = activeTab === 'followers'
        ? await getFollowers(user.id)
        : await getFollowing(user.id);

      setUsers(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId: string) => {
    try {
      setInvitingUserId(userId);

      const result = await inviteUserToBoard({
        boardId,
        inviteeUserId: userId,
        role: 'contributor'
      });

      if (result.success) {
        setInvitedUsers(prev => new Set(prev).add(userId));
      }
    } catch (error) {
    } finally {
      setInvitingUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {}
      <div className="relative bg-white rounded-[24px] w-[450px] max-w-[90vw] max-h-[80vh] flex flex-col">
        {}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-black">
            Invite to {boardTitle || 'Board'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'followers'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'following'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Following
          </button>
        </div>

        {}
        <div className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const isInvited = invitedUsers.has(user.user_id);
                const isInviting = invitingUserId === user.user_id;

                return (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={user.profile_pic_url || user.profile_pic || ProfileAvatar}
                          alt={user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-black">{user.name || 'Unknown'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => !isInvited && !isInviting && handleInvite(user.user_id)}
                      disabled={isInvited || isInviting}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isInvited
                          ? 'bg-green-100 text-green-600 cursor-default'
                          : isInviting
                          ? 'bg-gray-200 text-gray-500 cursor-wait'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isInvited ? (
                        <span className="flex items-center gap-1">
                          <Check size={14} />
                          Invited
                        </span>
                      ) : isInviting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        'Invite'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No users found' : `No ${activeTab} yet`}
              </p>
            </div>
          )}
        </div>

        {}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-full text-white font-semibold text-base"
            style={{
              background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteToBoardModal;
