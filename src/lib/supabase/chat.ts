import { createClient } from './client';


export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  last_message?: string;
  last_message_id?: string;
  participants?: ConversationParticipant[];
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at?: string;
  last_read_message_id?: string;
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

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file';
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
      console.error('Error fetching user1 participations:', user1Error);
      return { conversation: null, error: user1Error };
    }

    if (!user1Participations || user1Participations.length === 0) {
      return await createNewDirectConversation(userId1, userId2);
    }

    const conversationIds = user1Participations.map(p => p.conversation_id);

    const { data: directConversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('id, type')
      .in('id', conversationIds)
      .eq('type', 'direct');

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
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
        console.error('Error checking participants:', participantsError);
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
          console.error('Error fetching full conversation:', fetchError);
          continue;
        }

        return { conversation: fullConversation as Conversation, error: null };
      }
    }

    return await createNewDirectConversation(userId1, userId2);
  } catch (err) {
    console.error('Error in getOrCreateDirectConversation:', err);
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
      console.warn('created_by column not found, trying without it');
      ({ data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single());
    }

    if (createError) {
      console.error('Error creating conversation:', createError);
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
      console.error('Error adding participants:', participantsError);
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
      last_message: newConversation.last_message,
      participants: [],
    };

    return { conversation, error: null };
  } catch (err: any) {
    console.error('Error in createNewDirectConversation:', err);
    return { 
      conversation: null, 
      error: new Error(err?.message || 'Unknown error creating conversation')
    };
  }
}


export async function getUserConversations(
  userId: string
): Promise<{ conversations: Conversation[]; error: any }> {
  const supabase = createClient();

  try {
    
    let participantData: MinimalParticipantData[] | null;
    let participantError: any;
    
    const initialQuery = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at, last_read_message_id')
      .eq('user_id', userId);
    
    participantData = initialQuery.data;
    participantError = initialQuery.error;

    if (participantError && (participantError.message?.includes('last_read_at') || participantError.code === '42703')) {
      console.warn('last_read_at column not found, fetching without it');
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

    const conversationIds = participantData.map(p => p.conversation_id);

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds);

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return { conversations: [], error: conversationsError };
    }

    if (!conversationsData || conversationsData.length === 0) {
      return { conversations: [], error: null };
    }

    const conversationsWithParticipants = await Promise.all(
      conversationsData.map(async (conv) => {
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

        if (participantsError) {
          console.error('Error fetching participants:', participantsError);
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

        let lastMessage = conv.last_message;
        let lastMessageAt = conv.last_message_at;
        
        // Fetch last message using last_message_id if available
        if (conv.last_message_id) {
          try {
            let result = await supabase
              .from('messages')
              .select('content, file_name, message_type, created_at')
              .eq('id', conv.last_message_id)
              .is('deleted_at', null)
              .single();
            
            // If deleted_at column doesn't exist, retry without it
            if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
              result = await supabase
                .from('messages')
                .select('content, file_name, message_type, created_at')
                .eq('id', conv.last_message_id)
                .single();
            }
            
            if (result.data) {
              lastMessage = result.data.content || result.data.file_name || 'Media';
              lastMessageAt = result.data.created_at;
            }
          } catch (err) {
            console.warn('Could not fetch last message by ID for conversation:', conv.id, err);
          }
        } 
        // Fallback: if no last_message_id or fetch failed, get latest message
        else if (!lastMessage) {
          try {
            let result = await supabase
              .from('messages')
              .select('content, file_name, created_at')
              .eq('conversation_id', conv.id)
              .is('deleted_at', null)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            // If deleted_at column doesn't exist, retry without it
            if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
              result = await supabase
                .from('messages')
                .select('content, file_name, created_at')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            }
            
            if (result.data) {
              lastMessage = result.data.content || result.data.file_name || 'Media';
              lastMessageAt = lastMessageAt || result.data.created_at;
            }
          } catch (err) {
            console.warn('Could not fetch last message for conversation:', conv.id, err);
          }
        }

        return {
          id: conv.id,
          type: conv.type,
          name: conv.name,
          created_by: conv.created_by,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          last_message_at: lastMessageAt,
          last_message: lastMessage,
          last_message_id: conv.last_message_id,
          participants,
          unread_count: 0,
        };
      })
    );

    let uniqueConversations = conversationsWithParticipants.filter((conv, index, self) => 
      index === self.findIndex(c => c.id === conv.id)
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
    console.error('Error in getUserConversations:', err);
    return { conversations: [], error: err };
  }
}


