'use client';

import Image from 'next/image';
import { PlusCircle, Send, ArrowLeft, X } from 'lucide-react';
import ChatCard from '@/components/cards/ChatCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import ZoomerlyLogo from "@/assets/svgs/Zoomerly.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import type { Conversation } from '@/lib/supabase/chat';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import type { TypingUser } from '@/hooks/use-typing-indicator';
import type { MediaType } from '@/lib/supabase/chat';

interface DraftMedia {
  mediaId: string;
  file: File;
  previewUrl: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
  uploading: boolean;
  error?: string;
}

interface ConnectionsTabProps {
  currentUserId: string | null;
  selectedConversation: Conversation | null;
  messages: ChatMessage[];
  newMessage: string;
  loading: boolean;
  uploading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  filteredConversations: Conversation[];
  setSelectedConversation: (conv: Conversation | null) => void;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  handleFileUpload: (file: File) => void;
  getConversationName: (conv: Conversation) => string;
  getConversationAvatar: (conv: Conversation) => string | any;
  formatTime: (dateString?: string) => string;
  getLastMessageWithSender: (conv: Conversation) => string;
  shouldShowHeader: (message: ChatMessage, index: number) => boolean;
  typingUsers?: TypingUser[];
  isTyping?: boolean;
  isUserOnline?: (userId: string) => boolean;
  getLastSeenText?: (userId: string) => string;
  draftMedia?: DraftMedia[];
  removeDraftMedia?: (mediaId: string) => void;
}

