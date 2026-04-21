import { createClient } from './client';
import { STORAGE_BUCKETS } from './storageBuckets';
import { notifyChatMessageRecipients } from '@/lib/notifications/chat';

function safeLastMessage(lastMessage: any): string | undefined {
  if (!lastMessage) return undefined;

  if (typeof lastMessage === 'string') return lastMessage;

  if (typeof lastMessage === 'object') {
    return lastMessage.content || lastMessage.text || undefined;
  }

  return undefined;
}

function extractOtherUser(
  participants: any[] | undefined,
  currentUserId: string
): { id: string; name: string; profile_pic_url?: string } | undefined {
  if (!participants || participants.length === 0) return undefined;

  const otherParticipant = participants.find(
    (p: any) => p.user_id !== currentUserId
  );

  if (!otherParticipant) return undefined;

  return {
    id: otherParticipant.user_id,
    name: otherParticipant.user?.name || 'Unknown User',
    profile_pic_url: otherParticipant.user?.profile_pic_url,
  };
}

export type ConversationType = 'direct' | 'group' | 'board';
export type GroupInvitePolicy = 'admins_only' | 'all_members';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  last_message?: string;
  last_message_id?: string;
  last_message_sender_id?: string;
  participants?: ConversationParticipant[];
  unread_count?: number;
  group_invite_policy?: GroupInvitePolicy;
  board_id?: string | null;
  other_user?: {
    user_id?: string;
    id?: string;
    name: string;
    profile_pic_url?: string;
    is_deleted?: boolean;
  };
}

const BOARD_GROUP_NAME_PREFIX = 'board_';
const BOARD_ID_IN_NAME_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseBoardIdFromGroupConversationName(name: string): string | null {
  if (!name?.startsWith(BOARD_GROUP_NAME_PREFIX)) return null;
  const id = name.slice(BOARD_GROUP_NAME_PREFIX.length);
  return BOARD_ID_IN_NAME_RE.test(id) ? id : null;
}

export function isBoardLinkedChatConversation(conv: Conversation): boolean {
  if (conv.type === 'board') return true;
  if (conv.board_id) return true;
  if (conv.type === 'group' && conv.name) {
    return parseBoardIdFromGroupConversationName(conv.name) !== null;
  }
  return false;
}

export function isStandaloneGroupConversation(conv: Conversation): boolean {
  return conv.type === 'group' && !isBoardLinkedChatConversation(conv);
}

function normalizeConversationType(t: unknown): ConversationType {
  const s = String(t || '').toLowerCase();
  if (s === 'board') return 'board';
  if (s === 'group') return 'group';
  return 'direct';
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at?: string;
  last_read_message_id?: string;
  role?: string;
  user?: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
}

type RawParticipantData = {
  id: any;
  conversation_id: any;
  user_id: any;
  joined_at: any;
  last_read_at?: any;
  last_read_message_id?: any;
};

type MinimalParticipantData = {
  conversation_id: any;
  last_read_at?: any;
  last_read_message_id?: any;
};

export interface MessageMedia {
  id: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  filename: string;
  mime_type: string;
  size_bytes: number;
  bucket: string;
  path: string;
  duration_seconds?: number;
  dimensions?: { width: number; height: number };
  metadata?: Record<string, any>;
  order_index?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'mixed';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  reply_to_id?: string;
  edited_at?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
  media?: MessageMedia[];
}

export interface CreateConversationInput {
  type: 'direct' | 'group';
  participant_ids: string[];
  name?: string;
}

export interface SendMessageInput {
  conversation_id: string;
  content?: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  reply_to_id?: string;
  last_message_id?: string | null;
}

export async function getOrCreateDirectConversation(
  userId1: string,
  userId2: string
): Promise<{ conversation: Conversation | null; error: any }> {
  const supabase = createClient();

  try {
    const { data: user1Participations, error: user1Error } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId1);

    if (user1Error) {
      return { conversation: null, error: user1Error };
    }

    if (!user1Participations || user1Participations.length === 0) {
      return await createNewDirectConversation(userId1, userId2);
    }

    const conversationIds = user1Participations.map((p: { conversation_id: string }) => p.conversation_id);

    const { data: directConversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('id, type')
      .in('id', conversationIds)
      .eq('type', 'direct');

    if (conversationsError) {
      return { conversation: null, error: conversationsError };
    }

    if (!directConversations || directConversations.length === 0) {
      return await createNewDirectConversation(userId1, userId2);
    }

    for (const conv of directConversations) {
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conv.id);

      if (participantsError) {
        continue;
      }

      const participantIds = (participants || []).map((p: any) => p.user_id);
      if (
        participantIds.includes(userId1) &&
        participantIds.includes(userId2) &&
        participantIds.length === 2
      ) {
        const { data: fullConversation, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conv.id)
          .single();

        if (fetchError || !fullConversation) {
          continue;
        }

        return { conversation: fullConversation as Conversation, error: null };
      }
    }

    return await createNewDirectConversation(userId1, userId2);
  } catch (err) {
    return { conversation: null, error: err };
  }
}

