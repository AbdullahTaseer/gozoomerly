import { createClient } from '@/lib/supabase/client';
import { sendNotification } from './sendNotification';

function trunc(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function boardHref(boardId: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from('boards')
    .select('slug')
    .eq('id', boardId)
    .maybeSingle();
  const slug = (data as { slug?: string } | null)?.slug;
  return slug ? `/u/boards/${slug}` : `/u/boards/${boardId}`;
}

async function likerDisplayName(userId: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .maybeSingle();
  return (data as { name?: string | null } | null)?.name || 'Someone';
}

/** After `like_wish` RPC succeeds — notifies the wish author. */
export function notifyWishLiked(wishId: string): void {
  queueMicrotask(() => {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const likerId = auth.user?.id;
      if (!likerId) return;

      const { data: wish } = await supabase
        .from('wishes')
        .select('id, sender_id, board_id, content')
        .eq('id', wishId)
        .maybeSingle();

      const row = wish as {
        sender_id?: string;
        board_id?: string;
        content?: string | null;
      } | null;
      if (!row?.sender_id || !row.board_id || row.sender_id === likerId) return;

      const name = await likerDisplayName(likerId);
      const url = await boardHref(row.board_id);

      await sendNotification({
        recipient_id: row.sender_id,
        actor_id: likerId,
        type: 'like',
        title: `${name} liked your wish`,
        body: row.content ? trunc(row.content, 120) : undefined,
        board_id: row.board_id,
        wish_id: wishId,
        data: { kind: 'wish_like', wish_id: wishId, board_id: row.board_id, url },
        url,
      });
    } catch (e) {
      console.warn('[notifyWishLiked]', e);
    }
  })();
  });
}

/**
 * After `add_wish_comment` RPC succeeds.
 * Top-level comment → wish author. Reply → parent comment author (falls back to wish author).
 */
export function notifyWishCommented(
  wishId: string,
  parentCommentId: string | null | undefined,
  commentText: string
): void {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const authorId = auth.user?.id;
      if (!authorId) return;

      const { data: wish } = await supabase
        .from('wishes')
        .select('id, sender_id, board_id, content')
        .eq('id', wishId)
        .maybeSingle();

      const w = wish as {
        sender_id?: string;
        board_id?: string;
        content?: string | null;
      } | null;
      if (!w?.sender_id || !w.board_id) return;

      let recipientId = w.sender_id;
      if (parentCommentId) {
        const { data: parent } = await supabase
          .from('wish_comments')
          .select('user_id')
          .eq('id', parentCommentId)
          .maybeSingle();
        const pid = (parent as { user_id?: string } | null)?.user_id;
        if (pid && pid !== authorId) recipientId = pid;
      }

      if (!recipientId || recipientId === authorId) return;

      const name = await likerDisplayName(authorId);
      const url = await boardHref(w.board_id);
      const preview = trunc(commentText, 160);

      await sendNotification({
        recipient_id: recipientId,
        actor_id: authorId,
        type: 'comment',
        title:
          parentCommentId && recipientId !== w.sender_id
            ? `${name} replied to your comment`
            : `${name} commented on your wish`,
        body: preview,
        board_id: w.board_id,
        wish_id: wishId,
        data: {
          wish_id: wishId,
          parent_comment_id: parentCommentId ?? null,
          board_id: w.board_id,
          url,
        },
        url,
      });
    } catch (e) {
      console.warn('[notifyWishCommented]', e);
    }
  })();
}

/** New wish on a board — notifies the board creator (not the sender). */
export function notifyBoardNewWish(params: {
  boardId: string;
  senderId: string;
  contentPreview: string;
  wishId?: string | null;
}): void {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: board } = await supabase
        .from('boards')
        .select('id, title, slug, creator_id')
        .eq('id', params.boardId)
        .maybeSingle();

      const b = board as {
        creator_id?: string;
        title?: string | null;
        slug?: string | null;
      } | null;
      if (!b?.creator_id || b.creator_id === params.senderId) return;

      const name = await likerDisplayName(params.senderId);
      const url = b.slug ? `/u/boards/${b.slug}` : `/u/boards/${params.boardId}`;

      await sendNotification({
        recipient_id: b.creator_id,
        actor_id: params.senderId,
        type: 'wish',
        title: `${name} posted a wish on ${b.title || 'your board'}`,
        body: trunc(params.contentPreview, 160),
        board_id: params.boardId,
        wish_id: params.wishId ?? null,
        data: {
          wish_id: params.wishId ?? null,
          board_id: params.boardId,
          url,
        },
        url,
      });
    } catch (e) {
      console.warn('[notifyBoardNewWish]', e);
    }
  })();
}

/** After a gift row is inserted via `addGiftContribution` — notifies board creator. */
export function notifyBoardGiftReceived(params: {
  boardId: string;
  contributorId: string;
  giftOptionRowId: string;
  amount: number;
  message?: string | null;
}): void {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: board } = await supabase
        .from('boards')
        .select('id, title, slug, creator_id')
        .eq('id', params.boardId)
        .maybeSingle();

      const b = board as {
        creator_id?: string;
        title?: string | null;
        slug?: string | null;
      } | null;
      if (!b?.creator_id || b.creator_id === params.contributorId) return;

      const name = await likerDisplayName(params.contributorId);
      const url = b.slug ? `/u/boards/${b.slug}` : `/u/boards/${params.boardId}`;
      const amt = Number.isFinite(params.amount) ? params.amount.toFixed(2) : String(params.amount);

      await sendNotification({
        recipient_id: b.creator_id,
        actor_id: params.contributorId,
        type: 'gift',
        title: `${name} sent a gift`,
        body: params.message?.trim()
          ? trunc(params.message.trim(), 120)
          : `$${amt} on ${b.title || 'your board'}`,
        board_id: params.boardId,
        data: {
          gift_option_id: params.giftOptionRowId,
          board_id: params.boardId,
          amount: params.amount,
          url,
        },
        url,
      });
    } catch (e) {
      console.warn('[notifyBoardGiftReceived]', e);
    }
  })();
}

/** Someone saved the board to favorites — notifies the board creator. */
export function notifyBoardFavorited(boardId: string, favoriterUserId: string): void {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: board } = await supabase
        .from('boards')
        .select('id, title, slug, creator_id')
        .eq('id', boardId)
        .maybeSingle();

      const b = board as {
        creator_id?: string;
        title?: string | null;
        slug?: string | null;
      } | null;
      if (!b?.creator_id || b.creator_id === favoriterUserId) return;

      const name = await likerDisplayName(favoriterUserId);
      const url = b.slug ? `/u/boards/${b.slug}` : `/u/boards/${boardId}`;

      await sendNotification({
        recipient_id: b.creator_id,
        actor_id: favoriterUserId,
        type: 'like',
        title: `${name} saved ${b.title || 'your board'} to favorites`,
        body: undefined,
        board_id: boardId,
        data: { kind: 'board_favorite', board_id: boardId, url },
        url,
      });
    } catch (e) {
      console.warn('[notifyBoardFavorited]', e);
    }
  })();
}
