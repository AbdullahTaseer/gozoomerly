import TitleCard from '@/components/cards/TitleCard';
import { Bell, ChevronRight, Gift, Heart, MessageCircle } from 'lucide-react';
import React from 'react';

const MyActivity = () => {
  return (
    <div className='px-[7%] max-[768px]:px-6'>
      <div className='flex items-center justify-between gap-3'>
        <TitleCard title='Activity' className='text-left' />
        <div className='relative'>
          <Bell />
          <span className='p-1 absolute top-0 right-0 rounded-full bg-pink-500' />
        </div>
      </div>
      <div className='bg-[#F4F4F4] py-3 rounded-[24px] mt-4'>
        <div className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
          <div className='flex items-center gap-3'>
            <Heart size={20} />
            <span className='text-gray-800'>Likes</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
        <div className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
          <div className='flex items-center gap-3'>
            <MessageCircle size={20} />
            <span className='text-gray-800'>Comments</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
        <div className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
          <div className='flex items-center gap-3'>
            <Gift size={20} />
            <span className='text-gray-800'>Wishes</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
        <div className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
          <div className='flex items-center gap-3'>
            <Gift size={20} />
            <span className='text-gray-800'>Gifts</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
      </div>
    </div>
  );
};

export default MyActivity;
