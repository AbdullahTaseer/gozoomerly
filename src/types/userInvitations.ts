export type InvitationStatus = 'pending' | 'accepted' | 'declined' | null;

export interface GetUserInvitationsInput {
  p_user_id: string;
  p_status?: InvitationStatus;
  p_limit?: number;
  p_offset?: number;
}

export interface InviterDetails {
  id: string;
  name: string;
  profile_pic_url?: string;
}

export interface BoardDetails {
  id: string;
  title: string;
  slug: string;
  description?: string;
  honoree_details?: {
    first_name?: string;
    last_name?: string;
    profile_photo_url?: string;
    theme_color?: string;
  };
  cover_image?: {
    url?: string;
    thumbnails?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

export interface UserInvitation {
  id: string;
  board_id: string;
  inviter_id: string;
  invitee_user_id?: string | null;
  invitee_id?: string;
  invitee_email?: string;
  invitee_phone?: string;
  invitation_code: string;
  status: 'pending' | 'accepted' | 'declined';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  inviter?: InviterDetails;
  board?: BoardDetails;
}

export interface InvitationCounts {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

export interface InvitationPaginationMetadata {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}
