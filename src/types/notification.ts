
export type NotificationType =
  | 'like'
  | 'comment'
  | 'wish'
  | 'gift'
  | 'invitation'
  | 'follow'
  | 'board_update'
  | 'chat_message'
  | 'system';

export interface NotificationRow {
  id: string;
  user_id: string | null;
  type: NotificationType | null;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  actor_id: string | null;
  board_id: string | null;
  wish_id: string | null;
  is_read: boolean | null;
  is_pushed: boolean | null;
  pushed_at: string | null;
  created_at: string | null;
  read_at: string | null;
}

export interface NotificationWithActor extends NotificationRow {
  actor?: {
    id: string;
    name: string | null;
    profile_pic_url: string | null;
  } | null;
}

export interface SendNotificationInput {
  recipient_id: string;
  type: NotificationType;
  title: string;
  body?: string;
  actor_id?: string | null;
  board_id?: string | null;
  wish_id?: string | null;
  data?: Record<string, unknown>;
  url?: string;
  push?: boolean;
}
