import { createClient } from './client';

export interface BoardType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color_scheme?: any;
  is_active: boolean;
  display_order: number;
  default_currency: string;
  supports_fundraising: boolean;
  supports_wishes: boolean;
  supports_media: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Board {
  profiles: any;
  id: string;
  creator_id: string;
  board_type_id?: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details?: any;
  cover_media_id?: string;
  goal_type: 'monetary' | 'nonmonetary';
  goal_amount?: number;
  currency: string;
  deadline_date?: string;
  privacy: 'public' | 'private' | 'circle_only';
  allow_invites: boolean;
  invites_can_invite: boolean;
  status: 'draft' | 'live' | 'published' | 'completed' | 'cancelled';
  published_at?: string;
  total_raised: number;
  contributors_count: number;
  wishes_count: number;
  participants_count?: number;
  gifters_count?: number;
  media_count?: number;
  views_count: number;
  shares_count: number;
  last_activity_at?: string;
  meta_tags?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  creator?: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
  board_types?: BoardType;
}

export interface CreateBoardInput {
  title: string;
  description?: string;
  board_type_id?: string;
  honoree_details?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    hometown?: string;
    phone?: string;
    email?: string;
    profile_photo_url?: string;
    theme_color?: string;
  };
  goal_type?: 'monetary' | 'nonmonetary';
  goal_amount?: number;
  currency?: string;
  deadline_date?: string;
  privacy?: 'public' | 'private' | 'circle_only';
  allow_invites?: boolean;
  invites_can_invite?: boolean;
}

export async function getBoardTypes() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('board_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching board types:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export interface BoardTypeField {
  id: string;
  board_type_id: string;
  field_key: string;
  label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'boolean' | 'email' | 'phone' | 'url' | 'file';
  validation_rules?: any;
  options?: any;
  placeholder?: string;
  help_text?: string;
  display_order: number;
  is_required: boolean;
  is_visible: boolean;
}

