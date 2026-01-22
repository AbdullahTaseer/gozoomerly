'use client';

import Image from 'next/image';

interface ConnectionCardProps {
  profileImage: string;
  name: string;
  username: string;
  isFollowing?: boolean;
  onClick?: () => void;
  onCardClick?: () => void;
  buttonText?: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  profileImage,
  name,
  username,
  isFollowing = true,
  onClick,
  onCardClick,
  buttonText,
}) => {

  return (
    <div
      className={`bg-[#F7F7F7] rounded-[8px] p-4 flex items-center gap-4 relative ${onCardClick ? 'cursor-pointer hover:bg-[#F0F0F0] transition-colors' : ''}`}
      onClick={onCardClick}
    >
      <div className='flex items-center max-[500px]:items-start gap-4 flex-1 min-w-0 w-full'>
        <div className='shrink-0 h-11 w-11 relative'>
          <Image
            src={profileImage}
            alt={name}
            fill
            className='rounded-full object-cover'
          />
        </div>
        <div className='flex-1'>
          <p className='text-[24px] max-[768px]:text-[20px] font-medium text-[#1B1D26] truncate'>
            {name}
          </p>
          <p className='text-xs text-gray-600 truncate'>{username}</p>

        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-full hover:opacity-90 transition-opacity whitespace-nowrap ${buttonText === "Invite"
            ? "bg-transparent text-orange-500"
            : isFollowing
              ? "bg-black text-white"
              : "bg-white text-black"
            }`}>
          {buttonText || (isFollowing ? "Chat" : "Follow")}
        </button>
      </div>

    </div>
  );
};

export default ConnectionCard;

