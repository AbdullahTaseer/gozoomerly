'use client';

import {  useState, useEffect, Suspense  } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, X, Plus } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatTabs from '@/components/filters/ChatFilters';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import MobileHeader from '@/components/navbar/MobileHeader';
import { useChat } from '@/hooks/use-chat';
import DashNavbar from '@/components/navbar/DashNavbar';
import ConnectionsTab from '@/components/chat/ConnectionsTab';
import BoardsTab from '@/components/chat/BoardsTab';
import GlobalButton from '@/components/buttons/GlobalButton';
import InviteChatModal from '@/components/chat/InviteChatModal';
import { getConversation, getUserConversations } from '@/lib/supabase/chat';
import { chatOpenState } from '@/lib/chatOpenState';

const ChatPageContent = () => {
  const searchParams = useSearchParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loadedFromUrl, setLoadedFromUrl] = useState<string | null>(null);

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
    getLastMessageWithSender,
    filteredConversations,
    shouldShowHeader,
    activeBoards,
    loadingBoards,
    typingUsers,
    isTyping,
    isUserOnline,
    getLastSeenText,
  } = useChat();

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (!currentUserId) return;

    if (conversationId && selectedConversation?.id === conversationId) {

      const urlKey = `conv:${conversationId}`;
      if (urlKey !== loadedFromUrl) {
        setLoadedFromUrl(urlKey);
      }
      return;
    }

    const urlKey = conversationId ? `conv:${conversationId}` : userId ? `user:${userId}` : null;

    if (urlKey && urlKey !== loadedFromUrl) {
      if (conversationId) {
        handleConversationStart(conversationId);
        setLoadedFromUrl(urlKey);
      } else if (userId) {

        handleStartConversation(userId);
        setLoadedFromUrl(urlKey);
      }
    } else if (!urlKey && loadedFromUrl) {

      setLoadedFromUrl(null);
    }
  }, [searchParams, currentUserId, loadedFromUrl, handleStartConversation, selectedConversation]);

  useEffect(() => {
    chatOpenState.setOpen(!!selectedConversation);
    return () => {

      chatOpenState.setOpen(false);
    };
  }, [selectedConversation]);

  const handleConversationStart = async (conversationId: string) => {
    if (!currentUserId) return;

    try {

      const { conversation, error } = await getConversation(conversationId, currentUserId);

      if (error) {

        const { conversations: convs } = await getUserConversations(currentUserId);
        if (convs && convs.length > 0) {
          const foundConversation = convs.find(c => c.id === conversationId);
          if (foundConversation) {
            setSelectedConversation(foundConversation);
            return;
          }
        }
        alert('Failed to load conversation. The conversation may not exist or you may not have access to it.');
      } else if (conversation) {

        setSelectedConversation(conversation);
      } else {
        alert('Failed to load conversation. Please try again.');
      }
    } catch (err) {
      alert('Failed to start conversation. Please try again.');
    }
  };

  return (
    <>
      <DashNavbar />
      <MobileHeader title={selectedTab === "Connections" ? "Connections" : "Boards"} RightIcon={Plus} rightIconClick={() => setIsInviteModalOpen(true)} />
      <div className='px-[7%] max-[900px]:px-3 text-white'>
        <div className='px-4 flex items-center justify-between max-[769px]:justify-center gap-2 mt-6'>
          <div className='max-[769px]:hidden'>
            <TitleCard title={selectedTab === "Connections" ? "Connections" : "Boards"} className='text-left' />
          </div>
          <div className='relative w-[300px] flex gap-3 max-[769px]:justify-center'>
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
                  className="absolute top-2.5 right-3 text-gray-400 hover:text-black"
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
            <div className='max-[769px]:hidden'>
              <GlobalButton title="Add" onClick={() => setIsInviteModalOpen(true)} width='70px' />
            </div>
          </div>
        </div>

        <div className='px-4 mt-4'>
          <ChatTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </div>

        {selectedTab === "Connections" ? (
          <ConnectionsTab
            currentUserId={currentUserId}
            selectedConversation={selectedConversation}
            messages={messages}
            newMessage={newMessage}
            loading={loading}
            uploading={uploading}
            messagesEndRef={messagesEndRef}
            filteredConversations={filteredConversations}
            setSelectedConversation={setSelectedConversation}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
            handleFileUpload={handleFileUpload}
            getConversationName={getConversationName}
            getConversationAvatar={getConversationAvatar}
            formatTime={formatTime}
            getLastMessageWithSender={getLastMessageWithSender}
            shouldShowHeader={shouldShowHeader}
            typingUsers={typingUsers}
            isTyping={isTyping}
            isUserOnline={isUserOnline}
            getLastSeenText={getLastSeenText}
          />
        ) : (
          <BoardsTab
            currentUserId={currentUserId}
            selectedConversation={selectedConversation}
            messages={messages}
            newMessage={newMessage}
            loading={loading}
            uploading={uploading}
            messagesEndRef={messagesEndRef}
            filteredConversations={filteredConversations}
            setSelectedConversation={setSelectedConversation}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
            handleFileUpload={handleFileUpload}
            getConversationName={getConversationName}
            getConversationAvatar={getConversationAvatar}
            formatTime={formatTime}
            getLastMessageWithSender={getLastMessageWithSender}
            shouldShowHeader={shouldShowHeader}
            activeBoards={activeBoards}
            loadingBoards={loadingBoards}
            typingUsers={typingUsers}
            isTyping={isTyping}
          />
        )}
      </div>

      <InviteChatModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onStartConversationWithUserId={handleStartConversation}
      />
    </>
  );
};

const ChatPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
};

export default ChatPage;
