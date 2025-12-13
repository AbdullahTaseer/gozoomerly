"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthService } from "@/lib/supabase/auth";
import { 
  getOrCreateBoardConversation, 
  getConversationMessages, 
  sendMessage as sendChatMessage,
  markConversationAsRead 
} from "@/lib/supabase/chat";
import { useRealtimeChat, ChatMessage } from "@/hooks/use-realtime-chat";
import staticProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import ImageWithFallback from "@/components/images/ImageWithFallback";

const authService = new AuthService();

interface BoardSlugChatDesignProps {
  boardId: string;
  boardName: string;
}

const BoardSlugChatDesign = ({ boardId, boardName }: BoardSlugChatDesignProps) => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get current user
  useEffect(() => {
    async function getCurrentUser() {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setCurrentUserId(user.id);
    }
    getCurrentUser();
  }, [router]);

  // Get or create board conversation
  useEffect(() => {
    async function loadConversation() {
      if (!currentUserId || !boardId) return;

      try {
        setLoading(true);
        const { conversation: conv, error } = await getOrCreateBoardConversation(
          boardId,
          boardName,
          currentUserId
        );

        if (error) {
          console.error('Error loading board conversation:', error);
          setLoading(false);
          return;
        }

        if (conv) {
          setConversation(conv);
          await loadMessages(conv.id);
          await markConversationAsRead(conv.id, currentUserId);
        }
      } catch (err) {
        console.error('Error in loadConversation:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [currentUserId, boardId, boardName]);

  // Load messages
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
        return;
      }

      // Transform messages to ChatMessage format
      const chatMessages: ChatMessage[] = (msgs || []).map((msg: any) => {
        const senderName = msg.sender?.name || 'Unknown';
        const senderAvatar = msg.sender?.profile_pic_url || staticProfileAvatar;
        
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

      setMessages(chatMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Handle new message received via real-time
  const handleMessageReceived = (message: ChatMessage) => {
    setMessages(prev => {
      // Check if message already exists (avoid duplicates)
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  };

  // Handle message updated
  const handleMessageUpdated = (message: ChatMessage) => {
    setMessages(prev => 
      prev.map(m => m.id === message.id ? message : m)
    );
  };

  // Handle message deleted
  const handleMessageDeleted = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  // Real-time subscription
  const { isConnected, error: realtimeError } = useRealtimeChat({
    conversationId: conversation?.id || null,
    currentUserId,
    onMessageReceived: handleMessageReceived,
    onMessageUpdated: handleMessageUpdated,
    onMessageDeleted: handleMessageDeleted,
    enabled: !!conversation && !!currentUserId,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!newMessage.trim() || !conversation || !currentUserId || sending) return;

    try {
      setSending(true);
      const { message, error } = await sendChatMessage(currentUserId, {
        conversation_id: conversation.id,
        content: newMessage.trim(),
        message_type: 'text',
      });

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        return;
      }

      // Clear input
      setNewMessage("");

      // The message will be added via real-time subscription, but we can also add it optimistically
      if (message) {
        const chatMessage: ChatMessage = {
          id: message.id,
          content: message.content || '',
          createdAt: message.created_at,
          user: {
            id: message.sender_id,
            name: message.sender?.name || 'You',
            avatar: message.sender?.profile_pic_url || staticProfileAvatar,
          },
          conversationId: message.conversation_id,
          senderId: message.sender_id,
          messageType: message.message_type || 'text',
          fileUrl: message.file_url,
          fileName: message.file_name,
        };

        setMessages(prev => {
          if (prev.some(m => m.id === chatMessage.id)) {
            return prev;
          }
          return [...prev, chatMessage];
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '';
    }
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    msgs.forEach(msg => {
      const date = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Failed to load conversation</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);
  const dateKeys = Object.keys(messageGroups);

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center overflow-hidden">
      {dateKeys.length > 0 && (
      <div className="py-4">
          <span className="px-4 py-1 text-sm bg-neutral-900 text-white rounded-full">
            {dateKeys[0]}
          </span>
      </div>
      )}

      <div 
        ref={messagesContainerRef}
        className="flex-1 w-full max-w-4xl overflow-y-auto px-6 space-y-10"
      >
        {dateKeys.map((dateKey) => (
          <div key={dateKey}>
            {messageGroups[dateKey].map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showTime = index === messageGroups[dateKey].length - 1 ||
                messageGroups[dateKey][index + 1]?.senderId !== message.senderId;

              return (
                <div key={message.id} className="mb-4">
                  {isCurrentUser ? (
                    <div className="flex justify-end items-end gap-2">
                      <div className="flex flex-col items-end">
          <div className="max-w-sm bg-neutral-900 text-white px-4 py-3 rounded-xl">
                          {message.content}
          </div>
                        {showTime && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(message.createdAt)}
                          </p>
                        )}
        </div>
                      <ImageWithFallback
                        src={message.user.avatar || staticProfileAvatar}
                        alt={message.user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        fallbackSrc={staticProfileAvatar}
                      />
            </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <ImageWithFallback
                        src={message.user.avatar || staticProfileAvatar}
                        alt={message.user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        fallbackSrc={staticProfileAvatar}
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold mb-1">{message.user.name}</p>
                        <div className="bg-gray-100 px-4 py-3 rounded-xl max-w-sm">
                          {message.content}
            </div>
                        {showTime && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(message.createdAt)}
                          </p>
                        )}
          </div>
        </div>
                  )}
          </div>
              );
            })}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="w-full border-t bg-[#F7F7F7] p-4 flex items-center gap-3">
        <button className="w-10 h-10 shrink-0 bg-white flex items-center cursor-pointer justify-center rounded-full text-lg hover:bg-gray-100 transition-colors">
          <Plus />
        </button>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write your message.."
          className="flex-1 bg-white rounded-full px-4 py-3 outline-0"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="rounded-full shrink-0 bg-white w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>

      {realtimeError && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm">
          Real-time connection error. Messages may not update in real-time.
        </div>
      )}
    </div>
  );
};

export default BoardSlugChatDesign;
