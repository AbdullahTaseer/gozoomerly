export type BoardStatus = 'live' | 'past' | 'new' | null;

export interface GetUserBoardsInput {
  p_user_id: string;
  p_status?: BoardStatus;
  p_limit?: number;
  p_offset?: number;
}

export interface HonoreeDetails {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  hometown?: string;
  phone?: string;
  email?: string;
  profile_photo_url?: string;
  theme_color?: string;
}

export interface CoverImage {
  url: string;
  thumbnail_small?: string;
  thumbnail_medium?: string;
  thumbnail_large?: string;
}

export interface BoardType {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color_scheme?: Record<string, string>;
}

export interface UserBoard {
  id: string;
  creator_id: string;
  board_type_id?: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details?: HonoreeDetails;
  cover_media_id?: string;
  cover_image?: CoverImage;
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
  views_count: number;
  shares_count: number;
  participants_count: number;
  memories_count: number;
  last_activity_at?: string;
  meta_tags?: Record<string, any>;
  created_at: string;
  updated_at: string;
  board_type?: BoardType;
  topContributors?: string[];
}

export interface BoardCounts {
  total: number;
  live: number;
  past: number;
  new: number;
}

export interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface BoardFilters {
  status?: BoardStatus;
  search?: string;
  sortBy?: 'created_at' | 'deadline_date' | 'total_raised' | 'participants_count';
  sortOrder?: 'asc' | 'desc';
}
