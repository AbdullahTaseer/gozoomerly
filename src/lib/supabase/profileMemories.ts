import { createClient } from './client';

/** Pass `null` for all statuses */
export type ProfileMemoryStatusFilter = 'live' | 'past' | null;

export interface GetProfileMemoriesParams {
  profileUserId: string;
  viewerId: string;
  status?: ProfileMemoryStatusFilter;
  limit?: number;
  offset?: number;
}

export interface ProfileMemoryItem {
  id?: string;
  wish_id?: string;
  board_id?: string;
  title?: string;
  name?: string;
  status?: string;
  cover_image_url?: string | null;
  cover_image?:
    | string
    | {
        url?: string | null;
        thumbnail_small?: string | null;
        thumbnail_medium?: string | null;
        thumbnail_large?: string | null;
        [key: string]: unknown;
      }
    | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  created_at?: string | null;
  media_count?: number;
  photos_count?: number;
  views_count?: number;
  likes_count?: number;
  board?: {
    id?: string;
    title?: string;
    cover_image_url?: string | null;
    cover_image?: { url?: string | null } | null;
    [key: string]: unknown;
  } | null;
  wisher?: {
    id?: string;
    name?: string;
    profile_pic_url?: string | null;
  } | null;
  creator?: {
    name?: string;
    profile_pic_url?: string | null;
  } | null;
  [key: string]: unknown;
}

function unwrapRow(row: unknown): ProfileMemoryItem | null {
  if (row == null || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  if (r.memory && typeof r.memory === 'object') {
    return { ...(r.memory as object), board: r.board, board_id: r.board_id } as ProfileMemoryItem;
  }
  return row as ProfileMemoryItem;
}

export function normalizeProfileMemoriesPayload(data: unknown): ProfileMemoryItem[] {
  if (data == null) return [];
  if (typeof data === 'string') {
    try {
      return normalizeProfileMemoriesPayload(JSON.parse(data));
    } catch {
      return [];
    }
  }
  if (Array.isArray(data)) {
    return data.map(unwrapRow).filter(Boolean) as ProfileMemoryItem[];
  }
  if (typeof data === 'object') {
    const d = data as Record<string, unknown>;
   
    const dataObj =
      typeof d.data === 'object' && d.data !== null
        ? (d.data as Record<string, unknown>)
        : null;
    const nested =
      d.memories ??
      d.items ??
      d.rows ??
      dataObj?.memories ??
      dataObj?.items ??
      (Array.isArray(d.data) ? d.data : undefined);
    if (Array.isArray(nested)) {
      return nested.map(unwrapRow).filter(Boolean) as ProfileMemoryItem[];
    }

    // Common single-row wrappers.
    if (d.memory && typeof d.memory === 'object') {
      return [unwrapRow(d)].filter(Boolean) as ProfileMemoryItem[];
    }
    if (dataObj?.memory && typeof dataObj.memory === 'object') {
      return [{ ...(dataObj.memory as object), board: dataObj.board, board_id: dataObj.board_id } as ProfileMemoryItem];
    }

    const one = unwrapRow(data);
    return one ? [one] : [];
  }
  return [];
}

const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';

function firstMediaUrlFromArray(arr: unknown, preferImage: boolean): string {
  if (!Array.isArray(arr) || arr.length === 0) return '';

  const readUrl = (row: Record<string, unknown>): string => {
    const raw = row.cdn_url ?? row.url ?? row.thumbnail_url ?? row.path;
    return typeof raw === 'string' ? raw.trim() : '';
  };
  const isVideoRow = (row: Record<string, unknown>, url: string): boolean => {
    const t = String(row.media_type ?? row.type ?? row.mime_type ?? '').toLowerCase();
    if (t) return t.includes('video');
    return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
  };

  if (preferImage) {
    for (const m of arr) {
      if (!m || typeof m !== 'object') continue;
      const row = m as Record<string, unknown>;
      const url = readUrl(row);
      if (url && !isVideoRow(row, url)) return url;
    }
  }

  for (const m of arr) {
    if (!m || typeof m !== 'object') continue;
    const url = readUrl(m as Record<string, unknown>);
    if (url) return url;
  }
  return '';
}

function readCoverImageField(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    const pick =
      o.thumbnail_medium ??
      o.thumbnail_large ??
      o.url ??
      o.thumbnail_small;
    if (typeof pick === 'string') return pick.trim();
  }
  return '';
}

