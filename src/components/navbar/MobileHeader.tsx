import React from 'react';
import { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  RightIcon?: LucideIcon;
  rightText?: string;
  rightTextClick?: () => void;
  rightIconClick?: () => void;
};

const MobileHeader = ({ title, RightIcon, rightText, rightTextClick, rightIconClick }: Props) => {
  return (
    <div className='hidden max-[769px]:flex items-center justify-between bg-white sticky top-0 z-100 px-6 max-[550px]:px-4 py-2 shadow-md'>
      <p className='font-bold text-[26px]'>{title}</p>

      {RightIcon && (
        <div onClick={rightIconClick} className='cursor-pointer'>
          <RightIcon size={24} />
        </div>
      )}

      {rightText && (
        <p onClick={rightTextClick} className='text-black font-semibold cursor-pointer'>{rightText}</p>
      )}
    </div>
  );
};

export default MobileHeader;