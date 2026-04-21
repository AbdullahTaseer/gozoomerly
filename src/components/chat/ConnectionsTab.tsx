'use client';

import Image from 'next/image';
import { PlusCircle, Send, ArrowLeft, X, Info } from 'lucide-react';
import ChatCard from '@/components/cards/ChatCard';
import BoardChatCard from '@/components/cards/BoardChatCard';
import type { ChatTab } from '@/components/filters/ChatFilters';
import GlobalInput from '@/components/inputs/GlobalInput';
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import type { Conversation } from '@/lib/supabase/chat';
import { isStandaloneGroupConversation } from '@/lib/supabase/chat';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import type { TypingUser } from '@/hooks/use-typing-indicator';
import type { MediaType } from '@/lib/supabase/chat';
import { cancelChatMedia } from '@/lib/supabase/chat';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  SkeletonChatHeader,
  SkeletonListItem,
  SkeletonChatMessages,
} from '@/components/skeletons';

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
  /** Group Chats tab: `get_user_conversations` with conversation_type group */
  groupListLoading?: boolean;
  /** Header: show skeleton until peer profile and/or initial messages are ready. */
  chatHeaderLoading?: boolean;
  uploading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  filteredConversations: Conversation[];
  selectedTab?: ChatTab;
  directConversations?: Conversation[];
  groupConversations?: Conversation[];
  boardChatConversations?: Conversation[];
  onOpenCreateGroup?: () => void;
  /** Open group details (`get_group_conversation_details`) for this conversation */
  onOpenGroupInfo?: (conversationId: string) => void;
  activeBoards?: { id: string; title: string; published_at?: string; cover_image?: { url?: string } }[];
  loadingBoards?: boolean;
  handleStartBoardConversation?: (boardId: string, boardTitle: string) => void;
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
  groupListLoading = false,
  chatHeaderLoading = false,
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
  selectedTab = 'All',
  directConversations = [],
  groupConversations = [],
  boardChatConversations = [],
  onOpenCreateGroup,
  onOpenGroupInfo,
  activeBoards = [],
  loadingBoards = false,
  handleStartBoardConversation,
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

  const handleDeleteMedia = useCallback(async (mediaId: string) => {
    if (!currentUserId) {
      toast.error('Unable to delete media: User not authenticated');
      return;
    }

    if (!mediaId) {
      toast.error('Unable to delete media: Invalid media ID');
      return;
    }

    try {
      const { success, error } = await cancelChatMedia(currentUserId, mediaId);

      if (!success) {
        // Extract error message from various possible error formats
        let errorMessage = 'Failed to delete media';

        if (error) {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'object') {
            // Check common Supabase error properties
            errorMessage = (error as any).message ||
              (error as any).details ||
              (error as any).hint ||
              (error as any).error ||
              (error as any).code ||
              'Unknown error';

            // If still empty, try to stringify (but avoid circular references)
            if (errorMessage === 'Unknown error' || !errorMessage) {
              try {
                const errorStr = JSON.stringify(error, null, 2);
                if (errorStr && errorStr !== '{}') {
                  errorMessage = errorStr;
                }
              } catch {
                // If stringify fails, use toString
                errorMessage = error.toString() || 'Unknown error';
              }
            }
          }
        }

        console.error('Failed to delete media:', {
          mediaId,
          userId: currentUserId,
          error,
          errorType: typeof error,
          errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
          errorString: typeof error === 'object' ? JSON.stringify(error) : String(error)
        });

        toast.error(errorMessage);
      } else {
        toast.success('Media deleted successfully');
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || 'An unexpected error occurred';
      console.error('Error deleting media:', {
        mediaId,
        userId: currentUserId,
        error: err,
        errorType: typeof err,
        errorKeys: err && typeof err === 'object' ? Object.keys(err) : []
      });
      toast.error(`Failed to delete media: ${errorMessage}`);
    }
  }, [currentUserId]);
  const showOneToOne = selectedTab === 'All' || selectedTab === 'One-to-One';
  const showGroupChats = selectedTab === 'All' || selectedTab === 'Group Chats';
  const showBoardChats = selectedTab === 'All' || selectedTab === 'Board Chats';

  const formatBoardTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const renderChatList = () => {
    if (loading) {
      return (
        <div className="space-y-6 p-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      );
    }

    const hasOneToOne = showOneToOne && directConversations.length > 0;
    const hasGroup = showGroupChats && groupConversations.length > 0;
    const hasBoardConvs = showBoardChats && boardChatConversations.length > 0;
    const hasBoards = showBoardChats && activeBoards.length > 0;

    if (!hasOneToOne && !hasGroup && !hasBoardConvs && !hasBoards) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>No conversations found</p>
          <p className="text-sm mt-2">Search for users or join boards to start chatting</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 pb-4">
        {showOneToOne && (
          <section>
            <h3 className="font-bold text-black px-3 mb-2 text-2xl">One-to-One</h3>
            <div className="space-y-1">
              {directConversations.map((conv) => {
                let lastMessageTime = conv.last_message_at;
                if (selectedConversation?.id === conv.id && messages.length > 0) {
                  lastMessageTime = messages[messages.length - 1].createdAt;
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
                    unreadCount={conv.unread_count ?? 0}
                    onClick={() => setSelectedConversation(conv)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {showGroupChats && (
          <section>
            <div className="flex items-center justify-between gap-2 px-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-bold text-black text-2xl">Group Chats</h3>
                {groupListLoading ? (
                  <div
                    className="h-5 w-5 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin shrink-0"
                    aria-hidden
                  />
                ) : null}
              </div>
              {onOpenCreateGroup && (
                <button
                  type="button"
                  onClick={onOpenCreateGroup}
                  className="text-sm font-medium text-pink-600 hover:text-pink-700 shrink-0"
                >
                  New group
                </button>
              )}
            </div>
            <div className="space-y-1">
              {groupConversations.map((conv) => {
                let lastMessageTime = conv.last_message_at;
                if (selectedConversation?.id === conv.id && messages.length > 0) {
                  lastMessageTime = messages[messages.length - 1].createdAt;
                }
                return (
                  <ChatCard
                    key={conv.id}
                    imgPath={getConversationAvatar(conv)}
                    name={getConversationName(conv)}
                    message={getLastMessageWithSender(conv)}
                    time={formatTime(lastMessageTime)}
                    isActive={selectedConversation?.id === conv.id}
                    unreadCount={conv.unread_count ?? 0}
                    onClick={() => setSelectedConversation(conv)}
                    trailing={
                      onOpenGroupInfo ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenGroupInfo(conv.id);
                          }}
                          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                          aria-label="Group info and members"
                          title="Group info"
                        >
                          <Info size={18} strokeWidth={2} />
                        </button>
                      ) : undefined
                    }
                  />
                );
              })}
            </div>
          </section>
        )}

        {showBoardChats && (
          <section>
            <h3 className="font-bold text-black px-3 mb-2 text-2xl">Board Chats</h3>
            {boardChatConversations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-1">Conversations</p>
                <div className="space-y-1">
                  {boardChatConversations.map((conv) => {
                    let lastMessageTime = conv.last_message_at;
                    if (selectedConversation?.id === conv.id && messages.length > 0) {
                      lastMessageTime = messages[messages.length - 1].createdAt;
                    }
                    return (
                      <ChatCard
                        key={conv.id}
                        imgPath={getConversationAvatar(conv)}
                        name={getConversationName(conv)}
                        message={getLastMessageWithSender(conv)}
                        time={formatTime(lastMessageTime)}
                        isActive={selectedConversation?.id === conv.id}
                        unreadCount={conv.unread_count ?? 0}
                        onClick={() => setSelectedConversation(conv)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-1">Your boards</p>
            {loadingBoards ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {activeBoards.map((board: any) => (
                  <BoardChatCard
                    key={board.id}
                    title={board.title || 'Untitled Board'}
                    timeAgo={formatBoardTime(board.published_at)}
                    imgSrc={board.cover_image?.url || board.honoree_details?.profile_photo_url}
                    gradientFrom="#E11D48"
                    gradientTo="#7C3AED"
                    onClick={() => handleStartBoardConversation?.(board.id, board.title || 'Untitled Board')}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    );
  };

  return (
    <div className='h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-110px)] my-6'>
      <div className="h-full md:flex md:gap-4">
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full h-full md:w-[360px] lg:w-[390px] md:shrink-0 py-3 border border-gray-200 rounded-xl bg-white overflow-y-auto scrollbar-hide`}>
          {renderChatList()}
        </div>

        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} w-full h-full flex-col border border-gray-200 rounded-xl bg-white overflow-hidden`}>
          {selectedConversation ? (
            <>
              <div className='flex items-center gap-4 bg-white p-3.5 border-b border-gray-200'>
                <ArrowLeft
                  onClick={() => setSelectedConversation(null)}
                  className='cursor-pointer shrink-0 text-black md:hidden'
                />
                {chatHeaderLoading ? (
                  <SkeletonChatHeader className="flex-1" />
                ) : (
                  <>
                    <div className='relative rounded-full h-10 w-10'>
                      <Image
                        src={getConversationAvatar(selectedConversation)}
                        alt={getConversationName(selectedConversation)}
                        fill
                        className='rounded-full object-cover'
                        sizes="40px"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = ProfileAvatar.src || ProfileAvatar;
                        }}
                      />
                      {(() => {
                        const otherUserId = getOtherUserId(selectedConversation);
                        const online = otherUserId && isUserOnline ? isUserOnline(otherUserId) : false;
                        return online ? (
                          <span className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full' />
                        ) : null;
                      })()}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-black truncate'>{getConversationName(selectedConversation)}</p>
                      {(() => {
                        const otherUserId = getOtherUserId(selectedConversation);
                        const online = otherUserId && isUserOnline ? isUserOnline(otherUserId) : false;
                        const lastSeenText = otherUserId && getLastSeenText ? getLastSeenText(otherUserId) : 'Offline';
                        return (
                          <p className='text-xs text-gray-500'>
                            {isTyping ? getTypingText() : online ? 'Online' : lastSeenText}
                          </p>
                        );
                      })()}
                    </div>
                  </>
                )}
                {isStandaloneGroupConversation(selectedConversation) && onOpenGroupInfo ? (
                  <button
                    type="button"
                    onClick={() => onOpenGroupInfo(selectedConversation.id)}
                    className="text-sm font-medium text-pink-600 hover:text-pink-700 shrink-0"
                  >
                    Group info
                  </button>
                ) : null}
              </div>

              <div className='flex-1 text-sm p-3 overflow-y-auto space-y-2'>
                {messages.length === 0 ? (
                  chatHeaderLoading ? (
                    <SkeletonChatMessages count={5} />
                  ) : (
                    <div className="text-center text-gray-400 mt-8">
                      <p>No messages yet</p>
                      <p className="text-xs mt-2">Start the conversation!</p>
                    </div>
                  )
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <ChatMessageItem
                        key={msg.id}
                        message={msg}
                        isOwnMessage={msg.senderId === currentUserId}
                        showHeader={shouldShowHeader(msg, index)}
                        currentUserId={currentUserId}
                        onDeleteMedia={handleDeleteMedia}
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
                              sizes="80px"
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
                      bgColor='white'
                      inputClassName="pl-4 pr-12 border-none rounded-full!"
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
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsTab;