async function createNewDirectConversation(
  userId1: string,
  userId2: string
): Promise<{ conversation: Conversation | null; error: any }> {
  const supabase = createClient();

  try {

    const conversationData: any = {
      type: 'direct',
    };

    let { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        ...conversationData,
        created_by: userId1,
      })
      .select()
      .single();

    if (createError && (createError.message?.includes('created_by') || createError.message?.includes('column'))) {
      ({ data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single());
    }

    if (createError) {
      return {
        conversation: null,
        error: new Error(
          `Failed to create conversation: ${createError.message || JSON.stringify(createError)}\n\n` +
          `Please ensure the 'conversations' table exists with the correct schema.`
        )
      };
    }

    if (!newConversation) {
      return { conversation: null, error: new Error('Failed to create conversation') };
    }

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConversation.id, user_id: userId1 },
        { conversation_id: newConversation.id, user_id: userId2 },
      ]);

    if (participantsError) {
      await supabase.from('conversations').delete().eq('id', newConversation.id);
      return {
        conversation: null,
        error: new Error(
          `Failed to add participants: ${participantsError.message || JSON.stringify(participantsError)}\n\n` +
          `Please ensure the 'conversation_participants' table exists.`
        )
      };
    }

    const conversation: Conversation = {
      id: newConversation.id,
      type: newConversation.type || 'direct',
      name: newConversation.name,
      created_by: newConversation.created_by || userId1,
      created_at: newConversation.created_at || new Date().toISOString(),
      updated_at: newConversation.updated_at || new Date().toISOString(),
      last_message_at: newConversation.last_message_at,
      last_message: safeLastMessage(newConversation.last_message),
      participants: [],
    };

    return { conversation, error: null };
  } catch (err: any) {
    return {
      conversation: null,
      error: new Error(err?.message || 'Unknown error creating conversation')
    };
  }
}

export async function getUserConversationsWithPagination(
  userId: string,
  limit: number = 10,
  offset: number = 0,
  options?: { conversationType?: 'direct' | 'group' | 'board' | null }
): Promise<{
  conversations: Conversation[];
  pagination: { total: number; limit: number; offset: number; has_more: boolean };
  error: any
}> {
  const supabase = createClient();

  try {
    const rpcParams: Record<string, unknown> = {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    };
    if (options?.conversationType != null && options.conversationType !== undefined) {
      rpcParams.p_conversation_type = options.conversationType;
    }

    const { data, error } = await supabase.rpc('get_user_conversations', rpcParams);

    if (error) {
      return {
        conversations: [],
        pagination: { total: 0, limit, offset, has_more: false },
        error
      };
    }

    const rpcConversations = data?.data || (Array.isArray(data) ? data : []);
    
    if (!rpcConversations || !Array.isArray(rpcConversations) || rpcConversations.length === 0) {
      return {
        conversations: [],
        pagination: data?.pagination || { total: 0, limit, offset, has_more: false },
        error: null
      };
    }

    const conversations: Conversation[] = rpcConversations.map((conv: any) => {
      const lastMessage = conv.last_message_content || conv.last_message || null;
      const lastMessageAt = conv.last_message_created_at || conv.last_message_at || null;
      const updatedAt = conv.last_activity_at || conv.updated_at || conv.created_at;
      
      let otherUser = conv.other_user;
      if (!otherUser && conv.other_participants && Array.isArray(conv.other_participants) && conv.other_participants.length > 0) {
        const otherParticipant = conv.other_participants[0];
        otherUser = {
          user_id: otherParticipant.user_id,
          id: otherParticipant.user_id,
          name: otherParticipant.name || 'Unknown User',
          profile_pic_url: otherParticipant.profile_pic_url,
        };
      }
      
      let participants = conv.participants || [];
      if (participants.length === 0 && conv.other_participants && Array.isArray(conv.other_participants)) {
        participants = conv.other_participants.map((p: any) => ({
          id: p.user_id || '',
          conversation_id: conv.id,
          user_id: p.user_id,
          joined_at: conv.created_at,
          role: typeof p.role === 'string' ? p.role : undefined,
          user: {
            id: p.user_id,
            name: p.name || 'Unknown User',
            profile_pic_url: p.profile_pic_url,
          },
        }));
      }
      
      let lastMessageText = safeLastMessage(lastMessage);
      if (!lastMessageText && conv.last_message_type) {
        if (conv.last_message_media_count > 1) {
          lastMessageText = `${conv.last_message_media_count} attachments`;
        } else if (conv.last_message_type === 'image') {
          lastMessageText = '📷 Image';
        } else if (conv.last_message_type === 'video') {
          lastMessageText = '🎥 Video';
        } else if (conv.last_message_type === 'audio') {
          lastMessageText = '🎵 Audio';
        } else if (conv.last_message_type === 'document') {
          lastMessageText = '📎 File';
        } else if (conv.last_message_type === 'mixed') {
          lastMessageText = `${conv.last_message_media_count || 2} attachments`;
        } else {
          lastMessageText = 'Media';
        }
      }
      
      return {
        id: conv.id,
        type: normalizeConversationType(conv.type),
        name: conv.name || undefined,
        created_by: conv.created_by || '',
        created_at: conv.created_at,
        updated_at: updatedAt,
        last_message_at: lastMessageAt,
        last_message: lastMessageText,
        last_message_id: conv.last_message_id || undefined,
        last_message_sender_id: conv.last_message_sender_id || undefined,
        participants: participants,
        unread_count: conv.unread_count || 0,
        group_invite_policy: conv.group_invite_policy,
        board_id: conv.board_id ?? undefined,
        other_user: otherUser || undefined,
      };
    });

    return {
      conversations,
      pagination: data.pagination,
      error: null
    };
  } catch (err) {
    return {
      conversations: [],
      pagination: { total: 0, limit, offset, has_more: false },
      error: err
    };
  }
}

