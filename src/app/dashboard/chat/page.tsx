'use client';

import React from 'react';
import Image from 'next/image';
import { PlusCircle, Send, ArrowLeft, Search, X, Plus } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatCard from '@/components/cards/ChatCard';
import ChatTabs from '@/components/filters/ChatFilters';
import ZoomerlyLogo from "@/assets/svgs/Zoomerly.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import MobileHeader from '@/components/navbar/MobileHeader';
import { useChat } from '@/hooks/use-chat';
import DashNavbar from '@/components/navbar/DashNavbar';

const ChatPage = () => {
  const {
    currentUserId,
    selectedConversation,
    messages,
    newMessage,
    loading,
    uploading,
    searchQuery,
    searchResults,
    showSearchResults,
    searching,
    selectedTab,
    messagesEndRef,
    setSelectedConversation,
    setNewMessage,
    setSearchQuery,
    setShowSearchResults,
    setSelectedTab,
    handleStartConversation,
    handleSend,
    handleFileUpload,
    getConversationName,
    getConversationAvatar,
    formatTime,
    filteredConversations,
    shouldShowHeader,
  } = useChat();

  return (
    <>
      <DashNavbar />
      <MobileHeader title={selectedTab === "Connections" ? "Connections" : "Boards"} RightIcon={Plus} />
      <div className='px-[7%] max-[900px]:px-3 text-white'>
        <div className='px-4 flex items-center justify-between max-[769px]:justify-center gap-2 mt-6'>
          <div className='max-[769px]:hidden'>
            <TitleCard title={selectedTab === "Connections" ? "Connections" : "Boards"} className='text-left' />
          </div>
          <div className='relative w-[270px] max-[500px]:mx-auto'>
            <div className="relative">
              <Search size={18} className='absolute top-3 left-3 text-gray-400' />
              <GlobalInput
                placeholder={selectedTab === "Connections" ? 'Search friends & family' : 'Search boards'}
                height='42px'
                width='100%'
                borderRadius='100px'
                inputClassName="pl-10 pr-10"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setShowSearchResults(true);
                  } else {
                    setShowSearchResults(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSearchResults(true);
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute top-2.5 right-3 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {showSearchResults && searchQuery.trim() && selectedTab === "Connections" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#2A2D3A] rounded-lg shadow-lg border border-gray-700 max-h-64 overflow-y-auto z-50">
                {searching ? (
                  <div className="p-4 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <p className="px-4 py-2 text-xs text-gray-400 font-semibold">Users</p>
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleStartConversation(user.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3A3D4A] transition-colors"
                      >
                        <Image
                          src={user.profile_pic_url || ProfileAvatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = ProfileAvatar.src || ProfileAvatar;
                          }}
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{user.name}</p>
                          {user.email && (
                            <p className="text-xs text-gray-400">{user.email}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='px-4 mt-4'>
          <ChatTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </div>

        {selectedTab === "Connections" ? (
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
                  // Get the last message - prefer from messages if this conversation is selected, otherwise from conversation
                  let lastMessageText = conv.last_message;
                  let lastMessageTime = conv.last_message_at;

                  // If this conversation is selected and has messages, use the latest message from the messages array
                  if (selectedConversation?.id === conv.id && messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    lastMessageText = lastMsg.content || lastMsg.fileName || 'Media';
                    lastMessageTime = lastMsg.createdAt;
                  }

                  return (
                    <ChatCard
                      key={conv.id}
                      imgPath={getConversationAvatar(conv)}
                      name={getConversationName(conv)}
                      message={lastMessageText || "No message yet"}
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
                            // Reset input so same file can be selected again
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
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] my-3'>

            <div className={`w-[350px] max-[900px]:w-full border-black/15 border flex-col overflow-y-auto scrollbar-hide ${selectedConversation ? 'max-[900px]:hidden' : 'flex'}`}>
              {loading ? (
                <div className="p-4 text-center text-black flex flex-col items-center justify-center h-full">
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
                  let lastMessageText = conv.last_message;
                  let lastMessageTime = conv.last_message_at;

                  if (selectedConversation?.id === conv.id && messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    lastMessageText = lastMsg.content || lastMsg.fileName || 'Media';
                    lastMessageTime = lastMsg.createdAt;
                  }

                  return (
                    <ChatCard
                      key={conv.id}
                      imgPath={getConversationAvatar(conv)}
                      name={getConversationName(conv)}
                      message={lastMessageText || "No message yet"}
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
        )}
      </div>
    </>
  );
};

export default ChatPage;
