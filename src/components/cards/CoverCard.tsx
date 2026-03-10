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
      className="w-full text-left rounded-lg p-1 overflow-hidden bg-[#F4F4F4] transition-colors"
    >
      <div className="relative h-[60px] rounded overflow-clip">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <p className="absolute top-4 left-4 text-white font-semibold text-xl">
          {title}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        {(isShareVariant || isInviteSentVariant) && personInfo ? (
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm text-gray-600 shrink-0">{personLabel}</span>
            <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden">
              <Image
                src={personInfo.avatar}
                alt={personInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="font-medium text-black truncate">{personInfo.name}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              {creatorAvatar && (
                <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden">
                  <Image
                    src={creatorAvatar}
                    alt={creatorName || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                {creatorName && <p className="font-medium text-black truncate">{creatorName}</p>}
                {timestamp && <p className="text-sm truncate font-light">{timestamp}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-1.5 text-sm">
                <Images size={16} strokeWidth={2} />
                {photosCount}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <Eye size={16} strokeWidth={2} />
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