export function getLastMessage(conversation: Conversation): {
  content: string;
  senderId: string;
  timestamp: string;
  messageId: string;
} | null {
  if (!conversation.last_message || !conversation.last_message_at) {
    return null;
  }

  return {
    content: conversation.last_message,
    senderId: conversation.last_message_sender_id || '',
    timestamp: conversation.last_message_at,
    messageId: conversation.last_message_id || '',
  };
}

export function getFormattedLastMessage(
  conversation: Conversation,
  currentUserId: string
): string {
  const lastMsg = getLastMessage(conversation);

  if (!lastMsg) {
    return 'No messages yet';
  }

  const isCurrentUser = lastMsg.senderId === currentUserId;

  if (isCurrentUser) {
    return `You: ${lastMsg.content}`;
  }

  const sender = conversation.participants?.find(
    p => p.user_id === lastMsg.senderId
  );

  const senderName = sender?.user?.name || 'Someone';
  return `${senderName}: ${lastMsg.content}`;
}

export function getLastMessageTimeAgo(conversation: Conversation): string {
  const lastMsg = getLastMessage(conversation);

  if (!lastMsg) {
    return '';
  }

  const now = new Date();
  const messageTime = new Date(lastMsg.timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return messageTime.toLocaleDateString();
}

export async function getUserConversations(
  userId: string,
  limit: number = 100,
  offset: number = 0,
  options?: { conversationType?: 'direct' | 'group' | 'board' | null }
): Promise<{ conversations: Conversation[]; error: any }> {
  const supabase = createClient();

  try {

    const rpcParams: Record<string, unknown> = {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    };
    if (options?.conversationType != null && options.conversationType !== undefined) {
      rpcParams.p_conversation_type = options.conversationType;
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_conversations', rpcParams);

    const rpcConversations = rpcData?.data || rpcData || [];
    
    if (!rpcError && Array.isArray(rpcConversations) && rpcConversations.length > 0) {
      const conversations: Conversation[] = rpcConversations.map((conv: any) => {
        const lastMessage = conv.last_message_content || conv.last_message || null;
        const lastMessageAt = conv.last_message_created_at || conv.last_message_at || null;
        const updatedAt = conv.last_activity_at || conv.updated_at || conv.created_at;
        
        let otherUser = conv.other_user;
        if (!otherUser && conv.other_participants && Array.isArray(conv.other_participants) && conv.other_participants.length > 0) {
          const otherParticipant = conv.other_participants[0];
          otherUser = {
            user_id: otherParticipant.user_id,
            id: otherParticipant.user_id,
            name: otherParticipant.name || 'Unknown User',
            profile_pic_url: otherParticipant.profile_pic_url,
          };
        }
        
        let participants = conv.participants || [];
        if (participants.length === 0 && conv.other_participants && Array.isArray(conv.other_participants)) {
          participants = conv.other_participants.map((p: any) => ({
            id: p.user_id || '',
            conversation_id: conv.id,
            user_id: p.user_id,
            joined_at: conv.created_at,
            role: typeof p.role === 'string' ? p.role : undefined,
            user: {
              id: p.user_id,
              name: p.name || 'Unknown User',
              profile_pic_url: p.profile_pic_url,
            },
          }));
        }
        
        let lastMessageText = safeLastMessage(lastMessage);
        if (!lastMessageText && conv.last_message_type) {
          if (conv.last_message_media_count > 1) {
            lastMessageText = `${conv.last_message_media_count} attachments`;
          } else if (conv.last_message_type === 'image') {
            lastMessageText = '📷 Image';
          } else if (conv.last_message_type === 'video') {
            lastMessageText = '🎥 Video';
          } else if (conv.last_message_type === 'audio') {
            lastMessageText = '🎵 Audio';
          } else if (conv.last_message_type === 'document') {
            lastMessageText = '📎 File';
          } else if (conv.last_message_type === 'mixed') {
            lastMessageText = `${conv.last_message_media_count || 2} attachments`;
          } else {
            lastMessageText = 'Media';
          }
        }
        
        return {
          id: conv.id,
          type: normalizeConversationType(conv.type),
          name: conv.name || undefined,
          created_by: conv.created_by || '',
          created_at: conv.created_at,
          updated_at: updatedAt,
          last_message_at: lastMessageAt,
          last_message: lastMessageText,
          last_message_id: conv.last_message_id || undefined,
          last_message_sender_id: conv.last_message_sender_id || undefined,
          participants: participants,
          unread_count: conv.unread_count || 0,
          group_invite_policy: conv.group_invite_policy,
          board_id: conv.board_id ?? undefined,
          other_user: otherUser || undefined,
        };
      });

      return { conversations, error: null };
    }

    let participantData: MinimalParticipantData[] | null;
    let participantError: any;

    const initialQuery = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at, last_read_message_id')
      .eq('user_id', userId);

    participantData = initialQuery.data;
    participantError = initialQuery.error;

    if (participantError && (participantError.message?.includes('last_read_at') || participantError.code === '42703')) {
      const retry = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      participantData = retry.data as MinimalParticipantData[] | null;
      participantError = retry.error;
    }

    if (participantError) {

      if (participantError.message?.includes('relation') || participantError.message?.includes('does not exist')) {
        return {
          conversations: [],
          error: new Error('Chat tables not found. Please set up the database tables first.')
        };
      }
      return { conversations: [], error: participantError };
    }

    if (!participantData || participantData.length === 0) {
      return { conversations: [], error: null };
    }

    const conversationIds = participantData.map((p: { conversation_id: string }) => p.conversation_id);

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds);

    if (conversationsError) {
      return { conversations: [], error: conversationsError };
    }

    if (!conversationsData || conversationsData.length === 0) {
      return { conversations: [], error: null };
    }

    const conversationsWithParticipants = await Promise.all(
      conversationsData.map(async (conv: Conversation) => {
        let participantsData: RawParticipantData[] | null;
        let participantsError: any;

        const initialQuery = await supabase
          .from('conversation_participants')
          .select('id, conversation_id, user_id, joined_at, last_read_at, last_read_message_id')
          .eq('conversation_id', conv.id);

        participantsData = initialQuery.data;
        participantsError = initialQuery.error;

        if (participantsError && (participantsError.message?.includes('last_read_at') || participantsError.code === '42703')) {
          const retry = await supabase
            .from('conversation_participants')
            .select('id, conversation_id, user_id, joined_at')
            .eq('conversation_id', conv.id);

          participantsData = retry.data as RawParticipantData[] | null;
          participantsError = retry.error;
        }

        const participants = await Promise.all(
          (participantsData || []).map(async (p: any) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, name, profile_pic_url')
              .eq('id', p.user_id)
              .single();

            return {
              id: p.id,
              conversation_id: p.conversation_id,
              user_id: p.user_id,
              joined_at: p.joined_at || new Date().toISOString(),
              last_read_at: p.last_read_at || undefined,
              last_read_message_id: p.last_read_message_id || undefined,
              user: profileData ? {
                id: profileData.id,
                name: profileData.name || 'Unknown User',
                profile_pic_url: profileData.profile_pic_url,
              } : {
                id: p.user_id,
                name: 'Unknown User',
                profile_pic_url: undefined,
              },
            };
          })
        );

        const lastMessage = safeLastMessage(conv.last_message);
        const lastMessageAt = conv.last_message_at;
        const lastMessageSenderId = conv.last_message_sender_id;

        const rawType = (conv as { type?: string }).type;
        return {
          id: conv.id,
          type: normalizeConversationType(rawType),
          name: conv.name,
          created_by: conv.created_by,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          last_message_at: lastMessageAt,
          last_message: lastMessage,
          last_message_id: conv.last_message_id,
          last_message_sender_id: lastMessageSenderId,
          participants,
          unread_count: 0,
          group_invite_policy: (conv as { group_invite_policy?: GroupInvitePolicy }).group_invite_policy,
          board_id: (conv as { board_id?: string | null }).board_id ?? undefined,
          other_user: rawType === 'direct' ? extractOtherUser(participants, userId) : undefined,
        };
      })
    );

    let uniqueConversations = conversationsWithParticipants.filter(
      (conv: { id: string }, index: number, self: { id: string }[]) =>
      index === self.findIndex((c: { id: string }) => c.id === conv.id)
    );

    const seenPairs = new Map<string, Conversation>();
    const finalConversations: Conversation[] = [];

    for (const conv of uniqueConversations) {
      if (conv.type !== 'direct' || !conv.participants || conv.participants.length !== 2) {
        finalConversations.push(conv);
        continue;
      }

      const participantIds = conv.participants
        .map((p: any) => p.user_id)
        .sort()
        .join('-');

      const existing = seenPairs.get(participantIds);
      if (existing) {
        const existingTime = existing.last_message_at ? new Date(existing.last_message_at).getTime() : 0;
        const currentTime = conv.last_message_at ? new Date(conv.last_message_at).getTime() : 0;

        if (currentTime > existingTime) {
          const index = finalConversations.findIndex(c => c.id === existing.id);
          if (index !== -1) {
            finalConversations[index] = conv;
          }
          seenPairs.set(participantIds, conv);
        }
      } else {
        seenPairs.set(participantIds, conv);
        finalConversations.push(conv);
      }
    }

    const sortedConversations = finalConversations.sort((a, b) => {
      const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
      const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
      return timeB - timeA;
    });

    return { conversations: sortedConversations, error: null };
  } catch (err) {
    return { conversations: [], error: err };
  }
}

