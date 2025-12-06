'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { PlusCircle, Send, ArrowLeft, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import ChatCard from '@/components/cards/ChatCard';
import ZoomerlyLogo from "@/assets/svgs/Zoomerly.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { ChatMessageItem } from '@/components/chat/ChatMessageItem';
import { useRealtimeChat, type ChatMessage } from '@/hooks/use-realtime-chat';
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  uploadMessageFile,
  markConversationAsRead,
  getOrCreateDirectConversation,
  searchUsers,
  type Conversation,
} from '@/lib/supabase/chat';
import { AuthService } from '@/lib/supabase/auth';
import { checkChatTablesSetup } from '@/lib/supabase/chat-diagnostics';

const authService = new AuthService();

const ChatPage = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user
  useEffect(() => {
    async function getCurrentUser() {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setCurrentUserId(user.id);
      loadConversations(user.id);
    }
    getCurrentUser();
  }, []);

  // Load conversations
  const loadConversations = async (userId: string) => {
    try {
      setLoading(true);
      const { conversations: convs, error } = await getUserConversations(userId);
      if (error) {
        console.error('Error loading conversations:', error);
        
        // Check if tables exist
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
        // Remove duplicates by conversation ID first
        let uniqueConversations = (convs || []).filter((conv, index, self) => 
          index === self.findIndex(c => c.id === conv.id)
        );
        
        // Also remove duplicates by participant combination (same two users in direct conversations)
        if (currentUserId) {
          const seenPairs = new Set<string>();
          uniqueConversations = uniqueConversations.filter(conv => {
            if (conv.type !== 'direct' || !conv.participants || conv.participants.length !== 2) {
              return true; // Keep non-direct or group conversations
            }
            
            // Create a unique key for the participant pair
            const participantIds = conv.participants
              .map((p: any) => p.user_id)
              .sort()
              .join('-');
            
            if (seenPairs.has(participantIds)) {
              // Duplicate conversation for same user pair - keep the one with most recent message
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
  };

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && currentUserId) {
      loadMessages(selectedConversation.id);
      markConversationAsRead(selectedConversation.id, currentUserId);
    }
  }, [selectedConversation, currentUserId]);

  const loadMessages = async (conversationId: string) => {
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
        // Transform messages to ChatMessage format
        const chatMessages: ChatMessage[] = (msgs || []).map((msg: any) => {
          // Fetch sender profile if not included
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
        
        // If any messages have "Loading..." or "Unknown" or missing avatar, fetch profile data
        const messagesNeedingProfiles = chatMessages.filter(
          m => m.user.name === 'Loading...' || m.user.name === 'Unknown' || !m.user.avatar
        );
        
        if (messagesNeedingProfiles.length > 0 && currentUserId) {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          
          await Promise.all(
            messagesNeedingProfiles.map(async (msg) => {
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('id, name, profile_pic_url')
                  .eq('id', msg.senderId)
                  .single();
                
                if (profileData) {
                  const index = chatMessages.findIndex(m => m.id === msg.id);
                  if (index !== -1) {
                    chatMessages[index].user = {
                      id: profileData.id,
                      name: profileData.name || 'Unknown User',
                      avatar: profileData.profile_pic_url || undefined,
                    };
                  }
                }
              } catch (err) {
                console.warn('Could not fetch profile for message:', msg.id, err);
              }
            })
          );
        }
        setMessages(chatMessages);
        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Real-time subscription handlers - use useCallback to prevent re-subscriptions
  const handleMessageReceived = useCallback((message: ChatMessage) => {
    console.log('📨 handleMessageReceived called with:', message);
    console.log('Current conversation:', selectedConversation?.id, 'Message conversation:', message.conversationId);
    
    // Only process messages for the currently selected conversation
    if (selectedConversation && message.conversationId !== selectedConversation.id) {
      console.log('⚠️ Message is for a different conversation, updating conversation list only');
      // Still update the conversation list
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === message.conversationId 
            ? { 
                ...conv, 
                last_message: message.content || message.fileName || 'Media',
                last_message_at: message.createdAt 
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
      // Remove any temporary/optimistic messages with same content from current user
      // and avoid duplicates based on message id
      const filtered = prev.filter(m => {
        // Remove temp messages from current user if real message arrived (match by content and sender)
        if (m.id.startsWith('temp-') && 
            m.senderId === currentUserId && 
            m.senderId === message.senderId &&
            m.content === message.content &&
            Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000) {
          return false;
        }
        // Remove duplicates by ID
        if (m.id === message.id) {
          return false;
        }
        return true;
      });
      
      // Add the new message and sort by timestamp
      const updated = [...filtered, message];
      const sorted = updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      console.log(`✅ Message added. Total messages: ${sorted.length}`);
      return sorted;
    });
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Mark as read if it's not from current user
    if (message.senderId !== currentUserId && selectedConversation) {
      markConversationAsRead(selectedConversation.id, currentUserId!);
    }
    
    // Update conversation in list immediately (no loading, no refresh)
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === message.conversationId 
          ? { 
              ...conv, 
              last_message: message.content || message.fileName || 'Media',
              last_message_at: message.createdAt 
            }
          : conv
      );
      // Move updated conversation to top
      const updatedConv = updated.find(c => c.id === message.conversationId);
      if (updatedConv) {
        // Sort by last_message_at to ensure most recent is first
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
    
    // Update selected conversation if it matches
    setSelectedConversation(prev => {
      if (prev && message.conversationId === prev.id) {
        return {
      ...prev,
          last_message: message.content || message.fileName || 'Media',
          last_message_at: message.createdAt,
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

  // Real-time subscription
  const { isConnected, error: realtimeError } = useRealtimeChat({
    conversationId: selectedConversation?.id || null,
    currentUserId,
    onMessageReceived: handleMessageReceived,
    onMessageUpdated: handleMessageUpdated,
    onMessageDeleted: handleMessageDeleted,
    enabled: !!selectedConversation && !!currentUserId,
  });

  // Log real-time connection status and show warning if not connected
  useEffect(() => {
    if (selectedConversation) {
      console.log('Real-time connection status:', isConnected, 'Error:', realtimeError);
      if (realtimeError) {
        console.error('❌ Real-time error:', realtimeError);
        console.error('💡 To fix: Enable replication for the "messages" table in Supabase Dashboard → Database → Replication');
      }
      if (!isConnected && !realtimeError) {
        console.warn('⚠️ Real-time not connected yet. Waiting for subscription...');
      }
    }
  }, [isConnected, realtimeError, selectedConversation]);

  // Always poll for new messages as a backup (works even if real-time fails)
  useEffect(() => {
    if (!selectedConversation || !currentUserId) return;

    let pollInterval: NodeJS.Timeout | null = null;
    const conversationId = selectedConversation.id;
    let isPolling = false;

    // Poll every 1 second for updates (reduced frequency to prevent reloads)
    pollInterval = setInterval(async () => {
      if (isPolling) return; // Prevent overlapping polls
      isPolling = true;
      
      try {
        const { messages: msgs } = await getConversationMessages(
          conversationId,
          currentUserId,
          100
        );
        
        if (msgs && msgs.length > 0) {
          // Check if we have new messages by comparing with current state
          setMessages(prev => {
            const prevIds = new Set(prev.map(m => m.id));
            const newMessages = msgs.filter(m => !prevIds.has(m.id));
            
            if (newMessages.length > 0) {
              // Get the latest new message to update conversation list
              const latestNewMessage = newMessages[newMessages.length - 1];
              
              // Update conversation list with latest message (only update, don't reload)
              setConversations(prevConvs => {
                const updated = prevConvs.map(conv => 
                  conv.id === conversationId 
                    ? { 
                        ...conv, 
                        last_message: latestNewMessage.content || latestNewMessage.file_name || 'Media',
                        last_message_at: latestNewMessage.created_at 
                      }
                    : conv
                );
                // Move updated conversation to top
                const updatedConv = updated.find(c => c.id === conversationId);
                if (updatedConv) {
                  const others = updated.filter(c => c.id !== conversationId);
                  const sortedOthers = others.sort((a, b) => {
                    const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
                    const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
                    return timeB - timeA;
                  });
                  return [updatedConv, ...sortedOthers];
                }
                return updated;
              });
              
              // Transform and add new messages
              const transformedNewMessages: ChatMessage[] = newMessages.map((msg: any) => ({
                id: msg.id,
                content: msg.content || '',
                createdAt: msg.created_at,
                user: {
                  id: msg.sender_id,
                  name: msg.sender?.name || 'Unknown',
                  avatar: msg.sender?.profile_pic_url || undefined,
                },
                conversationId: msg.conversation_id,
                senderId: msg.sender_id,
                messageType: msg.message_type || 'text',
                fileUrl: msg.file_url,
                fileName: msg.file_name,
              }));
              
              // Merge and sort
              const allMessages = [...prev, ...transformedNewMessages];
              return allMessages.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Error polling for messages:', err);
      } finally {
        isPolling = false;
      }
    }, 1000); // Poll every 1 second (reduced from 500ms to prevent excessive reloads)

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedConversation?.id, currentUserId]);

  // Note: Removed polling for all conversations to prevent constant reloading
  // The conversation list is updated when messages are received via real-time or polling

  // Search users
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

  const handleStartConversation = async (userId: string) => {
    if (!currentUserId) return;

    try {
      const { conversation, error } = await getOrCreateDirectConversation(
        currentUserId,
        userId
      );

      if (error) {
        console.error('Error creating conversation:', error);
        const errorMessage = error?.message || JSON.stringify(error) || 'Unknown error';
        alert(`Failed to start conversation: ${errorMessage}\n\nPlease make sure the database tables are set up correctly.`);
      } else if (conversation) {
        setSearchQuery("");
        setShowSearchResults(false);
        
        // Check if conversation already exists in the list and update/add it
        setConversations(prev => {
          // Remove any duplicates first (by conversation ID)
          const unique = prev.filter((conv, index, self) => 
            index === self.findIndex(c => c.id === conv.id)
          );
          
          // Check if this conversation already exists
          const existingIndex = unique.findIndex(c => c.id === conversation.id);
          
          if (existingIndex !== -1) {
            // Update existing conversation in place
            const updated = [...unique];
            updated[existingIndex] = conversation;
            return updated;
          } else {
            // Add new conversation at the top
            return [conversation, ...unique];
          }
        });
        
        setSelectedConversation(conversation);
      } else {
        alert('Failed to start conversation. No conversation was created.');
      }
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      const errorMessage = err?.message || JSON.stringify(err) || 'Unknown error';
      alert(`Failed to start conversation: ${errorMessage}`);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;

    const messageContent = newMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Create optimistic message immediately
    const optimisticMessage: ChatMessage = {
      id: tempMessageId,
      content: messageContent,
      createdAt: now,
      user: {
        id: currentUserId,
        name: 'You', // Will be replaced by real-time update
        avatar: undefined,
      },
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      messageType: 'text',
    };
    
    // Add message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Update the selected conversation's last_message immediately
    const updatedConversation = {
      ...selectedConversation,
      last_message: messageContent,
      last_message_at: now,
    };
    setSelectedConversation(updatedConversation);
    
    // Update conversation in the list immediately (no loading, no refresh)
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message: messageContent, last_message_at: now }
          : conv
      );
      // Move updated conversation to top
      const updatedConv = updated.find(c => c.id === selectedConversation.id);
      if (updatedConv) {
        return [updatedConv, ...updated.filter(c => c.id !== selectedConversation.id)];
      }
      return updated;
    });
    
    // Send message in background (no loading state, no UI blocking)
    // The optimistic message will be replaced by the real one via real-time subscription
    sendMessage(currentUserId, {
      conversation_id: selectedConversation.id,
      content: messageContent,
      message_type: 'text',
    }).then(({ error, message: sentMessage }) => {
      if (error) {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        // Revert conversation update
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id ? selectedConversation : conv
        ));
        setSelectedConversation(selectedConversation);
        alert('Failed to send message. Please try again.');
      } else if (sentMessage) {
        // If we got the message back, replace optimistic with real one immediately
        // (in case real-time is slow)
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessageId);
          // Check if real message already exists (from real-time)
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
      }
      // If no error and no message, real-time will handle it
    }).catch((err) => {
      console.error('Error sending message:', err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      // Revert conversation update
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id ? selectedConversation : conv
      ));
      setSelectedConversation(selectedConversation);
      alert('Failed to send message. Please try again.');
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversation || !currentUserId || uploading) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create optimistic message for images
      const messageType = file.type.startsWith('image/') ? 'image' :
                         file.type.startsWith('video/') ? 'video' :
                         file.type.startsWith('audio/') ? 'audio' : 'file';
      
      const tempMessageId = `temp-file-${Date.now()}`;
      const now = new Date().toISOString();
      
      // For images, show preview immediately
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
      
      // Upload file
      const { fileUrl, error: uploadError } = await uploadMessageFile(
        selectedConversation.id,
        currentUserId,
        file
      );

      if (uploadError || !fileUrl) {
        console.error('Error uploading file:', uploadError);
        // Remove optimistic message on error
        if (messageType === 'image') {
          setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        }
        
        // Show helpful error message
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

      // Remove optimistic message and send real one
      if (messageType === 'image') {
        setMessages(prev => prev.filter(m => m.id !== tempMessageId));
      }

      // Send message with file
      const { error: sendError } = await sendMessage(currentUserId, {
        conversation_id: selectedConversation.id,
        message_type: messageType,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      });

      if (sendError) {
        console.error('Error sending file message:', sendError);
        alert('Failed to send file. Please try again.');
      } else {
        const now = new Date().toISOString();
        const lastMessageText = messageType === 'image' ? '📷 Image' : 
                               messageType === 'video' ? '🎥 Video' :
                               messageType === 'audio' ? '🎵 Audio' : 
                               file.name || 'Media';
        const updatedConv = {
          ...selectedConversation,
          last_message: lastMessageText,
          last_message_at: now,
        };
        
        // Update the selected conversation immediately
        setSelectedConversation(updatedConv);
        
        // Update conversation in the list immediately (no loading, no refresh)
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, last_message: lastMessageText, last_message_at: now }
              : conv
          );
          // Move updated conversation to top
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
        
        // Scroll to bottom
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
  };

  // Get conversation display name
  const getConversationName = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    if (conv.type === 'direct' && conv.participants && conv.participants.length > 0) {
      const otherParticipant = conv.participants.find(
        (p: any) => p.user_id !== currentUserId
      );
      
      if (otherParticipant) {
        // If user data is already loaded, use it
        if (otherParticipant.user?.name) {
          return otherParticipant.user.name;
        }
        
        // Otherwise, try to fetch it (this will be async, so we'll show a fallback)
        // The profile should be loaded in getUserConversations, but if not, show partial ID
        if (otherParticipant.user_id) {
          return `User ${otherParticipant.user_id.substring(0, 8)}`;
        }
      }
    }
    return 'Conversation';
  };

  // Get conversation avatar
  const getConversationAvatar = (conv: Conversation): string | StaticImport => {
    if (conv.type === 'direct' && conv.participants && conv.participants.length > 0) {
      const otherParticipant = conv.participants.find(
        (p: any) => p.user_id !== currentUserId
      );
      
      // Return profile_pic_url if it exists and is not empty
      if (otherParticipant?.user?.profile_pic_url) {
        const picUrl = otherParticipant.user.profile_pic_url.trim();
        if (picUrl && picUrl !== 'null' && picUrl !== 'undefined' && picUrl !== '') {
          return picUrl;
        }
      }
    }
    return ProfileAvatar;
  };

  // Format time
  const formatTime = (dateString?: string): string => {
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
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const name = getConversationName(conv).toLowerCase();
    const lastMessage = (conv.last_message || '').toLowerCase();
    return name.includes(searchLower) || lastMessage.includes(searchLower);
  });

  // Determine if we should show header for message
  const shouldShowHeader = (message: ChatMessage, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId ||
           new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000; // 5 minutes
  };

  if (loading) {
    return (
      <div className='px-[7%] max-[900px]:px-3 text-white flex items-center justify-center min-h-screen'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-[7%] max-[900px]:px-3 text-white'>
      <div className='px-4 flex items-center justify-between max-[500px]:flex-col gap-2'>
        <TitleCard title='Chat' className='text-left' />
        <div className='relative w-[270px] max-[500px]:mx-auto'>
          <div className="relative">
            <Search size={18} className='absolute top-3 left-3 text-gray-400' />
          <GlobalInput
              placeholder='Search users or conversations...'
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

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim() && (
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

      <div className='flex h-[calc(100vh-190px)] max-[1024px]:h-[calc(100vh-160px)] max-[768px]:h-[calc(100vh-140px)] max-[500px]:h-[calc(100vh-190px)] my-3'>

        <div className={`w-[350px] max-[900px]:w-full border-black/15 border flex-col overflow-y-auto scrollbar-hide ${selectedConversation ? 'max-[900px]:hidden' : 'flex'}`}>
          {filteredConversations.length === 0 ? (
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
                  message={lastMessageText || 'No messages yet'}
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
              <div className='flex items-center gap-4 bg-[#2A2D3A] p-4 border-b border-gray-700'>
                <ArrowLeft 
                  onClick={() => setSelectedConversation(null)} 
                  className='cursor-pointer lg:hidden' 
                />
                <Image 
                  src={getConversationAvatar(selectedConversation)} 
                  alt={getConversationName(selectedConversation)} 
                  width={40} 
                  height={40} 
                  className='rounded-full object-cover'
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = ProfileAvatar.src || ProfileAvatar;
                  }}
                />
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
    </div>
  );
};

export default ChatPage;
