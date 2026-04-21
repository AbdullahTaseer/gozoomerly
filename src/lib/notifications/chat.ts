import { createClient } from '@/lib/supabase/client';
import { sendNotification } from './sendNotification';
import type { NotificationType } from '@/types/notification';



export interface NotifyChatMessageParams {
  conversationId: string;
  senderId: string;
  messageId?: string | null;
  content?: string | null;
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'mixed' | null;
  mediaCount?: number;
  fileName?: string | null;
}

function truncate(text: string, max = 140): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1) + '…';
}

function buildPreview({
  content,
  messageType,
  mediaCount,
  fileName,
}: Pick<NotifyChatMessageParams, 'content' | 'messageType' | 'mediaCount' | 'fileName'>): string {
  const text = (content || '').trim();
  if (text) return truncate(text);

  if (mediaCount && mediaCount > 1) {
    return `${mediaCount} attachments`;
  }
  if (messageType === 'image') return '📷 Image';
  if (messageType === 'video') return '🎥 Video';
  if (messageType === 'audio') return '🎵 Audio';
  if (messageType === 'file') return fileName ? `📎 ${fileName}` : '📎 File';
  if (messageType === 'mixed' || mediaCount === 1) return '📎 Attachment';
  return 'New message';
}

type ConversationRow = {
  id: string;
  type: string | null;
  name: string | null;
  board_id: string | null;
};

type ParticipantRow = { user_id: string };

export function notifyChatMessageRecipients(params: NotifyChatMessageParams): void {
  // Fire-and-forget. Any error is logged, never thrown to the caller.
  void (async () => {
    try {
      const supabase = createClient();

      const [convRes, participantsRes, senderProfileRes] = await Promise.all([
        supabase
          .from('conversations')
          .select('id, type, name, board_id')
          .eq('id', params.conversationId)
          .maybeSingle(),
        supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', params.conversationId),
        supabase
          .from('profiles')
          .select('id, name')
          .eq('id', params.senderId)
          .maybeSingle(),
      ]);

      const conv = (convRes.data as ConversationRow | null) || null;
      const participants = (participantsRes.data as ParticipantRow[] | null) || [];
      const senderName =
        (senderProfileRes.data as { name?: string | null } | null)?.name ||
        'Someone';

      const recipientIds = Array.from(
        new Set(
          participants
            .map((p) => p.user_id)
            .filter((uid): uid is string => !!uid && uid !== params.senderId)
        )
      );

      if (recipientIds.length === 0) return;

      const preview = buildPreview(params);

      const convType = (conv?.type || 'direct').toLowerCase();
      const isGroup = convType === 'group' || convType === 'board';
      const groupName = conv?.name || (convType === 'board' ? 'Board chat' : 'Group');
      const title = isGroup ? `${senderName} in ${groupName}` : senderName;

      // The Postgres enum only has a single `chat_message` value, so we use
      // it for direct, group, and board conversations alike. The conversation
      // type is still available in `data.conversation_type` if the UI wants
      // to render them differently.
      const notificationType: NotificationType = 'chat_message';

      const url = `/u/chat?conversationId=${params.conversationId}`;
      const data = {
        conversation_id: params.conversationId,
        message_id: params.messageId ?? null,
        conversation_type: convType,
        url,
      };

      await Promise.all(
        recipientIds.map((recipientId) =>
          sendNotification({
            recipient_id: recipientId,
            actor_id: params.senderId,
            type: notificationType,
            title,
            body: preview,
            board_id: conv?.board_id ?? null,
            data,
            url,
          })
        )
      );
    } catch (err) {
      console.warn('[notifyChatMessageRecipients] failed:', err);
    }
  })();
}
