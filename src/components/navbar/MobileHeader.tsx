import React from 'react';
import { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  RightIcon?: LucideIcon;
};

const MobileHeader = ({ title, RightIcon }: Props) => {
  return (
    <div className='hidden max-[769px]:flex items-center justify-between bg-white sticky top-0 z-100 px-6 max-[550px]:px-4 py-2 shadow-2xl shadow-pink-100'>
      <p className='font-bold text-[26px]'>{title}</p>

      {RightIcon && (
        <div className='cursor-pointer'>
          <RightIcon size={24} />
        </div>
      )}
    </div>
  );
};

export default MobileHeader;