const ConnectionsTab: React.FC<ConnectionsTabProps> = ({
  currentUserId,
  selectedConversation,
  messages,
  newMessage,
  loading,
  uploading,
  messagesEndRef,
  filteredConversations,
  setSelectedConversation,
  setNewMessage,
  handleSend,
  handleFileUpload,
  getConversationName,
  getConversationAvatar,
  formatTime,
  getLastMessageWithSender,
  shouldShowHeader,
  typingUsers = [],
  isTyping = false,
  isUserOnline,
  getLastSeenText,
  draftMedia = [],
  removeDraftMedia,
}) => {
  const getOtherUserId = (conv: Conversation): string | null => {
    if (conv.type !== 'direct') return null;
    if (conv.other_user?.user_id) return conv.other_user.user_id;
    if (conv.other_user?.id) return conv.other_user.id;
    const otherParticipant = conv.participants?.find((p: any) => p.user_id !== currentUserId);
    return otherParticipant?.user_id || null;
  };

  const getTypingText = (): string => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) {
      return `${typingUsers[0].user_name || 'Someone'} is typing...`;
    }
    return 'Multiple people are typing...';
  };
  return (
    <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] my-3'>
      <div className={`w-[350px] max-[900px]:w-full border-black/15 border flex-col overflow-y-auto scrollbar-hide ${selectedConversation ? 'max-[900px]:hidden' : 'flex'}`}>
        {loading ? (
          <div className="p-4 text-center text-black flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-sm">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No conversations found</p>
            <p className="text-sm mt-2">Search for users to start a conversation</p>
          </div>
        ) : (
          filteredConversations.map(conv => {

            let lastMessageTime = conv.last_message_at;

            if (selectedConversation?.id === conv.id && messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              lastMessageTime = lastMsg.createdAt;
            }

            const otherUserId = getOtherUserId(conv);
            const userOnline = otherUserId && isUserOnline ? isUserOnline(otherUserId) : false;

            return (
              <ChatCard
                key={conv.id}
                imgPath={getConversationAvatar(conv)}
                name={getConversationName(conv)}
                message={getLastMessageWithSender(conv)}
                time={formatTime(lastMessageTime)}
                isActive={selectedConversation?.id === conv.id}
                isOnline={userOnline}
                onClick={() => setSelectedConversation(conv)}
              />
            );
          })
        )}
      </div>

      <div className={`flex-1 border border-l-0 flex-col ${selectedConversation ? 'flex' : 'max-[900px]:hidden'}`}>
        {selectedConversation ? (
          <>
            <div className='flex items-center gap-4 bg-[#2A2D3A] p-3.5 border-b border-gray-700'>
              <ArrowLeft
                onClick={() => setSelectedConversation(null)}
                className='cursor-pointer lg:hidden'
              />
              <div className='relative rounded-full h-10 w-10'>
                <Image
                  src={getConversationAvatar(selectedConversation)}
                  alt={getConversationName(selectedConversation)}
                  fill
                  className='rounded-full object-cover'
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = ProfileAvatar.src || ProfileAvatar;
                  }}
                />
                {(() => {
                  const otherUserId = getOtherUserId(selectedConversation);
                  const online = otherUserId && isUserOnline ? isUserOnline(otherUserId) : false;
                  return online ? (
                    <span className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#2A2D3A] rounded-full' />
                  ) : null;
                })()}
              </div>
              <div className='flex-1'>
                <p className='font-bold'>{getConversationName(selectedConversation)}</p>
                {(() => {
                  const otherUserId = getOtherUserId(selectedConversation);
                  const online = otherUserId && isUserOnline ? isUserOnline(otherUserId) : false;
                  const lastSeenText = otherUserId && getLastSeenText ? getLastSeenText(otherUserId) : 'Offline';
                  return (
                    <p className='text-xs text-gray-400'>
                      {isTyping ? getTypingText() : online ? 'Online' : lastSeenText}
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className='flex-1 text-sm p-3 overflow-y-auto space-y-2'>
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <p>No messages yet</p>
                  <p className="text-xs mt-2">Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <ChatMessageItem
                      key={msg.id}
                      message={msg}
                      isOwnMessage={msg.senderId === currentUserId}
                      showHeader={shouldShowHeader(msg, index)}
                    />
                  ))}
                  {isTyping && typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 text-gray-500 text-xs">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>{getTypingText()}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className='p-4 bg-[#F7F7F7]'>
              {/* Draft Media Previews */}
              {draftMedia.length > 0 && (
                <div className='mb-3 flex flex-wrap gap-2'>
                  {draftMedia.map((draft) => (
                    <div
                      key={draft.mediaId}
                      className='relative bg-white rounded-lg p-2 border border-gray-200'
                    >
                      {draft.uploading ? (
                        <div className='w-20 h-20 flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500'></div>
                        </div>
                      ) : draft.mediaType === 'image' && draft.previewUrl ? (
                        <div className='relative w-20 h-20'>
                          <Image
                            src={draft.previewUrl}
                            alt={draft.fileName}
                            fill
                            className='object-cover rounded'
                            unoptimized
                          />
                        </div>
                      ) : draft.mediaType === 'video' && draft.previewUrl ? (
                        <div className='relative w-20 h-20 bg-gray-100 rounded flex items-center justify-center'>
                          <video
                            src={draft.previewUrl}
                            className='w-full h-full object-cover rounded'
                            muted
                          />
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-8 h-8 bg-black/50 rounded-full flex items-center justify-center'>
                              <span className='text-white text-xs'>▶</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='w-20 h-20 flex items-center justify-center bg-gray-100 rounded'>
                          <span className='text-2xl'>
                            {draft.mediaType === 'audio' ? '🎵' : '📎'}
                          </span>
                        </div>
                      )}
                      {removeDraftMedia && (
                        <button
                          onClick={() => removeDraftMedia(draft.mediaId)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                          disabled={draft.uploading}
                        >
                          <X size={12} />
                        </button>
                      )}
                      <p className='text-xs mt-1 truncate w-20' title={draft.fileName}>
                        {draft.fileName}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className='flex items-center gap-4'>
                <div className='bg-white p-2 rounded-full relative'>
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    disabled={uploading}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    multiple={true}
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          handleFileUpload(file);
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                  <label
                    htmlFor="fileUpload"
                    className={uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    title="Upload file or image"
                  >
                    <PlusCircle size={24} className='text-black' />
                  </label>
                </div>

                <div className='flex-1 relative'>
                  <GlobalInput
                    placeholder={uploading ? 'Uploading...' : 'Write your message...'}
                    height='40px'
                    width='100%'
                    borderRadius='100px'
                    bgColor='white'
                    inputClassName="pl-4 pr-12 border-none"
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && !e.shiftKey && !uploading) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={uploading}
                  />
                </div>
                <button
                  className='bg-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleSend}
                  disabled={uploading || (!newMessage.trim() && draftMedia.length === 0)}
                >
                  <Send size={18} className='text-black' />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-[900px]:hidden flex flex-col items-center justify-center h-full text-gray-400">
            <Image src={ZoomerlyLogo} alt='' />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsTab;