export async function getConversation(
  conversationId: string,
  userId: string
): Promise<{ conversation: Conversation | null; error: any }> {
  const supabase = createClient();

  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!participant) {
    return { conversation: null, error: new Error('Not a participant') };
  }

  const { data: convData, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError || !convData) {
    return { conversation: null, error: convError || new Error('Conversation not found') };
  }

  let participantsData: RawParticipantData[] | null;
  let participantsError: any;

  const participantsQuery = await supabase
    .from('conversation_participants')
    .select('id, conversation_id, user_id, joined_at, last_read_at, last_read_message_id')
    .eq('conversation_id', conversationId);

  participantsData = participantsQuery.data;
  participantsError = participantsQuery.error;

  if (participantsError && (participantsError.message?.includes('last_read_at') || participantsError.code === '42703')) {
    const retry = await supabase
      .from('conversation_participants')
      .select('id, conversation_id, user_id, joined_at')
      .eq('conversation_id', conversationId);

    participantsData = retry.data as RawParticipantData[] | null;
    participantsError = retry.error;
  }

  if (participantsError) {
    return { conversation: null, error: participantsError };
  }

  const participants = await Promise.all(
    (participantsData || []).map(async (p: any) => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, name, profile_pic_url')
        .eq('id', p.user_id)
        .single();

      return {
        id: p.id,
        conversation_id: p.conversation_id,
        user_id: p.user_id,
        joined_at: p.joined_at || new Date().toISOString(),
        last_read_at: p.last_read_at || undefined,
        last_read_message_id: p.last_read_message_id || undefined,
        user: profileData ? {
          id: profileData.id,
          name: profileData.name || 'Unknown User',
          profile_pic_url: profileData.profile_pic_url,
        } : {
          id: p.user_id,
          name: 'Unknown User',
          profile_pic_url: undefined,
        },
      };
    })
  );

  const lastMessage = safeLastMessage(convData.last_message);
  const lastMessageAt = convData.last_message_at;
  const lastMessageSenderId = convData.last_message_sender_id;

  const normalizedType = normalizeConversationType(convData.type);
  const conversation: Conversation = {
    id: convData.id,
    type: normalizedType,
    name: convData.name,
    created_by: convData.created_by,
    created_at: convData.created_at,
    updated_at: convData.updated_at,
    last_message_at: lastMessageAt,
    last_message: lastMessage,
    last_message_id: convData.last_message_id,
    last_message_sender_id: lastMessageSenderId,
    participants: participants,
    group_invite_policy: (convData as { group_invite_policy?: GroupInvitePolicy }).group_invite_policy,
    board_id: (convData as { board_id?: string | null }).board_id ?? undefined,
    other_user: normalizedType === 'direct' ? extractOtherUser(participants, userId) : undefined,
  };

  return { conversation, error: null };
}

