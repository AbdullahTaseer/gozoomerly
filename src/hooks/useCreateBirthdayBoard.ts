import { useState } from 'react';
import { createClient } from '../lib/supabase/client';
import {
  CreateBirthdayBoardInput,
  BirthdayBoard
} from '../types/board';

interface CreateBoardParams extends CreateBirthdayBoardInput {}

export const useCreateBirthdayBoard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBirthdayBoard = async (params: CreateBoardParams): Promise<BirthdayBoard | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Ensure board_type_id is properly formatted
      const boardTypeId = typeof params.p_board_type_id === 'string'
        ? (isNaN(parseInt(params.p_board_type_id)) ? params.p_board_type_id : parseInt(params.p_board_type_id))
        : params.p_board_type_id;

      console.log('Creating birthday board with RPC params:', {
        p_board_type_id: boardTypeId,
        p_title: params.p_title,
        p_honoree_first_name: params.p_honoree_first_name,
        p_honoree_last_name: params.p_honoree_last_name
      });

      // Call Supabase RPC function
      console.log('Calling create_birthday_board RPC...');
      const { data, error: rpcError } = await supabase.rpc('create_birthday_board', {
        p_board_type_id: boardTypeId,
        p_title: params.p_title,
        p_honoree_first_name: params.p_honoree_first_name,
        p_honoree_last_name: params.p_honoree_last_name,
        p_honoree_date_of_birth: params.p_honoree_date_of_birth,
        p_honoree_hometown: params.p_honoree_hometown,
        p_description: params.p_description || null,
        p_honoree_phone: params.p_honoree_phone || null,
        p_honoree_email: params.p_honoree_email || null,
        p_honoree_profile_photo_url: params.p_honoree_profile_photo_url || null,
        p_honoree_theme_color: params.p_honoree_theme_color || null,
        p_surprise_mode_enabled: params.p_surprise_mode_enabled ?? false,
        p_theme: params.p_theme || 'fun-colorful',
        p_target_amount: params.p_target_amount || null,
        p_expiry_date: params.p_expiry_date || null,
        p_currency: params.p_currency || 'USD',
        p_privacy: params.p_privacy || 'public',
        p_allow_invites: params.p_allow_invites ?? true,
        p_invites_can_invite: params.p_invites_can_invite ?? false,
        p_cover_media_id: params.p_cover_media_id || null,
        p_seo_meta_tags: params.p_seo_meta_tags || null
      });

      console.log('RPC response:', { data, rpcError });

      // Check if rpcError has actual error content (not just empty object)
      const hasRpcError = rpcError && (rpcError.message || rpcError.code || rpcError.details);

      if (hasRpcError) {
        const errorMessage = rpcError.message || rpcError.details || rpcError.hint || 'Failed to create birthday board';
        setError(errorMessage);
        console.error('Error creating birthday board:', {
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          code: rpcError.code,
          full: JSON.stringify(rpcError)
        });
        throw new Error(errorMessage);
      }

      // If rpcError is empty object but data is null/undefined, something went wrong
      if (!data && rpcError) {
        console.error('RPC returned empty error object:', rpcError);
        // Try to continue if we have data, otherwise throw generic error
        if (!data) {
          const errorMessage = 'Failed to create birthday board - no response received';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Check if data contains an error response
      if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        const errorMessage = (data as any).message || (data as any).error || 'Failed to create birthday board';
        setError(errorMessage);
        console.error('RPC returned error response:', data);
        throw new Error(errorMessage);
      }

      // Parse response - handle various response formats
      let response = data;
      if (data && typeof data === 'object') {
        if ('data' in data) {
          response = (data as any).data;
        }
      }

      console.log('Parsed response:', response);

      // If response has success field and it's false, throw error
      if (response && typeof response === 'object' && 'success' in response && !(response as any).success) {
        const errorMessage = (response as any).message || 'Failed to create birthday board';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Return the board data
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as any).data;
      }

      return response as BirthdayBoard;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create birthday board';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBirthdayBoard,
    isLoading,
    error
  };
};
