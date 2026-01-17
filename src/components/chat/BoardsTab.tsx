'use client';

import React from 'react';
import Image from 'next/image';
import { PlusCircle, Send, ArrowLeft } from 'lucide-react';
import ChatCard from '@/components/cards/ChatCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import ZoomerlyLogo from "@/assets/svgs/Zoomerly.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import type { Conversation } from '@/lib/supabase/chat';
import type { ChatMessage } from '@/hooks/use-realtime-chat';

interface BoardsTabProps {
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
  activeBoards?: any[];
  loadingBoards?: boolean;
}

const BoardsTab: React.FC<BoardsTabProps> = ({
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
  activeBoards = [],
  loadingBoards = false,
}) => {
  return (
    <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] my-3'>
      <div className={`w-[350px] max-[900px]:w-full border-black/15 border flex-col overflow-y-auto scrollbar-hide ${selectedConversation ? 'max-[900px]:hidden' : 'flex'}`}>
        {/* Active Boards Section */}
        {activeBoards && activeBoards.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Boards</h3>
            {loadingBoards ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-2 text-xs">Loading active boards...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeBoards.map((board: any) => (
                  <div
                    key={board.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-sm text-black">{board.title || 'Untitled Board'}</p>
                    {board.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{board.description}</p>
                    )}
                    {board.deadline_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Deadline: {new Date(board.deadline_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Board Conversations Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Conversations</h3>
        </div>
        {loading ? (
          <div className="p-4 text-center text-black flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-sm">Loading board conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No board conversations found</p>
            <p className="text-sm mt-2">Join a board to start chatting</p>
          </div>
        ) : (
          filteredConversations.map(conv => {
            let lastMessageTime = conv.last_message_at;

            if (selectedConversation?.id === conv.id && messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              lastMessageTime = lastMsg.createdAt;
            }

            return (
              <ChatCard
                key={conv.id}
                imgPath={getConversationAvatar(conv)}
                name={getConversationName(conv)}
                message={getLastMessageWithSender(conv)}
                time={formatTime(lastMessageTime)}
                isActive={selectedConversation?.id === conv.id}
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
              </div>
              <div className='flex-1'>
                <p className='font-bold'>{getConversationName(selectedConversation)}</p>
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
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className='p-4 bg-[#F7F7F7] flex items-center gap-4'>
              <div className='bg-white p-2 rounded-full relative'>
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  disabled={uploading}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  multiple={false}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
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
                disabled={uploading || !newMessage.trim()}
              >
                <Send size={18} className='text-black' />
              </button>
            </div>
          </>
        ) : (
          <div className="max-[900px]:hidden flex flex-col items-center justify-center h-full text-gray-400">
            <Image src={ZoomerlyLogo} alt='' />
            <p>Select a board conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardsTab;