export async function searchUsers(
  query: string,
  currentUserId: string,
  limit: number = 20
): Promise<{ users: any[]; error: any }> {
  const supabase = createClient();

  if (!query.trim()) {
    return { users: [], error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, profile_pic_url, email')
    .neq('id', currentUserId)
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    return { users: [], error };
  }

  return { users: data || [], error: null };
}

export async function getOrCreateBoardConversation(
  boardId: string,
  boardName: string,
  userId: string
): Promise<{ conversation: Conversation | null; error: any }> {
  const supabase = createClient();

  try {

    const { data: existingConversations, error: searchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('type', 'group')
      .eq('name', boardName)
      .limit(1);

    const { data: existingBoardConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('type', 'board')
      .eq('board_id', boardId)
      .limit(1);

    if (existingBoardConv && existingBoardConv.length > 0) {
      const existingConv = existingBoardConv[0];
      const { data: participant } = await supabase
        .from('conversation_participants')
        .select('*')
        .eq('conversation_id', existingConv.id)
        .eq('user_id', userId)
        .single();

      if (!participant) {
        await supabase.from('conversation_participants').insert({
          conversation_id: existingConv.id,
          user_id: userId,
        });
      }

      return { conversation: existingConv as Conversation, error: null };
    }

    if (existingConversations && existingConversations.length > 0) {
      const existingConv = existingConversations[0];

      const { data: participant } = await supabase
        .from('conversation_participants')
        .select('*')
        .eq('conversation_id', existingConv.id)
        .eq('user_id', userId)
        .single();

      if (!participant) {
        await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: existingConv.id,
            user_id: userId,
          });
      }

      return { conversation: existingConv as Conversation, error: null };
    }

    const conversationData: any = {
      type: 'board',
      name: boardName,
      board_id: boardId,
    };

    let { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        ...conversationData,
        created_by: userId,
      })
      .select()
      .single();

    if (createError && (createError.message?.includes('created_by') || createError.message?.includes('column'))) {
      ({ data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single());
    }

    if (createError) {
      const legacyBoard: any = {
        type: 'group',
        name: `board_${boardId}`,
      };
      ({ data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          ...legacyBoard,
          created_by: userId,
        })
        .select()
        .single());
      if (createError && (createError.message?.includes('created_by') || createError.message?.includes('column'))) {
        ({ data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert(legacyBoard)
          .select()
          .single());
      }
    }

    if (createError || !newConversation) {
      return {
        conversation: null,
        error: new Error(
          `Failed to create board conversation: ${createError?.message || 'Unknown error'}`
        )
      };
    }

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: newConversation.id,
        user_id: userId,
      });

    if (participantsError) {
      await supabase.from('conversations').delete().eq('id', newConversation.id);
      return {
        conversation: null,
        error: new Error('Failed to add participant to board conversation')
      };
    }

    const conversation: Conversation = {
      id: newConversation.id,
      type: normalizeConversationType(newConversation.type),
      name: boardName,
      created_by: newConversation.created_by || userId,
      created_at: newConversation.created_at || new Date().toISOString(),
      updated_at: newConversation.updated_at || new Date().toISOString(),
      last_message_at: newConversation.last_message_at,
      last_message: safeLastMessage(newConversation.last_message),
      board_id: (newConversation as { board_id?: string }).board_id ?? boardId,
      participants: [],
    };

    return { conversation, error: null };
  } catch (err: any) {
    return {
      conversation: null,
      error: new Error(err?.message || 'Unknown error creating board conversation')
    };
  }
}


export async function markConversationAsRead(
  conversationId: string,
  userId: string,
  lastReadMessageId?: string
): Promise<{ error: any }> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {
    last_read_at: new Date().toISOString(),
    unread_count: 0,
  };

  if (lastReadMessageId) {
    updateData.last_read_message_id = lastReadMessageId;
  }

  let { error } = await supabase
    .from('conversation_participants')
    .update(updateData)
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);

  if (error && (error.code === '42703' || /unread_count/i.test(error.message || ''))) {
    delete updateData.unread_count;
    const retry = await supabase
      .from('conversation_participants')
      .update(updateData)
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
    error = retry.error;
  }

  return { error };
}

