import { LucideIcon, Search, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import BellIcon from "@/assets/svgs/bell.svg";
import Link from 'next/link';
import BellIconIndicator from '@/components/cards/BellIconIndicator';

type Props = {
  title?: string;
  RightIcon?: LucideIcon;
  rightText?: string;
  rightTextClick?: () => void;
  rightIconClick?: () => void;
  titleColor?: string;
  className?: string;
  homeRight?: boolean;
  profileRight?: boolean;
  showBack?: boolean;
  onBackClick?: () => void;
};

const MobileHeader = ({ homeRight = false, profileRight = false, showBack = false, onBackClick, className, title = 'Zoomerly', RightIcon, rightText, rightTextClick, rightIconClick, titleColor }: Props) => {
  const hasRight = RightIcon || rightText || profileRight || homeRight;
  const hasLeft = showBack;
  const titleOnly = !hasLeft && !hasRight;

  return (
    <div className={`${className} hidden max-[769px]:flex items-center justify-between bg-white sticky top-0 z-100 px-6 max-[550px]:px-4 py-3 h-14 shadow-md`}>
      <div className={`flex items-center ${showBack ? 'min-w-[40px]' : titleOnly ? 'flex-1' : 'min-w-0 flex-1'}`}>
        {showBack && (
          <button onClick={onBackClick} className='p-1 -ml-1 shrink-0' aria-label="Back">
            <ArrowLeft size={24} className='text-black' />
          </button>
        )}
        {!showBack && !titleOnly && (
          <p className={`font-bold text-[22px] text-black truncate ${titleColor || ''}`}>{title}</p>
        )}
      </div>

      {(showBack || titleOnly) && (
        <p
          className={`font-bold text-[22px] text-black truncate absolute left-1/2 -translate-x-1/2 max-w-[60%] text-center pointer-events-none ${titleColor || ''}`}
        >
          {title}
        </p>
      )}

      <div className={`flex items-center justify-end ${titleOnly ? 'flex-1' : 'min-w-[40px]'}`}>
        {RightIcon && (
          <div onClick={rightIconClick} className='cursor-pointer'>
            <RightIcon size={24} />
          </div>
        )}

        {rightText && (
          <p onClick={rightTextClick} className='text-black font-semibold cursor-pointer'>{rightText}</p>
        )}

        {profileRight && <BellIconIndicator />}

        {homeRight && !profileRight && (
          <div className='flex items-center gap-4'>
            <Link href={"/u/notifications"}>
              <Image src={BellIcon} alt='' height={24} width={24} />
            </Link>
            <Search size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;