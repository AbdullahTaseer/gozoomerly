/**
 * Pagination for admin list RPCs (and matching admin UI).
 *
 * - p_limit: {@link ADMIN_LIST_LIMIT}
 * - First page: p_offset = 0
 * - Next page: p_offset = previous_offset + p_limit
 */
export const ADMIN_LIST_LIMIT = 15;

/** Zero-based page index → p_offset (page 0 → 0, page 1 → 20, …). */
export function adminListOffset(pageIndex: number): number {
  return pageIndex * ADMIN_LIST_LIMIT;
}
