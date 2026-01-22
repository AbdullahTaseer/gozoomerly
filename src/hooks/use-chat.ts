import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat';
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  uploadMessageFile,
  markConversationAsRead,
  getOrCreateDirectConversation,
  getConversation,
  searchUsers,
  type Conversation,
} from '@/lib/supabase/chat';
import { AuthService } from '@/lib/supabase/auth';
import { checkChatTablesSetup } from '@/lib/supabase/chat-diagnostics';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import toast from 'react-hot-toast';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';

const authService = new AuthService();

export const useChat = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Connections' | 'Boards'>('Connections');
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

      await loadConversations(user.id);

      const isChatPage = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard/chat');
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
                  return prev.map(c => c.id === conversation.id ? conversation : c);
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
            messageType: msg.message_type || 'text',
            fileUrl: msg.file_url,
            fileName: msg.file_name,
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
            setSelectedConversation(fullConv);

            setConversations(prev => prev.map(conv =>
              conv.id === fullConv.id ? fullConv : conv
            ));
          }
        }).catch(() => {});
      }
    } else {

      localStorage.removeItem('selectedConversationId');
    }
  }, [selectedConversation, currentUserId, loadMessages]);

  useEffect(() => {
    if (selectedConversation) {
      if (selectedTab === 'Connections' && selectedConversation.type !== 'direct') {
        setSelectedConversation(null);
      } else if (selectedTab === 'Boards' && selectedConversation.type !== 'group') {
        setSelectedConversation(null);
      }
    }
  }, [selectedTab, selectedConversation]);

  useEffect(() => {
    if (selectedTab === 'Boards' && currentUserId && fetchUserBoardsRef.current) {
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

          setSelectedConversation(fullConversation);
          setConversations(prev => prev.map(conv =>
            conv.id === fullConversation.id ? fullConversation : conv
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

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;

    const messageContent = newMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    const optimisticMessage: ChatMessage = {
      id: tempMessageId,
      content: messageContent,
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
      last_message: messageContent,
      last_message_at: now,
      last_message_sender_id: currentUserId,
    };
    setSelectedConversation(updatedConversation);

    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: messageContent, last_message_at: now, last_message_sender_id: currentUserId }
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
      content: messageContent,
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
  }, [newMessage, selectedConversation, currentUserId]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!selectedConversation || !currentUserId || uploading) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);

      const messageType = file.type.startsWith('image/') ? 'image' :
        file.type.startsWith('video/') ? 'video' :
          file.type.startsWith('audio/') ? 'audio' : 'file';

      const tempMessageId = `temp-file-${Date.now()}`;
      const now = new Date().toISOString();

      if (messageType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          const optimisticMessage: ChatMessage = {
            id: tempMessageId,
            content: '',
            createdAt: now,
            user: {
              id: currentUserId,
              name: 'You',
              avatar: undefined,
            },
            conversationId: selectedConversation.id,
            senderId: currentUserId,
            messageType: 'image',
            fileUrl: previewUrl,
            fileName: file.name,
          };
          setMessages(prev => [...prev, optimisticMessage]);
        };
        reader.readAsDataURL(file);
      }

      const { fileUrl, error: uploadError } = await uploadMessageFile(
        selectedConversation.id,
        currentUserId,
        file
      );

      if (uploadError || !fileUrl) {
        if (messageType === 'image') {
          setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        }

        const errorMessage = uploadError?.message || 'Failed to upload file';
        if (errorMessage.includes('Bucket not found') || errorMessage.includes('chat-files')) {
          toast.error('Storage bucket not configured! Please create the "chat-files" bucket in Supabase.');
        } else if (errorMessage.includes('Permission') || errorMessage.includes('403') || errorMessage.includes('400')) {
          toast.error('Storage permissions issue! The "chat-files" bucket exists but permissions are not set up.');
        } else {
          toast.error(`Failed to upload file: ${errorMessage}`);
        }
        return;
      }

      if (messageType === 'image') {
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      }

      const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

      const { error: sendError, message: sentMessage } = await sendMessage(currentUserId, {
        conversation_id: selectedConversation.id,
        message_type: messageType,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        last_message_id: lastMessageId,
      });

      if (sendError) {
        toast.error('Failed to send file. Please try again.');
      } else if (sentMessage) {
        const lastMessageText = messageType === 'image' ? '📷 Image' :
          messageType === 'video' ? '🎥 Video' :
            messageType === 'audio' ? '🎵 Audio' :
              file.name || 'Media';
        const updatedConv = {
          ...selectedConversation,
          last_message: lastMessageText,
          last_message_at: sentMessage.created_at,
          last_message_id: sentMessage.id,
          last_message_sender_id: sentMessage.sender_id,
        };

        setSelectedConversation(updatedConv);

        setConversations(prev => {
          const updated = prev.map(conv =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  last_message: lastMessageText,
                  last_message_at: sentMessage.created_at,
                  last_message_id: sentMessage.id,
                  last_message_sender_id: sentMessage.sender_id
                }
              : conv
          );
          const updatedConvItem = updated.find(c => c.id === selectedConversation.id);
          if (updatedConvItem) {
            const others = updated.filter(c => c.id !== selectedConversation.id);
            const sortedOthers = others.sort((a, b) => {
              const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
              const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
              return timeB - timeA;
            });
            return [updatedConvItem, ...sortedOthers];
          }
          return updated;
        });

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [selectedConversation, currentUserId, uploading]);

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

    if (selectedConversation?.id === conv.id && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      messageContent = lastMsg.content || lastMsg.fileName || 'Media';
      senderId = lastMsg.senderId;
      senderName = lastMsg.user?.name;
    } else {

      if (!conv.last_message) return "No message yet";

      messageContent = conv.last_message;
      senderId = conv.last_message_sender_id;
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

  const filteredConversations = conversations.filter(conv => {

    if (selectedConversation && conv.id === selectedConversation.id) {
      return true;
    }

    if (selectedTab === 'Connections' && conv.type !== 'direct') {
      return false;
    }
    if (selectedTab === 'Boards' && conv.type !== 'group') {
      return false;
    }

    if (!conv.last_message) {
      return false;
    }

    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const name = getConversationName(conv).toLowerCase();
    const lastMessage = (conv.last_message || '').toLowerCase();
    return name.includes(searchLower) || lastMessage.includes(searchLower);
  });

  const shouldShowHeader = useCallback((message: ChatMessage, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId ||
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000;
  }, [messages]);

  return {
    currentUserId,
    conversations,
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
    isConnected,
    realtimeError,
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
  };
};

