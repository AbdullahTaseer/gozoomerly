import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat';
import { useRealtimeInbox } from '@/hooks/use-realtime-inbox';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { useGlobalOnlineStatus } from '@/components/providers/OnlineStatusProvider';
import { useLastSeen } from '@/hooks/use-last-seen';
import type { ChatTab } from '@/components/filters/ChatFilters';
import { searchBoardsGlobal, type GlobalBoardSearchResult } from '@/lib/supabase/boards';
import {
  getUserConversations,
  getOrCreateBoardConversation,
  getConversationMessages,
  getMessageById,
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
  parseBoardIdFromGroupConversationName,
  isBoardLinkedChatConversation,
  isStandaloneGroupConversation,
  type Conversation,
  type MediaType,
  type Message,
} from '@/lib/supabase/chat';
import { rpcCreateGroupConversation } from '@/lib/supabase/groupChat';
import type { ChatMessageMedia } from '@/hooks/use-realtime-chat';
import { AuthService } from '@/lib/supabase/auth';
import { checkChatTablesSetup } from '@/lib/supabase/chat-diagnostics';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import toast from 'react-hot-toast';
import { useGetUserBoards } from '@/hooks/useGetUserBoards';

const authService = new AuthService();

function messageModelToChatMessage(msg: Message): ChatMessage {
  const senderName = msg.sender?.name || 'Unknown User';
  const senderAvatar = msg.sender?.profile_pic_url || undefined;

  let media: ChatMessageMedia[] | undefined;
  if (msg.media && Array.isArray(msg.media) && msg.media.length > 0) {
    media = msg.media.map((m) => ({
      id: m.id,
      mediaType: m.media_type,
      url: getMediaPublicUrl(m.bucket, m.path),
      filename: m.filename,
      mimeType: m.mime_type,
      sizeBytes: m.size_bytes,
      orderIndex: m.order_index,
    }));
  }

  const fileUrl = msg.file_url || (media && media.length > 0 ? media[0].url : undefined);
  const fileName = msg.file_name || (media && media.length > 0 ? media[0].filename : undefined);

  let messageType: ChatMessage['messageType'] = msg.message_type || 'text';
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
    fileSize: msg.file_size,
    fileType: msg.file_type,
    media,
  };
}

