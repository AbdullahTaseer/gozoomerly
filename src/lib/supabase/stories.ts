import { createClient } from './client';

export interface Story {
  id: string;
  user_id: string;
  content_type: 'image' | 'video' | 'text';
  media_id?: string;
  text_content?: string;
  text_background_color?: string;
  text_font_style?: string;
  caption?: string;
  stickers?: any;
  music?: any;
  views_count: number;
  expires_at: string;
  status: string;
  created_at: string;
  updated_at?: string;
  // Joined data
  user?: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
  media?: {
    id: string;
    cdn_url: string;
    media_type: string;
  };
}

export interface CreateStoryInput {
  content_type: 'image' | 'video' | 'text';
  media_id?: string;
  text_content?: string;
  text_background_color?: string;
  text_font_style?: string;
  caption?: string;
}

// Upload story media to storage and create media record
export async function uploadStoryMedia(
  userId: string,
  file: File
): Promise<{ mediaId: string | null; url: string | null; error: any }> {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `stories/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const bucketName = 'profile-images';

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading story media:', uploadError);
    return { mediaId: null, url: null, error: uploadError };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  // Determine media type
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

  // Create media record in media table
  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .insert({
      uploader_id: userId,
      bucket: bucketName,
      path: fileName,
      filename: file.name,
      media_type: mediaType,
      mime_type: file.type,
      size_bytes: file.size,
      cdn_url: publicUrl,
    })
    .select()
    .single();

  if (mediaError) {
    console.error('Error creating media record:', mediaError);
    // Clean up uploaded file
    await supabase.storage.from(bucketName).remove([fileName]);
    return { mediaId: null, url: null, error: mediaError };
  }

  return { mediaId: mediaData.id, url: publicUrl, error: null };
}

// Create a new story
export async function createStory(
  userId: string,
  input: CreateStoryInput
): Promise<{ data: Story | null; error: any }> {
  const supabase = createClient();

  // Stories expire after 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const insertData = {
    user_id: userId,
    content_type: input.content_type,
    media_id: input.media_id || null,
    text_content: input.text_content || null,
    text_background_color: input.text_background_color || null,
    text_font_style: input.text_font_style || null,
    caption: input.caption || null,
    expires_at: expiresAt.toISOString(),
    status: 'published',
    views_count: 0,
  };

  console.log('Creating story with data:', insertData);

  const { data, error } = await supabase
    .from('stories')
    .insert(insertData)
    .select()
    .single();

  console.log('Story creation response:', { data, error });

  // Check if error has actual content (not empty object)
  const hasError = error && (error.message || error.code || error.details);
  if (hasError) {
    console.error('Error creating story:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { data: null, error };
  }

  // If we have data, it succeeded even if there's an empty error object
  if (data) {
    return { data, error: null };
  }

  // No data and no meaningful error - something went wrong
  if (!data) {
    console.error('No data returned from story creation');
    return { data: null, error: { message: 'Failed to create story - no data returned' } };
  }

  return { data, error: null };
}

// Get stories from users the current user follows (active stories only)
export async function getFollowingStories(
  userId: string
): Promise<{ data: Story[] | null; error: any }> {
  const supabase = createClient();

  try {
    // First get the list of users the current user follows
    const { data: following, error: followError } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', userId);

    const hasFollowError = followError && (followError.message || followError.code);
    if (hasFollowError) {
      console.error('Error fetching following list:', followError);
      return { data: null, error: followError };
    }

    const followingIds = following?.map(f => f.followee_id) || [];
    console.log('📖 Following IDs:', followingIds);

    // Include current user's own stories as well
    const userIdsToFetch = [...new Set([...followingIds, userId])];
    console.log('📖 User IDs to fetch stories from:', userIdsToFetch);

    if (userIdsToFetch.length === 0) {
      console.log('📖 No users to fetch stories from');
      return { data: [], error: null };
    }

    // Get active stories from followed users (including current user)
    const now = new Date().toISOString();
    console.log('📖 Fetching stories with expires_at >', now);
    
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select(`
        *,
        user:user_id (
          id,
          name,
          profile_pic_url
        ),
        media:media_id (
          id,
          cdn_url,
          media_type
        )
      `)
      .in('user_id', userIdsToFetch)
      .gt('expires_at', now)
      .order('created_at', { ascending: false });
    
    // Note: Removed status filter temporarily to debug - add back if needed
    // .eq('status', 'published')

    console.log('📖 Stories query result:', {
      storiesCount: stories?.length || 0,
      hasError: !!storiesError,
      error: storiesError
    });

    // Supabase sometimes returns an empty error object {} even on success
    // Check if error has meaningful content (message, code, details, or hint)
    const hasMeaningfulError = storiesError && (
      storiesError.message || 
      storiesError.code || 
      storiesError.details || 
      storiesError.hint
    );

    // If we have data (even empty array), return it (even if there's an empty error object)
    if (stories !== null && stories !== undefined) {
      console.log('📖 Returning stories:', stories.length);
      return { data: stories, error: null };
    }

    // Only treat as error if there's no data AND there's a meaningful error
    if (hasMeaningfulError) {
      console.error('Error fetching stories:', storiesError);
      return { data: null, error: storiesError };
    }

    // No data and no meaningful error - return empty array (successful query with no results)
    console.log('📖 No stories found, returning empty array');
    return { data: [], error: null };
  } catch (err) {
    console.error('Error in getFollowingStories:', err);
    return { data: null, error: err };
  }
}

// Get current user's active stories
export async function getUserStories(
  userId: string
): Promise<{ data: Story[] | null; error: any }> {
  const supabase = createClient();

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      media:media_id (
        id,
        cdn_url,
        media_type
      )
    `)
    .eq('user_id', userId)
    .gt('expires_at', now)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  // Check if error has actual content (not empty object)
  const hasError = error && (error.message || error.code || error.details || error.hint);
  
  // If we have data, return it even if there's an empty error object
  if (data) {
    return { data, error: null };
  }

  // Only treat as error if there's no data AND there's a meaningful error
  if (hasError) {
    console.error('Error fetching user stories:', error);
    return { data: null, error };
  }

  // No data and no meaningful error - return empty array
  return { data: [], error: null };
}

