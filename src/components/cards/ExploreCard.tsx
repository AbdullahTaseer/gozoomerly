'use client';

import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type ExploreCardProps = {
  title: string;
  image: string | StaticImport;
  avatars?: Array<string | StaticImport>;
  extraCount?: number;
  heightVariant?: 'tall' | 'medium' | 'short';
  imageHeightPx?: number;
  onClick?: () => void;
};

const aspectClasses = {
  tall: 'aspect-[3/5] min-h-[240px]',
  medium: 'aspect-[3/4] min-h-[190px]',
  short: 'aspect-[4/3] min-h-[160px]',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80';

function safeImageSrc(src: string | StaticImport): string | StaticImport {
  if (src != null && typeof src === 'object') return src;
  if (typeof src === 'string' && src.trim()) return src;
  return FALLBACK_IMAGE;
}

const ExploreCard = ({
  title,
  image,
  avatars = [],
  extraCount = 0,
  heightVariant = 'medium',
  imageHeightPx,
  onClick,
}: ExploreCardProps) => {
  const coverSrc = safeImageSrc(image);
  const displayAvatars = avatars
    .filter((a) => (typeof a === 'object' && a != null) || (typeof a === 'string' && a.trim() !== ''))
    .slice(0, 4)
    .map((a) => safeImageSrc(a));
  const showExtra = extraCount > 0;
  const imageBoxClass =
    imageHeightPx != null
      ? 'relative w-full shrink-0 overflow-hidden'
      : `relative ${aspectClasses[heightVariant]}`;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden break-inside-avoid cursor-pointer bg-gray-100"
    >
      <div
        className={imageBoxClass}
        style={imageHeightPx != null ? { height: imageHeightPx } : undefined}
      >
        <Image
          src={coverSrc}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <p className="absolute top-3 left-3 right-3 text-white text-sm font-semibold capitalize line-clamp-1 drop-shadow-md">
          {title}
        </p>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {displayAvatars.map((avatar, i) => (
              <div
                key={i}
                className="relative sm:w-7 w-6 sm:h-7 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex-shrink-0"
              >
                <Image
                  src={avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
            {showExtra && (
              <span className="text-[#F43C83] bg-white sm:w-7 w-6 sm:h-7 h-6 rounded-full shrink-0 leading-7 text-center text-xs font-medium drop-shadow-md">
                +{extraCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
