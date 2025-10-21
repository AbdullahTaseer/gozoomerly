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
  id: string;
  creator_id: string;
  board_type_id?: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details?: any;
  cover_media_id?: string;
  goal_type: 'monetary' | 'non_monetary';
  goal_amount?: number;
  currency: string;
  deadline_date?: string;
  privacy: 'public' | 'private' | 'circle_only';
  allow_invites: boolean;
  invites_can_invite: boolean;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  published_at?: string;
  total_raised: number;
  contributors_count: number;
  wishes_count: number;
  views_count: number;
  shares_count: number;
  last_activity_at?: string;
  meta_tags?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
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
  goal_type?: 'monetary' | 'non_monetary';
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
  
  // Generate a unique slug from the title
  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const slug = `${baseSlug}-${Date.now()}`;
  
  const boardData: any = {
    creator_id: userId,
    title: input.title,
    slug,
    description: input.description,
    honoree_details: input.honoree_details,
    goal_type: input.goal_type || 'monetary',
    goal_amount: input.goal_amount,
    currency: input.currency || 'USD',
    deadline_date: input.deadline_date,
    privacy: input.privacy || 'public',
    allow_invites: input.allow_invites ?? true,
    invites_can_invite: input.invites_can_invite ?? false,
    status: 'draft'
  };
  
  // Only include board_type_id if it's provided
  if (input.board_type_id) {
    boardData.board_type_id = input.board_type_id;
  }
  
  const { data, error } = await supabase
    .from('boards')
    .insert([boardData])
    .select()
    .single();

  if (error) {
    console.error('Error creating board:', error);
    return { data: null, error };
  }

  // Add creator as a board participant
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
      board_types (
        name,
        slug,
        icon,
        color_scheme
      ),
      board_participants!inner (
        user_id,
        role
      )
    `)
    .eq('board_participants.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user boards:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getBoardBySlug(slug: string) {
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
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching board:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateBoard(boardId: string, updates: Partial<Board>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error updating board:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function publishBoard(boardId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('boards')
    .update({
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error publishing board:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Board Gift Options
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

// Board Circle Visibility
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

// Wishes
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

  // Update board wishes count
  await supabase
    .from('boards')
    .update({ wishes_count: data ? 1 : 0 })
    .eq('id', boardId);

  return { data, error: null };
}

// Media Upload
export async function uploadBoardMedia(
  boardId: string, 
  userId: string, 
  file: File,
  mediaType: 'image' | 'video' | 'audio'
) {
  const supabase = createClient();
  
  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${boardId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const bucketName = 'board-media'; // Adjust based on your storage setup
  
  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { data: null, error: uploadError };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  // Save media record
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
    // Try to delete the uploaded file
    await supabase.storage.from(bucketName).remove([fileName]);
    return { data: null, error };
  }

  return { data, error: null };
}

// Board Invitations
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

// Create or update board progressively
export async function createOrUpdateBoard(
  userId: string, 
  boardId: string | null,
  updates: Partial<CreateBoardInput>
) {
  if (boardId) {
    // Update existing board
    return updateBoard(boardId, updates as Partial<Board>);
  } else {
    // Create new board with minimal data
    return createBoard(userId, {
      title: updates.title || 'Untitled Board',
      ...updates
    });
  }
}