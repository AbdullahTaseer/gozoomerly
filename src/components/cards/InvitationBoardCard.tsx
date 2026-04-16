import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80';

/**
 * Next/Image calls `new URL()` on string sources; relative paths and some API strings
 * must not be passed through blindly. Invalid strings fall back to a known-good URL.
 */
function safeUrlStringForNextImage(raw: string): string {
  const t = raw.trim();
  if (!t || t === 'undefined' || t === 'null') return FALLBACK_IMAGE;
  if (t.startsWith('/') || t.startsWith('data:') || t.startsWith('blob:')) return t;
  if (t.startsWith('//')) {
    try {
      return new URL(`https:${t}`).href;
    } catch {
      return FALLBACK_IMAGE;
    }
  }
  try {
    new URL(t);
    return t;
  } catch {
    return FALLBACK_IMAGE;
  }
}

/** API may pass a URL string, `{ url: string }`, or a bad/empty value — Next/Image requires a valid URL or StaticImport. */
function normalizeImageSrc(src: string | StaticImport | unknown): string | StaticImport {
  if (typeof src === 'string') {
    return safeUrlStringForNextImage(src);
  }
  if (src != null && typeof src === 'object') {
    const o = src as Record<string, unknown>;
    const nested = o.url ?? o.cdn_url ?? o.href;
    if (typeof nested === 'string' && nested.trim()) {
      return safeUrlStringForNextImage(nested.trim());
    }
    if ('src' in o && typeof o.src === 'string') {
      const inner = o.src.trim();
      const safeInner = safeUrlStringForNextImage(inner);
      if (safeInner === FALLBACK_IMAGE) {
        return FALLBACK_IMAGE;
      }
      return src as StaticImport;
    }
  }
  return FALLBACK_IMAGE;
}

type InvitationBoardCardProps = {
  title: string;
  backgroundImage: string | StaticImport | unknown;
  profileImage: string | StaticImport | unknown;
  inviterName: string;
  onAccept?: () => void;
  onDecline?: () => void;
  gradientClass?: string;
}

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
  const avatarSrc = normalizeImageSrc(profileImage);

  return (
    <div className='relative rounded-[13px] overflow-hidden flex flex-col justify-between'>
      <div className='absolute inset-0'>
        {typeof bgSrc === 'string' ? (
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
        )}
        <div className={`absolute inset-0 ${gradientClass}`} />
      </div>

      <div className='relative z-10 p-4 flex flex-col justify-between h-full'>
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