'use client';

import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import { ChevronRight, Gift, Heart, MessageCircle } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';

const MyActivity = () => {

  const router = useRouter();

  return (
    <>
      <DashNavbar hide={false} />
      <div className='px-[7%] max-[768px]:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <TitleCard title='Activity' className='text-left' />
        </div>
        <div className='bg-[#F4F4F4] py-3 rounded-[24px] mt-4'>
          <div onClick={() => router.push("/u/likes")} className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
            <div className='flex items-center gap-3'>
              <Heart size={20} />
              <span className='text-gray-800'>Likes</span>
            </div>
            <ChevronRight className='text-[#8A8A8A]' size={22} />
          </div>
          <div onClick={() => router.push("/u/comments")} className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
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
          <div onClick={() => router.push("/u/gifts")} className='flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-50'>
            <div className='flex items-center gap-3'>
              <Gift size={20} />
              <span className='text-gray-800'>Gifts</span>
            </div>
            <ChevronRight className='text-[#8A8A8A]' size={22} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyActivity;