export async function getConversation(
  conversationId: string,
  userId: string
): Promise<{ conversation: Conversation | null; error: any }> {
  const supabase = createClient();

  // First check if user is a participant
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single();

  if (!participant) {
    return { conversation: null, error: new Error('Not a participant') };
  }

  // Get conversation data
  const { data: convData, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError || !convData) {
    return { conversation: null, error: convError || new Error('Conversation not found') };
  }

  // Get participants manually (similar to getUserConversations)
  let participantsData: RawParticipantData[] | null;
  let participantsError: any;

  const participantsQuery = await supabase
    .from('conversation_participants')
    .select('id, conversation_id, user_id, joined_at, last_read_at, last_read_message_id')
    .eq('conversation_id', conversationId);

  participantsData = participantsQuery.data;
  participantsError = participantsQuery.error;

  // Handle case where last_read_at might not exist
  if (participantsError && (participantsError.message?.includes('last_read_at') || participantsError.code === '42703')) {
    const retry = await supabase
      .from('conversation_participants')
      .select('id, conversation_id, user_id, joined_at')
      .eq('conversation_id', conversationId);
    
    participantsData = retry.data as RawParticipantData[] | null;
    participantsError = retry.error;
  }

  if (participantsError) {
    console.error('Error fetching participants:', participantsError);
    return { conversation: null, error: participantsError };
  }

  // Fetch profile data for each participant
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

  // Get last message if not in conversation data
  let lastMessage = convData.last_message;
  let lastMessageAt = convData.last_message_at;
  
  // Fetch last message using last_message_id if available
  if (convData.last_message_id) {
    try {
      let result = await supabase
        .from('messages')
        .select('content, file_name, message_type, created_at')
        .eq('id', convData.last_message_id)
        .is('deleted_at', null)
        .single();
      
      // If deleted_at column doesn't exist, retry without it
      if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
        result = await supabase
          .from('messages')
          .select('content, file_name, message_type, created_at')
          .eq('id', convData.last_message_id)
          .single();
      }
      
      if (result.data) {
        lastMessage = result.data.content || result.data.file_name || 'Media';
        lastMessageAt = result.data.created_at;
      }
    } catch (err) {
      console.warn('Could not fetch last message by ID for conversation:', conversationId, err);
    }
  }
  // Fallback: if no last_message_id or fetch failed, get latest message
  else if (!lastMessage) {
    try {
      let result = await supabase
        .from('messages')
        .select('content, file_name, created_at')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      // If deleted_at column doesn't exist, retry without it
      if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
        result = await supabase
          .from('messages')
          .select('content, file_name, created_at')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
      }
      
      if (result.data) {
        lastMessage = result.data.content || result.data.file_name || 'Media';
        lastMessageAt = lastMessageAt || result.data.created_at;
      }
    } catch (err) {
      console.warn('Could not fetch last message for conversation:', conversationId, err);
    }
  }

  const conversation: Conversation = {
    id: convData.id,
    type: convData.type,
    name: convData.name,
    created_by: convData.created_by,
    created_at: convData.created_at,
    updated_at: convData.updated_at,
    last_message_at: lastMessageAt,
    last_message: lastMessage,
    participants: participants,
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

    if (searchError && !searchError.message?.includes('does not exist')) {
      console.error('Error searching for board conversation:', searchError);
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
      type: 'group',
      name: boardName,
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

    if (createError || !newConversation) {
      console.error('Error creating board conversation:', createError);
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
      console.error('Error adding participant:', participantsError);
      await supabase.from('conversations').delete().eq('id', newConversation.id);
      return { 
        conversation: null, 
        error: new Error('Failed to add participant to board conversation')
      };
    }

    const conversation: Conversation = {
      id: newConversation.id,
      type: 'group',
      name: boardName,
      created_by: newConversation.created_by || userId,
      created_at: newConversation.created_at || new Date().toISOString(),
      updated_at: newConversation.updated_at || new Date().toISOString(),
      last_message_at: newConversation.last_message_at,
      last_message: newConversation.last_message,
      participants: [],
    };

    return { conversation, error: null };
  } catch (err: any) {
    console.error('Error in getOrCreateBoardConversation:', err);
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

  const updateData: any = {
    last_read_at: new Date().toISOString()
  };

  // Store the last read message ID if provided
  if (lastReadMessageId) {
    updateData.last_read_message_id = lastReadMessageId;
  }

  const { error } = await supabase
    .from('conversation_participants')
    .update(updateData)
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);

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
    console.warn('message_type column not found, creating message without it');
    
    ({ data: message, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select('*')
      .single());
  }

  if (error || !message) {
    console.error('Error creating message:', error);
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
    console.warn('Could not fetch sender profile:', profileErr);
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
    
    const updateData: any = {
      updated_at: now,
      last_message_id: message.id  // Only store the message ID
    };
    
    const { error: updateError, data: updateResult } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', input.conversation_id);
    
    if (updateError) {
      const errorStr = JSON.stringify(updateError);
      console.warn('Error updating conversation (non-critical):', updateError);
      console.warn('Error code:', updateError.code);
      console.warn('Error message:', updateError.message);
      console.warn('Full error:', errorStr);
      
      if (updateError.code === '42703' || 
          updateError.message?.includes('column') || 
          updateError.message?.includes('does not exist') ||
          errorStr.includes('last_message_id')) {
        
        console.warn('⚠️ Missing last_message_id column in conversations table. Running database-setup.sql will fix this.');
        
        const minimalUpdate: any = {
          updated_at: now,
        };
        
        const { error: minimalError } = await supabase
          .from('conversations')
          .update(minimalUpdate)
          .eq('id', input.conversation_id);
        
        if (!minimalError) {
          console.log('✅ Conversation timestamp updated (last_message_id column missing)');
        }
        
      } else if (updateError.code === '42501' || updateError.message?.includes('permission') || updateError.message?.includes('policy')) {
        console.warn('RLS policy might be blocking update. Check your RLS policies for conversations table.');
      }
    } else {
      console.log('✅ Conversation updated successfully!');
      console.log(`📝 Last message ID stored: ${message.id}`);
    }
  } catch (updateErr: any) {
    console.warn('Exception updating conversation (non-critical):', updateErr);
    if (updateErr?.message) {
      console.warn('Exception message:', updateErr.message);
    }
    if (updateErr?.code) {
      console.warn('Exception code:', updateErr.code);
    }
  }

  return { message: messageWithSender, error: null };
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
    .select(`
      *,
      sender:sender_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  // If deleted_at column doesn't exist, retry without it
  if (result.error && (result.error.message?.includes('deleted_at') || result.error.code === '42703')) {
    console.warn('deleted_at column not found in messages table, fetching without it');
    result = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
  }

  if (result.error) {
    return { messages: [], error: result.error };
  }

  return { messages: (result.data || []) as Message[], error: null };
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
      .from('chat-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      
      const errorMessage = uploadError.message || '';
      const statusCode = (uploadError as any).statusCode || (uploadError as any).status;
      
      if (errorMessage.includes('Bucket not found') || 
          errorMessage.includes('does not exist') ||
          statusCode === 404) {
        return { 
          fileUrl: null, 
          error: new Error(
            'Storage bucket "chat-files" not found. Please create it in Supabase Dashboard → Storage → Create Bucket. ' +
            'Name: chat-files, Public: true'
          ) 
        };
      }
      
      if (statusCode === 400 || statusCode === 403 || 
          errorMessage.includes('403') || errorMessage.includes('400')) {
        return {
          fileUrl: null,
          error: new Error(
            'Permission denied. Please check:\n' +
            '1. The "chat-files" bucket exists and is public\n' +
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
      .from('chat-files')
      .getPublicUrl(fileName);

    return {
      fileUrl: publicUrl,
      error: null,
    };
  } catch (err: any) {
    console.error('Unexpected error during file upload:', err);
    return { 
      fileUrl: null, 
      error: new Error(`Upload failed: ${err?.message || 'Unknown error'}`) 
    };
  }
}