export async function getBoardTypeFields(boardTypeId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('board_type_fields')
    .select('*')
    .eq('board_type_id', boardTypeId)
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching board type fields:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createBoard(userId: string, input: CreateBoardInput) {
  const supabase = createClient();
  
  if (!userId) {
    return { data: null, error: { message: 'User ID is required to create a board' } };
  }
  
  if (!input.title || input.title.trim() === '') {
    return { data: null, error: { message: 'Board title is required' } };
  }
  
  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const slug = `${baseSlug}-${Date.now()}`;
  
  const boardData: any = {
    creator_id: userId,
    title: input.title,
    slug,
    description: input.description || '',
    honoree_details: input.honoree_details || {},
    goal_type: input.goal_type || 'monetary',
    goal_amount: input.goal_amount || null,
    currency: input.currency || 'USD',
    deadline_date: input.deadline_date || null,
    privacy: input.privacy || 'public',
    allow_invites: input.allow_invites ?? true,
    invites_can_invite: input.invites_can_invite ?? false,
    status: 'draft'
  };
  
  if (input.board_type_id) {
    boardData.board_type_id = input.board_type_id;
  }
  
  const { data, error } = await supabase
    .from('boards')
    .insert([boardData])
    .select()
    .single();

  if (error) {
    return { 
      data: null, 
      error: {
        ...error,
        message: `Failed to create board: ${error.message}${error.hint ? ` (Hint: ${error.hint})` : ''}`
      }
    };
  }

  if (data) {
    await supabase
      .from('board_participants')
      .insert([{
        board_id: data.id,
        user_id: userId,
        role: 'admin',
        joined_via: 'created'
      }]);
  }

  return { data, error: null };
}

export async function getUserBoards(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      wishes_count,
      participants_count,
      contributors_count,
      gifters_count,
      media_count,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      board_participants!inner (
        user_id,
        role
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('board_participants.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user boards:', error);
    return { data: null, error };
  }

  if (data) {
    // Use counts directly from board table columns
    const boardsWithCounts = data.map(board => {
      // Get counts directly from board table - handle null/undefined values
      const wishesCount = (board as any).wishes_count ?? 0;
      const participantsCount = (board as any).participants_count ?? 0;
      const contributorsCount = (board as any).contributors_count ?? 0;
      const giftersCount = (board as any).gifters_count ?? 0;
      const mediaCount = (board as any).media_count ?? 0;

      return {
        ...board,
        wishes_count: wishesCount,
        participants_count: participantsCount,
        gifters_count: giftersCount,
        contributors_count: contributorsCount,
        media_count: mediaCount
      };
    });

    return { data: boardsWithCounts, error: null };
  }

  return { data, error: null };
}

export async function getBoardByIdRPC(boardId: string) {
  const supabase = createClient();
  
  const rpcParams = {
    p_board_id: boardId,
  };

  const { data, error } = await supabase.rpc('get_board_by_id', rpcParams);

  if (error) {
    console.error('Error fetching board via RPC:', error);
    return { data: null, error };
  }

  if (data && data.success && data.data) {
    const rpcBoard = data.data;
    
    // Normalize RPC response to match expected structure
    const normalizedBoard = {
      ...rpcBoard,
      // Map creator to profiles for compatibility
      profiles: rpcBoard.creator ? {
        id: rpcBoard.creator.id,
        name: rpcBoard.creator.name,
        profile_pic_url: rpcBoard.creator.profile_pic_url,
      } : null,
      // Map board_type to board_types for compatibility
      board_types: rpcBoard.board_type ? {
        name: rpcBoard.board_type.name,
        slug: rpcBoard.board_type.slug,
        icon: rpcBoard.board_type.icon,
        color_scheme: rpcBoard.board_type.color_scheme,
      } : null,
      // Ensure all count fields are present
      contributors_count: rpcBoard.contributors_count ?? 0,
      wishes_count: rpcBoard.wishes_count ?? 0,
      participants_count: rpcBoard.participants_count ?? 0,
      gifters_count: rpcBoard.gifters_count ?? 0,
      media_count: rpcBoard.media_count ?? 0,
      views_count: rpcBoard.views_count ?? 0,
      shares_count: rpcBoard.shares_count ?? 0,
      total_raised: rpcBoard.total_raised ?? 0,
    };

    return { data: normalizedBoard, error: null };
  }

  return { data: null, error: new Error('Invalid RPC response') };
}

export async function getBoardBySlug(slug: string) {
  const supabase = createClient();
  
  // First, get the board ID from slug
  const { data: boardData, error: slugError } = await supabase
    .from('boards')
    .select('id')
    .eq('slug', slug)
    .single();

  if (slugError || !boardData) {
    console.error('Error fetching board ID from slug:', slugError);
    // Fallback to old method
    const { data, error } = await supabase
      .from('boards')
      .select(`
        *,
        board_types (
          name,
          slug,
          icon,
          color_scheme
        ),
        profiles:creator_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching board:', error);
      return { data: null, error };
    }

    return { data, error: null };
  }

  // Use RPC to get full board data
  return await getBoardByIdRPC(boardData.id);
}

export async function getBoardById(boardId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('id', boardId)
    .single();

  if (error) {
    console.error('Error fetching board:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateBoard(boardId: string, updates: Partial<Board>) {
  const supabase = createClient();
  
  const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  const { data, error } = await supabase
    .from('boards')
    .update(cleanedUpdates)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function publishBoard(boardId: string) {
  const supabase = createClient();
  
  const { data: existingBoard, error: fetchError } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single();

  if (fetchError) {
    return { 
      data: null, 
      error: { 
        ...fetchError, 
        message: `Failed to find board: ${fetchError.message}` 
      }
    };
  }

  if (!existingBoard) {
    return { 
      data: null, 
      error: { message: 'Board not found. Please try creating the board again.' }
    };
  }

  if (existingBoard.status === 'live' || existingBoard.status === 'published') {
    return { data: existingBoard, error: null };
  }

  const { data, error } = await supabase
    .from('boards')
    .update({
      status: 'live',
      published_at: new Date().toISOString()
    })
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    return { 
      data: null, 
      error: {
        ...error,
        message: `Failed to publish board: ${error.message}${error.hint ? ` (Hint: ${error.hint})` : ''}`
      }
    };
  }
  
  return { data, error: null };
}

export async function publishMultipleBoards(boardIds: string[]) {
  const supabase = createClient();
  
  console.log('Attempting to publish boards:', boardIds);
  
  const { data, error } = await supabase
    .from('boards')
    .update({
      status: 'live',
      published_at: new Date().toISOString()
    })
    .in('id', boardIds)
    .select();

  if (error) {
    console.error('Error publishing boards:', {
      boardIds,
      error,
      errorMessage: error.message,
      errorDetails: error.details,
      errorCode: error.code,
      errorHint: error.hint
    });
    return { data: null, error };
  }

  console.log('Boards published successfully:', data?.length || 0, 'boards');
  return { data, error: null };
}

export async function addBoardGiftOptions(boardId: string, giftOptions: Array<{
  amount: number;
  label?: string;
  description?: string;
  is_custom?: boolean;
}>) {
  const supabase = createClient();
  
  const optionsWithBoardId = giftOptions.map((option, index) => ({
    ...option,
    board_id: boardId,
    display_order: index
  }));
  
  const { data, error } = await supabase
    .from('board_gift_options')
    .insert(optionsWithBoardId)
    .select();

  if (error) {
    console.error('Error adding gift options:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getBoardGiftOptions(boardId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('board_gift_options')
    .select('*')
    .eq('board_id', boardId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gift options:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function addGiftContribution(
  boardId: string,
  contributorId: string,
  giftData: {
    amount: number;
    gift_option_id?: string;
    message?: string;
    is_custom: boolean;
  }
) {
  const supabase = createClient();
  
  const { data: currentBoard, error: boardError } = await supabase
    .from('boards')
    .select('total_raised, contributors_count')
    .eq('id', boardId)
    .single();

  if (boardError || !currentBoard) {
    console.error('Error fetching board:', boardError);
    return { data: null, error: boardError || new Error('Board not found') };
  }

  const giftOptionData: any = {
    board_id: boardId,
    amount: giftData.amount,
    label: giftData.gift_option_id || `Custom Gift - $${giftData.amount}`,
    description: giftData.message || undefined,
    is_custom: giftData.is_custom,
    display_order: 0
  };

  
  try {
    giftOptionData.contributor_id = contributorId;
  } catch (e) {
  }

  const { data, error } = await supabase
    .from('board_gift_options')
    .insert([giftOptionData])
    .select()
    .single();

  if (error) {
    console.error('Error adding gift:', error);
    return { data: null, error };
  }

  if (data) {
    const { data: currentBoard, error: fetchError } = await supabase
      .from('boards')
      .select('total_raised, contributors_count')
      .eq('id', boardId)
      .single();

    if (!fetchError && currentBoard) {
      const newTotalRaised = (currentBoard.total_raised || 0) + giftData.amount;
      const newContributorsCount = (currentBoard.contributors_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('boards')
        .update({
          total_raised: newTotalRaised,
          contributors_count: newContributorsCount,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', boardId);

      if (updateError) {
        console.error('Error updating board raised amount:', updateError);
      }
    }
  }

  return { data, error: null };
}

export async function setBoardCircleVisibility(boardId: string, circleIds: string[]) {
  const supabase = createClient();
  
  const visibilityRecords = circleIds.map(circleId => ({
    board_id: boardId,
    circle_id: circleId
  }));
  
  const { data, error } = await supabase
    .from('board_circle_visibility')
    .insert(visibilityRecords)
    .select();

  if (error) {
    console.error('Error setting circle visibility:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export interface CreateWishInput {
  content: string;
  media_ids?: string[];
}

export async function addWishToBoard(boardId: string, senderId: string, wish: CreateWishInput) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('wishes')
    .insert([{
      board_id: boardId,
      sender_id: senderId,
      content: wish.content,
      media_ids: wish.media_ids || []
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding wish:', error);
    return { data: null, error };
  }

  await supabase
    .from('boards')
    .update({ wishes_count: data ? 1 : 0 })
    .eq('id', boardId);

  return { data, error: null };
}

export async function likeWish(wishId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc('like_wish', {
      p_wish_id: wishId,
    });

    if (error) {
      console.error('Error liking wish:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in likeWish:', err);
    return { data: null, error: err };
  }
}

export async function unlikeWish(wishId: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.rpc('unlike_wish', {
      p_wish_id: wishId,
    });

    if (error) {
      console.error('Error unliking wish:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error in unlikeWish:', err);
    return { data: null, error: err };
  }
}

export interface BoardParticipant {
  id: string;
  board_id: string;
  user_id: string;
  role: 'creator' | 'admin' | 'moderator' | 'contributor' | 'viewer';
  joined_via: string;
  contribution_count: number;
  joined_at: string;
  last_activity_at: string;
  invited_by: string | null;
  user: {
    id: string;
    name: string;
    profile_pic_url: string | null;
    is_verified?: boolean;
    city?: string;
    country?: string;
  };
  inviter: any | null;
}

export interface GetBoardParticipantsResponse {
  success: boolean;
  data: {
    participants: BoardParticipant[];
    total_participants: number;
    counts_by_role: {
      creator: number;
      admin: number;
      moderator: number;
      contributor: number;
      viewer: number;
    };
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
    filter_applied: string | null;
  };
}

export async function getBoardParticipants(
  boardId: string,
  options?: {
    limit?: number;
    offset?: number;
    role?: string;
    filter?: string;
  }
): Promise<{ data: GetBoardParticipantsResponse | null; error: any }> {
  const supabase = createClient();
  
  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }
    if (options?.role) {
      rpcParams.p_role = options.role;
    }
    if (options?.filter) {
      rpcParams.p_filter = options.filter;
    }

    const { data, error } = await supabase.rpc('get_board_participants', rpcParams);

    if (error) {
      console.error('Error fetching board participants:', error);
      return { data: null, error };
    }

    return { data: data as GetBoardParticipantsResponse, error: null };
  } catch (err) {
    console.error('Error in getBoardParticipants:', err);
    return { data: null, error: err };
  }
}

export interface WishComment {
  comment_id: string;
  wish_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    profile_pic_url?: string | null;
  };
  replies?: WishComment[];
}

export async function addWishComment(
  wishId: string,
  content: string,
  parentCommentId?: string | null
): Promise<{ data: { comment_id: string } | null; error: any }> {
  const supabase = createClient();
  
  try {
    const rpcParams: any = {
      p_wish_id: wishId,
      p_content: content,
      p_parent_comment_id: parentCommentId || null,
    };

    const { data, error } = await supabase.rpc('add_wish_comment', rpcParams);

    if (error) {
      console.error('Error adding wish comment:', error);
      return { data: null, error };
    }

    return { data: data as { comment_id: string }, error: null };
  } catch (err) {
    console.error('Error in addWishComment:', err);
    return { data: null, error: err };
  }
}

export interface GetWishCommentsResponse {
  total: number;
  items: Array<{
    id: string;
    wish_id: string;
    user_id: string;
    content: string;
    parent_comment_id: string | null;
    created_at: string;
    updated_at: string;
    user: {
      id: string;
      name: string;
      profile_pic_url?: string | null;
    };
  }>;
}

export async function getWishComments(
  wishId: string,
  options?: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  }
): Promise<{ data: WishComment[]; total?: number; error: any }> {
  const supabase = createClient();
  
  try {
    // Fetch root comments (parent_comment_id = null)
    const rootParams: any = {
      p_wish_id: wishId,
      p_parent_comment_id: null,
      p_limit: options?.limit || 50,
      p_offset: options?.offset || 0,
      p_include_deleted: options?.includeDeleted || false,
    };

    const { data: rootData, error: rootError } = await supabase.rpc(
      'get_wish_comments',
      rootParams
    );

    if (rootError) {
      console.error('Error fetching root comments:', rootError);
      return { data: [], error: rootError };
    }

    if (!rootData || !rootData.items || rootData.items.length === 0) {
      return { data: [], total: rootData?.total || 0, error: null };
    }

    // Convert RPC response to WishComment format
    const rootComments: WishComment[] = await Promise.all(
      rootData.items.map(async (comment: any) => {
        const commentObj: WishComment = {
          comment_id: comment.id || comment.comment_id,
          wish_id: comment.wish_id || wishId,
          user_id: comment.user_id || comment.user?.id,
          content: comment.content,
          parent_comment_id: null,
          created_at: comment.created_at,
          updated_at: comment.updated_at || comment.created_at,
          user: comment.user || {
            id: comment.user_id || comment.user?.id,
            name: comment.user?.name || 'Unknown User',
            profile_pic_url: comment.user?.profile_pic_url || null,
          },
          replies: [],
        };

        // Fetch replies for this comment
        const replyParams: any = {
          p_wish_id: wishId,
          p_parent_comment_id: commentObj.comment_id,
          p_limit: 100, // Fetch all replies (reasonable limit)
          p_offset: 0,
          p_include_deleted: options?.includeDeleted || false,
        };

        const { data: replyData, error: replyError } = await supabase.rpc(
          'get_wish_comments',
          replyParams
        );

        if (!replyError && replyData && replyData.items) {
          commentObj.replies = replyData.items.map((reply: any) => ({
            comment_id: reply.id || reply.comment_id,
            wish_id: reply.wish_id || wishId,
            user_id: reply.user_id || reply.user?.id,
            content: reply.content,
            parent_comment_id: commentObj.comment_id,
            created_at: reply.created_at,
            updated_at: reply.updated_at || reply.created_at,
            user: reply.user || {
              id: reply.user_id || reply.user?.id,
              name: reply.user?.name || 'Unknown User',
              profile_pic_url: reply.user?.profile_pic_url || null,
            },
            replies: [], // Replies don't have nested replies in this implementation
          }));
        }

        return commentObj;
      })
    );

    return { data: rootComments, total: rootData.total, error: null };
  } catch (err) {
    console.error('Error in getWishComments:', err);
    return { data: [], error: err };
  }
}

// Helper function to get total comment count for a wish (more efficient)
export async function getWishCommentCount(wishId: string): Promise<{ count: number; error: any }> {
  const supabase = createClient();
  
  try {
    // Fetch root comments to get total count
    const { data: rootData, error: rootError } = await supabase.rpc('get_wish_comments', {
      p_wish_id: wishId,
      p_parent_comment_id: null,
      p_limit: 100, // Fetch all root comments to count replies
      p_offset: 0,
      p_include_deleted: false,
    });

    if (rootError) {
      console.error('Error fetching comment count:', rootError);
      return { count: 0, error: rootError };
    }

    if (!rootData || !rootData.items || rootData.items.length === 0) {
      return { count: 0, error: null };
    }

    // Count root comments
    let totalCount = rootData.items.length;
    
    // Count replies for each root comment
    const replyCounts = await Promise.all(
      rootData.items.map(async (comment: any) => {
        const { data: replyData } = await supabase.rpc('get_wish_comments', {
          p_wish_id: wishId,
          p_parent_comment_id: comment.id,
          p_limit: 1,
          p_offset: 0,
          p_include_deleted: false,
        });
        return replyData?.total || 0;
      })
    );
    
    const totalReplies = replyCounts.reduce((sum, count) => sum + count, 0);
    return { count: totalCount + totalReplies, error: null };
  } catch (err) {
    console.error('Error in getWishCommentCount:', err);
    return { count: 0, error: err };
  }
}

export interface BoardMemory {
  wish_id: string;
  board_id: string;
  content: string;
  tag: string | null;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  likes_count: number;
  media_count: number;
  comments_count: number;
  media: Array<{
    id: string;
    url: string;
    filename: string;
    mime_type: string;
    created_at: string;
    dimensions: any;
    media_type: 'image' | 'video' | 'audio' | 'document';
    size_bytes: number;
    thumbnails: any;
    duration_seconds: number | null;
    processing_status: string;
  }>;
  wisher: {
    id: string;
    name: string;
    is_verified: boolean;
    profile_pic_url: string | null;
  };
}

export interface GetBoardMemoriesResponse {
  success: boolean;
  data: {
    memories: BoardMemory[];
    pagination: {
      limit: number;
      total: number;
      offset: number;
      has_more: boolean;
    };
    total_media: number;
    total_wishes: number;
    media_counts_by_type: {
      audio: number;
      image: number;
      video: number;
      document: number;
    };
  };
}

export async function getBoardMemories(
  boardId: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<{ data: GetBoardMemoriesResponse | null; error: any }> {
  const supabase = createClient();
  
  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }

    const { data, error } = await supabase.rpc('get_board_memories', rpcParams);

    if (error) {
      console.error('Error fetching board memories:', error);
      return { data: null, error };
    }

    return { data: data as GetBoardMemoriesResponse, error: null };
  } catch (err) {
    console.error('Error in getBoardMemories:', err);
    return { data: null, error: err };
  }
}

export async function getBoardWishes(
  boardId: string, 
  currentUserId?: string,
  options?: {
    limit?: number;
    offset?: number;
  }
) {
  const supabase = createClient();
  
  try {
    const rpcParams: any = {
      p_board_id: boardId,
    };

    if (options?.limit !== undefined) {
      rpcParams.p_limit = options.limit;
    }
    if (options?.offset !== undefined) {
      rpcParams.p_offset = options.offset;
    }

    const { data: wishesData, error: wishesError } = await supabase.rpc(
      'get_board_wishes',
      rpcParams
    );

    if (wishesError) {
      console.error('Error fetching wishes:', wishesError);
      return { data: [], error: wishesError };
    }

    if (!wishesData || wishesData.length === 0) {
      return { data: [], error: null };
    }

    // Fetch user's likes to determine which wishes are liked
    const wishIds = wishesData.map((w: any) => w.wish_id);
    let userLikesSet: Set<string> = new Set();

    if (currentUserId && wishIds.length > 0) {
      const { data: likesData } = await supabase
        .from('wish_likes')
        .select('wish_id')
        .in('wish_id', wishIds)
        .eq('user_id', currentUserId);

      if (likesData) {
        likesData.forEach((like: any) => {
          userLikesSet.add(like.wish_id);
        });
      }
    }

    // Map RPC response to our expected format
    const wishesWithDetails = wishesData.map((wish: any) => {
      // Combine photos and videos into media array
      const media: Array<{
        id: string;
        media_type: string;
        cdn_url: string;
        thumbnail_url?: string;
      }> = [];

      // Add photos
      if (wish.photos && Array.isArray(wish.photos)) {
        wish.photos.forEach((photo: any) => {
          media.push({
            id: photo.id || photo.media_id,
            media_type: 'image',
            cdn_url: photo.cdn_url || photo.url,
            thumbnail_url: photo.thumbnail_url,
          });
        });
      }

      // Add videos
      if (wish.videos && Array.isArray(wish.videos)) {
        wish.videos.forEach((video: any) => {
          media.push({
            id: video.id || video.media_id,
            media_type: 'video',
            cdn_url: video.cdn_url || video.url,
            thumbnail_url: video.thumbnail_url,
          });
        });
      }

      return {
        id: wish.wish_id,
        content: wish.content,
        created_at: wish.created_at,
        sender: {
          id: wish.sender_id,
          name: wish.sender_name || 'Unknown User',
          profile_pic_url: wish.sender_profile_pic_url || null,
        },
        media,
        giftAmount: wish.gift_amount || 0,
        likesCount: wish.likes_count || 0,
        isLiked: userLikesSet.has(wish.wish_id),
        commentsCount: wish.comments_count || 0,
        tag: wish.tag,
        is_pinned: wish.is_pinned || false,
        is_featured: wish.is_featured || false,
        music: wish.music || [],
      };
    });

    return { data: wishesWithDetails, error: null };
  } catch (err) {
    console.error('Error in getBoardWishes:', err);
    return { data: [], error: err };
  }
}

export async function uploadBoardMedia(
  boardId: string, 
  userId: string, 
  file: File,
  mediaType: 'image' | 'video' | 'audio'
) {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `boards/${boardId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const bucketName = 'profile-images'; 
  
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { data: null, error: uploadError };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('media')
    .insert([{
      uploader_id: userId,
      board_id: boardId,
      bucket: bucketName,
      path: fileName,
      filename: file.name,
      media_type: mediaType,
      mime_type: file.type,
      size_bytes: file.size,
      cdn_url: publicUrl
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving media record:', error);
    await supabase.storage.from(bucketName).remove([fileName]);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function uploadMultipleBoardMedia(
  boardId: string,
  userId: string,
  files: File[]
) {
  const supabase = createClient();
  const bucketName = 'profile-images';
  const results: { success: string[], failed: string[] } = { success: [], failed: [] };

  for (const file of files) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `boards/${boardId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        results.failed.push(file.name);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const mediaType = file.type.startsWith('image/') 
        ? 'image' 
        : file.type.startsWith('video/') 
          ? 'video' 
          : 'audio';

      const { data, error } = await supabase
        .from('media')
        .insert([{
          uploader_id: userId,
          board_id: boardId,
          bucket: bucketName,
          path: fileName,
          filename: file.name,
          media_type: mediaType,
          mime_type: file.type,
          size_bytes: file.size,
          cdn_url: publicUrl
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving media record:', error);
        await supabase.storage.from(bucketName).remove([fileName]);
        results.failed.push(file.name);
      } else if (data) {
        results.success.push(data.id);
      }
    } catch (err) {
      console.error('Unexpected error uploading file:', file.name, err);
      results.failed.push(file.name);
    }
  }

  return { data: results, error: null };
}

export async function createBoardInvitation(
  boardId: string,
  inviterId: string,
  inviteeEmail?: string,
  inviteePhone?: string
) {
  const supabase = createClient();
  
  const invitationCode = `${boardId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const { data, error } = await supabase
    .from('board_invitations')
    .insert([{
      board_id: boardId,
      inviter_id: inviterId,
      invitee_email: inviteeEmail,
      invitee_phone: inviteePhone,
      invitation_code: invitationCode,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating invitation:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createOrUpdateBoard(
  userId: string, 
  boardId: string | null,
  updates: Partial<CreateBoardInput>
) {
  if (boardId) {
    return updateBoard(boardId, updates as Partial<Board>);
  } else {
    return createBoard(userId, {
      title: updates.title || 'Untitled Board',
      ...updates
    });
  }
}

export async function fetchLiveBoards(options?: {
  limit?: number;
  offset?: number;
  includePrivacy?: string[];
}) {
  const supabase = createClient();
  
  // Fetch live/published boards without user participation requirement
  let query = supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  // Filter by privacy if specified, otherwise default to public
  if (options?.includePrivacy) {
    query = query.in('privacy', options.includePrivacy);
  } else {
    query = query.eq('privacy', 'public');
  }

  // Add pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  try {
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching live boards:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { boards: [], error };
    }

    if (data) {
      // Batch fetch all counts in just 3 queries instead of N*3 queries
      const boardIds = data.map(board => board.id);
      
      // Fetch all participants for all boards at once
      const { data: allParticipants } = await supabase
        .from('board_participants')
        .select('board_id')
        .in('board_id', boardIds);
      
      // Fetch all wishes for all boards at once
      const { data: allWishes } = await supabase
        .from('wishes')
        .select('board_id')
        .in('board_id', boardIds);
      
      // Fetch all media for all boards at once
      const { data: allMedia } = await supabase
        .from('media')
        .select('board_id')
        .in('board_id', boardIds);
      
      // Count per board
      const participantCounts = (allParticipants || []).reduce((acc, p) => {
        acc[p.board_id] = (acc[p.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const wishesCounts = (allWishes || []).reduce((acc, w) => {
        acc[w.board_id] = (acc[w.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mediaCounts = (allMedia || []).reduce((acc, m) => {
        acc[m.board_id] = (acc[m.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Map the counts to boards
      const boardsWithCounts = data.map(board => ({
        ...board,
        participants_count: participantCounts[board.id] || 0,
        wishes_count: wishesCounts[board.id] || 0,
        media_count: mediaCounts[board.id] || 0
      }));

      return { boards: boardsWithCounts, error: null };
    }

    return { boards: [], error: null };
  } catch (err) {
    console.error('Error in fetchLiveBoards:', err);
    return { boards: [], error: err };
  }
}

export async function fetchActiveBoards(options?: {
  userId?: string;
  includeStatus?: string[];
  includePrivacy?: string[];
  showAll?: boolean;
}) {
  const supabase = createClient();
  
  let query = supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      board_participants!inner (
        user_id,
        role
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `);

  if (options?.userId) {
    query = query.eq('board_participants.user_id', options.userId);
  }

  if (!options?.showAll) {
    if (options?.includeStatus) {
      query = query.in('status', options.includeStatus);
    } else {
      query = query.in('status', ['published', 'draft']);
    }

    if (options?.includePrivacy) {
      query = query.in('privacy', options.includePrivacy);
    }
  }

  try {
    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active boards:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { boards: [], error };
    }

    if (data) {
      // Batch fetch all invitation and media counts in just 2 queries
      const boardIds = data.map(board => board.id);
      
      // Fetch all invitations for all boards at once
      const { data: allInvitations } = await supabase
        .from('board_invitations')
        .select('board_id')
        .in('board_id', boardIds);
      
      // Fetch all media for all boards at once
      const { data: allMedia } = await supabase
        .from('media')
        .select('board_id')
        .in('board_id', boardIds);
      
      // Count invitations and media per board
      const invitationCounts = (allInvitations || []).reduce((acc, inv) => {
        acc[inv.board_id] = (acc[inv.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mediaCounts = (allMedia || []).reduce((acc, media) => {
        acc[media.board_id] = (acc[media.board_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Map the counts to boards
      const boardsWithCounts = data.map(board => ({
        ...board,
        invited_count: invitationCounts[board.id] || 0,
        media_count: mediaCounts[board.id] || 0
      }));

      return { boards: boardsWithCounts || [], error: null };
    }

    return { boards: [], error: null };
  } catch (err) {
    console.error('Unexpected error in fetchActiveBoards:', err);
    return { boards: [], error: err };
  }
}

export async function fetchUserBoards(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      )
    `)
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user boards:', error);
    return { boards: [], error };
  }

  return { boards: data || [], error: null };
}

export async function searchBoards(query: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      profiles:creator_id (
        id,
        name,
        profile_pic_url
      )
    `)
    .eq('status', 'published')
    .eq('privacy', 'public')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching boards:', error);
    return { boards: [], error };
  }

  return { boards: data || [], error: null };
}

export async function getBoardStats(boardId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .select('total_raised, contributors_count, wishes_count, views_count, shares_count')
    .eq('id', boardId)
    .single();

  if (error) {
    console.error('Error fetching board stats:', error);
    return { stats: null, error };
  }

  return { stats: data, error: null };
}

export async function incrementBoardView(boardId: string) {
  const supabase = createClient();

  const { error } = await supabase.rpc('increment_board_views', {
    board_id: boardId
  });

  if (error) {
    console.error('Error incrementing board views:', error);
  }
}

export interface InviteUserToBoardParams {
  boardId: string;
  inviteeUserId?: string | null;
  inviteeEmail?: string | null;
  inviteePhone?: string | null;
  role?: 'contributor' | 'viewer' | 'admin';
  expiresAt?: string | null;
}

export async function inviteUserToBoard({
  boardId,
  inviteeUserId = null,
  inviteeEmail = null,
  inviteePhone = null,
  role = 'contributor',
  expiresAt = null,
}: InviteUserToBoardParams) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('invite_user_to_board', {
    p_board_id: boardId,
    p_invitee_user_id: inviteeUserId,
    p_invitee_email: inviteeEmail,
    p_invitee_phone: inviteePhone,
    p_role: role,
    p_expires_at: expiresAt,
  });

  if (error) {
    console.error('Error inviting user to board:', error);
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data, error: null };
}