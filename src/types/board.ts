export interface CreateBirthdayBoardInput {
  // Required parameters
  p_board_type_id: number | string;
  p_title: string;
  p_honoree_first_name: string;
  p_honoree_last_name: string;
  p_honoree_date_of_birth: string; // Format: YYYY-MM-DD
  p_honoree_hometown: string;
  
  // Optional parameters
  p_description?: string;
  p_honoree_phone?: string;
  p_honoree_email?: string;
  p_honoree_profile_photo_url?: string;
  p_honoree_theme_color?: string;
  p_surprise_mode_enabled?: boolean;
  p_theme?: string;
  p_target_amount?: number;
  p_expiry_date?: string; // Format: YYYY-MM-DD
  p_currency?: string;
  p_privacy?: 'public' | 'private';
  p_allow_invites?: boolean;
  p_invites_can_invite?: boolean;
  p_cover_media_id?: number;
  p_seo_meta_tags?: Record<string, any>;
}

export interface BirthdayBoard {
  id: string;
  creator_id: string;
  board_type_id: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    hometown: string;
    phone?: string;
    email?: string;
    profile_photo_url?: string;
    theme_color?: string;
  };
  cover_media_id?: string;
  goal_type: 'monetary' | 'nonmonetary';
  goal_amount?: number;
  currency: string;
  deadline_date?: string;
  privacy: 'public' | 'private' | 'circle_only';
  allow_invites: boolean;
  invites_can_invite: boolean;
  status: 'draft' | 'live' | 'published' | 'completed' | 'cancelled';
  surprise_mode_enabled: boolean;
  theme?: string;
  published_at?: string;
  total_raised: number;
  contributors_count: number;
  wishes_count: number;
  views_count: number;
  shares_count: number;
  last_activity_at?: string;
  meta_tags?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateBirthdayBoardResponse {
  createBirthdayBoard: {
    success: boolean;
    data: BirthdayBoard;
    message?: string;
  };
}

export interface CreateBirthdayBoardVariables {
  input: CreateBirthdayBoardInput;
}