export async function sendMessage(
  senderId: string,
  input: SendMessageInput
): Promise<{ message: Message | null; error: any }> {
  const supabase = createClient();

  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', input.conversation_id)
    .eq('user_id', senderId)
    .single();

  if (!participant) {
    return { message: null, error: new Error('Not a participant in this conversation') };
  }

  let messageData: any = {
    conversation_id: input.conversation_id,
    sender_id: senderId,
  };

  if (input.content !== undefined) messageData.content = input.content;
  if (input.file_url !== undefined) messageData.file_url = input.file_url;
  if (input.file_name !== undefined) messageData.file_name = input.file_name;
  if (input.file_size !== undefined) messageData.file_size = input.file_size;
  if (input.file_type !== undefined) messageData.file_type = input.file_type;
  if (input.reply_to_id !== undefined) messageData.reply_to_id = input.reply_to_id;

  let messageDataWithType = { ...messageData };
  if (input.message_type !== undefined) {
    messageDataWithType.message_type = input.message_type;
  } else {
    messageDataWithType.message_type = 'text';
  }

  let { data: message, error } = await supabase
    .from('messages')
    .insert(messageDataWithType)
    .select('*')
    .single();

  if (error && (error.message?.includes('message_type') || error.code === 'PGRST204' || error.code === '42703')) {
    ({ data: message, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select('*')
      .single());
  }

  if (error || !message) {
    return {
      message: null,
      error: error || new Error('Failed to create message')
    };
  }

  let senderProfile = null;
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, name, profile_pic_url')
      .eq('id', message.sender_id)
      .single();

    senderProfile = profileData;
  } catch (profileErr) {
  }

  const messageWithSender: Message = {
    ...message,
    sender: senderProfile ? {
      id: senderProfile.id,
      name: senderProfile.name || `User ${message.sender_id.substring(0, 8)}`,
      profile_pic_url: senderProfile.profile_pic_url,
    } : {
      id: message.sender_id,
      name: `User ${message.sender_id.substring(0, 8)}`,
      profile_pic_url: undefined,
    },
  };

  try {
    const now = new Date().toISOString();

    const lastMessagePreview = input.content ||
      (input.message_type === 'image' ? '📷 Image' :
       input.message_type === 'video' ? '🎥 Video' :
       input.message_type === 'audio' ? '🎵 Audio' :
       input.file_name || '📎 File');

    let updateData: any = {
      updated_at: now,
      last_message: lastMessagePreview,
      last_message_at: now,
      last_message_id: message.id,
      last_message_sender_id: message.sender_id
    };

    let { error: updateError } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', input.conversation_id);

    if (updateError &&
        (updateError.code === '42703' ||
         updateError.message?.toLowerCase().includes('column') ||
         updateError.message?.toLowerCase().includes('does not exist') ||
         updateError.message?.toLowerCase().includes('last_message_sender_id'))) {

      updateData = {
        updated_at: now,
        last_message: lastMessagePreview,
        last_message_at: now,
        last_message_id: message.id
      };

      const result = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', input.conversation_id);

      updateError = result.error;

      if (updateError &&
          (updateError.code === '42703' ||
           updateError.message?.toLowerCase().includes('last_message_id'))) {

        updateData = {
          updated_at: now,
          last_message: lastMessagePreview,
          last_message_at: now
        };

        const finalResult = await supabase
          .from('conversations')
          .update(updateData)
          .eq('id', input.conversation_id);

      }
    }
  } catch (updateErr: any) {
  }

  notifyChatMessageRecipients({
    conversationId: input.conversation_id,
    senderId,
    messageId: message.id,
    content: input.content ?? null,
    messageType: (input.message_type as
      | 'text'
      | 'image'
      | 'video'
      | 'audio'
      | 'file'
      | null
      | undefined) ?? 'text',
    fileName: input.file_name ?? null,
  });

  return { message: messageWithSender, error: null };
}

const MESSAGE_DETAIL_SELECT_FULL = `
  *,
  sender:sender_id (
    id,
    name,
    profile_pic_url
  ),
  message_media (
    order_index,
    media:media_id (
      id,
      media_type,
      filename,
      mime_type,
      size_bytes,
      bucket,
      path,
      duration_seconds,
      dimensions,
      metadata
    )
  )
`;

const MESSAGE_DETAIL_SELECT_NO_MEDIA = `
  *,
  sender:sender_id (
    id,
    name,
    profile_pic_url
  )
`;

function mapMessagesQueryRowToMessage(msg: any): Message {
  const message: Message = {
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_id: msg.sender_id,
    content: msg.content,
    message_type: msg.message_type || 'text',
    file_url: msg.file_url,
    file_name: msg.file_name,
    file_size: msg.file_size,
    file_type: msg.file_type,
    reply_to_id: msg.reply_to_id,
    edited_at: msg.edited_at,
    deleted_at: msg.deleted_at,
    created_at: msg.created_at,
    updated_at: msg.updated_at,
    sender: msg.sender,
  };

  if (msg.message_media && Array.isArray(msg.message_media) && msg.message_media.length > 0) {
    message.media = msg.message_media
      .map((mm: any) => {
        if (!mm.media) return null;
        const media = mm.media;
        return {
          id: media.id,
          media_type: media.media_type,
          filename: media.filename,
          mime_type: media.mime_type,
          size_bytes: media.size_bytes,
          bucket: media.bucket,
          path: media.path,
          duration_seconds: media.duration_seconds,
          dimensions: media.dimensions,
          metadata: media.metadata,
          order_index: mm.order_index,
        } as MessageMedia;
      })
      .filter((m: MessageMedia | null) => m !== null)
      .sort((a: MessageMedia, b: MessageMedia) => (a.order_index || 0) - (b.order_index || 0));
  }

  return message;
}

