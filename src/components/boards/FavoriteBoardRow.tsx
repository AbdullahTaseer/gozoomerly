'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { FavoriteBoardItem } from '@/lib/supabase/favoriteBoards';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';

/** Same default as `app/u/boards/page.tsx` and `FollowingTabCards`. */
const placeholderCoverImage =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80';

type Props = {
  item: FavoriteBoardItem;
  onOpen: () => void;
  onUnfavorite: () => void;
};

function pickCover(item: FavoriteBoardItem): string {
  const coverNested = (item as { cover_image?: { url?: string } }).cover_image?.url;
  const url =
    (typeof item.cover_image_url === 'string' && item.cover_image_url.trim()) ||
    (typeof coverNested === 'string' && coverNested.trim()) ||
    '';
  const honoree = item.honoree_details as Record<string, string | undefined> | undefined;
  const fromHonoree =
    (honoree?.cover_url && honoree.cover_url.trim()) ||
    (honoree?.profile_photo_url && honoree.profile_photo_url.trim()) ||
    (honoree?.profile_pic_url && honoree.profile_pic_url.trim()) ||
    '';
  return url || fromHonoree || placeholderCoverImage;
}

export default function FavoriteBoardRow({ item, onOpen, onUnfavorite }: Props) {
  const title = (item.title as string) || 'Board';
  const honoree = (item.honoree_details || {}) as Record<string, string | undefined>;
  const name =
    honoree.first_name || honoree.last_name
      ? `${honoree.first_name || ''} ${honoree.last_name || ''}`.trim()
      : 'Board';
  const hometown = honoree.hometown || honoree.city || '';
  const cover = pickCover(item);

  return (
    <div className="w-full flex flex-row items-start gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200/80 transition-colors">
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 min-w-0 flex-row items-start gap-3 text-left"
      >
      <div className="relative w-[100px] h-[70px] shrink-0 rounded overflow-hidden bg-gray-300">
        <Image
          src={cover}
          alt=""
          fill
          className="object-cover"
          sizes="100px"
          unoptimized={cover.startsWith('http')}
        />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-sm font-semibold text-black line-clamp-2 mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-gray-200">
            {honoree.profile_photo_url || honoree.profile_pic_url ? (
              <Image
                src={honoree.profile_photo_url || honoree.profile_pic_url || ''}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
                unoptimized
              />
            ) : (
              <Image src={ProfileAvatar} alt="" fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-black truncate">{name}</p>
            {hometown ? (
              <p className="text-[11px] text-gray-600 truncate">
                Home Town : <span className="font-normal">{hometown}</span>
              </p>
            ) : null}
          </div>
        </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onUnfavorite}
        className="shrink-0 p-1 text-amber-500 hover:text-amber-600 self-start"
        aria-label="Remove from favorites"
      >
        <Star size={22} className="fill-amber-500" />
      </button>
    </div>
  );
}
