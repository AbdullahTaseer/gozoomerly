export interface GetSpotlightBoardsInput {
  p_limit?: number;
  p_offset?: number;
}

export interface SpotlightBoard {
  id: string;
  name: string;
  description: string;
  spotlight_img: string;
  participants: number;
  wished: number;
  supports: number;
  memories: number;
  chats: number;
  raised: number;
  target: number;
  organizer_name: string;
  organizer_avatar: string;
  organizer_hometown: string;
  top_contributors: string[];
}

export interface SpotlightPaginationMetadata {
  current_page: number;
  total_pages: number;
  total_records: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}
