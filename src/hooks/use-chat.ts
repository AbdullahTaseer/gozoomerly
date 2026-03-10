import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { useGlobalOnlineStatus } from '@/components/providers/OnlineStatusProvider';
import { useLastSeen } from '@/hooks/use-last-seen';
import type { ChatTab } from '@/components/filters/ChatFilters';
import {
  getUserConversations,
  getOrCreateBoardConversation,
  getConversationMessages,
  sendMessage,
  uploadMessageFile,
  markConversationAsRead,
  getOrCreateDirectConversation,
  getConversation,
  searchUsers,
  createChatMedia,
  uploadChatMediaFile,
  sendMessageWithMedia,
  cancelChatMedia,
  getMediaTypeFromMime,
  validateMediaSize,
  getMediaPublicUrl,
  MEDIA_LIMITS,
  type Conversation,
  type MediaType,
} from '@/lib/supabase/chat';
import type { ChatMessageMedia } from '@/hooks/use-realtime-chat';
import { AuthService } from '@/lib/supabase/auth';
import { checkChatTablesSetup } from '@/lib/supabase/chat-diagnostics';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import toast from 'react-hot-toast';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';

const authService = new AuthService();

export const useChat = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
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
  const [draftMedia, setDraftMedia] = useState<DraftMedia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<ChatTab>('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSettingProgrammaticallyRef = useRef(false);
  
  const { boards, fetchUserBoards, isLoading: loadingBoards } = useGetUserBoards();
  const fetchUserBoardsRef = useRef(fetchUserBoards);
  
  useEffect(() => {
    fetchUserBoardsRef.current = fetchUserBoards;
  }, [fetchUserBoards]);

  useEffect(() => {
    async function getCurrentUser() {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setCurrentUserId(user.id);

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, profile_pic_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCurrentUserName(profile.name || undefined);
        }
      } catch (err) {
      }
      
      await loadConversations(user.id);
      
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const hasUrlParams = urlParams && (urlParams.get('conversationId') || urlParams.get('userId'));
      
      if (!hasUrlParams) {
        const savedConversationId = localStorage.getItem('selectedConversationId');
        
        if (savedConversationId) {
          try {
            const { conversation, error } = await getConversation(savedConversationId, user.id);
            if (!error && conversation) {
              setSelectedConversation(conversation);
              setConversations(prev => {
                const existing = prev.find(c => c.id === conversation.id);
                if (existing) {
                  return prev.map(c => c.id === conversation.id ? {
                    ...conversation,
                    last_message: conversation.last_message || c.last_message,
                    last_message_at: conversation.last_message_at || c.last_message_at,
                    last_message_id: conversation.last_message_id || c.last_message_id,
                    last_message_sender_id: conversation.last_message_sender_id || c.last_message_sender_id,
                  } : c);
                }
                return [conversation, ...prev];
              });
            } else {
              localStorage.removeItem('selectedConversationId');
            }
          } catch (err) {
            localStorage.removeItem('selectedConversationId');
          }
        }
      }
    }
    getCurrentUser();
  }, [router]);

  const loadConversations = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const { conversations: convs, error } = await getUserConversations(userId);
      if (error) {
        const diagnostics = await checkChatTablesSetup();
        if (!diagnostics.tablesExist) {
          toast.error('Chat tables are not set up correctly. Please run the SQL setup script in your Supabase dashboard.');
        }
      } else {
        let uniqueConversations = (convs || []).filter((conv, index, self) =>
          index === self.findIndex(c => c.id === conv.id)
        );

        if (currentUserId) {
          const seenPairs = new Set<string>();
          uniqueConversations = uniqueConversations.filter(conv => {
            if (conv.type !== 'direct' || !conv.participants || conv.participants.length !== 2) {
              return true; 
            }

            const participantIds = conv.participants
              .map((p: any) => p.user_id)
              .sort()
              .join('-');

            if (seenPairs.has(participantIds)) {
              return false;
            }

            seenPairs.add(participantIds);
            return true;
          });
        }

        setConversations(uniqueConversations);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      const { messages: msgs, error } = await getConversationMessages(
        conversationId,
        currentUserId,
        100
      );
      if (!error) {
        const chatMessages: ChatMessage[] = (msgs || []).map((msg: any) => {
          const senderName = msg.sender?.name ||
            (msg.sender_id ? 'Loading...' : 'Unknown');
          const senderAvatar = msg.sender?.profile_pic_url || undefined;

          // Extract media from message.media array and generate public URLs
          let media: ChatMessageMedia[] | undefined;
          if (msg.media && Array.isArray(msg.media) && msg.media.length > 0) {
            media = msg.media.map((m: any) => ({
              id: m.id,
              mediaType: m.media_type,
              url: getMediaPublicUrl(m.bucket, m.path),
              filename: m.filename,
              mimeType: m.mime_type,
              sizeBytes: m.size_bytes,
              orderIndex: m.order_index,
            }));
          }

          // For backward compatibility, use first media as fileUrl if no legacy file_url
          const fileUrl = msg.file_url || (media && media.length > 0 ? media[0].url : undefined);
          const fileName = msg.file_name || (media && media.length > 0 ? media[0].filename : undefined);
          
          // Determine message type
          let messageType = msg.message_type || 'text';
          if (media && media.length > 0) {
            if (media.length === 1) {
              messageType = media[0].mediaType === 'document' ? 'file' : media[0].mediaType;
            } else {
              messageType = 'mixed';
            }
          }

          return {
            id: msg.id,
            content: msg.content || '',
            createdAt: msg.created_at,
            user: {
              id: msg.sender_id,
              name: senderName,
              avatar: senderAvatar,
            },
            conversationId: msg.conversation_id,
            senderId: msg.sender_id,
            messageType,
            fileUrl,
            fileName,
            media,
          };
        });

        const messagesNeedingProfiles = chatMessages.filter(
          m => m.user.name === 'Loading...' || m.user.name === 'Unknown' || !m.user.avatar
        );
        
        const uniqueSenderIds = [...new Set(messagesNeedingProfiles.map(m => m.senderId))];

        if (uniqueSenderIds.length > 0 && currentUserId) {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();

          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, profile_pic_url')
            .in('id', uniqueSenderIds);

          if (profilesData) {
            const profileMap = new Map(profilesData.map(p => [p.id, p]));
            messagesNeedingProfiles.forEach(msg => {
              const profile = profileMap.get(msg.senderId);
              if (profile) {
                const index = chatMessages.findIndex(m => m.id === msg.id);
                if (index !== -1) {
                  chatMessages[index].user = {
                    id: profile.id,
                    name: profile.name || 'Unknown User',
                    avatar: profile.profile_pic_url || undefined,
                  };
                }
              }
            });
          }
        }
        setMessages(chatMessages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation && currentUserId) {
      localStorage.setItem('selectedConversationId', selectedConversation.id);
      
      const needsFullConversation = selectedConversation.type === 'direct' && 
        (!selectedConversation.participants || 
         selectedConversation.participants.length === 0 || 
         !selectedConversation.participants.some((p: any) => p.user?.name));
      
      loadMessages(selectedConversation.id);
      
      markConversationAsRead(selectedConversation.id, currentUserId).catch(() => {});
      
      if (needsFullConversation) {
        getConversation(selectedConversation.id, currentUserId).then(({ conversation: fullConv, error }) => {
          if (!error && fullConv) {
            setSelectedConversation(prev => prev ? {
              ...fullConv,
              last_message: fullConv.last_message || prev.last_message,
              last_message_at: fullConv.last_message_at || prev.last_message_at,
              last_message_id: fullConv.last_message_id || prev.last_message_id,
              last_message_sender_id: fullConv.last_message_sender_id || prev.last_message_sender_id,
            } : fullConv);
            setConversations(prev => prev.map(conv =>
              conv.id === fullConv.id ? {
                ...fullConv,
                last_message: fullConv.last_message || conv.last_message,
                last_message_at: fullConv.last_message_at || conv.last_message_at,
                last_message_id: fullConv.last_message_id || conv.last_message_id,
                last_message_sender_id: fullConv.last_message_sender_id || conv.last_message_sender_id,
              } : conv
            ));
          }
        }).catch(() => {});
      }
    } else {
      localStorage.removeItem('selectedConversationId');
    }
  }, [selectedConversation, currentUserId, loadMessages]);

  useEffect(() => {
    if (!selectedConversation) return;
    const keepSelected =
      (selectedTab === 'One-to-One' || selectedTab === 'All') && selectedConversation.type === 'direct' ||
      (selectedTab === 'Board Chats' || selectedTab === 'Group Chats' || selectedTab === 'All') && selectedConversation.type === 'group';
    if (!keepSelected) {
      setSelectedConversation(null);
    }
  }, [selectedTab, selectedConversation]);

  useEffect(() => {
    if ((selectedTab === 'Board Chats' || selectedTab === 'All') && currentUserId && fetchUserBoardsRef.current) {
      const loadActiveBoards = async () => {
        const fn = fetchUserBoardsRef.current;
        if (fn) {
          await fn({
            p_user_id: currentUserId,
            p_status: 'live',
            p_limit: 50,
            p_offset: 0
          });
        }
      };
      loadActiveBoards();
    }
  }, [selectedTab, currentUserId]);

  const activeBoards = boards.filter((board: any) => {
    return (
      board.status === 'published' &&
      (!board.deadline_date || new Date(board.deadline_date) > new Date())
    );
  });


  const handleMessageReceived = useCallback((message: ChatMessage) => {

    if (selectedConversation && message.conversationId !== selectedConversation.id) {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === message.conversationId
            ? {
                ...conv,
                last_message: message.content || message.fileName || 'Media',
                last_message_at: message.createdAt,
                last_message_id: message.id,
                last_message_sender_id: message.senderId
              }
            : conv
        );
        const updatedConv = updated.find(c => c.id === message.conversationId);
        if (updatedConv) {
          return [updatedConv, ...updated.filter(c => c.id !== message.conversationId)];
        }
        return updated;
      });
      return;
    }

    setMessages(prev => {
      const filtered = prev.filter(m => {
        if (m.id.startsWith('temp-') &&
          m.senderId === currentUserId &&
          m.senderId === message.senderId &&
          m.content === message.content &&
          Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000) {
          return false;
        }
        if (m.id === message.id) {
          return false;
        }
        return true;
      });

      const updated = [...filtered, message];
      const sorted = updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return sorted;
    });

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    if (message.senderId !== currentUserId && selectedConversation) {
      markConversationAsRead(selectedConversation.id, currentUserId!);
    }

    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === message.conversationId
          ? {
              ...conv,
              last_message: message.content || message.fileName || 'Media',
              last_message_at: message.createdAt,
              last_message_id: message.id,
              last_message_sender_id: message.senderId
            }
          : conv
      );
      const updatedConv = updated.find(c => c.id === message.conversationId);
      if (updatedConv) {
        const others = updated.filter(c => c.id !== message.conversationId);
        const sortedOthers = others.sort((a, b) => {
          const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return timeB - timeA;
        });
        return [updatedConv, ...sortedOthers];
      }
      return updated;
    });

    setSelectedConversation(prev => {
      if (prev && message.conversationId === prev.id) {
        return {
          ...prev,
          last_message: message.content || message.fileName || 'Media',
          last_message_at: message.createdAt,
          last_message_id: message.id,
          last_message_sender_id: message.senderId,
        };
      }
      return prev;
    });
  }, [currentUserId, selectedConversation]);

  const handleMessageUpdated = useCallback((message: ChatMessage) => {
    setMessages(prev =>
      prev.map(msg => msg.id === message.id ? message : msg)
    );
  }, []);

  const handleMessageDeleted = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const { isConnected, error: realtimeError } = useRealtimeChat({
    conversationId: selectedConversation?.id || null,
    currentUserId,
    onMessageReceived: handleMessageReceived,
    onMessageUpdated: handleMessageUpdated,
    onMessageDeleted: handleMessageDeleted,
    enabled: !!selectedConversation && !!currentUserId,
  });

  const { typingUsers, sendTyping, isTyping } = useTypingIndicator({
    conversationId: selectedConversation?.id || null,
    currentUserId,
    currentUserName,
    enabled: !!selectedConversation && !!currentUserId,
  });

  const { onlineUsers, isUserOnline } = useGlobalOnlineStatus();

  const conversationUserIds = useMemo(() => {
    const userIds: string[] = [];
    conversations.forEach((conv) => {
      if (conv.type === 'direct') {
        if (conv.other_user?.user_id) {
          userIds.push(conv.other_user.user_id);
        } else if (conv.other_user?.id) {
          userIds.push(conv.other_user.id);
        } else if (conv.participants) {
          const otherParticipant = conv.participants.find(
            (p: any) => p.user_id !== currentUserId
          );
          if (otherParticipant?.user_id) {
            userIds.push(otherParticipant.user_id);
          }
        }
      }
    });
    return [...new Set(userIds)]; 
  }, [conversations, currentUserId]);

  const { getLastSeenText } = useLastSeen({
    userIds: conversationUserIds,
    enabled: !!currentUserId && conversationUserIds.length > 0,
    refreshInterval: 60000, 
  });

  const handleNewMessageChange = useCallback((value: string) => {
    setNewMessage(value);
    if (value.trim()) {
      sendTyping();
    }
  }, [sendTyping]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim() || !currentUserId) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const { users, error } = await searchUsers(searchQuery, currentUserId);
      if (!error) {
        setSearchResults(users || []);
        setShowSearchResults(true);
      }
      setSearching(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, currentUserId]);

  const handleStartConversation = useCallback(async (userId: string) => {
    if (!currentUserId) return;

    try {
      const existingConversation = conversations.find(conv => 
        conv.type === 'direct' && 
        conv.participants?.some((p: any) => p.user_id === userId)
      );

      if (existingConversation) {
        isSettingProgrammaticallyRef.current = true;
        setSearchQuery('');
        setShowSearchResults(false);
        setSelectedConversation(existingConversation);
        setTimeout(() => {
          isSettingProgrammaticallyRef.current = false;
        }, 100);
        return;
      }

      const { conversation: newConversation, error } = await getOrCreateDirectConversation(
        currentUserId,
        userId
      );

      if (error) {
        return;
      }

      if (!newConversation) {
        toast.error('Failed to start conversation. No conversation was created.');
        return;
      }

      isSettingProgrammaticallyRef.current = true;
      setSearchQuery('');
      setShowSearchResults(false);

      setConversations(prev => {
        const unique = prev.filter((conv, index, self) =>
          index === self.findIndex(c => c.id === conv.id)
        );
        const existingIndex = unique.findIndex(c => c.id === newConversation.id);
        if (existingIndex !== -1) {
          return unique;
        }
        return [newConversation, ...unique];
      });

      setSelectedConversation(newConversation);

      getConversation(newConversation.id, currentUserId).then(({ conversation: fullConversation, error: fetchError }) => {
        if (!fetchError && fullConversation) {
          setSelectedConversation(prev => prev ? {
            ...fullConversation,
            last_message: fullConversation.last_message || prev.last_message,
            last_message_at: fullConversation.last_message_at || prev.last_message_at,
            last_message_id: fullConversation.last_message_id || prev.last_message_id,
            last_message_sender_id: fullConversation.last_message_sender_id || prev.last_message_sender_id,
          } : fullConversation);
          setConversations(prev => prev.map(conv =>
            conv.id === fullConversation.id ? {
              ...fullConversation,
              last_message: fullConversation.last_message || conv.last_message,
              last_message_at: fullConversation.last_message_at || conv.last_message_at,
              last_message_id: fullConversation.last_message_id || conv.last_message_id,
              last_message_sender_id: fullConversation.last_message_sender_id || conv.last_message_sender_id,
            } : conv
          ));
        }
      }).catch(() => {});

      setTimeout(() => {
        isSettingProgrammaticallyRef.current = false;
      }, 100);
    } catch (err: any) {
      toast.error('Failed to start conversation');
    }
  }, [currentUserId, conversations]);

  const handleStartBoardConversation = useCallback(async (boardId: string, boardTitle: string) => {
    if (!currentUserId) return;
    try {
      const { conversation, error } = await getOrCreateBoardConversation(boardId, boardTitle, currentUserId);
      if (error) {
        toast.error('Failed to open board chat');
        return;
      }
      if (!conversation) return;
      setConversations(prev => {
        const exists = prev.some(c => c.id === conversation.id);
        if (exists) return prev.map(c => c.id === conversation.id ? conversation : c);
        return [conversation, ...prev];
      });
      setSelectedConversation(conversation);
    } catch (err: any) {
      toast.error('Failed to open board chat');
    }
  }, [currentUserId]);

  const handleSend = useCallback(async () => {
    if ((!newMessage.trim() && draftMedia.length === 0) || !selectedConversation || !currentUserId) return;

    const messageContent = newMessage.trim() || null;
    const mediaIds = draftMedia.map(d => d.mediaId).filter(id => !!id);
    
    // If we have draft media, use the new RPC flow
    if (mediaIds.length > 0) {
      try {
        setUploading(true);
        
        const now = new Date().toISOString();
        // Determine media preview text based on draft media types
        const mediaTypes = draftMedia.map(d => d.mediaType);
        const hasImage = mediaTypes.includes('image');
        const hasVideo = mediaTypes.includes('video');
        const hasAudio = mediaTypes.includes('audio');
        const hasDocument = mediaTypes.includes('document');
        
        let mediaPreview = '';
        if (hasImage && mediaTypes.length === 1) mediaPreview = '📷 Image';
        else if (hasVideo && mediaTypes.length === 1) mediaPreview = '🎥 Video';
        else if (hasAudio && mediaTypes.length === 1) mediaPreview = '🎵 Audio';
        else if (hasDocument && mediaTypes.length === 1) mediaPreview = `📎 ${draftMedia[0].fileName}`;
        else mediaPreview = `${mediaTypes.length} attachments`;
        
        const lastMessageText = messageContent || mediaPreview;
        
        const updatedConversation = {
          ...selectedConversation,
          last_message: lastMessageText,
          last_message_at: now,
          last_message_sender_id: currentUserId,
        };
        setSelectedConversation(updatedConversation);
        
        setConversations(prev => {
          const updated = prev.map(conv =>
            conv.id === selectedConversation.id
              ? { ...conv, last_message: lastMessageText, last_message_at: now, last_message_sender_id: currentUserId }
              : conv
          );
          const updatedConv = updated.find(c => c.id === selectedConversation.id);
          if (updatedConv) {
            return [updatedConv, ...updated.filter(c => c.id !== selectedConversation.id)];
          }
          return updated;
        });
        
        // Step 3: Send message with all media IDs
        const { data: rpcResult, error: rpcError } = await sendMessageWithMedia(
          currentUserId,
          selectedConversation.id,
          messageContent,
          mediaIds
        );

        if (rpcError) {
          setConversations(prev => prev.map(conv =>
            conv.id === selectedConversation.id ? selectedConversation : conv
          ));
          setSelectedConversation(selectedConversation);
          toast.error(rpcError.message || 'Failed to send message. Please try again.');
          return;
        }

        if (rpcResult?.success) {
          setDraftMedia([]);
          setNewMessage('');
          
          if (rpcResult.created_at) {
            setConversations(prev => prev.map(conv =>
              conv.id === selectedConversation.id
                ? { ...conv, last_message: lastMessageText, last_message_at: rpcResult.created_at, last_message_id: rpcResult.message_id, last_message_sender_id: currentUserId }
                : conv
            ));
            setSelectedConversation(prev => prev ? {
              ...prev,
              last_message: lastMessageText,
              last_message_at: rpcResult.created_at,
              last_message_id: rpcResult.message_id,
              last_message_sender_id: currentUserId
            } : prev);
          }
          
          // The realtime listener will handle adding the message to the UI
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (err: any) {
        // Revert optimistic update on error
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id ? selectedConversation : conv
        ));
        setSelectedConversation(selectedConversation);
        toast.error('Failed to send message. Please try again.');
      } finally {
        setUploading(false);
      }
      return;
    }

    // Text-only message (legacy flow)
    const messageContentText = newMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    const optimisticMessage: ChatMessage = {
      id: tempMessageId,
      content: messageContentText,
      createdAt: now,
      user: {
        id: currentUserId,
        name: 'You',
        avatar: undefined,
      },
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      messageType: 'text',
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const updatedConversation = {
      ...selectedConversation,
      last_message: messageContentText,
      last_message_at: now,
      last_message_sender_id: currentUserId,
    };
    setSelectedConversation(updatedConversation);

    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: messageContentText, last_message_at: now, last_message_sender_id: currentUserId }
          : conv
      );
      const updatedConv = updated.find(c => c.id === selectedConversation.id);
      if (updatedConv) {
        return [updatedConv, ...updated.filter(c => c.id !== selectedConversation.id)];
      }
      return updated;
    });

    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
    
    sendMessage(currentUserId, {
      conversation_id: selectedConversation.id,
      content: messageContentText,
      message_type: 'text',
      last_message_id: lastMessageId,
    }).then(({ error, message: sentMessage }) => {
      if (error) {
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id ? selectedConversation : conv
        ));
        setSelectedConversation(selectedConversation);
        toast.error('Failed to send message. Please try again.');
      } else if (sentMessage) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessageId);
          if (!filtered.some(m => m.id === sentMessage.id)) {
            const realMessage: ChatMessage = {
              id: sentMessage.id,
              content: sentMessage.content || '',
              createdAt: sentMessage.created_at,
              user: {
                id: sentMessage.sender_id,
                name: sentMessage.sender?.name || 'You',
                avatar: sentMessage.sender?.profile_pic_url,
              },
              conversationId: sentMessage.conversation_id,
              senderId: sentMessage.sender_id,
              messageType: sentMessage.message_type || 'text',
              fileUrl: sentMessage.file_url,
              fileName: sentMessage.file_name,
            };
            return [...filtered, realMessage];
          }
          return filtered;
        });
        
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                last_message: sentMessage.content || 'Media',
                last_message_at: sentMessage.created_at,
                last_message_id: sentMessage.id,
                last_message_sender_id: sentMessage.sender_id
              }
            : conv
        ));
        
        setSelectedConversation(prev => 
          prev ? {
            ...prev,
            last_message: sentMessage.content || 'Media',
            last_message_at: sentMessage.created_at,
            last_message_id: sentMessage.id,
            last_message_sender_id: sentMessage.sender_id
          } : prev
        );
      }
    }).catch(() => {
      setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id ? selectedConversation : conv
      ));
      setSelectedConversation(selectedConversation);
      toast.error('Failed to send message. Please try again.');
    });
  }, [newMessage, selectedConversation, currentUserId, draftMedia]);

  const removeDraftMedia = useCallback(async (mediaId: string) => {
    if (!currentUserId) return;
    
    await cancelChatMedia(currentUserId, mediaId);
    
    setDraftMedia(prev => prev.filter(d => d.mediaId !== mediaId));
  }, [currentUserId]);

  useEffect(() => {
    return () => {
      if (draftMedia.length > 0 && currentUserId) {
        draftMedia.forEach(draft => {
          if (!draft.mediaId.startsWith('temp-')) {
            cancelChatMedia(currentUserId, draft.mediaId).catch(() => {});
          }
          if (draft.previewUrl) {
            URL.revokeObjectURL(draft.previewUrl);
          }
        });
      }
    };
  }, [selectedConversation?.id]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!selectedConversation || !currentUserId) return;

    if (draftMedia.length >= MEDIA_LIMITS.maxAttachments) {
      toast.error(`Maximum ${MEDIA_LIMITS.maxAttachments} attachments per message`);
      return;
    }

    const validation = validateMediaSize(file);
    if (!validation.valid) {
      toast.error(validation.error || 'File too large');
      return;
    }

    const currentTotalSize = draftMedia.reduce((sum, d) => sum + d.fileSize, 0);
    if (currentTotalSize + file.size > MEDIA_LIMITS.maxTotalSize) {
      const maxMB = Math.round(MEDIA_LIMITS.maxTotalSize / (1024 * 1024));
      toast.error(`Total message size cannot exceed ${maxMB}MB`);
      return;
    }

    const mediaType = getMediaTypeFromMime(file.type);
    
    let previewUrl = '';
    if (mediaType === 'image') {
      previewUrl = URL.createObjectURL(file);
    } else if (mediaType === 'video') {
      previewUrl = URL.createObjectURL(file);
    } else {
      previewUrl = '';
    }

    const tempDraftId = `temp-${Date.now()}`;
    const draftEntry: DraftMedia = {
      mediaId: tempDraftId,
      file,
      previewUrl,
      mediaType,
      fileName: file.name,
      fileSize: file.size,
      uploading: true,
    };

    setDraftMedia(prev => [...prev, draftEntry]);

    try {
      const { data: mediaData, error: createError } = await createChatMedia(
        currentUserId,
        file,
        mediaType === 'video' || mediaType === 'audio' ? {
        } : undefined
      );

      if (createError || !mediaData) {
        setDraftMedia(prev => prev.filter(d => d.mediaId !== tempDraftId));
        toast.error(createError?.message || 'Failed to prepare media upload');
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        return;
      }

      const { success, error: uploadError } = await uploadChatMediaFile(
        mediaData.bucket,
        mediaData.path,
        file
      );

      if (!success || uploadError) {
        await cancelChatMedia(currentUserId, mediaData.media_id);
        setDraftMedia(prev => prev.filter(d => d.mediaId !== tempDraftId));
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        
        const errorMessage = uploadError?.message || 'Failed to upload file';
        if (errorMessage.includes('Bucket not found')) {
          toast.error('Storage bucket not configured! Please create the storage bucket in Supabase.');
        } else if (errorMessage.includes('Permission') || errorMessage.includes('403')) {
          toast.error('Storage permissions issue! Check bucket permissions.');
        } else {
          toast.error(`Failed to upload file: ${errorMessage}`);
        }
        return;
      }

      setDraftMedia(prev => prev.map(d => 
        d.mediaId === tempDraftId 
          ? { ...d, mediaId: mediaData.media_id, uploading: false }
          : d
      ));
    } catch (err: any) {
      setDraftMedia(prev => prev.filter(d => d.mediaId !== tempDraftId));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      toast.error('Failed to upload file. Please try again.');
    }
  }, [selectedConversation, currentUserId, draftMedia]);

  const getConversationName = useCallback((conv: Conversation): string => {
    if (conv.type === 'direct') {
      if (conv.other_user) {
        if (conv.other_user.name) {
          return conv.other_user.name;
        }
        const userId = conv.other_user.user_id || conv.other_user.id;
        if (userId) {
          return `User ${userId.substring(0, 8)}`;
        }
      }
      
      if (conv.participants && conv.participants.length > 0) {
        const otherParticipant = conv.participants.find(
          (p: any) => p.user_id !== currentUserId
        );

        if (otherParticipant) {
          if (otherParticipant.user?.name) {
            return otherParticipant.user.name;
          }
          if (otherParticipant.user_id) {
            return `User ${otherParticipant.user_id.substring(0, 8)}`;
          }
        }
      }
      
      return 'Unknown User';
    }
    
    if (conv.name) return conv.name;
    
    return 'Conversation';
  }, [currentUserId]);

  const getConversationAvatar = useCallback((conv: Conversation): string | StaticImport => {
    if (conv.type === 'direct' && conv.other_user?.profile_pic_url) {
      const picUrl = conv.other_user.profile_pic_url.trim();
      if (picUrl && picUrl !== 'null' && picUrl !== 'undefined' && picUrl !== '') {
        return picUrl;
      }
    }
    
    if (conv.type === 'direct' && conv.participants && conv.participants.length > 0) {
      const otherParticipant = conv.participants.find(
        (p: any) => p.user_id !== currentUserId
      );

      if (otherParticipant?.user?.profile_pic_url) {
        const picUrl = otherParticipant.user.profile_pic_url.trim();
        if (picUrl && picUrl !== 'null' && picUrl !== 'undefined' && picUrl !== '') {
          return picUrl;
        }
      }
    }
    return ProfileAvatar;
  }, [currentUserId]);

  const formatTime = useCallback((dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  }, []);

  const getLastMessageWithSender = useCallback((conv: Conversation): string => {
    let messageContent: string;
    let senderId: string | undefined;
    let senderName: string | undefined;
    let messageType: string | undefined;
    
    if (selectedConversation?.id === conv.id && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      messageType = lastMsg.messageType;
      
      // For media messages, don't show filename - show media type instead
      if (lastMsg.messageType === 'image' || lastMsg.media?.some(m => m.mediaType === 'image')) {
        messageContent = lastMsg.content || 'Image';
      } else if (lastMsg.messageType === 'video' || lastMsg.media?.some(m => m.mediaType === 'video')) {
        messageContent = lastMsg.content || 'Video';
      } else if (lastMsg.messageType === 'audio' || lastMsg.media?.some(m => m.mediaType === 'audio')) {
        messageContent = lastMsg.content || 'Audio';
      } else if (lastMsg.messageType === 'file' || lastMsg.media?.some(m => m.mediaType === 'document')) {
        messageContent = lastMsg.content || 'Document';
      } else {
        messageContent = lastMsg.content || lastMsg.fileName || 'Media';
      }
      
      senderId = lastMsg.senderId;
      senderName = lastMsg.user?.name;
    } else {
      if (!conv.last_message) {
        if (conv.last_message_at) {
          messageContent = 'Media';
        } else {
          return "No message yet";
        }
      } else {
        messageContent = conv.last_message;
      }
      senderId = conv.last_message_sender_id;
    }
    
    // Replace filenames with media type labels (check both messageType and filename patterns)
    // Check for image filenames first (most common)
    if (messageType === 'image' || 
        (messageContent && /\.(jpg|jpeg|png|gif|webp|bmp|svg|heic|heif)$/i.test(messageContent) && 
         !messageContent.includes(' ') && messageContent.length < 100)) {
      messageContent = 'Image';
    }
    else if (messageType === 'video' || 
             (messageContent && /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i.test(messageContent) && 
              !messageContent.includes(' ') && messageContent.length < 100)) {
      messageContent = 'Video';
    }
    else if (messageType === 'audio' || 
             (messageContent && /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(messageContent) && 
              !messageContent.includes(' ') && messageContent.length < 100)) {
      messageContent = 'Audio';
    }
    else if (messageType === 'file' || 
             (messageContent && /\.(pdf|doc|docx|txt|zip|rar)$/i.test(messageContent) && 
              !messageContent.includes(' ') && messageContent.length < 100)) {
      messageContent = 'Document';
    }
    
    if (senderId === currentUserId) {
      return `You: ${messageContent}`;
    }
    
    if (senderName) {
      return `${senderName}: ${messageContent}`;
    }
    
    if (conv.other_user && senderId === (conv.other_user.user_id || conv.other_user.id)) {
      return `${conv.other_user.name}: ${messageContent}`;
    }
    
    const sender = conv.participants?.find((p: any) => p.user_id === senderId);
    if (sender?.user?.name) {
      return `${sender.user.name}: ${messageContent}`;
    }
    
    return messageContent;
  }, [currentUserId, selectedConversation, messages]);

  const directConversations = conversations.filter(conv =>
    conv.type === 'direct' &&
    (conv.last_message_at || conv.last_message) &&
    (!searchQuery ||
      getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.last_message || 'Media').toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const groupConversations = conversations.filter(conv =>
    conv.type === 'group' &&
    (conv.last_message_at || conv.last_message) &&
    (!searchQuery ||
      getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.last_message || 'Media').toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredConversations = conversations.filter(conv => {
    if (selectedConversation && conv.id === selectedConversation.id) return true;
    if (selectedTab === 'All') return directConversations.includes(conv) || groupConversations.includes(conv);
    if (selectedTab === 'One-to-One') return directConversations.includes(conv);
    if (selectedTab === 'Group Chats' || selectedTab === 'Board Chats') return groupConversations.includes(conv);
    return false;
  });

  const shouldShowHeader = useCallback((message: ChatMessage, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId ||
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000; 
  }, [messages]);

  return {
    loading,
    messages,
    isTyping,
    searching,
    uploading,
    newMessage,
    formatTime,
    sendTyping,
    handleSend,
    draftMedia,
    searchQuery,
    selectedTab,
    onlineUsers,
    isConnected,
    typingUsers,
    activeBoards,
    isUserOnline,
    searchResults,
    realtimeError,
    conversations,
    currentUserId,
    loadingBoards,
    setSelectedTab,
    setSearchQuery,
    messagesEndRef,
    getLastSeenText,
    shouldShowHeader,
    removeDraftMedia,
    handleFileUpload,
    showSearchResults,
    getConversationName,
    selectedConversation,
    setShowSearchResults,
    getConversationAvatar,
    filteredConversations,
    directConversations,
    groupConversations,
    handleStartConversation,
    handleStartBoardConversation,
    setSelectedConversation,
    getLastMessageWithSender,
    setNewMessage: handleNewMessageChange,
  };
};

