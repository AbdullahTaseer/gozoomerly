/** Supabase Storage bucket names — use consistently across uploads */
export const STORAGE_BUCKETS = {
  /** Chat attachments */
  CHAT_MEDIA: 'chat-media',
  /** Story media */
  STORY_MEDIA: 'story-media',
  /**
   * Board-related media: wishes, Add Files flow, board cover (`cover_media_id`),
   * and honoree profile photo during board creation — all use `wish-media`.
   */
  WISH_MEDIA: 'wish-media',
  /** User account profile photo (settings, signup profile pic) — not board flows */
  PROFILE_IMAGES: 'profile-images',
} as const;
