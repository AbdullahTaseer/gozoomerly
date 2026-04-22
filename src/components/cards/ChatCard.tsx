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
  /** Number of unread messages in this conversation. 0 / undefined hides the badge. */
  unreadCount?: number;
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
  unreadCount = 0,
  onClick,
  trailing,
}: Props) => {
  const timeStr = time ? (time.startsWith('•') ? time : `• ${time}`) : '';
  // Only show the unread state when the chat isn't the one currently open
  // (active = open = caught up — avoids a brief flash before the badge clears).
  const hasUnread = !isActive && unreadCount > 0;
  const badgeText = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 cursor-pointer transition-colors duration-200 rounded-lg
        ${isActive ? 'bg-gray-100' : hasUnread ? 'bg-pink-50/60 hover:bg-pink-50' : 'hover:bg-gray-50'} text-black`}
    >
      <div className='relative h-[45px] w-[45px] shrink-0 rounded-full border border-gray-200'>
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
          <p
            className={`line-clamp-1 text-sm text-black min-w-0 truncate ${
              hasUnread ? 'font-bold' : 'font-semibold'
            }`}
          >
            {name}
          </p>
          <p
            className={`text-xs shrink-0 ${
              hasUnread ? 'text-pink-600 font-semibold' : 'text-gray-500'
            }`}
          >
            {timeStr}
          </p>
        </div>
        <div className='flex items-center justify-between gap-2 mt-0.5'>
          <p
            className={`text-xs line-clamp-1 min-w-0 ${
              hasUnread ? 'text-black font-semibold' : 'text-gray-600'
            }`}
          >
            {message}
          </p>
          {hasUnread && (
            <span
              className='shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold leading-none rounded-full bg-pink-600 text-white'
              aria-label={`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>
      {trailing != null ? <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>{trailing}</div> : null}
    </div>
  );
};

export default ChatCard;