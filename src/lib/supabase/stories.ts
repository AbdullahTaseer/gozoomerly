import { createClient } from './client';
import { STORAGE_BUCKETS } from './storageBuckets';

/** Browsers often omit MIME for .mov or use application/octet-stream — infer from extension. */
const VIDEO_EXT_TO_MIME: Record<string, string> = {
  mp4: 'video/mp4',
  /** Use video/mp4, not video/quicktime — Supabase Storage allowlists often reject QuickTime (415 invalid_mime_type). */
  mov: 'video/mp4',
  webm: 'video/webm',
  m4v: 'video/x-m4v',
  ogv: 'video/ogg',
  ogm: 'video/ogg',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
};

const IMAGE_EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
};

function extensionFromFilename(name: string): string | undefined {
  const part = name.split('.').pop();
  return part ? part.toLowerCase() : undefined;
}

/** Effective type for storage + DB when the browser omits or misreports MIME (common for .mov). */
export function getEffectiveStoryMimeType(file: File): string {
  const raw = file.type?.trim();
  if (raw === 'video/quicktime') {
    return 'video/mp4';
  }
  if (raw && raw !== 'application/octet-stream') {
    return raw;
  }
  const ext = extensionFromFilename(file.name);
  if (ext && VIDEO_EXT_TO_MIME[ext]) {
    return VIDEO_EXT_TO_MIME[ext];
  }
  if (ext && IMAGE_EXT_TO_MIME[ext]) {
    return IMAGE_EXT_TO_MIME[ext];
  }
  return raw || 'application/octet-stream';
}

export function isStoryVideoFile(file: File): boolean {
  if (file.type?.trim().startsWith('video/')) {
    return true;
  }
  const ext = extensionFromFilename(file.name);
  return ext ? Boolean(VIDEO_EXT_TO_MIME[ext]) : false;
}

/**
 * Supabase Storage uploads use FormData + the Blob's `.type` for MIME validation — the
 * `contentType` option is not applied to Blob bodies. Re-wrap when the effective type differs.
 */
export function getFileForStoryUpload(file: File): File {
  const effectiveMime = getEffectiveStoryMimeType(file);
  const declared = file.type?.trim() || '';
  if (effectiveMime === declared) {
    return file;
  }
  return new File([file], file.name, {
    type: effectiveMime,
    lastModified: file.lastModified,
  });
}

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

export async function uploadStoryMedia(
  userId: string,
  file: File
): Promise<{ mediaId: string | null; url: string | null; error: any }> {
  const supabase = createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `stories/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const bucketName = STORAGE_BUCKETS.STORY_MEDIA;

  const uploadFile = getFileForStoryUpload(file);
  const effectiveMime = getEffectiveStoryMimeType(file);
  const mediaType = isStoryVideoFile(file) ? 'video' : 'image';

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, uploadFile, {
      contentType: effectiveMime,
      upsert: false,
    });

  if (uploadError) {
    return { mediaId: null, url: null, error: uploadError };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .insert({
      uploader_id: userId,
      bucket: bucketName,
      path: fileName,
      filename: file.name,
      media_type: mediaType,
      mime_type: effectiveMime,
      size_bytes: file.size,
      cdn_url: publicUrl,
    })
    .select()
    .single();

  if (mediaError) {
    await supabase.storage.from(bucketName).remove([fileName]);
    return { mediaId: null, url: null, error: mediaError };
  }

  return { mediaId: mediaData.id, url: publicUrl, error: null };
}

export async function createStory(
  userId: string,
  input: CreateStoryInput
): Promise<{ data: Story | null; error: any }> {
  const supabase = createClient();

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

  const { data, error } = await supabase
    .from('stories')
    .insert(insertData)
    .select()
    .single();

  const hasError = error && (error.message || error.code || error.details);
  if (hasError) {
    return { data: null, error };
  }

  if (data) {
    return { data, error: null };
  }

  if (!data) {
    return { data: null, error: { message: 'Failed to create story - no data returned' } };
  }

  return { data, error: null };
}

export async function getFollowingStories(
  userId: string
): Promise<{ data: Story[] | null; error: any }> {
  const supabase = createClient();

  try {
    const { data: following, error: followError } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', userId);

    const hasFollowError = followError && (followError.message || followError.code);
    if (hasFollowError) {
      return { data: null, error: followError };
    }

    const followingIds = following?.map(f => f.followee_id) || [];
    const userIdsToFetch = [...new Set([...followingIds, userId])];

    if (userIdsToFetch.length === 0) {
      return { data: [], error: null };
    }

    const now = new Date().toISOString();

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
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    const hasMeaningfulError = storiesError && (
      storiesError.message ||
      storiesError.code ||
      storiesError.details ||
      storiesError.hint
    );

    if (stories !== null && stories !== undefined) {
      return { data: stories, error: null };
    }

    if (hasMeaningfulError) {
      return { data: null, error: storiesError };
    }

    return { data: [], error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

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

  const hasError = error && (error.message || error.code || error.details || error.hint);

  if (data) {
    return { data, error: null };
  }

  if (hasError) {
    return { data: null, error };
  }

  return { data: [], error: null };
}

export async function viewStory(
  storyId: string,
  viewerId: string
): Promise<{ error: any }> {
  const supabase = createClient();

  await supabase
    .from('story_views')
    .upsert({
      story_id: storyId,
      viewer_id: viewerId,
      viewed_at: new Date().toISOString(),
    }, {
      onConflict: 'story_id,viewer_id',
      ignoreDuplicates: true,
    });

  await supabase
    .from('stories')
    .update({ views_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', storyId);

  return { error: null };
}

export async function deleteStory(
  storyId: string,
  userId: string
): Promise<{ error: any }> {
  const supabase = createClient();

  // First try soft delete (update status)
  const { error: updateError } = await supabase
    .from('stories')
    .update({ status: 'deleted', deleted_at: new Date().toISOString() })
    .eq('id', storyId)
    .eq('user_id', userId);

  // If soft delete fails (maybe deleted_at column doesn't exist), try just updating status
  if (updateError) {
    const { error: statusError } = await supabase
      .from('stories')
      .update({ status: 'deleted' })
      .eq('id', storyId)
      .eq('user_id', userId);

    if (statusError) {
      // If both fail, try hard delete
      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', userId);

      if (deleteError) {
        return { error: deleteError };
      }
    }
  }

  return { error: null };
}

export async function getStoriesGroupedByUser(
  userId: string
): Promise<{ data: { user: Story['user']; stories: Story[]; hasUnviewed: boolean }[] | null; error: any }> {
  const supabase = createClient();

  try {
    const { data: stories, error: storiesError } = await getFollowingStories(userId);

    if (storiesError || !stories) {
      return { data: null, error: storiesError };
    }

    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('id, name, profile_pic_url')
      .eq('id', userId)
      .single();

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

    const userStoriesMap = new Map<string, { user: Story['user']; stories: Story[]; hasUnviewed: boolean }>();

    stories.forEach(story => {
      const storyUserId = story.user_id;
      if (!userStoriesMap.has(storyUserId)) {
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
    return { data: null, error: err };
  }
}
