'use client';

import Image from 'next/image';
import bellIcon from "@/assets/svgs/bell.svg";
import { useRouter } from 'next/navigation';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';

const BellIconIndicator = () => {
  const router = useRouter();
  const { count } = useUnreadNotificationCount();

  return (
    <div
      onClick={() => router.push("/u/notifications")}
      className='relative cursor-pointer'
    >
      <Image src={bellIcon} alt='notifications' height={24} width={24} />
      {count > 0 && (
        <span
          className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] font-semibold leading-[18px] text-center animate-bounce'
          aria-label={`${count} unread notifications`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default BellIconIndicator;
