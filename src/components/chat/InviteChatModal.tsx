'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import { getOrCreateDirectConversation } from '@/lib/supabase/chat';

interface User {
  id: string;
  name: string;
  profile_pic_url?: string;
  email?: string;
  status?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  profile_pic_url?: string;
}

interface InviteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation?: (conversationId: string) => void;
}

const InviteChatModal: React.FC<InviteChatModalProps> = ({
  isOpen,
  onClose,
  onStartConversation,
}) => {
  const [contactsOnZoiax, setContactsOnZoiax] = useState<User[]>([]);
  const [inviteContacts, setInviteContacts] = useState<Contact[]>([]);
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

      // Fetch all users on Zoiax (excluding current user)
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, name, profile_pic_url, email')
        .neq('id', user.id)
        .limit(50);

      if (error) {
        console.error('Error loading contacts:', error);
      } else {
        // Add default status message for each user
        const usersWithStatus = (users || []).map(user => ({
          ...user,
          status: 'Have a nice day!',
        }));
        setContactsOnZoiax(usersWithStatus);
      }

      // TODO: Load phone contacts from device
      // For now, using mock data for invite contacts
      // In a real implementation, you would use a contacts API
      const mockInviteContacts: Contact[] = [
        {
          id: '1',
          name: 'Jordan',
          phone: '555-0123',
        },
        {
          id: '2',
          name: 'Anna',
          phone: '555-0123',
        },
        {
          id: '3',
          name: 'Jamie',
          phone: '555-0123',
        },
        {
          id: '4',
          name: 'Casey',
          phone: '555-0123',
        },
        {
          id: '5',
          name: 'Morgan',
          phone: '555-0123',
        },
      ];
      setInviteContacts(mockInviteContacts);
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (userId: string) => {
    if (!currentUserId) return;

    try {
      const { conversation, error } = await getOrCreateDirectConversation(
        currentUserId,
        userId
      );

      if (error) {
        console.error('Error creating conversation:', error);
        alert('Failed to start conversation. Please try again.');
      } else if (conversation) {
        onStartConversation?.(conversation.id);
        onClose();
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleInvite = (contact: Contact) => {
    console.log('Inviting contact:', contact);
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
          {/* Contacts on Zoiax */}
          <div>
            <h3 className="text-black text-base mb-3">Contacts on Zoiax</h3>
            <div>
              {contactsOnZoiax.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No contacts found</p>
              ) : (
                contactsOnZoiax.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleStartConversation(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={user.profile_pic_url || ProfileAvatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = ProfileAvatar.src || ProfileAvatar;
                        }}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm text-black truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.status || 'Have a nice day!'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Invite to Zoiax */}
          <div>
            <h3 className="text-black text-base mb-3">Invite to Zoiax</h3>
            <div>
              {inviteContacts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No contacts to invite</p>
              ) : (
                inviteContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      {contact.profile_pic_url ? (
                        <Image
                          src={contact.profile_pic_url}
                          alt={contact.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500 text-xs font-medium">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm text-black truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500 truncate">{contact.phone}</p>
                    </div>
                    <button
                      onClick={() => handleInvite(contact)}
                      className="text-pink-500 hover:text-pink-600 font-medium text-sm px-3 py-1.5 flex-shrink-0"
                    >
                      Invite
                    </button>
                  </div>
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
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Bottom Slide-up Modal */}
      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 max-h-[85vh] overflow-y-auto">
          {content}
        </div>
      </div>

      {/* Desktop Centered Modal */}
      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1001] items-center justify-center transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-[90%] max-w-md transition-all duration-300 ${
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