export const useChat = () => {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  /** True while opening a new direct chat before `getConversation` fills participant profiles (avoids "Unknown User" flash). */
  const [directPeerProfileLoading, setDirectPeerProfileLoading] = useState(false);
  /** True while the initial `getConversationMessages` fetch runs for the selected thread (keeps header skeleton until messages are ready). */
  const [threadMessagesLoading, setThreadMessagesLoading] = useState(false);

  const setSelectedConversationFromUi = useCallback((conv: Conversation | null) => {
    setDirectPeerProfileLoading(false);
    setSelectedConversation(conv);
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  /** True while loading `get_user_conversations` with `p_conversation_type: group` for the Group Chats tab */
  const [groupListLoading, setGroupListLoading] = useState(false);
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
  const [boardSearchResults, setBoardSearchResults] = useState<GlobalBoardSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  /** True while debounce timer is pending — keeps spinner without sync-flipping on each key (mobile keyboards). */
  const [searchDebouncing, setSearchDebouncing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<ChatTab>('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  /** Latest query for debounced search — avoids applying stale API results after the user keeps typing. */
  const latestSearchQueryRef = useRef('');
  /** Bumped when a new search run supersedes in-flight work so only the latest fetch clears `searching`. */
  const searchGenerationRef = useRef(0);
  const isSettingProgrammaticallyRef = useRef(false);
  const selectedConversationRef = useRef<Conversation | null>(null);
  selectedConversationRef.current = selectedConversation;
  /**
   * Latest `conversations` snapshot — read inside realtime handlers so the
   * callback identity doesn't churn on every list update (which would
   * needlessly re-subscribe the realtime channel).
   */
  const conversationsRef = useRef<Conversation[]>([]);
  conversationsRef.current = conversations;
  /**
   * Latest `messages` snapshot — read inside visibility handlers to pick up
   * the newest message id without re-registering the listener on every
   * message (which would thrash event-listener registration).
   */
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  /**
   * Timestamps (ms) of the last time we called `markConversationAsRead` per conversation.
   * Used to ignore stale server `unread_count` values returned by the silent poll before
   * the server has finished processing the read ack (otherwise the badge flickers back).
   */
  const recentlyReadRef = useRef<Record<string, number>>({});
  const READ_ACK_GRACE_MS = 8000;

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

  const loadConversations = useCallback(
    async (userId: string, opts?: { silent?: boolean }) => {
      const silent = opts?.silent === true;
      try {
        if (!silent) setLoading(true);
        const { conversations: convs, error } = await getUserConversations(userId);
        if (error) {
          if (!silent) {
            const diagnostics = await checkChatTablesSetup();
            if (!diagnostics.tablesExist) {
              toast.error(
                'Chat tables are not set up correctly. Please run the SQL setup script in your Supabase dashboard.'
              );
            }
          }
        } else {
          let uniqueConversations = (convs || []).filter((conv, index, self) =>
            index === self.findIndex((c) => c.id === conv.id)
          );

          if (currentUserId) {
            const seenPairs = new Set<string>();
            uniqueConversations = uniqueConversations.filter((conv) => {
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

          if (silent) {
            // Silent refresh: merge with existing state instead of replacing, so
            // locally-optimistic fields (e.g. freshly-bumped last_message) don't flicker
            // back. We still trust the server's `unread_count` in almost every case —
            // except during a short grace window right after `markConversationAsRead`
            // fires, where the server RPC may still return the pre-read count.
            setConversations((prev) => {
              if (prev.length === 0) return uniqueConversations;
              const byId = new Map(prev.map((c) => [c.id, c]));
              const now = Date.now();
              for (const incoming of uniqueConversations) {
                const existing = byId.get(incoming.id);
                if (!existing) {
                  byId.set(incoming.id, incoming);
                  continue;
                }
                // Prefer whichever side has the newer last_message_at for metadata.
                const ta = existing.last_message_at
                  ? new Date(existing.last_message_at).getTime()
                  : 0;
                const tb = incoming.last_message_at
                  ? new Date(incoming.last_message_at).getTime()
                  : 0;
                const newer = tb >= ta ? incoming : existing;

                // Unread count resolution:
                //   1. Currently selected thread → always 0 (user is reading it).
                //   2. Thread we just marked read within grace window → prefer local 0
                //      so a stale server response doesn't resurrect the badge.
                //   3. Otherwise → trust the server.
                const isSelected = selectedConversationRef.current?.id === incoming.id;
                const lastReadAt = recentlyReadRef.current[incoming.id];
                const withinReadGrace =
                  !!lastReadAt && now - lastReadAt < READ_ACK_GRACE_MS;
                const serverUnread = incoming.unread_count ?? 0;
                const unread = isSelected
                  ? 0
                  : withinReadGrace
                    ? Math.min(existing.unread_count ?? 0, serverUnread)
                    : serverUnread;

                byId.set(incoming.id, {
                  ...existing,
                  ...newer,
                  unread_count: unread,
                });
              }
              return Array.from(byId.values()).sort((a, b) => {
                const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
                const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
                return tb - ta;
              });
            });
          } else {
            setConversations(uniqueConversations);
          }
        }
      } catch (err) {
        /* ignore */
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [currentUserId]
  );

  /** Group Chats tab: dedicated RPC list (p_conversation_type: group, limit 20). Merges into `conversations`. */
  const loadGroupChatsFromApi = useCallback(async () => {
    if (!currentUserId) return;
    setGroupListLoading(true);
    try {
      const { conversations: groupRows, error } = await getUserConversations(currentUserId, 20, 0, {
        conversationType: 'group',
      });
      if (error) return;
      const incoming = (groupRows || []).filter((c) => isStandaloneGroupConversation(c));
      setConversations((prev) => {
        const rest = prev.filter((c) => !isStandaloneGroupConversation(c));
        const byId = new Map<string, Conversation>();
        rest.forEach((c) => byId.set(c.id, c));
        incoming.forEach((c) => byId.set(c.id, c));
        return Array.from(byId.values()).sort((a, b) => {
          const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return tb - ta;
        });
      });
    } finally {
      setGroupListLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedTab !== 'Group Chats' || !currentUserId) return;
    loadGroupChatsFromApi();
  }, [selectedTab, currentUserId, loadGroupChatsFromApi]);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    setThreadMessagesLoading(true);
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
            type ProfileRow = { id: string; name: string | null; profile_pic_url: string | null };
            const profileMap = new Map<string, ProfileRow>(
              profilesData.map((p: ProfileRow) => [p.id, p])
            );
            messagesNeedingProfiles.forEach((msg: { id: string; senderId: string }) => {
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
        if (selectedConversationRef.current?.id !== conversationId) {
          return;
        }
        setMessages(chatMessages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
    } finally {
      if (selectedConversationRef.current?.id === conversationId) {
        setThreadMessagesLoading(false);
      }
    }
  }, [currentUserId]);

  // Only re-fetch the thread when the *conversation id* changes. Updating `last_message` / etc.
  // on the same chat used to re-run this effect and replace `messages` from the server, which
  // masked broken realtime and caused “I only see their messages after I send or reload.”
  const selectedConversationId = selectedConversation?.id;
  useEffect(() => {
    if (selectedConversationId && currentUserId) {
      const conv = selectedConversationRef.current;
      if (!conv || conv.id !== selectedConversationId) {
        return;
      }

      localStorage.setItem('selectedConversationId', selectedConversationId);

      const needsFullConversation =
        conv.type === 'direct' &&
        (!conv.participants ||
          conv.participants.length === 0 ||
          !conv.participants.some((p: any) => p.user?.name));

      setMessages([]);
      void loadMessages(selectedConversationId);

      // WhatsApp-like: opening the thread clears its unread count. We update
      // the UI optimistically first and then tell the server, passing the
      // `last_message_id` we already know so the read pointer is recorded
      // against a specific message (useful for other devices / reporting).
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId ? { ...c, unread_count: 0 } : c
        )
      );
      recentlyReadRef.current[selectedConversationId] = Date.now();

      markConversationAsRead(
        selectedConversationId,
        currentUserId,
        conv.last_message_id || undefined
      ).catch(() => {});

      if (needsFullConversation) {
        getConversation(selectedConversationId, currentUserId)
          .then(({ conversation: fullConv, error }) => {
            if (!error && fullConv) {
              setSelectedConversation((prev) =>
                prev
                  ? {
                      ...fullConv,
                      last_message: fullConv.last_message || prev.last_message,
                      last_message_at: fullConv.last_message_at || prev.last_message_at,
                      last_message_id: fullConv.last_message_id || prev.last_message_id,
                      last_message_sender_id:
                        fullConv.last_message_sender_id || prev.last_message_sender_id,
                    }
                  : fullConv
              );
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === fullConv.id
                    ? {
                        ...fullConv,
                        last_message: fullConv.last_message || conv.last_message,
                        last_message_at: fullConv.last_message_at || conv.last_message_at,
                        last_message_id: fullConv.last_message_id || conv.last_message_id,
                        last_message_sender_id:
                          fullConv.last_message_sender_id || conv.last_message_sender_id,
                      }
                    : conv
                )
              );
            }
          })
          .catch(() => {});
      }
    } else {
      localStorage.removeItem('selectedConversationId');
      setThreadMessagesLoading(false);
    }
  }, [selectedConversationId, currentUserId, loadMessages]);

  useEffect(() => {
    if (!selectedConversation) return;
    const isDirect = selectedConversation.type === 'direct';
    const isGroupOnly = isStandaloneGroupConversation(selectedConversation);
    const isBoard = isBoardLinkedChatConversation(selectedConversation);

    const keepSelected =
      selectedTab === 'All'
        ? isDirect || isGroupOnly || isBoard
        : selectedTab === 'One-to-One'
          ? isDirect
          : selectedTab === 'Group Chats'
            ? isGroupOnly
            : selectedTab === 'Board Chats'
              ? isBoard
              : false;

    if (!keepSelected) {
      setSelectedConversation(null);
    }
  }, [selectedTab, selectedConversation]);

  // Only load boards for tabs that show "Your boards" (not Group Chats — that uses chat RPCs only).
  useEffect(() => {
    if (
      (selectedTab === 'Board Chats' || selectedTab === 'All') &&
      currentUserId &&
      fetchUserBoardsRef.current
    ) {
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

  const boardTitleById = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of boards as { id?: string; title?: string }[]) {
      if (b?.id && b.title != null && String(b.title).trim() !== '') {
        m.set(String(b.id), String(b.title).trim());
      }
    }
    return m;
  }, [boards]);

  const [resolvedBoardTitles, setResolvedBoardTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUserId) return;
    const missing = new Set<string>();
    for (const conv of conversations) {
      let bid: string | null = null;
      if (conv.type === 'board') {
        bid =
          conv.board_id ||
          (conv.name ? parseBoardIdFromGroupConversationName(conv.name) : null);
      } else if (conv.type === 'group' && conv.name) {
        bid = parseBoardIdFromGroupConversationName(conv.name);
      }
      if (!bid) continue;
      if (boardTitleById.has(bid) || resolvedBoardTitles[bid]) continue;
      missing.add(bid);
    }
    if (missing.size === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data, error } = await supabase
          .from('boards')
          .select('id, title')
          .in('id', [...missing]);
        if (cancelled || error || !data?.length) return;
        setResolvedBoardTitles((prev) => {
          const next = { ...prev };
          for (const row of data) {
            const id = (row as { id?: string }).id;
            const title = (row as { title?: string }).title;
            if (id && title != null && String(title).trim() !== '') {
              next[id] = String(title).trim();
            }
          }
          return next;
        });
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversations, currentUserId, boardTitleById, resolvedBoardTitles]);

  /**
   * Central router for every incoming realtime message — covers both the
   * currently-open thread and every other conversation the user participates
   * in (since the inbox channel is user-scoped, not conversation-scoped).
   *
   * Responsibilities, in order:
   *   1. If the message is for the open thread → dedup + append to `messages`
   *      and scroll. Also ack read.
   *   2. Update the conversations list preview (last message, reorder,
   *      unread bump) — but only for threads that aren't open.
   *   3. If the conversation is unknown (first-ever DM from a stranger, just
   *      added to a group), fetch it via `getConversation` and inject it so
   *      it shows up without waiting for any poll.
   */
  const handleMessageReceived = useCallback((message: ChatMessage) => {
    const selected = selectedConversationRef.current;
    const isOpenThread = !!selected && selected.id === message.conversationId;
    const isOwn = message.senderId === currentUserId;
    const isIncoming = !isOwn;

    // WhatsApp-like read semantics: the message only counts as "read" if the
    // thread is open AND the tab is actually visible. A backgrounded tab (phone
    // locked, switched to another app, chat in a non-focused tab) must let the
    // unread counter keep growing — the server's `update_conversation_unread_count`
    // trigger has already incremented it, and we mirror that locally.
    const tabVisible =
      typeof document === 'undefined' || document.visibilityState === 'visible';
    const isEffectivelyRead = isOpenThread && tabVisible;

    if (isOpenThread) {
      setMessages(prev => {
        const filtered = prev.filter(m => {
          // Replace our own optimistic `temp-...` echo with the real row.
          if (
            m.id.startsWith('temp-') &&
            m.senderId === currentUserId &&
            m.senderId === message.senderId &&
            m.content === message.content &&
            Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000
          ) {
            return false;
          }
          if (m.id === message.id) return false;
          return true;
        });
        const updated = [...filtered, message];
        return updated.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      if (isIncoming && currentUserId && isEffectivelyRead) {
        recentlyReadRef.current[selected!.id] = Date.now();
        markConversationAsRead(selected!.id, currentUserId, message.id).catch(() => {});
      }
    }

    const known = conversationsRef.current.some(c => c.id === message.conversationId);

    if (known) {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === message.conversationId
            ? {
                ...conv,
                last_message: message.content || message.fileName || 'Media',
                last_message_at: message.createdAt,
                last_message_id: message.id,
                last_message_sender_id: message.senderId,
                unread_count: isEffectivelyRead
                  ? 0
                  : isIncoming
                    ? (conv.unread_count ?? 0) + 1
                    : conv.unread_count ?? 0,
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

      if (isOpenThread) {
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
      }
    } else if (currentUserId) {
      // Unknown conversation: realtime delivered a row for a thread we've
      // never fetched. Pull the full conversation so the sidebar shows it
      // with the right name / avatar / participants — no polling needed.
      getConversation(message.conversationId, currentUserId)
        .then(({ conversation, error }) => {
          if (error || !conversation) return;
          const hydrated: Conversation = {
            ...conversation,
            last_message: message.content || message.fileName || 'Media',
            last_message_at: message.createdAt,
            last_message_id: message.id,
            last_message_sender_id: message.senderId,
            unread_count: isIncoming ? 1 : 0,
          };
          setConversations(prev => {
            if (prev.some(c => c.id === hydrated.id)) {
              return prev.map(c => (c.id === hydrated.id ? hydrated : c));
            }
            return [hydrated, ...prev];
          });
        })
        .catch(() => {});
    }
  }, [currentUserId]);

  const handleMessageUpdated = useCallback((message: ChatMessage) => {
    setMessages(prev =>
      prev.map(msg => msg.id === message.id ? message : msg)
    );
  }, []);

  const handleMessageDeleted = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  /**
   * Single gap-closer: runs once every time the realtime channel (re)connects.
   * Replaces the old 5s + 3.5s polling pair. If the socket stayed healthy the
   * whole time this is a no-op because the inbox already delivered every row;
   * if the socket was dropped (mobile sleep / network blip) this catches the
   * gap in one silent fetch.
   */
  const handleRealtimeResume = useCallback(() => {
    if (!currentUserId) return;
    void loadConversations(currentUserId, { silent: true });

    const openId = selectedConversationRef.current?.id;
    if (!openId) return;

    // Merge any messages the socket may have missed for the open thread,
    // without replacing what's already there (optimistic / hydrated rows stay).
    (async () => {
      try {
        const { messages: remote, error } = await getConversationMessages(
          openId,
          currentUserId,
          100
        );
        if (error || !remote?.length) return;
        if (selectedConversationRef.current?.id !== openId) return;

        setMessages((prev) => {
          const byId = new Map(prev.map((m) => [m.id, m]));
          let changed = false;
          for (const m of remote) {
            if (!byId.has(m.id)) {
              byId.set(m.id, messageModelToChatMessage(m));
              changed = true;
            }
          }
          if (!changed) return prev;
          return Array.from(byId.values()).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      } catch {
        /* ignore */
      }
    })();
  }, [currentUserId, loadConversations]);

  /**
   * Two realtime sources, different responsibilities:
   *
   *   1) `useRealtimeChat` — per-conversation, scoped to the currently-open
   *      thread. Tight `conversation_id=eq.` filter on `messages` for
   *      INSERT/UPDATE/DELETE plus a broadcast channel for instant
   *      peer-to-peer echo. Drives the *open thread* — appending new bubbles,
   *      editing, deleting.
   *
   *   2) `useRealtimeInbox` — user-scoped. Listens to any of:
   *        a) `conversation_participants` UPDATE (`user_id=eq.<me>`)
   *        b) `conversation_participants` INSERT (`user_id=eq.<me>`)
   *        c) `messages` INSERT (no filter, RLS-gated)
   *      Any one of them firing triggers a single debounced
   *      `get_user_conversations` refresh. The three sources are
   *      belt-and-suspenders: whichever the Supabase Realtime publication
   *      actually delivers for this project will keep the sidebar live.
   *      Drives the *sidebar* — unread badges, last-message preview, order.
   */
  const { isConnected, error: realtimeError, broadcastNewMessage } = useRealtimeChat({
    conversationId: selectedConversation?.id || null,
    currentUserId,
    onMessageReceived: handleMessageReceived,
    onMessageUpdated: handleMessageUpdated,
    onMessageDeleted: handleMessageDeleted,
    enabled: !!selectedConversation && !!currentUserId,
  });

  /**
   * Timestamp of the last realtime event. Used by the safety poll below
   * to skip itself when realtime is actively keeping the list fresh.
   */
  const lastRealtimeEventAtRef = useRef<number>(0);

  /**
   * Any realtime event that could affect the conversation list triggers
   * an immediate `get_user_conversations` refresh.
   */
  const handleInboxEvent = useCallback(
    (reason: string) => {
      if (!currentUserId) return;
      lastRealtimeEventAtRef.current = Date.now();
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log(`[chat] loadConversations() fired by realtime (${reason})`);
      }
      void loadConversations(currentUserId, { silent: true });
    },
    [currentUserId, loadConversations]
  );

  useRealtimeInbox({
    currentUserId,
    onRealtimeEvent: handleInboxEvent,
    onResume: handleRealtimeResume,
    enabled: !!currentUserId,
  });

  /**
   * Safety-net poll.
   *
   * Supabase Realtime's `postgres_changes` only delivers events for tables
   * that are enabled in the `supabase_realtime` publication AND have RLS
   * policies simple enough for Realtime to evaluate. We can't guarantee
   * either from the frontend, so this acts as a backstop:
   *
   *   - Runs only when the tab is visible (no wasted requests in the
   *     background).
   *   - Skips itself if realtime fired within the last 8 s — if events
   *     are flowing, this is a no-op and costs nothing.
   *   - Fires every 10 s (adjust below if you want tighter coverage).
   *
   * Once you confirm realtime is delivering events (console shows
   * `[inbox] realtime event →` lines), you can safely raise `POLL_MS` to
   * 30000 or higher — it'll almost never actually refetch.
   */
  const POLL_MS = 3_000;
  const REALTIME_SKIP_WINDOW_MS = 2_500;

  useEffect(() => {
    if (!currentUserId) return;
    if (typeof window === 'undefined') return;
    const userId = currentUserId;

    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      const sinceLast = Date.now() - lastRealtimeEventAtRef.current;
      if (sinceLast < REALTIME_SKIP_WINDOW_MS) return;
      void loadConversations(userId, { silent: true });
    };

    const interval = window.setInterval(tick, POLL_MS);

    // Also run a single refresh on tab return / network recovery so users
    // don't wait the full poll interval after waking up.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    window.addEventListener('online', tick);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('online', tick);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [currentUserId, loadConversations]);

  /**
   * WhatsApp-style "returned to the app" read flush.
   *
   * When the user was backgrounded with a thread open, any incoming messages
   * kept incrementing `unread_count` (see the visibility check in
   * `handleMessageReceived`). As soon as the tab becomes visible again and the
   * same thread is still selected, those messages are effectively read — so
   * we reset the counter locally and on the server in one shot, using the
   * latest message id we already have as the read pointer.
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const flushReadOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      const openId = selectedConversationRef.current?.id;
      if (!openId || !currentUserId) return;

      const currentUnread =
        conversationsRef.current.find((c) => c.id === openId)?.unread_count ?? 0;
      if (currentUnread === 0) return;

      setConversations((prev) =>
        prev.map((c) => (c.id === openId ? { ...c, unread_count: 0 } : c))
      );
      recentlyReadRef.current[openId] = Date.now();

      const lastMsg = messagesRef.current[messagesRef.current.length - 1];
      markConversationAsRead(
        openId,
        currentUserId,
        lastMsg?.id || selectedConversationRef.current?.last_message_id || undefined
      ).catch(() => {});
    };

    document.addEventListener('visibilitychange', flushReadOnReturn);
    window.addEventListener('focus', flushReadOnReturn);
    return () => {
      document.removeEventListener('visibilitychange', flushReadOnReturn);
      window.removeEventListener('focus', flushReadOnReturn);
    };
  }, [currentUserId]);

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
    latestSearchQueryRef.current = searchQuery;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim() || !currentUserId) {
      searchGenerationRef.current += 1;
      setSearchResults([]);
      setBoardSearchResults([]);
      setShowSearchResults(false);
      setSearching(false);
      setSearchDebouncing(false);
      return;
    }

    setSearchDebouncing(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const q = latestSearchQueryRef.current.trim();
      if (!q || !currentUserId) {
        setSearching(false);
        setSearchDebouncing(false);
        return;
      }

      searchGenerationRef.current += 1;
      const runGen = searchGenerationRef.current;

      setSearchDebouncing(false);
      setSearching(true);
      try {
        const [{ users, error: userErr }, { boards, error: boardErr }] = await Promise.all([
          searchUsers(q, currentUserId),
          searchBoardsGlobal(q, { limit: 20, offset: 0 }),
        ]);

        if (latestSearchQueryRef.current.trim() !== q || runGen !== searchGenerationRef.current) {
          return;
        }

        if (!userErr) {
          setSearchResults(users || []);
        } else {
          setSearchResults([]);
        }
        if (!boardErr) {
          setBoardSearchResults(boards || []);
        } else {
          setBoardSearchResults([]);
        }
        setShowSearchResults(true);
      } finally {
        if (runGen === searchGenerationRef.current) {
          setSearching(false);
        }
      }
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
        setDirectPeerProfileLoading(false);
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

      setDirectPeerProfileLoading(true);
      setSelectedConversation(newConversation);

      getConversation(newConversation.id, currentUserId)
        .then(({ conversation: fullConversation, error: fetchError }) => {
          if (!fetchError && fullConversation) {
            setSelectedConversation(prev =>
              prev && prev.id === fullConversation.id
                ? {
                    ...fullConversation,
                    last_message: fullConversation.last_message || prev.last_message,
                    last_message_at: fullConversation.last_message_at || prev.last_message_at,
                    last_message_id: fullConversation.last_message_id || prev.last_message_id,
                    last_message_sender_id:
                      fullConversation.last_message_sender_id || prev.last_message_sender_id,
                  }
                : prev
            );
            setConversations(prev =>
              prev.map(conv =>
                conv.id === fullConversation.id
                  ? {
                      ...fullConversation,
                      last_message: fullConversation.last_message || conv.last_message,
                      last_message_at: fullConversation.last_message_at || conv.last_message_at,
                      last_message_id: fullConversation.last_message_id || conv.last_message_id,
                      last_message_sender_id:
                        fullConversation.last_message_sender_id || conv.last_message_sender_id,
                    }
                  : conv
              )
            );
          }
        })
        .catch(() => {})
        .finally(() => {
          setDirectPeerProfileLoading(false);
        });

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

  const handleCreateGroupConversation = useCallback(
    async (name: string, participantIds: string[], policy: 'admins_only' | 'all_members') => {
      if (!currentUserId) return;
      const { data, error } = await rpcCreateGroupConversation({
        creatorId: currentUserId,
        name,
        participantIds,
        groupInvitePolicy: policy,
      });
      if (error || !data?.conversation_id) {
        const msg = error?.message || 'Could not create group';
        toast.error(msg);
        throw new Error(msg);
      }
      await loadConversations(currentUserId);
      const { conversation, error: fetchError } = await getConversation(data.conversation_id, currentUserId);
      if (!fetchError && conversation) {
        setSelectedConversation(conversation);
        toast.success('Group created');
      }
    },
    [currentUserId, loadConversations]
  );

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

          // Unlike the text path, media sends don't add an optimistic `temp-…`
          // row to `messages` (the draft previews live in `draftMedia` until
          // the RPC returns). So the sender's own thread would stay empty
          // until `postgres_changes` delivers the INSERT — if that event is
          // even slightly delayed or missed, the photo/video appears to "not
          // send" from the sender's POV. Fix: hydrate the real row right now,
          // drop it into local state, then broadcast. The realtime INSERT
          // still fires later; `handleMessageReceived` dedups by `id`.
          const { message: fetchedMsg, error: fetchMsgErr } = await getMessageById(
            rpcResult.message_id,
            currentUserId
          );
          if (!fetchMsgErr && fetchedMsg) {
            const hydrated = messageModelToChatMessage(fetchedMsg);

            if (selectedConversationRef.current?.id === selectedConversation.id) {
              setMessages(prev => {
                if (prev.some(m => m.id === hydrated.id)) return prev;
                return [...prev, hydrated].sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
              });
            }

            broadcastNewMessage(hydrated);
          }

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

        broadcastNewMessage(realMessage);

        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessageId);
          if (!filtered.some(m => m.id === sentMessage.id)) {
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
  }, [newMessage, selectedConversation, currentUserId, draftMedia, messages, broadcastNewMessage]);

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

  const getConversationName = useCallback(
    (conv: Conversation): string => {
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

      if (conv.type === 'board') {
        const bid =
          conv.board_id ||
          (conv.name ? parseBoardIdFromGroupConversationName(conv.name) : null);
        if (bid) {
          const fromUserBoards = boardTitleById.get(bid);
          if (fromUserBoards) return fromUserBoards;
          const fetched = resolvedBoardTitles[bid];
          if (fetched) return fetched;
        }
        return conv.name?.trim() || 'Board chat';
      }

      if (conv.type === 'group' && conv.name) {
        const boardId = parseBoardIdFromGroupConversationName(conv.name);
        if (boardId) {
          const fromUserBoards = boardTitleById.get(boardId);
          if (fromUserBoards) return fromUserBoards;
          const fetched = resolvedBoardTitles[boardId];
          if (fetched) return fetched;
          return 'Board chat';
        }
      }

      if (conv.name) return conv.name;

      return 'Conversation';
    },
    [currentUserId, boardTitleById, resolvedBoardTitles]
  );

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

  const matchesSearch = useCallback(
    (conv: Conversation) =>
      !searchQuery ||
      getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.last_message || 'Media').toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery, getConversationName]
  );

  const directConversations = conversations.filter(
    (conv) =>
      conv.type === 'direct' &&
      (conv.last_message_at || conv.last_message) &&
      matchesSearch(conv)
  );

  const groupConversations = conversations.filter((conv) => {
    if (!isStandaloneGroupConversation(conv) || !matchesSearch(conv)) return false;
    if (selectedTab === 'Group Chats') return true;
    return !!(conv.last_message_at || conv.last_message);
  });

  const boardChatConversations = conversations.filter(
    (conv) =>
      isBoardLinkedChatConversation(conv) &&
      (conv.last_message_at || conv.last_message) &&
      matchesSearch(conv)
  );

  const filteredConversations = conversations.filter((conv) => {
    if (selectedConversation && conv.id === selectedConversation.id) return true;
    if (selectedTab === 'All') {
      return (
        directConversations.includes(conv) ||
        groupConversations.includes(conv) ||
        boardChatConversations.includes(conv)
      );
    }
    if (selectedTab === 'One-to-One') return directConversations.includes(conv);
    if (selectedTab === 'Group Chats') return groupConversations.includes(conv);
    if (selectedTab === 'Board Chats') return boardChatConversations.includes(conv);
    return false;
  });

  const shouldShowHeader = useCallback((message: ChatMessage, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId ||
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000; 
  }, [messages]);

  const chatHeaderLoading = useMemo(() => {
    if (!selectedConversation) return false;
    const peerPending =
      selectedConversation.type === 'direct' && directPeerProfileLoading;
    return peerPending || threadMessagesLoading;
  }, [selectedConversation, directPeerProfileLoading, threadMessagesLoading]);

  /**
   * Global unread-message count across every conversation the user is in.
   * Use this for a nav badge / browser tab title. Derived from the same
   * `conversations` state the sidebar renders, so it updates live whenever
   * the realtime inbox bumps a per-conversation counter or
   * `markConversationAsRead` resets one.
   */
  const totalUnreadCount = useMemo(
    () =>
      conversations.reduce(
        (sum, c) => sum + (typeof c.unread_count === 'number' ? c.unread_count : 0),
        0
      ),
    [conversations]
  );

  return {
    loading,
    groupListLoading,
    messages,
    isTyping,
    searching: searching || searchDebouncing,
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
    boardSearchResults,
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
    boardChatConversations,
    refetchConversations: loadConversations,
    handleStartConversation,
    handleStartBoardConversation,
    handleCreateGroupConversation,
    setSelectedConversation: setSelectedConversationFromUi,
    chatHeaderLoading,
    getLastMessageWithSender,
    setNewMessage: handleNewMessageChange,
    totalUnreadCount,
  };
};

