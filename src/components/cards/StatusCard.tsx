'use client';

import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface StatusCardProps {
  type: 'add' | 'user';
  profileImage?: string;
  backgroundImage?: string;
  name?: string;
  onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  type,
  profileImage,
  backgroundImage,
  name,
  onClick,
}) => {
  if (type === 'add') {
    return (
      <div onClick={onClick} className='relative shrink-0 w-[90px] h-[120px] rounded-[10px] bg-[#1B1D26] flex flex-col items-center justify-center overflow-hidden'>
        <div className='relative w-[56px] h-[56px] rounded-full'>
          {profileImage ? (
            <Image
              src={profileImage}
              alt='Profile'
              width={56}
              height={56}
              className='rounded-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gray-600' />
          )}
          <div className='absolute -bottom-1 -right-1 w-[24px] h-[24px] bg-gradient-to-r from-[#F43C83] to-[#845CBA] rounded-full flex items-center justify-center border-2 border-white z-10'>
            <Plus size={12} className='text-white' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className='relative w-[90px] shrink-0 h-[120px] rounded-[10px] overflow-hidden'>
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={name || 'Status'}
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-black/30' />
        </>
      ) : (
        <div className='w-full h-full bg-gray-200' />
      )}
      {profileImage && (
        <div className='absolute top-2 left-6 -translate-x-1/2 w-[30px] h-[30px] rounded-full border border-white overflow-hidden shadow-md z-10'>
          <Image
            src={profileImage}
            alt={name || 'Profile'}
            width={30}
            height={30}
            className='rounded-full object-cover'
          />
        </div>
      )}
      {name && (
        <p className='absolute bottom-0 left-0 right-0 pb-2 text-center text-sm font-medium text-white whitespace-nowrap'>
          {name}
        </p>
      )}
    </div>
  );
};

export default StatusCard;

