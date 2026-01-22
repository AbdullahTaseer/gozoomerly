import { useState, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import {
  GetUserInvitationsInput,
  UserInvitation,
  InvitationCounts,
  InvitationPaginationMetadata,
  InvitationStatus
} from '../types/userInvitations';

interface UseGetUserInvitationsReturn {
  invitations: UserInvitation[];
  counts: InvitationCounts;
  pagination: InvitationPaginationMetadata;
  filterApplied: InvitationStatus;
  isLoading: boolean;
  error: string | null;
  fetchUserInvitations: (params: GetUserInvitationsInput) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  declineInvitation: (invitationId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  refetch: () => Promise<void>;
}

export const useGetUserInvitations = (): UseGetUserInvitationsReturn => {
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [counts, setCounts] = useState<InvitationCounts>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0
  });
  const [pagination, setPagination] = useState<InvitationPaginationMetadata>({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
    per_page: 10,
    has_next: false,
    has_prev: false
  });
  const [filterApplied, setFilterApplied] = useState<InvitationStatus>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<GetUserInvitationsInput | null>(null);

  const fetchUserInvitations = useCallback(async (params: GetUserInvitationsInput) => {
    setIsLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const supabase = createClient();

      const { data, error: rpcError } = await supabase.rpc(
        "get_user_invitations"
      );

      if (rpcError) {
        const errorMessage = rpcError.message || 'Failed to fetch user invitations';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      if (data) {

        const invitationsArray = Array.isArray(data) ? data : (data.invitations || []);

        const uniqueInvitations = invitationsArray.filter(
          (invitation: any, index: number, self: any[]) =>
            index === self.findIndex((i) => i.id === invitation.id)
        );

        setInvitations(uniqueInvitations);
        setCounts({
          total: uniqueInvitations.length,
          pending: uniqueInvitations.filter((i: any) => i.status === 'pending').length,
          accepted: uniqueInvitations.filter((i: any) => i.status === 'accepted').length,
          declined: uniqueInvitations.filter((i: any) => i.status === 'declined').length
        });
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_records: uniqueInvitations.length,
          per_page: params.p_limit || 10,
          has_next: false,
          has_prev: false
        });
        setFilterApplied(params.p_status || null);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user invitations';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptInvitation = useCallback(async (invitationId: string) => {
    try {
      const supabase = createClient();

      const { data, error: rpcError } = await supabase.rpc('accept_board_invitation', {
        p_invitation_id: invitationId
      });

      if (rpcError) {
        return { success: false, error: rpcError.message };
      }

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setCounts(prev => ({
        ...prev,
        total: prev.total - 1,
        pending: prev.pending - 1,
        accepted: prev.accepted + 1
      }));

      return { success: true, data };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      return { success: false, error: errorMessage };
    }
  }, []);

  const declineInvitation = useCallback(async (invitationId: string) => {
    try {
      const supabase = createClient();

      const { data, error: rpcError } = await supabase.rpc('decline_board_invitation', {
        p_invitation_id: invitationId
      });

      if (rpcError) {
        return { success: false, error: rpcError.message };
      }

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setCounts(prev => ({
        ...prev,
        total: prev.total - 1,
        pending: prev.pending - 1,
        declined: prev.declined + 1
      }));

      return { success: true, data };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline invitation';
      return { success: false, error: errorMessage };
    }
  }, []);

  const refetch = useCallback(async () => {
    if (lastParams) {
      await fetchUserInvitations(lastParams);
    }
  }, [lastParams, fetchUserInvitations]);

  return {
    invitations,
    counts,
    pagination,
    filterApplied,
    isLoading,
    error,
    fetchUserInvitations,
    acceptInvitation,
    declineInvitation,
    refetch
  };
};
