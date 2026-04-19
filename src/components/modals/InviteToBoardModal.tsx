'use client';

import {  useState, useEffect  } from 'react';
import Image from 'next/image';
import { authService } from '@/lib/supabase/auth';
import { inviteUserToBoard } from '@/lib/supabase/boards';
import { X, Search, Check, Loader2 } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { getAllUserConnections, type UserConnection } from '@/lib/supabase/connections';

interface InviteToBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardTitle?: string;
}

const InviteToBoardModalContent: React.FC<InviteToBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  boardTitle,
}) => {
  const [users, setUsers] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();
      if (!user) return;

      const { data, error } = await getAllUserConnections(user.id);
      if (error) {
        setUsers([]);
        return;
      }

      const rows = (data || []) as UserConnection[];
      const seen = new Set<string>();
      const unique: UserConnection[] = [];
      for (const row of rows) {
        const uid = row.connected_user_id || row.user_id;
        if (!uid || seen.has(uid)) continue;
        seen.add(uid);
        unique.push(row);
      }
      setUsers(unique);
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

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
      <div className="relative bg-white flex flex-col">
        {boardTitle ? (
          <div className="px-4 pt-4 pb-1 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Invite to board</p>
            <p className="font-semibold text-black truncate">{boardTitle}</p>
          </div>
        ) : null}

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

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const peerId = user.connected_user_id || user.user_id;
                const isInvited = invitedUsers.has(peerId);
                const isInviting = invitingUserId === peerId;

                return (
                  <div
                    key={`${user.id}-${peerId}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={user.profile_pic_url || ProfileAvatar}
                          alt={user.name || 'User'}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-black">{user.name || user.email || 'Unknown'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => !isInvited && !isInviting && handleInvite(peerId)}
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
                {searchQuery ? 'No users found' : 'No connections yet'}
              </p>
            </div>
          )}
        </div>

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
  );
};

export default InviteToBoardModalContent;
