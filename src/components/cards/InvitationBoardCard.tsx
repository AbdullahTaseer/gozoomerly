import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

/**
 * Next/Image calls `new URL()` on string sources; relative paths and some API strings
 * must not be passed through blindly. Invalid strings return null so the caller can
 * fall back to a gradient-only background instead of a broken image.
 */
function safeUrlStringForNextImage(raw: string): string | null {
  const t = raw.trim();
  if (!t || t === 'undefined' || t === 'null') return null;
  if (t.startsWith('/') || t.startsWith('data:') || t.startsWith('blob:')) return t;
  if (t.startsWith('//')) {
    try {
      return new URL(`https:${t}`).href;
    } catch {
      return null;
    }
  }
  try {
    new URL(t);
    return t;
  } catch {
    return null;
  }
}

/** Returns first non-empty string among the provided values. */
function firstNonEmptyString(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === 'string') {
      const t = c.trim();
      if (t) return t;
    }
  }
  return '';
}

/**
 * API may pass a URL string, `{ url: string }`, a `{ thumbnails: { small|medium|large } }`
 * object (as returned by `get_user_invitations` for `board.cover_image`), a flat
 * `{ thumbnail_medium|thumbnail_large|thumbnail_small }` object, a `{ cover_image: {...} }`
 * wrapper, a `StaticImport`, or a bad/empty value. Returns `null` when no valid source
 * can be derived so callers can render a gradient-only background instead of a broken
 * image.
 */
function normalizeImageSrc(src: string | StaticImport | unknown): string | StaticImport | null {
  if (typeof src === 'string') {
    return safeUrlStringForNextImage(src);
  }
  if (src != null && typeof src === 'object') {
    const o = src as Record<string, unknown>;

    const thumbs =
      o.thumbnails && typeof o.thumbnails === 'object'
        ? (o.thumbnails as Record<string, unknown>)
        : null;

    const innerCover =
      o.cover_image && typeof o.cover_image === 'object'
        ? (o.cover_image as Record<string, unknown>)
        : null;
    const innerCoverThumbs =
      innerCover?.thumbnails && typeof innerCover.thumbnails === 'object'
        ? (innerCover.thumbnails as Record<string, unknown>)
        : null;

    const nested = firstNonEmptyString(
      o.url,
      o.cdn_url,
      o.href,
      o.cover_image_url,
      o.cover_url,
      o.image_url,
      o.thumbnail_url,
      thumbs?.large,
      thumbs?.medium,
      thumbs?.small,
      o.thumbnail_large,
      o.thumbnail_medium,
      o.thumbnail_small,
      innerCover?.url,
      innerCover?.cdn_url,
      innerCoverThumbs?.large,
      innerCoverThumbs?.medium,
      innerCoverThumbs?.small,
      typeof innerCover === 'string' ? innerCover : undefined,
    );

    if (nested) {
      return safeUrlStringForNextImage(nested);
    }
    if ('src' in o && typeof o.src === 'string') {
      const inner = o.src.trim();
      const safeInner = safeUrlStringForNextImage(inner);
      if (!safeInner) return null;
      return src as StaticImport;
    }
  }
  return null;
}

type InvitationBoardCardProps = {
  title: string;
  backgroundImage?: string | StaticImport | unknown;
  profileImage: string | StaticImport | unknown;
  inviterName: string;
  onAccept?: () => void;
  onDecline?: () => void;
  gradientClass?: string;
}

const AVATAR_FALLBACK =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80';

const InvitationBoardCard = ({
  title,
  backgroundImage,
  profileImage,
  inviterName,
  onAccept,
  onDecline,
  gradientClass = 'bg-gradient-to-br from-[#cf6c71]/80 to-[#d9777c]/80'
}: InvitationBoardCardProps) => {
  const bgSrc = normalizeImageSrc(backgroundImage);
  const avatarSrc = normalizeImageSrc(profileImage) ?? AVATAR_FALLBACK;

  return (
    <div className='relative rounded-[13px] overflow-hidden flex flex-col justify-between min-h-[260px]'>
      <div className='absolute inset-0'>
        {bgSrc ? (
          typeof bgSrc === 'string' ? (
            <img
              src={bgSrc}
              alt=""
              className='absolute inset-0 h-full w-full object-cover'
              draggable={false}
            />
          ) : (
            <Image
              src={bgSrc}
              alt={title}
              fill
              className='object-cover'
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          )
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-[#cf6c71] to-[#BEA250]' />
        )}
        <div className={`absolute inset-0 ${gradientClass}`} />
      </div>

      <div className='relative z-10 p-4 flex flex-col justify-between h-full flex-1'>
        <h2 className='text-white text-2xl font-bold'>{title}</h2>

        <div className='flex items-center gap-4 mt-4'>
          <div className='relative shrink-0'>
            <div className='w-13 h-13 rounded-full border-2 border-pink-300 p-0.5'>
              {typeof avatarSrc === 'string' ? (
                <img
                  src={avatarSrc}
                  alt={inviterName}
                  width={52}
                  height={52}
                  className='rounded-full object-cover w-full h-full'
                  draggable={false}
                />
              ) : (
                <Image
                  src={avatarSrc}
                  alt={inviterName}
                  width={52}
                  height={52}
                  className='rounded-full object-cover w-full h-full'
                />
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-white text-lg'>Invited by {inviterName}</p>
            <div className='bg-gray-800/80 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit'>
              Invitation
            </div>
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={onAccept}
            className='flex-1 bg-white cursor-pointer text-black font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors'
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className='flex-1 bg-transparent cursor-pointer border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white/10 transition-colors'
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationBoardCard;