import type { ReactNode } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";

type Props = {
  imgPath: string | StaticImport;
  name: string;
  message: string;
  time: string;
  isActive?: boolean;
  isOnline?: boolean;
  onClick: () => void;
  /** e.g. group info button — must call stopPropagation in the child */
  trailing?: ReactNode;
};

const ChatCard = ({
  imgPath,
  name,
  message,
  time,
  isActive = false,
  isOnline = false,
  onClick,
  trailing,
}: Props) => {
  const timeStr = time ? (time.startsWith('•') ? time : `• ${time}`) : '';
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 cursor-pointer transition-colors duration-200 rounded-lg
        ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'} text-black`}
    >
      <div className='relative h-[45px] w-[45px] shrink-0 rounded-full overflow-hidden border border-gray-200'>
        <Image
          src={imgPath || ProfileAvatar}
          alt={name}
          fill
          className='rounded-full object-cover'
          sizes="45px"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = ProfileAvatar.src || ProfileAvatar;
          }}
        />
        {isOnline && (
          <span className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full' />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-start gap-2'>
          <p className='font-semibold line-clamp-1 text-sm text-black min-w-0 truncate'>
            {name}
          </p>
          <p className='text-xs text-gray-500 shrink-0'>{timeStr}</p>
        </div>
        <p className='text-xs line-clamp-1 text-gray-600 mt-0.5'>{message}</p>
      </div>
      {trailing != null ? <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>{trailing}</div> : null}
    </div>
  );
};

export default ChatCard;