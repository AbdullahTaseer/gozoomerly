'use client';

import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Images, Eye } from 'lucide-react';

type CoverCardProps = {
  coverImage: string;
  title: string;
  creatorName?: string;
  creatorAvatar?: string | StaticImport;
  timestamp?: string;
  photosCount?: number;
  viewsCount?: number;
  variant?: 'default' | 'share' | 'inviteSent';
  sharedWith?: { name: string; avatar: string | StaticImport };
  inviteSentTo?: { name: string; avatar: string | StaticImport };
  onClick?: () => void;
};

const CoverCard = ({
  coverImage,
  title,
  creatorName,
  creatorAvatar,
  timestamp,
  photosCount = 0,
  viewsCount = 0,
  variant = 'default',
  sharedWith,
  inviteSentTo,
  onClick,
}: CoverCardProps) => {
  const isShareVariant = variant === 'share' || sharedWith;
  const isInviteSentVariant = variant === 'inviteSent' || inviteSentTo;
  const personInfo = sharedWith || inviteSentTo;
  const personLabel = variant === 'inviteSent' || inviteSentTo ? 'Invite sent to' : 'Share with';
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-1.5 overflow-hidden bg-[#F4F4F4] transition-colors hover:bg-[#ececec]"
    >
      <div className="relative h-[148px] sm:h-[168px] min-h-[120px] rounded-lg overflow-clip">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 text-white font-semibold text-lg sm:text-xl leading-snug line-clamp-2 text-left drop-shadow-sm">
          {title}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 py-4 sm:px-4">
        {(isShareVariant || isInviteSentVariant) && personInfo ? (
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm text-gray-600 shrink-0">{personLabel}</span>
            <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden">
              <Image
                src={personInfo.avatar}
                alt={personInfo.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <p className="font-medium text-black truncate">{personInfo.name}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              {creatorAvatar && (
                <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                  <Image
                    src={creatorAvatar}
                    alt={creatorName || ''}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
              )}
              <div className="min-w-0">
                {creatorName && (
                  <p className="font-semibold text-base text-black truncate">{creatorName}</p>
                )}
                {timestamp && <p className="text-sm truncate font-light text-gray-600 mt-0.5">{timestamp}</p>}
              </div>
            </div>
            <div className="flex items-center gap-5 shrink-0 text-gray-800">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Images size={18} strokeWidth={2} />
                {photosCount}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Eye size={18} strokeWidth={2} />
                {viewsCount}
              </span>
            </div>
          </>
        )}
      </div>
    </button>
  );
};

export default CoverCard;