export async function getMessageById(
  messageId: string,
  userId: string
): Promise<{ message: Message | null; error: any }> {
  const supabase = createClient();

  let result = await supabase
    .from('messages')
    .select(MESSAGE_DETAIL_SELECT_FULL)
    .eq('id', messageId)
    .maybeSingle();

  if (result.error && (result.error.message?.includes('message_media') || result.error.message?.includes('does not exist'))) {
    result = await supabase
      .from('messages')
      .select(MESSAGE_DETAIL_SELECT_NO_MEDIA)
      .eq('id', messageId)
      .maybeSingle();
  }

  if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
    result = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          profile_pic_url
        ),
        message_media (
          order_index,
          media:media_id (
            id,
            media_type,
            filename,
            mime_type,
            size_bytes,
            bucket,
            path,
            duration_seconds,
            dimensions,
            metadata
          )
        )
      `)
      .eq('id', messageId)
      .maybeSingle();
  }

  if (result.error) {
    return { message: null, error: result.error };
  }

  const row = result.data;
  if (!row) {
    return { message: null, error: new Error('Message not found') };
  }

  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', row.conversation_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!participant) {
    return { message: null, error: new Error('Not a participant in this conversation') };
  }

  return { message: mapMessagesQueryRowToMessage(row), error: null };
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ messages: Message[]; error: any }> {
  const supabase = createClient();

  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!participant) {
    return { messages: [], error: new Error('Not a participant in this conversation') };
  }

  let result = await supabase
    .from('messages')
    .select(MESSAGE_DETAIL_SELECT_FULL)
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (result.error && (result.error.message?.includes('message_media') || result.error.message?.includes('does not exist'))) {
    result = await supabase
      .from('messages')
      .select(MESSAGE_DETAIL_SELECT_NO_MEDIA)
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
  }

  // Fallback if deleted_at doesn't exist
  if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
    result = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          profile_pic_url
        ),
        message_media (
          order_index,
          media:media_id (
            id,
            media_type,
            filename,
            mime_type,
            size_bytes,
            bucket,
            path,
            duration_seconds,
            dimensions,
            metadata
          )
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
  }

  if (result.error) {
    return { messages: [], error: result.error };
  }

  const messages: Message[] = (result.data || []).map((msg: any) => mapMessagesQueryRowToMessage(msg));

  return { messages, error: null };
}

export async function uploadMessageFile(
  conversationId: string,
  userId: string,
  file: File
): Promise<{ fileUrl: string | null; error: any }> {
  const supabase = createClient();

  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!participant) {
    return { fileUrl: null, error: new Error('Not a participant in this conversation') };
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (!session || sessionError) {
    return { fileUrl: null, error: new Error('User not authenticated') };
  }

  const fileType = file.type.startsWith('image/') ? 'image' :
                   file.type.startsWith('video/') ? 'video' :
                   file.type.startsWith('audio/') ? 'audio' : 'file';

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${conversationId}/${userId}/${Date.now()}.${fileExt}`;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.CHAT_MEDIA)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      const errorMessage = uploadError.message || '';
      const statusCode = (uploadError as any).statusCode || (uploadError as any).status;

      if (errorMessage.includes('Bucket not found') ||
          errorMessage.includes('does not exist') ||
          statusCode === 404) {
        return {
          fileUrl: null,
          error: new Error(
            `Storage bucket "${STORAGE_BUCKETS.CHAT_MEDIA}" not found. Please create it in Supabase Dashboard → Storage → Create Bucket. ` +
            `Name: ${STORAGE_BUCKETS.CHAT_MEDIA}, Public: true`
          )
        };
      }

      if (statusCode === 400 || statusCode === 403 ||
          errorMessage.includes('403') || errorMessage.includes('400')) {
        return {
          fileUrl: null,
          error: new Error(
            'Permission denied. Please check:\n' +
            `1. The "${STORAGE_BUCKETS.CHAT_MEDIA}" bucket exists and is public\n` +
            '2. Storage policies allow authenticated users to upload\n' +
            '3. Your user is properly authenticated'
          )
        };
      }

      return { fileUrl: null, error: uploadError };
    }

    if (!uploadData) {
      return { fileUrl: null, error: new Error('Upload failed: No data returned') };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.CHAT_MEDIA)
      .getPublicUrl(fileName);

    return {
      fileUrl: publicUrl,
      error: null,
    };
  } catch (err: any) {
    return {
      fileUrl: null,
      error: new Error(`Upload failed: ${err?.message || 'Unknown error'}`)
    };
  }
}

export const MEDIA_LIMITS = {
  image: 10 * 1024 * 1024,    // 10 MB
  audio: 16 * 1024 * 1024,    // 16 MB
  video: 100 * 1024 * 1024,   // 100 MB
  document: 50 * 1024 * 1024, // 50 MB
  maxAttachments: 10,
  maxTotalSize: 150 * 1024 * 1024, // 150 MB
};

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface CreateChatMediaResponse {
  success: boolean;
  media_id: string;
  bucket: string;
  path: string;
  storage_path: string;
}

export interface ChatMedia {
  id: string;
  media_type: MediaType;
  filename: string;
  mime_type: string;
  size_bytes: number;
  bucket: string;
  path: string;
  duration_seconds?: number;
  dimensions?: { width: number; height: number };
  metadata?: Record<string, any>;
}

