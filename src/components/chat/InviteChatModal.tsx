'use client';

import {  useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import ConnectionCard from '@/components/cards/ConnectionCard';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import { inviteContacts } from '@/lib/MockData';

interface User {
  id: string;
  name: string;
  profile_pic_url?: string;
  email?: string;
  status?: string;
}

interface InviteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation?: (conversationId: string) => void;
  onStartConversationWithUserId?: (userId: string) => void;
}

const InviteChatModal: React.FC<InviteChatModalProps> = ({
  isOpen,
  onClose,
  onStartConversation,
  onStartConversationWithUserId,
}) => {
  const router = useRouter();
  const [contactsOnZoiax, setContactsOnZoiax] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const authService = new AuthService();

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);
      const supabase = createClient();

      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, name, profile_pic_url, email')
        .neq('id', user.id)
        .limit(50);

      if (!error) {

        const usersWithStatus = (users || []).map(user => ({
          ...user,
          status: 'Have a nice day!',
        }));
        setContactsOnZoiax(usersWithStatus);
      }

    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = (userId: string) => {

    if (onStartConversationWithUserId) {
      onStartConversationWithUserId(userId);
      onClose();
      return;
    }

    router.push(`/u/chat?userId=${userId}`);
    onClose();
  };

  const handleInvite = (contact: typeof inviteContacts[0]) => {
    alert(`Invite sent to ${contact.name} at ${contact.phone}`);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black">New chat</h2>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-gray-200 transition-colors z-10 flex-shrink-0"
        >
          <X size={18} className="text-black" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-sm text-gray-600">Loading contacts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {}
          <div>
            <h3 className="text-black text-base mb-3">Contacts on Zoiax</h3>
            <div className="space-y-4">
              {contactsOnZoiax.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No contacts found</p>
              ) : (
                contactsOnZoiax.map((user) => (
                  <ConnectionCard
                    key={user.id}
                    profileImage={user.profile_pic_url || ProfileAvatar}
                    name={user.name}
                    username={user.status || user.email || 'Have a nice day!'}
                    isFollowing={true}
                    onClick={() => handleStartConversation(user.id)}
                  />
                ))
              )}
            </div>
          </div>

          {}
          <div>
            <h3 className="text-black text-base mb-3">Invite to Zoiax</h3>
            <div className="space-y-4">
              {inviteContacts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No contacts to invite</p>
              ) : (
                inviteContacts.map((contact) => (
                  <ConnectionCard
                    key={contact.id}
                    profileImage={contact.profile_pic_url || ProfileAvatar}
                    name={contact.name}
                    username={contact.phone}
                    isFollowing={false}
                    buttonText="Invite"
                    onClick={() => handleInvite(contact)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {}
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {}
      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${!isOpen ? 'pointer-events-none' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isOpen}
      >
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 max-h-[85vh] overflow-y-auto">
          {content}
        </div>
      </div>

      {}
      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1001] items-center justify-center transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteChatModal;

