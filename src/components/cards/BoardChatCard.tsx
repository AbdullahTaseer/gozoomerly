'use client';

import Image from 'next/image';

type Props = {
  title: string;
  timeAgo: string;
  imgSrc?: string | null;
  gradientFrom?: string;
  gradientTo?: string;
  onClick: () => void;
};

const BoardChatCard = ({
  title,
  timeAgo,
  imgSrc,
  gradientFrom = '#E11D48',
  gradientTo = '#7C3AED',
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-2xl bg-gray-100 shadow-sm hover:bg-gray-200/80 cursor-pointer transition-colors"
    >
      <div
        className="w-12 h-12 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
        style={
          !imgSrc
            ? { background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
            : undefined
        }
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={title}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-black truncate">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{timeAgo}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="shrink-0 px-4 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
      >
        Chat
      </button>
    </div>
  );
};

export default BoardChatCard;