export interface SendMessageWithMediaResponse {
  success: boolean;
  message_id: string;
  created_at: string;
}

export function getMediaTypeFromMime(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}


export function validateMediaSize(file: File): { valid: boolean; error?: string } {
  const mediaType = getMediaTypeFromMime(file.type);
  const limit = MEDIA_LIMITS[mediaType];

  if (file.size > limit) {
    const limitMB = Math.round(limit / (1024 * 1024));
    return {
      valid: false,
      error: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} size must be less than ${limitMB}MB`
    };
  }

  return { valid: true };
}


export async function createChatMedia(
  senderId: string,
  file: File,
  options?: {
    durationSeconds?: number;
    dimensions?: { width: number; height: number };
    metadata?: Record<string, any>;
  }
): Promise<{ data: CreateChatMediaResponse | null; error: any }> {
  const supabase = createClient();

  const mediaType = getMediaTypeFromMime(file.type);

  const validation = validateMediaSize(file);
  if (!validation.valid) {
    return { data: null, error: new Error(validation.error) };
  }

  try {
    const { data, error } = await supabase.rpc('create_chat_media', {
      p_sender_id: senderId,
      p_media_type: mediaType,
      p_filename: file.name,
      p_mime_type: file.type || 'application/octet-stream',
      p_size_bytes: file.size,
      p_duration_seconds: options?.durationSeconds || null,
      p_dimensions: options?.dimensions || null,
      p_metadata: options?.metadata || null,
    });

    if (error) {
      return { data: null, error };
    }

    return { data: data as CreateChatMediaResponse, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: new Error(`Failed to create media: ${err?.message || 'Unknown error'}`)
    };
  }
}

export async function uploadChatMediaFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ success: boolean; error: any }> {
  const supabase = createClient();

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      const errorMessage = uploadError.message || '';
      const statusCode = (uploadError as any).statusCode || (uploadError as any).status;

      if (errorMessage.includes('Bucket not found') ||
          errorMessage.includes('does not exist') ||
          statusCode === 404) {
        return {
          success: false,
          error: new Error(
            `Storage bucket "${bucket}" not found. Please create it in Supabase Dashboard → Storage → Create Bucket.`
          )
        };
      }

      if (statusCode === 400 || statusCode === 403) {
        return {
          success: false,
          error: new Error(
            'Permission denied. Please check storage policies allow authenticated users to upload.'
          )
        };
      }

      return { success: false, error: uploadError };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return {
      success: false,
      error: new Error(`Upload failed: ${err?.message || 'Unknown error'}`)
    };
  }
}


export async function cancelChatMedia(
  userId: string,
  mediaId: string
): Promise<{ success: boolean; error: any }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('cancel_chat_media', {
      p_user_id: userId,
      p_media_id: mediaId,
    });

    if (error) {
      // Extract detailed error information
      const errorDetails = {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        originalError: error
      };
      
      console.error('cancel_chat_media RPC error:', errorDetails);
      
      // Return a more informative error object
      return { 
        success: false, 
        error: errorDetails.message || 
               errorDetails.details || 
               errorDetails.hint || 
               `RPC error: ${errorDetails.code || 'Unknown'}` ||
               error
      };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('cancel_chat_media exception:', err);
    return {
      success: false,
      error: new Error(`Failed to cancel media: ${err?.message || 'Unknown error'}`)
    };
  }
}


export async function sendMessageWithMedia(
  senderId: string,
  conversationId: string,
  content: string | null,
  mediaIds: string[]
): Promise<{ data: SendMessageWithMediaResponse | null; error: any }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('send_message', {
      p_sender_id: senderId,
      p_conversation_id: conversationId,
      p_content: content || null,
      p_media_ids: mediaIds.length > 0 ? mediaIds : null,
    });

    if (error) {
      if (error.message?.includes('function') && error.message?.includes('does not exist')) {
        return { data: null, error: new Error('send_message RPC not available. Using legacy method.') };
      }
      return { data: null, error };
    }

    const result = data as SendMessageWithMediaResponse;

    notifyChatMessageRecipients({
      conversationId,
      senderId,
      messageId: result?.message_id ?? null,
      content,
      messageType: mediaIds.length > 0 ? 'mixed' : 'text',
      mediaCount: mediaIds.length,
    });

    return { data: result, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: new Error(`Failed to send message: ${err?.message || 'Unknown error'}`)
    };
  }
}


export function getMediaPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}


export async function uploadChatMedia(
  senderId: string,
  file: File,
  options?: {
    durationSeconds?: number;
    dimensions?: { width: number; height: number };
    metadata?: Record<string, any>;
    onProgress?: (progress: number) => void;
  }
): Promise<{
  mediaId: string | null;
  publicUrl: string | null;
  error: any
}> {
  const { data: mediaData, error: createError } = await createChatMedia(
    senderId,
    file,
    options
  );

  if (createError || !mediaData) {
    return { mediaId: null, publicUrl: null, error: createError };
  }

  const { success, error: uploadError } = await uploadChatMediaFile(
    mediaData.bucket,
    mediaData.path,
    file
  );

  if (!success || uploadError) {
    await cancelChatMedia(senderId, mediaData.media_id);
    return { mediaId: null, publicUrl: null, error: uploadError };
  }

  const publicUrl = getMediaPublicUrl(mediaData.bucket, mediaData.path);

  return {
    mediaId: mediaData.media_id,
    publicUrl,
    error: null
  };
}
