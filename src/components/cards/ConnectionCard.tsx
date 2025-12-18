'use client';

import React from 'react';
import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConnectionCardProps {
  profileImage: string;
  name: string;
  username: string;
  isFollowing?: boolean;
  onFollowingClick?: () => void;
  onChatClick?: () => void;
  onUnfollowClick?: () => void;
  onBlockClick?: () => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  profileImage,
  name,
  username,
  isFollowing = true,
  onFollowingClick,
  onChatClick,
  onUnfollowClick,
  onBlockClick,
}) => {

  return (
    <div className='bg-[#F7F7F7] rounded-[8px] p-4 flex items-center gap-4 relative'>
      <div className='flex items-center max-[500px]:items-start gap-4 flex-1 min-w-0 w-full'>
        <div className='shrink-0'>
          <Image
            src={profileImage}
            alt={name}
            width={45}
            height={45}
            className='rounded-full object-cover'
          />
        </div>
        <div className='flex-1'>
          <p className='text-[24px] max-[768px]:text-[20px] font-medium text-[#1B1D26] truncate'>
            {name}
          </p>
          <p className='text-xs text-gray-600 truncate'>{username}</p>

          <div className='hidden max-[500px]:flex items-center gap-2 mt-2'>
            <button
              onClick={onFollowingClick}
              className='px-4 py-2 bg-[#1B1D26] text-white text-xs font-medium rounded-full hover:bg-[#2A2D3A] transition-colors whitespace-nowrap'
            >
              Following
            </button>
            <button
              onClick={onChatClick}
              className='px-4 py-2 bg-gradient-to-r from-[#F43C83] to-[#845CBA] text-white text-xs font-medium rounded-full hover:opacity-90 transition-opacity whitespace-nowrap'
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <button
          onClick={onFollowingClick}
          className='px-4 max-[500px]:hidden py-2 bg-[#1B1D26] text-white text-sm font-medium rounded-full hover:bg-[#2A2D3A] transition-colors whitespace-nowrap max-[500px]:flex-1'
        >
          Following
        </button>
        <button
          onClick={onChatClick}
          className='px-4 max-[500px]:hidden py-2 bg-gradient-to-r from-[#F43C83] to-[#845CBA] text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity whitespace-nowrap max-[500px]:flex-1'
        >
          Chat
        </button>
        <div className='shrink-0'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='p-2 hover:bg-gray-200 rounded-full transition-colors'>
                <MoreVertical size={20} className='text-[#1B1D26]' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-[120px]'>
              <DropdownMenuItem onClick={onUnfollowClick}>
                Unfollow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBlockClick} variant='destructive'>
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </div>
  );
};

export default ConnectionCard;

