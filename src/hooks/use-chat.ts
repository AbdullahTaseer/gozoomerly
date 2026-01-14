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

  useEffect(() => {
    async function getCurrentUser() {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setCurrentUserId(user.id);
      
      await loadConversations(user.id);
      
      // Only restore from localStorage if there's no URL param (let URL params take priority)
      // Check if we're on the chat page and if there are URL params
      const isChatPage = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard/chat');
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const hasUrlParams = urlParams && (urlParams.get('conversationId') || urlParams.get('userId'));
      
      // Only restore from localStorage if no URL params are present
      if (!hasUrlParams) {
        const savedConversationId = localStorage.getItem('selectedConversationId');
        
        if (savedConversationId) {
          try {
            const { conversation, error } = await getConversation(savedConversationId, user.id);
            if (!error && conversation) {
              setSelectedConversation(conversation);
              // Update conversations list with the restored conversation
              setConversations(prev => {
                const existing = prev.find(c => c.id === conversation.id);
                if (existing) {
                  return prev.map(c => c.id === conversation.id ? conversation : c);
                }
                return [conversation, ...prev];
              });
            } else {
              // Clear invalid saved conversation
              localStorage.removeItem('selectedConversationId');
            }
          } catch (err) {
            console.error('Error restoring conversation:', err);
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
        console.error('Error loading conversations:', error);

        const diagnostics = await checkChatTablesSetup();
        if (!diagnostics.tablesExist) {
          console.error('Chat tables diagnostic:', diagnostics);
          alert(
            `Chat tables are not set up correctly.\n\n` +
            `Errors:\n${diagnostics.errors.join('\n')}\n\n` +
            `Please run the SQL setup script in your Supabase dashboard.`
          );
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
      console.error('Error loading conversations:', err);
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
      if (error) {
        console.error('Error loading messages:', error);
      } else {
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

        // Optimize: Only fetch unique sender profiles to avoid duplicate requests
        const messagesNeedingProfiles = chatMessages.filter(
          m => m.user.name === 'Loading...' || m.user.name === 'Unknown' || !m.user.avatar
        );
        
        const uniqueSenderIds = [...new Set(messagesNeedingProfiles.map(m => m.senderId))];

        if (uniqueSenderIds.length > 0 && currentUserId) {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();

          // Batch fetch all unique profiles at once
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
      console.error('Error loading messages:', err);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation && currentUserId) {
      // Save selected conversation to localStorage for restoration after reload
      localStorage.setItem('selectedConversationId', selectedConversation.id);
      
      // Optimize: Load messages and fetch full conversation in parallel if needed
      const needsFullConversation = selectedConversation.type === 'direct' && 
        (!selectedConversation.participants || 
         selectedConversation.participants.length === 0 || 
         !selectedConversation.participants.some((p: any) => p.user?.name));
      
      // Load messages immediately
      loadMessages(selectedConversation.id);
      
      // Mark as read immediately
      markConversationAsRead(selectedConversation.id, currentUserId).catch(err => {
        console.error('Error marking conversation as read:', err);
      });
      
      // Fetch full conversation in parallel if needed (non-blocking)
      if (needsFullConversation) {
        getConversation(selectedConversation.id, currentUserId).then(({ conversation: fullConv, error }) => {
          if (!error && fullConv) {
            setSelectedConversation(fullConv);
            // Update in conversations list too
            setConversations(prev => prev.map(conv => 
              conv.id === fullConv.id ? fullConv : conv
            ));
          }
        }).catch(err => {
          console.error('Error fetching full conversation:', err);
        });
      }
    } else {
      // Clear saved conversation when none is selected
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


  const handleMessageReceived = useCallback((message: ChatMessage) => {

    if (selectedConversation && message.conversationId !== selectedConversation.id) {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === message.conversationId
            ? {
                ...conv,
                last_message: message.content || message.fileName || 'Media',
                last_message_at: message.createdAt,
                last_message_id: message.id
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
              last_message_id: message.id
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
      if (error) {
        console.error('Error searching users:', error);
      } else {
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
      // Check if conversation already exists in the list
      const existingConversation = conversations.find(conv => 
        conv.type === 'direct' && 
        conv.participants?.some((p: any) => p.user_id === userId)
      );

      // If conversation exists, open it immediately without reloading
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
        console.error('Error creating conversation:', error);
        const errorMessage = error?.message || JSON.stringify(error) || 'Unknown error';
        console.log(`Failed to start conversation: ${errorMessage}\n\nPlease make sure the database tables are set up correctly.`);
        return;
      }

      if (!newConversation) {
        alert('Failed to start conversation. No conversation was created.');
        return;
      }

      // Set the conversation immediately with basic data (optimistic update)
      isSettingProgrammaticallyRef.current = true;
      setSearchQuery('');
      setShowSearchResults(false);

      // Add to conversations list immediately
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

      // Set conversation immediately so UI updates right away
      setSelectedConversation(newConversation);

      // Fetch full conversation with participants in background (non-blocking)
      getConversation(newConversation.id, currentUserId).then(({ conversation: fullConversation, error: fetchError }) => {
        if (!fetchError && fullConversation) {
          // Update with full conversation data
          setSelectedConversation(fullConversation);
          setConversations(prev => prev.map(conv => 
            conv.id === fullConversation.id ? fullConversation : conv
          ));
        }
      }).catch(err => {
        console.error('Error fetching full conversation:', err);
      });

      // Reset flag after a short delay
      setTimeout(() => {
        isSettingProgrammaticallyRef.current = false;
      }, 100);
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error';
      alert(`Failed to start conversation: ${errorMessage}`);
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
    };
    setSelectedConversation(updatedConversation);

    setConversations(prev => {
      const updated = prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: messageContent, last_message_at: now }
          : conv
      );
      const updatedConv = updated.find(c => c.id === selectedConversation.id);
      if (updatedConv) {
        return [updatedConv, ...updated.filter(c => c.id !== selectedConversation.id)];
      }
      return updated;
    });

    // Get the last message ID from the messages array
    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
    
    sendMessage(currentUserId, {
      conversation_id: selectedConversation.id,
      content: messageContent,
      message_type: 'text',
      last_message_id: lastMessageId,
    }).then(({ error, message: sentMessage }) => {
      if (error) {
        console.error('Error sending message:', error);
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id ? selectedConversation : conv
        ));
        setSelectedConversation(selectedConversation);
        alert('Failed to send message. Please try again.');
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
        
        // Update conversations with the real message ID
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                last_message: sentMessage.content || 'Media',
                last_message_at: sentMessage.created_at,
                last_message_id: sentMessage.id
              }
            : conv
        ));
        
        // Update selected conversation with real message ID
        setSelectedConversation(prev => 
          prev ? {
            ...prev,
            last_message: sentMessage.content || 'Media',
            last_message_at: sentMessage.created_at,
            last_message_id: sentMessage.id
          } : prev
        );
      }
    }).catch((err) => {
      console.error('Error sending message:', err);
      setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id ? selectedConversation : conv
      ));
      setSelectedConversation(selectedConversation);
      alert('Failed to send message. Please try again.');
    });
  }, [newMessage, selectedConversation, currentUserId]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!selectedConversation || !currentUserId || uploading) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
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
        console.error('Error uploading file:', uploadError);
        if (messageType === 'image') {
          setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        }

        const errorMessage = uploadError?.message || 'Failed to upload file';
        if (errorMessage.includes('Bucket not found') || errorMessage.includes('chat-files')) {
          alert(
            'Storage bucket not configured!\n\n' +
            'Please create the "chat-files" bucket in Supabase:\n' +
            '1. Go to Supabase Dashboard → Storage\n' +
            '2. Click "Create Bucket"\n' +
            '3. Name: chat-files\n' +
            '4. Make it Public\n' +
            '5. Click Create\n\n' +
            'Then set up storage policies (see STORAGE_SETUP.md)'
          );
        } else if (errorMessage.includes('Permission') || errorMessage.includes('403') || errorMessage.includes('400')) {
          alert(
            'Storage permissions issue!\n\n' +
            'The "chat-files" bucket exists but permissions are not set up.\n\n' +
            'Please run this SQL in Supabase SQL Editor:\n\n' +
            'CREATE POLICY "Allow authenticated uploads to chat-files"\n' +
            'ON storage.objects FOR INSERT\n' +
            'TO authenticated\n' +
            'WITH CHECK (bucket_id = \'chat-files\');\n\n' +
            'See STORAGE_SETUP.md for complete setup instructions.'
          );
        } else {
          alert(`Failed to upload file: ${errorMessage}\n\nCheck browser console for details.`);
        }
        return;
      }

      if (messageType === 'image') {
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      }

      // Get the last message ID from the messages array
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
        console.error('Error sending file message:', sendError);
        alert('Failed to send file. Please try again.');
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
        };

        setSelectedConversation(updatedConv);

        setConversations(prev => {
          const updated = prev.map(conv =>
            conv.id === selectedConversation.id
              ? { 
                  ...conv, 
                  last_message: lastMessageText, 
                  last_message_at: sentMessage.created_at,
                  last_message_id: sentMessage.id
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
      console.error('Error uploading file:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [selectedConversation, currentUserId, uploading]);

  const getConversationName = useCallback((conv: Conversation): string => {
    if (conv.name) return conv.name;
    if (conv.type === 'direct' && conv.participants && conv.participants.length > 0) {
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
    return 'Conversation';
  }, [currentUserId]);

  const getConversationAvatar = useCallback((conv: Conversation): string | StaticImport => {
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

  const filteredConversations = conversations.filter(conv => {
    // Filter by tab type
    if (selectedTab === 'Connections' && conv.type !== 'direct') {
      return false;
    }
    if (selectedTab === 'Boards' && conv.type !== 'group') {
      return false;
    }
    
    // Message filter disabled - showing all conversations
    // The backend last_message/last_message_at fields need to be fixed first
    // before this filter can work reliably
    
    // Apply search query filter if present
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
    filteredConversations,
    shouldShowHeader,
  };
};

