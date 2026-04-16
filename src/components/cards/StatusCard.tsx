'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';

interface StatusCardProps {
  type: 'add' | 'user';
  profileImage?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  name?: string;
  onClick?: () => void;
  onAddClick?: () => void;
}

export default function StatusCard({
  type,
  profileImage,
  backgroundImage,
  backgroundVideo,
  name,
  onClick,
  onAddClick,
}: StatusCardProps) {
  if (type === 'add') {
    return (
      <div
        onClick={onClick}
        className="relative shrink-0 w-[100px] h-[160px] rounded-[8px] overflow-hidden cursor-pointer bg-[#11131A]"
      >
        {backgroundVideo ? (
          <>
            <video
              src={backgroundVideo}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              alt="my-status"
              fill
              className="object-cover"
              sizes="100px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : null}

        {profileImage && (
          <div className="absolute top-[34px] left-[24px] w-[44px] h-[44px] rounded-full border-2 border-white overflow-hidden">
            <Image
              src={profileImage}
              alt="profile"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        )}

        <div
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.();
          }}
          className="absolute right-5 top-[60px] -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#F43C83] to-[#845CBA] flex items-center justify-center"
        >
          <Plus size={14} className="text-white" />
        </div>

        <p className="absolute bottom-[16px] left-0 right-0 text-center text-white text-[14px] font-semibold">
          {backgroundImage || backgroundVideo ? 'My Status' : 'Add status'}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative shrink-0 w-[100px] h-[160px] rounded-[8px] overflow-hidden cursor-pointer"
    >
      {backgroundVideo ? (
        <video
          src={backgroundVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={name || ''}
          fill
          className="object-cover"
          sizes="100px"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {profileImage && (
        <div className="absolute top-[10px] left-[10px] w-[36px] h-[36px] rounded-full p-[2px] bg-gradient-to-r from-[#F43C83] to-[#845CBA]">
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
            <Image
              src={profileImage}
              alt={name || ''}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
        </div>
      )}

      {name && (
        <p className="absolute bottom-[12px] leading-tight left-[12px] text-white text-[14px] font-semibold">
          {name}
        </p>
      )}
    </div>
  );
}