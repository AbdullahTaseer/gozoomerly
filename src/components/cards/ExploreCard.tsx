'use client';

import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type ExploreCardProps = {
  title: string;
  image: string | StaticImport;
  avatars?: Array<string | StaticImport>;
  extraCount?: number;
  heightVariant?: 'tall' | 'medium' | 'short';
  onClick?: () => void;
};

const aspectClasses = {
  tall: 'aspect-[3/5] min-h-[240px]',
  medium: 'aspect-[3/4] min-h-[190px]',
  short: 'aspect-[4/3] min-h-[160px]',
};

const ExploreCard = ({
  title,
  image,
  avatars = [],
  extraCount = 0,
  heightVariant = 'medium',
  onClick,
}: ExploreCardProps) => {
  const displayAvatars = avatars.slice(0, 4);
  const showExtra = extraCount > 0;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden break-inside-avoid mb-2 cursor-pointer bg-gray-100"
    >
      <div className={`relative ${aspectClasses[heightVariant]}`}>
        <Image
          src={image}
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
