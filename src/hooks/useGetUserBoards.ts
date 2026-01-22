import { useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import {
  GetUserBoardsInput,
  UserBoard,
  BoardCounts,
  PaginationMetadata,
  BoardStatus
} from '../types/userBoards';

interface UseGetUserBoardsReturn {
  boards: UserBoard[];
  counts: BoardCounts;
  pagination: PaginationMetadata;
  filterApplied: BoardStatus;
  isLoading: boolean;
  error: string | null;
  fetchUserBoards: (params: GetUserBoardsInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetUserBoards = (): UseGetUserBoardsReturn => {
  const [boards, setBoards] = useState<UserBoard[]>([]);
  const [counts, setCounts] = useState<BoardCounts>({
    total: 0,
    live: 0,
    past: 0,
    new: 0
  });
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
    per_page: 10,
    has_next: false,
    has_prev: false
  });
  const [filterApplied, setFilterApplied] = useState<BoardStatus>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<GetUserBoardsInput | null>(null);

  const fetchUserBoards = useCallback(async (params: GetUserBoardsInput) => {
    setIsLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const supabase = createClient();

      const { data, error: rpcError } = await supabase.rpc('get_user_boards', {
        p_user_id: params.p_user_id,
        p_status: params.p_status || null,
        p_limit: params.p_limit || 10,
        p_offset: params.p_offset || 0
      });

      if (rpcError) {
        const errorMessage = rpcError.message || 'Failed to fetch user boards';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (data) {

        const responseData = data.data || data;

        const boardsArray = responseData.boards || [];
        const uniqueBoards = boardsArray.filter(
          (board: UserBoard, index: number, self: UserBoard[]) =>
            index === self.findIndex((b) => b.id === board.id)
        );

        setBoards(uniqueBoards);
        setCounts(responseData.counts || { total: 0, live: 0, past: 0, new: 0 });
        setPagination(responseData.pagination || {
          current_page: 1,
          total_pages: 0,
          total_records: 0,
          per_page: params.p_limit || 10,
          has_next: false,
          has_prev: false
        });
        setFilterApplied(responseData.filter_applied || params.p_status || null);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user boards';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (lastParams) {
      await fetchUserBoards(lastParams);
    }
  }, [lastParams, fetchUserBoards]);

  return {
    boards,
    counts,
    pagination,
    filterApplied,
    isLoading,
    error,
    fetchUserBoards,
    refetch
  };
};
