import { createClient } from '@/lib/supabase/client';
import { sendNotification } from './sendNotification';



interface InvitationRow {
  id: string;
  board_id: string | null;
  inviter_id: string | null;
  invitee_user_id: string | null;
  status: string | null;
}

interface BoardRow {
  id: string;
  title: string | null;
  slug: string | null;
}

async function fetchBoard(boardId: string): Promise<BoardRow | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('boards')
    .select('id, title, slug')
    .eq('id', boardId)
    .maybeSingle();
  return (data as BoardRow) || null;
}

async function fetchProfileName(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .maybeSingle();
  return (data as { name?: string | null } | null)?.name ?? null;
}

function boardUrl(board: BoardRow | null): string {
  if (board?.slug) return `/u/boards/${board.slug}`;
  if (board?.id) return `/u/boards/${board.id}`;
  return '/u/home';
}

export interface NotifyBoardInvitationSentParams {
  boardId: string;
  inviterId: string;
  inviteeUserId: string;
  /** Optional — if the caller already knows the invitation id we'll use it. */
  invitationId?: string | null;
}

export function notifyBoardInvitationSent(
  params: NotifyBoardInvitationSentParams
): void {
  void (async () => {
    try {
      const supabase = createClient();

      let invitationId = params.invitationId ?? null;
      if (!invitationId) {
        const { data } = await supabase
          .from('board_invitations')
          .select('id')
          .eq('board_id', params.boardId)
          .eq('inviter_id', params.inviterId)
          .eq('invitee_user_id', params.inviteeUserId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        invitationId = (data as { id?: string } | null)?.id ?? null;
      }

      if (!invitationId) return;

      const [inviterName, board] = await Promise.all([
        fetchProfileName(params.inviterId),
        fetchBoard(params.boardId),
      ]);

      const title = `${inviterName || 'Someone'} invited you to join ${
        board?.title || 'a board'
      }`;

      await sendNotification({
        recipient_id: params.inviteeUserId,
        actor_id: params.inviterId,
        type: 'invitation',
        title,
        body: 'Tap to review the invitation.',
        board_id: params.boardId,
        data: {
          invitation_id: invitationId,
          board_id: params.boardId,
          action: 'sent',
          url: '/u/home',
        },
        url: '/u/home',
      });
    } catch (err) {
      console.warn('[notifyBoardInvitationSent] failed:', err);
    }
  })();
}

export interface NotifyBoardInvitationResponseParams {
  invitationId: string;
  accepted: boolean;
}

export function notifyBoardInvitationResponse(
  params: NotifyBoardInvitationResponseParams
): void {
  void (async () => {
    try {
      const supabase = createClient();

      const { data: invRow } = await supabase
        .from('board_invitations')
        .select('id, board_id, inviter_id, invitee_user_id, status')
        .eq('id', params.invitationId)
        .maybeSingle();

      const invitation = (invRow as InvitationRow | null) || null;
      if (
        !invitation ||
        !invitation.inviter_id ||
        !invitation.invitee_user_id ||
        !invitation.board_id
      ) {
        return;
      }

      const [inviteeName, board] = await Promise.all([
        fetchProfileName(invitation.invitee_user_id),
        fetchBoard(invitation.board_id),
      ]);

      const who = inviteeName || 'Someone';
      const boardTitle = board?.title || 'your board';
      const url = boardUrl(board);

      await sendNotification({
        recipient_id: invitation.inviter_id,
        actor_id: invitation.invitee_user_id,
        type: 'invitation',
        title: params.accepted
          ? `${who} accepted your invitation`
          : `${who} declined your invitation`,
        body: params.accepted
          ? `They joined ${boardTitle}.`
          : `to ${boardTitle}.`,
        board_id: invitation.board_id,
        data: {
          invitation_id: invitation.id,
          board_id: invitation.board_id,
          action: params.accepted ? 'accepted' : 'declined',
          url,
        },
        url,
      });
    } catch (err) {
      console.warn('[notifyBoardInvitationResponse] failed:', err);
    }
  })();
}
