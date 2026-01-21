import { useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import {
  GetSpotlightBoardsInput,
  SpotlightBoard,
  SpotlightPaginationMetadata
} from '../types/spotlightBoards';

interface UseGetSpotlightBoardsReturn {
  spotlightBoards: SpotlightBoard[];
  pagination: SpotlightPaginationMetadata;
  isLoading: boolean;
  error: string | null;
  fetchSpotlightBoards: (params?: GetSpotlightBoardsInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGetSpotlightBoards = (): UseGetSpotlightBoardsReturn => {
  const [spotlightBoards, setSpotlightBoards] = useState<SpotlightBoard[]>([]);
  const [pagination, setPagination] = useState<SpotlightPaginationMetadata>({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
    per_page: 10,
    has_next: false,
    has_prev: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<GetSpotlightBoardsInput | null>(null);

  const fetchSpotlightBoards = useCallback(async (params?: GetSpotlightBoardsInput) => {
    const rpcParams = {
      p_limit: params?.p_limit ?? 10,
      p_offset: params?.p_offset ?? 0,
    };

    console.log('🚀 Fetching active spotlight boards...');
    setIsLoading(true);
    setError(null);
    setLastParams(params || {});

    try {
      const supabase = createClient();

      const { data, error: rpcError } = await supabase.rpc(
        'get_spotlight_boards',
        rpcParams
      );

      console.log('get_spotlight_boards RPC response:', { data, error: rpcError });

      if (rpcError) {
        const errorMessage = rpcError.message || 'Failed to fetch spotlight boards';
        setError(errorMessage);
        console.error('Error fetching spotlight boards:', rpcError);
        throw new Error(errorMessage);
      }

      if (data) {
        const responseData = data.data || data;
        const boardsArray = responseData.boards || responseData || [];

        // Map the response to our SpotlightBoard interface
        const mappedBoards: SpotlightBoard[] = boardsArray.map((board: any) => ({
          id: board.id || board.board_id,
          name: board.name || board.honoree_name || board.title || '',
          description: board.description || '',
          spotlight_img: board.spotlight_img || board.cover_image?.url || board.cover_image || '',
          participants: board.participants || board.participants_count || 0,
          wished: board.wished || board.wishes_count || 0,
          supports: board.supports || board.contributors_count || 0,
          memories: board.memories || board.memories_count || 0,
          chats: board.chats || board.chats_count || 0,
          raised: board.raised || board.total_raised || 0,
          target: board.target || board.goal_amount || 0,
          organizer_name: board.organizer_name || board.creator?.name || '',
          organizer_avatar: board.organizer_avatar || board.creator?.profile_pic_url || '',
          organizer_hometown: board.organizer_hometown || board.creator?.hometown || '',
          top_contributors: board.top_contributors || []
        }));

        setSpotlightBoards(mappedBoards);
        setPagination(responseData.pagination || {
          current_page: 1,
          total_pages: Math.ceil((responseData.total || mappedBoards.length) / rpcParams.p_limit),
          total_records: responseData.total || mappedBoards.length,
          per_page: rpcParams.p_limit,
          has_next: (responseData.total || mappedBoards.length) > rpcParams.p_offset + rpcParams.p_limit,
          has_prev: rpcParams.p_offset > 0
        });
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch spotlight boards';
      setError(errorMessage);
      console.error('Error fetching spotlight boards:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchSpotlightBoards(lastParams || undefined);
  }, [lastParams, fetchSpotlightBoards]);

  return {
    spotlightBoards,
    pagination,
    isLoading,
    error,
    fetchSpotlightBoards,
    refetch
  };
};