// Mark a story as viewed
export async function viewStory(
  storyId: string,
  viewerId: string
): Promise<{ error: any }> {
  const supabase = createClient();

  // Insert view record
  const { error: viewError } = await supabase
    .from('story_views')
    .upsert({
      story_id: storyId,
      viewer_id: viewerId,
      viewed_at: new Date().toISOString(),
    }, {
      onConflict: 'story_id,viewer_id',
      ignoreDuplicates: true,
    });

  if (viewError) {
    console.error('Error recording story view:', viewError);
  }

  // Increment views count
  await supabase
    .from('stories')
    .update({ views_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', storyId);

  return { error: null };
}

// Delete a story
export async function deleteStory(
  storyId: string,
  userId: string
): Promise<{ error: any }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('stories')
    .update({ status: 'deleted', deleted_at: new Date().toISOString() })
    .eq('id', storyId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting story:', error);
    return { error };
  }

  return { error: null };
}

// Get all stories grouped by user (for story carousel display)
export async function getStoriesGroupedByUser(
  userId: string
): Promise<{ data: { user: Story['user']; stories: Story[]; hasUnviewed: boolean }[] | null; error: any }> {
  const supabase = createClient();

  try {
    const { data: stories, error: storiesError } = await getFollowingStories(userId);

    if (storiesError || !stories) {
      return { data: null, error: storiesError };
    }

    // Get current user's profile info to ensure it's included for their own stories
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('id, name, profile_pic_url')
      .eq('id', userId)
      .single();

    // Get viewed story IDs for current user
    const storyIds = stories.map(s => s.id);
    let viewedStoryIds: Set<string> = new Set();

    if (storyIds.length > 0) {
      const { data: views } = await supabase
        .from('story_views')
        .select('story_id')
        .eq('viewer_id', userId)
        .in('story_id', storyIds);

      if (views) {
        viewedStoryIds = new Set(views.map(v => v.story_id));
      }
    }

    // Group stories by user
    const userStoriesMap = new Map<string, { user: Story['user']; stories: Story[]; hasUnviewed: boolean }>();

    stories.forEach(story => {
      const storyUserId = story.user_id;
      if (!userStoriesMap.has(storyUserId)) {
        // If this is the current user's story and user object is missing, use profile data
        let userInfo = story.user;
        if (storyUserId === userId && (!userInfo || !userInfo.name)) {
          userInfo = currentUserProfile ? {
            id: currentUserProfile.id,
            name: currentUserProfile.name || 'You',
            profile_pic_url: currentUserProfile.profile_pic_url || undefined,
          } : {
            id: userId,
            name: 'You',
            profile_pic_url: undefined,
          };
        }
        
        userStoriesMap.set(storyUserId, {
          user: userInfo,
          stories: [],
          hasUnviewed: false,
        });
      }

      const userEntry = userStoriesMap.get(storyUserId)!;
      userEntry.stories.push(story);

      if (!viewedStoryIds.has(story.id)) {
        userEntry.hasUnviewed = true;
      }
    });

    return { data: Array.from(userStoriesMap.values()), error: null };
  } catch (err) {
    console.error('Error in getStoriesGroupedByUser:', err);
    return { data: null, error: err };
  }
}
