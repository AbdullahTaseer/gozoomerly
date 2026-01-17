/**
 * Helper functions for working with User Boards data
 * 
 * This file provides utility functions for filtering, sorting, and
 * processing user board data.
 */

import { UserBoard, BoardStatus, BoardFilters } from '../types/userBoards';

/**
 * Determines the status filter based on board properties
 */
export function getBoardStatusFilter(board: UserBoard): BoardStatus {
  // New boards: created within last 7 days and not yet deadline
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const createdDate = new Date(board.created_at);
  
  if (createdDate >= sevenDaysAgo && board.status === 'published') {
    if (!board.deadline_date || new Date(board.deadline_date) > new Date()) {
      return 'new';
    }
  }

  // Past boards: completed, cancelled, or past deadline
  if (board.status === 'completed' || board.status === 'cancelled') {
    return 'past';
  }
  
  if (board.deadline_date && new Date(board.deadline_date) < new Date()) {
    return 'past';
  }

  // Live boards: published and active
  if (board.status === 'published') {
    return 'live';
  }

  return null;
}

/**
 * Checks if a board is active/live
 */
export function isBoardLive(board: UserBoard): boolean {
  return (
    board.status === 'published' &&
    (!board.deadline_date || new Date(board.deadline_date) > new Date())
  );
}

/**
 * Checks if a board is past/expired
 */
export function isBoardPast(board: UserBoard): boolean {
  return (
    board.status === 'completed' ||
    board.status === 'cancelled' ||
    (board.deadline_date ? new Date(board.deadline_date) < new Date() : false)
  );
}

/**
 * Checks if a board is new (created within last 7 days)
 */
export function isBoardNew(board: UserBoard): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(board.created_at) >= sevenDaysAgo && isBoardLive(board);
}

/**
 * Formats the fundraising progress as a percentage
 */
export function getFundraisingProgress(board: UserBoard): number {
  if (board.goal_type !== 'monetary' || !board.goal_amount || board.goal_amount === 0) {
    return 0;
  }
  return Math.min(100, Math.round((board.total_raised / board.goal_amount) * 100));
}

/**
 * Gets a human-readable status label
 */
export function getStatusLabel(status: BoardStatus): string {
  switch (status) {
    case 'live':
      return 'Active';
    case 'past':
      return 'Past';
    case 'new':
      return 'New';
    default:
      return 'All';
  }
}

/**
 * Formats the deadline date relative to now
 */
export function getDeadlineStatus(deadline?: string): {
  label: string;
  isUrgent: boolean;
  daysRemaining: number;
} {
  if (!deadline) {
    return { label: 'No deadline', isUrgent: false, daysRemaining: Infinity };
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Expired', isUrgent: false, daysRemaining: diffDays };
  } else if (diffDays === 0) {
    return { label: 'Ends today', isUrgent: true, daysRemaining: 0 };
  } else if (diffDays === 1) {
    return { label: 'Ends tomorrow', isUrgent: true, daysRemaining: 1 };
  } else if (diffDays <= 3) {
    return { label: `${diffDays} days left`, isUrgent: true, daysRemaining: diffDays };
  } else if (diffDays <= 7) {
    return { label: `${diffDays} days left`, isUrgent: false, daysRemaining: diffDays };
  } else {
    return { label: `${diffDays} days left`, isUrgent: false, daysRemaining: diffDays };
  }
}

/**
 * Gets the cover image URL with fallback
 */
export function getCoverImageUrl(
  board: UserBoard,
  size: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | undefined {
  if (!board.cover_image) return undefined;

  switch (size) {
    case 'small':
      return board.cover_image.thumbnail_small || board.cover_image.url;
    case 'medium':
      return board.cover_image.thumbnail_medium || board.cover_image.url;
    case 'large':
      return board.cover_image.thumbnail_large || board.cover_image.url;
    case 'original':
    default:
      return board.cover_image.url;
  }
}

/**
 * Gets the honoree's full name
 */
export function getHonoreeName(board: UserBoard): string {
  if (!board.honoree_details) return 'Unknown';
  
  const { first_name, last_name } = board.honoree_details;
  return `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown';
}

/**
 * Filters boards locally (for client-side filtering)
 */
export function filterBoards(boards: UserBoard[], filters: BoardFilters): UserBoard[] {
  let filtered = [...boards];

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(board => {
      switch (filters.status) {
        case 'live':
          return isBoardLive(board);
        case 'past':
          return isBoardPast(board);
        case 'new':
          return isBoardNew(board);
        default:
          return true;
      }
    });
  }

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(board => {
      return (
        board.title.toLowerCase().includes(searchLower) ||
        board.description?.toLowerCase().includes(searchLower) ||
        getHonoreeName(board).toLowerCase().includes(searchLower)
      );
    });
  }

  // Sort boards
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'deadline_date':
          aValue = a.deadline_date ? new Date(a.deadline_date).getTime() : Infinity;
          bValue = b.deadline_date ? new Date(b.deadline_date).getTime() : Infinity;
          break;
        case 'total_raised':
          aValue = a.total_raised;
          bValue = b.total_raised;
          break;
        case 'participants_count':
          aValue = a.participants_count;
          bValue = b.participants_count;
          break;
        default:
          return 0;
      }

      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : aValue < bValue ? -order : 0;
    });
  }

  return filtered;
}

/**
 * Groups boards by status
 */
export function groupBoardsByStatus(boards: UserBoard[]): {
  live: UserBoard[];
  past: UserBoard[];
  new: UserBoard[];
  draft: UserBoard[];
} {
  return {
    live: boards.filter(isBoardLive),
    past: boards.filter(isBoardPast),
    new: boards.filter(isBoardNew),
    draft: boards.filter(board => board.status === 'draft')
  };
}

/**
 * Calculates pagination info
 */
export function calculatePagination(
  currentPage: number,
  totalRecords: number,
  perPage: number
) {
  const totalPages = Math.ceil(totalRecords / perPage);
  return {
    current_page: currentPage,
    total_pages: totalPages,
    total_records: totalRecords,
    per_page: perPage,
    has_next: currentPage < totalPages,
    has_prev: currentPage > 1
  };
}

/**
 * Gets engagement summary
 */
export function getEngagementSummary(board: UserBoard): {
  total: number;
  label: string;
} {
  const total =
    board.participants_count +
    board.wishes_count +
    board.contributors_count +
    board.memories_count;

  let label = '';
  if (total === 0) {
    label = 'No engagement yet';
  } else if (total === 1) {
    label = '1 interaction';
  } else {
    label = `${total} interactions`;
  }

  return { total, label };
}