export function getProfileMemoryCoverUrl(item: ProfileMemoryItem): string {
  const fromItemCover = readCoverImageField(item.cover_image);

  const b = item.board;
  const fromBoard =
    (typeof b?.cover_image_url === 'string' && b.cover_image_url) ||
    readCoverImageField(b?.cover_image) ||
    '';

  const any = item as Record<string, unknown>;
  const fromOwnMedia =
    firstMediaUrlFromArray(any.photos, true) ||
    firstMediaUrlFromArray(any.media, true) ||
    firstMediaUrlFromArray(any.videos, false) ||
    firstMediaUrlFromArray(any.media, false);

  return (
    fromItemCover ||
    (typeof item.cover_image_url === 'string' && item.cover_image_url) ||
    (typeof item.media_url === 'string' && item.media_url) ||
    (typeof item.thumbnail_url === 'string' && item.thumbnail_url) ||
    fromOwnMedia ||
    fromBoard ||
    PLACEHOLDER_COVER
  );
}

export function getProfileMemoryBoardId(item: ProfileMemoryItem): string | null {
  const raw =
    item.board_id ??
    (item.board && typeof item.board === 'object' ? (item.board as { id?: string }).id : undefined);
  return raw != null && String(raw) ? String(raw) : null;
}

export function getProfileMemoryTitle(item: ProfileMemoryItem): string {
  const b = item.board;
  const boardTitle =
    b && typeof b === 'object' && typeof (b as { title?: string }).title === 'string'
      ? (b as { title?: string }).title
      : '';
  return (
    (typeof item.title === 'string' && item.title.trim()) ||
    (typeof item.name === 'string' && item.name.trim()) ||
    boardTitle ||
    'Memory'
  );
}

/** Whether this memory’s primary / only asset should render as video (not image). */
export function isProfileMemoryVideo(item: ProfileMemoryItem): boolean {
  const any = item as Record<string, unknown>;
  const typeStr = [any.media_type, any.content_type, any.primary_media_type, any.mime_type]
    .find((v) => typeof v === 'string') as string | undefined;
  if (typeStr) {
    const s = typeStr.toLowerCase();
    if (s.includes('video')) return true;
    if (s.includes('image') || s.includes('photo')) return false;
  }
  const media = any.media;
  if (Array.isArray(media) && media.length > 0) {
    const m = media[0] as Record<string, unknown>;
    const mt = m.media_type ?? m.mime_type;
    if (typeof mt === 'string') {
      if (mt.toLowerCase().includes('video')) return true;
      if (mt.toLowerCase().includes('image')) return false;
    }
  }
  const url = String(any.media_url ?? any.cover_image_url ?? '');
  if (/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url)) return true;
  return false;
}

export type ProfileMemoryGridItem = {
  id: string;
  url: string;
  isVideo: boolean;
  boardId: string | null;
};

/** One memory row can include multiple media assets — expand each into a grid cell. */
export function expandProfileMemoriesToGridItems(items: ProfileMemoryItem[]): ProfileMemoryGridItem[] {
  const out: ProfileMemoryGridItem[] = [];
  for (const item of items) {
    const boardId = getProfileMemoryBoardId(item);
    const raw = (item as Record<string, unknown>).media;
    if (Array.isArray(raw) && raw.length > 0) {
      raw.forEach((m: unknown, i: number) => {
        const row = m as Record<string, unknown>;
        const url = (row.cdn_url ?? row.url ?? row.thumbnail_url) as string | undefined;
        if (!url || typeof url !== 'string' || !url.trim()) return;
        const mt = row.media_type ?? row.mime_type;
        let isVideo = false;
        if (typeof mt === 'string') {
          isVideo = mt.toLowerCase().includes('video');
        } else {
          isVideo = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
        }
        out.push({
          id: `${String(item.wish_id ?? item.id ?? 'm')}-${i}`,
          url: url.trim(),
          isVideo,
          boardId,
        });
      });
      continue;
    }
    const url = getProfileMemoryCoverUrl(item);
    out.push({
      id: String(item.wish_id ?? item.id ?? `m-${out.length}`),
      url,
      isVideo: isProfileMemoryVideo(item),
      boardId,
    });
  }
  return out;
}

export async function getProfileMemories(
  params: GetProfileMemoriesParams
): Promise<{ data: ProfileMemoryItem[]; error: Error | null }> {
  const supabase = createClient();
  const {
    profileUserId,
    viewerId,
    status = null,
    limit = 10,
    offset = 0,
  } = params;

  const { data, error } = await supabase.rpc('get_profile_memories', {
    p_profile_user_id: profileUserId,
    p_viewer_id: viewerId,
    p_status: status,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const list = normalizeProfileMemoriesPayload(data);
  return { data: list, error: null };
}
