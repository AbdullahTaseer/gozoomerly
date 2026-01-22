import { ArrowRight, LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';

type Props = {
  title: string;
  RightIcon?: LucideIcon;
  rightText?: string;
  complexRightHref?: string;
  complexRightTitle?: string;
  rightTextClick?: () => void;
  rightIconClick?: () => void;
};

const MobileHeader = ({ title, RightIcon, rightText, rightTextClick, rightIconClick, complexRightHref, complexRightTitle }: Props) => {
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

      {complexRightHref && (
        <Link href={complexRightHref} className='text-black flex items-center gap-2'>
          <p>{complexRightTitle || 'Connections'}</p>
          <ArrowRight size={18} />
          <div className='h-5 w-5 flex justify-center items-center border border-black rounded-full'>
            <Plus size={14} />
          </div>
        </Link>
      )}
    </div>
  );
};

export default MobileHeader;