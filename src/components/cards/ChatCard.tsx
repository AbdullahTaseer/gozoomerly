import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";

type Props = {
  imgPath: string | StaticImport;
  name: string;
  message: string;
  time: string;
  isActive?: boolean;
  onClick: () => void;
};

const ChatCard = ({ imgPath, name, message, time, isActive = false, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-3 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-[#2A2D3A] text-white' : 'text-black'
        }`}
    >
      <div className='relative h-[45px] w-[45px] rounded-full border border-[#48484A]'>
        <Image
          src={imgPath || ProfileAvatar}
          alt={name}
          fill
          className='rounded-full object-cover p-[2px]'
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = ProfileAvatar.src || ProfileAvatar;
          }}
        />
      </div>

      <div className='flex-1'>
        <div className='flex justify-between items-center'>
          <p className='font-bold text-sm'>{name}</p>
          <p className='text-xs '>{time}</p>
        </div>
        <p className='text-xs truncate pr-4'>{message}</p>
      </div>
    </div>
  );
};

export default ChatCard;