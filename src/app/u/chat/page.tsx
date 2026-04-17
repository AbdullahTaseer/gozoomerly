'use client';

import { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, X, Plus } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatTabs from '@/components/filters/ChatFilters';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import MobileHeader from '@/components/navbar/MobileHeader';
import { useChat } from '@/hooks/use-chat';
import DashNavbar from '@/components/navbar/DashNavbar';
import ConnectionsTab from '@/components/chat/ConnectionsTab';
import CreateGroupChatModal from '@/components/chat/CreateGroupChatModal';
import GroupChatManageModal from '@/components/chat/GroupChatManageModal';
import GlobalButton from '@/components/buttons/GlobalButton';
import InviteChatModal from '@/components/chat/InviteChatModal';
import BoardChatCard from '@/components/cards/BoardChatCard';
import { getConversation, getUserConversations } from '@/lib/supabase/chat';
import { chatOpenState } from '@/lib/chatOpenState';

const ChatPageContent = () => {
  const searchParams = useSearchParams();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupManageOpen, setGroupManageOpen] = useState(false);
  /** When set, group details modal loads this thread (e.g. from Group Chats list info button). */
  const [groupInfoConversationId, setGroupInfoConversationId] = useState<string | null>(null);
  const [loadedFromUrl, setLoadedFromUrl] = useState<string | null>(null);
  const chatSearchInputRef = useRef<HTMLInputElement>(null);
  const prevSearchLoadingRef = useRef(false);

  const {
    currentUserId,
    selectedConversation,
    messages,
    newMessage,
    loading,
    groupListLoading,
    uploading,
    searchQuery,
    searchResults,
    boardSearchResults,
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
    handleStartBoardConversation,
    directConversations,
    groupConversations,
    boardChatConversations,
    handleCreateGroupConversation,
    refetchConversations,
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
    draftMedia,
    removeDraftMedia,
  } = useChat();

  useLayoutEffect(() => {
    const wasLoading = prevSearchLoadingRef.current;
    const loading = searching;
    if (wasLoading && !loading && searchQuery.trim()) {
      chatSearchInputRef.current?.focus({ preventScroll: true });
    }
    prevSearchLoadingRef.current = loading;
  }, [searching, searchQuery]);

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
      <MobileHeader title='Chat' />
      <div className='px-[5%] max-[900px]:px-4 text-black'>
        <div className={`flex gap-4 justify-between max-[769px]:flex-wrap my-6 ${selectedConversation ? 'max-[768px]:hidden' : ''}`}>
          <p className='text-2xl min-[769px]:text-[28px] font-bold text-black shrink-0 hidden min-[769px]:block'>Chat</p>
          <>
            <div className='relative ml-auto w-[360px] max-[1050px]:w-[220px] max-[769px]:w-full'>
              <div className="relative">
                <Search size={18} className='absolute top-3 left-3 text-gray-400' />
                <GlobalInput
                  ref={chatSearchInputRef}
                  placeholder="Search"
                  height='42px'
                  width='100%'
                  borderRadius='100px'
                  inputClassName="pl-10 pr-10 border-[#EAEAEA]"
                  autoComplete="off"
                  enterKeyHint="search"
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

              {showSearchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
                  {searching ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 || boardSearchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.length > 0 ? (
                        <>
                          <p className="px-4 py-2 text-xs text-gray-500 font-semibold">People</p>
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleStartConversation(user.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-black"
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
                        </>
                      ) : null}
                      {boardSearchResults.length > 0 ? (
                        <div className={searchResults.length > 0 ? 'border-t border-gray-100 pt-1 mt-1' : ''}>
                          <p className="px-4 py-2 text-xs text-gray-500 font-semibold">Boards</p>
                          {boardSearchResults.map((board) => (
                            <div key={board.id} className="px-2 pb-2">
                              <BoardChatCard
                                title={board.title}
                                timeAgo="Board chat"
                                imgSrc={board.cover_image_url}
                                onClick={() => {
                                  setSearchQuery('');
                                  setShowSearchResults(false);
                                  handleStartBoardConversation(board.id, board.title);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <p className="text-sm">No results found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ChatTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
          </>
        </div>

        <ConnectionsTab
          currentUserId={currentUserId}
          selectedConversation={selectedConversation}
          messages={messages}
          newMessage={newMessage}
          loading={loading}
          groupListLoading={groupListLoading}
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
          draftMedia={draftMedia}
          removeDraftMedia={removeDraftMedia}
          selectedTab={selectedTab}
          directConversations={directConversations}
          groupConversations={groupConversations}
          boardChatConversations={boardChatConversations}
          onOpenCreateGroup={() => setCreateGroupOpen(true)}
          onOpenGroupInfo={(conversationId) => {
            setGroupInfoConversationId(conversationId);
            setGroupManageOpen(true);
          }}
          activeBoards={activeBoards}
          loadingBoards={loadingBoards}
          handleStartBoardConversation={handleStartBoardConversation}
        />
      </div>

      {currentUserId && (
        <>
          <CreateGroupChatModal
            isOpen={createGroupOpen}
            onClose={() => setCreateGroupOpen(false)}
            currentUserId={currentUserId}
            onCreate={handleCreateGroupConversation}
          />
          <GroupChatManageModal
            isOpen={groupManageOpen}
            onClose={() => {
              setGroupManageOpen(false);
              setGroupInfoConversationId(null);
            }}
            conversationId={groupInfoConversationId ?? selectedConversation?.id ?? null}
            currentUserId={currentUserId}
            onAfterLeave={() => {
              setSelectedConversation(null);
              setGroupInfoConversationId(null);
              refetchConversations(currentUserId);
            }}
            onUpdated={() => refetchConversations(currentUserId)}
          />
        </>
      )}

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
